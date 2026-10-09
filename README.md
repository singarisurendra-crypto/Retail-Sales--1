# JSR Retail System — Overall System README
### Functional Requirements, System Architecture, Scenarios & Operational Behaviour
**Living System Manual & Master Specification Document**  
**Version:** 2.5.0 (Full 23-Section Requirements & Architecture Specification)  
**Last Updated:** October 2026  
**Environment:** Next.js 14 (App Router) &bull; React 18 &bull; Tailwind CSS &bull; Supabase PostgreSQL &bull; Vercel CI/CD  

---

## Table of Contents
1. [System Overview](#1-system-overview)
2. [Core Modules](#2-core-modules)
3. [Configuration and Access](#3-configuration-and-access)
   - [3.1 Customer & Supplier PAN/GSTIN](#31-customer--supplier-pangstin)
   - [3.2 Roles and Module Access](#32-roles-and-module-access)
   - [3.3 Partner Images](#33-partner-images)
   - [3.4 System Name](#34-system-name)
4. [Authentication and Security](#4-authentication-and-security)
   - [4.1 Active Session Control](#41-active-session-control)
   - [4.2 Password Change Protocol](#42-password-change-protocol)
   - [4.3 Google Authenticator / 2FA](#43-google-authenticator--2fa)
5. [Login Screen](#5-login-screen)
6. [Customer & Supplier Portal](#6-customer--supplier-portal)
7. [Sales / Invoice & Receipts](#7-sales--invoice--receipts)
8. [Purchase / Supplier Transactions](#8-purchase--supplier-transactions)
9. [Bank, UPI and Reconciliation](#9-bank-upi-and-reconciliation)
   - [9.1 Bank and UPI](#91-bank-and-upi)
   - [9.2 Bank Reconciliation](#92-bank-reconciliation)
10. [Day-End Cash Register / Z-Report](#10-day-end-cash-register--z-report)
11. [Smart Low-Stock and Auto-Reorder](#11-smart-low-stock-and-auto-reorder)
12. [Customer Credit Limit and WhatsApp Reminder](#12-customer-credit-limit-and-whatsapp-reminder)
13. [Settings and Configuration Persistence](#13-settings-and-configuration-persistence)
14. [UI / Responsive Design](#14-ui--responsive-design)
15. [Number Formatting (Indian Comma Separators)](#15-number-formatting-indian-comma-separators)
16. [WhatsApp Business Alerts](#16-whatsapp-business-alerts)
17. [Reports and Analysis](#17-reports-and-analysis)
18. [Pagination](#18-pagination)
19. [ERP / Finance / Payroll](#19-erp--finance--payroll)
20. [Data Integrity Invariants](#20-data-integrity-invariants)
21. [Browser Cache & Deployment Verification](#21-browser-cache--deployment-verification)
22. [Acceptance Criteria](#22-acceptance-criteria)
23. [General Development Principle](#23-general-development-principle)
24. [Database Schema Reference](#24-database-schema-reference)
25. [Changelog & Maintenance Protocol](#25-changelog--maintenance-protocol)

---

## 1. System Overview
The **JSR Retail System** is an enterprise-grade, role-based retail and business management application engineered for high-velocity point-of-sale, inventory tracking, party ledgers, financial accounting, portal access, multi-channel communication, and daily cash reconciliation.

**Core Directive:** Existing working functionality must be strictly preserved unless an explicit requirement dictates an architectural change. All newly introduced configuration options are non-breaking and default to backward-compatible execution when disabled.

---

## 2. Core Modules
The platform is organized into 14 distinct operational modules:
1. **Dashboard and Analysis:** Real-time business turnover, gross profits, expense breakdowns, receivables/payables, and inventory valuation.
2. **POS / Sales / Invoice & Receipts:** Fast multi-line billing, barcode scanning, thermal receipt printing (58mm/80mm), customer dues calculation, and return processing.
3. **Purchase / Purchase Orders / Supplier Payments:** Multi-line procurement entries, batch stock tracking, vendor credit, and disbursement recording.
4. **Payment & Collections:** Customer dues collection, supplier bills payment, partner funding attribution, and FIFO multi-bill auto-settlement.
5. **Customer and Supplier Masters:** Master accounts, phone numbers, opening balances, credit caps, and GSTIN/PAN records.
6. **Partner Management:** Partner capital tracking (Cash vs UPI), profit share, profile images, and access permissions.
7. **Item / Stock Management:** Item SKU catalog, unit costs, selling rates, batch stock tracking, and reorder levels.
8. **Finance and Reconciliation:** Bank ledger maintenance, UPI transaction verification, Cleared vs Un-Cleared status, and Bank Reconciliation Date tracking.
9. **Reports:** Drill-down reporting, audit logs, ledger statements, and data exports.
10. **Settings / Configuration:** 5-tab cloud configuration hub with real-time multi-device broadcast synchronization.
11. **Roles and Module Management:** Screen-level Role-Based Access Control (RBAC) assigning operational boundaries to Admin, Partner, and Staff roles.
12. **Customer & Supplier Portal:** Sandboxed self-service interface for parties to track their bills, receipts, live dues, and statements.
13. **WhatsApp / Business Alerts:** Meta WhatsApp Cloud API integration for 1-click payment reminders and automated business event notifications.
14. **Day-End Cash Register / Z-Report:** Drawer cash auditing, denomination count (₹500 to coins), surplus/shortage detection, and 80mm slip printing.

---

## 3. Configuration and Access

### 3.1 Customer & Supplier PAN/GSTIN
- **Configurable Capture:** Master forms for Customers and Suppliers support optional PAN (Permanent Account Number) and GSTIN (Goods and Services Tax Identification Number) fields.
- **System-Wide Feature Toggle:** The requirement to display and validate PAN/GSTIN can be enabled or disabled globally via System Settings.
- **Backward Compatibility:** When disabled, the system preserves the existing streamlined billing workflow without requiring tax registration numbers.

### 3.2 Roles and Module Access
- **Module Provisioning:** Roles are created, configured, and managed through `Configuration → Roles and Manage Modules`.
- **Screen-Level RBAC:** The Administrator assigns granular module and screen access permissions to each custom role.
- **Strict Role Isolation:** Partners and staff users see only the specific tabs and operational screens assigned to their role.
- **Superuser Access:** Administrators retain unrestricted access to all screens, accounting registers, and cloud configurations.

### 3.3 Partner Images
- **Profile Photo Support:** The Partner Master and Profile screen supports adding, viewing, replacing, and removing partner profile photos.
- **Record Binding:** Images remain linked to the respective Partner record in the database and respect role-based view permissions.

### 3.4 System Name
- **Customizable Branding:** The store/system name (e.g. “B Reddy Sales”) is configurable in System Settings.
- **Ubiquitous Application:** The configured system name updates dynamically throughout the application: navigation header, login screen, POS receipts, tax invoices, statements, and WhatsApp messages.

---

## 4. Authentication and Security

### 4.1 Dual-Tier Authentication Architecture
The system enforces a strict dual-tier credential architecture:
- **Admin & Staff Accounts:** Standard **Username + Security Password** supporting special characters (e.g. `Admin@2026!`, `@`, `#`, `$`, `!`). The login card features a show/hide eye toggle button, left-aligned typography, and backward-compatible acceptance of legacy PIN `1234` or `Admin@123` to prevent administrative lockout.
- **Partner Accounts:** Partner dropdown selector paired with **Partner Security Password** supporting special characters (default: `Partner@2026!` or `1234`).
- **Customer & Supplier Portal:** Strictly **Numeric PIN Only** (`inputMode="numeric"`, `maxLength={6}`, centered dots `••••`, default `1234`). Special characters and text passwords are blocked for portal logins to maintain kiosk/mobile simplicity.
- **1-Click Credential Recovery:** An interactive "Forgot Password? / Recovery" modal displays master security defaults, instructions, and a 1-click fallback reset button.

### 4.2 Active Session Control
- **User-Specific Tracking:** Active session validation is strictly scoped per individual user account.
- **Non-Interfering Concurrency:** A Partner logging into the system will never terminate or interfere with an active Administrator session.
- **Logoff & Continue:** If the same user attempts to log in from a second browser or terminal, the system detects the existing active session and presents a **Logoff & Continue** prompt.
- **Targeted Session Termination:** Confirming "Logoff & Continue" invalidates *only* that specific user's prior session while leaving other active users unaffected.

### 4.3 Password Change Protocol
- **Instant Invalidation:** Immediately upon saving a new password, the old password is permanently invalidated in the database.
- **Security Password Support:** System Settings allows passwords up to 32 characters with special characters for Admin and Partner accounts.
- **Cross-Device Enforcement:** The updated password takes effect instantly across all browsers, mobile devices, and active terminals.
- **Authentication Source:** All login attempts are verified strictly against the latest saved credentials in Supabase.

### 4.4 Google Authenticator (2FA) & Emergency Bypass
- **Disabled by Default:** 2FA defaults to `false` in state and configuration to prevent unintentional lockout during onboarding.
- **Individual TOTP Secrets:** When enabled, each user possesses an independent Google Authenticator secret (`JSRADMINSEC2026`, partner-specific secrets).
- **Strict OTP Isolation:** An OTP generated from the Admin Authenticator profile will not authenticate a Partner account, and vice versa.
- **Emergency Bypass:** The master code `999999` and a prominent "Bypass 2FA" button are provided on the 2FA screen.

---

## 5. Login Screen & Navigation Layout

### 5.1 Login Screen Layout
- **Modern Split-Screen Layout:**
  - **Desktop (Left ~75%):** High-resolution Business Branding Image displaying store identity, address, contact numbers, and tagline.
  - **Desktop (Right ~25%):** Focused Login Panel containing role tabs (Admin, Partner, Portal), username/partner selectors, eye-toggled password fields, and credential recovery.
- **Image Fidelity:** The business image expands to fill full container height without distortion or cropping (`object-cover`).
- **Mobile Responsiveness:** Collapses gracefully into a vertical hero header with a streamlined login card below.

### 5.2 Top Horizontal Navigation Bar (`<header><nav>`)
Prominently features direct navigation buttons for all key ERP modules:
1. `[Menu]` (Drawer toggle)
2. `[Dashboard]` (`summary`)
3. `[POS]` (`sale`)
4. `[Invoice & Receipts]` (`invoices`)
5. `[Purchase & Stock]` (`purchases`)
6. `[Payment & Collections]` (`payments_collections`)
7. `[Banking & BRS]` (`banking`) &bull; *Direct 1-click access*
8. `[HR & Payroll]` (`hr_payroll`) &bull; *Direct 1-click access*
9. `[Vouchers]` (`accounting_vouchers`) &bull; *Direct 1-click access*
10. `[Analysis]` (`analysis`) &bull; *Profit & Sales Analytics*
11. `[Masters]` (`masters`)
12. `[Reports]` (`reports`)
13. `[Settings]` (`settings`) &bull; *Direct 1-click access*

### 5.3 Slide-Out Menu Drawer (`<aside><nav>`)
Organized into logical operational sections:
- **Sales & Billing:** POS Billing (`sale`), Invoices & Receipts (`invoices`)
- **Purchases & Stock:** Purchases & Stock (`purchases`), Payments & Collections (`payments_collections`)
- **Financials & Banking:**
  - `Business Snapshot (Dashboard)` (`summary`)
  - `Bank Accounts & Reconciliation (BRS)` (`banking`)
  - `Accounting Vouchers Hub` (`accounting_vouchers`)
  - `Ledger Statement` (`ledger`)
  - `Transaction Audit Ledger` (`history_audit`)
  - `Business Loans` (`lenders`)
  - `Shop Expenses & Outflow` (`expenses`)
  - `Analysis & Insights` (`analysis`)
  - `B Reddy Excel Sheet (PDF)` (`reports`)
- **Human Resources & Payroll:**
  - `Staff Directory & Salary Slips` (`hr_payroll`)
- **Administration:**
  - `Master Management` (`masters`)
  - `Partner Capital Accounts` (`partners`)
  - `System Settings` (`settings`)

---

## 6. Customer & Supplier Portal
- **Role-Based Sandboxing:** Dedicated self-service portal accessible via customer/supplier registered mobile number and PIN.
- **Customer Portal View:** Customers access only their personal sales invoices, payment collections, receipts, and net outstanding balance.
- **Supplier Portal View:** Suppliers access only their delivered purchase orders, payment disbursements, and pending receivables.
- **Unified Dual-Role Login:** Parties operating concurrently as both customer and supplier log in using a single mobile credential.
- **Consolidated Net Position:**
  $$\text{Net Balance Position} = \text{Customer Due (Receivable)} - \text{Supplier Due (Payable)}$$
  Dual-role users can toggle between Customer Ledger, Supplier Ledger, and a Consolidated Statement showing whether the party owes money or is owed money.
- **Ledger Parity:** Balances shown on the portal mirror the store's primary ledger in real time.

---

## 7. Sales / Invoice & Receipts
- **Interactive Invoice Navigation:** The Invoice ID itself is directly clickable to open/edit the bill; redundant pencil icons are removed.
- **Cancel Edit Placement:** In invoice edit mode, the **Cancel Edit** action is prominently positioned below the Audit Trail section for intuitive navigation.
- **Explicit Collection Creation:** Payment collections are created *only* when an explicit payment receipt is recorded. Editing invoice header metadata never creates phantom collection records or doubles customer debt.
- **Sequential Invoice Numbering:** Invoice sequence numbers increment strictly and predictably; deleted invoice numbers are never reused or reassigned.
- **Customer Integrity on Delete:** Deleting an invoice deletes only that single invoice; other invoices belonging to the same customer are preserved.
- **Differential Stock Adjustment:** Editing an invoice calculates stock changes based *only on the net quantity difference* between the original and updated lines.
- **Stock Depletion Prevention:** If required line item quantity exceeds available batch stock, the system blocks invoice save and prevents negative inventory.
- **Duplicate Line Validation:** When multiple lines feature the same item, the system aggregates their combined quantity before validating against batch inventory.
- **Collection Reference Preservation:** All customer collection reference numbers remain linked and visible during search, edit, and receipt re-printing.
- **FIFO Debt Allocation:** Where configured, incoming customer lump-sum payments auto-allocate across unpaid invoices in First-In, First-Out chronological order.

---

## 8. Purchase / Supplier Transactions
- **Comprehensive PO Lifecycle:** Creating, editing, or deleting purchase order lines accurately updates item inventory counts and supplier accounts payable.
- **PO Line Deletion Invariant:** Deleting a purchase line completely removes the item from the PO, reduces stock count by the line's quantity, and decrements supplier due.
- **Differential PO Updates:** Modifying a purchase bill applies only the difference in quantity or rate, preventing duplicate stock increments.
- **Transaction Segregation:** Supplier payment disbursements remain purely financial transactions and never appear as item catalog entries or purchase line items.
- **Date Preservation on Edit:** Editing a PO preserves the original transaction purchase date; updates are tracked separately via an `updated_at` audit timestamp.
- **Item Master Rate Persistence:** Updating cost or selling rates within a purchase order reliably updates the master item rates when confirmed.
- **Standardized Vendor Naming:** Supplier display names adhere to formatted title case conventions (e.g., *“Karnatam Nagakarthick”*).

---

## 9. Bank, UPI and Reconciliation

### 9.1 Bank and UPI
- **Configurable Bank Accounts:** Support for multiple commercial bank accounts (Bank Name, Account Number, IFSC, Branch).
- **Bank-Wise UPI Toggling:** UPI payment and collection modes are enabled on an individual bank account basis.
- **Dynamic Payment Availability:** When UPI is enabled for a bank, it appears as an active payment channel across billing and collections; when disabled, it is cleanly hidden.

### 9.2 Bank Reconciliation
- **Transaction Audit Queue:** All UPI and digital bank transactions are presented in a dedicated Bank Reconciliation ledger.
- **Verification Status:** Each digital payment supports dual-state auditing:
  - 🟢 **Cleared:** Payment confirmed on official bank statement.
  - 🟡 **Un-Cleared:** Payment recorded in POS but pending bank statement clearance.
- **Bank Reconciliation Date:** Users can enter and update the official Bank Statement Value Date.
- **Reconciliation Reports:** Status and reconciliation dates are permanently stored for audit compliance and financial closing reports.

---

## 10. Day-End Cash Register / Z-Report
- **Rigorous Cash Calculation Formula:**
  $$\text{Expected Cash} = \text{Opening Cash} + \text{Cash Sales} + \text{Cash Collections} - \text{Cash Expenses} - \text{Supplier Cash Paid}$$
- **Full Operational Breakdown:** Displays live daily tallies for Opening Cash, Cash Sales, Cash Collections, Operating Cash Expenses, and Supplier Cash Payments.
- **Physical Denomination Counter:** Cashiers enter exact counts for drawer currency notes:
  - ₹500, ₹200, ₹100, ₹50, ₹20, ₹10, and Loose Coins.
- **Discrepancy Evaluation:**
  $$\text{Variance} = \text{Physical Cash Counted} - \text{Expected Cash}$$
  - **Cash Surplus (+):** Drawer contains more cash than recorded sales.
  - **Cash Shortage (-):** Drawer contains less cash than expected.
  - **Balanced (₹0):** Physical cash matches expected cash to the rupee.
- **Thermal Slip Generation:** Generates a formatted 80mm ESC/POS thermal audit slip for physical drawer sign-off.
- **Cloud Audit Storage:** Closing reports and denomination breakdowns are saved to the cloud database for management review.

---

## 11. Smart Low-Stock and Auto-Reorder
- **Item-Specific Thresholds:** Configure minimum reorder thresholds (`reorder_level`) and suggested replenishment quantities (`suggested_qty`) per catalog item.
- **Dynamic Header Warning:** A real-time warning badge (`⚠️ Low Stock`) pulses in the top navigation when any item falls to or below its threshold.
- **Low Stock Drawer:** Displays a prioritized table showing Item Name, Current Stock, Minimum Reorder Level, Suggested Order Quantity, and Mapped Supplier.
- **1-Click Purchase Reorder:** Clicking **1-Click Reorder** instantly opens the Purchase Order modal pre-filled with the preferred supplier, item name, suggested quantity, and last purchase rate.
- **Automatic Clearance:** The alert badge automatically clears as soon as new stock is procured and received into inventory.

---

## 12. Customer Credit Limit and WhatsApp Reminder
- **Customer Credit Caps:** Establish maximum credit limits per customer in Customer Master or Settings.
- **POS Validation & Warning:** During POS billing, the system computes:
  $$\text{Projected Balance} = \text{Existing Unpaid Due} + \text{New Invoice Credit Amount}$$
  If projected balance exceeds the credit limit, invoice saving is blocked with a clear warning alert.
- **Admin Override Approved:** Authorized cashiers can check **Admin Override Approved** in checkout summary to bypass the block for emergency transactions.
- **1-Click WhatsApp Payment Reminder:** Clicking the WhatsApp action in Customer Master or Statements opens a pre-formatted WhatsApp message:
  - Customer name and greeting
  - Total outstanding balance due
  - Itemized unpaid invoices (Invoice #, Date, Bill Amount, Balance Due)
  - Store UPI ID and one-click payment deep-link (`upi://pay?pa=...`)
- **Reminder Status & Audit:** Logs reminder status (Sent, Delivered, Failed) with exact timestamp for auditing.

---

## 13. Settings and Configuration Persistence
- **Full-Screen Responsive Left Panel Sidebar Menu:** Modern, unified master configuration workspace featuring 10 dedicated operational tabs with clean vertical navigation:
  1. **General & Branding (`branding`):** Business Identity, System Display Name (`systemName`), Sub-heading Tagline, Login Screen Hero Banner with Live Preview, Company Address, Contact Phone, Default UPI ID, PAN & GSTIN Compliance Requirement Toggle, Language Selection (`en` English / `te` Telugu), Accent Theme Palette with interactive live preview banner (Classic Indigo, Farmer Emerald, Ocean Sky, Crimson Rose, Warm Amber), High-Contrast Light / Dark Mode, and Dynamic Typography Font Scaling (Normal 100%, Large 115%, Extra Large 125%).
  2. **Bank Accounts Master (`banking`):** Full commercial bank accounts registry with Bank Name, Account Number, IFSC, Branch, Tagged Partner, UPI QR mode toggle, opening balance ledger tracking, and 1-click modal addition/deletion.
  3. **User Management & RBAC Roles (`users_roles`):** Complete enterprise Roles ERP Grid Table displaying Role Name, Description, Allowed Module Badges across all 12 operational modules (`sale`, `invoices`, `purchases`, `payments_collections`, `banking`, `hr_payroll`, `accounting_vouchers`, `summary`, `analysis`, `masters`, `reports`, `settings`), Role Editor/Creator modal, and individual Partner Role Assignment controls.
  4. **Security, Credentials & 2FA (`security`):** Administrator Security Password change (supporting complex special characters), Partner Security PIN change, Require Login on Startup toggle, Google Authenticator RFC 6238 TOTP master toggle, live scannable QR Code card, Setup Key copy button, Emergency Master Code `999999`, direct authenticator app link, and isolated Admin/Partner 2FA secret key generators.
  5. **Low Stock & Reorder Levels (`inventory`):** Global default reorder threshold configuration and the full **Per-Item Minimum Stock & Reorder Levels Registry Table** equipped with instant name/category search filter, reorder thresholds, suggested order quantities, and preferred supplier dropdown mappings.
  6. **Customer Credit Limits (`credit_control`):** Master strict credit limit enforcement toggle and the full **Customer Credit Exposure & Limits Registry Table** featuring customer search, live outstanding balances, custom limit overrides, and 1-click WhatsApp balance payment reminders.
  7. **Document Auto-Numbering (`numbering`):** Enterprise document numbering ERP Grid Table configuring standard prefixes, sequential patterns, and live sample preview generators for Sales Invoices (`INV-`), Purchase Orders (`PUR-`), Receipts (`REC-`), Supplier Payments (`PAY-`), Accounting Vouchers (`VCH-`), and Expenses (`EXP-`).
  8. **Alerts & WhatsApp Gateway (`alerts`):** Complete 6-component automated communications engine: (1) Master Alert Schedule & 24h Time Controls, (2) Business Owner Configuration with phone validation, (3) Partner Configuration & Recipients Table with per-partner alert toggles, inline number validation, and modal addition, (4) Alert Information Selection with granular switches for Sales, Collections, Payments, and Stock summaries, (5) Live WhatsApp Message Template Preview Card, and (6) Delivery Audit Trail Screen featuring recipient search, status filter, clear button, and 1-click single-recipient Retry action (`handleRetrySingleAlert`), alongside Test Connection, Send Now, and Send Test Alert triggers.
  9. **Z-Report History & Audit Trail (`z_reports`):** Full historical day-end drawer closings audit table displaying Report Date, Operator, Expected Cash, Counted Cash, Variance (Surplus/Shortage), Status badge, and 1-click 80mm thermal receipt viewer, plus Open Today's Z-Report modal trigger.
  10. **Administration & Tools (`admin_tools`):** Complete Database JSON Snapshot Export (`handleExportAllData`), Complete Database JSON Snapshot Restore/Import (`handleImportBackup`), and System Diagnostics info card (Supabase PostgreSQL status, branch details, and version). *Note: Undo Bank Reconciliation is located directly in the Banking module under Bank Reconciliation for consolidated audit access.*
- **Full Cloud CRUD:** Master configurations support Create, Update, and Delete operations across all configuration tabs.
- **Immediate In-Memory & Cloud Reflection:** Modifications are stored directly in the database and applied immediately to the application state without page reloads.
- **Persistent State:** Configurations persist across page refreshes, user logout/login cycles, and application restarts.
- **Stale Cache Elimination:** The frontend loads fresh settings directly from the database, eliminating stale cached values.
- **Multi-Terminal Real-Time Broadcast:** Changes broadcast across active client sessions via Supabase Realtime WebSocket channels (`jsr_session_tracker`).

---

## 14. UI / Responsive Design
- **Mobile-First Search & List Screens:** All search, list, and ledger screens are responsive across mobile devices, tablets, and POS terminals.
- **Non-Wrapping Column Headers:** Table headers and data cells maintain fixed minimum widths with `whitespace-nowrap`, completely preventing character-by-character vertical text wrapping.
- **Horizontal Touch Scrolling:** Tables that exceed viewport width support smooth horizontal scrolling (`overflow-x-auto`).
- **Compact Headers & Actions:** Page titles and header banners maintain compact vertical footprints. Action buttons on mobile use streamlined menus to preserve screen space.
- **Redundant Column Removal:** Unnecessary or duplicate date/audit columns are removed in favor of clean, readable transaction views.

---

## 15. Number Formatting (Indian Comma Separators)
- **Standardized Indian Numbering System (`en-IN`):** All numbers, currencies, and balance fields format automatically with Indian comma separators:
  - `1000` $\rightarrow$ **`1,000`**
  - `10000` $\rightarrow$ **`10,000`**
  - `100000` $\rightarrow$ **`1,00,000`**
  - `1000000` $\rightarrow$ **`10,00,000`**
  - `2500000.50` $\rightarrow$ **`25,00,000.50`**
- **Cursor-Preserving Input (`IndianNumberInput`):** All 26 numeric inputs across the application dynamically track non-comma character offsets, allowing smooth typing, decimal entry, and backspacing without cursor jumping.
- **Pure Arithmetic Integrity (`cleanNum`):** Input strings are cleaned of commas (`String(val).replace(/,/g, ""))`) before any math operation or database write, guaranteeing 100% calculation accuracy and zero `NaN` errors.

---

## 16. WhatsApp Business Alerts
- **Provider Status Tracking:** Tracks actual Meta WhatsApp Cloud API status rather than assuming delivery:
  - `Queued` $\rightarrow$ `Sent` $\rightarrow$ `Delivered` $\rightarrow$ `Read` $\rightarrow$ `Failed`
- **Error Diagnostics:** Stores API response message IDs and detailed error reasons for failed transmissions.
- **Validation Rules:** Validates recipient phone number formats, country codes (`+91`), API bearer tokens, and template parameters before dispatch.
- **Idempotent Retries:** Re-sending a notification never duplicates financial transactions or collection records.

---

## 17. Reports and Analysis
- **Central Analysis Hub:** Unified analytical engine covering Sales Turnover, Procurement Spending, Customer Collections, Inventory Valuation, and Net Gross Margins.
- **Flexible Date Filtering:** Provides preset periods (Today, Yesterday, This Week, This Month, FY) and custom **From Date** / **To Date** inputs with a dedicated **Apply Filter** button.
- **Drill-Down & Export:** Allows drilling down from summary figures into individual bills, with export capabilities to CSV and printable PDF statements.
- **Non-Redundant Presentation:** Eliminates duplicate analytical widgets on transactional screens in favor of central, authoritative analysis reporting.

---

## 18. Pagination
- **Standardized 10-Page Windowing:** List tables display a maximum of 10 page buttons at once.
- **Grouped Navigation:** Pages are clustered in logical groups (e.g. 1–10, 11–20) with ellipsis (`...`) indicators for large datasets.
- **Directional Controls:** Fully equipped with **First**, **Previous**, **Next**, and **Last** navigation buttons.

---

## 19. ERP / Finance / Payroll
- **Financial Year (FY) Scoping:** Payroll and financial accounting configurations are partitioned by Financial Year (e.g. FY 2026–27).
- **Approved Wage Structures:** Basic + DA structures calculate using authorized percentage brackets.
- **HRA Threshold:** House Rent Allowance applies the configured ₹15,000 monthly threshold rule.
- **PF Statutory Limits:**
  - Qualifying wage ceiling capped at ₹15,000.
  - Employee Provident Fund calculated at statutory 12% with ₹1,800 monthly contribution cap.
- **Voucher Debit/Credit Balance:** Every accounting and payroll voucher enforces:
  $$\sum \text{Debits} = \sum \text{Credits}$$
  Unbalanced vouchers are blocked from posting to prevent PFMS and ledger discrepancies.

---

## 20. Data Integrity Invariants
- **Atomic Operations:** Creating an entry generates exactly one business transaction record.
- **Differential Updates:** Editing an invoice or purchase order calculates and applies only net quantity/rate differences.
- **Complete Reversal on Delete:** Deleting a transaction completely removes the record and cleanly reverses all linked stock and party ledger balances.
- **Non-Reuse of Sequential Numbers:** Deleted invoice and PO sequence numbers are permanently retired and never reassigned to future bills.
- **Audit Logging:** Crucial operational events (invoice edits, debt write-offs, credit limit overrides, settings modifications) are timestamped in the system audit log.

---

## 21. Browser Cache & Deployment Verification
- **Post-Deployment Cache Clear:** After production updates, client browsers (especially Microsoft Edge) should clear cached application assets:
  1. Open Microsoft Edge &rarr; Click **Three dots (`...`)** &rarr; **Settings**.
  2. Navigate to **Privacy, search, and services** &rarr; Under *Clear browsing data*, click **Choose what to clear**.
  3. Set Time range to **All time**.
  4. Check **Cookies and other site data** and **Cached images and files**.
  5. Click **Clear now**, then close and reopen the browser.
- **Authentication Guidance:** If a QR Code login prompt appears, bypass the QR option and authenticate using registered **Username/Mobile** and **Password/PIN** unless otherwise instructed.

---

## 22. Acceptance Criteria
1. **CRUD Completeness:** All features must be fully verifiable across Create, View, Update, and Delete operations.
2. **Security & RBAC Enforcement:** Role restrictions must be enforced at both UI presentation and database/API access layers.
3. **Mathematical Parity:** Financial totals, cash tallies, and stock counts must remain accurate after edits and deletions.
4. **Cross-Platform Usability:** Application must render cleanly across mobile, tablet, and desktop screens with zero broken layouts.
5. **Persistence Reliability:** Configuration changes must persist across page refreshes, re-logins, and browser restarts.
6. **2FA Isolation:** Authentication secrets and OTP validations must be strictly user-scoped.
7. **Regression Safety:** All production updates must pass complete regression verification before release.

---

## 23. General Development Principle
- **Preserve Existing Functionality:** Working functionality must never be altered inadvertently.
- **Feature Flagging:** New configuration options should be enabled only when explicitly requested; when disabled, legacy application behavior must continue uninterrupted.
- **Multi-State Testing:** Any code modification affecting financials, stock, balances, authentication, or permissions must be tested across Create, Update, Delete, Page Refresh, Re-login, and Concurrent User scenarios.

---

## 24. Database Schema Reference
PostgreSQL database tables hosted on Supabase:
1. `customers`: Master profiles, phone numbers, opening dues, credit limits, PAN, GSTIN.
2. `suppliers`: Vendor profiles, contact details, opening dues, PAN, GSTIN.
3. `items`: Item catalog, cost rate, selling rate, current stock, reorder level, suggested reorder quantity.
4. `procurements`: Purchase orders, batch stock tracking, vendor disbursements, PO references (`receiver_2_mode`).
5. `invoices`: Sales invoices, customer IDs, gross totals, upfront payments, balance dues, itemized JSON (`items`).
6. `collections`: Customer payment receipts, payment mode (Cash/UPI), partner attribution (`receiver_id`).
7. `expenses`: Operating expenses, categories, payment mode, partner attribution.
8. `receivers`: Partner accounts, cash balances, UPI balances, role definitions, PINs, profile images.
9. `borrowers`: Business loans, lender contact info, initial principal, balance due, and cloud system settings (`SYSTEM_CONFIG_V1`).
10. `loan_payments`: Repayments split by principal reduction and interest expense.
11. `system_settings`: Master configuration document (JSONB) synchronized in real time.
12. `z_reports`: Day-end cash register reconciliation reports, denomination tallies (JSONB), and discrepancy status.

---

## 25. Changelog & Maintenance Protocol
> **Living Manual Protocol:** This document is continuously maintained in the project root (`c:\Work\JSR_Retails_Sales\Readme.doc` and `README.md`) and is updated synchronously on every system release, feature addition, and bug fix.

| Version | Release Date | Key Features & Modifications |
|:---|:---|:---|
| **v2.5.0** | October 2026 | Full 23-section requirements specification, PAN/GSTIN toggles, Roles & Manage Modules, Partner profile photos, System Name customization, Active Session control, Bank/UPI Reconciliation, Central Reports & Analysis, 10-page pagination, ERP/Payroll rules, and Edge cache clearing protocols. |
| **v2.4.0** | October 2026 | Implemented Indian Number Format (`en-IN`) across all 26 numeric inputs, tables, and receipts with cursor preservation (`IndianNumberInput`) and arithmetic integrity (`cleanNum`). |
| **v2.3.0** | October 2026 | Day-End Cash Register Reconciliation (Z-Report), Low Stock Alert Hub & 1-Click Reorder, Customer Credit Limits & WhatsApp reminders, and 5-Tab Cloud Settings. |
| **v2.2.0** | October 2026 | WhatsApp Cloud API integration and Customer/Supplier Self-Service Portal with Consolidated Statements. |
| **v2.1.0** | September 2026 | Mobile-responsive horizontal table scrolling and non-wrapping table headers across all search/list screens. |
| **v2.0.0** | September 2026 | Dual-mode login authentication with 2FA TOTP RFC 6238 security and 75%/25% desktop layout. |


---

## 24. Bank Accounts Master, Partner Tagging & BRS Report (§9.3)
- **Central Banking Configuration:** Manage commercial bank accounts in Settings (Bank Name, Account Number, IFSC, Branch, Partner Tag, UPI Enabled, UPI ID, Opening Balance).
- **Partner Tagged Bank UPI Filtering:** When UPI mode is selected during billing or disbursements, the system filters the bank dropdown to only show banks tagged to that partner.
- **Reconciliation Audit Queue:** Defaults to *Pending / Un-Cleared* transactions.
- **Locked CRUD Invariants:** Reconciled transactions display a `[🔒 Bank Reconciled]` badge and lock editing and deletion.
- **Undo Bank Reconciliation:** Administration panel allows authorized Admins to revert reconciled transactions back to Pending, safely unlocking them.
- **Official BRS Statement & Report:** Formal Bank Reconciliation Statement calculating:
  $$\text{Reconciled Balance} = \text{Bank Book Balance} + \text{Un-cleared Deposits} - \text{Un-cleared Payments}$$
  Includes A4 & Thermal formatted print layouts and CSV export.

---

## 25. Indian HR & Statutory Payroll Engine (§19.2)
- **Dual Wage Structure Schemes:**
  - **Indian Statutory Scheme:** Fully compliant with Indian labor laws:
    - Basic + DA (50% of CTC)
    - HRA (₹15,000 threshold rule)
    - EPF (12% employee contribution capped at ₹1,800/month; ₹15,000 qualifying wage ceiling)
    - ESIC (0.75% employee contribution if Gross $\le ₹21,000$/month)
    - Professional Tax (PT) (State statutory slabs: $\le ₹15,000$: ₹0; $₹15,001–₹20,000$: ₹150; $> ₹20,000$: ₹200)
  - **Fixed Salary Scheme:** Flat agreed remuneration with zero statutory deductions (for contractual/daily-wage workers).
- **Staff Directory:** Add/Edit employee profiles, departments (Sales, Billing, Warehouse, Operations), PAN, UAN, and bank accounts.
- **Monthly Payroll Run:** Monthly salary computations with working days, LOP adjustments, and statutory deductions.
- **Indian Pay Slip Generator:** Standard corporate format with earnings, deductions, net pay in numbers and Indian words (e.g. *"Rupees Thirty-Two Thousand Four Hundred Only"*), with A4 and thermal printing.

---

## 26. Unified Accounting Vouchers (§20.1)
- **Comprehensive Voucher Registry:** Integrates all operational movements into auditable vouchers:
  - `RV`: Sales Receipts
  - `PV`: Purchase Payments
  - `CRV`: Customer Due Collections
  - `SPV`: Supplier Settlements
  - `EXPV`: Operating Expenses
  - `CTV`: Contras & Bank Transfers
  - `SALV`: Salary Payments
  - `JV`: Manual Journal Adjustments
- **Multi-Criteria Filtering:** Voucher Type, Payment Mode, Date Range, Party, and Search.
- **Printable Voucher Slips:** Formal voucher slip viewer with narration, account heads, and signature blocks.

---

## 27. Profit & Sales Analytics Redesign (§10.1)
- **Executive Header:** *Profit & Sales Analytics* with subtitle: *"Financial ledger, revenue, COGS, operating charges, and itemized margins."*
- **Period Filter Toolbar:** All Time, This Year, This Month, This Week, Today, and Custom Date Range.
- **Interactive Financial Timeline Drill-Down:** Clicking any month scopes all subsequent tables to that month, highlighting the row with `[ACTIVE]` and displaying a bold `Filtered: Month ✕ Reset` badge.
- **Customer Performance Aging Column:** Directly includes an *Aging / Overdue Days* column in the customer performance table alongside orders, value, COGS, gross profit, and margin %.
- **Catalogue Item Profitability & Unit Sales Matrix:** Granular SKU profitability and monthly unit distribution.
- **Unit-Wise Customer Purchases:** Interactive toggle between *Cards View* (grouped item chips with pcs and amounts) and *Matrix Table*.
- **Privacy Mode:** One-click `[👁️ Show/Hide Margins]` toggle to conceal profit and margin columns for shared screens.

---

## 28. Full-Screen Left Sidebar Settings & Brand Normalization (§21.1)
- **ERP 2-Column Layout:** Left panel navigation sidebar with dedicated configuration workspaces:
  - *General & Branding*, *Bank Accounts Master*, *User Management & RBAC Roles*, *2FA Security & Secrets*, *Low Stock & Reorder*, *Customer Credit Limits*, *Document Auto-Numbering*, *Alerts & WhatsApp Gateway*, *Z-Report History*, *Administration & Maintenance*.
- **Deduplication:** Merged redundant general settings blocks into unified tabs.
- **Business Name Bounds:** Length constrained to 3–60 characters with live character counter.
- **Dynamic Business Name Normalization:** Replaced all hardcoded system names with `systemSettings.branding.systemName || "JSR Retails"`.
- **Custom Login Banner Upload:** File upload input in Branding settings enabling Admin to set their custom login background image.

---

## 29. Executive Balance Sheet & Bill-Wise Supplier Dues (§22.1)
- **Meaningful System Name:** Renamed to *Executive Financial Balance Sheet & Operational Audit (Excel Format)*.
- **Customizable Group By:** Interactive dropdowns per table to group by Category, Supplier, Aging, Route, or Flat list.
- **Bill-Wise Supplier Pending Bills:** Individual row per pending purchase bill (Doc #, Date, Supplier, Items, Bill Amount, Paid Amount, Due Amount) without forced supplier grouping.
- **Corrected Supplier Ledger:** Calculates `Opening Due + Procured - Paid`, separating Payables vs Advances.

---

## 30. Clickable Document Numbers & Chronological Audit Trail (§23.1)
- **Interactive Doc # Badges:** Clicking any document number (`INV-`, `PUR-`, `REC-`, `PAY-`, `EXP-`, `VOU-`) opens the *Document Audit Trail & Revision History* modal.
- **Chronological Timeline:** Timestamp, Action, Operator, Status, and detailed field diff summaries.

---

## 31. Differentiated Authentication Policy (§4.3)
- **Customer & Supplier Portal:** Fast 4–6 digit numeric PIN authentication (`/^\d{4,6}$/`).
- **Internal Staff (Admin, Partners, Operators):** Strong alphanumeric password with special characters (`@$!%*?&#`).
- **Auto Role Detection:** Login screen detects Portal vs Staff by entered identifier.
- **Forgot Password Recovery:** Recovery modal and Admin user management in Settings.

---

## 32. System-Wide WhatsApp SVG Icon-Only (§24.1)
- **Clean Action Buttons:** Replaced text "WhatsApp" with a clean SVG `<Icon name="whatsapp" size={15} />` across billing, invoices, collections, and reports for uncluttered UI.
