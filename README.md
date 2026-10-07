# JSR Retails & Sales Management System — Comprehensive System Manual

**Version:** 2.4.0 (Indian Number Format & Full System Documentation Release)  
**Last Updated:** October 2026  
**Target Environment:** Next.js 14 / React 18 / Tailwind CSS / Supabase PostgreSQL / Vercel  

---

## Table of Contents
1. [System Overview & Architecture](#1-system-overview--architecture)
2. [User Roles & Access Control](#2-user-roles--access-control)
3. [Authentication & Security](#3-authentication--security)
4. [Core Business Modules & Workflows](#4-core-business-modules--workflows)
   - [4.1 POS Billing & Cash Register](#41-pos-billing--cash-register)
   - [4.2 Invoices & Receipts Management](#42-invoices--receipts-management)
   - [4.3 Purchases & Inventory Management](#43-purchases--inventory-management)
   - [4.4 Low Stock Alert & 1-Click Reorder Hub](#44-low-stock-alert--1-click-reorder-hub)
   - [4.5 Payments & Collections (Party Ledgers)](#45-payments--collections-party-ledgers)
   - [4.6 Customer Credit Limit Control & Admin Override](#46-customer-credit-limit-control--admin-override)
   - [4.7 Automated WhatsApp Payment Reminders](#47-automated-whatsapp-payment-reminders)
   - [4.8 Day-End Cash Register Reconciliation (Z-Report)](#48-day-end-cash-register-reconciliation-z-report)
   - [4.9 Business Snapshot & Partner Capital Accounting](#49-business-snapshot--partner-capital-accounting)
   - [4.10 Business Loans & Lender Debt Management](#410-business-loans--lender-debt-management)
   - [4.11 Customer & Supplier Self-Service Portal](#411-customer--supplier-self-service-portal)
   - [4.12 Consolidated Party Statement & Contra Settle](#412-consolidated-party-statement--contra-settle)
   - [4.13 System Settings & Cloud Synchronization](#413-system-settings--cloud-synchronization)
   - [4.14 Indian Number Format (`en-IN`) Comma Separation](#414-indian-number-format-en-in-comma-separation)
5. [Database Schema & Data Model](#5-database-schema--data-model)
6. [Audit Trails & Data Integrity Invariants](#6-audit-trails--data-integrity-invariants)
7. [Deployment, Build & Environment Configuration](#7-deployment-build--environment-configuration)
8. [Changelog & Maintenance Protocol](#8-changelog--maintenance-protocol)

---

## 1. System Overview & Architecture

The **JSR Retails & Sales Management System** is an enterprise-grade retail Point of Sale (POS), Inventory Control, Multi-Party Ledger Accounting, and Day-End Cash Reconciliation platform designed specifically for high-speed retail operations in India.

### Architectural Highlights:
- **Frontend Framework:** Next.js (App Router) with single-page high-speed reactive UI in React 18.
- **Styling & Responsiveness:** Tailwind CSS with comprehensive dark/light mode and fully responsive desktop/tablet/mobile layouts with non-wrapping horizontal table scrolling.
- **Backend / Database:** Supabase PostgreSQL with real-time WebSocket broadcast sync (`sync_settings`, party updates).
- **Offline / Transient State Protection:** Session isolation, persistent cloud settings stored in PostgreSQL with fallback to localStorage.
- **Thermal Printing Engine:** Dual 58mm and 80mm ESC/POS compliant receipt printing for POS invoices and Day-End Z-Reports.
- **Localized Standards:** Native Indian numbering system formatting (`1,00,000.00`), Telugu bilingual labels (`బిల్లింగ్`, `వసూళ్లు`, `ఖాతా`), and WhatsApp Cloud API notification integration.

---

## 2. User Roles & Access Control

The platform provides a fine-grained Role-Based Access Control (RBAC) model:

| Role Name | Access Level | Description |
|:---|:---|:---|
| **Admin** | Full System Access | Complete access to POS, Invoices, Procurements, Accounting, Lenders, Partner Capitals, Master Settings, 2FA credentials, and system audit logs. |
| **Partner** | Management Access | Full access to business operations, partner capital drawdowns, financial snapshots, and daily approvals. |
| **Staff / Cashier** | Operational Access | Dedicated access to POS Billing, Invoice search, basic collections, and daily receipts without access to master profit margins or system secrets. |
| **Customer Portal** | Self-Service | Customer view restricted to personal invoices, receipts, payment history, outstanding balance, and statement downloads. |
| **Supplier Portal** | Self-Service | Vendor view restricted to purchase orders, payment receipts, outstanding balances, and supply history. |
| **Dual Portal** | Combined Self-Service | For parties that act as both customer and supplier (contra accounts), allowing unified balance and ledger access. |

---

## 3. Authentication & Security

1. **Dual-Mode Login Screen:**
   - **Staff & Admin Mode:** PIN-based authentication with optional 2FA TOTP Authenticator verification.
   - **Customer & Supplier Portal Mode:** Quick phone number login with OTP/PIN authorization.
   - **Split Screen Layout:** 75% modern hero banner showcasing key system capabilities, 25% clean interactive authentication form.
2. **Two-Factor Authentication (2FA TOTP):**
   - Time-based One-Time Password verification (RFC 6238) using HMAC-SHA1.
   - Cloud-persisted 2FA secret with real-time TOTP generation and backup bypass codes for emergency administration.
3. **Session State Isolation:**
   - Automatic logout and session memory clearance on idle or manual exit.
   - PIN verification required for switching between administrative tabs and party accounts.

---

## 4. Core Business Modules & Workflows

### 4.1 POS Billing & Cash Register
- **Instant Product Search & Barcode Entry:** Instant item selection by name or SKU with real-time stock availability display.
- **Multi-Line Cart Management:** Modify quantity, unit rate, and discounts per line item with real-time recalculations.
- **Payment Method Flexibility:** Support for Upfront Cash, UPI, Split Payment, and Advance Balance adjustments.
- **Thermal Receipt Printing:** Instant generation of 58mm and 80mm thermal receipts with store branding, GST details, Telugu translations, and invoice QR codes.

### 4.2 Invoices & Receipts Management
- **Responsive List / All Search Screen:** Searchable by invoice number, customer name, date range, payment status, or payment mode.
- **Horizontal Scrolling & Mobile Optimization:** Column headers and numeric values maintain fixed minimum widths without awkward vertical character-wrapping.
- **Invoice Lifecycle:** Complete ability to view, print, edit, and void invoices with automatic inventory restoration and ledger adjustments.

### 4.3 Purchases & Inventory Management
- **Multi-Line Purchase Orders:** Record incoming stock from vendors with individual cost rates, target selling rates, and quantities.
- **Stock Batch Tracking:** Track batch remaining quantities with FIFO consumption during sales.
- **Supplier Payment Integration:** Track upfront payments made by partners or link to accounts payable for deferred settlement.

### 4.4 Low Stock Alert & 1-Click Reorder Hub
- **Automated Threshold Monitoring:** Real-time badge in top navigation indicating items that have reached or fallen below their reorder level.
- **1-Click Auto Reorder:** Generates an instant purchase order pre-filled with the item's preferred vendor, suggested reorder quantity, and last purchase rate.
- **Configurable Rules:** Set item-specific minimum stock levels and suggested purchase quantities from Settings.

### 4.5 Payments & Collections (Party Ledgers)
- **Customer Collections:** Settle customer dues via Cash or UPI, attributing receipts to specific partners.
- **FIFO Auto-Allocation vs. Specific Bill Settlement:** Automatically apply incoming collections to the oldest outstanding invoices or target a specific invoice.
- **Supplier Bill Payments:** Record disbursements to vendors with real-time debiting of partner cash or UPI accounts.

### 4.6 Customer Credit Limit Control & Admin Override
- **Configurable Credit Caps:** Set maximum allowable credit dues per customer.
- **Real-Time POS Warning & Blocking:** If a new bill pushes customer dues past their credit limit, a clear warning dialog appears and invoice saving is blocked.
- **Admin Override Approved Option:** Authorized staff can enable the override checkbox to proceed with billing for emergency approvals.

### 4.7 Automated WhatsApp Payment Reminders
- **1-Click Notification:** Send instant payment reminder messages to customers with outstanding balances directly via WhatsApp Cloud API.
- **Pre-Configured Message Templates:** Includes customer name, store name, exact balance due, and store UPI payment details.
- **Dynamic Credentials:** Fully configurable from System Settings (Phone Number ID, WABA ID, Access Token).

### 4.8 Day-End Cash Register Reconciliation (Z-Report)
- **Formula Grounded in Truth:**
  $$\text{Expected Cash} = \text{Opening Cash} + \text{Cash Sales} + \text{Cash Collections} - \text{Cash Expenses} - \text{Supplier Cash Paid}$$
- **Physical Drawer Denominations Counter:** Enter counts for ₹500, ₹200, ₹100, ₹50, ₹20, ₹10 notes and loose coins.
- **Discrepancy Analysis:** Instant calculation of **Surplus (+)** or **Shortage (-)** compared to expected drawer balance.
- **80mm Thermal Z-Report Receipt:** Formatted printable receipt summarizing daily turnover, collections, payouts, and cash breakdown.
- **Historical Cloud Log:** Saves day-end reconciliation reports to the cloud database for auditing.

### 4.9 Business Snapshot & Partner Capital Accounting
- **Real-Time Financial Dashboard:** High-level view of Total Sales, Gross Profit, Total Expenses, and Net Operating Margins.
- **Partner Capital Tracking:** Separate tracking of Cash and UPI balances for each partner.
- **Fund Validation:** Prevents negative partner disbursements when recording expenses or supplier payouts.

### 4.10 Business Loans & Lender Debt Management
- **Lender Records:** Track third-party debt sources (gold loans, private finance, NBFCs).
- **Principal vs. Interest Repayment Tracking:** Separate tracking of principal reductions (which reduce outstanding loan balance) and interest expenses (which are accounted as business finance costs).

### 4.11 Customer & Supplier Self-Service Portal
- **Customer View:** Check live outstanding balances, view itemized invoice histories, and download statements.
- **Supplier View:** Review delivered purchase orders, received disbursements, and pending receivables.

### 4.12 Consolidated Party Statement & Contra Settle
- **Unified Ledger:** Combines both sales and purchase interactions for parties that both buy from and sell to the store.
- **Contra Adjustment:** Offsets mutual balances without requiring unnecessary physical cash transfers.

### 4.13 System Settings & Cloud Synchronization
- **Tab 1: General & Store Branding:** Store Name, Tagline, Phone, Address, GSTIN, Invoice Prefix, and sequence numbering.
- **Tab 2: 2FA Security & API Credentials:** WhatsApp Cloud API tokens, Phone ID, WABA ID, and TOTP Secrets.
- **Tab 3: Low Stock & Reorder Rules:** Global and item-specific minimum thresholds and default replenishment quantities.
- **Tab 4: Customer Credit Limits:** Set customer-specific credit caps.
- **Tab 5: Z-Report History & Reconciliation Logs:** Review historical day-end audit reports.
- **Real-Time Multi-Device Sync:** Changes saved on any device immediately sync across all active sessions via Supabase Realtime broadcast.

### 4.14 Indian Number Format (`en-IN`) Comma Separation
- **Standardized Number Grouping:**
  - `1000` $\rightarrow$ `1,000`
  - `10000` $\rightarrow$ `10,000`
  - `100000` $\rightarrow$ `1,00,000`
  - `1000000` $\rightarrow$ `10,00,000`
  - `2500000.50` $\rightarrow$ `25,00,000.50`
- **Cursor-Preserving Input:** Interactive `IndianNumberInput` component maintains cursor positioning during active typing, backspacing, and decimal entry.
- **Zero Calculation Disruption:** All underlying arithmetic, database payloads, and Supabase SQL queries utilize `cleanNum()` to prevent `NaN` and guarantee absolute precision.

---

## 5. Database Schema & Data Model

The database runs on Supabase PostgreSQL with the following core relational entities:

1. **`customers`**: `id`, `name`, `mobile`, `old_due`, `credit_limit`, `created_at`
2. **`suppliers`**: `id`, `name`, `mobile`, `old_due`, `created_at`
3. **`items`**: `id`, `item_name`, `unit_price`, `purchase_rate`, `selling_rate`, `current_stock`, `reorder_level`, `suggested_qty`
4. **`procurements`**: `id`, `purchase_date`, `supplier_name`, `item_name`, `procured_qty`, `remaining_qty`, `purchase_rate`, `selling_rate`, `total_amount`, `p1_id`, `p1_amount`, `p1_mode`, `receiver_2_mode` (PO Number)
5. **`invoices`**: `id`, `invoice_number`, `customer_id`, `customer_name`, `invoice_date`, `total_amount`, `upfront_paid`, `balance_due`, `payment_mode`, `items` (JSONB)
6. **`collections`**: `id`, `invoice_id`, `customer_name`, `amount`, `payment_mode`, `receiver_id`, `date`
7. **`expenses`**: `id`, `title`, `amount`, `payment_mode`, `category`, `receiver_id`, `date`
8. **`receivers`**: `id`, `name`, `opening_cash`, `opening_upi`, `role`, `pin`
9. **`borrowers`**: `id`, `name`, `mobile`, `initial_loan`, `balance_due`
10. **`loan_payments`**: `id`, `borrower_id`, `principal_amount`, `interest_amount`, `payment_mode`, `partner_id`, `date`
11. **`system_settings`**: `id`, `config` (JSONB), `updated_at`
12. **`z_reports`**: `id`, `report_date`, `expected_cash`, `physical_cash`, `difference`, `status`, `denominations` (JSONB), `notes`

---

## 6. Audit Trails & Data Integrity Invariants

- **Invariant #1 (FIFO Consumption):** Sales automatically deduct stock from the earliest available purchase batches.
- **Invariant #2 (Contra Isolation):** Contra adjustments between customer and supplier balances are tracked with clear reconciliation logs.
- **Invariant #3 (Two-Decimal Precision):** All internal currency arithmetic is computed with strict 2-decimal intermediate rounding (`round2`) to eliminate floating-point drift.
- **Invariant #4 (Partner Fund Solvency):** Payouts and expenses are validated against available partner cash/UPI balances.
- **Invariant #5 (Non-Destructive Edits):** Editing past invoices or purchase orders restores original stock before applying adjustments.

---

## 7. Deployment, Build & Environment Configuration

### Required Environment Variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### Build & Deployment Command:
```bash
npm run build
```
Hosted on Vercel with automatic continuous deployment linked to the `main` GitHub branch.

---

## 8. Changelog & Maintenance Protocol

> **Notice:** This `Readme.doc` and `README.md` file is a living manual and is updated synchronously whenever any system feature, bug fix, or configuration update is applied to the codebase.

- **v2.4.0 (Current):** Implemented Indian Number Format (`en-IN`) across all 26 numeric inputs and tables. Created living `Readme.doc` and `README.md` system manual.
- **v2.3.0:** Added Day-End Cash Register Reconciliation (Z-Report), Low Stock Alert & 1-Click Reorder Hub, Customer Credit Limit controls, and 5-Tab Master Settings.
- **v2.2.0:** Added WhatsApp Cloud API 1-click payment reminders and Customer/Supplier Self-Service Portal.
- **v2.1.0:** Enhanced mobile responsiveness across all search and list screens with horizontal scrolling.
- **v2.0.0:** Upgraded authentication with 2FA TOTP security and split-screen desktop visual layout.
