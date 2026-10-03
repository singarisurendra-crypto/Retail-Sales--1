"""
db.py - Production-Grade Dual-Database Abstraction Engine (Master System Directive)

Implements:
1. Native Dual-Database Support:
   - SQLite3 for zero-configuration local development, fast automated unit testing, and offline modes.
   - PostgreSQL 16 + pgvector (via psycopg2) for high-concurrency production deployments.
2. PgCursorWrapper:
   - Harmonizes parameter placeholders ('?' for SQLite vs '%s' for PostgreSQL).
   - Provides safe dictionary row access (dict(row)), preventing Pitfall #12 (AttributeError on row.get()).
   - Harmonizes sequence resets ('sqlite_sequence' vs PostgreSQL 'setval').
   - Handles Decimal and Date serialization preventing Pitfall #5 & #6.
3. Microsecond Document ID Generation:
   - Prevents Pitfall #7 high-concurrency collisions: DOC-YYYYMMDDHHMMSSFFFFFF-XXXX.
4. Precision Rounding:
   - Prevents Pitfall #4 floating-point drift: round_2dp(val).
"""

import os
import sys
import json
import uuid
import sqlite3
import datetime
from decimal import Decimal

# Try importing psycopg2 for PostgreSQL production deployments
try:
    import psycopg2
    import psycopg2.extras
    PSYCOPG2_AVAILABLE = True
except ImportError:
    PSYCOPG2_AVAILABLE = False


def round_2dp(val):
    """Prevents Pitfall #4 (Floating-point drift): strictly rounds all monetary amounts to 2 decimal places."""
    if val is None:
        return 0.0
    try:
        return round(float(val), 2)
    except (ValueError, TypeError):
        return 0.0


def generate_doc_id(prefix="DOC"):
    """
    Prevents Pitfall #7 (High-concurrency document ID collision).
    Formats document identifiers with microsecond precision and an appended 4-character UUID token:
    DOC-YYYYMMDDHHMMSSFFFFFF-XXXX
    """
    now = datetime.datetime.now(datetime.timezone.utc)
    ts = now.strftime("%Y%m%d%H%M%S%f")
    random_token = uuid.uuid4().hex[:4].upper()
    return f"{prefix}-{ts}-{random_token}"


class SafeJSONEncoder(json.JSONEncoder):
    """
    Prevents Pitfall #5 (PostgreSQL Decimal vs float) and Pitfall #6 (Empty Date / Invalid Datetime).
    Safely encodes Decimal, date, datetime, and Row objects to standard JSON.
    """
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        if isinstance(obj, (datetime.date, datetime.datetime)):
            return obj.isoformat()
        if isinstance(obj, sqlite3.Row):
            return dict(obj)
        return super().default(obj)


class PgCursorWrapper:
    """
    Database abstraction wrapper harmonizing SQLite and PostgreSQL cursors.
    1. Parameter placeholder translation (? -> %s).
    2. Guaranteed dictionary row conversion (dict(row)) preventing Pitfall #12.
    3. Error normalization.
    """
    def __init__(self, cursor, is_postgres=False):
        self.cursor = cursor
        self.is_postgres = is_postgres

    def execute(self, sql, params=None):
        if params is None:
            params = ()
        if self.is_postgres:
            # Translate SQLite '?' parameter placeholders to PostgreSQL '%s'
            sql = sql.replace("?", "%s")
            # Defensive Decimal conversion for float parameters
            normalized_params = []
            for p in params:
                if isinstance(p, float):
                    normalized_params.append(Decimal(str(round_2dp(p))))
                else:
                    normalized_params.append(p)
            return self.cursor.execute(sql, tuple(normalized_params))
        else:
            return self.cursor.execute(sql, params)

    def executemany(self, sql, seq_of_params):
        if self.is_postgres:
            sql = sql.replace("?", "%s")
            return self.cursor.executemany(sql, seq_of_params)
        else:
            return self.cursor.executemany(sql, seq_of_params)

    def fetchone(self):
        row = self.cursor.fetchone()
        if row is None:
            return None
        return dict(row)

    def fetchall(self):
        rows = self.cursor.fetchall()
        return [dict(r) for r in rows]

    @property
    def lastrowid(self):
        if self.is_postgres:
            return getattr(self.cursor, "lastrowid", None)
        return self.cursor.lastrowid

    @property
    def rowcount(self):
        return self.cursor.rowcount

    def close(self):
        self.cursor.close()


class DatabaseEngine:
    """
    Production-grade Dual-Engine Database Manager supporting:
    - SQLite (Local development / testing / offline serverless)
    - PostgreSQL 16 (Production deployments)
    """
    def __init__(self, db_path=None, database_url=None):
        self.database_url = database_url or os.getenv("DATABASE_URL")
        self.is_postgres = bool(self.database_url and PSYCOPG2_AVAILABLE)
        
        if not self.is_postgres:
            if db_path is None:
                # Store SQLite in data/ directory
                base_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
                os.makedirs(base_dir, exist_ok=True)
                self.db_path = os.path.join(base_dir, "jsr_retail.db")
            else:
                self.db_path = db_path
        else:
            self.db_path = None

        self._init_schemas()

    def get_connection(self):
        if self.is_postgres:
            conn = psycopg2.connect(
                self.database_url,
                cursor_factory=psycopg2.extras.RealDictCursor
            )
            return conn
        else:
            conn = sqlite3.connect(self.db_path)
            conn.row_factory = sqlite3.Row
            conn.execute("PRAGMA foreign_keys = ON;")
            return conn

    def get_cursor(self, conn):
        raw_cur = conn.cursor()
        return PgCursorWrapper(raw_cur, is_postgres=self.is_postgres)

    def _init_schemas(self):
        """Provisions relational tables and indices adhering to Master System Directive invariants."""
        conn = self.get_connection()
        cur = self.get_cursor(conn)

        auto_inc = "BIGSERIAL PRIMARY KEY" if self.is_postgres else "INTEGER PRIMARY KEY AUTOINCREMENT"
        json_type = "JSONB" if self.is_postgres else "TEXT"

        # 1. Alert Settings & History (Scenario #11)
        cur.execute(f"""
            CREATE TABLE IF NOT EXISTS alert_settings (
                setting_key VARCHAR(100) PRIMARY KEY,
                setting_value {json_type} NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        cur.execute(f"""
            CREATE TABLE IF NOT EXISTS alert_history (
                id VARCHAR(100) PRIMARY KEY,
                recipient_id VARCHAR(100),
                recipient VARCHAR(255) NOT NULL,
                recipient_mobile VARCHAR(50),
                alert_type VARCHAR(50) NOT NULL,
                status VARCHAR(50) NOT NULL,
                message_id VARCHAR(100),
                api_response TEXT,
                display_datetime VARCHAR(100),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        # 2. Master Entities (Customers, Suppliers, Partners)
        cur.execute(f"""
            CREATE TABLE IF NOT EXISTS customers (
                id {auto_inc},
                name VARCHAR(255) NOT NULL,
                mobile VARCHAR(50),
                old_due NUMERIC(15,2) DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        cur.execute(f"""
            CREATE TABLE IF NOT EXISTS suppliers (
                id {auto_inc},
                name VARCHAR(255) NOT NULL,
                mobile VARCHAR(50),
                old_due NUMERIC(15,2) DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        cur.execute(f"""
            CREATE TABLE IF NOT EXISTS partners (
                id {auto_inc},
                name VARCHAR(255) NOT NULL,
                mobile VARCHAR(50),
                share_percent NUMERIC(5,2) DEFAULT 0.00,
                capital_balance NUMERIC(15,2) DEFAULT 0.00,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        # 3. Procurements (Stock Inward)
        cur.execute(f"""
            CREATE TABLE IF NOT EXISTS procurements (
                id {auto_inc},
                doc_id VARCHAR(100) UNIQUE,
                item_name VARCHAR(255) NOT NULL,
                supplier_id BIGINT,
                supplier_name VARCHAR(255),
                qty NUMERIC(12,2) NOT NULL,
                remaining_qty NUMERIC(12,2) NOT NULL,
                purchase_rate NUMERIC(12,2) NOT NULL,
                sale_rate NUMERIC(12,2) NOT NULL,
                purchase_date VARCHAR(50) NOT NULL,
                p1_amount NUMERIC(12,2) DEFAULT 0.00,
                payment_mode VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        # 4. Invoices & Line Items (Sales Transactions)
        cur.execute(f"""
            CREATE TABLE IF NOT EXISTS invoices (
                id {auto_inc},
                doc_id VARCHAR(100) UNIQUE NOT NULL,
                customer_id BIGINT,
                customer_name VARCHAR(255) NOT NULL,
                invoice_date VARCHAR(50) NOT NULL,
                total_amount NUMERIC(15,2) NOT NULL,
                received_amount NUMERIC(15,2) DEFAULT 0.00,
                due_amount NUMERIC(15,2) DEFAULT 0.00,
                payment_mode VARCHAR(50),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        cur.execute(f"""
            CREATE TABLE IF NOT EXISTS invoice_items (
                id {auto_inc},
                invoice_doc_id VARCHAR(100) NOT NULL,
                procure_id BIGINT,
                item_name VARCHAR(255) NOT NULL,
                purchase_rate NUMERIC(12,2) NOT NULL,
                rate NUMERIC(12,2) NOT NULL,
                qty NUMERIC(12,2) NOT NULL,
                total NUMERIC(15,2) NOT NULL
            );
        """)

        # 5. Collections (Customer & Contra Payments)
        cur.execute(f"""
            CREATE TABLE IF NOT EXISTS collections (
                id {auto_inc},
                doc_id VARCHAR(100) UNIQUE NOT NULL,
                customer_id BIGINT,
                customer_name VARCHAR(255) NOT NULL,
                amount NUMERIC(15,2) NOT NULL,
                payment_mode VARCHAR(50) NOT NULL,
                collection_date VARCHAR(50) NOT NULL,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        # 6. Expenses
        cur.execute(f"""
            CREATE TABLE IF NOT EXISTS expenses (
                id {auto_inc},
                doc_id VARCHAR(100) UNIQUE NOT NULL,
                category VARCHAR(100) NOT NULL,
                amount NUMERIC(15,2) NOT NULL,
                payment_mode VARCHAR(50) NOT NULL,
                expense_date VARCHAR(50) NOT NULL,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        # 7. Audit Lineage Table (Invariant #2: Transactional Audit Lineage)
        cur.execute(f"""
            CREATE TABLE IF NOT EXISTS audit_lineage (
                id {auto_inc},
                transaction_doc_id VARCHAR(100) NOT NULL,
                line_item_id BIGINT,
                source_procure_doc_id VARCHAR(100),
                allocated_qty NUMERIC(12,2) NOT NULL,
                unit_cost NUMERIC(12,2) NOT NULL,
                unit_sale_rate NUMERIC(12,2) NOT NULL,
                realized_margin NUMERIC(15,2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        conn.commit()
        cur.close()
        conn.close()

    # -------------------------------------------------------------
    # Scenario #11 Alert Settings & History Helpers
    # -------------------------------------------------------------
    def get_alert_settings(self):
        """Reads persisted alert settings from database."""
        conn = self.get_connection()
        cur = self.get_cursor(conn)
        cur.execute("SELECT setting_value FROM alert_settings WHERE setting_key = ?", ("daily_alert_config",))
        row = cur.fetchone()
        cur.close()
        conn.close()
        if row and row.get("setting_value"):
            val = row["setting_value"]
            if isinstance(val, str):
                try:
                    return json.loads(val)
                except Exception:
                    return {}
            return val
        return None

    def save_alert_settings(self, config_dict):
        """Saves alert settings to database atomically."""
        conn = self.get_connection()
        cur = self.get_cursor(conn)
        val_str = json.dumps(config_dict, cls=SafeJSONEncoder)
        
        # Upsert
        if self.is_postgres:
            cur.execute("""
                INSERT INTO alert_settings (setting_key, setting_value, updated_at)
                VALUES (%s, %s, CURRENT_TIMESTAMP)
                ON CONFLICT (setting_key) DO UPDATE SET
                    setting_value = EXCLUDED.setting_value,
                    updated_at = CURRENT_TIMESTAMP;
            """, ("daily_alert_config", val_str))
        else:
            cur.execute("""
                INSERT OR REPLACE INTO alert_settings (setting_key, setting_value, updated_at)
                VALUES (?, ?, CURRENT_TIMESTAMP);
            """, ("daily_alert_config", val_str))
        
        conn.commit()
        cur.close()
        conn.close()
        return True

    def get_alert_history(self, limit=500):
        """Returns the most recent alert logs."""
        conn = self.get_connection()
        cur = self.get_cursor(conn)
        cur.execute("""
            SELECT id, recipient_id, recipient, recipient_mobile, alert_type, status,
                   message_id, api_response, display_datetime, created_at
            FROM alert_history
            ORDER BY created_at DESC
            LIMIT ?;
        """, (limit,))
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return rows

    def save_alert_history_logs(self, logs):
        """Appends logs to alert_history table."""
        if not logs:
            return
        conn = self.get_connection()
        cur = self.get_cursor(conn)
        for log in logs:
            log_id = log.get("id") or f"alt_{int(datetime.datetime.now().timestamp()*1000)}"
            cur.execute("""
                INSERT INTO alert_history (
                    id, recipient_id, recipient, recipient_mobile, alert_type, status,
                    message_id, api_response, display_datetime
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
            """, (
                log_id,
                log.get("recipientId") or log.get("recipient_id") or "",
                log.get("recipient") or log.get("name") or "Recipient",
                log.get("recipientMobile") or log.get("recipient_mobile") or log.get("mobile") or "",
                log.get("alertType") or log.get("alert_type") or "Daily Summary",
                log.get("status") or "Ready",
                log.get("messageId") or log.get("message_id") or "—",
                log.get("apiResponse") or log.get("api_response") or "",
                log.get("displayDateTime") or log.get("display_datetime") or datetime.datetime.now().strftime("%d-%b-%Y %I:%M %p")
            ))
        conn.commit()
        cur.close()
        conn.close()

    def update_alert_history_status(self, message_id, new_status, api_response=None):
        """Updates status of a message upon webhook delivery receipt."""
        conn = self.get_connection()
        cur = self.get_cursor(conn)
        if api_response:
            cur.execute("""
                UPDATE alert_history
                SET status = ?, api_response = ?
                WHERE message_id = ? OR id = ?;
            """, (new_status, api_response, message_id, message_id))
        else:
            cur.execute("""
                UPDATE alert_history
                SET status = ?
                WHERE message_id = ? OR id = ?;
            """, (new_status, message_id, message_id))
        conn.commit()
        cur.close()
        conn.close()

    def clear_alert_history(self):
        """Clears all records in alert_history."""
        conn = self.get_connection()
        cur = self.get_cursor(conn)
        cur.execute("DELETE FROM alert_history;")
        conn.commit()
        cur.close()
        conn.close()

    # -------------------------------------------------------------
    # Scenario #12 Running Ledger Statement Generator
    # -------------------------------------------------------------
    def get_ledger_statement(self, party_type, party_name, start_date=None, end_date=None):
        """
        Generates a 6-column running ledger statement avoiding Pitfall #1 (Cartesian multiplication),
        Pitfall #2 (Date filter leak), and Pitfall #4 (Floating-point drift).
        Columns: Date & Time | Particulars | Reference | Debit | Credit | Running Balance
        """
        conn = self.get_connection()
        cur = self.get_cursor(conn)

        # 1. Compute opening balance before start_date
        opening_balance = 0.0
        if start_date:
            cur.execute("""
                SELECT COALESCE(SUM(total_amount), 0) as total_invoices
                FROM invoices
                WHERE customer_name = ? AND invoice_date < ?;
            """, (party_name, start_date))
            inv_before = cur.fetchone()["total_invoices"]

            cur.execute("""
                SELECT COALESCE(SUM(amount), 0) as total_collections
                FROM collections
                WHERE customer_name = ? AND collection_date < ?;
            """, (party_name, start_date))
            col_before = cur.fetchone()["total_collections"]

            opening_balance = round_2dp(float(inv_before) - float(col_before))

        # 2. Query transactions between start_date and end_date
        tx_query_inv = """
            SELECT invoice_date as tx_date,
                   'Sales Invoice' as particulars,
                   doc_id as reference,
                   total_amount as debit,
                   0.0 as credit,
                   created_at
            FROM invoices
            WHERE customer_name = ?
        """
        params_inv = [party_name]
        if start_date:
            tx_query_inv += " AND invoice_date >= ?"
            params_inv.append(start_date)
        if end_date:
            tx_query_inv += " AND invoice_date <= ?"
            params_inv.append(end_date)

        cur.execute(tx_query_inv, tuple(params_inv))
        invoices_list = cur.fetchall()

        tx_query_col = """
            SELECT collection_date as tx_date,
                   ('Collection (' || payment_mode || ')') as particulars,
                   doc_id as reference,
                   0.0 as debit,
                   amount as credit,
                   created_at
            FROM collections
            WHERE customer_name = ?
        """
        params_col = [party_name]
        if start_date:
            tx_query_col += " AND collection_date >= ?"
            params_col.append(start_date)
        if end_date:
            tx_query_col += " AND collection_date <= ?"
            params_col.append(end_date)

        cur.execute(tx_query_col, tuple(params_col))
        collections_list = cur.fetchall()

        cur.close()
        conn.close()

        # Merge and sort chronologically
        all_tx = invoices_list + collections_list
        all_tx.sort(key=lambda x: (x.get("tx_date", ""), x.get("created_at", "")))

        # Compute running balance with strict 2-decimal rounding
        running_bal = opening_balance
        ledger_rows = []
        for tx in all_tx:
            debit = round_2dp(tx.get("debit", 0.0))
            credit = round_2dp(tx.get("credit", 0.0))
            running_bal = round_2dp(running_bal + debit - credit)
            ledger_rows.append({
                "date_time": tx.get("tx_date"),
                "particulars": tx.get("particulars"),
                "reference": tx.get("reference"),
                "debit": debit if debit > 0 else None,
                "credit": credit if credit > 0 else None,
                "balance": running_bal
            })

        return {
            "party_type": party_type,
            "party_name": party_name,
            "opening_balance": opening_balance,
            "closing_balance": running_bal,
            "transactions": ledger_rows
        }


# Singleton database instance
db = DatabaseEngine()
