"""
server.py - Zero-Dependency Core HTTP Server (Master System Directive Engine 1)

Built entirely on Python 3 Standard Library:
- http.server, urllib.parse, json, datetime, sqlite3
- Zero external runtime dependencies required for instant startup on any workstation,
  offline container, or serverless host.
- Integrated with db.py (Dual-database abstraction: SQLite local & PostgreSQL production).
- Implements endpoints for Scenario #11 (WhatsApp Alerts) and Scenario #12 (Ledger Statements).
"""

import os
import sys
import json
import urllib.parse
import urllib.request
import urllib.error
import datetime
from http.server import HTTPServer, BaseHTTPRequestHandler
from socketserver import ThreadingMixIn

# Import our database engine
from db import db, round_2dp, generate_doc_id, SafeJSONEncoder


class ThreadedHTTPServer(ThreadingMixIn, HTTPServer):
    """Multi-threaded HTTP server handling concurrent requests with low latency."""
    daemon_threads = True


class JSRRequestHandler(BaseHTTPRequestHandler):
    """Stateless RESTful JSON Request Handler for JSR Retail Sales."""

    def _send_json(self, status_code, data):
        """Sends a standardized JSON response with CORS headers."""
        response_bytes = json.dumps(data, cls=SafeJSONEncoder).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(response_bytes)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()
        self.wfile.write(response_bytes)

    def _read_body_json(self):
        """Safely reads and decodes the JSON request body."""
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            if content_length > 0:
                raw_data = self.rfile.read(content_length).decode("utf-8")
                return json.loads(raw_data)
        except Exception as e:
            print(f"Error parsing request JSON: {e}", file=sys.stderr)
        return {}

    def do_OPTIONS(self):
        """Handles CORS pre-flight requests."""
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.end_headers()

    def do_GET(self):
        """Processes GET API requests."""
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        # 1. Health & Architecture Stats
        if path == "/api/health":
            return self._send_json(200, {
                "status": "healthy",
                "engine": "Engine 1 (Zero-Dependency Python HTTP Server)",
                "database": "PostgreSQL 16" if db.is_postgres else "SQLite3",
                "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
                "invariants": "Master System Directive (15 Universal Pitfalls Enforced)"
            })

        # 2. Scenario #11 Alert Settings
        elif path == "/api/alerts/settings":
            settings = db.get_alert_settings()
            history = db.get_alert_history(500)
            return self._send_json(200, {
                "success": True,
                "settings": settings,
                "history": history
            })

        # 3. Scenario #11 Alert History
        elif path == "/api/alerts/history":
            limit = int(query.get("limit", ["500"])[0])
            history = db.get_alert_history(limit)
            return self._send_json(200, {
                "success": True,
                "history": history
            })

        # 4. Scenario #12 Running Ledger Statement Generator
        elif path == "/api/reports/ledger":
            party_type = query.get("party_type", ["Customer"])[0]
            party_name = query.get("party_name", [""])[0]
            start_date = query.get("start_date", [None])[0]
            end_date = query.get("end_date", [None])[0]

            if not party_name:
                return self._send_json(400, {
                    "success": False,
                    "error": "party_name parameter is required"
                })

            report = db.get_ledger_statement(party_type, party_name, start_date, end_date)
            return self._send_json(200, {
                "success": True,
                "report": report
            })

        # 5. Master Entities (Customers, Suppliers, Partners)
        elif path == "/api/customers":
            conn = db.get_connection()
            cur = db.get_cursor(conn)
            cur.execute("SELECT id, name, mobile, old_due FROM customers ORDER BY name ASC;")
            customers = cur.fetchall()
            cur.close()
            conn.close()
            return self._send_json(200, {"success": True, "customers": customers})

        elif path == "/api/suppliers":
            conn = db.get_connection()
            cur = db.get_cursor(conn)
            cur.execute("SELECT id, name, mobile, old_due FROM suppliers ORDER BY name ASC;")
            suppliers = cur.fetchall()
            cur.close()
            conn.close()
            return self._send_json(200, {"success": True, "suppliers": suppliers})

        elif path == "/api/partners":
            conn = db.get_connection()
            cur = db.get_cursor(conn)
            cur.execute("SELECT id, name, mobile, share_percent, capital_balance FROM partners ORDER BY name ASC;")
            partners = cur.fetchall()
            cur.close()
            conn.close()
            return self._send_json(200, {"success": True, "partners": partners})

        else:
            return self._send_json(404, {"error": "Not Found", "path": path})

    def do_POST(self):
        """Processes POST API requests."""
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body = self._read_body_json()

        # 1. Scenario #11 Save Alert Settings
        if path == "/api/alerts/settings":
            settings = body.get("settings")
            history = body.get("history") or body.get("alertHistory")

            if settings:
                db.save_alert_settings(settings)
            if history:
                db.save_alert_history_logs(history)

            return self._send_json(200, {
                "success": True,
                "message": "Alert configuration persisted successfully to database"
            })

        # 2. Scenario #11 Send Alert Dispatch & Genuine Status Evaluation
        elif path == "/api/alerts/send":
            recipients = body.get("recipients", [])
            message = body.get("message", "")
            alert_type = body.get("alertType", "Daily Summary")
            display_dt = body.get("displayDateTime", datetime.datetime.now().strftime("%d-%b-%Y %I:%M %p"))

            wa_token = os.getenv("WHATSAPP_API_TOKEN")
            wa_phone_id = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
            is_cloud_api_active = bool(wa_token and wa_phone_id)

            results = []

            for rec in recipients:
                log_id = f"alt_{int(datetime.datetime.now().timestamp()*1000)}_{os.urandom(2).hex()}"
                mobile = str(rec.get("mobile", "")).strip()
                clean_mobile = rec.get("cleanMobile") or "".join([c for c in mobile if c.isdigit()])
                rec_name = rec.get("name") or rec.get("recipient") or "Recipient"

                if rec.get("status") == "Disabled" or not rec.get("enabled", True):
                    results.append({
                        "id": log_id,
                        "recipientId": rec.get("id"),
                        "recipient": rec_name,
                        "name": rec_name,
                        "recipientMobile": mobile,
                        "mobile": mobile,
                        "alertType": alert_type,
                        "status": "Disabled",
                        "messageId": "—",
                        "apiResponse": rec.get("reason") or "Recipient alert is toggled OFF in Settings",
                        "displayDateTime": display_dt
                    })
                    continue

                if not clean_mobile or len(clean_mobile) < 10:
                    results.append({
                        "id": log_id,
                        "recipientId": rec.get("id"),
                        "recipient": rec_name,
                        "name": rec_name,
                        "recipientMobile": mobile,
                        "mobile": mobile,
                        "alertType": alert_type,
                        "status": "Failed",
                        "messageId": "—",
                        "apiResponse": "Invalid recipient – mobile number must contain at least 10 digits",
                        "displayDateTime": display_dt
                    })
                    continue

                formatted_to = f"91{clean_mobile}" if len(clean_mobile) == 10 else clean_mobile

                # If WhatsApp Cloud API is configured
                if is_cloud_api_active:
                    try:
                        fb_url = f"https://graph.facebook.com/v20.0/{wa_phone_id}/messages"
                        req_data = json.dumps({
                            "messaging_product": "whatsapp",
                            "recipient_type": "individual",
                            "to": formatted_to,
                            "type": "text",
                            "text": {"body": message}
                        }).encode("utf-8")
                        req = urllib.request.Request(fb_url, data=req_data, headers={
                            "Authorization": f"Bearer {wa_token}",
                            "Content-Type": "application/json"
                        })
                        with urllib.request.urlopen(req, timeout=10) as res:
                            res_data = json.loads(res.read().decode())
                            msg_id = (res_data.get("messages", [{}])[0].get("id")) or f"wamid.{int(datetime.datetime.now().timestamp())}"
                            results.append({
                                "id": log_id,
                                "recipientId": rec.get("id"),
                                "recipient": rec_name,
                                "name": rec_name,
                                "recipientMobile": mobile,
                                "mobile": mobile,
                                "alertType": alert_type,
                                "status": "Sent",
                                "messageId": msg_id,
                                "apiResponse": "Accepted (Meta WhatsApp API)",
                                "displayDateTime": display_dt
                            })
                    except urllib.error.HTTPError as he:
                        try:
                            err_body = json.loads(he.read().decode())
                            err_msg = err_body.get("error", {}).get("message", "Rejected by WhatsApp API")
                        except Exception:
                            err_msg = str(he)
                        results.append({
                            "id": log_id,
                            "recipientId": rec.get("id"),
                            "recipient": rec_name,
                            "name": rec_name,
                            "recipientMobile": mobile,
                            "mobile": mobile,
                            "alertType": alert_type,
                            "status": "Failed",
                            "messageId": "—",
                            "apiResponse": f"Failed – {err_msg}",
                            "displayDateTime": display_dt
                        })
                    except Exception as ex:
                        results.append({
                            "id": log_id,
                            "recipientId": rec.get("id"),
                            "recipient": rec_name,
                            "name": rec_name,
                            "recipientMobile": mobile,
                            "mobile": mobile,
                            "alertType": alert_type,
                            "status": "Failed",
                            "messageId": "—",
                            "apiResponse": f"Failed – WhatsApp service did not respond ({str(ex)})",
                            "displayDateTime": display_dt
                        })
                else:
                    # Fallback when Cloud API token is not yet configured:
                    # Truthful status: Ready for manual dispatch via WhatsApp Web (not fake 'Sent')
                    results.append({
                        "id": log_id,
                        "recipientId": rec.get("id"),
                        "recipient": rec_name,
                        "name": rec_name,
                        "recipientMobile": mobile,
                        "mobile": mobile,
                        "alertType": alert_type,
                        "status": "Ready",
                        "messageId": f"WA-WEB-{generate_doc_id('REF')[:15]}",
                        "apiResponse": "Ready for manual dispatch via WhatsApp Web (Cloud API credentials not set in env)",
                        "displayDateTime": display_dt
                    })

            # Save genuine dispatch logs to database
            db.save_alert_history_logs(results)

            return self._send_json(200, {
                "success": True,
                "results": results,
                "cloudApiActive": is_cloud_api_active
            })

        # 3. Clear Alert History
        elif path == "/api/alerts/history/clear":
            db.clear_alert_history()
            return self._send_json(200, {"success": True, "message": "Alert history cleared"})

        else:
            return self._send_json(404, {"error": "Not Found", "path": path})


def run_server(port=8000, host="0.0.0.0"):
    """Starts the zero-dependency Core HTTP Server."""
    server_address = (host, port)
    httpd = ThreadedHTTPServer(server_address, JSRRequestHandler)
    print(f"================================================================")
    print(f" JSR Retail Sales - Zero-Dependency Core HTTP Server (Engine 1)")
    print(f" Master System Directive: Production-Grade Application Engineering")
    print(f" Active Database: {'PostgreSQL 16' if db.is_postgres else 'SQLite3'}")
    print(f" Listening on: http://{host}:{port}")
    print(f" Health Check: http://localhost:{port}/api/health")
    print(f"================================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer shutting down gracefully.")
        httpd.server_close()


if __name__ == "__main__":
    port_arg = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    run_server(port=port_arg)
