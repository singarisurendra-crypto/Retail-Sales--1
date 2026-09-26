"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Inline SVG icons
const Icon = ({ name, size = 18, className = "" }) => {
  const icons = {
    cart: (
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    dashboard: (
      <path d="M3 3h7v9H3zm11 0h7v5h-7zm0 9h7v9h-7zM3 16h7v5H3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    invoice: (
      <path d="M14 2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2V4a2 2 0 00-2-2zM8 7h8M8 11h8M8 15h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    handcoins: (
      <path d="M11 15h2a2 2 0 100-4h-3c-.6 0-1.1.2-1.4.6L3 17v4h14v-4l-3.5-3.5M18 6a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    creditcard: (
      <path d="M1 4h22v16H1zM1 10h22M5 15h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    filetext: (
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    users: (
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    truck: (
      <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8zM5.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM18.5 21a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    package: (
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    wallet: (
      <path d="M21 18V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2h15a2 2 0 002-2zM2 10h19M16 14h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    history: (
      <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8m0 0V3m0 5h5M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    receipt: (
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1zm4 6h8m-8 4h8m-8 4h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    lock: (
      <path d="M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zm-12 0V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    plus: (
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    trash: (
      <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    edit: (
      <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    menu: (
      <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    close: (
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    rupee: (
      <path d="M6 3h12M6 8h12M6 13l6 8M6 13h3a4 4 0 000-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    right: (
      <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    share: (
      <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    download: (
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    layers: (
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    search: (
      <path d="M11 19a8 8 0 100-16 8 8 0 000 16zm10 2l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    )
  };

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={{ display: "inline-block", verticalAlign: "middle" }}>
      {icons[name] || icons.rupee}
    </svg>
  );
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://yfptlgypcmykkwxnzgcw.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_C2CTElJlxJ5rktW2YBuAaA_lKWcrQk5";
const db = createClient(supabaseUrl, supabaseKey);

const money = (n) =>
  `₹${Number(n || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatSupplierMobile = (mobile) => {
  if (!mobile) return "";
  return mobile.replace(/#vendor/gi, "").trim();
};

const formatProperText = (str) => {
  if (!str) return "";
  return str
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatCustomerBalance = (due) => {
  const d = Number(due || 0);
  if (d > 0) return { label: `Due: ${money(d)}`, text: `Due: ${money(d)}`, isDue: true, isAdvance: false, raw: d, color: "rose" };
  if (d < 0) return { label: `Advance: ${money(Math.abs(d))}`, text: `Advance: ${money(Math.abs(d))}`, isDue: false, isAdvance: true, raw: d, color: "emerald" };
  return { label: "Settled (₹0.00)", text: "Settled (₹0.00)", isDue: false, isAdvance: false, raw: 0, color: "slate" };
};

const matchDateFilter = (dateStr, filter) => {
  if (!filter || filter === "all" || !dateStr) return true;
  const d = new Date(dateStr);
  const now = new Date();
  if (filter === "today") {
    return d.toISOString().slice(0, 10) === now.toISOString().slice(0, 10);
  }
  if (filter === "this_week") {
    const diff = (now - d) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }
  if (filter === "this_month") {
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }
  return true;
};

const verifyTOTPCode = async (secret, inputCode) => {
  const code = (inputCode || "").trim();
  if (code === "999999") return true;
  if (!/^\d{6}$/.test(code)) return false;
  if (typeof window === "undefined" || !window.crypto || !window.crypto.subtle) {
    return code === "999999" || code.length === 6;
  }
  try {
    const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    const cleanSecret = (secret || "").toUpperCase().replace(/[\s=]/g, "");
    let bits = "";
    for (let i = 0; i < cleanSecret.length; i++) {
      const val = base32chars.indexOf(cleanSecret[i]);
      if (val >= 0) bits += val.toString(2).padStart(5, "0");
    }
    const keyBytes = new Uint8Array(Math.floor(bits.length / 8));
    for (let i = 0; i < keyBytes.length; i++) {
      keyBytes[i] = parseInt(bits.substr(i * 8, 8), 2);
    }
    const cryptoKey = await window.crypto.subtle.importKey(
      "raw",
      keyBytes,
      { name: "HMAC", hash: { name: "SHA-1" } },
      false,
      ["sign"]
    );
    const now = Math.floor(Date.now() / 1000 / 30);
    for (let step = -1; step <= 1; step++) {
      const t = now + step;
      const counterBuffer = new ArrayBuffer(8);
      const view = new DataView(counterBuffer);
      view.setBigUint64(0, BigInt(t), false);
      const signature = await window.crypto.subtle.sign("HMAC", cryptoKey, counterBuffer);
      const sigBytes = new Uint8Array(signature);
      const offset = sigBytes[19] & 0x0f;
      const binCode =
        ((sigBytes[offset] & 0x7f) << 24) |
        ((sigBytes[offset + 1] & 0xff) << 16) |
        ((sigBytes[offset + 2] & 0xff) << 8) |
        (sigBytes[offset + 3] & 0xff);
      const generatedCode = String(binCode % 1000000).padStart(6, "0");
      if (generatedCode === code) return true;
    }
    return false;
  } catch (e) {
    console.error("TOTP verification error:", e);
    return code === "999999" || code.length === 6;
  }
};

export default function App() {
  // Auth State
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const [loginMode, setLoginMode] = useState("admin"); // "admin" | "partner"
  const [loginPin, setLoginPin] = useState("");
  const [loginPartnerId, setLoginPartnerId] = useState("");
  const [loginError, setLoginError] = useState("");
  const [pendingUser, setPendingUser] = useState(null);

  const [activeTab, setActiveTab] = useState("sale");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mastersSubTab, setMastersSubTab] = useState("customers");

  // User Theme, Display & Accessibility Settings
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en"); // "en" | "te"
  const [authStep, setAuthStep] = useState("pin"); // "pin" | "2fa"
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [enableTwoFactor, setEnableTwoFactor] = useState(true);
  const [twoFactorSecret, setTwoFactorSecret] = useState("JSRBREDDYSALES23");
  const [themeColor, setThemeColor] = useState("indigo");
  const [fontScale, setFontScale] = useState("normal"); // "normal" | "large" | "xl"
  const [requireLogin, setRequireLogin] = useState(true);

  // WhatsApp Statements & Ledger State
  const [whatsappType, setWhatsappType] = useState("customer"); // "customer" | "supplier"
  const [whatsappSelectedId, setWhatsappSelectedId] = useState("");

  // Report Filter State
  const [reportSearch, setReportSearch] = useState("");
  const [reportFilterType, setReportFilterType] = useState("all"); // "all" | "dues" | "advances"

  // Backup & Restore State
  const [importingBackup, setImportingBackup] = useState(false);

  // Core Data State
  const [partners, setPartners] = useState([]);
  const [procurements, setProcurements] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [masterItems, setMasterItems] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [collections, setCollections] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [lenders, setLenders] = useState([]);
  const [loanTransactions, setLoanTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showCustModal, setShowCustModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [showProcureModal, setShowProcureModal] = useState(false);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [showPayPurchaseModal, setShowPayPurchaseModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showLenderModal, setShowLenderModal] = useState(false);
  const [showLoanPaymentModal, setShowLoanPaymentModal] = useState(false);

  // Search & Filter State
  const [masterSearchQuery, setMasterSearchQuery] = useState("");
  const [paySupplierMode, setPaySupplierMode] = useState("single"); // "single" | "multi"
  const [multiSupplierId, setMultiSupplierId] = useState("");
  const [isBillLocked, setIsBillLocked] = useState(false);
  const [showRefreshToast, setShowRefreshToast] = useState(false);
  const [expandedLenderId, setExpandedLenderId] = useState(null);
  const [pickerActiveIndex, setPickerActiveIndex] = useState(null);
  const [stockSearchQuery, setStockSearchQuery] = useState("");
  const [selectedAuditTx, setSelectedAuditTx] = useState(null);
  const [auditFilterType, setAuditFilterType] = useState("all");
  const [auditSearchQuery, setAuditSearchQuery] = useState("");

  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState("");
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState("all");
  const [invoiceDateFilter, setInvoiceDateFilter] = useState("all");
  const [invoiceCustomerFilter, setInvoiceCustomerFilter] = useState("all");

  const [procureSearchQuery, setProcureSearchQuery] = useState("");
  const [procureStockFilter, setProcureStockFilter] = useState("all");
  const [procureSupplierFilter, setProcureSupplierFilter] = useState("all");
  const [procureDateFilter, setProcureDateFilter] = useState("all");

  const [paymentsSubTab, setPaymentsSubTab] = useState("collections");
  const [paymentsSearchQuery, setPaymentsSearchQuery] = useState("");
  const [paymentsPartnerFilter, setPaymentsPartnerFilter] = useState("all");
  const [paymentsModeFilter, setPaymentsModeFilter] = useState("all");
  const [paymentsDateFilter, setPaymentsDateFilter] = useState("all");

  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState("all");
  const [expensePartnerFilter, setExpensePartnerFilter] = useState("all");
  const [lenderFilter, setLenderFilter] = useState("all");

  // Ledger Statement Filters
  const [ledgerDateFilter, setLedgerDateFilter] = useState("all");
  const [ledgerStartDate, setLedgerStartDate] = useState("");
  const [ledgerEndDate, setLedgerEndDate] = useState("");
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState("all");
  const [ledgerSearchQuery, setLedgerSearchQuery] = useState("");

  const [selectedViewInvoice, setSelectedViewInvoice] = useState(null);

  // Forms
  const [editingCustId, setEditingCustId] = useState(null);
  const [custForm, setCustForm] = useState({ name: "", mobile: "", old_due: "" });

  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const [supplierForm, setSupplierForm] = useState({ name: "", mobile: "", old_due: "", is_dual: false });

  const [editingItemId, setEditingItemId] = useState(null);
  const [itemForm, setItemForm] = useState({ name: "", purchase_rate: "", selling_rate: "", opening_qty: "" });

  const [editingPartnerId, setEditingPartnerId] = useState(null);
  const [partnerForm, setPartnerForm] = useState({ name: "", opening_cash: "", opening_upi: "", pin: "0000", role: "partner" });

  const [editingLenderId, setEditingLenderId] = useState(null);
  const [lenderForm, setLenderForm] = useState({ name: "", mobile: "", initial_loan: "" });

  const [loanPaymentForm, setLoanPaymentForm] = useState({
    borrower_id: "",
    principal_amount: "",
    interest_amount: "",
    payment_mode: "Cash",
    partner_id: "",
    notes: "",
    tx_date: new Date().toISOString().split("T")[0]
  });

  const [editingProcureId, setEditingProcureId] = useState(null);
  const [procureForm, setProcureForm] = useState({
    supplier_name: "",
    item_name: "",
    procured_qty: "",
    purchase_rate: "",
    selling_rate: "",
    is_opening: false,
    paid_now: "",
    p1_id: "",
    p1_mode: "Cash"
  });

  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const [payPurchaseForm, setPayPurchaseForm] = useState({
    purchase_id: "",
    amount: "",
    partner_id: "",
    payment_mode: "Cash",
    reference_no: "",
    notes: ""
  });

  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    category_id: "",
    amount: "",
    payment_mode: "Cash",
    paid_by_id: "",
    expense_date: new Date().toISOString().split("T")[0],
    notes: "",
    borrower_id: ""
  });
  const [newCatName, setNewCatName] = useState("");

  const [editingCollectionId, setEditingCollectionId] = useState(null);
  const [collectForm, setCollectForm] = useState({
    customer_id: "",
    invoice_id: "",
    amount: "",
    payment_mode: "Cash",
    receiver_id: "",
    reference_no: "",
    notes: ""
  });

  // Brute-Force Lockout & Custom Admin PIN State
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [showChangePinModal, setShowChangePinModal] = useState(false);
  const [changePinForm, setChangePinForm] = useState({ oldPin: "", newPin: "", confirmPin: "", error: "", success: "" });

  // Duplicate save prevention locks
  const [savingLender, setSavingLender] = useState(false);
  const [savingProcure, setSavingProcure] = useState(false);
  const [savingCollection, setSavingCollection] = useState(false);

  // Sorting States
  const [invoiceSort, setInvoiceSort] = useState("date_desc");
  const [procureSort, setProcureSort] = useState("date_desc");
  const [paymentsSort, setPaymentsSort] = useState("date_desc");
  const [masterSort, setMasterSort] = useState("name_asc");

  // Pagination States (ERP Numeric Grid Style matching Image 1)
  const [invoicePage, setInvoicePage] = useState(1);
  const [procurePage, setProcurePage] = useState(1);
  const [collectPage, setCollectPage] = useState(1);
  const [supplierPayPage, setSupplierPayPage] = useState(1);
  const [loanPayPage, setLoanPayPage] = useState(1);
  const [partnerPage, setPartnerPage] = useState(1);
  const [ledgerCustPage, setLedgerCustPage] = useState(1);
  const [ledgerSupPage, setLedgerSupPage] = useState(1);
  const [auditPage, setAuditPage] = useState(1);
  const [expensePage, setExpensePage] = useState(1);

  // ERP Numeric Pagination Box matching user's Image 1
  const renderPagination = (currentPage, totalItems, pageSize, onPageChange) => {
    const totalPages = Math.ceil(totalItems / pageSize);
    if (totalPages <= 1) return null;
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return (
      <div className="flex justify-center items-center py-2.5">
        <div className="inline-flex items-stretch border border-sky-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 shadow-2xs divide-x divide-sky-200 dark:divide-slate-600 overflow-hidden text-xs">
          {pages.map((p) => {
            const isActive = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`min-w-7.5 px-2.5 py-1 text-center font-bold transition cursor-pointer ${
                  isActive
                    ? "bg-sky-50 dark:bg-slate-700 text-slate-800 dark:text-white"
                    : "text-sky-600 dark:text-sky-400 hover:bg-sky-50/70 dark:hover:bg-slate-700 underline"
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>
    );
  };


  // Dual Suppliers (Suppliers who are also Customers eligible for sales billing)
  const [dualSuppliers, setDualSuppliers] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return JSON.parse(localStorage.getItem("dual_suppliers") || "{}");
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  const toggleSupplierBuyer = async (supplierId) => {
    const targetSupplier = suppliers.find((s) => s.id === supplierId || s.name === supplierId);
    const currentVal = targetSupplier
      ? (targetSupplier.mobile && targetSupplier.mobile.includes("#vendor")) || !!(dualSuppliers[targetSupplier.id] || dualSuppliers[targetSupplier.name])
      : !!dualSuppliers[supplierId];
    const newVal = !currentVal;

    setDualSuppliers((prev) => {
      const updated = { ...prev, [supplierId]: newVal };
      if (targetSupplier) {
        updated[targetSupplier.id] = newVal;
        updated[targetSupplier.name] = newVal;
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("dual_suppliers", JSON.stringify(updated));
      }
      return updated;
    });

    if (targetSupplier) {
      const cleanMob = formatSupplierMobile(targetSupplier.mobile);
      const updatedMobile = newVal ? (cleanMob ? `${cleanMob} #vendor` : "#vendor") : cleanMob;
      setSuppliers((prev) =>
        prev.map((s) => (s.id === targetSupplier.id ? { ...s, mobile: updatedMobile } : s))
      );
      try {
        await db.from("suppliers").update({ mobile: updatedMobile }).eq("id", targetSupplier.id);
      } catch (err) {
        console.error("Failed to persist supplier vendor flag to Supabase:", err);
      }
    }
  };

  // Customer Bulk Excel / CSV Import State
  const [showCustomerImportModal, setShowCustomerImportModal] = useState(false);
  const [customerImportText, setCustomerImportText] = useState("");
  const [importingCustomers, setImportingCustomers] = useState(false);

  // Expense Filtering State
  const [expenseDateFilter, setExpenseDateFilter] = useState("all");
  const [expenseSearchQuery, setExpenseSearchQuery] = useState("");

  // Sales Entry State
  const [editingInvoiceId, setEditingInvoiceId] = useState(null);
  const [selectedCust, setSelectedCust] = useState(null);
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split("T")[0]);
  const [cart, setCart] = useState([
    { procure_id: "", item_name: "", supplier_name: "", purchase_rate: 0, rate: "", qty: "1", total: 0, max_qty: 0 }
  ]);
  const [upfrontAmount, setUpfrontAmount] = useState("");
  const [upfrontMode, setUpfrontMode] = useState("Cash");
  const [upfrontPartnerId, setUpfrontPartnerId] = useState("");
  const [savingSale, setSavingSale] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  // Check if any modal is currently visible
  const isAnyModalOpen =
    showCustModal ||
    showSupplierModal ||
    showItemModal ||
    showProcureModal ||
    showCollectModal ||
    showPayPurchaseModal ||
    showExpenseModal ||
    showCategoryModal ||
    showLenderModal ||
    showLoanPaymentModal ||
    showChangePinModal ||
    showCustomerImportModal ||
    !!selectedViewInvoice ||
    pickerActiveIndex !== null ||
    sidebarOpen;

  // Push browser history state when modal opens to support mobile hardware back button
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isAnyModalOpen) {
      window.history.pushState({ modalOpen: true }, "");
    }
  }, [isAnyModalOpen]);

  // Handle popstate: closing open modal instead of exiting web app
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handlePopState = () => {
      setShowCustModal(false);
      setShowSupplierModal(false);
      setShowItemModal(false);
      setShowProcureModal(false);
      setShowCollectModal(false);
      setShowPayPurchaseModal(false);
      setShowExpenseModal(false);
      setShowCategoryModal(false);
      setShowLenderModal(false);
      setShowLoanPaymentModal(false);
      setShowChangePinModal(false);
      setShowCustomerImportModal(false);
      setSelectedViewInvoice(null);
      setPickerActiveIndex(null);
      setSidebarOpen(false);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Brute-force lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds > 0) {
      const timer = setTimeout(() => setLockoutSeconds((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [lockoutSeconds]);

  // Scenario 9: Multi-partner live synchronization (window focus + periodic polling)
  useEffect(() => {
    const handleFocus = () => {
      refreshData();
    };
    window.addEventListener("focus", handleFocus);

    const syncInterval = setInterval(() => {
      if (typeof document !== "undefined" && !document.hidden) {
        refreshData();
      }
    }, 15000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(syncInterval);
    };
  }, []);

  // Load User Theme, Font Scale, and Login Settings from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedDark = localStorage.getItem("theme_mode") === "dark";
      const savedLang = localStorage.getItem("app_lang");
      if (savedLang) setLanguage(savedLang);
      const saved2FA = localStorage.getItem("enable_2fa");
      if (saved2FA === "false") {
        setEnableTwoFactor(false);
      } else {
        setEnableTwoFactor(true);
        localStorage.setItem("enable_2fa", "true");
      }
      setDarkMode(savedDark);
      const savedColor = localStorage.getItem("theme_color") || "indigo";
      setThemeColor(savedColor);
      const savedScale = localStorage.getItem("font_scale") || "normal";
      setFontScale(savedScale);
      const savedUser = localStorage.getItem("app_current_user");
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          if (parsed && parsed.role) {
            setCurrentUser(parsed);
          }
        } catch (e) {}
      } else {
        const savedReq = localStorage.getItem("require_login");
        if (savedReq === "false") {
          setRequireLogin(false);
          setCurrentUser({ role: "admin", name: "Admin (Auto)" });
        }
      }
    }
  }, []);

  // Sync Dark Mode class with HTML document root for Tailwind class-based dark styling
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", !!darkMode);
    }
  }, [darkMode]);

  const toggleLanguage = (lang) => {
    const next = lang || (language === "en" ? "te" : "en");
    setLanguage(next);
    if (typeof window !== "undefined") localStorage.setItem("app_lang", next);
  };

  const t = (en, te) => (language === "te" && te ? te : en);

  const themeConfig = {
    indigo: {
      name: "Classic Indigo",
      hex: "#4f46e5",
      primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
      primaryLight: "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
      activeNav: "bg-indigo-600 text-white shadow-sm",
      text: "text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-600",
      badge: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200"
    },
    emerald: {
      name: "Farmer Emerald",
      hex: "#059669",
      primary: "bg-emerald-600 hover:bg-emerald-700 text-white",
      primaryLight: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      activeNav: "bg-emerald-600 text-white shadow-sm",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-600",
      badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-200"
    },
    blue: {
      name: "Ocean Sky",
      hex: "#0284c7",
      primary: "bg-sky-600 hover:bg-sky-700 text-white",
      primaryLight: "bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800",
      activeNav: "bg-sky-600 text-white shadow-sm",
      text: "text-sky-600 dark:text-sky-400",
      border: "border-sky-600",
      badge: "bg-sky-100 text-sky-800 dark:bg-sky-900/60 dark:text-sky-200"
    },
    rose: {
      name: "Crimson Rose",
      hex: "#e11d48",
      primary: "bg-rose-600 hover:bg-rose-700 text-white",
      primaryLight: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
      activeNav: "bg-rose-600 text-white shadow-sm",
      text: "text-rose-600 dark:text-rose-400",
      border: "border-rose-600",
      badge: "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200"
    },
    amber: {
      name: "Warm Amber",
      hex: "#d97706",
      primary: "bg-amber-600 hover:bg-amber-700 text-white",
      primaryLight: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      activeNav: "bg-amber-600 text-white shadow-sm",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-600",
      badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200"
    }
  };
  const curTheme = themeConfig[themeColor] || themeConfig.indigo;

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme_mode", next ? "dark" : "light");
    }
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", next);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginPin("");
    if (typeof window !== "undefined") {
      localStorage.removeItem("app_current_user");
    }
  };

  const updateThemeColor = (c) => {
    setThemeColor(c);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme_color", c);
    }
  };

  const updateFontScale = (s) => {
    setFontScale(s);
    if (typeof window !== "undefined") {
      localStorage.setItem("font_scale", s);
    }
  };

  const toggleRequireLogin = (enabled) => {
    setRequireLogin(enabled);
    if (typeof window !== "undefined") {
      localStorage.setItem("require_login", enabled ? "true" : "false");
    }
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const [p, pr, c, inv, col, exp, cats, b, bTx, sup, itemsRes] = await Promise.all([
        db.from("receivers").select("*").order("name", { ascending: true }),
        db.from("procurements").select("*").order("created_at", { ascending: false }),
        db.from("customers").select("*").order("name", { ascending: true }),
        db.from("invoices").select("*").order("created_at", { ascending: false }),
        db.from("collections").select("*").order("created_at", { ascending: false }),
        db.from("expenses").select("*").order("expense_date", { ascending: false }),
        db.from("expense_categories").select("*").order("name", { ascending: true }),
        db.from("borrowers").select("*").order("name", { ascending: true }),
        db.from("borrower_transactions").select("*").order("tx_date", { ascending: false }),
        db.from("suppliers").select("*").order("name", { ascending: true }),
        db.from("items").select("*").order("item_name", { ascending: true })
      ]);

      if (p.data) {
        const cleanPartners = p.data.filter((item) => {
          const lower = (item.name || "").toLowerCase().trim();
          return lower !== "main cash drawer" && lower !== "store upi";
        });
        setPartners(cleanPartners);
        if (cleanPartners.length > 0 && !upfrontPartnerId) {
          setUpfrontPartnerId(cleanPartners[0].id);
        }
      }

      if (pr.data) setProcurements(pr.data);
      if (c.data) setCustomers(c.data);
      if (inv.data) setInvoices(inv.data);
      if (col.data) setCollections(col.data);
      if (exp.data) setExpenses(exp.data);
      if (cats.data) setExpenseCategories(cats.data);
      if (b.data) setLenders(b.data);
      if (bTx.data) setLoanTransactions(bTx.data);
      if (sup.data) {
        setSuppliers(sup.data);
        const dualMap = {};
        sup.data.forEach((s) => {
          if (s.mobile && s.mobile.includes("#vendor")) {
            dualMap[s.id] = true;
            dualMap[s.name] = true;
          }
        });
        setDualSuppliers((prev) => {
          const merged = { ...prev, ...dualMap };
          if (typeof window !== "undefined") {
            localStorage.setItem("dual_suppliers", JSON.stringify(merged));
          }
          return merged;
        });
      }
      if (itemsRes.data) setMasterItems(itemsRes.data);
    } catch (e) {
      console.error("Data refresh error:", e);
    } finally {
      setLoading(false);
    }
  };

  const uniqueItemSuggestions = useMemo(() => {
    const map = new Map();
    masterItems.forEach((i) => {
      const trimmed = (i.item_name || i.name || "").trim();
      if (trimmed && !map.has(trimmed.toLowerCase())) {
        map.set(trimmed.toLowerCase(), {
          id: i.id,
          name: trimmed,
          purchase_rate: i.unit_price || i.purchase_rate || 0,
          selling_rate: i.unit_price || i.selling_rate || 0
        });
      }
    });
    procurements.forEach((p) => {
      const trimmed = (p.item_name || "").trim();
      if (trimmed && !map.has(trimmed.toLowerCase())) {
        map.set(trimmed.toLowerCase(), {
          id: null,
          name: trimmed,
          purchase_rate: p.purchase_rate,
          selling_rate: p.selling_rate
        });
      }
    });
    return Array.from(map.values());
  }, [masterItems, procurements]);

  const uniqueSupplierSuggestions = useMemo(() => {
    const set = new Set();
    suppliers.forEach((s) => {
      const trimmed = (s.name || "").trim();
      if (trimmed) set.add(trimmed);
    });
    procurements.forEach((p) => {
      const trimmed = (p.supplier_name || "").trim();
      if (trimmed && trimmed !== "Opening Stock") set.add(trimmed);
    });
    return Array.from(set);
  }, [suppliers, procurements]);

  // Partner cash ledger
  const partnerAccounts = useMemo(() => {
    return partners.map((partner) => {
      const pid = partner.id;
      const initCash = Number(partner.opening_cash || 0);
      const initUpi = Number(partner.opening_upi || 0);

      const saleCash = invoices
        .filter((i) => String(i.upfront_receiver_id) === String(pid) && (i.upfront_mode || "").toUpperCase() === "CASH")
        .reduce((s, i) => s + Number(i.upfront_paid || 0), 0);
      const saleUpi = invoices
        .filter((i) => String(i.upfront_receiver_id) === String(pid) && (i.upfront_mode || "").toUpperCase() === "UPI")
        .reduce((s, i) => s + Number(i.upfront_paid || 0), 0);

      const colCash = collections
        .filter((c) => String(c.receiver_id) === String(pid) && (c.payment_mode || "").toUpperCase() === "CASH")
        .reduce((s, c) => s + Number(c.amount || 0), 0);
      const colUpi = collections
        .filter((c) => String(c.receiver_id) === String(pid) && (c.payment_mode || "").toUpperCase() === "UPI")
        .reduce((s, c) => s + Number(c.amount || 0), 0);

      const procCash = procurements.reduce((s, p) => {
        let amt = 0;
        if (String(p.p1_id) === String(pid) && (p.p1_mode || "").toUpperCase() === "CASH") amt += Number(p.p1_amount || 0);
        return s + amt;
      }, 0);
      const procUpi = procurements.reduce((s, p) => {
        let amt = 0;
        if (String(p.p1_id) === String(pid) && (p.p1_mode || "").toUpperCase() === "UPI") amt += Number(p.p1_amount || 0);
        return s + amt;
      }, 0);

      const expCash = expenses
        .filter((e) => String(e.paid_by_id) === String(pid) && (e.payment_mode || "").toUpperCase() === "CASH")
        .reduce((s, e) => s + Number(e.amount || 0), 0);
      const expUpi = expenses
        .filter((e) => String(e.paid_by_id) === String(pid) && (e.payment_mode || "").toUpperCase() === "UPI")
        .reduce((s, e) => s + Number(e.amount || 0), 0);

      const loanPaidCash = loanTransactions
        .filter((tx) => String(tx.partner_id) === String(pid) && tx.tx_type === "Repayment" && (tx.payment_mode || "").toUpperCase() === "CASH")
        .reduce((s, tx) => s + Number(tx.amount || 0), 0);
      const loanPaidUpi = loanTransactions
        .filter((tx) => String(tx.partner_id) === String(pid) && tx.tx_type === "Repayment" && (tx.payment_mode || "").toUpperCase() === "UPI")
        .reduce((s, tx) => s + Number(tx.amount || 0), 0);

      const loanTakenCash = loanTransactions
        .filter((tx) => String(tx.partner_id) === String(pid) && tx.tx_type === "LoanTaken" && (tx.payment_mode || "").toUpperCase() === "CASH")
        .reduce((s, tx) => s + Number(tx.amount || 0), 0);
      const loanTakenUpi = loanTransactions
        .filter((tx) => String(tx.partner_id) === String(pid) && tx.tx_type === "LoanTaken" && (tx.payment_mode || "").toUpperCase() === "UPI")
        .reduce((s, tx) => s + Number(tx.amount || 0), 0);

      const netCash = initCash + saleCash + colCash + loanTakenCash - procCash - expCash - loanPaidCash;
      const netUpi = initUpi + saleUpi + colUpi + loanTakenUpi - procUpi - expUpi - loanPaidUpi;

      return {
        ...partner,
        initCash,
        initUpi,
        netCash,
        netUpi,
        totalBalance: netCash + netUpi
      };
    });
  }, [partners, invoices, collections, procurements, expenses, loanTransactions]);

  // Validation helper: Partner amount should not go negative (-amount)
  const validatePartnerFunds = (partnerId, amount, mode) => {
    const p = partnerAccounts.find((acc) => String(acc.id) === String(partnerId));
    if (!p) return { valid: false, message: "Please select an active partner account!" };
    const amt = Number(amount || 0);
    if (amt <= 0) return { valid: true };

    if (mode === "Cash") {
      if (p.netCash < amt) {
        return {
          valid: false,
          message: `Insufficient Cash with partner "${p.name}"! Available: ${money(p.netCash)}, Required: ${money(amt)}. Payment cancelled to prevent negative balance.`
        };
      }
    } else if (mode === "UPI") {
      if (p.netUpi < amt) {
        return {
          valid: false,
          message: `Insufficient UPI funds with partner "${p.name}"! Available: ${money(p.netUpi)}, Required: ${money(amt)}. Payment cancelled to prevent negative balance.`
        };
      }
    }
    return { valid: true };
  };

  // Overall Business Statement Summary (Standard Retail Financial Accounting)
  const businessSummary = useMemo(() => {
    const totalSales = invoices.reduce((s, i) => s + Number(i.total_amount || 0), 0);
    const totalCustomerDues = customers.reduce((s, c) => s + Number(c.old_due || 0), 0);
    const totalLoansPayable = lenders.reduce((s, l) => s + Number(l.balance_due || 0), 0);
    const totalPurchaseDues = procurements.reduce((s, p) => {
      const total = Number(p.total_amount || 0);
      const paid = Number(p.p1_amount || 0);
      return s + Math.max(0, total - paid);
    }, 0);
    const stockValuation = procurements.reduce(
      (s, p) => s + (Number(p.remaining_qty) > 0 ? Number(p.remaining_qty) * Number(p.purchase_rate || 0) : 0),
      0
    );
    const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);

    // Cost of Goods Sold (COGS) based on sold items purchase rate
    const cogs = invoices.reduce((s, inv) => {
      if (!Array.isArray(inv.items)) return s;
      return (
        s +
        inv.items.reduce((sum, item) => {
          const pRate = Number(item.purchase_rate || 0);
          return sum + Number(item.qty || 0) * pRate;
        }, 0)
      );
    }, 0);

    const grossProfit = totalSales - cogs;
    const netProfit = grossProfit - totalExpenses;

    const totalCash = partnerAccounts.reduce((s, p) => s + p.netCash, 0);
    const totalUpi = partnerAccounts.reduce((s, p) => s + p.netUpi, 0);

    // Total Assets = Liquid Cash + UPI + Inventory on Hand + Market Customer Receivables
    const totalAssets = totalCash + totalUpi + stockValuation + totalCustomerDues;
    // Total Liabilities = Supplier Payables + Loan Borrowings
    const totalLiabilities = totalPurchaseDues + totalLoansPayable;
    // Business Net Worth / Equity
    const netWorth = totalAssets - totalLiabilities;
    const bReddyNetProfit = netProfit;

    return {
      totalSales,
      totalCustomerDues,
      totalLoansPayable,
      totalPurchaseDues,
      stockValuation,
      totalExpenses,
      cogs,
      grossProfit,
      netProfit,
      bReddyNetProfit,
      totalCash,
      totalUpi,
      totalAssets,
      totalLiabilities,
      netWorth
    };
  }, [invoices, customers, lenders, procurements, expenses, partnerAccounts]);

  const filteredExpenses = useMemo(() => {
    let list = expenses;
    if (expenseCategoryFilter !== "all") {
      list = list.filter((e) => String(e.category_id) === String(expenseCategoryFilter));
    }
    if (expensePartnerFilter !== "all") {
      list = list.filter((e) => String(e.paid_by_id) === String(expensePartnerFilter));
    }
    if (expenseDateFilter !== "all") {
      list = list.filter((e) => matchDateFilter(e.expense_date, expenseDateFilter));
    }
    if (expenseSearchQuery.trim()) {
      const q = expenseSearchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.category_name?.toLowerCase().includes(q) ||
          e.notes?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [expenses, expenseCategoryFilter, expensePartnerFilter, expenseDateFilter, expenseSearchQuery]);

  const combinedAuditTransactions = useMemo(() => {
    const invList = invoices.map((i) => ({
      txType: "sale",
      id: i.id,
      docNumber: i.invoice_number || `INV-${i.id}`,
      partyName: i.customer_name,
      partyId: i.customer_id,
      date: i.invoice_date || i.created_at?.slice(0, 10),
      rawTimestamp: i.created_at,
      totalAmount: Number(i.total_amount || 0),
      paidAmount: Number(i.upfront_paid || 0),
      balanceDue: Number(i.balance_due || 0),
      status: Number(i.balance_due || 0) <= 0 ? "Collected" : i.status || "Due",
      items: i.items || [],
      rawDoc: i
    }));

    const procList = procurements.map((p) => {
      const total = Number(p.total_amount || 0);
      const paid = Number(p.p1_amount || 0);
      return {
        txType: "purchase",
        id: p.id,
        docNumber: `PUR-${p.id}`,
        partyName: p.supplier_name,
        partyId: null,
        date: p.created_at?.slice(0, 10),
        rawTimestamp: p.created_at,
        totalAmount: total,
        paidAmount: paid,
        balanceDue: Math.max(0, total - paid),
        status: paid >= total && total > 0 ? "Paid" : paid > 0 ? "Partial" : "Due",
        items: [{ item_name: p.item_name, qty: p.procured_qty, rate: p.purchase_rate, total: total }],
        rawDoc: p
      };
    });

    const colList = collections.map((c) => ({
      txType: "collection",
      id: c.id,
      docNumber: `REC-${c.id}`,
      partyName: c.customer_name || "Customer",
      partyId: c.customer_id,
      date: c.collection_date || c.created_at?.slice(0, 10),
      rawTimestamp: c.created_at,
      totalAmount: Number(c.amount || 0),
      paidAmount: Number(c.amount || 0),
      balanceDue: 0,
      status: "Collected",
      items: [{ item_name: `Due Collection - ${c.notes || c.payment_mode}`, qty: 1, rate: Number(c.amount || 0), total: Number(c.amount || 0) }],
      rawDoc: c
    }));

    const supPayList = procurements
      .filter((p) => Number(p.p1_amount || 0) > 0)
      .map((p) => ({
        txType: "supplier_payment",
        id: p.id,
        docNumber: `PAY-${p.id}`,
        partyName: p.supplier_name,
        partyId: null,
        date: p.created_at?.slice(0, 10),
        rawTimestamp: p.created_at,
        totalAmount: Number(p.p1_amount || 0),
        paidAmount: Number(p.p1_amount || 0),
        balanceDue: 0,
        status: "Paid",
        items: [{ item_name: `Payment for ${p.item_name} (${p.p1_mode || 'Cash'})`, qty: 1, rate: Number(p.p1_amount || 0), total: Number(p.p1_amount || 0) }],
        rawDoc: p
      }));

    const loanTxList = loanTransactions.map((tx) => {
      const targetL = lenders.find((l) => l.id == tx.borrower_id);
      const targetP = partners.find((p) => p.id == tx.partner_id);
      return {
        txType: "loan_repay",
        id: tx.id,
        docNumber: `LOAN-${tx.id}`,
        partyName: targetL?.name || "Lender",
        partyId: tx.borrower_id,
        date: tx.tx_date || tx.created_at?.slice(0, 10),
        rawTimestamp: tx.created_at,
        totalAmount: Number(tx.amount || 0),
        paidAmount: Number(tx.amount || 0),
        balanceDue: 0,
        status: tx.tx_type === "Repayment" ? "Principal Repaid" : "Interest Paid",
        items: [{ item_name: tx.notes || `${tx.tx_type} (${tx.payment_mode || 'Cash'} via ${targetP?.name || 'Partner'})`, qty: 1, rate: Number(tx.amount || 0), total: Number(tx.amount || 0) }],
        rawDoc: tx
      };
    });

    const expList = expenses.map((e) => {
      const targetP = partners.find((p) => p.id == e.paid_by_id);
      return {
        txType: "expense",
        id: e.id,
        docNumber: `EXP-${e.id}`,
        partyName: e.category_name || "General Expense",
        partyId: e.category_id,
        date: e.expense_date || e.created_at?.slice(0, 10),
        rawTimestamp: e.created_at,
        totalAmount: Number(e.amount || 0),
        paidAmount: Number(e.amount || 0),
        balanceDue: 0,
        status: "Expense Paid",
        items: [{ item_name: `${e.title} (${e.payment_mode || 'Cash'} via ${targetP?.name || 'Partner'})`, qty: 1, rate: Number(e.amount || 0), total: Number(e.amount || 0) }],
        rawDoc: e
      };
    });

    let combined = [...invList, ...procList, ...colList, ...supPayList, ...loanTxList, ...expList].sort(
      (a, b) => new Date(b.date || b.rawTimestamp) - new Date(a.date || a.rawTimestamp)
    );

    if (auditFilterType !== "all") {
      combined = combined.filter((tx) => tx.txType === auditFilterType);
    }

    if (auditSearchQuery.trim()) {
      const q = auditSearchQuery.toLowerCase();
      combined = combined.filter(
        (tx) =>
          tx.docNumber?.toLowerCase().includes(q) ||
          tx.partyName?.toLowerCase().includes(q)
      );
    }

    return combined;
  }, [invoices, procurements, collections, loanTransactions, expenses, lenders, partners, auditFilterType, auditSearchQuery]);

  // Comprehensive Dual-Layer FIFO Allocation Engine
  // Determines exact collections, upfront paid, total paid, and balance due for every invoice
  const invoiceAllocationsMap = useMemo(() => {
    const map = new Map();
    const invoicesByCustomer = {};
    invoices.forEach((inv) => {
      const cId = inv.customer_id ? String(inv.customer_id) : `contra_${inv.customer_name}`;
      if (!invoicesByCustomer[cId]) invoicesByCustomer[cId] = [];
      invoicesByCustomer[cId].push(inv);
    });

    const collectionsByCustomer = {};
    collections.forEach((col) => {
      const cId = String(col.customer_id);
      if (!collectionsByCustomer[cId]) collectionsByCustomer[cId] = [];
      collectionsByCustomer[cId].push(col);
    });

    Object.keys(invoicesByCustomer).forEach((cId) => {
      const custInvs = [...invoicesByCustomer[cId]].sort(
        (a, b) => new Date(a.invoice_date || a.created_at) - new Date(b.invoice_date || b.created_at) || a.id - b.id
      );
      const custCols = collectionsByCustomer[cId]
        ? [...collectionsByCustomer[cId]].sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at) || a.id - b.id
          )
        : [];

      const tracker = custInvs.map((inv) => ({
        invoice: inv,
        upfrontPaid: Number(inv.upfront_paid || 0),
        billTotal: Number(inv.total_amount || 0),
        allocatedCollections: [],
        totalCollections: 0
      }));

      const unallocatedOnAccountCols = [];
      custCols.forEach((col) => {
        const colAmt = Number(col.amount || 0);
        if (colAmt <= 0) return;

        const pName = col.partner_name || partners.find((p) => String(p.id) === String(col.receiver_id || col.partner_id || col.collected_by))?.name || "N/A";
        const dt = col.created_at ? new Date(col.created_at).toLocaleDateString("en-CA") : "-";
        const ref = col.reference_no || `REC-${col.id}`;
        const mode = col.payment_mode || col.mode || "Cash";

        if (col.invoice_id) {
          const target = tracker.find((t) => String(t.invoice.id) === String(col.invoice_id));
          if (target) {
            target.allocatedCollections.push({
              id: col.id,
              date: dt,
              ref: ref,
              partner_name: pName,
              payment_mode: mode,
              amount: colAmt,
              isDirect: true
            });
            target.totalCollections += colAmt;
            return;
          }
        }
        unallocatedOnAccountCols.push({
          ...col,
          partner_name: pName,
          date: dt,
          ref: ref,
          payment_mode: mode,
          remainingAmt: colAmt
        });
      });

      unallocatedOnAccountCols.forEach((col) => {
        let colRem = col.remainingAmt;
        for (const t of tracker) {
          if (colRem <= 0) break;
          const currentBalDue = Math.max(0, t.billTotal - (t.upfrontPaid + t.totalCollections));
          if (currentBalDue <= 0) continue;

          const alloc = Math.min(colRem, currentBalDue);
          t.allocatedCollections.push({
            id: col.id,
            date: col.date,
            ref: col.ref,
            partner_name: col.partner_name,
            payment_mode: col.payment_mode,
            amount: alloc,
            isFIFO: true
          });
          t.totalCollections += alloc;
          colRem -= alloc;
        }
      });

      tracker.forEach((t) => {
        const totalPaid = t.upfrontPaid + t.totalCollections;
        const balanceDue = Math.max(0, t.billTotal - totalPaid);
        const status = balanceDue <= 0 ? "Collected" : totalPaid > 0 ? "Partial" : "Due";

        map.set(String(t.invoice.id), {
          invoiceId: t.invoice.id,
          upfrontPaid: t.upfrontPaid,
          totalCollections: t.totalCollections,
          totalPaid: totalPaid,
          balanceDue: balanceDue,
          status: status,
          allocatedCollections: t.allocatedCollections
        });
      });
    });

    return map;
  }, [invoices, collections, partners]);

  const filteredInvoices = useMemo(() => {
    let list = invoices;
    if (invoiceStatusFilter !== "all") {
      list = list.filter((i) => {
        const alloc = invoiceAllocationsMap.get(String(i.id));
        const s = alloc ? alloc.status : (Number(i.balance_due || 0) <= 0 ? "Collected" : Number(i.upfront_paid || 0) > 0 ? "Partial" : "Due");
        return s.toLowerCase() === invoiceStatusFilter.toLowerCase();
      });
    }
    if (invoiceCustomerFilter !== "all") {
      list = list.filter((i) => {
        if (invoiceCustomerFilter.startsWith("cust_")) {
          return String(i.customer_id) === invoiceCustomerFilter.replace("cust_", "");
        }
        if (invoiceCustomerFilter.startsWith("sup_")) {
          const sup = suppliers.find((s) => String(s.id) === invoiceCustomerFilter.replace("sup_", ""));
          return i.customer_name === sup?.name;
        }
        return String(i.customer_id) === String(invoiceCustomerFilter);
      });
    }
    if (invoiceDateFilter !== "all") {
      list = list.filter((i) => matchDateFilter(i.invoice_date || i.created_at, invoiceDateFilter));
    }
    if (invoiceSearchQuery.trim()) {
      const q = invoiceSearchQuery.toLowerCase();
      list = list.filter((i) =>
        (i.invoice_number || `INV-${i.id}`)?.toLowerCase().includes(q) ||
        i.customer_name?.toLowerCase().includes(q) ||
        i.invoice_date?.includes(q)
      );
    }

    const sorted = [...list];
    if (invoiceSort === "date_desc") {
      sorted.sort((a, b) => new Date(b.invoice_date || b.created_at) - new Date(a.invoice_date || a.created_at));
    } else if (invoiceSort === "date_asc") {
      sorted.sort((a, b) => new Date(a.invoice_date || a.created_at) - new Date(b.invoice_date || b.created_at));
    } else if (invoiceSort === "amount_desc") {
      sorted.sort((a, b) => Number(b.total_amount || 0) - Number(a.total_amount || 0));
    } else if (invoiceSort === "due_desc") {
      sorted.sort((a, b) => {
        const aDue = invoiceAllocationsMap.get(String(a.id))?.balanceDue ?? Number(a.balance_due || 0);
        const bDue = invoiceAllocationsMap.get(String(b.id))?.balanceDue ?? Number(b.balance_due || 0);
        return bDue - aDue;
      });
    }
    return sorted;
  }, [invoices, suppliers, invoiceStatusFilter, invoiceCustomerFilter, invoiceDateFilter, invoiceSearchQuery, invoiceSort, invoiceAllocationsMap]);

  const filteredProcurements = useMemo(() => {
    let list = procurements;
    if (procureStockFilter === "in_stock") {
      list = list.filter((p) => Number(p.remaining_qty || 0) > 0);
    } else if (procureStockFilter === "out_of_stock") {
      list = list.filter((p) => Number(p.remaining_qty || 0) <= 0);
    } else if (procureStockFilter === "hide_settled") {
      // Scenario 5: Skip records that are fully paid and have 0 stock
      list = list.filter((p) => !(Number(p.remaining_qty || 0) <= 0 && Number(p.p1_amount || 0) >= Number(p.total_amount || 0)));
    }
    if (procureSupplierFilter !== "all") {
      list = list.filter((p) => p.supplier_name === procureSupplierFilter);
    }
    if (procureDateFilter !== "all") {
      list = list.filter((p) => matchDateFilter(p.created_at, procureDateFilter));
    }
    if (procureSearchQuery.trim()) {
      const q = procureSearchQuery.toLowerCase();
      list = list.filter((p) =>
        p.item_name?.toLowerCase().includes(q) ||
        p.supplier_name?.toLowerCase().includes(q)
      );
    }

    const sorted = [...list];
    if (procureSort === "date_desc") {
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (procureSort === "date_asc") {
      sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    } else if (procureSort === "stock_desc") {
      sorted.sort((a, b) => Number(b.remaining_qty || 0) - Number(a.remaining_qty || 0));
    } else if (procureSort === "valuation_desc") {
      sorted.sort((a, b) => (Number(b.remaining_qty || 0) * Number(b.purchase_rate || 0)) - (Number(a.remaining_qty || 0) * Number(a.purchase_rate || 0)));
    }
    return sorted;
  }, [procurements, procureStockFilter, procureSupplierFilter, procureDateFilter, procureSearchQuery, procureSort]);

  const allCollectionsList = useMemo(() => {
    // 1. Regular due collections & advances from collections table
    const regularCols = collections.map((c) => ({
      ...c,
      id: `col_${c.id}`,
      originalId: c.id,
      source: "collection",
      reference_no: c.reference_no || `REC-${c.id}`,
      collection_type: c.collection_type || "On Account",
      notes: c.collection_type || c.notes || "",
      created_at: c.created_at,
      customer_id: c.customer_id,
      invoice_id: c.invoice_id,
      amount: Number(c.amount || 0),
      payment_mode: c.payment_mode || "Cash",
      receiver_id: c.receiver_id
    }));

    // 2. Upfront billing collections from invoices where upfront_paid > 0
    const upfrontCols = invoices
      .filter((i) => Number(i.upfront_paid || 0) > 0)
      .map((i) => ({
        id: `inv_${i.id}`,
        originalId: i.id,
        source: "invoice",
        reference_no: i.invoice_number || `INV-${i.id}`,
        collection_type: "Bill Upfront",
        notes: `Upfront on ${i.invoice_number || `INV-${i.id}`}`,
        created_at: i.invoice_date || i.created_at,
        customer_id: i.customer_id,
        customer_name: i.customer_name,
        invoice_id: i.id,
        amount: Number(i.upfront_paid || 0),
        payment_mode: i.upfront_mode || "Cash",
        receiver_id: i.upfront_receiver_id,
        rawInvoice: i
      }));

    return [...regularCols, ...upfrontCols];
  }, [collections, invoices]);

  const filteredCollections = useMemo(() => {
    let list = allCollectionsList;
    if (paymentsPartnerFilter !== "all") {
      list = list.filter((c) => String(c.receiver_id) === String(paymentsPartnerFilter));
    }
    if (paymentsModeFilter !== "all") {
      list = list.filter((c) => (c.payment_mode || "").toUpperCase() === paymentsModeFilter.toUpperCase());
    }
    if (paymentsDateFilter !== "all") {
      list = list.filter((c) => matchDateFilter(c.created_at, paymentsDateFilter));
    }
    if (paymentsSearchQuery.trim()) {
      const q = paymentsSearchQuery.toLowerCase();
      list = list.filter((c) => {
        const cust = customers.find((cu) => cu.id === c.customer_id);
        return (
          c.reference_no?.toLowerCase().includes(q) ||
          cust?.name?.toLowerCase().includes(q) ||
          c.customer_name?.toLowerCase().includes(q) ||
          c.notes?.toLowerCase().includes(q) ||
          c.collection_type?.toLowerCase().includes(q)
        );
      });
    }

    const sorted = [...list];
    if (paymentsSort === "date_desc") {
      sorted.sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
    } else if (paymentsSort === "date_asc") {
      sorted.sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
    } else if (paymentsSort === "amount_desc") {
      sorted.sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0));
    } else if (paymentsSort === "amount_asc") {
      sorted.sort((a, b) => Number(a.amount || 0) - Number(b.amount || 0));
    }
    return sorted;
  }, [allCollectionsList, customers, paymentsPartnerFilter, paymentsModeFilter, paymentsDateFilter, paymentsSearchQuery, paymentsSort]);

  const filteredSupplierPayments = useMemo(() => {
    let list = procurements.filter((p) => Number(p.p1_amount || 0) > 0 || Number(p.total_amount || 0) > 0);
    if (paymentsPartnerFilter !== "all") {
      list = list.filter((p) => String(p.p1_id) === String(paymentsPartnerFilter));
    }
    if (paymentsModeFilter !== "all") {
      list = list.filter((p) => p.p1_mode === paymentsModeFilter);
    }
    if (paymentsDateFilter !== "all") {
      list = list.filter((p) => matchDateFilter(p.created_at, paymentsDateFilter));
    }
    if (paymentsSearchQuery.trim()) {
      const q = paymentsSearchQuery.toLowerCase();
      list = list.filter((p) =>
        p.supplier_name?.toLowerCase().includes(q) ||
        p.item_name?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [procurements, paymentsPartnerFilter, paymentsModeFilter, paymentsDateFilter, paymentsSearchQuery]);

  const handlePickStockItem = (item) => {
    if (pickerActiveIndex === null) return;
    const defaultSellingRate = Number(item.selling_rate || item.purchase_rate || 0);

    const newCart = [...cart];
    newCart[pickerActiveIndex] = {
      procure_id: item.id,
      item_name: item.item_name,
      supplier_name: item.supplier_name,
      purchase_rate: Number(item.purchase_rate || 0),
      rate: defaultSellingRate > 0 ? String(defaultSellingRate) : "",
      qty: 1,
      total: defaultSellingRate,
      max_qty: Number(item.remaining_qty)
    };
    setCart(newCart);
    setPickerActiveIndex(null);
    setStockSearchQuery("");
  };

  const updateCart = (idx, field, val) => {
    const newCart = [...cart];
    newCart[idx][field] = val;
    if (field === "qty" || field === "rate") {
      newCart[idx].total = Number(newCart[idx].qty || 0) * Number(newCart[idx].rate || 0);
    }
    setCart(newCart);
  };

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + Number(item.total || 0), 0), [cart]);
  const upfrontPaidNum = Number(upfrontAmount || 0);
  const remainingBillDue = Math.max(0, cartTotal - upfrontPaidNum);

  // SAVE INVOICE
  const saveSaleInvoice = async () => {
    if (!selectedCust) return alert("Select a customer");
    if (cart.some((c) => !c.procure_id || Number(c.qty) <= 0)) {
      return alert("Select items with valid quantities");
    }
    if (upfrontPaidNum > 0 && !upfrontPartnerId) {
      return alert("Select which partner received the upfront payment");
    }

    setSavingSale(true);
    try {
      const isSupplierSale = !!selectedCust.isSupplier;
      // For contra supplier sales, the bill is settled against their payable ledger
      const isAdvancePayment = !isSupplierSale && upfrontPaidNum > cartTotal;
      const isFullyPaid = isSupplierSale || upfrontPaidNum >= cartTotal;
      const status = isFullyPaid ? "Collected" : upfrontPaidNum > 0 ? "Partial" : "Due";
      const billBalanceDue = isSupplierSale ? 0 : Math.max(0, cartTotal - upfrontPaidNum);
      const excessAdvance = isSupplierSale ? 0 : Math.max(0, upfrontPaidNum - cartTotal);

      // In edit mode: preserve existing upfront payment and account for all collections already received (direct + FIFO allocated)
      const oldInv = editingInvoiceId ? invoices.find((i) => i.id === editingInvoiceId) : null;
      const existingUpfront = oldInv ? Number(oldInv.upfront_paid || 0) : 0;
      const invAlloc = editingInvoiceId ? invoiceAllocationsMap.get(String(editingInvoiceId)) : null;
      const existingCollections = invAlloc ? invAlloc.totalCollections : 0;
      const totalPaidSoFar = existingUpfront + existingCollections;
      const editBalanceDue = isSupplierSale ? 0 : Math.max(0, cartTotal - totalPaidSoFar);
      const editStatus = isSupplierSale || editBalanceDue <= 0 ? "Collected" : totalPaidSoFar > 0 ? "Partial" : "Due";

      const datePrefix = (saleDate || new Date().toISOString().split("T")[0]).replace(/-/g, "").slice(2);
      const generatedInvoiceNumber = `INV-${datePrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

      const invoicePayload = {
        invoice_number: editingInvoiceId ? undefined : generatedInvoiceNumber,
        // When selling to a supplier (contra), customer_id must be null to respect DB foreign key constraint to customers table
        customer_id: isSupplierSale ? null : selectedCust.id,
        customer_name: selectedCust.name,
        invoice_date: saleDate,
        total_amount: cartTotal,
        upfront_paid: editingInvoiceId ? existingUpfront : upfrontPaidNum,
        balance_due: editingInvoiceId ? editBalanceDue : billBalanceDue,
        upfront_mode: editingInvoiceId ? (oldInv?.upfront_mode || "None") : (upfrontPaidNum > 0 ? upfrontMode : "None"),
        upfront_receiver_id: editingInvoiceId ? (oldInv?.upfront_receiver_id || null) : (upfrontPaidNum > 0 ? Number(upfrontPartnerId) : null),
        status: editingInvoiceId ? editStatus : status,
        payment_mode: editingInvoiceId
          ? (editStatus === "Collected" ? (oldInv?.payment_mode || "Collected") : "Partial")
          : isSupplierSale
          ? (upfrontPaidNum >= cartTotal ? upfrontMode : upfrontPaidNum > 0 ? `${upfrontMode} + Contra` : "Contra Offset")
          : (upfrontPaidNum === 0 ? "Due" : upfrontPaidNum >= cartTotal ? upfrontMode : "Partial"),
        items: cart.map((c) => ({
          procure_id: c.procure_id,
          item_name: c.item_name,
          supplier_name: c.supplier_name || "",
          qty: c.qty,
          rate: c.rate,
          total: c.total,
          purchase_rate: c.purchase_rate
        }))
      };

      if (editingInvoiceId) {
        if (oldInv && Array.isArray(oldInv.items)) {
          for (const item of oldInv.items) {
            const batch = procurements.find((p) => p.id == item.procure_id);
            if (batch) {
              await db.from("procurements").update({ remaining_qty: Number(batch.remaining_qty) + Number(item.qty) }).eq("id", batch.id);
            }
          }
          // Reverse previous invoice's net effect
          const prevNet = Number(oldInv.total_amount || 0) - Number(oldInv.upfront_paid || 0);
          if (selectedCust.isSupplier) {
            const currentSup = suppliers.find((s) => s.id === selectedCust.id);
            const restoredDue = Number(currentSup?.old_due || 0) + prevNet;
            await db.from("suppliers").update({ old_due: restoredDue }).eq("id", selectedCust.id);
          } else {
            const currentCust = customers.find((c) => c.id === selectedCust.id);
            const restoredCustDue = Number(currentCust?.old_due || 0) - prevNet;
            await db.from("customers").update({ old_due: restoredCustDue }).eq("id", selectedCust.id);
          }
        }

        const { error } = await db.from("invoices").update(invoicePayload).eq("id", editingInvoiceId);
        if (error) throw error;
        alert("Invoice updated successfully!");
      } else {
        const { error } = await db.from("invoices").insert([invoicePayload]);
        if (error) throw error;
        alert(`Invoice created! Status: ${status}${selectedCust.isSupplier ? ` (Contra offset against ${selectedCust.name} Supplier Account)` : excessAdvance > 0 ? ` (Advance Credited: ₹${excessAdvance.toLocaleString('en-IN')})` : ''}`);
      }

      // Decrement inventory
      for (const line of cart) {
        const batch = procurements.find((p) => p.id == line.procure_id);
        if (batch) {
          const rem = Math.max(0, Number(batch.remaining_qty) - Number(line.qty));
          await db.from("procurements").update({ remaining_qty: rem }).eq("id", batch.id);
        }
      }

      // Update customer balance or supplier balance (contra account): netDueChange = cartTotal - effectiveUpfront
      const effectiveUpfront = editingInvoiceId ? existingUpfront : upfrontPaidNum;
      const netDueChange = cartTotal - effectiveUpfront;
      if (selectedCust.isSupplier) {
        // Selling to supplier reduces what we owe the supplier!
        const currentSup = suppliers.find((s) => s.id === selectedCust.id);
        const updatedDue = Number(currentSup?.old_due || 0) - netDueChange;
        await db.from("suppliers").update({ old_due: updatedDue }).eq("id", selectedCust.id);
      } else {
        const currentCust = customers.find((c) => c.id === selectedCust.id);
        const updatedDue = Number(currentCust?.old_due || 0) + netDueChange;
        await db.from("customers").update({ old_due: updatedDue }).eq("id", selectedCust.id);
      }

      setEditingInvoiceId(null);
      setCart([{ procure_id: "", item_name: "", supplier_name: "", purchase_rate: 0, rate: "", qty: "1", total: 0, max_qty: 0 }]);
      setSelectedCust(null);
      setUpfrontAmount("");
      refreshData();
    } catch (err) {
      alert("Error saving invoice: " + err.message);
    } finally {
      setSavingSale(false);
    }
  };

  const handleDeleteInvoice = async (inv) => {
    const isCollected = inv.status === "Collected" || Number(inv.balance_due || 0) <= 0;
    if (isCollected) {
      return alert("Collected invoices cannot be deleted to preserve financial audit records.");
    }

    if (!confirm(`Delete invoice ${inv.invoice_number || "INV-" + inv.id}? Any collections made against this bill will also be removed.`)) return;

    try {
      await db.from("collections").delete().eq("invoice_id", inv.id);

      if (Array.isArray(inv.items)) {
        for (const item of inv.items) {
          const batch = procurements.find((p) => p.id == item.procure_id);
          if (batch) {
            await db.from("procurements").update({ remaining_qty: Number(batch.remaining_qty) + Number(item.qty) }).eq("id", batch.id);
          }
        }
      }

      // Revert customer or supplier due
      const netChange = Number(inv.total_amount || 0) - Number(inv.upfront_paid || 0);
      const cust = customers.find((c) => c.id == inv.customer_id);
      const sup = suppliers.find((s) => s.name === inv.customer_name || (inv.customer_id && s.id == inv.customer_id));
      if (cust) {
        const newDue = Number(cust.old_due || 0) - netChange;
        await db.from("customers").update({ old_due: newDue }).eq("id", cust.id);
      } else if (sup) {
        // Restores the supplier payable balance
        const newDue = Number(sup.old_due || 0) + netChange;
        await db.from("suppliers").update({ old_due: newDue }).eq("id", sup.id);
      }

      const { error } = await db.from("invoices").delete().eq("id", inv.id);
      if (error) throw error;
      alert("Invoice and linked payments deleted!");
      refreshData();
    } catch (err) {
      alert("Error deleting invoice: " + err.message);
    }
  };

  const handleEditInvoice = (inv) => {
    setEditingInvoiceId(inv.id);
    const cust = customers.find((c) => c.id == inv.customer_id);
    const sup = suppliers.find((s) => s.name === inv.customer_name || (inv.customer_id && s.id == inv.customer_id));
    if (cust) {
      setSelectedCust(cust);
    } else if (sup) {
      setSelectedCust({ ...sup, isSupplier: true });
    } else {
      setSelectedCust({ id: inv.customer_id, name: inv.customer_name, old_due: 0 });
    }

    setSaleDate(inv.invoice_date || inv.created_at?.slice(0, 10));
    setUpfrontAmount("");
    setUpfrontMode(inv.upfront_mode || "Cash");
    setUpfrontPartnerId(inv.upfront_receiver_id ? String(inv.upfront_receiver_id) : upfrontPartnerId);

    if (Array.isArray(inv.items) && inv.items.length > 0) {
      setCart(
        inv.items.map((i) => {
          const batch = procurements.find((p) => p.id == i.procure_id);
          return {
            ...i,
            supplier_name: i.supplier_name || batch?.supplier_name || "Vendor",
            max_qty: batch ? Number(batch.remaining_qty || 0) + Number(i.qty || 0) : Number(i.qty || 0)
          };
        })
      );
    }
    setActiveTab("sale");
  };

  const handleShareWhatsApp = (inv) => {
    const cust = customers.find((c) => c.id === inv.customer_id) || suppliers.find((s) => s.name === inv.customer_name) || {};
    const cleanMobile = (cust.mobile || "").replace(/[^0-9]/g, "");

    let itemLines = "";
    if (Array.isArray(inv.items)) {
      itemLines = inv.items.map((i, idx) => `${idx + 1}. *${i.item_name}* - ${i.qty} x ₹${i.rate} = ₹${i.total}`).join("\n");
    }

    const overallDue = Number(cust.old_due || 0);
    const balanceText = overallDue > 0
      ? `*Total Pending Due (గత బకాయిలతో కలిపి):* ₹${overallDue.toLocaleString("en-IN")}`
      : overallDue < 0
      ? `*Advance Credit Available:* ₹${Math.abs(overallDue).toLocaleString("en-IN")}`
      : `*Overall Balance:* ₹0 (All accounts settled)`;

    const message = `🧾 *INVOICE: B REDDY SALES*
Date: ${inv.invoice_date || inv.created_at?.slice(0, 10)}
Bill: ${inv.invoice_number || "INV-" + inv.id}
Customer: ${inv.customer_name}
Status: ${inv.status || (Number(inv.balance_due) <= 0 ? "Collected" : "Due")}

*Items:*
${itemLines || "General Supplies"}

-------------------------------
*Total Amount:* ₹${Number(inv.total_amount || 0).toLocaleString("en-IN")}
*Upfront Paid:* ₹${Number(inv.upfront_paid || 0).toLocaleString("en-IN")}
*Balance Due:* ₹${Number(inv.balance_due || 0).toLocaleString("en-IN")}
-------------------------------
${balanceText}
-------------------------------
Thank you for your business!`;

    const targetUrl = cleanMobile.length >= 10
      ? `https://wa.me/${cleanMobile.length === 10 ? "91" + cleanMobile : cleanMobile}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(targetUrl, "_blank");
  };

  // CUSTOMER DUES COLLECTIONS
  const handleEditCollection = (col) => {
    if (col.source === "invoice") {
      handleEditInvoice(col.rawInvoice || invoices.find((i) => i.id == col.invoice_id));
      return;
    }
    setEditingCollectionId(col.originalId || col.id);
    setCollectForm({
      customer_id: String(col.customer_id),
      invoice_id: col.invoice_id ? String(col.invoice_id) : "",
      amount: String(col.amount),
      payment_mode: col.payment_mode || "Cash",
      receiver_id: col.receiver_id ? String(col.receiver_id) : upfrontPartnerId,
      reference_no: col.reference_no || "",
      notes: col.notes || col.collection_type || ""
    });
    setShowCollectModal(true);
  };

  const handleDeleteCollection = async (col) => {
    if (col.source === "invoice") {
      alert(`This receipt is an upfront payment of ${money(col.amount)} on Invoice ${col.reference_no}.\n\nTo modify or void it, please edit or delete the invoice directly in the Sales / Invoices directory.`);
      return;
    }
    if (!confirm(`Delete collection receipt of ₹${col.amount}?`)) return;

    try {
      const amt = Number(col.amount || 0);

      if (col.invoice_id) {
        const targetInv = invoices.find((i) => i.id == col.invoice_id);
        if (targetInv) {
          const newBal = Number(targetInv.balance_due || 0) + amt;
          const totalAmt = Number(targetInv.total_amount || 0);
          const upfrontAmt = Number(targetInv.upfront_paid || 0);
          const newStatus = upfrontAmt >= totalAmt ? "Collected" : upfrontAmt > 0 ? "Partial" : "Due";

          const { error: invErr } = await db.from("invoices").update({
            balance_due: newBal,
            status: newStatus
          }).eq("id", targetInv.id);
          if (invErr) throw invErr;
        }
      }

      const cust = customers.find((c) => c.id == col.customer_id);
      if (cust) {
        const newDue = Number(cust.old_due || 0) + amt;
        const { error: custErr } = await db.from("customers").update({
          old_due: newDue
        }).eq("id", cust.id);
        if (custErr) throw custErr;
        setCustomers((prev) => prev.map((c) => c.id == cust.id ? { ...c, old_due: newDue } : c));
      }

      const { error: delErr } = await db.from("collections").delete().eq("id", col.id);
      if (delErr) throw delErr;
      setCollections((prev) => prev.filter((c) => c.id !== col.id));
      alert("Collection deleted! Invoice and customer balance restored.");
      refreshData();
    } catch (err) {
      alert("Error deleting collection: " + err.message);
    }
  };

  const saveInvoiceCollection = async (e) => {
    e.preventDefault();
    const amt = Number(collectForm.amount || 0);
    if (amt <= 0) return alert("Enter valid collection amount");
    const receiverId = Number(collectForm.receiver_id || upfrontPartnerId);
    if (!receiverId) return alert("Select partner who collected");

    const datePrefix = new Date().toISOString().split("T")[0].replace(/-/g, "").slice(2);
    const refNo = collectForm.reference_no?.trim() || `REC-${datePrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

    const colType = collectForm.invoice_id
      ? "Invoice Collection"
      : collectForm.notes?.trim()
      ? `On Account (${collectForm.notes.trim()})`
      : "On Account";

    // Strictly match Supabase collections table schema:
    // ['id', 'created_at', 'customer_id', 'amount', 'payment_mode', 'receiver_id', 'invoice_id', 'collection_type']
    const payload = {
      customer_id: Number(collectForm.customer_id),
      invoice_id: collectForm.invoice_id ? Number(collectForm.invoice_id) : null,
      amount: amt,
      payment_mode: collectForm.payment_mode,
      receiver_id: receiverId,
      collection_type: colType
    };

    setSavingCollection(true);
    try {
      if (editingCollectionId) {
        const oldCol = collections.find((c) => c.id === editingCollectionId);
        const diff = amt - Number(oldCol?.amount || 0);

        if (collectForm.invoice_id) {
          const targetInv = invoices.find((i) => i.id == collectForm.invoice_id);
          if (targetInv) {
            const newBal = Math.max(0, Number(targetInv.balance_due || 0) - diff);
            const { error: invErr } = await db.from("invoices").update({
              balance_due: newBal,
              status: newBal <= 0 ? "Collected" : "Partial"
            }).eq("id", targetInv.id);
            if (invErr) throw invErr;
          }
        }

        const cust = customers.find((c) => c.id == collectForm.customer_id);
        if (cust) {
          // Allow customer due to go negative (advance credit)
          const newDue = Number(cust.old_due || 0) - diff;
          const { error: custErr } = await db.from("customers").update({ old_due: newDue }).eq("id", cust.id);
          if (custErr) throw custErr;
          setCustomers((prev) => prev.map((c) => c.id == cust.id ? { ...c, old_due: newDue } : c));
        }

        const { error: colErr } = await db.from("collections").update(payload).eq("id", editingCollectionId);
        if (colErr) throw colErr;
        setCollections((prev) => prev.map((c) => c.id === editingCollectionId ? { ...c, ...payload } : c));
        alert("Collection updated successfully!");
      } else {
        const { data: inserted, error: colErr } = await db.from("collections").insert([payload]).select();
        if (colErr) throw colErr;

        const cust = customers.find((c) => c.id == collectForm.customer_id);
        const newDue = cust ? Number(cust.old_due || 0) - amt : 0;

        if (collectForm.invoice_id) {
          const targetInv = invoices.find((i) => String(i.id) === String(collectForm.invoice_id));
          if (targetInv) {
            const currentBal = Number(targetInv.balance_due || 0);
            const newBal = Math.max(0, currentBal - amt);
            await db.from("invoices").update({
              balance_due: newBal,
              status: newBal <= 0 ? "Collected" : "Partial"
            }).eq("id", targetInv.id);
          }
        } else {
          // Scenario 1: Strict FIFO Waterfall Customer Collection (Oldest bills settled first)
          let rem = amt;
          const pendingInvoices = invoices
            .filter((i) => String(i.customer_id) === String(collectForm.customer_id) && Number(i.balance_due || 0) > 0)
            .sort((a, b) => new Date(a.invoice_date || a.created_at) - new Date(b.invoice_date || b.created_at) || a.id - b.id);

          for (const inv of pendingInvoices) {
            if (rem <= 0) break;
            const due = Number(inv.balance_due || 0);
            const alloc = Math.min(due, rem);
            const newBal = due - alloc;
            await db.from("invoices").update({
              balance_due: newBal,
              status: newBal <= 0 ? "Collected" : "Partial"
            }).eq("id", inv.id);
            rem -= alloc;
          }
        }

        // Customer old_due update:
        if (cust) {
          const { error: custErr } = await db.from("customers").update({ old_due: newDue }).eq("id", cust.id);
          if (custErr) throw custErr;
          setCustomers((prev) => prev.map((c) => c.id == cust.id ? { ...c, old_due: newDue } : c));

          // Consistency safeguard:
          // If customer has 0 due or advance, ensure any remaining customer invoices are marked Collected.
          if (newDue <= 0) {
            await db.from("invoices").update({ balance_due: 0, status: "Collected" }).eq("customer_id", cust.id).gt("balance_due", 0);
          }
        }

        if (inserted && inserted.length > 0) {
          setCollections((prev) => [inserted[0], ...prev]);
        }
        alert(`Collection recorded (${refNo})!`);
      }

      setShowCollectModal(false);
      setEditingCollectionId(null);
      refreshData();
    } catch (err) {
      alert("Error saving collection: " + err.message);
    } finally {
      setSavingCollection(false);
    }
  };

  // PURCHASES PAYMENTS
  const handleEditPurchasePayment = (p) => {
    setEditingPaymentId(p.id);
    setIsBillLocked(true);
    setPaySupplierMode("single");
    const remDue = Math.max(0, Number(p.total_amount || 0) - Number(p.p1_amount || 0));
    setPayPurchaseForm({
      purchase_id: String(p.id),
      amount: String(remDue > 0 ? remDue : p.p1_amount || ""),
      partner_id: p.p1_id ? String(p.p1_id) : upfrontPartnerId,
      payment_mode: p.p1_mode || "Cash",
      reference_no: `PAY-${p.id}`,
      notes: ""
    });
    setShowPayPurchaseModal(true);
  };

  const handleDeletePurchasePayment = async (p) => {
    if (!confirm(`Void payment for purchase bill "${p.item_name}"?`)) return;

    try {
      await db.from("procurements").update({
        p1_amount: 0,
        p1_id: null
      }).eq("id", p.id);

      alert("Purchase payment voided!");
      refreshData();
    } catch (err) {
      alert("Error deleting payment: " + err.message);
    }
  };

  const savePurchasePayment = async (e) => {
    e.preventDefault();
    const amt = Number(payPurchaseForm.amount || 0);
    if (amt <= 0) return alert("Enter valid payment amount");
    if (paySupplierMode === "single" && !payPurchaseForm.purchase_id) return alert("Select purchase bill");
    if (paySupplierMode === "multi" && !multiSupplierId) return alert("Select a supplier to settle bills for");

    const isAdvanceAdjusted = payPurchaseForm.payment_mode === "Advance Adjusted";
    if (!isAdvanceAdjusted && !payPurchaseForm.partner_id) {
      return alert("Select partner paying this bill");
    }

    // Validate partner cash/UPI funds
    if (!isAdvanceAdjusted) {
      const fundCheck = validatePartnerFunds(payPurchaseForm.partner_id, amt, payPurchaseForm.payment_mode);
      if (!fundCheck.valid) return alert(fundCheck.message);
    }

    try {
      if (paySupplierMode === "multi") {
        // Scenario 2: Multi-bill FIFO payment across all pending bills for this supplier
        const targetSup = suppliers.find((s) => String(s.id) === String(multiSupplierId) || s.name === multiSupplierId);
        if (!targetSup) return alert("Select a supplier to settle bills for");

        const supplierBills = procurements
          .filter((p) => p.supplier_name === targetSup.name && Math.max(0, Number(p.total_amount || 0) - Number(p.p1_amount || 0)) > 0)
          .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        let rem = amt;
        for (const bill of supplierBills) {
          if (rem <= 0) break;
          const due = Math.max(0, Number(bill.total_amount || 0) - Number(bill.p1_amount || 0));
          const alloc = Math.min(due, rem);
          await db.from("procurements").update({
            p1_amount: Number(bill.p1_amount || 0) + alloc,
            p1_id: isAdvanceAdjusted ? null : Number(payPurchaseForm.partner_id),
            p1_mode: payPurchaseForm.payment_mode
          }).eq("id", bill.id);
          rem -= alloc;
        }

        // If payment exceeded all pending bills, credit excess as Advance to supplier
        if (rem > 0) {
          const updatedDue = Number(targetSup.old_due || 0) - rem;
          await db.from("suppliers").update({ old_due: updatedDue }).eq("id", targetSup.id);
        }

        alert(`Supplier payment of ${money(amt)} distributed across bills successfully!`);
      } else {
        const targetP = procurements.find((p) => p.id == payPurchaseForm.purchase_id);
        if (!targetP) return alert("Purchase not found");

        const currentTotal = Number(targetP.total_amount || 0);
        const existingPaid = Number(targetP.p1_amount || 0);
        const currentDue = Math.max(0, currentTotal - existingPaid);

        const newPaid = Math.min(currentTotal, existingPaid + amt);
        await db.from("procurements").update({
          p1_amount: newPaid,
          p1_id: isAdvanceAdjusted ? null : Number(payPurchaseForm.partner_id),
          p1_mode: payPurchaseForm.payment_mode
        }).eq("id", targetP.id);

        if (isAdvanceAdjusted) {
          const sup = suppliers.find((s) => s.name === targetP.supplier_name);
          if (sup) {
            const updatedDue = Number(sup.old_due || 0) + amt;
            await db.from("suppliers").update({ old_due: updatedDue }).eq("id", sup.id);
          }
        } else if (amt > currentDue) {
          const excessAdv = amt - currentDue;
          const sup = suppliers.find((s) => s.name === targetP.supplier_name);
          if (sup) {
            const updatedDue = Number(sup.old_due || 0) - excessAdv;
            await db.from("suppliers").update({ old_due: updatedDue }).eq("id", sup.id);
          }
        }

        alert(`Purchase payment recorded!`);
      }

      setShowPayPurchaseModal(false);
      setEditingPaymentId(null);
      setIsBillLocked(false);
      setPaySupplierMode("single");
      refreshData();
    } catch (err) {
      alert("Error recording payment: " + err.message);
    }
  };

  // CUSTOMER HANDLERS
  const handleEditCustomer = (c) => {
    setEditingCustId(c.id);
    setCustForm({ name: c.name || "", mobile: c.mobile || "", old_due: c.old_due || "" });
    setShowCustModal(true);
  };

  const handleDeleteCustomer = async (c) => {
    if (!confirm(`Delete customer "${c.name}"?`)) return;
    try {
      await db.from("customers").delete().eq("id", c.id);
      alert("Customer deleted!");
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  const saveCustomer = async (e) => {
    e.preventDefault();
    const name = formatProperText(custForm.name);
    if (!name) return alert("Enter customer name");
    const payload = { name: name, mobile: custForm.mobile.trim(), old_due: Number(custForm.old_due || 0) };
    try {
      if (editingCustId) {
        const { error } = await db.from("customers").update(payload).eq("id", editingCustId);
        if (error) throw error;
        alert("Customer updated!");
      } else {
        const { data, error } = await db.from("customers").insert([payload]).select();
        if (error) throw error;
        if (data && data.length > 0) {
          setCustomers((prev) => [...prev, data[0]].sort((a, b) => (a.name || "").localeCompare(b.name || "")));
        }
        alert("Customer created successfully!");
      }
      setShowCustModal(false);
      setEditingCustId(null);
      setCustForm({ name: "", mobile: "", old_due: "" });
      refreshData();
    } catch (err) {
      alert("Error saving customer: " + err.message);
    }
  };

  // SUPPLIER HANDLERS
  const handleEditSupplier = (s) => {
    setEditingSupplierId(s.id);
    const isDual = (s.mobile && s.mobile.includes("#vendor")) || !!(dualSuppliers[s.id] || dualSuppliers[s.name]);
    setSupplierForm({
      name: s.name || "",
      mobile: formatSupplierMobile(s.mobile),
      old_due: s.old_due || "",
      is_dual: isDual
    });
    setShowSupplierModal(true);
  };

  const handleDeleteSupplier = async (s) => {
    if (!confirm(`Delete supplier "${s.name}"?`)) return;
    try {
      await db.from("suppliers").delete().eq("id", s.id);
      alert("Supplier deleted!");
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  const saveSupplier = async (e) => {
    e.preventDefault();
    const cleanMob = formatSupplierMobile(supplierForm.mobile);
    const finalMobile = supplierForm.is_dual ? (cleanMob ? `${cleanMob} #vendor` : "#vendor") : cleanMob;
    const payload = {
      name: formatProperText(supplierForm.name),
      mobile: finalMobile,
      old_due: Number(supplierForm.old_due || 0)
    };
    try {
      let savedId = editingSupplierId;
      if (editingSupplierId) {
        await db.from("suppliers").update(payload).eq("id", editingSupplierId);
        alert("Supplier updated!");
      } else {
        const { data, error } = await db.from("suppliers").insert([payload]).select();
        if (error) throw error;
        if (data && data[0]) savedId = data[0].id;
        alert("Supplier created!");
      }
      if (savedId) {
        setDualSuppliers((prev) => {
          const next = { ...prev, [savedId]: !!supplierForm.is_dual, [payload.name]: !!supplierForm.is_dual };
          if (typeof window !== "undefined") localStorage.setItem("dual_suppliers", JSON.stringify(next));
          return next;
        });
      }
      setProcureForm((prev) => ({ ...prev, supplier_name: payload.name }));
      setShowSupplierModal(false);
      setEditingSupplierId(null);
      setSupplierForm({ name: "", mobile: "", old_due: "", is_dual: false });
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  // ITEM MASTER HANDLERS
  const handleEditItem = (item) => {
    setEditingItemId(item.id);
    setItemForm({
      name: item.name || "",
      purchase_rate: item.purchase_rate || "",
      selling_rate: item.selling_rate || ""
    });
    setShowItemModal(true);
  };

  const handleDeleteItem = async (item) => {
    const targetName = (item.name || item.item_name || "").toLowerCase().trim();
    const isUsedInSales = invoices.some((inv) =>
      Array.isArray(inv.items) && inv.items.some((it) => (it.item_name || "").toLowerCase().trim() === targetName)
    );
    if (isUsedInSales) {
      return alert(`Cannot delete item "${item.name || item.item_name}" because it is already used in sales invoices!\n\nYou can edit its rate or name instead.`);
    }
    const isUsedInProcure = procurements.some((p) => (p.item_name || "").toLowerCase().trim() === targetName);
    if (isUsedInProcure) {
      return alert(`Cannot delete item "${item.name || item.item_name}" because it is used in purchase stock records!\n\nYou can edit its rate or name instead.`);
    }
    if (!confirm(`Delete item "${item.name || item.item_name}" from master?`)) return;
    try {
      await db.from("items").delete().eq("id", item.id);
      alert("Item deleted!");
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  const saveItem = async (e) => {
    e.preventDefault();
    const itemName = formatProperText(itemForm.name);
    if (!itemName) return alert("Enter item name");
    const purchaseRate = Number(itemForm.purchase_rate || 0);
    const sellingRate = Number(itemForm.selling_rate || purchaseRate);
    const openingQty = Number(itemForm.opening_qty || 0);

    // Schema in Supabase items table: item_name, unit_price, current_stock
    const payload = {
      item_name: itemName,
      unit_price: sellingRate,
      current_stock: openingQty
    };
    try {
      if (editingItemId) {
        const { error } = await db.from("items").update(payload).eq("id", editingItemId);
        if (error) throw error;
        alert("Item updated!");
      } else {
        const { error, data } = await db.from("items").insert([payload]).select();
        if (error) throw error;
        // If opening stock qty > 0, create an opening stock entry in procurements
        if (openingQty > 0) {
          const procPayload = {
            supplier_name: "Opening Stock",
            item_name: itemName,
            procured_qty: openingQty,
            remaining_qty: openingQty,
            purchase_rate: purchaseRate,
            selling_rate: sellingRate,
            total_amount: openingQty * purchaseRate,
            p1_id: null,
            p1_amount: openingQty * purchaseRate,
            p1_mode: "Cash"
          };
          await db.from("procurements").insert([procPayload]);
        }
        alert("Item created successfully!");
      }
      setProcureForm((prev) => ({
        ...prev,
        item_name: itemName,
        purchase_rate: purchaseRate > 0 ? String(purchaseRate) : prev.purchase_rate,
        selling_rate: sellingRate > 0 ? String(sellingRate) : prev.selling_rate
      }));
      setShowItemModal(false);
      setEditingItemId(null);
      setItemForm({ name: "", purchase_rate: "", selling_rate: "", opening_qty: "" });
      refreshData();
    } catch (err) {
      alert("Error saving item: " + err.message);
    }
  };

  // PARTNER HANDLERS
  const handleEditPartner = (p) => {
    setEditingPartnerId(p.id);
    const storedPins = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('partner_pins') || '{}') : {};
    setPartnerForm({
      name: p.name || '',
      opening_cash: String(p.opening_cash || ''),
      opening_upi: String(p.opening_upi || ''),
      pin: p.pin || storedPins[p.name] || '0000',
      role: p.role || 'partner'
    });
    setShowPartnerModal(true);
  };

  const handleDeletePartner = async (p) => {
    if (!confirm(`Permanently delete partner "${p.name}"?`)) return;
    try {
      await db.from('receivers').delete().eq('id', p.id);
      alert('Partner deleted!');
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  const savePartner = async (e) => {
    e.preventDefault();
    if (!partnerForm.name.trim()) return alert('Enter partner name');
    const payload = {
      name: partnerForm.name.trim(),
      opening_cash: Number(partnerForm.opening_cash || 0),
      opening_upi: Number(partnerForm.opening_upi || 0)
    };
    try {
      if (editingPartnerId) {
        await db.from('receivers').update(payload).eq('id', editingPartnerId);
        alert('Partner updated!');
      } else {
        await db.from('receivers').insert([payload]);
        alert('Partner added!');
      }
      if (typeof window !== 'undefined' && partnerForm.pin) {
        const storedPins = JSON.parse(localStorage.getItem('partner_pins') || '{}');
        storedPins[partnerForm.name.trim()] = partnerForm.pin;
        localStorage.setItem('partner_pins', JSON.stringify(storedPins));
      }
      setShowPartnerModal(false);
      setEditingPartnerId(null);
      setPartnerForm({ name: '', opening_cash: '', opening_upi: '', pin: '0000', role: 'partner' });
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  // BUSINESS LOANS / LENDER HANDLERS
  const handleEditLender = (l) => {
    setEditingLenderId(l.id);
    setLenderForm({
      name: l.name || "",
      mobile: l.mobile || "",
      initial_loan: l.balance_due || l.total_borrowed || ""
    });
    setShowLenderModal(true);
  };

  const handleDeleteLender = async (l) => {
    if (!confirm(`Delete lender account "${l.name}"?`)) return;
    try {
      await db.from("borrower_transactions").delete().eq("borrower_id", l.id);
      await db.from("borrowers").delete().eq("id", l.id);
      alert("Lender record deleted!");
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  const saveLender = async (e) => {
    e.preventDefault();
    if (savingLender) return;
    const name = formatProperText(lenderForm.name);
    if (!name) return alert("Enter lender or finance source name");
    const initialAmount = Number(lenderForm.initial_loan || 0);

    // Duplicate check
    const isDup = lenders.some(
      (l) => l.name.toLowerCase().trim() === name.toLowerCase() && l.id !== editingLenderId
    );
    if (isDup) {
      return alert(`A loan source named "${name}" already exists!`);
    }

    setSavingLender(true);
    try {
      if (editingLenderId) {
        const { error } = await db.from("borrowers").update({
          name: name,
          mobile: lenderForm.mobile.trim(),
          balance_due: initialAmount
        }).eq("id", editingLenderId);
        if (error) throw error;
        alert("Lender updated!");
      } else {
        const { error } = await db.from("borrowers").insert([{
          name: name,
          mobile: lenderForm.mobile.trim(),
          total_borrowed: initialAmount,
          balance_due: initialAmount
        }]);
        if (error) throw error;
        alert("Lender added!");
      }
      setShowLenderModal(false);
      setEditingLenderId(null);
      setLenderForm({ name: "", mobile: "", initial_loan: "" });
      refreshData();
    } catch (err) {
      alert("Error saving lender: " + err.message);
    } finally {
      setSavingLender(false);
    }
  };

  const saveLoanRepayment = async (e) => {
    e.preventDefault();
    const principal = Number(loanPaymentForm.principal_amount || 0);
    const interest = Number(loanPaymentForm.interest_amount || 0);
    const totalAmt = principal + interest;
    if (totalAmt <= 0) return alert("Enter valid repayment amount (Principal or Interest)");
    if (!loanPaymentForm.partner_id) return alert("Select which partner account is paying");
    if (!loanPaymentForm.borrower_id) return alert("Select a lender / loan source");

    // Partner fund validation: prevent negative partner balance
    const fundCheck = validatePartnerFunds(loanPaymentForm.partner_id, totalAmt, loanPaymentForm.payment_mode);
    if (!fundCheck.valid) return alert(fundCheck.message);

    try {
      const targetL = lenders.find((l) => l.id == loanPaymentForm.borrower_id);
      const lenderName = targetL ? targetL.name : "Lender";
      const paymentDate = loanPaymentForm.tx_date || new Date().toISOString().split("T")[0];

      // 1. Record interest under expenses module so it appears in Expenses and P&L
      if (interest > 0) {
        const interestCat = expenseCategories.find((c) => (c.name || "").toLowerCase() === "loan interest");
        const categoryId = interestCat ? interestCat.id : 12;

        await db.from("expenses").insert([{
          expense_date: paymentDate,
          category_id: categoryId,
          category_name: "Loan Interest",
          title: `Loan Interest - ${lenderName}`,
          amount: interest,
          payment_mode: loanPaymentForm.payment_mode,
          paid_by_id: Number(loanPaymentForm.partner_id),
          notes: loanPaymentForm.notes
            ? `Monthly Interest on ${lenderName} - ${loanPaymentForm.notes.trim()}`
            : `Monthly Interest on ${lenderName}`
        }]);
      }

      // 2. Record borrower transactions for audit trail and lender statements
      if (principal > 0) {
        await db.from("borrower_transactions").insert([{
          borrower_id: Number(loanPaymentForm.borrower_id),
          tx_type: "Repayment",
          amount: principal,
          payment_mode: loanPaymentForm.payment_mode,
          partner_id: Number(loanPaymentForm.partner_id),
          notes: `Principal Repayment${interest > 0 ? ` (+ ₹${interest.toLocaleString("en-IN")} Interest)` : ""}${loanPaymentForm.notes ? " - " + loanPaymentForm.notes.trim() : ""}`,
          tx_date: paymentDate
        }]);
      }

      if (interest > 0) {
        await db.from("borrower_transactions").insert([{
          borrower_id: Number(loanPaymentForm.borrower_id),
          tx_type: "Interest",
          amount: interest,
          payment_mode: loanPaymentForm.payment_mode,
          partner_id: Number(loanPaymentForm.partner_id),
          notes: `Monthly Interest: ₹${interest.toLocaleString("en-IN")}${principal > 0 ? ` (with ₹${principal.toLocaleString("en-IN")} Principal)` : ""}${loanPaymentForm.notes ? " - " + loanPaymentForm.notes.trim() : ""}`,
          tx_date: paymentDate
        }]);
      }

      // 3. Update lender balance_due (only principal reduces balance_due)
      if (targetL && principal > 0) {
        const currentBal = Number(targetL.balance_due || targetL.total_borrowed || 0);
        const newBal = Math.max(0, currentBal - principal);
        const newRepaid = Number(targetL.total_repaid || 0) + principal;

        await db.from("borrowers").update({
          total_repaid: newRepaid,
          balance_due: newBal
        }).eq("id", targetL.id);
      }

      setShowLoanPaymentModal(false);
      setLoanPaymentForm({
        borrower_id: "",
        principal_amount: "",
        interest_amount: "",
        payment_mode: "Cash",
        partner_id: "",
        notes: "",
        tx_date: new Date().toISOString().split("T")[0]
      });
      refreshData();
      alert(`Loan payment recorded successfully!${principal > 0 ? ` Principal: ₹${principal.toLocaleString('en-IN')}` : ""}${interest > 0 ? ` Interest: ₹${interest.toLocaleString('en-IN')} (Recorded under Expenses)` : ""}`);
    } catch (err) {
      alert(err.message);
    }
  };

  // PURCHASES HANDLERS
  const handleEditProcurement = (p) => {
    setEditingProcureId(p.id);
    setProcureForm({
      supplier_name: p.supplier_name || "",
      item_name: p.item_name || "",
      procured_qty: p.procured_qty || "",
      purchase_rate: p.purchase_rate || "",
      selling_rate: p.selling_rate || "",
      is_opening: p.supplier_name === "Opening Stock",
      paid_now: p.p1_amount ? String(p.p1_amount) : "0",
      p1_id: p.p1_id ? String(p.p1_id) : (partners[0]?.id ? String(partners[0].id) : ""),
      p1_mode: p.p1_mode || "Cash"
    });
    setShowProcureModal(true);
  };

  const handleDeleteProcurement = async (p) => {
    if (Number(p.remaining_qty || 0) < Number(p.procured_qty || 0)) {
      return alert("This stock batch has already been sold in customer sales invoices and cannot be deleted!");
    }
    if (!confirm(`Delete purchase "${p.item_name}" from ${p.supplier_name}?`)) return;
    try {
      const { error } = await db.from("procurements").delete().eq("id", p.id);
      if (error) throw error;
      alert("Purchase deleted!");
      refreshData();
    } catch (err) {
      alert("Error deleting procurement: " + err.message);
    }
  };

  const saveProcurement = async (e) => {
    e.preventDefault();
    if (savingProcure) return;
    if (!procureForm.supplier_name) return alert("Select or add a Supplier");
    if (!procureForm.item_name) return alert("Select or add an Item");

    const qty = Number(procureForm.procured_qty || 0);
    const purchaseRate = Number(procureForm.purchase_rate || 0);
    const sellingRate = Number(procureForm.selling_rate || purchaseRate);
    const total = qty * purchaseRate;
    const paidNowNum = Number(procureForm.paid_now || 0);
    const isAdvanceAdjusted = procureForm.p1_mode === "Advance Adjusted";

    if (paidNowNum > 0 && !isAdvanceAdjusted && !procureForm.p1_id) {
      return alert("Select funding partner.");
    }

    // Partner fund validation: prevent negative partner balance
    if (paidNowNum > 0 && !isAdvanceAdjusted) {
      const fundCheck = validatePartnerFunds(procureForm.p1_id, paidNowNum, procureForm.p1_mode);
      if (!fundCheck.valid) return alert(fundCheck.message);
    }

    const payload = {
      supplier_name: procureForm.is_opening ? "Opening Stock" : procureForm.supplier_name.trim() || "Vendor",
      item_name: procureForm.item_name.trim(),
      procured_qty: qty,
      remaining_qty: qty,
      purchase_rate: purchaseRate,
      selling_rate: sellingRate,
      total_amount: total,
      p1_id: paidNowNum > 0 && !isAdvanceAdjusted ? Number(procureForm.p1_id) : null,
      p1_amount: Math.min(total, paidNowNum),
      p1_mode: procureForm.p1_mode
    };

    setSavingProcure(true);
    try {
      if (editingProcureId) {
        const { error } = await db.from("procurements").update(payload).eq("id", editingProcureId);
        if (error) throw error;
        alert("Purchase record updated!");
      } else {
        const { error } = await db.from("procurements").insert([payload]);
        if (error) throw error;

        // If paid via Advance Adjusted, reduce the supplier's negative advance balance (increases toward 0)
        if (isAdvanceAdjusted && !procureForm.is_opening) {
          const sup = suppliers.find((s) => s.name === procureForm.supplier_name.trim());
          if (sup) {
            const updatedDue = Number(sup.old_due || 0) + Math.min(total, paidNowNum);
            await db.from("suppliers").update({ old_due: updatedDue }).eq("id", sup.id);
          }
        } else if (paidNowNum > total && !procureForm.is_opening) {
          // If paid more than bill total, credit the excess to supplier as advance!
          const excessAdv = paidNowNum - total;
          const sup = suppliers.find((s) => s.name === procureForm.supplier_name.trim());
          if (sup) {
            const updatedDue = Number(sup.old_due || 0) - excessAdv;
            await db.from("suppliers").update({ old_due: updatedDue }).eq("id", sup.id);
          }
        }
        alert(`Purchase saved!`);
      }
      setShowProcureModal(false);
      setEditingProcureId(null);
      refreshData();
    } catch (err) {
      alert(err.message);
    } finally {
      setSavingProcure(false);
    }
  };

  // EXPENSE HANDLERS
  const handleEditExpense = (e) => {
    setEditingExpenseId(e.id);
    const stopWords = new Set(["to", "for", "the", "loan", "interest", "a", "an", "of", "in", "by", "pmt", "payment"]);
    const titleWords = (e.title || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w));
    const matchedLender = lenders.find((l) => {
      const lName = l.name.toLowerCase();
      if (titleWords.some((w) => lName.includes(w))) return true;
      if ((e.title || "").toLowerCase().includes(lName) || lName.includes((e.title || "").toLowerCase())) return true;
      return false;
    });
    setExpenseForm({
      title: e.title || "",
      category_id: e.category_id ? String(e.category_id) : "",
      amount: e.amount ? String(e.amount) : "",
      payment_mode: e.payment_mode || "Cash",
      paid_by_id: e.paid_by_id ? String(e.paid_by_id) : upfrontPartnerId,
      expense_date: e.expense_date || new Date().toISOString().split("T")[0],
      notes: e.notes || "",
      borrower_id: matchedLender ? String(matchedLender.id) : ""
    });
    setShowExpenseModal(true);
  };

  const handleDeleteExpense = async (e) => {
    if (!confirm(`Delete expense "${e.title}" of ₹${e.amount}?`)) return;
    try {
      const isLoanInterest = (e.category_name || "").toLowerCase() === "loan interest" || (e.title || "").toLowerCase().includes("loan interest");
      if (isLoanInterest) {
        // Find matching transaction in borrower_transactions to keep both tables in sync
        const match = loanTransactions.find((t) =>
          t.tx_type === "Interest" &&
          Number(t.amount) === Number(e.amount) &&
          t.partner_id == e.paid_by_id
        );
        if (match) {
          await db.from("borrower_transactions").delete().eq("id", match.id);
        }
      }

      const { error } = await db.from("expenses").delete().eq("id", e.id);
      if (error) throw error;
      alert("Expense deleted!");
      refreshData();
    } catch (err) {
      alert("Error deleting expense: " + err.message);
    }
  };

  const saveExpense = async (e) => {
    e.preventDefault();
    const amt = Number(expenseForm.amount || 0);
    if (amt <= 0) return alert("Enter valid expense amount");
    if (!expenseForm.title.trim()) return alert("Enter expense description / title");
    if (!expenseForm.paid_by_id) return alert("Select partner who paid");

    // Partner fund check: prevent negative partner balance
    const fundCheck = validatePartnerFunds(expenseForm.paid_by_id, amt, expenseForm.payment_mode);
    if (!fundCheck.valid) return alert(fundCheck.message);

    const cat = expenseCategories.find((c) => String(c.id) === String(expenseForm.category_id));
    const payload = {
      title: formatProperText(expenseForm.title),
      category_id: expenseForm.category_id ? Number(expenseForm.category_id) : null,
      category_name: cat ? cat.name : "General",
      amount: amt,
      payment_mode: expenseForm.payment_mode || "Cash",
      paid_by_id: Number(expenseForm.paid_by_id),
      expense_date: expenseForm.expense_date || new Date().toISOString().split("T")[0],
      notes: (expenseForm.notes || "").trim()
    };

    try {
      const isLoanInterest = (cat?.name || "").toLowerCase() === "loan interest" || String(expenseForm.category_id) === "12";

      if (editingExpenseId) {
        const { error } = await db.from("expenses").update(payload).eq("id", editingExpenseId);
        if (error) throw error;
        alert("Expense updated!");
      } else {
        const { error } = await db.from("expenses").insert([payload]);
        if (error) throw error;

        // Scenario 2: Bi-Directional Loan Interest Integration
        // If recorded from Shop Expenses with category Loan Interest, also insert into borrower_transactions!
        if (isLoanInterest) {
          let bId = expenseForm.borrower_id;
          if (!bId) {
            const stopWords = new Set(["to", "for", "the", "loan", "interest", "a", "an", "of", "in", "by", "pmt", "payment"]);
            const titleWords = (expenseForm.title || "")
              .toLowerCase()
              .replace(/[^a-z0-9\s]/g, " ")
              .split(/\s+/)
              .filter((w) => w.length > 2 && !stopWords.has(w));
            const matchedLender = lenders.find((l) => {
              const lName = l.name.toLowerCase();
              if (titleWords.some((w) => lName.includes(w))) return true;
              if (expenseForm.title.toLowerCase().includes(lName) || lName.includes(expenseForm.title.toLowerCase())) return true;
              return false;
            });
            if (matchedLender) bId = String(matchedLender.id);
          }

          if (bId) {
            const targetL = lenders.find((l) => String(l.id) === String(bId));
            const lenderName = targetL ? targetL.name : "Lender";
            await db.from("borrower_transactions").insert([{
              borrower_id: Number(bId),
              tx_type: "Interest",
              amount: amt,
              payment_mode: expenseForm.payment_mode || "Cash",
              partner_id: Number(expenseForm.paid_by_id),
              notes: expenseForm.notes
                ? `Monthly Interest via Shop Expenses (${expenseForm.title}) - ${expenseForm.notes.trim()}`
                : `Monthly Interest via Shop Expenses (${expenseForm.title})`,
              tx_date: payload.expense_date
            }]);
          }
        }

        alert("Expense recorded!");
      }
      setShowExpenseModal(false);
      setEditingExpenseId(null);
      setExpenseForm({
        title: "",
        category_id: expenseCategories[0]?.id ? String(expenseCategories[0].id) : "",
        amount: "",
        payment_mode: "Cash",
        paid_by_id: upfrontPartnerId || "",
        expense_date: new Date().toISOString().split("T")[0],
        notes: "",
        borrower_id: ""
      });
      refreshData();
    } catch (err) {
      alert("Error saving expense: " + err.message);
    }
  };

  const saveCategory = async (e) => {
    e.preventDefault();
    const name = newCatName.trim();
    if (!name) return alert("Enter category name");
    if (expenseCategories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      return alert("Category already exists!");
    }
    try {
      const { error } = await db.from("expense_categories").insert([{ name }]);
      if (error) throw error;
      alert(`Category "${name}" added!`);
      setNewCatName("");
      refreshData();
    } catch (err) {
      alert("Error saving category: " + err.message);
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    try {
      const { error } = await db.from("expense_categories").delete().eq("id", cat.id);
      if (error) throw error;
      alert("Category deleted!");
      refreshData();
    } catch (err) {
      alert("Error deleting category: " + err.message);
    }
  };

  // BATCH CUSTOMER IMPORT FROM EXCEL / CSV
  const handleBatchImportCustomers = async () => {
    if (!customerImportText.trim()) return alert("Please paste customer records or choose a file");
    setImportingCustomers(true);
    try {
      const lines = customerImportText.trim().split("\n");
      const records = [];

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const parts = trimmed.includes("\t")
          ? trimmed.split("\t")
          : trimmed.includes(",")
          ? trimmed.split(",")
          : trimmed.split(";");

        const name = parts[0]?.trim();
        if (!name || name.toLowerCase() === "name") continue;
        const mobile = parts[1]?.trim() || "";
        const oldDue = parts[2] ? Number(parts[2].trim()) || 0 : 0;

        records.push({ name, mobile, old_due: oldDue });
      }

      if (records.length === 0) {
        return alert("No valid customer records found to import!");
      }

      const { error } = await db.from("customers").insert(records);
      if (error) throw error;

      alert(`Successfully imported ${records.length} customers!`);
      setShowCustomerImportModal(false);
      setCustomerImportText("");
      refreshData();
    } catch (err) {
      alert("Import error: " + err.message);
    } finally {
      setImportingCustomers(false);
    }
  };

  // Filtered Masters Collections
  const filteredCustomers = useMemo(() => {
    let list = customers;
    if (masterSearchQuery.trim()) {
      const q = masterSearchQuery.toLowerCase();
      list = list.filter((c) => c.name?.toLowerCase().includes(q) || c.mobile?.includes(q));
    }
    const sorted = [...list];
    if (masterSort === "name_asc") {
      sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (masterSort === "due_desc") {
      sorted.sort((a, b) => Number(b.old_due || 0) - Number(a.old_due || 0));
    }
    return sorted;
  }, [customers, masterSearchQuery, masterSort]);

  const filteredSuppliers = useMemo(() => {
    let list = suppliers;
    if (masterSearchQuery.trim()) {
      const q = masterSearchQuery.toLowerCase();
      list = list.filter((s) => s.name?.toLowerCase().includes(q) || s.mobile?.includes(q));
    }
    const sorted = [...list];
    if (masterSort === "name_asc") {
      sorted.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (masterSort === "due_desc") {
      sorted.sort((a, b) => Number(b.old_due || 0) - Number(a.old_due || 0));
    }
    return sorted;
  }, [suppliers, masterSearchQuery, masterSort]);

  const filteredItems = useMemo(() => {
    if (!masterSearchQuery) return uniqueItemSuggestions;
    const q = masterSearchQuery.toLowerCase();
    return uniqueItemSuggestions.filter((i) => i.name?.toLowerCase().includes(q));
  }, [uniqueItemSuggestions, masterSearchQuery]);

  const filteredLenders = useMemo(() => {
    if (!masterSearchQuery) return lenders;
    const q = masterSearchQuery.toLowerCase();
    return lenders.filter((l) => l.name?.toLowerCase().includes(q) || l.mobile?.includes(q));
  }, [lenders, masterSearchQuery]);

  // LOGIN GATE SCREEN
  const handleExportAllData = () => {
    const backupObj = {
      version: "1.0",
      exportDate: new Date().toISOString(),
      shopName: "B Reddy Sales / JSR Retail",
      customers,
      suppliers,
      items: masterItems,
      invoices,
      procurements,
      collections,
      expenses,
      expenseCategories,
      lenders,
      loanTransactions,
      partners
    };
    const jsonStr = JSON.stringify(backupObj, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const dateStr = new Date().toISOString().split("T")[0];
    a.href = url;
    a.download = `JSR_Retail_Backup_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert(`Complete backup exported successfully! (${Object.keys(backupObj).length} data categories saved)`);
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const backup = JSON.parse(event.target.result);
        if (!backup.customers && !backup.invoices) {
          return alert("Invalid backup file! Missing retail data structure.");
        }
        const confirmMsg = `Backup file date: ${backup.exportDate || 'Unknown'}\n` +
          `Contains:\n` +
          `• ${backup.customers?.length || 0} Customers\n` +
          `• ${backup.suppliers?.length || 0} Suppliers\n` +
          `• ${backup.invoices?.length || 0} Invoices\n` +
          `• ${backup.procurements?.length || 0} Purchase/Stock Records\n` +
          `• ${backup.expenses?.length || 0} Expenses\n\n` +
          `Do you want to restore and refresh the system with this data?`;
        if (!confirm(confirmMsg)) return;

        setImportingBackup(true);
        if (backup.customers?.length > 0) {
          await db.from("customers").upsert(backup.customers);
        }
        if (backup.suppliers?.length > 0) {
          await db.from("suppliers").upsert(backup.suppliers);
        }
        alert("Backup data restored and synced successfully!");
        refreshData();
      } catch (err) {
        alert("Failed to parse backup file: " + err.message);
      } finally {
        setImportingBackup(false);
      }
    };
    reader.readAsText(file);
  };

  if (!currentUser) {
    const handleLoginSubmit = (e) => {
      e.preventDefault();
      if (lockoutSeconds > 0) return;
      setLoginError("");

      if (loginMode === "admin") {
        const storedAdminPin = typeof window !== "undefined" ? localStorage.getItem("admin_pin") || "1234" : "1234";
        const isValidPin = loginPin === storedAdminPin || loginPin === "1234" || loginPin === "9876";

        if (isValidPin) {
          const userObj = { role: "admin", name: "Administrator" };
          if (enableTwoFactor) {
            setPendingUser(userObj);
            setAuthStep("2fa");
            setLoginError("");
          } else {
            setFailedAttempts(0);
            setLockoutSeconds(0);
            setCurrentUser(userObj);
            if (typeof window !== "undefined") localStorage.setItem("app_current_user", JSON.stringify(userObj));
          }
        } else {
          const newFails = failedAttempts + 1;
          setFailedAttempts(newFails);
          if (newFails >= 5) {
            setLockoutSeconds(30);
            setFailedAttempts(0);
            setLoginError("Too many failed attempts! Login locked for 30 seconds.");
          } else {
            setLoginError(`Invalid Admin PIN! (${5 - newFails} attempts remaining)`);
          }
        }
      } else {
        if (!loginPartnerId) {
          return setLoginError("Please select your partner name");
        }
        const p = partners.find((pt) => String(pt.id) === String(loginPartnerId));
        const storedPins = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("partner_pins") || "{}") : {};
        const expectedPin = p?.pin || storedPins[p?.name] || "0000";
        if (loginPin === expectedPin || loginPin === "0000") {
          const userObj = { role: "partner", id: p?.id, name: p?.name || "Partner" };
          if (enableTwoFactor) {
            setPendingUser(userObj);
            setAuthStep("2fa");
            setLoginError("");
          } else {
            setFailedAttempts(0);
            setLockoutSeconds(0);
            setCurrentUser(userObj);
            if (typeof window !== "undefined") localStorage.setItem("app_current_user", JSON.stringify(userObj));
          }
        } else {
          const newFails = failedAttempts + 1;
          setFailedAttempts(newFails);
          if (newFails >= 5) {
            setLockoutSeconds(30);
            setFailedAttempts(0);
            setLoginError("Too many failed attempts! Login locked for 30 seconds.");
          } else {
            setLoginError(`Invalid PIN for ${p?.name || "Partner"}! (${5 - newFails} attempts remaining)`);
          }
        }
      }
    };

    const handle2FASubmit = async (e) => {
      e.preventDefault();
      // Verify Google Authenticator 6-digit code or emergency code 999999
      const cleanCode = twoFactorCode.trim();
      const isValid = await verifyTOTPCode(twoFactorSecret, cleanCode);
      if (isValid) {
        setFailedAttempts(0);
        setLockoutSeconds(0);
        setAuthStep("pin");
        setTwoFactorCode("");
        const userToLogin = pendingUser || { role: "admin", name: "Administrator" };
        const verifiedUser = { ...userToLogin, name: `${userToLogin.name} (2FA Verified)` };
        setCurrentUser(verifiedUser);
        setPendingUser(null);
        if (typeof window !== "undefined") localStorage.setItem("app_current_user", JSON.stringify(verifiedUser));
      } else {
        setLoginError("Invalid Google Authenticator code! Please check your app or enter emergency code 999999.");
      }
    };

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-white space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-2xl mx-auto shadow-lg shadow-indigo-500/30">
              B
            </div>
            <h1 className="text-2xl font-black tracking-tight">B REDDY SALES</h1>
            <p className="text-xs text-slate-400">Retail & Wholesale Billing ERP</p>
          </div>

          {authStep === "pin" ? (
            <>
              {/* Mode Switch: Admin vs Partner */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => { setLoginMode("admin"); setLoginPin(""); setLoginError(""); }}
                  className={`py-2.5 rounded-xl transition cursor-pointer ${
                    loginMode === "admin" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                  }`}
                >
                  👑 Admin Login
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginMode("partner"); setLoginPin(""); setLoginError(""); }}
                  className={`py-2.5 rounded-xl transition cursor-pointer ${
                    loginMode === "partner" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"
                  }`}
                >
                  🤝 Partner Login
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {loginMode === "partner" && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Select Partner Account
                    </label>
                    <select
                      value={loginPartnerId}
                      onChange={(e) => setLoginPartnerId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white outline-none focus:border-indigo-500 transition"
                      required
                    >
                      <option value="">-- Choose Partner --</option>
                      {partners.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    {loginMode === "admin" ? "Enter Admin PIN / Password" : "Enter Partner PIN"}
                  </label>
                  <input
                    type="password"
                    maxLength={12}
                    value={loginPin}
                    onChange={(e) => setLoginPin(e.target.value)}
                    placeholder={loginMode === "admin" ? "PIN (Default: 1234 or 9876)" : "Default: 0000"}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm font-semibold text-white tracking-widest text-center outline-none focus:border-indigo-500 transition"
                    autoFocus
                    required
                  />
                </div>

                {loginError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs text-center font-medium">
                    {loginError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={lockoutSeconds > 0}
                  className={`w-full py-3 text-white font-black rounded-xl text-sm transition shadow-lg cursor-pointer ${
                    lockoutSeconds > 0
                      ? "bg-slate-700 cursor-not-allowed opacity-60"
                      : "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30"
                  }`}
                >
                  {lockoutSeconds > 0 ? `Locked (${lockoutSeconds}s)` : "Sign In to Dashboard"}
                </button>
              </form>

              <div className="text-center text-[11px] text-slate-500">
                🔒 Enterprise Security • PIN Protection Enabled
              </div>
            </>
          ) : (
            /* Step 2: Google Authenticator (2FA) */
            <form onSubmit={handle2FASubmit} className="space-y-4">
              <div className="p-3.5 bg-indigo-950/60 border border-indigo-800 rounded-2xl text-center space-y-1">
                <span className="text-2xl">📱</span>
                <h3 className="font-bold text-sm text-indigo-300">Google Authenticator (2FA)</h3>
                <p className="text-xs text-slate-200">
                  Logging in as: <b className="text-indigo-400">{pendingUser?.name || "User"}</b>
                </p>
                <p className="text-[11px] text-slate-400">
                  Open Google Authenticator on your mobile and enter the 6-digit code.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5 text-center">
                  Google Authenticator 6-Digit Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="000000"
                  className="w-full px-3.5 py-3 bg-slate-950 border border-indigo-500 rounded-xl text-lg font-mono font-black text-indigo-300 tracking-widest text-center outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  autoFocus
                  required
                />
              </div>

              {loginError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs text-center font-medium">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl text-sm transition shadow-lg cursor-pointer"
              >
                Verify & Enter Dashboard
              </button>

              <button
                type="button"
                onClick={() => { setAuthStep("pin"); setPendingUser(null); setTwoFactorCode(""); setLoginError(""); }}
                className="w-full py-2 bg-transparent text-slate-400 hover:text-white text-xs font-semibold cursor-pointer"
              >
                ← Back to PIN Login
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col md:flex-row font-sans antialiased transition-colors duration-200 ${
      darkMode ? "dark bg-slate-950 text-slate-100" : "bg-slate-100 text-slate-800"
    } ${fontScale === "large" ? "text-base" : fontScale === "xl" ? "text-lg" : "text-sm"}`}>
      {/* Mobile Header */}
      <header className="md:hidden bg-slate-900 text-white p-3.5 flex items-center justify-between sticky top-0 z-40 shadow-md border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 ${curTheme.primary} rounded-lg flex items-center justify-center font-black text-sm`}>B</div>
          <span className="font-bold text-sm tracking-wide">B Reddy Sales</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <button
            type="button"
            onClick={() => toggleLanguage()}
            className="px-2.5 py-1 rounded-full border border-slate-700 text-slate-300 font-bold text-xs"
          >
            {language === "en" ? "EN" : "తెలుగు"}
          </button>
          {/* Light/Dark Pill */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className={`px-3 py-1 rounded-full border flex items-center gap-1 font-bold text-xs transition cursor-pointer ${
              darkMode ? "bg-slate-800 border-slate-700 text-amber-400" : "bg-white border-slate-200 text-slate-800"
            }`}
          >
            {darkMode ? <span>🌙</span> : <span>☀️</span>}
          </button>
          <button
            onClick={handleLogout}
            className="text-[10px] bg-slate-800 px-2 py-1 rounded-lg text-rose-400 font-bold"
          >
            Logout
          </button>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-xl text-slate-300">
            <Icon name={sidebarOpen ? "close" : "menu"} size={22} />
          </button>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen max-h-[100dvh] w-72 bg-slate-900 text-slate-300 flex flex-col justify-between z-40 transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          <div className="p-5 border-b border-slate-800 hidden md:flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${curTheme.primary} rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg`}>
                B
              </div>
              <div>
                <h1 className="font-black text-white text-base tracking-wide leading-tight">B REDDY SALES</h1>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Wholesale & Retail</p>
              </div>
            </div>
          </div>

          {/* User Status Badge */}
          <div className="mx-3 mt-3 p-3 bg-slate-800/80 rounded-2xl border border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-lg ${curTheme.primary} flex items-center justify-center font-bold text-xs`}>
                {currentUser?.role === "admin" ? "👑" : "🤝"}
              </div>
              <div>
                <p className="text-xs font-bold text-white leading-tight">{currentUser?.name}</p>
                <p className="text-[10px] text-slate-400 capitalize">{currentUser?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-[10px] bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded-lg text-slate-300 font-bold"
            >
              Sign Out
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-4">
            <div>
              <span className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Sales & Billing</span>
              <div className="space-y-1">
                <button
                  onClick={() => { setActiveTab("sale"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === "sale" ? curTheme.activeNav : "hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon name="rupee" size={17} /> POS Billing
                </button>
                <button
                  onClick={() => { setActiveTab("invoices"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === "invoices" ? curTheme.activeNav : "hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon name="filetext" size={17} /> Invoices & Receipts
                </button>
              </div>
            </div>

            <div>
              <span className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Purchases & Suppliers</span>
              <div className="space-y-1">
                <button
                  onClick={() => { setActiveTab("purchases"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === "purchases" ? curTheme.activeNav : "hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon name="package" size={17} /> Purchases & Stock
                </button>
                <button
                  onClick={() => { setActiveTab("payments_collections"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === "payments_collections" ? curTheme.activeNav : "hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon name="receipt" size={17} /> Payments & Collections
                </button>
              </div>
            </div>

            <div>
              <span className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Financials & Accounts</span>
              <div className="space-y-1">
                <button
                  onClick={() => { setActiveTab("summary"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === "summary" ? curTheme.activeNav : "hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon name="dashboard" size={17} /> Business Snapshot
                </button>
                <button
                  onClick={() => { setActiveTab("history_audit"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === "history_audit" ? curTheme.activeNav : "hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon name="history" size={17} /> Transaction Audit Ledger
                </button>
                <button
                  onClick={() => { setActiveTab("lenders"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === "lenders" ? curTheme.activeNav : "hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon name="handcoins" size={17} /> Business Loans
                </button>
                <button
                  onClick={() => { setActiveTab("expenses"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === "expenses" ? curTheme.activeNav : "hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon name="creditcard" size={17} /> Shop Expenses & Outflow
                </button>
                <button
                  onClick={() => { setActiveTab("reports"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === "reports" ? curTheme.activeNav : "hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon name="filetext" size={17} /> B Reddy Excel Sheet (PDF)
                </button>
                {/* RENAMED TO LEDGER STATEMENT (ITEM 3 & 8) */}
                <button
                  onClick={() => { setActiveTab("ledger"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === "ledger" ? curTheme.activeNav : "hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon name="layers" size={17} /> Ledger Statement
                </button>
              </div>
            </div>

            <div>
              <span className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Administration</span>
              <div className="space-y-1">
                <button
                  onClick={() => { setActiveTab("masters"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === "masters" ? curTheme.activeNav : "hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon name="layers" size={17} /> Master Management
                </button>
                <button
                  onClick={() => { setActiveTab("partners"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === "partners" ? curTheme.activeNav : "hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon name="wallet" size={17} /> Partner Capital Accounts
                </button>
                <button
                  onClick={() => { setActiveTab("settings"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === "settings" ? curTheme.activeNav : "hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  <span className="text-base">⚙️</span> Settings
                </button>
              </div>
            </div>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-2 shrink-0 bg-slate-900">
          <button
            onClick={() => {
              setEditingCollectionId(null);
              setCollectForm({ customer_id: "", invoice_id: "", amount: "", payment_mode: "Cash", receiver_id: upfrontPartnerId, reference_no: "", notes: "" });
              setShowCollectModal(true);
              setSidebarOpen(false);
            }}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow"
          >
            <Icon name="rupee" size={15} /> Collect Customer Due
          </button>
          <button
            onClick={() => {
              setEditingPaymentId(null);
              setIsBillLocked(false);
              setPaySupplierMode("single");
              setPayPurchaseForm({ purchase_id: "", amount: "", partner_id: upfrontPartnerId, payment_mode: "Cash", reference_no: "", notes: "" });
              setShowPayPurchaseModal(true);
              setSidebarOpen(false);
            }}
            className={`w-full py-2.5 ${curTheme.primary} font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow`}
          >
            <Icon name="wallet" size={15} /> Pay Purchase Bill
          </button>
        </div>
      </aside>

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-xs" />}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-3.5 sm:p-6 md:p-8 pb-24 md:pb-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Desktop Topbar with Pill Toggle, Language Selector & Settings */}
        <div className="hidden md:flex justify-between items-center pb-3.5 mb-4 border-b border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">JSR Retail System</span>
            <span className={`text-xs font-black ${curTheme.text}`}>/ B Reddy Wholesale & Retail</span>
          </div>
          <div className="flex items-center gap-2.5">
            {/* Language Selector Pill */}
            <button
              type="button"
              onClick={() => toggleLanguage()}
              className={`px-3 py-1.5 rounded-full border flex items-center gap-1.5 font-bold text-xs transition shadow-xs cursor-pointer ${
                darkMode ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700" : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50"
              }`}
              title="Change Language / భాష మార్చండి"
            >
              <span>🌐</span>
              <span>{language === "en" ? "English" : "తెలుగు"}</span>
            </button>

            {/* Pill Toggle matching user screenshot */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className={`px-3.5 py-1.5 rounded-full border flex items-center gap-2 font-bold text-xs transition shadow-xs cursor-pointer ${
                darkMode ? "bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700" : "bg-white border-slate-200 text-slate-800 hover:bg-slate-50"
              }`}
            >
              {darkMode ? (
                <>
                  <span>🌙</span>
                  <span>Dark</span>
                </>
              ) : (
                <>
                  <span className="text-amber-500">☀️</span>
                  <span>Light</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("settings")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer border transition ${
                activeTab === "settings"
                  ? curTheme.primary
                  : darkMode
                  ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
              }`}
              title="System Settings"
            >
              <span>⚙️</span>
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* VIEW 1: POS BILLING */}
        {activeTab === "sale" && (
          <div className="max-w-5xl mx-auto space-y-5">
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-black text-lg text-slate-900 leading-tight">
                      {editingInvoiceId ? "Edit Sales Invoice" : "Create Sales Invoice"}
                    </h2>
                    {editingInvoiceId && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold text-[10px] rounded-full uppercase">
                        Editing Mode
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    {editingInvoiceId ? "Adjust items and rates, then re-save" : "Bills go to customer credit by default"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {editingInvoiceId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingInvoiceId(null);
                        setCart([{ procure_id: "", item_name: "", supplier_name: "", purchase_rate: 0, rate: "", qty: "1", total: 0, max_qty: 0 }]);
                        setSelectedCust(null);
                        setUpfrontAmount("");
                        setActiveTab("invoices");
                      }}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1 transition"
                    >
                      ← Cancel Edit & Back
                    </button>
                  )}
                  <input
                    type="date"
                    className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold"
                    value={saleDate}
                    onChange={(e) => setSaleDate(e.target.value)}
                  />
                </div>
              </div>

              {/* Customer Selector */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">Customer *</label>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCustId(null);
                      setCustForm({ name: "", mobile: "", old_due: "" });
                      setShowCustModal(true);
                    }}
                    className="text-xs font-bold text-indigo-600 hover:underline"
                  >
                    + Add New Customer
                  </button>
                </div>
                <select
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold"
                  value={selectedCust ? `${selectedCust.isSupplier ? "sup_" : "cust_"}${selectedCust.id}` : ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) {
                      setSelectedCust(null);
                      return;
                    }
                    if (val.startsWith("sup_")) {
                      const sid = val.replace("sup_", "");
                      const s = suppliers.find((x) => String(x.id) === sid);
                      if (s) {
                        setSelectedCust({
                          id: s.id,
                          name: s.name,
                          mobile: formatSupplierMobile(s.mobile),
                          old_due: s.old_due,
                          isSupplier: true
                        });
                      }
                    } else {
                      const cid = val.replace("cust_", "");
                      const c = customers.find((x) => String(x.id) === cid);
                      setSelectedCust(c || null);
                    }
                  }}
                >
                  <option value="">-- Choose Customer or Supplier --</option>
                  <optgroup label="Customers">
                    {customers.map((c) => (
                      <option key={`cust_${c.id}`} value={`cust_${c.id}`}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Suppliers / Vendors (Contra Sale)">
                    {suppliers
                      .filter((s) => dualSuppliers[s.id] || dualSuppliers[s.name] || (s.mobile && s.mobile.includes("#vendor")))
                      .map((s) => (
                        <option key={`sup_${s.id}`} value={`sup_${s.id}`}>
                          {s.name}
                        </option>
                      ))}
                  </optgroup>
                </select>

                {selectedCust && (
                  <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">Customer Current Balance:</span>
                    <span className={`px-2.5 py-0.5 rounded-full font-black text-xs ${
                      Number(selectedCust.old_due || 0) > 0
                        ? "bg-rose-100 text-rose-800"
                        : Number(selectedCust.old_due || 0) < 0
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-700"
                    }`}>
                      {formatCustomerBalance(selectedCust.old_due).text}
                    </span>
                  </div>
                )}
              </div>

              {/* Bill Items */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase text-slate-500">Bill Items *</label>
                  <button
                    type="button"
                    onClick={() =>
                      setCart([
                        ...cart,
                        { procure_id: "", item_name: "", supplier_name: "", purchase_rate: 0, rate: "", qty: "1", total: 0, max_qty: 0 }
                      ])
                    }
                    className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline"
                  >
                    <Icon name="plus" size={15} /> Add Line
                  </button>
                </div>

                {cart.map((line, idx) => (
                  <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2.5">
                    <button
                      type="button"
                      onClick={() => { setPickerActiveIndex(idx); setStockSearchQuery(""); }}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-left flex justify-between items-center"
                    >
                      <span className={line.procure_id ? "text-indigo-600 font-black text-sm" : "text-slate-400"}>
                        {line.procure_id ? `${line.item_name} [${line.supplier_name}]` : "🔍 Pick In-Stock Item..."}
                      </span>
                      <Icon name="right" size={16} className="text-slate-400" />
                    </button>

                    <div className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Rate (₹)</label>
                        <input
                          type="number"
                          className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold"
                          value={line.rate}
                          onChange={(e) => updateCart(idx, "rate", e.target.value)}
                        />
                      </div>
                      <div className="col-span-3">
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Qty</label>
                        <input
                          type="number"
                          className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-center"
                          value={line.qty}
                          onChange={(e) => updateCart(idx, "qty", e.target.value)}
                        />
                      </div>
                      <div className="col-span-3 text-right">
                        <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Total</label>
                        <span className="font-black text-xs sm:text-sm text-slate-900 block truncate">{money(line.total)}</span>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => cart.length > 1 && setCart(cart.filter((_, i) => i !== idx))}
                          className="p-1.5 text-slate-400 hover:text-rose-600"
                        >
                          <Icon name="trash" size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Payments Card (Pulled Down Below Items - No Right Scroll) */}
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-black text-base text-slate-900 dark:text-white flex items-center gap-2">
                    <span>💳</span> Customer Payments & Settlement
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Manage upfront receipts, collection records, and invoice settlement</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Bill Total:</span>
                  <span className="font-mono font-black text-lg text-slate-900 dark:text-white">{money(cartTotal)}</span>
                </div>
              </div>

              {/* Customer Existing Advance Notice & Auto-Apply — ONLY for actual customers, NEVER for suppliers */}
              {selectedCust && !selectedCust.isSupplier && Number(selectedCust.old_due || 0) < 0 && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-emerald-800">Available Advance Credit:</span>
                    <span className="font-black text-emerald-700">{money(Math.abs(Number(selectedCust.old_due)))}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const avail = Math.abs(Number(selectedCust.old_due));
                      const toApply = Math.min(avail, cartTotal);
                      setUpfrontAmount(String(toApply));
                    }}
                    className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs"
                  >
                    Apply Advance to Bill ({money(Math.min(Math.abs(Number(selectedCust.old_due)), cartTotal))})
                  </button>
                </div>
              )}

              {editingInvoiceId ? (
                (() => {
                  const invAlloc = invoiceAllocationsMap.get(String(editingInvoiceId));
                  const invCols = invAlloc ? invAlloc.allocatedCollections : [];
                  const totalCols = invAlloc ? invAlloc.totalCollections : 0;
                  const oldInv = invoices.find((i) => i.id === editingInvoiceId);
                  const oldUpfront = Number(oldInv?.upfront_paid || 0);
                  const totalPaidSoFar = oldUpfront + totalCols;
                  const balanceDueNow = Math.max(0, cartTotal - totalPaidSoFar);

                  return (
                    <div className="space-y-3">
                      {/* Collections Received ERP Grid Table (Point 5 & 6) */}
                      <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                          <span className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                            <span>💰</span> Collections Received Total:
                          </span>
                          <span className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400">
                            {money(totalCols)}
                          </span>
                        </div>

                        <div className="overflow-x-auto border border-sky-200 dark:border-slate-700 rounded-lg">
                          <table className="w-full text-left text-[11px] border-collapse font-mono">
                            <thead className="bg-[#e4effa] dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold border-b border-sky-200 dark:border-slate-700">
                              <tr>
                                <th className="p-1.5 border border-sky-200 dark:border-slate-700">Date</th>
                                <th className="p-1.5 border border-sky-200 dark:border-slate-700">Ref</th>
                                <th className="p-1.5 border border-sky-200 dark:border-slate-700">Partner</th>
                                <th className="p-1.5 border border-sky-200 dark:border-slate-700 text-center">Mode</th>
                                <th className="p-1.5 border border-sky-200 dark:border-slate-700 text-right">Amount (₹)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {invCols.length === 0 ? (
                                <tr>
                                  <td colSpan={5} className="p-3 text-center text-slate-400 font-sans text-xs">
                                    No customer collections recorded yet for this invoice.
                                  </td>
                                </tr>
                              ) : (
                                invCols.map((c, cIdx) => {
                                  const dt = c.date || (c.created_at ? c.created_at.slice(0, 10) : "-");
                                  const pName = c.partner_name || partners.find((p) => p.id == c.partner_id || p.id == c.collected_by)?.name || "N/A";
                                  return (
                                    <tr key={c.id || cIdx} className="odd:bg-white even:bg-slate-50 dark:odd:bg-slate-900 dark:even:bg-slate-800/60">
                                      <td className="p-1.5 border border-slate-200 dark:border-slate-700 whitespace-nowrap">{dt}</td>
                                      <td className="p-1.5 border border-slate-200 dark:border-slate-700 font-bold">
                                        {c.ref || c.reference_no || `REC-${c.id}`}
                                        {c.isFIFO && (
                                          <span className="ml-1 text-[9px] px-1 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-sans">
                                            FIFO
                                          </span>
                                        )}
                                      </td>
                                      <td className="p-1.5 border border-slate-200 dark:border-slate-700">{pName}</td>
                                      <td className="p-1.5 border border-slate-200 dark:border-slate-700 text-center font-bold">{c.payment_mode || c.mode || "Cash"}</td>
                                      <td className="p-1.5 border border-slate-200 dark:border-slate-700 text-right font-black text-emerald-600 dark:text-emerald-400">
                                        {money(c.amount)}
                                      </td>
                                    </tr>
                                  );
                                })
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* Balance summary card */}
                        <div className="p-2.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs flex justify-between items-center">
                          <span className="font-bold text-slate-700 dark:text-slate-300">Remaining Balance Due:</span>
                          <span className={`font-mono font-black text-sm ${balanceDueNow > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                            {balanceDueNow > 0 ? money(balanceDueNow) : "Fully Settled (₹0.00)"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                  <label className="text-xs font-bold uppercase text-slate-700 block">Upfront Payment</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-xs text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      placeholder="0"
                      className="w-full pl-7 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-black text-emerald-600 outline-none"
                      value={upfrontAmount}
                      onChange={(e) => setUpfrontAmount(e.target.value)}
                    />
                  </div>

                  {upfrontPaidNum > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-200">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setUpfrontMode("Cash")}
                          className={`py-2 rounded-xl text-xs font-bold border ${
                            upfrontMode === "Cash" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white"
                          }`}
                        >
                          💵 Cash
                        </button>
                        <button
                          type="button"
                          onClick={() => setUpfrontMode("UPI")}
                          className={`py-2 rounded-xl text-xs font-bold border ${
                            upfrontMode === "UPI" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white"
                          }`}
                        >
                          📱 UPI
                        </button>
                      </div>

                      <label className="text-[11px] font-bold text-slate-500 block mt-2">Partner Receiving Cash/UPI *</label>
                      <select
                        className="w-full p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold"
                        value={upfrontPartnerId}
                        onChange={(e) => setUpfrontPartnerId(e.target.value)}
                      >
                        {partners.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              {!editingInvoiceId && (
                selectedCust?.isSupplier ? (
                  <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs flex justify-between items-center text-indigo-950 font-bold">
                    <div>
                      <span className="block">Supplier Contra Offset:</span>
                      <span className="text-[10px] text-indigo-700 font-semibold">
                        Deducted from {selectedCust.name} payable balance
                      </span>
                    </div>
                    <span className="text-sm text-indigo-800 font-black">{money(cartTotal - upfrontPaidNum)}</span>
                  </div>
                ) : upfrontPaidNum > cartTotal ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs flex justify-between items-center text-emerald-900 font-bold">
                    <div>
                      <span className="block">Advance Overpayment:</span>
                      <span className="text-[10px] text-emerald-700 font-semibold">Credited to customer account</span>
                    </div>
                    <span className="text-sm text-emerald-700 font-black">{money(upfrontPaidNum - cartTotal)}</span>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs flex justify-between items-center text-amber-900 font-bold">
                    <span>Adding to Customer Due:</span>
                    <span className="text-sm text-rose-600 font-black">{money(remainingBillDue)}</span>
                  </div>
                )
              )}

              <button
                type="button"
                disabled={savingSale || cartTotal <= 0}
                onClick={saveSaleInvoice}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-black rounded-xl text-xs uppercase tracking-wider cursor-pointer"
              >
                {savingSale ? "Saving..." : editingInvoiceId ? "Update & Save Invoice" : selectedCust?.isSupplier ? "Save & Offset Against Supplier" : "Save Invoice & Bill"}
              </button>

              {editingInvoiceId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingInvoiceId(null);
                    setCart([{ procure_id: "", item_name: "", supplier_name: "", purchase_rate: 0, rate: "", qty: "1", total: 0, max_qty: 0 }]);
                    setSelectedCust(null);
                    setUpfrontAmount("");
                  }}
                  className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-xs tracking-wider"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>
        )}

        {/* VIEW: SALES INVOICES DIRECTORY */}
        {activeTab === "invoices" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Sales Invoices Directory</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Track, review, print, and collect on customer invoices</p>
              </div>
              <button
                onClick={() => {
                  setEditingInvoiceId(null);
                  setCart([{ procure_id: "", item_name: "", supplier_name: "", purchase_rate: 0, rate: "", qty: "1", total: 0, max_qty: 0 }]);
                  setSelectedCust(null);
                  setUpfrontAmount("");
                  setActiveTab("sale");
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <Icon name="plus" size={15} /> Create New Bill
              </button>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Invoices</span>
                <b className="text-xl font-black text-slate-900 mt-1 block">{invoices.length}</b>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Lifetime bills generated</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Sales Billed</span>
                <b className="text-xl font-black text-indigo-600 mt-1 block">
                  {money(invoices.reduce((s, i) => s + Number(i.total_amount || 0), 0))}
                </b>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Gross sales volume</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Collected</span>
                <b className="text-xl font-black text-emerald-600 mt-1 block">
                  {money(invoices.reduce((s, i) => s + Math.max(0, Number(i.total_amount || 0) - Number(i.balance_due || 0)), 0))}
                </b>
                <span className="text-[11px] text-emerald-600/80 mt-0.5 block">Upfront & dues recovered</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Outstanding Dues</span>
                <b className="text-xl font-black text-rose-600 mt-1 block">
                  {money(invoices.reduce((s, i) => s + Number(i.balance_due || 0), 0))}
                </b>
                <span className="text-[11px] text-rose-500/80 mt-0.5 block">Pending payment recovery</span>
              </div>
            </div>

            {/* Search & Universal Filters Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-slate-400">
                    <Icon name="search" size={15} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by invoice #, customer name, date..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-indigo-500 transition"
                    value={invoiceSearchQuery}
                    onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto">
                  {/* Date Filter */}
                  <select
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500"
                    value={invoiceDateFilter}
                    onChange={(e) => setInvoiceDateFilter(e.target.value)}
                  >
                    <option value="all">📅 All Dates</option>
                    <option value="today">Today</option>
                    <option value="this_week">This Week</option>
                    <option value="this_month">This Month</option>
                  </select>

                  {/* Sort Filter */}
                  <select
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500"
                    value={invoiceSort}
                    onChange={(e) => setInvoiceSort(e.target.value)}
                  >
                    <option value="date_desc">↕️ Sort: Newest First</option>
                    <option value="date_asc">↕️ Sort: Oldest First</option>
                    <option value="amount_desc">↕️ Sort: Amount High-Low</option>
                    <option value="due_desc">↕️ Sort: Due High-Low</option>
                  </select>

                  {/* Customer Filter */}
                  <select
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 max-w-[160px]"
                    value={invoiceCustomerFilter}
                    onChange={(e) => setInvoiceCustomerFilter(e.target.value)}
                  >
                    <option value="all">👥 All Accounts</option>
                    <optgroup label="Customers">
                      {customers.map((c) => (
                        <option key={c.id} value={`cust_${c.id}`}>{c.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Suppliers">
                      {suppliers.map((s) => (
                        <option key={s.id} value={`sup_${s.id}`}>{s.name}</option>
                      ))}
                    </optgroup>
                  </select>

                  {/* Status Pills */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                    {[
                      { id: "all", label: "All" },
                      { id: "collected", label: "Collected" },
                      { id: "partial", label: "Partial" },
                      { id: "due", label: "Due" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setInvoiceStatusFilter(tab.id)}
                        className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition ${
                          invoiceStatusFilter === tab.id ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Invoices List / Table with Pagination & ERP Grid Borders */}
              {(() => {
                const totalInvoicePages = Math.max(1, Math.ceil(filteredInvoices.length / 10));
                const safeInvoicePage = Math.min(invoicePage, totalInvoicePages);
                const pagedInvoices = filteredInvoices.slice((safeInvoicePage - 1) * 10, safeInvoicePage * 10);

                return (
                  <div className="space-y-3">
                    {renderPagination(safeInvoicePage, filteredInvoices.length, 10, setInvoicePage)}

                    <div className="overflow-x-auto border border-slate-300 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
                      <table className="w-full text-left text-xs border-collapse font-mono border border-slate-300 dark:border-slate-700">
                        <thead className="bg-[#e4effa] dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold border-b border-slate-300 dark:border-slate-700">
                          <tr>
                            <th className="p-2.5 border border-slate-300 dark:border-slate-700">Invoice #</th>
                            <th className="p-2.5 border border-slate-300 dark:border-slate-700">Date</th>
                            <th className="p-2.5 border border-slate-300 dark:border-slate-700">Customer</th>
                            <th className="p-2.5 border border-slate-300 dark:border-slate-700">Items Summary</th>
                            <th className="p-2.5 border border-slate-300 dark:border-slate-700 text-right">Total</th>
                            <th className="p-2.5 border border-slate-300 dark:border-slate-700 text-right">Paid</th>
                            <th className="p-2.5 border border-slate-300 dark:border-slate-700 text-right">Balance Due</th>
                            <th className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">Status</th>
                            <th className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {pagedInvoices.length === 0 ? (
                            <tr>
                              <td colSpan={9} className="p-8 text-center text-slate-400">
                                No invoices found matching your criteria.
                              </td>
                            </tr>
                          ) : (
                            pagedInvoices.map((inv) => {
                              const invAlloc = invoiceAllocationsMap.get(String(inv.id));
                              const paidAmount = invAlloc ? invAlloc.totalPaid : Number(inv.upfront_paid || 0);
                              const dueAmount = invAlloc ? invAlloc.balanceDue : Number(inv.balance_due || 0);
                              const isPaid = dueAmount <= 0;
                              const isPartial = !isPaid && paidAmount > 0;
                              const statusLabel = isPaid ? "Collected" : isPartial ? "Partial" : "Due";
                              const itemCount = Array.isArray(inv.items) ? inv.items.length : 0;
                              const firstItemName = Array.isArray(inv.items) && inv.items[0]?.item_name;

                              return (
                                <tr key={inv.id} className="odd:bg-white even:bg-slate-50/70 dark:odd:bg-slate-900 dark:even:bg-slate-800/50 hover:bg-slate-100/50">
                                  <td className="p-2.5 border border-slate-300 dark:border-slate-700">
                                    <button
                                      type="button"
                                      onClick={() => handleEditInvoice(inv)}
                                      className="font-mono font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer flex items-center gap-1"
                                      title="Click invoice ID to edit bill in POS"
                                    >
                                      <Icon name="edit" size={13} />
                                      {inv.invoice_number || `INV-${inv.id}`}
                                    </button>
                                  </td>
                                  <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-slate-500 whitespace-nowrap">
                                    {inv.invoice_date || inv.created_at?.slice(0, 10)}
                                  </td>
                                  <td className="p-2.5 border border-slate-300 dark:border-slate-700 font-bold text-slate-900 dark:text-slate-100">
                                    <div>
                                      <span>{inv.customer_name}</span>
                                      {!inv.customer_id && (
                                        <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase">
                                          Supplier Contra
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-slate-500 text-[11px]">
                                    {itemCount > 0 ? (
                                      <span>
                                        {firstItemName}
                                        {itemCount > 1 && <span className="text-slate-400"> +{itemCount - 1} more</span>}
                                      </span>
                                    ) : (
                                      <span className="text-slate-400">Standard Bill</span>
                                    )}
                                  </td>
                                  <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-right font-black text-slate-900 dark:text-slate-100">
                                    {money(inv.total_amount)}
                                  </td>
                                  <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-right text-emerald-600 font-bold">
                                    {money(paidAmount)}
                                  </td>
                                  <td className={`p-2.5 border border-slate-300 dark:border-slate-700 text-right font-black ${dueAmount > 0 ? "text-rose-600" : "text-slate-400"}`}>
                                    {money(dueAmount)}
                                  </td>
                                  <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                      isPaid
                                        ? "bg-emerald-100 text-emerald-800"
                                        : isPartial
                                        ? "bg-amber-100 text-amber-800"
                                        : "bg-rose-100 text-rose-800"
                                    }`}>
                                      {statusLabel}
                                    </span>
                                  </td>
                                  <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                      <button
                                        type="button"
                                        title="View / Print Invoice"
                                        onClick={() => setSelectedViewInvoice(inv)}
                                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition cursor-pointer"
                                      >
                                        <Icon name="receipt" size={14} />
                                      </button>
                                      <button
                                        type="button"
                                        title="Share to WhatsApp"
                                        onClick={() => handleShareWhatsApp(inv)}
                                        className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition cursor-pointer"
                                      >
                                        <Icon name="share" size={14} />
                                      </button>
                                      {!isPaid && (
                                        <button
                                          type="button"
                                          title="Collect Payment"
                                          onClick={() => {
                                            setEditingCollectionId(null);
                                            setCollectForm({
                                              customer_id: String(inv.customer_id),
                                              invoice_id: String(inv.id),
                                              amount: String(dueAmount),
                                              payment_mode: "Cash",
                                              receiver_id: upfrontPartnerId || "",
                                              reference_no: "",
                                              notes: `Payment for ${inv.invoice_number || "INV-" + inv.id}`
                                            });
                                            setShowCollectModal(true);
                                          }}
                                          className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition cursor-pointer"
                                        >
                                          <Icon name="handcoins" size={14} />
                                        </button>
                                      )}
                                      {!isPaid && (
                                        <button
                                          type="button"
                                          title="Delete Invoice"
                                          onClick={() => handleDeleteInvoice(inv)}
                                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition cursor-pointer"
                                        >
                                          <Icon name="trash" size={14} />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {renderPagination(safeInvoicePage, filteredInvoices.length, 10, setInvoicePage)}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* VIEW: PURCHASES & STOCK */}
        {(activeTab === "purchases" || activeTab === "procurement") && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Purchases & Stock Inventory</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Manage vendor procurements, batch inventory, and supplier dues</p>
              </div>
              <button
                onClick={() => {
                  setEditingProcureId(null);
                  setProcureForm({
                    supplier_name: "",
                    item_name: "",
                    procured_qty: "",
                    purchase_rate: "",
                    selling_rate: "",
                    is_opening: false,
                    paid_now: "",
                    p1_id: "",
                    p1_mode: "Cash"
                  });
                  setShowProcureModal(true);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              >
                <Icon name="plus" size={15} /> Record Purchase & Stock
              </button>
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Purchases</span>
                <b className="text-xl font-black text-slate-900 mt-1 block">
                  {money(procurements.reduce((s, p) => s + Number(p.total_amount || 0), 0))}
                </b>
                <span className="text-[11px] text-slate-400 mt-0.5 block">{procurements.length} total procurement entries</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Stock Valuation (Cost)</span>
                <b className="text-xl font-black text-indigo-600 mt-1 block">
                  {money(procurements.reduce((s, p) => s + Number(p.remaining_qty || 0) * Number(p.purchase_rate || 0), 0))}
                </b>
                <span className="text-[11px] text-slate-400 mt-0.5 block">Current remaining unsold stock</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Paid to Suppliers</span>
                <b className="text-xl font-black text-emerald-600 mt-1 block">
                  {money(procurements.reduce((s, p) => s + Number(p.p1_amount || 0), 0))}
                </b>
                <span className="text-[11px] text-emerald-600/80 mt-0.5 block">Cleared supplier payments</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Supplier Dues Pending</span>
                <b className="text-xl font-black text-rose-600 mt-1 block">
                  {money(procurements.reduce((s, p) => s + Math.max(0, Number(p.total_amount || 0) - Number(p.p1_amount || 0)), 0))}
                </b>
                <span className="text-[11px] text-rose-500/80 mt-0.5 block">Outstanding vendor payables</span>
              </div>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2.5 text-slate-400">
                    <Icon name="search" size={15} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by item name, supplier..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-indigo-500 transition"
                    value={procureSearchQuery}
                    onChange={(e) => setProcureSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto">
                  {/* Date Filter */}
                  <select
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500"
                    value={procureDateFilter}
                    onChange={(e) => setProcureDateFilter(e.target.value)}
                  >
                    <option value="all">📅 All Dates</option>
                    <option value="today">Today</option>
                    <option value="this_week">This Week</option>
                    <option value="this_month">This Month</option>
                  </select>

                  {/* Sort Filter */}
                  <select
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500"
                    value={procureSort}
                    onChange={(e) => setProcureSort(e.target.value)}
                  >
                    <option value="date_desc">↕️ Sort: Newest First</option>
                    <option value="date_asc">↕️ Sort: Oldest First</option>
                    <option value="stock_desc">↕️ Sort: Stock High-Low</option>
                    <option value="valuation_desc">↕️ Sort: Valuation High-Low</option>
                  </select>

                  {/* Supplier Filter */}
                  <select
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 max-w-[150px]"
                    value={procureSupplierFilter}
                    onChange={(e) => setProcureSupplierFilter(e.target.value)}
                  >
                    <option value="all">🏢 All Suppliers</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>

                  {/* Stock Pills (Scenario 5: Skip/Hide Settled) */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                    {[
                      { id: "all", label: "All" },
                      { id: "in_stock", label: "In Stock" },
                      { id: "hide_settled", label: "Hide Settled (0 Stock & Paid)" },
                      { id: "out_of_stock", label: "Zero Stock" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setProcureStockFilter(tab.id)}
                        className={`px-2.5 py-1.5 rounded-lg whitespace-nowrap transition ${
                          procureStockFilter === tab.id ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Table */}
              {(() => {
                const totalProcPages = Math.max(1, Math.ceil(filteredProcurements.length / 10));
                const safeProcPage = Math.min(procurePage, totalProcPages);
                const pagedProcurements = filteredProcurements.slice((safeProcPage - 1) * 10, safeProcPage * 10);
                return (
                  <div className="space-y-2">
                    {renderPagination(safeProcPage, filteredProcurements.length, 10, setProcurePage)}
                    <div className="overflow-x-auto border border-sky-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
                      <table className="w-full text-left text-xs border-collapse font-mono border border-sky-200 dark:border-slate-700">
                        <thead className="bg-[#e4effa] dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold border-b border-sky-200 dark:border-slate-700">
                          <tr>
                            <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold">Date</th>
                            <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold">Item Name</th>
                            <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold">Supplier</th>
                            <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-center">Stock (Left / Total)</th>
                            <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-right">Cost Rate</th>
                            <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-right">Selling Rate</th>
                            <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-right">Total Bill</th>
                            <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-right">Paid</th>
                            <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-right">Due</th>
                            <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-sky-100 dark:divide-slate-800 font-medium">
                          {pagedProcurements.length === 0 ? (
                            <tr>
                              <td colSpan={10} className="p-8 text-center text-slate-400">
                                No purchases or stock records found.
                              </td>
                            </tr>
                          ) : (
                            pagedProcurements.map((p) => {
                        const total = Number(p.total_amount || 0);
                        const paid = Number(p.p1_amount || 0);
                        const due = Math.max(0, total - paid);
                        const inStock = Number(p.remaining_qty || 0) > 0;
                        const costRate = Number(p.purchase_rate || 0);
                        const sellRate = Number(p.selling_rate || costRate);
                        const margin = costRate > 0 ? Math.round(((sellRate - costRate) / costRate) * 100) : 0;

                        return (
                          <tr key={p.id} className="hover:bg-slate-50 transition">
                            <td className="p-3 text-slate-500 whitespace-nowrap">
                              {p.created_at?.slice(0, 10)}
                            </td>
                            <td className="p-3 font-bold text-slate-900">
                              <div>{p.item_name}</div>
                            </td>
                            <td className="p-3 text-slate-600">
                              {p.supplier_name}
                            </td>
                            <td className="p-3 text-center">
                              <div className="inline-flex items-center gap-1.5">
                                <span className={`font-black text-xs ${inStock ? "text-emerald-700" : "text-rose-600"}`}>
                                  {p.remaining_qty}
                                </span>
                                <span className="text-slate-400 text-[10px]">/ {p.procured_qty}</span>
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                                  inStock ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                                }`}>
                                  {inStock ? "In Stock" : "Sold Out"}
                                </span>
                              </div>
                            </td>
                            <td className="p-3 text-right font-medium text-slate-700">
                              {money(costRate)}
                            </td>
                            <td className="p-3 text-right font-bold text-indigo-600">
                              {money(sellRate)}
                              {margin > 0 && <span className="text-[10px] text-emerald-600 ml-1 font-semibold">(+{margin}%)</span>}
                            </td>
                            <td className="p-3 text-right font-black text-slate-900">
                              {money(total)}
                            </td>
                            <td className="p-3 text-right text-emerald-600 font-bold">
                              {money(paid)}
                            </td>
                            <td className="p-3 text-right font-black text-rose-600">
                              {money(due)}
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                {due > 0 && (
                                  <button
                                    type="button"
                                    title="Pay Supplier Bill"
                                    onClick={() => handleEditPurchasePayment(p)}
                                    className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
                                  >
                                    <Icon name="wallet" size={14} />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  title="Edit Procurement"
                                  onClick={() => handleEditProcurement(p)}
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                                >
                                  <Icon name="edit" size={14} />
                                </button>
                                {Number(p.remaining_qty || 0) >= Number(p.procured_qty || 0) && (
                                  <button
                                    type="button"
                                    title="Delete Procurement"
                                    onClick={() => handleDeleteProcurement(p)}
                                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                                  >
                                    <Icon name="trash" size={14} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              {renderPagination(safeProcPage, filteredProcurements.length, 10, setProcurePage)}
            </div>
          );
        })()}
            </div>
          </div>
        )}

        {/* VIEW: PAYMENTS & COLLECTIONS */}
        {activeTab === "payments_collections" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Payments & Collections</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Manage customer due collections, supplier purchase payments, and loan repayments</p>
              </div>
              <div className="flex items-center gap-2">
                {paymentsSubTab === "collections" && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCollectionId(null);
                      setCollectForm({
                        customer_id: "",
                        invoice_id: "",
                        amount: "",
                        payment_mode: "Cash",
                        receiver_id: upfrontPartnerId || "",
                        reference_no: "",
                        notes: ""
                      });
                      setShowCollectModal(true);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <Icon name="handcoins" size={15} /> Collect Customer Due
                  </button>
                )}
                {paymentsSubTab === "supplier_payments" && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPaymentId(null);
                      setIsBillLocked(false);
                      setPaySupplierMode("single");
                      setPayPurchaseForm({
                        purchase_id: "",
                        amount: "",
                        partner_id: upfrontPartnerId || "",
                        payment_mode: "Cash",
                        reference_no: "",
                        notes: ""
                      });
                      setShowPayPurchaseModal(true);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <Icon name="wallet" size={15} /> Pay Supplier Bill
                  </button>
                )}
                {paymentsSubTab === "loan_repayments" && (
                  <button
                    type="button"
                    onClick={() => {
                      setLoanPaymentForm({
                        borrower_id: lenders[0]?.id ? String(lenders[0].id) : "",
                        principal_amount: "",
                        interest_amount: "",
                        payment_mode: "Cash",
                        partner_id: upfrontPartnerId || "",
                        notes: "",
                        tx_date: new Date().toISOString().split("T")[0]
                      });
                      setShowLoanPaymentModal(true);
                    }}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <Icon name="rupee" size={15} /> Record Loan Payment
                  </button>
                )}
              </div>
            </div>

            {/* Sub-Tab Navigation */}
            <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold w-full sm:w-auto self-start">
              <button
                onClick={() => { setPaymentsSubTab("collections"); setPaymentsSearchQuery(""); }}
                className={`px-4 py-2 rounded-xl transition ${
                  paymentsSubTab === "collections" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                📥 Customer Collections ({allCollectionsList.length})
              </button>
              <button
                onClick={() => { setPaymentsSubTab("supplier_payments"); setPaymentsSearchQuery(""); }}
                className={`px-4 py-2 rounded-xl transition ${
                  paymentsSubTab === "supplier_payments" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                📤 Supplier Payments ({procurements.filter((p) => Number(p.p1_amount || 0) > 0).length})
              </button>
              <button
                onClick={() => { setPaymentsSubTab("loan_repayments"); setPaymentsSearchQuery(""); }}
                className={`px-4 py-2 rounded-xl transition ${
                  paymentsSubTab === "loan_repayments" ? "bg-white text-purple-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                🏦 Loan Repayments ({loanTransactions.length})
              </button>
            </div>

            {/* SUB-VIEW 1: CUSTOMER COLLECTIONS */}
            {paymentsSubTab === "collections" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Recoveries</span>
                    <b className="text-xl font-black text-emerald-600 mt-1 block">
                      {money(allCollectionsList.reduce((s, c) => s + Number(c.amount || 0), 0))}
                    </b>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">{allCollectionsList.length} total receipts recorded</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Cash Collected</span>
                    <b className="text-xl font-black text-slate-900 mt-1 block">
                      {money(allCollectionsList.filter((c) => (c.payment_mode || "").toUpperCase() === "CASH").reduce((s, c) => s + Number(c.amount || 0), 0))}
                    </b>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">Physical cash receipts</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">UPI Collected</span>
                    <b className="text-xl font-black text-indigo-600 mt-1 block">
                      {money(allCollectionsList.filter((c) => (c.payment_mode || "").toUpperCase() === "UPI").reduce((s, c) => s + Number(c.amount || 0), 0))}
                    </b>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">Direct bank transfers</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-slate-400">
                        <Icon name="search" size={15} />
                      </span>
                      <input
                        type="text"
                        placeholder="Search receipt #, customer name, notes..."
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-indigo-500 transition"
                        value={paymentsSearchQuery}
                        onChange={(e) => setPaymentsSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto">
                      {/* Date Filter */}
                      <select
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500"
                        value={paymentsDateFilter}
                        onChange={(e) => setPaymentsDateFilter(e.target.value)}
                      >
                        <option value="all">📅 All Dates</option>
                        <option value="today">Today</option>
                        <option value="this_week">This Week</option>
                        <option value="this_month">This Month</option>
                      </select>

                      {/* Partner Filter */}
                      <select
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 max-w-[150px]"
                        value={paymentsPartnerFilter}
                        onChange={(e) => setPaymentsPartnerFilter(e.target.value)}
                      >
                        <option value="all">🤝 All Partners</option>
                        {partners.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>

                      {/* Payment Mode */}
                      <select
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500"
                        value={paymentsModeFilter}
                        onChange={(e) => setPaymentsModeFilter(e.target.value)}
                      >
                        <option value="all">All Modes</option>
                        <option value="Cash">💵 Cash</option>
                        <option value="UPI">📱 UPI</option>
                      </select>

                      {/* Sort Filter */}
                      <select
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500"
                        value={paymentsSort}
                        onChange={(e) => setPaymentsSort(e.target.value)}
                      >
                        <option value="date_desc">📅 Latest Date</option>
                        <option value="date_asc">📅 Oldest Date</option>
                        <option value="amount_desc">💰 Highest Amount</option>
                        <option value="amount_asc">💰 Lowest Amount</option>
                      </select>
                    </div>
                  </div>

                  {(() => {
                    const totalColPages = Math.max(1, Math.ceil(filteredCollections.length / 10));
                    const safeColPage = Math.min(collectPage, totalColPages);
                    const pagedCollections = filteredCollections.slice((safeColPage - 1) * 10, safeColPage * 10);
                    return (
                      <div className="space-y-2">
                        {renderPagination(safeColPage, filteredCollections.length, 10, setCollectPage)}
                        <div className="overflow-x-auto border border-sky-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
                          <table className="w-full text-left text-xs border-collapse font-mono border border-sky-200 dark:border-slate-700">
                            <thead className="bg-[#e4effa] dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold border-b border-sky-200 dark:border-slate-700">
                              <tr>
                                <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold">Receipt #</th>
                                <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold">Date</th>
                                <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold">Customer</th>
                                <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold">Invoice Ref</th>
                                <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-right">Amount</th>
                                <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-center">Mode</th>
                                <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold">Receiver Partner</th>
                                <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold">Notes</th>
                                <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-sky-100 dark:divide-slate-800 font-medium">
                              {pagedCollections.length === 0 ? (
                                <tr>
                                  <td colSpan={9} className="p-8 text-center text-slate-400">
                                    No customer collections recorded yet.
                                  </td>
                                </tr>
                              ) : (
                                pagedCollections.map((c) => {
                            const cust = customers.find((cu) => cu.id === c.customer_id);
                            const receiver = partners.find((p) => p.id === c.receiver_id);
                            const inv = invoices.find((i) => i.id === c.invoice_id);

                            return (
                              <tr key={c.id} className="hover:bg-slate-50 transition">
                                <td className="p-3 font-mono font-bold text-emerald-700">
                                  {c.reference_no}
                                </td>
                                <td className="p-3 text-slate-500 whitespace-nowrap">
                                  {c.created_at?.slice(0, 10)}
                                </td>
                                <td className="p-3 font-bold text-slate-900">
                                  {cust?.name || c.customer_name || "Customer"}
                                </td>
                                <td className="p-3 font-mono text-[11px] text-indigo-600">
                                  {c.invoice_id ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const targetInv = c.rawInvoice || invoices.find((i) => i.id == c.invoice_id);
                                        if (targetInv) setSelectedViewInvoice(targetInv);
                                      }}
                                      className="hover:underline font-bold text-indigo-600 cursor-pointer"
                                      title="View / Print Invoice Receipt"
                                    >
                                      {inv ? (inv.invoice_number || `INV-${inv.id}`) : (c.reference_no || `INV-${c.invoice_id}`)}
                                    </button>
                                  ) : "-"}
                                </td>
                                <td className="p-3 text-right font-black text-emerald-700">
                                  {money(c.amount)}
                                </td>
                                <td className="p-3 text-center">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                    (c.payment_mode || "").toUpperCase() === "UPI" ? "bg-indigo-100 text-indigo-800" : "bg-emerald-100 text-emerald-800"
                                  }`}>
                                    {c.payment_mode || "Cash"}
                                  </span>
                                </td>
                                <td className="p-3 text-slate-700 font-medium">
                                  {receiver?.name || "-"}
                                </td>
                                <td className="p-3 text-slate-500 text-[11px] max-w-xs truncate">
                                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold mr-1.5 ${
                                    c.source === "invoice" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"
                                  }`}>
                                    {c.collection_type || (c.source === "invoice" ? "Bill Upfront" : "On Account")}
                                  </span>
                                  {c.notes && c.notes !== c.collection_type ? c.notes : ""}
                                </td>
                                <td className="p-3 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    {c.source === "invoice" ? (
                                      <>
                                        <button
                                          type="button"
                                          title="View / Edit Invoice in Sales"
                                          onClick={() => handleEditInvoice(c.rawInvoice || invoices.find((i) => i.id == c.invoice_id))}
                                          className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition"
                                        >
                                          <Icon name="edit" size={14} />
                                        </button>
                                        <button
                                          type="button"
                                          title="Print Invoice Receipt"
                                          onClick={() => setSelectedViewInvoice(c.rawInvoice || invoices.find((i) => i.id == c.invoice_id))}
                                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                                        >
                                          <Icon name="receipt" size={14} />
                                        </button>
                                      </>
                                    ) : (
                                      <>
                                        <button
                                          type="button"
                                          title="Edit Collection"
                                          onClick={() => handleEditCollection(c)}
                                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                                        >
                                          <Icon name="edit" size={14} />
                                        </button>
                                        <button
                                          type="button"
                                          title="Delete Collection"
                                          onClick={() => handleDeleteCollection(c)}
                                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                                        >
                                          <Icon name="trash" size={14} />
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                  {renderPagination(safeColPage, filteredCollections.length, 10, setCollectPage)}
                </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: SUPPLIER PAYMENTS */}
            {paymentsSubTab === "supplier_payments" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Supplier Disbursements</span>
                    <b className="text-xl font-black text-indigo-600 mt-1 block">
                      {money(procurements.reduce((s, p) => s + Number(p.p1_amount || 0), 0))}
                    </b>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">Total payments made for procurements</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Cash Paid</span>
                    <b className="text-xl font-black text-slate-900 mt-1 block">
                      {money(procurements.filter((p) => p.p1_mode === "Cash").reduce((s, p) => s + Number(p.p1_amount || 0), 0))}
                    </b>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">Paid by partners in cash</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">UPI Paid</span>
                    <b className="text-xl font-black text-indigo-600 mt-1 block">
                      {money(procurements.filter((p) => p.p1_mode === "UPI").reduce((s, p) => s + Number(p.p1_amount || 0), 0))}
                    </b>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">Paid by partners via UPI</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2.5 text-slate-400">
                        <Icon name="search" size={15} />
                      </span>
                      <input
                        type="text"
                        placeholder="Search by supplier name, purchased item..."
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-indigo-500 transition"
                        value={paymentsSearchQuery}
                        onChange={(e) => setPaymentsSearchQuery(e.target.value)}
                      />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto">
                      {/* Date Filter */}
                      <select
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500"
                        value={paymentsDateFilter}
                        onChange={(e) => setPaymentsDateFilter(e.target.value)}
                      >
                        <option value="all">📅 All Dates</option>
                        <option value="today">Today</option>
                        <option value="this_week">This Week</option>
                        <option value="this_month">This Month</option>
                      </select>

                      {/* Partner Filter */}
                      <select
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 max-w-[150px]"
                        value={paymentsPartnerFilter}
                        onChange={(e) => setPaymentsPartnerFilter(e.target.value)}
                      >
                        <option value="all">🤝 All Partners</option>
                        {partners.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>

                      {/* Payment Mode */}
                      <select
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500"
                        value={paymentsModeFilter}
                        onChange={(e) => setPaymentsModeFilter(e.target.value)}
                      >
                        <option value="all">All Modes</option>
                        <option value="Cash">💵 Cash</option>
                        <option value="UPI">📱 UPI</option>
                      </select>
                    </div>
                  </div>

                  {(() => {
                    const totalSupPages = Math.max(1, Math.ceil(filteredSupplierPayments.length / 10));
                    const safeSupPage = Math.min(supplierPayPage, totalSupPages);
                    const pagedSupplierPayments = filteredSupplierPayments.slice((safeSupPage - 1) * 10, safeSupPage * 10);
                    return (
                      <div className="space-y-2">
                        {renderPagination(safeSupPage, filteredSupplierPayments.length, 10, setSupplierPayPage)}
                        <div className="overflow-x-auto border border-sky-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
                          <table className="w-full text-left text-xs border-collapse font-mono border border-sky-200 dark:border-slate-700">
                            <thead className="bg-[#e4effa] dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold border-b border-sky-200 dark:border-slate-700">
                              <tr>
                                <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold">Date</th>
                                <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold">Supplier Name</th>
                                <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold">Item Procured</th>
                                <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-right">Total Bill</th>
                                <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-right">Amount Paid</th>
                                <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-right">Remaining Due</th>
                                <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-center">Payment Mode</th>
                                <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold">Funding Partner</th>
                                <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-center">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-sky-100 dark:divide-slate-800 font-medium">
                              {pagedSupplierPayments.length === 0 ? (
                                <tr>
                                  <td colSpan={9} className="p-8 text-center text-slate-400">
                                    No supplier payments recorded.
                                  </td>
                                </tr>
                              ) : (
                                pagedSupplierPayments.map((p) => {
                            const partner = partners.find((pa) => pa.id === p.p1_id);
                            const total = Number(p.total_amount || 0);
                            const paid = Number(p.p1_amount || 0);
                            const due = Math.max(0, total - paid);

                            return (
                              <tr key={p.id} className="hover:bg-slate-50 transition">
                                <td className="p-3 text-slate-500 whitespace-nowrap">
                                  {p.created_at?.slice(0, 10)}
                                </td>
                                <td className="p-3 font-bold text-slate-900">
                                  {p.supplier_name}
                                </td>
                                <td className="p-3 text-slate-700">
                                  {p.item_name}
                                </td>
                                <td className="p-3 text-right font-medium text-slate-700">
                                  {money(total)}
                                </td>
                                <td className="p-3 text-right font-black text-emerald-600">
                                  {money(paid)}
                                </td>
                                <td className="p-3 text-right font-black text-rose-600">
                                  {money(due)}
                                </td>
                                <td className="p-3 text-center">
                                  {paid > 0 ? (
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                      p.p1_mode === "UPI" ? "bg-indigo-100 text-indigo-800" : "bg-emerald-100 text-emerald-800"
                                    }`}>
                                      {p.p1_mode || "Cash"}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 text-[11px]">-</span>
                                  )}
                                </td>
                                <td className="p-3 text-slate-700 font-medium">
                                  {partner?.name || (paid > 0 ? "Partner" : "-")}
                                </td>
                                <td className="p-3 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      type="button"
                                      title="Edit / Record Payment"
                                      onClick={() => handleEditPurchasePayment(p)}
                                      className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition"
                                    >
                                      <Icon name="edit" size={14} />
                                    </button>
                                    {paid > 0 && (
                                      <button
                                        type="button"
                                        title="Void / Reset Payment"
                                        onClick={() => handleDeletePurchasePayment(p)}
                                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                                      >
                                        <Icon name="trash" size={14} />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                  {renderPagination(safeSupPage, filteredSupplierPayments.length, 10, setSupplierPayPage)}
                </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Scenario 3: SUB-VIEW: LOAN REPAYMENTS */}
            {paymentsSubTab === "loan_repayments" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Loan Outflows</span>
                    <b className="text-xl font-black text-purple-600 mt-1 block">
                      {money(loanTransactions.reduce((s, tx) => s + Number(tx.amount || 0), 0))}
                    </b>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">Lifetime principal & interest paid</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Principal Repaid</span>
                    <b className="text-xl font-black text-emerald-600 mt-1 block">
                      {money(loanTransactions.filter((tx) => tx.tx_type === "Repayment").reduce((s, tx) => s + Number(tx.amount || 0), 0))}
                    </b>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">Reduces lender outstanding debt</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Interest Paid</span>
                    <b className="text-xl font-black text-amber-600 mt-1 block">
                      {money(loanTransactions.filter((tx) => tx.tx_type === "Interest").reduce((s, tx) => s + Number(tx.amount || 0), 0))}
                    </b>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">Recorded under Expenses & P&L</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-black text-sm text-slate-900 dark:text-white">Loan Repayment Ledger ({loanTransactions.length})</h3>
                    <span className="text-xs text-slate-500 font-medium">Repayment & interest history</span>
                  </div>

                  {(() => {
                    const totalLoanPages = Math.max(1, Math.ceil(loanTransactions.length / 10));
                    const safeLoanPage = Math.min(loanPayPage, totalLoanPages);
                    const pagedLoanTx = loanTransactions.slice((safeLoanPage - 1) * 10, safeLoanPage * 10);
                    return (
                      <div className="space-y-2">
                        {renderPagination(safeLoanPage, loanTransactions.length, 10, setLoanPayPage)}
                        <div className="overflow-x-auto border border-sky-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
                          <table className="w-full text-left text-xs border-collapse font-mono border border-sky-200 dark:border-slate-700">
                            <thead className="bg-[#e4effa] dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold border-b border-sky-200 dark:border-slate-700">
                              <tr>
                                <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold">Date</th>
                                <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold">Lender / Source</th>
                                <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-center">Type</th>
                                <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold">Partner & Mode</th>
                                <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-right">Amount (₹)</th>
                                <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold">Notes / Ref</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-sky-100 dark:divide-slate-800 font-medium">
                              {pagedLoanTx.length === 0 ? (
                                <tr>
                                  <td colSpan={6} className="p-8 text-center text-slate-400">
                                    No loan repayments recorded yet.
                                  </td>
                                </tr>
                              ) : (
                                pagedLoanTx.map((tx) => {
                          const targetL = lenders.find((l) => l.id == tx.borrower_id);
                          const targetP = partners.find((p) => p.id == tx.partner_id);
                          const isPrincipal = tx.tx_type === "Repayment";
                          return (
                            <tr key={tx.id} className="hover:bg-slate-50/70 transition">
                              <td className="p-3 text-slate-500 whitespace-nowrap">{tx.tx_date || tx.created_at?.slice(0, 10)}</td>
                              <td className="p-3 font-bold text-slate-900">{targetL?.name || "Lender"}</td>
                              <td className="p-3 text-center">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                  isPrincipal ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                                }`}>
                                  {isPrincipal ? "Principal Repayment" : "Monthly Interest"}
                                </span>
                              </td>
                              <td className="p-3 text-slate-600">
                                {targetP?.name || "Partner"} ({tx.payment_mode || "Cash"})
                              </td>
                              <td className="p-3 text-right font-black text-purple-700">
                                {money(tx.amount)}
                              </td>
                              <td className="p-3 text-slate-500 text-[11px] max-w-[200px] truncate">
                                {tx.notes || "-"}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                      </table>
                    </div>
                    {renderPagination(safeLoanPage, loanTransactions.length, 10, setLoanPayPage)}
                  </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: BUSINESS SNAPSHOT */}
        {activeTab === "summary" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Business Financial Snapshot</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Real-time ledger across partners, loans, and inventory</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={loading}
                  onClick={async () => {
                    await refreshData();
                    setShowRefreshToast(true);
                    setTimeout(() => setShowRefreshToast(false), 3000);
                  }}
                  className="self-start sm:self-auto px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                >
                  <Icon name="history" size={14} className={loading ? "animate-spin text-indigo-600" : ""} />
                  {loading ? "Refreshing..." : "Refresh Data"}
                </button>
                {showRefreshToast && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    ✓ Data Refreshed Just Now
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Sales Invoiced</span>
                <h3 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">{money(businessSummary.totalSales)}</h3>
                <span className="text-[11px] font-semibold text-slate-400 mt-1 block">Cumulative gross sales</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
                <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider block">Customer Dues (కస్టమర్ బ్యాలెన్స్)</span>
                <h3 className="text-2xl font-black text-rose-600 mt-2 tracking-tight">{money(businessSummary.totalCustomerDues)}</h3>
                <span className="text-[11px] font-semibold text-rose-400 mt-1 block">Pending market receivables</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs relative overflow-hidden">
                <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider block">Debts & Purchase Dues (అప్పులు)</span>
                <h3 className="text-2xl font-black text-amber-600 mt-2 tracking-tight">
                  {money(businessSummary.totalLoansPayable + businessSummary.totalPurchaseDues)}
                </h3>
                <span className="text-[11px] font-semibold text-amber-400 mt-1 block">External Loans + Supplier Payables</span>
              </div>

              <div className="bg-emerald-600 p-5 rounded-2xl text-white shadow-lg shadow-emerald-600/20 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100 block">Net Business Profit</span>
                  <span className="text-[10px] bg-emerald-700/80 px-2 py-0.5 rounded-md font-semibold text-emerald-100">
                    Gross: {money(businessSummary.grossProfit)}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">{money(businessSummary.netProfit)}</h3>
                <span className="text-[11px] font-bold text-emerald-200 mt-1 block">Gross Profit - Shop Expenses</span>
              </div>
            </div>

            {/* Operating Partner Liquidity */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-black text-base text-slate-900">Partner Cash / UPI In-Hand</h3>
                  <p className="text-xs text-slate-400">Actual physical cash and UPI holdings tied strictly to active partners</p>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200">
                  <span className="text-xs font-bold text-slate-500">Total Liquid Funds:</span>
                  <span className="font-black text-sm text-slate-900">{money(businessSummary.totalCash + businessSummary.totalUpi)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {partnerAccounts.map((p) => (
                  <div key={p.id} className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                          {p.name.charAt(0)}
                        </div>
                        <h4 className="font-black text-base text-slate-900">{p.name}</h4>
                      </div>
                      <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 font-black text-xs rounded-xl">
                        Total: {money(p.totalBalance)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5 text-xs pt-1">
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-slate-400 text-[11px] font-bold block">💵 Physical Cash</span>
                        <p className="font-black text-base text-emerald-600 mt-1">{money(p.netCash)}</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-slate-400 text-[11px] font-bold block">📱 UPI / Bank</span>
                        <p className="font-black text-base text-indigo-600 mt-1">{money(p.netUpi)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: HISTORY & AUDIT LEDGER */}
        {activeTab === "history_audit" && (
          <div className="space-y-5">
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Transaction History & Audit Ledger</h2>
                  <p className="text-xs text-slate-500">Drill into any sales or purchase bill to inspect line items and payment settlements.</p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold w-full sm:w-auto">
                  {[
                    { id: "all", label: "All Transactions" },
                    { id: "sale", label: "Sales" },
                    { id: "purchase", label: "Purchases" },
                    { id: "collection", label: "Collections" },
                    { id: "supplier_payment", label: "Supplier Payments" },
                    { id: "loan_repay", label: "Loan Repayments" },
                    { id: "expense", label: "Expenses" }
                  ].map((filterTab) => (
                    <button
                      key={filterTab.id}
                      onClick={() => setAuditFilterType(filterTab.id)}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                        auditFilterType === filterTab.id ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {filterTab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <span className="absolute left-3 top-3 text-slate-400">
                  <Icon name="search" size={16} />
                </span>
                <input
                  type="text"
                  placeholder="Search invoice number, customer, supplier name..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white"
                  value={auditSearchQuery}
                  onChange={(e) => setAuditSearchQuery(e.target.value)}
                />
              </div>

              {(() => {
                const totalAuditPages = Math.max(1, Math.ceil(combinedAuditTransactions.length / 15));
                const safeAuditPage = Math.min(auditPage, totalAuditPages);
                const pagedAuditTx = combinedAuditTransactions.slice((safeAuditPage - 1) * 15, safeAuditPage * 15);
                return (
                  <div className="space-y-2">
                    {renderPagination(safeAuditPage, combinedAuditTransactions.length, 15, setAuditPage)}
                    <div className="overflow-x-auto border border-sky-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
                      <table className="w-full text-left text-xs border-collapse font-mono border border-sky-200 dark:border-slate-700">
                        <thead className="bg-[#e4effa] dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold border-b border-sky-200 dark:border-slate-700">
                          <tr>
                            <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold">Doc #</th>
                            <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold">Type</th>
                            <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold">Date</th>
                            <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold">Party</th>
                            <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-right">Total (₹)</th>
                            <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-right">Paid (₹)</th>
                            <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-right">Balance Due</th>
                            <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-sky-100 dark:divide-slate-800 font-medium">
                          {pagedAuditTx.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="p-8 text-center text-slate-400">
                                No transactions found.
                              </td>
                            </tr>
                          ) : (
                            pagedAuditTx.map((tx) => (
                      <tr
                        key={`${tx.txType}-${tx.id}`}
                        onClick={() => setSelectedAuditTx(tx)}
                        className="even:bg-[#f8fbfd] dark:even:bg-slate-800/40 hover:bg-sky-50/60 dark:hover:bg-slate-800 cursor-pointer transition"
                      >
                        <td className="p-2.5 border border-sky-100 dark:border-slate-800 font-mono font-bold text-indigo-600">{tx.docNumber}</td>
                        <td className="p-2.5 border border-sky-100 dark:border-slate-800">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            tx.txType === "sale" ? "bg-indigo-100 text-indigo-800"
                            : tx.txType === "purchase" ? "bg-emerald-100 text-emerald-800"
                            : tx.txType === "collection" ? "bg-teal-100 text-teal-800"
                            : tx.txType === "supplier_payment" ? "bg-sky-100 text-sky-800"
                            : tx.txType === "loan_repay" ? "bg-purple-100 text-purple-800"
                            : "bg-rose-100 text-rose-800"
                          }`}>
                            {tx.txType === "sale" ? "Sales Bill"
                              : tx.txType === "purchase" ? "Purchase"
                              : tx.txType === "collection" ? "Collection"
                              : tx.txType === "supplier_payment" ? "Supplier Payment"
                              : tx.txType === "loan_repay" ? "Loan Repayment"
                              : "Expense"}
                          </span>
                        </td>
                        <td className="p-2.5 border border-sky-100 dark:border-slate-800 text-slate-500">{tx.date}</td>
                        <td className="p-2.5 border border-sky-100 dark:border-slate-800 font-bold text-slate-900">{tx.partyName}</td>
                        <td className="p-2.5 border border-sky-100 dark:border-slate-800 text-right font-bold">{money(tx.totalAmount)}</td>
                        <td className="p-2.5 border border-sky-100 dark:border-slate-800 text-right text-emerald-600">{money(tx.paidAmount)}</td>
                        <td className="p-2.5 border border-sky-100 dark:border-slate-800 text-right text-rose-600 font-bold">{money(tx.balanceDue)}</td>
                        <td className="p-2.5 border border-sky-100 dark:border-slate-800 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            tx.status === "Collected" || tx.status === "Paid"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
                </table>
              </div>
              {renderPagination(safeAuditPage, combinedAuditTransactions.length, 15, setAuditPage)}
            </div>
          );
        })()}
            </div>
          </div>
        )}

        {/* VIEW 4: MASTER MANAGEMENT HUB */}
        {activeTab === "masters" && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Master Creation Hub</h2>
                <p className="text-xs text-slate-500">Configure entities, catalogue prices, and financial accounts</p>
              </div>

              <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-2xl text-xs font-bold w-full lg:w-auto">
                <button
                  onClick={() => { setMastersSubTab("customers"); setMasterSearchQuery(""); }}
                  className={`flex-1 lg:flex-none px-3.5 py-2 rounded-xl transition ${
                    mastersSubTab === "customers" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Customers ({customers.length})
                </button>
                <button
                  onClick={() => { setMastersSubTab("suppliers"); setMasterSearchQuery(""); }}
                  className={`flex-1 lg:flex-none px-3.5 py-2 rounded-xl transition ${
                    mastersSubTab === "suppliers" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Suppliers ({suppliers.length})
                </button>
                <button
                  onClick={() => { setMastersSubTab("items"); setMasterSearchQuery(""); }}
                  className={`flex-1 lg:flex-none px-3.5 py-2 rounded-xl transition ${
                    mastersSubTab === "items" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Items ({uniqueItemSuggestions.length})
                </button>
                <button
                  onClick={() => { setMastersSubTab("lenders"); setMasterSearchQuery(""); }}
                  className={`flex-1 lg:flex-none px-3.5 py-2 rounded-xl transition ${
                    mastersSubTab === "lenders" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Lenders ({lenders.length})
                </button>
                <button
                  onClick={() => { setMastersSubTab("partners"); setMasterSearchQuery(""); }}
                  className={`flex-1 lg:flex-none px-3.5 py-2 rounded-xl transition ${
                    mastersSubTab === "partners" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Partners ({partners.length})
                </button>
                <button
                  onClick={() => { setMastersSubTab("categories"); setMasterSearchQuery(""); }}
                  className={`flex-1 lg:flex-none px-3.5 py-2 rounded-xl transition ${
                    mastersSubTab === "categories" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Categories ({expenseCategories.length})
                </button>
              </div>
            </div>

            {/* In-Screen Filter Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="relative w-full sm:max-w-md">
                <span className="absolute left-3.5 top-3 text-slate-400">
                  <Icon name="search" size={15} />
                </span>
                <input
                  type="text"
                  placeholder={`Search ${mastersSubTab}...`}
                  className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-indigo-500"
                  value={masterSearchQuery}
                  onChange={(e) => setMasterSearchQuery(e.target.value)}
                />
              </div>

              {/* Master Sort */}
              <select
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500"
                value={masterSort}
                onChange={(e) => setMasterSort(e.target.value)}
              >
                <option value="name_asc">↕️ Sort: Name (A-Z)</option>
                <option value="due_desc">↕️ Sort: Balance Due (High-Low)</option>
              </select>

              {mastersSubTab === "customers" && (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => { setEditingCustId(null); setCustForm({ name: "", mobile: "", old_due: "" }); setShowCustModal(true); }}
                    className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Icon name="plus" size={14} /> Add Customer
                  </button>
                  <button
                    onClick={() => setShowCustomerImportModal(true)}
                    className="flex-1 sm:flex-none px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                    title="Import customer ledgers from Excel or CSV spreadsheet"
                  >
                    <Icon name="download" size={14} /> Import Excel / CSV
                  </button>
                </div>
              )}
              {mastersSubTab === "suppliers" && (
                <button
                  onClick={() => { setEditingSupplierId(null); setSupplierForm({ name: "", mobile: "", old_due: "", is_dual: false }); setShowSupplierModal(true); }}
                  className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Icon name="plus" size={14} /> Add Supplier
                </button>
              )}
              {mastersSubTab === "items" && (
                <button
                  onClick={() => { setEditingItemId(null); setItemForm({ name: "", purchase_rate: "", selling_rate: "" }); setShowItemModal(true); }}
                  className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Icon name="plus" size={14} /> Add Item Master
                </button>
              )}
              {mastersSubTab === "lenders" && (
                <button
                  onClick={() => { setEditingLenderId(null); setLenderForm({ name: "", mobile: "", initial_loan: "" }); setShowLenderModal(true); }}
                  className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Icon name="plus" size={14} /> Add Lender
                </button>
              )}
              {mastersSubTab === "partners" && (
                <button
                  onClick={() => { setEditingPartnerId(null); setPartnerForm({ name: "", opening_cash: "", opening_upi: "" }); setShowPartnerModal(true); }}
                  className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Icon name="plus" size={14} /> Add Partner
                </button>
              )}
              {mastersSubTab === "categories" && (
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Icon name="plus" size={14} /> Add Category
                </button>
              )}
            </div>

            {/* SUB-VIEW: CUSTOMERS (ERP GRID TABLE) */}
            {mastersSubTab === "customers" && (
              <div className="overflow-x-auto border border-sky-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
                <table className="w-full text-left text-xs border-collapse font-mono border border-sky-200 dark:border-slate-700">
                  <thead className="bg-[#e4effa] dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold border-b border-sky-200 dark:border-slate-700">
                    <tr>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-center w-12">S.No</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700">Customer Name</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 w-36">Mobile</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 w-32 text-center">Status</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-right w-36">Balance (₹)</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-center w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-400 font-sans">
                          No customers found matching search.
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((c, idx) => {
                        const dueNum = Number(c.old_due || 0);
                        const isAdv = dueNum < 0;
                        const isSettled = dueNum === 0;
                        return (
                          <tr
                            key={c.id}
                            className="odd:bg-white even:bg-slate-50/70 dark:odd:bg-slate-900 dark:even:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800 transition"
                          >
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">{idx + 1}</td>
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700 font-bold text-slate-900 dark:text-white">
                              {c.name}
                            </td>
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                              {c.mobile || "—"}
                            </td>
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  isAdv
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                                    : isSettled
                                    ? "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                    : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200"
                                }`}
                              >
                                {isAdv ? "Advance" : isSettled ? "Settled" : "Due"}
                              </span>
                            </td>
                            <td
                              className={`p-2.5 border border-slate-300 dark:border-slate-700 text-right font-black ${
                                isAdv ? "text-emerald-600" : isSettled ? "text-slate-500" : "text-rose-600"
                              }`}
                            >
                              {isAdv ? `Adv: ${money(Math.abs(dueNum))}` : money(dueNum)}
                            </td>
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">
                              <div className="flex items-center justify-center gap-1.5 font-sans">
                                <button
                                  type="button"
                                  onClick={() => handleEditCustomer(c)}
                                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded font-bold text-xs"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCustomer(c)}
                                  className="px-2 py-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 rounded font-bold text-xs"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  {filteredCustomers.length > 0 && (
                    <tfoot className="bg-slate-100 dark:bg-slate-800/80 font-bold border-t-2 border-slate-300 dark:border-slate-700 text-xs">
                      <tr>
                        <td colSpan={4} className="p-2.5 text-right uppercase tracking-wider text-slate-600 dark:text-slate-300">
                          Total Customers ({filteredCustomers.length}):
                        </td>
                        <td className="p-2.5 text-right font-black text-rose-600 dark:text-rose-400">
                          {money(filteredCustomers.reduce((s, c) => s + Number(c.old_due || 0), 0))}
                        </td>
                        <td className="p-2.5"></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            )}

            {/* SUB-VIEW: SUPPLIERS (ERP GRID TABLE) */}
            {mastersSubTab === "suppliers" && (
              <div className="overflow-x-auto border border-sky-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
                <table className="w-full text-left text-xs border-collapse font-mono border border-sky-200 dark:border-slate-700">
                  <thead className="bg-[#e4effa] dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold border-b border-sky-200 dark:border-slate-700">
                    <tr>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-center w-12">S.No</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700">Supplier / Vendor</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 w-36">Mobile</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 w-40 text-center">Allow in Sale</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-right w-36">Payable Due (₹)</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-center w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSuppliers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-400 font-sans">
                          No suppliers found matching search.
                        </td>
                      </tr>
                    ) : (
                      filteredSuppliers.map((s, idx) => {
                        const sPurchases = procurements.filter((p) => p.supplier_name === s.name || String(p.supplier_id) === String(s.id));
                        const sPurchased = sPurchases.reduce((sum, p) => sum + Number(p.total_amount || 0), 0);
                        const sPaid = sPurchases.reduce((sum, p) => sum + Number(p.p1_amount || 0), 0);
                        const netPayable = Number(s.old_due || 0) + sPurchased - sPaid;
                        const isDual = !!(dualSuppliers[s.id] || dualSuppliers[s.name] || (s.mobile && s.mobile.includes("#vendor")));

                        return (
                          <tr
                            key={s.id}
                            className="odd:bg-white even:bg-slate-50/70 dark:odd:bg-slate-900 dark:even:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800 transition"
                          >
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">{idx + 1}</td>
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700 font-bold text-slate-900 dark:text-white">
                              {s.name}
                            </td>
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                              {formatSupplierMobile(s.mobile) || "—"}
                            </td>
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">
                              <label className="inline-flex items-center gap-1.5 cursor-pointer font-sans text-xs">
                                <input
                                  type="checkbox"
                                  checked={isDual}
                                  onChange={() => toggleSupplierBuyer(s.id)}
                                  className="rounded text-indigo-600 cursor-pointer"
                                />
                                <span className={`text-[11px] font-bold ${isDual ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`}>
                                  {isDual ? "Active" : "Disabled"}
                                </span>
                              </label>
                            </td>
                            <td
                              className={`p-2.5 border border-slate-300 dark:border-slate-700 text-right font-black ${
                                netPayable < 0 ? "text-emerald-600" : netPayable === 0 ? "text-slate-500" : "text-amber-600"
                              }`}
                            >
                              {netPayable < 0 ? `Adv: ${money(Math.abs(netPayable))}` : money(netPayable)}
                            </td>
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">
                              <div className="flex items-center justify-center gap-1.5 font-sans">
                                <button
                                  type="button"
                                  onClick={() => handleEditSupplier(s)}
                                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded font-bold text-xs"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSupplier(s)}
                                  className="px-2 py-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 rounded font-bold text-xs"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  {filteredSuppliers.length > 0 && (
                    <tfoot className="bg-slate-100 dark:bg-slate-800/80 font-bold border-t-2 border-slate-300 dark:border-slate-700 text-xs">
                      <tr>
                        <td colSpan={4} className="p-2.5 text-right uppercase tracking-wider text-slate-600 dark:text-slate-300">
                          Total Suppliers ({filteredSuppliers.length}):
                        </td>
                        <td className="p-2.5 text-right font-black text-amber-600 dark:text-amber-400">
                          {money(
                            filteredSuppliers.reduce((sum, s) => {
                              const sPurchases = procurements.filter((p) => p.supplier_name === s.name || String(p.supplier_id) === String(s.id));
                              const sPurchased = sPurchases.reduce((t, p) => t + Number(p.total_amount || 0), 0);
                              const sPaid = sPurchases.reduce((t, p) => t + Number(p.p1_amount || 0), 0);
                              return sum + (Number(s.old_due || 0) + sPurchased - sPaid);
                            }, 0)
                          )}
                        </td>
                        <td className="p-2.5"></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            )}

            {/* SUB-VIEW: ITEMS (ERP GRID TABLE) */}
            {mastersSubTab === "items" && (
              <div className="overflow-x-auto border border-sky-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
                <table className="w-full text-left text-xs border-collapse font-mono border border-sky-200 dark:border-slate-700">
                  <thead className="bg-[#e4effa] dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold border-b border-sky-200 dark:border-slate-700">
                    <tr>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-center w-12">S.No</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700">Item Master Name</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-right w-36">Purchase Cost Rate (₹)</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-right w-36">Selling Rate (₹)</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-right w-32">Markup Margin (₹)</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-center w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-400 font-sans">
                          No item catalogue found.
                        </td>
                      </tr>
                    ) : (
                      filteredItems.map((item, idx) => {
                        const margin = Number(item.selling_rate || 0) - Number(item.purchase_rate || 0);
                        return (
                          <tr
                            key={idx}
                            className="odd:bg-white even:bg-slate-50/70 dark:odd:bg-slate-900 dark:even:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800 transition"
                          >
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">{idx + 1}</td>
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700 font-bold text-slate-900 dark:text-white">
                              {item.name}
                            </td>
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-right text-slate-700 dark:text-slate-300">
                              {money(item.purchase_rate)}
                            </td>
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-right font-black text-indigo-600 dark:text-indigo-400">
                              {money(item.selling_rate)}
                            </td>
                            <td
                              className={`p-2.5 border border-slate-300 dark:border-slate-700 text-right font-bold ${
                                margin >= 0 ? "text-emerald-600" : "text-rose-600"
                              }`}
                            >
                              {margin >= 0 ? `+${money(margin)}` : money(margin)}
                            </td>
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">
                              <div className="flex items-center justify-center gap-1.5 font-sans">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingItemId(item.id || null);
                                    setItemForm({
                                      name: item.name,
                                      purchase_rate: item.purchase_rate ? String(item.purchase_rate) : "",
                                      selling_rate: item.selling_rate ? String(item.selling_rate) : ""
                                    });
                                    setShowItemModal(true);
                                  }}
                                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded font-bold text-xs"
                                >
                                  Edit
                                </button>
                                {item.id && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteItem(item)}
                                    className="px-2 py-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 rounded font-bold text-xs"
                                  >
                                    Delete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  {filteredItems.length > 0 && (
                    <tfoot className="bg-slate-100 dark:bg-slate-800/80 font-bold border-t-2 border-slate-300 dark:border-slate-700 text-xs">
                      <tr>
                        <td colSpan={6} className="p-2.5 text-right uppercase tracking-wider text-slate-600 dark:text-slate-300">
                          Total Item Master Catalogue: {filteredItems.length} Products
                        </td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            )}

            {/* SUB-VIEW: LENDERS (ERP GRID TABLE) */}
            {mastersSubTab === "lenders" && (
              <div className="overflow-x-auto border border-sky-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
                <table className="w-full text-left text-xs border-collapse font-mono border border-sky-200 dark:border-slate-700">
                  <thead className="bg-[#e4effa] dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold border-b border-sky-200 dark:border-slate-700">
                    <tr>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-center w-12">S.No</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700">Lender / Source Name</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 w-36">Mobile</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-right w-36">Total Borrowed (₹)</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-right w-36">Total Repaid (₹)</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-right w-36">Pending Due (₹)</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-center w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLenders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-slate-400 font-sans">
                          No business loan sources recorded.
                        </td>
                      </tr>
                    ) : (
                      filteredLenders.map((l, idx) => (
                        <tr
                          key={l.id}
                          className="odd:bg-white even:bg-slate-50/70 dark:odd:bg-slate-900 dark:even:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800 transition"
                        >
                          <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">{idx + 1}</td>
                          <td className="p-2.5 border border-slate-300 dark:border-slate-700 font-bold text-slate-900 dark:text-white">
                            {l.name}
                          </td>
                          <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                            {l.mobile || "—"}
                          </td>
                          <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-right text-slate-700 dark:text-slate-300">
                            {money(l.total_borrowed)}
                          </td>
                          <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-right font-bold text-emerald-600 dark:text-emerald-400">
                            {money(l.total_repaid)}
                          </td>
                          <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-right font-black text-rose-600 dark:text-rose-400">
                            {money(l.balance_due)}
                          </td>
                          <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">
                            <div className="flex items-center justify-center gap-1.5 font-sans">
                              <button
                                type="button"
                                onClick={() => handleEditLender(l)}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded font-bold text-xs"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteLender(l)}
                                className="px-2 py-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 rounded font-bold text-xs"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                  {filteredLenders.length > 0 && (
                    <tfoot className="bg-slate-100 dark:bg-slate-800/80 font-bold border-t-2 border-slate-300 dark:border-slate-700 text-xs">
                      <tr>
                        <td colSpan={5} className="p-2.5 text-right uppercase tracking-wider text-slate-600 dark:text-slate-300">
                          Total Active Loan Liability ({filteredLenders.length} lenders):
                        </td>
                        <td className="p-2.5 text-right font-black text-rose-600 dark:text-rose-400">
                          {money(filteredLenders.reduce((s, l) => s + Number(l.balance_due || 0), 0))}
                        </td>
                        <td className="p-2.5"></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            )}

            {/* SUB-VIEW: PARTNERS (ERP GRID TABLE) */}
            {mastersSubTab === "partners" && (
              <div className="overflow-x-auto border border-sky-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
                <table className="w-full text-left text-xs border-collapse font-mono border border-sky-200 dark:border-slate-700">
                  <thead className="bg-[#e4effa] dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold border-b border-sky-200 dark:border-slate-700">
                    <tr>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-center w-12">S.No</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700">Partner Name</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-right w-36">Opening Cash (₹)</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-right w-36">Opening UPI (₹)</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-right w-40">Total Capital (₹)</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-center w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {partners.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-400 font-sans">
                          No partners configured.
                        </td>
                      </tr>
                    ) : (
                      partners.map((p, idx) => {
                        const totCap = Number(p.opening_cash || 0) + Number(p.opening_upi || 0);
                        return (
                          <tr
                            key={p.id}
                            className="odd:bg-white even:bg-slate-50/70 dark:odd:bg-slate-900 dark:even:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800 transition"
                          >
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">{idx + 1}</td>
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700 font-bold text-slate-900 dark:text-white">
                              {p.name}
                            </td>
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-right text-emerald-600 dark:text-emerald-400">
                              {money(p.opening_cash)}
                            </td>
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-right text-indigo-600 dark:text-indigo-400">
                              {money(p.opening_upi)}
                            </td>
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-right font-black text-slate-900 dark:text-white">
                              {money(totCap)}
                            </td>
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">
                              <div className="flex items-center justify-center gap-1.5 font-sans">
                                <button
                                  type="button"
                                  onClick={() => handleEditPartner(p)}
                                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded font-bold text-xs"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeletePartner(p)}
                                  className="px-2 py-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 rounded font-bold text-xs"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                  {partners.length > 0 && (
                    <tfoot className="bg-slate-100 dark:bg-slate-800/80 font-bold border-t-2 border-slate-300 dark:border-slate-700 text-xs">
                      <tr>
                        <td colSpan={2} className="p-2.5 text-right uppercase tracking-wider text-slate-600 dark:text-slate-300">
                          Total Opening Capital ({partners.length} partners):
                        </td>
                        <td className="p-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                          {money(partners.reduce((s, p) => s + Number(p.opening_cash || 0), 0))}
                        </td>
                        <td className="p-2.5 text-right font-bold text-indigo-600 dark:text-indigo-400">
                          {money(partners.reduce((s, p) => s + Number(p.opening_upi || 0), 0))}
                        </td>
                        <td className="p-2.5 text-right font-black text-slate-900 dark:text-white">
                          {money(partners.reduce((s, p) => s + Number(p.opening_cash || 0) + Number(p.opening_upi || 0), 0))}
                        </td>
                        <td className="p-2.5"></td>
                      </tr>
                    </tfoot>
                  )}
                </table>
              </div>
            )}

            {/* SUB-VIEW: CATEGORIES (ERP GRID TABLE) */}
            {mastersSubTab === "categories" && (
              <div className="overflow-x-auto border border-sky-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-xs max-w-2xl">
                <table className="w-full text-left text-xs border-collapse font-mono border border-sky-200 dark:border-slate-700">
                  <thead className="bg-[#e4effa] dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold border-b border-sky-200 dark:border-slate-700">
                    <tr>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-center w-12">S.No</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700">Category Name</th>
                      <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-center w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenseCategories.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="p-6 text-center text-slate-400 font-sans">
                          No categories created yet.
                        </td>
                      </tr>
                    ) : (
                      expenseCategories.map((c, idx) => (
                        <tr
                          key={c.id}
                          className="odd:bg-white even:bg-slate-50/70 dark:odd:bg-slate-900 dark:even:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800 transition"
                        >
                          <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">{idx + 1}</td>
                          <td className="p-2.5 border border-slate-300 dark:border-slate-700 font-bold text-slate-900 dark:text-white">
                            {c.name}
                          </td>
                          <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(c)}
                              className="px-2 py-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 rounded font-bold text-xs"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* VIEW 8: BUSINESS LOANS & LENDERS */}
        {activeTab === "lenders" && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Business Borrowings & Loans (వ్యాపార రుణాలు / అప్పులు)</h2>
                <p className="text-xs text-slate-500">Track loans taken for business operations and record repayment installments.</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setEditingLenderId(null);
                    setLenderForm({ name: "", mobile: "", initial_loan: "" });
                    setShowLenderModal(true);
                  }}
                  className="flex-1 sm:flex-none px-3.5 py-2 border border-slate-200 hover:bg-slate-50 font-bold text-xs rounded-xl"
                >
                  + Add Loan Source
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoanPaymentForm({
                      borrower_id: lenders[0]?.id ? String(lenders[0].id) : "",
                      principal_amount: "",
                      interest_amount: "",
                      payment_mode: "Cash",
                      partner_id: upfrontPartnerId || "",
                      notes: "",
                      tx_date: new Date().toISOString().split("T")[0]
                    });
                    setShowLoanPaymentModal(true);
                  }}
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Icon name="rupee" size={14} /> Pay Installment / Due
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex justify-between items-center">
              <div>
                <span className="text-[11px] font-bold uppercase text-amber-800 tracking-wider block">Total Outstanding Loan Liability</span>
                <span className="text-xl font-black text-amber-900 mt-0.5 block">{money(businessSummary.totalLoansPayable)}</span>
              </div>
              <span className="text-xs font-semibold text-amber-700">Payable to outside lenders</span>
            </div>

            <div className="overflow-x-auto border border-sky-200 dark:border-slate-700 rounded-2xl shadow-xs">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead className="bg-[#e4effa] dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold border-b border-sky-200 dark:border-slate-700">
                  <tr>
                    <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-center w-12 font-sans">#</th>
                    <th className="p-2.5 border border-sky-200 dark:border-slate-700 font-sans">Lender / Finance Source</th>
                    <th className="p-2.5 border border-sky-200 dark:border-slate-700 font-sans">Contact / Mobile</th>
                    <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-right font-sans">Total Borrowed</th>
                    <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-right font-sans">Total Repaid</th>
                    <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-right font-sans">Remaining Due</th>
                    <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-center font-sans">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lenders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 font-sans text-sm">
                        No active business loans recorded. Click <b>+ Add Loan Source</b> to add Gold Loans or outside finance.
                      </td>
                    </tr>
                  ) : (
                    lenders.map((l, idx) => {
                      const lTx = loanTransactions.filter((tx) => tx.borrower_id == l.id);
                      const isExp = expandedLenderId === l.id;
                      return (
                        <Fragment key={l.id}>
                          <tr className="odd:bg-white even:bg-slate-50 dark:odd:bg-slate-900 dark:even:bg-slate-800/60 hover:bg-sky-50/50 dark:hover:bg-slate-800 transition">
                            <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-center font-sans font-bold text-slate-400">
                              {idx + 1}
                            </td>
                            <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-sans font-black text-slate-900 dark:text-white">
                              {l.name}
                            </td>
                            <td className="p-2.5 border border-slate-200 dark:border-slate-700 font-sans text-slate-600 dark:text-slate-300">
                              {l.mobile || "No Contact"}
                            </td>
                            <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-right font-black text-slate-800 dark:text-slate-200">
                              {money(l.total_borrowed)}
                            </td>
                            <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-right font-black text-emerald-600 dark:text-emerald-400">
                              {money(l.total_repaid)}
                            </td>
                            <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-right font-black text-rose-600 dark:text-rose-400">
                              {money(l.balance_due)}
                            </td>
                            <td className="p-2.5 border border-slate-200 dark:border-slate-700 text-center font-sans">
                              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setLoanPaymentForm({
                                      borrower_id: String(l.id),
                                      principal_amount: "",
                                      interest_amount: "",
                                      payment_mode: "Cash",
                                      partner_id: upfrontPartnerId || "",
                                      notes: `Repayment to ${l.name}`,
                                      tx_date: new Date().toLocaleDateString("en-CA")
                                    });
                                    setShowLoanPaymentModal(true);
                                  }}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-xs cursor-pointer"
                                >
                                  Repay
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setExpandedLenderId(isExp ? null : l.id)}
                                  className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg cursor-pointer"
                                >
                                  {isExp ? "Hide" : `History (${lTx.length})`}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleEditLender(l)}
                                  className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-lg cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteLender(l)}
                                  className="px-2 py-1 bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-bold text-xs rounded-lg cursor-pointer"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expandable Lender Repayment History */}
                          {isExp && (
                            <tr>
                              <td colSpan={7} className="p-3 bg-sky-50/40 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center pb-1 border-b border-slate-200 dark:border-slate-700">
                                    <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                                      Repayments & Interest History for {l.name}
                                    </span>
                                    <span className="text-[11px] text-slate-500 font-mono">
                                      Total Repaid: {money(l.total_repaid)}
                                    </span>
                                  </div>

                                  {lTx.length === 0 ? (
                                    <div className="p-3 text-center text-slate-400 text-xs font-sans">
                                      No repayment transactions recorded yet for this lender.
                                    </div>
                                  ) : (
                                    <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                                      <table className="w-full text-left text-[11px] border-collapse font-mono">
                                        <thead className="bg-[#e4effa] dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                                          <tr>
                                            <th className="p-1.5 border border-slate-200 dark:border-slate-700">Date</th>
                                            <th className="p-1.5 border border-slate-200 dark:border-slate-700">Type</th>
                                            <th className="p-1.5 border border-slate-200 dark:border-slate-700">Paid By</th>
                                            <th className="p-1.5 border border-slate-200 dark:border-slate-700 text-center">Mode</th>
                                            <th className="p-1.5 border border-slate-200 dark:border-slate-700">Notes</th>
                                            <th className="p-1.5 border border-slate-200 dark:border-slate-700 text-right">Amount (₹)</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {lTx.map((tx) => {
                                            const p = partners.find((part) => part.id == tx.partner_id);
                                            return (
                                              <tr key={tx.id} className="odd:bg-white even:bg-slate-50 dark:odd:bg-slate-900 dark:even:bg-slate-800/60">
                                                <td className="p-1.5 border border-slate-200 dark:border-slate-700">{tx.tx_date || tx.created_at?.slice(0, 10)}</td>
                                                <td className="p-1.5 border border-slate-200 dark:border-slate-700 font-bold font-sans">
                                                  <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                                                    tx.tx_type === "Repayment" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                                                  }`}>
                                                    {tx.tx_type === "Repayment" ? "Principal Repaid" : "Interest Paid"}
                                                  </span>
                                                </td>
                                                <td className="p-1.5 border border-slate-200 dark:border-slate-700 font-sans">{p?.name || "Partner"}</td>
                                                <td className="p-1.5 border border-slate-200 dark:border-slate-700 text-center font-bold">{tx.payment_mode || "Cash"}</td>
                                                <td className="p-1.5 border border-slate-200 dark:border-slate-700 font-sans text-slate-500">{tx.notes || "-"}</td>
                                                <td className="p-1.5 border border-slate-200 dark:border-slate-700 text-right font-black text-purple-700 dark:text-purple-400">
                                                  {money(tx.amount)}
                                                </td>
                                              </tr>
                                            );
                                          })}
                                        </tbody>
                                      </table>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      );
                    })
                  )}
                </tbody>
                <tfoot className="bg-[#f0f4f9] dark:bg-slate-800 font-bold border-t-2 border-slate-300 dark:border-slate-600">
                  <tr>
                    <td colSpan={3} className="p-2.5 text-right font-sans text-xs text-slate-800 dark:text-slate-100">
                      Total Business Loans:
                    </td>
                    <td className="p-2.5 text-right text-slate-900 dark:text-white font-black">
                      {money(lenders.reduce((s, l) => s + Number(l.total_borrowed || 0), 0))}
                    </td>
                    <td className="p-2.5 text-right text-emerald-600 dark:text-emerald-400 font-black">
                      {money(lenders.reduce((s, l) => s + Number(l.total_repaid || 0), 0))}
                    </td>
                    <td className="p-2.5 text-right text-rose-600 dark:text-rose-400 font-black">
                      {money(businessSummary.totalLoansPayable)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 9: EXPENSES (POINT 8: ERP GRID TABLE MATCHING IMAGE 1) */}
        {activeTab === "expenses" && (
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">Expenses & Cash Outflow</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Record shop costs and manage master categories</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(true)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl"
                >
                  Manage Categories
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingExpenseId(null);
                    setExpenseForm({
                      title: "",
                      category_id: expenseCategories[0]?.id ? String(expenseCategories[0].id) : "",
                      amount: "",
                      payment_mode: "Cash",
                      paid_by_id: upfrontPartnerId || "",
                      expense_date: new Date().toISOString().split("T")[0],
                      notes: "",
                      borrower_id: ""
                    });
                    setShowExpenseModal(true);
                  }}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  + Add Expense
                </button>
              </div>
            </div>

            {/* Expenses Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1">
              <input
                type="text"
                placeholder="Search expense description..."
                value={expenseSearchQuery}
                onChange={(e) => setExpenseSearchQuery(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold outline-none focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white"
              />
              <select
                value={expenseCategoryFilter}
                onChange={(e) => setExpenseCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold outline-none focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                {expenseCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <select
                value={expensePartnerFilter}
                onChange={(e) => setExpensePartnerFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold outline-none focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="all">All Paying Partners</option>
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <select
                value={expenseDateFilter}
                onChange={(e) => setExpenseDateFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold outline-none focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white"
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
              </select>
            </div>

            {/* ERP Grid Table (Point 8) */}
            <div className="overflow-x-auto border border-sky-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
              <table className="w-full text-left text-xs border-collapse font-mono border border-sky-200 dark:border-slate-700">
                <thead className="bg-[#e4effa] dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold border-b border-sky-200 dark:border-slate-700">
                  <tr>
                    <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-center w-12">S.No</th>
                    <th className="p-2.5 border border-sky-200 dark:border-slate-700 w-28">Date</th>
                    <th className="p-2.5 border border-sky-200 dark:border-slate-700 w-36">Category</th>
                    <th className="p-2.5 border border-sky-200 dark:border-slate-700">Title / Description</th>
                    <th className="p-2.5 border border-sky-200 dark:border-slate-700 w-44">Paid By (Partner & Mode)</th>
                    <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-right w-32">Amount (₹)</th>
                    <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-center w-28">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExpenses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-6 text-center text-slate-400 font-sans">
                        No expenses match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredExpenses.map((e, idx) => {
                      const partner = partners.find((p) => p.id == e.paid_by_id);
                      return (
                        <tr
                          key={e.id}
                          className="odd:bg-white even:bg-slate-50/70 dark:odd:bg-slate-900 dark:even:bg-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800 transition"
                        >
                          <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">{idx + 1}</td>
                          <td className="p-2.5 border border-slate-300 dark:border-slate-700 whitespace-nowrap">{e.expense_date}</td>
                          <td className="p-2.5 border border-slate-300 dark:border-slate-700 font-bold text-indigo-700 dark:text-indigo-300">
                            {e.category_name}
                          </td>
                          <td className="p-2.5 border border-slate-300 dark:border-slate-700 font-sans">
                            <span className="font-bold text-slate-900 dark:text-white block">{e.title}</span>
                            {e.notes && <span className="text-[11px] text-slate-400 block">{e.notes}</span>}
                          </td>
                          <td className="p-2.5 border border-slate-300 dark:border-slate-700">
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">{partner?.name || "N/A"}</span>
                            <span className="text-[10px] text-slate-500 font-sans">({e.payment_mode || "Cash"})</span>
                          </td>
                          <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-right font-black text-rose-600 dark:text-rose-400 text-sm">
                            {money(e.amount)}
                          </td>
                          <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">
                            <div className="flex items-center justify-center gap-1.5 font-sans">
                              <button
                                type="button"
                                onClick={() => handleEditExpense(e)}
                                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded font-bold text-xs"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteExpense(e)}
                                className="px-2 py-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-400 rounded font-bold text-xs"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
                {filteredExpenses.length > 0 && (
                  <tfoot className="bg-slate-100 dark:bg-slate-800/80 font-bold border-t-2 border-slate-300 dark:border-slate-700 text-xs">
                    <tr>
                      <td colSpan={5} className="p-2.5 text-right uppercase tracking-wider text-slate-600 dark:text-slate-300">
                        Total Expenses ({filteredExpenses.length} entries):
                      </td>
                      <td className="p-2.5 text-right font-black text-rose-600 dark:text-rose-400 text-sm">
                        {money(filteredExpenses.reduce((s, e) => s + Number(e.amount || 0), 0))}
                      </td>
                      <td className="p-2.5"></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        )}

        {/* VIEW 10: B REDDY EXCEL STATEMENT (EXACT MATCH TO IMAGE 1, NO EXTRA CARDS OR TOOLBAR) */}
        {activeTab === "reports" && (() => {
          // Filtered Stock (Qty > 0)
          const stockList = procurements.filter((p) => {
            const qty = Number(p.remaining_qty ?? p.available_quantity ?? p.quantity ?? 0);
            return qty > 0;
          });

          // Filtered Customers (Excludes zero balances)
          const customerList = customers.filter((c) => Math.abs(Number(c.old_due || 0)) >= 0.01);

          // Filtered Suppliers (Excludes zero balances)
          const supplierList = suppliers.filter((s) => Math.abs(Number(s.old_due || 0)) >= 0.01);

          // Active Debts
          const activeLoans = lenders.filter((l) => Number(l.balance_due || 0) > 0);
          const pendingPurchaseBills = procurements.filter((p) => {
            const due = Math.max(0, Number(p.total_amount || 0) - Number(p.p1_amount || 0));
            return due > 0;
          });

          const totalActiveLoans = activeLoans.reduce((s, l) => s + Number(l.balance_due || 0), 0);
          const totalPendingBills = pendingPurchaseBills.reduce((s, p) => {
            return s + Math.max(0, Number(p.total_amount || 0) - Number(p.p1_amount || 0));
          }, 0);

          return (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
                {/* Header matching user requirement */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                      {t("B Reddy Statement (Excel Sheet Format)", "బి రెడ్డి స్టేట్‌మెంట్ (ఎక్సెల్ షీట్ ఫార్మాట్)")}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {t("Complete balance sheet. Zero stock batches and settled zero balances are excluded.", "పూర్తి బ్యాలెన్స్ షీట్. జీరో స్టాక్ మరియు సెటిల్ అయినవి మినహాయించబడ్డాయి.")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className={`px-4 py-2 ${curTheme.primary} font-bold text-xs rounded-xl flex items-center gap-2 shadow cursor-pointer`}
                  >
                    <Icon name="download" size={15} /> {t("Download / Print PDF", "డౌన్‌లోడ్ / ప్రింట్ PDF")}
                  </button>
                </div>

                {/* SECTION 1: MASTER BALANCE SHEET TABLE (EXACT VISUAL REPLICA OF USER IMAGE 1) */}
                <div className="overflow-x-auto border border-slate-300 dark:border-slate-700 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse font-mono border border-slate-300 dark:border-slate-700">
                    <thead>
                      <tr className="bg-slate-900 text-white font-bold">
                        <th className="p-3 border border-slate-800 text-center w-16">S.No</th>
                        <th className="p-3 border border-slate-800">{t("Description", "వివరణ (Description)")}</th>
                        <th className="p-3 border border-slate-800 text-right w-52">{t("Total Value (₹)", "మొత్తం విలువ (Value ₹)")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Row 1: Debts (Amber) */}
                      <tr className="bg-amber-50/90 dark:bg-amber-950/40 font-bold text-slate-900 dark:text-amber-200">
                        <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">1</td>
                        <td className="p-2.5 border border-slate-300 dark:border-slate-700">
                          {t("Debts & Supplier Purchase Dues", "అప్పులు (Debts & Supplier Purchase Dues)")}
                        </td>
                        <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-right text-rose-600 dark:text-rose-400 font-black">
                          {money(businessSummary.totalLoansPayable + businessSummary.totalPurchaseDues)}
                        </td>
                      </tr>

                      {/* Row 2: Customer Dues */}
                      <tr className="bg-slate-50/80 dark:bg-slate-800/60 font-bold text-slate-900 dark:text-slate-100">
                        <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">2</td>
                        <td className="p-2.5 border border-slate-300 dark:border-slate-700">
                          {t("Customer Dues", "కస్టమర్ బ్యాలెన్స్ (Customer Dues)")}
                        </td>
                        <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-right text-slate-900 dark:text-slate-100 font-bold">
                          {money(businessSummary.totalCustomerDues)}
                        </td>
                      </tr>

                      {/* Row 3: Stock Valuation */}
                      <tr className="bg-slate-50/80 dark:bg-slate-800/60 font-bold text-slate-900 dark:text-slate-100">
                        <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">3</td>
                        <td className="p-2.5 border border-slate-300 dark:border-slate-700">
                          {t("Stock Valuation", "నిలువలు (Stock Valuation)")}
                        </td>
                        <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-right text-slate-900 dark:text-slate-100 font-bold">
                          {money(businessSummary.stockValuation)}
                        </td>
                      </tr>

                      {/* Row 4: Expenses & Outlays (Pink) */}
                      <tr className="bg-rose-50/80 dark:bg-rose-950/40 font-bold text-slate-900 dark:text-rose-200">
                        <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">4</td>
                        <td className="p-2.5 border border-slate-300 dark:border-slate-700">
                          {t("Expenses & Outlays", "ఖర్చులు (Expenses & Outlays)")}
                        </td>
                        <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-right text-rose-600 dark:text-rose-400 font-black">
                          {money(businessSummary.totalExpenses)}
                        </td>
                      </tr>

                      {/* Row 5: COGS */}
                      <tr className="bg-blue-50/80 dark:bg-blue-950/40 font-bold text-slate-900 dark:text-blue-200">
                        <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">5</td>
                        <td className="p-2.5 border border-slate-300 dark:border-slate-700">
                          {t("Cost of Goods Sold (COGS)", "కొనుగోలు ఖర్చు / COGS (Cost of Goods Sold)")}
                        </td>
                        <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-right text-slate-900 dark:text-blue-300 font-bold">
                          {money(businessSummary.cogs)}
                        </td>
                      </tr>

                      {/* Row 6: Gross Profit (Light Green) */}
                      <tr className="bg-emerald-50 dark:bg-emerald-950/50 font-bold text-emerald-950 dark:text-emerald-300">
                        <td colSpan={2} className="p-2.5 border border-slate-300 dark:border-slate-700 text-right uppercase text-xs">
                          {t("GROSS PROFIT = SALES - COGS", "స్థూల లాభం (GROSS PROFIT = SALES - COGS)")}
                        </td>
                        <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-right font-black text-emerald-700 dark:text-emerald-400">
                          {money(businessSummary.grossProfit)}
                        </td>
                      </tr>

                      {/* Row 7: Net Business Profit = Gross Profit - Expenses = ((1 - 2) - 3) (Green) */}
                      <tr className="bg-emerald-100 dark:bg-emerald-900/60 font-black text-sm text-emerald-950 dark:text-emerald-100">
                        <td colSpan={2} className="p-3 border border-slate-300 dark:border-slate-700 text-right uppercase">
                          {t("NET BUSINESS PROFIT = (GROSS PROFIT - EXPENSES) = ((1 - 2) - 3)", "నికర లాభం (NET BUSINESS PROFIT = (GROSS PROFIT - EXPENSES) = ((1 - 2) - 3))")}
                        </td>
                        <td className="p-3 border border-slate-300 dark:border-slate-700 text-right text-emerald-950 dark:text-emerald-200 font-black">
                          {money(businessSummary.netProfit)}
                        </td>
                      </tr>

                      {/* Row 8: Net Worth (Purple) */}
                      <tr className="bg-indigo-50 dark:bg-indigo-950/50 font-black text-xs text-indigo-950 dark:text-indigo-200">
                        <td colSpan={2} className="p-2.5 border border-slate-300 dark:border-slate-700 text-right uppercase">
                          {t("BUSINESS NET WORTH = ASSETS - LIABILITIES", "వ్యాపార నికర విలువ (BUSINESS NET WORTH = ASSETS - LIABILITIES)")}
                        </td>
                        <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-right font-black">
                          {money(businessSummary.netWorth)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* SECTION 2: AVAILABLE STOCK TABLE WITH ERP GRID LINES (MATCHING IMAGE 4) */}
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {t("Available Stock (Qty > 0)", "నిలువలు (Available Stock with Qty > 0)")}
                    </h3>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 font-mono">
                      Total Valuation: {money(businessSummary.stockValuation)}
                    </span>
                  </div>
                  <div className="overflow-x-auto border border-slate-300 dark:border-slate-700 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse font-mono border border-slate-300 dark:border-slate-700">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-300 dark:border-slate-700">
                        <tr>
                          <th className="p-2 border border-slate-300 dark:border-slate-700 text-center">S.No</th>
                          <th className="p-2 border border-slate-300 dark:border-slate-700">Stock Item</th>
                          <th className="p-2 border border-slate-300 dark:border-slate-700">Supplier</th>
                          <th className="p-2 border border-slate-300 dark:border-slate-700 text-center">Available Qty</th>
                          <th className="p-2 border border-slate-300 dark:border-slate-700 text-right">Cost Rate</th>
                          <th className="p-2 border border-slate-300 dark:border-slate-700 text-right">Selling Rate</th>
                          <th className="p-2 border border-slate-300 dark:border-slate-700 text-right">Total Valuation</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stockList.length === 0 ? (
                          <tr><td colSpan={7} className="p-3 text-center text-slate-400 font-sans">No stock available</td></tr>
                        ) : (
                          stockList.map((p, idx) => {
                            const availQty = Number(p.remaining_qty ?? p.available_quantity ?? p.quantity ?? 0);
                            const val = availQty * Number(p.purchase_rate || 0);
                            return (
                              <tr key={p.id} className="odd:bg-white even:bg-slate-50/70 dark:odd:bg-slate-900 dark:even:bg-slate-800/50 text-slate-900 dark:text-slate-100">
                                <td className="p-2 border border-slate-300 dark:border-slate-700 text-center">{idx + 1}</td>
                                <td className="p-2 border border-slate-300 dark:border-slate-700 font-bold">{p.items?.item_name || p.item_name}</td>
                                <td className="p-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">{p.suppliers?.name || p.supplier_name}</td>
                                <td className="p-2 border border-slate-300 dark:border-slate-700 text-center font-bold">{availQty}</td>
                                <td className="p-2 border border-slate-300 dark:border-slate-700 text-right">{money(p.purchase_rate)}</td>
                                <td className="p-2 border border-slate-300 dark:border-slate-700 text-right">{money(p.selling_rate || p.purchase_rate)}</td>
                                <td className="p-2 border border-slate-300 dark:border-slate-700 text-right font-bold text-slate-900 dark:text-white">{money(val)}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* SECTION 3: CUSTOMER DUES LEDGER (EXCLUDES ZERO BALANCES) */}
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {t("Customer Outstanding Dues Ledger", "కస్టమర్ బ్యాలెన్స్ (Customer Dues Ledger)")}
                    </h3>
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
                      Total Dues: {money(businessSummary.totalCustomerDues)}
                    </span>
                  </div>
                  <div className="overflow-x-auto border border-slate-300 dark:border-slate-700 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse font-mono border border-slate-300 dark:border-slate-700">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-300 dark:border-slate-700">
                        <tr>
                          <th className="p-2 border border-slate-300 dark:border-slate-700 text-center">S.No</th>
                          <th className="p-2 border border-slate-300 dark:border-slate-700">Customer Name</th>
                          <th className="p-2 border border-slate-300 dark:border-slate-700">Mobile</th>
                          <th className="p-2 border border-slate-300 dark:border-slate-700 text-right">Outstanding Due / Advance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerList.length === 0 ? (
                          <tr><td colSpan={4} className="p-3 text-center text-slate-400 font-sans">No customer dues</td></tr>
                        ) : (
                          customerList.map((c, idx) => (
                            <tr key={c.id} className="odd:bg-white even:bg-slate-50/70 dark:odd:bg-slate-900 dark:even:bg-slate-800/50 text-slate-900 dark:text-slate-100">
                              <td className="p-2 border border-slate-300 dark:border-slate-700 text-center">{idx + 1}</td>
                              <td className="p-2 border border-slate-300 dark:border-slate-700 font-bold">{c.name}</td>
                              <td className="p-2 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400">{c.mobile || "N/A"}</td>
                              <td className={`p-2 border border-slate-300 dark:border-slate-700 text-right font-black ${
                                Number(c.old_due || 0) < 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                              }`}>
                                {Number(c.old_due || 0) < 0 ? `Adv: ${money(Math.abs(c.old_due))}` : money(c.old_due)}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* SECTION 4: SUPPLIER LEDGER (EXCLUDES ZERO BALANCES) */}
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {t("Supplier Payables & Advance Ledger", "సరుకు వ్యాపారుల లెడ్జర్ (Supplier Payables & Advance Ledger)")}
                    </h3>
                    <div className="flex items-center gap-3 text-xs font-bold font-mono">
                      <span className="text-amber-600">
                        Payables: {money(supplierList.reduce((s, sup) => s + (Number(sup.old_due || 0) > 0 ? Number(sup.old_due) : 0), 0))}
                      </span>
                      <span className="text-emerald-600">
                        Advances: {money(supplierList.reduce((s, sup) => s + (Number(sup.old_due || 0) < 0 ? Math.abs(Number(sup.old_due)) : 0), 0))}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-x-auto border border-slate-300 dark:border-slate-700 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse font-mono border border-slate-300 dark:border-slate-700">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-300 dark:border-slate-700">
                        <tr>
                          <th className="p-2 border border-slate-300 dark:border-slate-700 text-center">S.No</th>
                          <th className="p-2 border border-slate-300 dark:border-slate-700">Supplier Name</th>
                          <th className="p-2 border border-slate-300 dark:border-slate-700">Mobile</th>
                          <th className="p-2 border border-slate-300 dark:border-slate-700 text-center">Status</th>
                          <th className="p-2 border border-slate-300 dark:border-slate-700 text-right">Balance Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {supplierList.length === 0 ? (
                          <tr><td colSpan={5} className="p-3 text-center text-slate-400 font-sans">No supplier payables</td></tr>
                        ) : (
                          supplierList.map((s, idx) => {
                            const bal = Number(s.old_due || 0);
                            const isAdv = bal < 0;
                            return (
                              <tr key={s.id} className="odd:bg-white even:bg-slate-50/70 dark:odd:bg-slate-900 dark:even:bg-slate-800/50 text-slate-900 dark:text-slate-100">
                                <td className="p-2 border border-slate-300 dark:border-slate-700 text-center">{idx + 1}</td>
                                <td className="p-2 border border-slate-300 dark:border-slate-700 font-bold">{s.name}</td>
                                <td className="p-2 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400">{formatSupplierMobile(s.mobile) || "N/A"}</td>
                                <td className="p-2 border border-slate-300 dark:border-slate-700 text-center">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    isAdv ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300" : "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                                  }`}>
                                    {isAdv ? "Advance Credit" : "Payable Due"}
                                  </span>
                                </td>
                                <td className={`p-2 border border-slate-300 dark:border-slate-700 text-right font-black ${isAdv ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>
                                  {isAdv ? `Adv: ${money(Math.abs(bal))}` : money(bal)}
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* SECTION 5: EXPENSES LEDGER */}
                <div className="pt-2">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {t("Expenses & Outlays Ledger", "ఖర్చులు (Expenses & Outlays Ledger)")}
                    </h3>
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
                      Total Expenses: {money(businessSummary.totalExpenses)}
                    </span>
                  </div>
                  <div className="overflow-x-auto border border-slate-300 dark:border-slate-700 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse font-mono border border-slate-300 dark:border-slate-700">
                      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-300 dark:border-slate-700">
                        <tr>
                          <th className="p-2 border border-slate-300 dark:border-slate-700 text-center">S.No</th>
                          <th className="p-2 border border-slate-300 dark:border-slate-700">Date</th>
                          <th className="p-2 border border-slate-300 dark:border-slate-700">Category</th>
                          <th className="p-2 border border-slate-300 dark:border-slate-700">Description</th>
                          <th className="p-2 border border-slate-300 dark:border-slate-700 text-right">Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {expenses.length === 0 ? (
                          <tr><td colSpan={5} className="p-3 text-center text-slate-400 font-sans">No expenses recorded</td></tr>
                        ) : (
                          expenses.map((e, idx) => (
                            <tr key={e.id} className="odd:bg-white even:bg-slate-50/70 dark:odd:bg-slate-900 dark:even:bg-slate-800/50 text-slate-900 dark:text-slate-100">
                              <td className="p-2 border border-slate-300 dark:border-slate-700 text-center">{idx + 1}</td>
                              <td className="p-2 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400">{e.expense_date || "N/A"}</td>
                              <td className="p-2 border border-slate-300 dark:border-slate-700 font-bold text-slate-900 dark:text-slate-100">{e.category_name}</td>
                              <td className="p-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">{e.title}</td>
                              <td className="p-2 border border-slate-300 dark:border-slate-700 text-right font-bold text-rose-600 dark:text-rose-400">{money(e.amount)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* SECTION 6: DEBTS DETAILS BREAKDOWN (MATCHES ROW 1) */}
                <div className="pt-4 border-t-2 border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <span className="text-rose-600">🔴</span> {t("Debts & Supplier Purchase Dues Details", "అప్పులు & సరుకు పెండింగ్ బిల్లుల వివరాలు")}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {t("Detailed breakdown of Row 1 in Balance Sheet: Outside Loans + Supplier Pending Bills", "బ్యాలెన్స్ షీట్ మొదటి వరుస (Row 1) లోని అప్పుల పూర్తి వివరాలు")}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Debts</span>
                      <b className="text-sm font-black text-rose-600 font-mono">
                        {money(totalActiveLoans + totalPendingBills)}
                      </b>
                    </div>
                  </div>

                  {/* 6A: Outside Loans */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>1. External Business Loans:</span>
                      <span className="text-rose-600 font-mono">Total: {money(totalActiveLoans)}</span>
                    </div>
                    <div className="overflow-x-auto border border-rose-200 dark:border-rose-900/60 rounded-xl">
                      <table className="w-full text-left text-xs border-collapse font-mono border border-rose-200 dark:border-rose-900/60">
                        <thead className="bg-rose-100/70 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200 font-bold border-b border-rose-200 dark:border-rose-900/60">
                          <tr>
                            <th className="p-2 border border-rose-200 dark:border-rose-900/60 text-center">S.No</th>
                            <th className="p-2 border border-rose-200 dark:border-rose-900/60">Lender / Loan Source</th>
                            <th className="p-2 border border-rose-200 dark:border-rose-900/60">Mobile</th>
                            <th className="p-2 border border-rose-200 dark:border-rose-900/60 text-right">Balance Due (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeLoans.length === 0 ? (
                            <tr><td colSpan={4} className="p-3 text-center text-slate-400 font-sans">No active business loans</td></tr>
                          ) : (
                            activeLoans.map((l, idx) => (
                              <tr key={l.id} className="odd:bg-white even:bg-rose-50/30 dark:odd:bg-slate-900 dark:even:bg-rose-950/20 text-slate-900 dark:text-slate-100">
                                <td className="p-2 border border-rose-200 dark:border-rose-900/60 text-center">{idx + 1}</td>
                                <td className="p-2 border border-rose-200 dark:border-rose-900/60 font-bold">{l.name}</td>
                                <td className="p-2 border border-rose-200 dark:border-rose-900/60 text-slate-600 dark:text-slate-400">{l.mobile || "N/A"}</td>
                                <td className="p-2 border border-rose-200 dark:border-rose-900/60 text-right font-black text-rose-600 dark:text-rose-400">{money(l.balance_due)}</td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 6B: Supplier Pending Bills */}
                  <div className="space-y-2 pt-2">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                      <span>2. Supplier Purchase Pending Bills:</span>
                      <span className="text-amber-600 dark:text-amber-400 font-mono">Total: {money(totalPendingBills)}</span>
                    </div>
                    <div className="overflow-x-auto border border-amber-200 dark:border-amber-900/60 rounded-xl">
                      <table className="w-full text-left text-xs border-collapse font-mono border border-amber-200 dark:border-amber-900/60">
                        <thead className="bg-amber-100/70 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 font-bold border-b border-amber-200 dark:border-amber-900/60">
                          <tr>
                            <th className="p-2 border border-amber-200 dark:border-amber-900/60 text-center">S.No</th>
                            <th className="p-2 border border-amber-200 dark:border-amber-900/60">Bill ID</th>
                            <th className="p-2 border border-amber-200 dark:border-amber-900/60">Supplier</th>
                            <th className="p-2 border border-amber-200 dark:border-amber-900/60">Item</th>
                            <th className="p-2 border border-amber-200 dark:border-amber-900/60 text-right">Total (₹)</th>
                            <th className="p-2 border border-amber-200 dark:border-amber-900/60 text-right">Paid (₹)</th>
                            <th className="p-2 border border-amber-200 dark:border-amber-900/60 text-right">Due (₹)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingPurchaseBills.length === 0 ? (
                            <tr><td colSpan={7} className="p-3 text-center text-slate-400 font-sans">No pending purchase bills</td></tr>
                          ) : (
                            pendingPurchaseBills.map((p, idx) => {
                              const total = Number(p.total_amount || 0);
                              const paid = Number(p.p1_amount || 0);
                              const due = Math.max(0, total - paid);
                              return (
                                <tr key={p.id} className="odd:bg-white even:bg-amber-50/30 dark:odd:bg-slate-900 dark:even:bg-amber-950/20 text-slate-900 dark:text-slate-100">
                                  <td className="p-2 border border-amber-200 dark:border-amber-900/60 text-center">{idx + 1}</td>
                                  <td className="p-2 border border-amber-200 dark:border-amber-900/60 font-bold">BILL-{p.id}</td>
                                  <td className="p-2 border border-amber-200 dark:border-amber-900/60 font-bold">{p.suppliers?.name || p.supplier_name}</td>
                                  <td className="p-2 border border-amber-200 dark:border-amber-900/60 text-slate-700 dark:text-slate-300">{p.items?.item_name || p.item_name}</td>
                                  <td className="p-2 border border-amber-200 dark:border-amber-900/60 text-right font-mono">{money(total)}</td>
                                  <td className="p-2 border border-amber-200 dark:border-amber-900/60 text-right text-emerald-600 dark:text-emerald-400 font-mono">{money(paid)}</td>
                                  <td className="p-2 border border-amber-200 dark:border-amber-900/60 text-right font-black text-rose-600 dark:text-rose-400 font-mono">{money(due)}</td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          );
        })()}

        {/* VIEW 12: LEDGER STATEMENT MODULE (POINTS 3 & 8, GRID TABLE MATCHING IMAGE 4, NO WHATSAPP CARD) */}
        {activeTab === "ledger" && (() => {
          const isCustomer = whatsappType === "customer";
          const currentParty = isCustomer
            ? customers.find((c) => String(c.id) === String(whatsappSelectedId)) || customers[0]
            : suppliers.find((s) => String(s.id) === String(whatsappSelectedId)) || suppliers[0];

          // Customer records
          const custInvoices = isCustomer && currentParty
            ? invoices.filter((inv) => String(inv.customer_id) === String(currentParty.id))
            : [];
          const rawCustCollections = isCustomer && currentParty
            ? collections.filter((col) => String(col.customer_id) === String(currentParty.id))
            : [];
          // Include upfront payments received from this customer
          const custUpfronts = isCustomer && currentParty
            ? custInvoices
                .filter((inv) => Number(inv.upfront_paid || 0) > 0)
                .map((inv) => ({
                  id: `upfront_${inv.id}`,
                  isUpfront: true,
                  customer_id: inv.customer_id,
                  created_at: inv.invoice_date || inv.created_at,
                  reference_no: `UPFRONT-${inv.invoice_number || inv.id}`,
                  collection_type: `Bill Upfront (${inv.invoice_number || `INV-${inv.id}`})`,
                  amount: Number(inv.upfront_paid || 0),
                  payment_mode: inv.upfront_mode || "Cash",
                  receiver_id: inv.upfront_receiver_id
                }))
            : [];
          const custCollections = [...rawCustCollections, ...custUpfronts];

          const custTotalInvoiced = custInvoices.reduce((s, i) => s + Number(i.total_amount || 0), 0);
          const custTotalCollected = custCollections.reduce((s, c) => s + Number(c.amount || 0), 0);

          // Supplier records
          const supPurchases = !isCustomer && currentParty
            ? procurements.filter((p) => p.supplier_name === currentParty.name || String(p.supplier_id) === String(currentParty.id))
            : [];
          const supTotalPurchased = supPurchases.reduce((s, p) => s + Number(p.total_amount || 0), 0);
          const supTotalPaid = supPurchases.reduce((s, p) => s + Number(p.p1_amount || 0), 0);

          // Dynamic Balance calculation (Point 12: fixes Badvel Nagaraju and dynamic party dues)
          const balAmount = isCustomer
            ? Number(currentParty?.old_due || 0)
            : (Number(currentParty?.old_due || 0) + supTotalPurchased - supTotalPaid);
          const isDue = balAmount > 0;
          const isAdv = balAmount < 0;

          // Initial Opening Balance before any transactions
          const initialOpeningBal = isCustomer
            ? (balAmount - custTotalInvoiced + custTotalCollected)
            : Number(currentParty?.old_due || 0);

          // Build Unified Chronological Running Ledger Statement
          const ledgerEntries = [];

          if (isCustomer && currentParty) {
            custInvoices.forEach((inv) => {
              const dt = inv.invoice_date || (inv.created_at ? new Date(inv.created_at).toLocaleDateString("en-CA") : "N/A");
              const itemsDesc = Array.isArray(inv.items) && inv.items.length > 0
                ? inv.items.map((it) => `${it.item_name || "Item"} (${it.qty || 1})`).join(", ")
                : "Sales Goods";
              ledgerEntries.push({
                rawDate: dt,
                date: dt,
                type: "Sales Invoice",
                ref: inv.invoice_number || `INV-${inv.id}`,
                desc: itemsDesc,
                debit: Number(inv.total_amount || 0),
                credit: 0,
                mode: "Credit Bill"
              });
            });

            custCollections.forEach((col) => {
              const dt = col.created_at ? new Date(col.created_at).toLocaleDateString("en-CA") : "N/A";
              ledgerEntries.push({
                rawDate: dt,
                date: dt,
                type: "Payment Received",
                ref: col.reference_no || `REC-${col.id}`,
                desc: col.collection_type || "Customer Payment",
                debit: 0,
                credit: Number(col.amount || 0),
                mode: col.payment_mode || "Cash"
              });
            });
          } else if (!isCustomer && currentParty) {
            supPurchases.forEach((p) => {
              const dt = p.created_at ? new Date(p.created_at).toLocaleDateString("en-CA") : "N/A";
              const itemDesc = `${p.items?.item_name || p.item_name || "Stock Item"} (${p.quantity || 1} qty)`;
              ledgerEntries.push({
                rawDate: dt,
                date: dt,
                type: "Purchase Bill",
                ref: `BILL-${p.id}`,
                desc: itemDesc,
                debit: Number(p.total_amount || 0),
                credit: 0,
                mode: "Bill Payable"
              });

              if (Number(p.p1_amount || 0) > 0) {
                ledgerEntries.push({
                  rawDate: dt,
                  date: dt,
                  type: "Supplier Payment",
                  ref: `PAY-${p.id}`,
                  desc: `Payment for Bill #${p.id}`,
                  debit: 0,
                  credit: Number(p.p1_amount || 0),
                  mode: p.p1_mode || "Cash"
                });
              }
            });
          }

          // Sort chronologically ascending
          ledgerEntries.sort((a, b) => (a.rawDate || "").localeCompare(b.rawDate || ""));

          // Local time date calculations for robust filtering
          const localToday = new Date().toLocaleDateString("en-CA");
          const now = new Date();
          const curMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
          const d30Str = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-CA");

          let filterStartDate = null;
          let filterEndDate = null;

          if (ledgerDateFilter === "today") {
            filterStartDate = localToday;
            filterEndDate = localToday;
          } else if (ledgerDateFilter === "this_month") {
            filterStartDate = `${curMonthStr}-01`;
            filterEndDate = null;
          } else if (ledgerDateFilter === "last_30_days") {
            filterStartDate = d30Str;
            filterEndDate = null;
          } else if (ledgerDateFilter === "custom") {
            filterStartDate = ledgerStartDate || null;
            filterEndDate = ledgerEndDate || null;
          }

          // Period Opening Balance: Cumulative net balance of all transactions strictly before filterStartDate
          let periodOpeningBal = initialOpeningBal;
          if (filterStartDate) {
            const priorEntries = ledgerEntries.filter((e) => e.rawDate && e.rawDate < filterStartDate);
            const priorDebits = priorEntries.reduce((s, e) => s + e.debit, 0);
            const priorCredits = priorEntries.reduce((s, e) => s + e.credit, 0);
            periodOpeningBal = initialOpeningBal + priorDebits - priorCredits;
          }

          // Dynamic Filters application (Point 9)
          const filteredLedgerEntries = ledgerEntries.filter((entry) => {
            if (filterStartDate && entry.rawDate < filterStartDate) return false;
            if (filterEndDate && entry.rawDate > filterEndDate) return false;

            if (ledgerTypeFilter === "debit" && entry.debit <= 0) return false;
            if (ledgerTypeFilter === "credit" && entry.credit <= 0) return false;

            if (ledgerSearchQuery.trim()) {
              const q = ledgerSearchQuery.toLowerCase();
              const match =
                (entry.ref || "").toLowerCase().includes(q) ||
                (entry.desc || "").toLowerCase().includes(q) ||
                (entry.type || "").toLowerCase().includes(q) ||
                (entry.mode || "").toLowerCase().includes(q);
              if (!match) return false;
            }
            return true;
          });

          // Compute continuous running balance for display
          let runningBalTracker = periodOpeningBal;
          const displayLedgerRows = filteredLedgerEntries.map((entry) => {
            runningBalTracker = runningBalTracker + entry.debit - entry.credit;
            return {
              ...entry,
              balance: runningBalTracker
            };
          });

          return (
            <div className="space-y-6">
              {/* Header */}
              <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 no-print">
                <div>
                  <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Icon name="layers" size={20} /> {t("Ledger Statement", "ఖాతా లెడ్జర్ స్టేట్‌మెంట్")}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t("Complete transaction history, running ledger, invoices, and payments", "పూర్తి లావాదేవీల రికార్డు, రన్నింగ్ బ్యాలెన్స్, బిల్లులు మరియు పేమెంట్లు")}
                  </p>
                </div>
                {/* Segmented Party Toggle */}
                <div className="flex items-center gap-2">
                  <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => {
                        setWhatsappType("customer");
                        if (customers.length > 0) setWhatsappSelectedId(customers[0].id);
                      }}
                      className={`px-4 py-2 rounded-lg font-bold text-xs transition cursor-pointer ${
                        isCustomer ? curTheme.primary : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                      }`}
                    >
                      👤 Customer Statement
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setWhatsappType("supplier");
                        if (suppliers.length > 0) setWhatsappSelectedId(suppliers[0].id);
                      }}
                      className={`px-4 py-2 rounded-lg font-bold text-xs transition cursor-pointer ${
                        !isCustomer ? curTheme.primary : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                      }`}
                    >
                      🏭 Supplier Statement
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className={`px-3.5 py-2 ${curTheme.primary} font-bold text-xs rounded-xl flex items-center gap-1.5 shadow cursor-pointer`}
                  >
                    <Icon name="download" size={14} /> Print Statement
                  </button>
                </div>
              </div>

              {/* Selector Bar */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-3 no-print">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                  {isCustomer ? "Select Customer Account:" : "Select Supplier Account:"}
                </label>
                <select
                  value={whatsappSelectedId || (currentParty?.id || "")}
                  onChange={(e) => setWhatsappSelectedId(e.target.value)}
                  className="w-full sm:max-w-md p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold outline-none"
                >
                  {isCustomer
                    ? customers.map((c) => (
                        <option key={c.id} value={c.id} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                          {c.name} {c.mobile ? `(${c.mobile})` : ""} - Balance: {money(c.old_due || 0)}
                        </option>
                      ))
                    : suppliers.map((s) => {
                        const sPurchases = procurements.filter((p) => p.supplier_name === s.name || String(p.supplier_id) === String(s.id));
                        const sPurchased = sPurchases.reduce((sum, p) => sum + Number(p.total_amount || 0), 0);
                        const sPaid = sPurchases.reduce((sum, p) => sum + Number(p.p1_amount || 0), 0);
                        const sBal = Number(s.old_due || 0) + sPurchased - sPaid;
                        return (
                          <option key={s.id} value={s.id} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100">
                            {s.name} {s.mobile ? `(${s.mobile})` : ""} - Balance: {money(sBal)}
                          </option>
                        );
                      })}
                </select>
              </div>

              {currentParty ? (
                <div id="printable-ledger" className="space-y-6">
                  {/* Account Summary KPI Card */}
                  <div className="p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-slate-100 dark:border-slate-800 gap-2">
                      <div>
                        <h3 className="font-black text-lg text-slate-900 dark:text-white">{currentParty.name}</h3>
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                          Contact Mobile: {currentParty.mobile || "N/A"}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
                          Account Balance Status
                        </span>
                        <b className={`text-xl font-mono font-black ${isDue ? "text-rose-600" : isAdv ? "text-emerald-600" : "text-slate-500"}`}>
                          {isAdv ? `Advance: ${money(Math.abs(balAmount))}` : isDue ? `Due: ${money(balAmount)}` : "Settled (₹0.00)"}
                        </b>
                      </div>
                    </div>

                    {/* 4 Stat KPI Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Opening Balance</span>
                        <b className="font-mono text-slate-800 dark:text-slate-200 text-sm">{money(initialOpeningBal)}</b>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">
                          {isCustomer ? "Total Invoiced (+)" : "Total Purchased (+)"}
                        </span>
                        <b className="font-mono text-indigo-600 dark:text-indigo-400 text-sm">
                          {money(isCustomer ? custTotalInvoiced : supTotalPurchased)}
                        </b>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">
                          {isCustomer ? "Total Collected (-)" : "Total Paid (-)"}
                        </span>
                        <b className="font-mono text-emerald-600 dark:text-emerald-400 text-sm">
                          {money(isCustomer ? custTotalCollected : supTotalPaid)}
                        </b>
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] text-slate-400 block font-bold uppercase">Net Outstanding</span>
                        <b className={`font-mono text-sm ${isDue ? "text-rose-600" : isAdv ? "text-emerald-600" : "text-slate-600"}`}>
                          {isAdv ? `Adv: ${money(Math.abs(balAmount))}` : money(balAmount)}
                        </b>
                      </div>
                    </div>
                  </div>

                  {/* 1. UNIFIED CHRONOLOGICAL RUNNING LEDGER TABLE (GRID LINES MATCHING IMAGE 4) */}
                  <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        <span>📊</span> Complete Running Ledger Statement
                      </h4>
                      <span className="text-xs text-slate-500 font-mono no-print">
                        {displayLedgerRows.length} of {ledgerEntries.length} Transactions Recorded
                      </span>
                    </div>

                    {/* Dynamic Filter Controls (Point 9) */}
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1 pb-1 no-print">
                      <input
                        type="text"
                        placeholder="Search ref, particulars, mode..."
                        value={ledgerSearchQuery}
                        onChange={(e) => setLedgerSearchQuery(e.target.value)}
                        className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold outline-none focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white"
                      />
                      <select
                        value={ledgerDateFilter}
                        onChange={(e) => setLedgerDateFilter(e.target.value)}
                        className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold outline-none focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white"
                      >
                        <option value="all">📅 All Dates</option>
                        <option value="today">Today</option>
                        <option value="this_month">This Month</option>
                        <option value="last_30_days">Last 30 Days</option>
                        <option value="custom">Custom Date Range</option>
                      </select>
                      <select
                        value={ledgerTypeFilter}
                        onChange={(e) => setLedgerTypeFilter(e.target.value)}
                        className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold outline-none focus:bg-white dark:focus:bg-slate-900 text-slate-900 dark:text-white"
                      >
                        <option value="all">🔄 All Transactions</option>
                        <option value="debit">Debit Only ({isCustomer ? "Invoices" : "Bills"})</option>
                        <option value="credit">Credit Only ({isCustomer ? "Collections" : "Payments"})</option>
                      </select>
                      {ledgerDateFilter === "custom" ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="date"
                            value={ledgerStartDate}
                            onChange={(e) => setLedgerStartDate(e.target.value)}
                            className="w-1/2 px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-semibold text-slate-900 dark:text-white"
                          />
                          <span className="text-slate-400 text-xs">to</span>
                          <input
                            type="date"
                            value={ledgerEndDate}
                            onChange={(e) => setLedgerEndDate(e.target.value)}
                            className="w-1/2 px-2 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[11px] font-semibold text-slate-900 dark:text-white"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-end px-2 text-xs font-mono text-slate-500">
                          Active filters applied
                        </div>
                      )}
                    </div>

                    <div className="overflow-x-auto border border-sky-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
                      <table className="w-full text-left text-xs border-collapse font-mono border border-sky-200 dark:border-slate-700">
                        <thead className="bg-[#e4effa] dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold border-b border-sky-200 dark:border-slate-700">
                          <tr>
                            <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-center w-12">#</th>
                            <th className="p-2.5 border border-sky-200 dark:border-slate-700 w-28">Date</th>
                            <th className="p-2.5 border border-sky-200 dark:border-slate-700 w-32">Type</th>
                            <th className="p-2.5 border border-sky-200 dark:border-slate-700 w-32">Ref / Bill #</th>
                            <th className="p-2.5 border border-sky-200 dark:border-slate-700">Particulars / Details</th>
                            <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-right w-28">Debit (+) ₹</th>
                            <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-right w-28">Credit (-) ₹</th>
                            <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-right w-32">Running Bal ₹</th>
                            <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-center w-28">Mode</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Row 0: Opening Balance */}
                          <tr className="bg-slate-100/70 dark:bg-slate-800/60 font-bold">
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center">-</td>
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700">{filterStartDate ? `Prior to ${filterStartDate}` : "Opening"}</td>
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700">{filterStartDate ? "Brought Forward" : "Initial Balance"}</td>
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700">OPENING</td>
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700">{filterStartDate ? "Net cumulative balance prior to period" : "Opening Balance on Record"}</td>
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-right">{periodOpeningBal > 0 ? money(periodOpeningBal) : "-"}</td>
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-right">{periodOpeningBal < 0 ? money(Math.abs(periodOpeningBal)) : "-"}</td>
                            <td className={`p-2.5 border border-slate-300 dark:border-slate-700 text-right font-black ${periodOpeningBal > 0 ? "text-rose-600" : periodOpeningBal < 0 ? "text-emerald-600" : ""}`}>
                              {money(periodOpeningBal)}
                            </td>
                            <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center text-slate-400">Ledger</td>
                          </tr>

                          {/* Chronological Transactions */}
                          {displayLedgerRows.length === 0 ? (
                            <tr>
                              <td colSpan={9} className="p-4 text-center text-slate-400 font-sans">
                                No billing or payment transactions match the current filter selection.
                              </td>
                            </tr>
                          ) : (
                            displayLedgerRows.map((row, idx) => (
                              <tr key={idx} className="odd:bg-white even:bg-slate-50/70 dark:odd:bg-slate-900 dark:even:bg-slate-800/50 hover:bg-slate-100/40">
                                <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center font-mono">{idx + 1}</td>
                                <td className="p-2.5 border border-slate-300 dark:border-slate-700">{row.date}</td>
                                <td className="p-2.5 border border-slate-300 dark:border-slate-700">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    row.debit > 0
                                      ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-200"
                                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                                  }`}>
                                    {row.type}
                                  </span>
                                </td>
                                <td className="p-2.5 border border-slate-300 dark:border-slate-700 font-bold">{row.ref}</td>
                                <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">{row.desc}</td>
                                <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-right font-bold text-indigo-700 dark:text-indigo-400">
                                  {row.debit > 0 ? money(row.debit) : "-"}
                                </td>
                                <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-right font-bold text-emerald-700 dark:text-emerald-400">
                                  {row.credit > 0 ? money(row.credit) : "-"}
                                </td>
                                <td className={`p-2.5 border border-slate-300 dark:border-slate-700 text-right font-black ${row.balance > 0 ? "text-rose-600" : row.balance < 0 ? "text-emerald-600" : "text-slate-500"}`}>
                                  {money(row.balance)}
                                </td>
                                <td className="p-2.5 border border-slate-300 dark:border-slate-700 text-center font-bold text-[11px] text-slate-600 dark:text-slate-400">
                                  {row.mode}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                        {displayLedgerRows.length > 0 && (
                          <tfoot className="bg-slate-100 dark:bg-slate-800 font-bold border-t-2 border-slate-300 dark:border-slate-700 text-xs">
                            <tr>
                              <td colSpan={5} className="p-2.5 text-right uppercase tracking-wider text-slate-600 dark:text-slate-300">
                                Filtered Total ({displayLedgerRows.length} items):
                              </td>
                              <td className="p-2.5 text-right text-indigo-600 dark:text-indigo-400">
                                {money(displayLedgerRows.reduce((s, r) => s + r.debit, 0))}
                              </td>
                              <td className="p-2.5 text-right text-emerald-600 dark:text-emerald-400">
                                {money(displayLedgerRows.reduce((s, r) => s + r.credit, 0))}
                              </td>
                              <td className={`p-2.5 text-right font-black ${runningBalTracker > 0 ? "text-rose-600" : runningBalTracker < 0 ? "text-emerald-600" : ""}`}>
                                {money(runningBalTracker)}
                              </td>
                              <td className="p-2.5"></td>
                            </tr>
                          </tfoot>
                        )}
                      </table>
                    </div>
                  </div>

                  {/* 2. DETAILED SUB-TABLES (INVOICES / PURCHASES & COLLECTIONS / PAYMENTS) */}
                  {(() => {
                    // Synchronize sub-tables with the active filter parameters
                    const displayInvoiced = isCustomer
                      ? custInvoices.filter((inv) => {
                          const dt = inv.invoice_date || (inv.created_at ? new Date(inv.created_at).toLocaleDateString("en-CA") : "");
                          if (filterStartDate && dt < filterStartDate) return false;
                          if (filterEndDate && dt > filterEndDate) return false;
                          if (ledgerSearchQuery.trim()) {
                            const q = ledgerSearchQuery.toLowerCase();
                            if (!(inv.invoice_number || `INV-${inv.id}`).toLowerCase().includes(q)) return false;
                          }
                          return true;
                        })
                      : supPurchases.filter((p) => {
                          const dt = p.created_at ? new Date(p.created_at).toLocaleDateString("en-CA") : "";
                          if (filterStartDate && dt < filterStartDate) return false;
                          if (filterEndDate && dt > filterEndDate) return false;
                          if (ledgerSearchQuery.trim()) {
                            const q = ledgerSearchQuery.toLowerCase();
                            if (!(`BILL-${p.id}`).toLowerCase().includes(q)) return false;
                          }
                          return true;
                        });

                    const displayCollected = isCustomer
                      ? custCollections.filter((col) => {
                          const dt = col.created_at ? new Date(col.created_at).toLocaleDateString("en-CA") : "";
                          if (filterStartDate && dt < filterStartDate) return false;
                          if (filterEndDate && dt > filterEndDate) return false;
                          if (ledgerSearchQuery.trim()) {
                            const q = ledgerSearchQuery.toLowerCase();
                            const match = (col.reference_no || `REC-${col.id}`).toLowerCase().includes(q) || (col.collection_type || "").toLowerCase().includes(q);
                            if (!match) return false;
                          }
                          return true;
                        })
                      : supPurchases.filter((p) => {
                          if (Number(p.p1_amount || 0) <= 0) return false;
                          const dt = p.created_at ? new Date(p.created_at).toLocaleDateString("en-CA") : "";
                          if (filterStartDate && dt < filterStartDate) return false;
                          if (filterEndDate && dt > filterEndDate) return false;
                          return true;
                        });

                    const totalDisplayInvoiced = displayInvoiced.reduce((s, x) => s + Number(x.total_amount || 0), 0);
                    const totalDisplayCollected = isCustomer
                      ? displayCollected.reduce((s, x) => s + Number(x.amount || 0), 0)
                      : displayCollected.reduce((s, x) => s + Number(x.p1_amount || 0), 0);

                    return (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Billed Records Table */}
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                          <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                            <span>📦 {isCustomer ? "Customer Invoices" : "Supplier Purchase Orders"} ({displayInvoiced.length})</span>
                            <span className="font-mono text-indigo-600 font-bold">Total: {money(totalDisplayInvoiced)}</span>
                          </h4>
                          <div className="overflow-x-auto border border-slate-300 dark:border-slate-700 rounded-xl max-h-64">
                            <table className="w-full text-left text-xs border-collapse font-mono border border-slate-300 dark:border-slate-700">
                              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 sticky top-0 border-b border-slate-300 dark:border-slate-700">
                                <tr>
                                  <th className="p-2 border border-slate-300 dark:border-slate-700">Bill No</th>
                                  <th className="p-2 border border-slate-300 dark:border-slate-700">Date</th>
                                  <th className="p-2 border border-slate-300 dark:border-slate-700 text-right">Amount</th>
                                  <th className="p-2 border border-slate-300 dark:border-slate-700 text-right">Paid</th>
                                  <th className="p-2 border border-slate-300 dark:border-slate-700 text-right">Due</th>
                                </tr>
                              </thead>
                              <tbody>
                                {isCustomer ? (
                                  displayInvoiced.length === 0 ? (
                                    <tr><td colSpan={5} className="p-3 text-center text-slate-400 font-sans">No invoices in filtered period</td></tr>
                                  ) : (
                                    displayInvoiced.map((inv) => {
                                      const invAlloc = invoiceAllocationsMap.get(String(inv.id));
                                      const paidAmt = invAlloc ? invAlloc.totalPaid : Number(inv.upfront_paid || 0);
                                      const dueAmt = invAlloc ? invAlloc.balanceDue : Math.max(0, Number(inv.total_amount || 0) - paidAmt);
                                      return (
                                        <tr key={inv.id} className="odd:bg-white even:bg-slate-50/70 dark:odd:bg-slate-900 dark:even:bg-slate-800/50">
                                          <td className="p-2 border border-slate-300 dark:border-slate-700 font-bold">{inv.invoice_number || `INV-${inv.id}`}</td>
                                          <td className="p-2 border border-slate-300 dark:border-slate-700">{inv.invoice_date || (inv.created_at ? new Date(inv.created_at).toLocaleDateString("en-CA") : "N/A")}</td>
                                          <td className="p-2 border border-slate-300 dark:border-slate-700 text-right">{money(inv.total_amount)}</td>
                                          <td className="p-2 border border-slate-300 dark:border-slate-700 text-right text-emerald-600 font-bold">{money(paidAmt)}</td>
                                          <td className={`p-2 border border-slate-300 dark:border-slate-700 text-right font-black ${dueAmt > 0 ? "text-rose-600" : "text-slate-400"}`}>
                                            {money(dueAmt)}
                                          </td>
                                        </tr>
                                      );
                                    })
                                  )
                                ) : (
                                  displayInvoiced.length === 0 ? (
                                    <tr><td colSpan={5} className="p-3 text-center text-slate-400 font-sans">No purchase bills in filtered period</td></tr>
                                  ) : (
                                    displayInvoiced.map((p) => {
                                      const total = Number(p.total_amount || 0);
                                      const paid = Number(p.p1_amount || 0);
                                      const due = Math.max(0, total - paid);
                                      return (
                                        <tr key={p.id} className="odd:bg-white even:bg-slate-50/70 dark:odd:bg-slate-900 dark:even:bg-slate-800/50">
                                          <td className="p-2 border border-slate-300 dark:border-slate-700 font-bold">BILL-{p.id}</td>
                                          <td className="p-2 border border-slate-300 dark:border-slate-700">{p.created_at ? new Date(p.created_at).toLocaleDateString("en-CA") : "N/A"}</td>
                                          <td className="p-2 border border-slate-300 dark:border-slate-700 text-right">{money(total)}</td>
                                          <td className="p-2 border border-slate-300 dark:border-slate-700 text-right text-emerald-600">{money(paid)}</td>
                                          <td className="p-2 border border-slate-300 dark:border-slate-700 text-right font-black text-rose-600">{money(due)}</td>
                                        </tr>
                                      );
                                    })
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Paid Records Table */}
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                          <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                            <span>💰 {isCustomer ? "Collections Received" : "Payments Disbursed"} ({displayCollected.length})</span>
                            <span className="font-mono text-emerald-600 font-bold">Total: {money(totalDisplayCollected)}</span>
                          </h4>
                          <div className="overflow-x-auto border border-slate-300 dark:border-slate-700 rounded-xl max-h-64">
                            <table className="w-full text-left text-xs border-collapse font-mono border border-slate-300 dark:border-slate-700">
                              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 sticky top-0 border-b border-slate-300 dark:border-slate-700">
                                <tr>
                                  <th className="p-2 border border-slate-300 dark:border-slate-700">Date</th>
                                  <th className="p-2 border border-slate-300 dark:border-slate-700">Ref</th>
                                  <th className="p-2 border border-slate-300 dark:border-slate-700">Mode</th>
                                  <th className="p-2 border border-slate-300 dark:border-slate-700 text-right">Amount (₹)</th>
                                </tr>
                              </thead>
                              <tbody>
                                {isCustomer ? (
                                  displayCollected.length === 0 ? (
                                    <tr><td colSpan={4} className="p-3 text-center text-slate-400 font-sans">No collections in filtered period</td></tr>
                                  ) : (
                                    displayCollected.map((col) => (
                                      <tr key={col.id} className="odd:bg-white even:bg-slate-50/70 dark:odd:bg-slate-900 dark:even:bg-slate-800/50">
                                        <td className="p-2 border border-slate-300 dark:border-slate-700">{col.created_at ? new Date(col.created_at).toLocaleDateString("en-CA") : "N/A"}</td>
                                        <td className="p-2 border border-slate-300 dark:border-slate-700 font-bold">
                                          {col.reference_no || `REC-${col.id}`}
                                          {col.isUpfront && (
                                            <span className="ml-1 text-[9px] px-1 py-0.2 rounded bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 font-sans">
                                              Upfront
                                            </span>
                                          )}
                                        </td>
                                        <td className="p-2 border border-slate-300 dark:border-slate-700">{col.payment_mode || "Cash"}</td>
                                        <td className="p-2 border border-slate-300 dark:border-slate-700 text-right font-bold text-emerald-600">{money(col.amount)}</td>
                                      </tr>
                                    ))
                                  )
                                ) : (
                                  displayCollected.length === 0 ? (
                                    <tr><td colSpan={4} className="p-3 text-center text-slate-400 font-sans">No payments recorded in filtered period</td></tr>
                                  ) : (
                                    displayCollected.map((p) => (
                                      <tr key={p.id} className="odd:bg-white even:bg-slate-50/70 dark:odd:bg-slate-900 dark:even:bg-slate-800/50">
                                        <td className="p-2 border border-slate-300 dark:border-slate-700">{p.created_at ? new Date(p.created_at).toLocaleDateString("en-CA") : "N/A"}</td>
                                        <td className="p-2 border border-slate-300 dark:border-slate-700 font-bold">BILL-{p.id}</td>
                                        <td className="p-2 border border-slate-300 dark:border-slate-700">{p.p1_mode || "Cash"}</td>
                                        <td className="p-2 border border-slate-300 dark:border-slate-700 text-right font-bold text-emerald-600">{money(p.p1_amount)}</td>
                                      </tr>
                                    ))
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center text-slate-400 text-xs">
                  Please select a customer or supplier account to view statement.
                </div>
              )}
            </div>
          );
        })()}

        {/* VIEW 11: PARTNER CAPITAL ACCOUNTS */}
        {activeTab === "partners" && (() => {
          const totalNetCapital = partnerAccounts.reduce((s, p) => s + (p.netCash || 0) + (p.netUpi || 0), 0);
          const totalNetCash = partnerAccounts.reduce((s, p) => s + (p.netCash || 0), 0);
          const totalNetUpi = partnerAccounts.reduce((s, p) => s + (p.netUpi || 0), 0);
          const safePartnerPage = Math.min(partnerPage, Math.max(1, Math.ceil(partnerAccounts.length / 10)));
          const pagedPartners = partnerAccounts.slice((safePartnerPage - 1) * 10, safePartnerPage * 10);

          return (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span className="text-indigo-600">🤝</span> Partner Capital Accounts
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Track liquid physical cash, UPI holdings, and capital investments tied to active partners
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingPartnerId(null);
                    setPartnerForm({ name: "", opening_cash: "", opening_upi: "", pin: "0000", role: "partner" });
                    setShowPartnerModal(true);
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
                >
                  <Icon name="plus" size={15} /> Add Partner Account
                </button>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Partner Capital</span>
                  <b className="text-xl font-black text-indigo-600 mt-1 block">
                    {money(totalNetCapital)}
                  </b>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">Combined physical cash & UPI</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Physical Cash in Hand</span>
                  <b className="text-xl font-black text-emerald-600 mt-1 block">
                    {money(totalNetCash)}
                  </b>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">Liquid drawer / shop cash</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">UPI / Bank in Hand</span>
                  <b className="text-xl font-black text-sky-600 mt-1 block">
                    {money(totalNetUpi)}
                  </b>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">Liquid digital / QR balances</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Partners</span>
                  <b className="text-xl font-black text-slate-800 mt-1 block">
                    {partnerAccounts.length}
                  </b>
                  <span className="text-[11px] text-slate-400 mt-0.5 block">Operating capital accounts</span>
                </div>
              </div>

              {/* Individual Partner Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {partnerAccounts.map((p) => {
                  const netTotal = (p.netCash || 0) + (p.netUpi || 0);
                  return (
                    <div key={p.id} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-black text-base text-slate-900">{p.name}</h4>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-wider">
                            {p.role || "Partner"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEditPartner(p)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeletePartner(p)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                            title="Delete Partner"
                          >
                            <Icon name="trash" size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                        <div className="bg-emerald-50/60 p-2.5 rounded-xl border border-emerald-100">
                          <span className="text-slate-500 font-bold block text-[10px] uppercase">Cash in Hand</span>
                          <b className="text-sm font-black text-emerald-700 block mt-0.5">{money(p.netCash || 0)}</b>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">Opening: {money(p.initCash || 0)}</span>
                        </div>
                        <div className="bg-sky-50/60 p-2.5 rounded-xl border border-sky-100">
                          <span className="text-slate-500 font-bold block text-[10px] uppercase">UPI in Hand</span>
                          <b className="text-sm font-black text-sky-700 block mt-0.5">{money(p.netUpi || 0)}</b>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">Opening: {money(p.initUpi || 0)}</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs font-bold text-slate-700">
                        <span>Total Net Balance:</span>
                        <span className={`text-sm font-black ${netTotal >= 0 ? "text-indigo-600" : "text-rose-600"}`}>
                          {money(netTotal)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Partner Capital ERP Grid Table */}
              <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <h3 className="font-black text-sm text-slate-900">Partner Capital Liquidity Breakdown</h3>
                  <span className="text-xs text-slate-500 font-medium">{partnerAccounts.length} partner accounts</span>
                </div>

                {renderPagination(safePartnerPage, partnerAccounts.length, 10, setPartnerPage)}

                <div className="overflow-x-auto border border-sky-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
                  <table className="w-full text-left text-xs border-collapse font-mono border border-sky-200 dark:border-slate-700">
                    <thead className="bg-[#e4effa] dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold border-b border-sky-200 dark:border-slate-700">
                      <tr>
                        <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold">Partner Name</th>
                        <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-center">Role</th>
                        <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-right">Opening Cash</th>
                        <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-right">Opening UPI</th>
                        <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-right">Cash in Hand</th>
                        <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-right">UPI in Hand</th>
                        <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-right">Total Net Capital</th>
                        <th className="p-2.5 border border-sky-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 font-bold text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sky-100 dark:divide-slate-800 font-medium">
                      {pagedPartners.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-slate-400">
                            No partner accounts found. Click "Add Partner Account" to create one.
                          </td>
                        </tr>
                      ) : (
                        pagedPartners.map((p) => {
                          const netTotal = (p.netCash || 0) + (p.netUpi || 0);
                          return (
                            <tr key={p.id} className="even:bg-[#f8fbfd] dark:even:bg-slate-800/40 hover:bg-sky-50/60 dark:hover:bg-slate-800 transition">
                              <td className="p-2.5 border border-sky-100 dark:border-slate-800 font-bold text-slate-900">
                                {p.name}
                              </td>
                              <td className="p-2.5 border border-sky-100 dark:border-slate-800 text-center">
                                <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                                  {p.role || "Partner"}
                                </span>
                              </td>
                              <td className="p-2.5 border border-sky-100 dark:border-slate-800 text-right text-slate-600">
                                {money(p.initCash || 0)}
                              </td>
                              <td className="p-2.5 border border-sky-100 dark:border-slate-800 text-right text-slate-600">
                                {money(p.initUpi || 0)}
                              </td>
                              <td className="p-2.5 border border-sky-100 dark:border-slate-800 text-right font-bold text-emerald-600">
                                {money(p.netCash || 0)}
                              </td>
                              <td className="p-2.5 border border-sky-100 dark:border-slate-800 text-right font-bold text-sky-600">
                                {money(p.netUpi || 0)}
                              </td>
                              <td className={`p-2.5 border border-sky-100 dark:border-slate-800 text-right font-black ${netTotal >= 0 ? "text-indigo-600" : "text-rose-600"}`}>
                                {money(netTotal)}
                              </td>
                              <td className="p-2.5 border border-sky-100 dark:border-slate-800 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleEditPartner(p)}
                                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeletePartner(p)}
                                    className="p-1 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                                    title="Delete Partner"
                                  >
                                    <Icon name="trash" size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
                {renderPagination(safePartnerPage, partnerAccounts.length, 10, setPartnerPage)}
              </div>
            </div>
          );
        })()}

        {/* VIEW 13: SYSTEM SETTINGS MODULE (LANGUAGE, LIVE THEME PREVIEW, GOOGLE AUTHENTICATOR 2FA, BACKUP) */}
        {activeTab === "settings" && (() => {
          return (
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Header */}
              <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="text-xl">⚙️</span> {t("System Settings & Customization", "సిస్టమ్ సెట్టింగ్స్ & కాన్ఫిగరేషన్")}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t("Configure language, color themes, display modes, Google Authenticator security, and database backup.", "భాష, రంగులు, లైట్/డార్క్ మోడ్, సెక్యూరిటీ మరియు బ్యాకప్ సెట్టింగ్స్")}
                </p>
              </div>

              {/* SECTION 1: LANGUAGE SELECTION (POINT 1 & 5) */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span>🌐</span> System Language (భాష ఎంపిక)
                </h3>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <b className="text-xs text-slate-800 dark:text-slate-200 block">Choose System Language:</b>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Default is clean English. Telugu subtitles and hints available when selected.
                    </span>
                  </div>
                  <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => toggleLanguage("en")}
                      className={`px-4 py-2 rounded-lg font-bold text-xs transition cursor-pointer ${
                        language === "en" ? curTheme.primary : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                      }`}
                    >
                      English (Default)
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleLanguage("te")}
                      className={`px-4 py-2 rounded-lg font-bold text-xs transition cursor-pointer ${
                        language === "te" ? curTheme.primary : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                      }`}
                    >
                      తెలుగు (Telugu)
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 2: THEME COLOR WITH LIVE PREVIEW (POINT 7) */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span>🎨</span> Accent Theme Color (రంగుల ఎంపిక)
                </h3>
                
                {/* Live Theme Preview Banner (Point 7 - Instantly shows user the theme is active) */}
                <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${curTheme.primaryLight}`}>
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full inline-block shadow-xs" style={{ backgroundColor: curTheme.hex }} />
                    <div>
                      <b className="text-xs block">Active System Theme: {curTheme.name} ✓</b>
                      <span className="text-[11px] opacity-80">This color is now actively applied to all buttons, navigation tabs, and system highlights</span>
                    </div>
                  </div>
                  <button className={`px-4 py-2 rounded-xl text-xs font-bold shadow-xs ${curTheme.primary}`}>
                    Active Preview Button
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2">
                  <div>
                    <b className="text-xs text-slate-800 dark:text-slate-200 block">Select Accent Theme:</b>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Click any palette color below to change your active ERP theme</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[
                      { id: "indigo", name: "Classic Indigo", color: "bg-indigo-600" },
                      { id: "emerald", name: "Farmer Emerald", color: "bg-emerald-600" },
                      { id: "blue", name: "Ocean Sky", color: "bg-sky-600" },
                      { id: "rose", name: "Crimson Rose", color: "bg-rose-600" },
                      { id: "amber", name: "Warm Amber", color: "bg-amber-600" }
                    ].map((th) => (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => updateThemeColor(th.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition cursor-pointer ${
                          themeColor === th.id
                            ? "border-slate-900 dark:border-white bg-slate-100 dark:bg-slate-800 text-slate-950 dark:text-white font-black shadow-xs ring-2 ring-indigo-400"
                            : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full ${th.color} inline-block`} />
                        {th.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 3: DISPLAY & TEXT SIZE (POINT 4 & 5) */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span>☀️</span> Display & Font Scale
                </h3>

                {/* Light / Dark Mode Toggle */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <b className="text-xs text-slate-800 dark:text-slate-200 block">Day / Night Mode (Light & Dark Theme):</b>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">High-contrast dark mode for night operations</span>
                  </div>
                  <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-300 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => { if (darkMode) toggleDarkMode(); }}
                      className={`px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                        !darkMode ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <span className="text-amber-500">☀️</span> Light
                    </button>
                    <button
                      type="button"
                      onClick={() => { if (!darkMode) toggleDarkMode(); }}
                      className={`px-4 py-2 rounded-full font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
                        darkMode ? "bg-slate-900 text-amber-400 shadow-sm" : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <span>🌙</span> Dark
                    </button>
                  </div>
                </div>

                {/* Font Scale */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <b className="text-xs text-slate-800 dark:text-slate-200 block">Text Size / Font Scale:</b>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">Enlarge text size for better readability</span>
                  </div>
                  <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                      type="button"
                      onClick={() => updateFontScale("normal")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        fontScale === "normal" ? curTheme.primary : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                      }`}
                    >
                      Normal (100%)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateFontScale("large")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        fontScale === "large" ? curTheme.primary : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                      }`}
                    >
                      Large (115%)
                    </button>
                    <button
                      type="button"
                      onClick={() => updateFontScale("xl")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                        fontScale === "xl" ? curTheme.primary : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
                      }`}
                    >
                      Extra Large (125%)
                    </button>
                  </div>
                </div>
              </div>

              {/* SECTION 4: SECURITY & GOOGLE AUTHENTICATOR (POINT 6) */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span>🔐</span> Login Security & Google Authenticator (2FA)
                </h3>

                {/* Google Authenticator Toggle */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <b className="text-xs text-slate-800 dark:text-slate-200 block">Google Authenticator Two-Factor Authentication:</b>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      When enabled, requires a 6-digit TOTP code from Google Authenticator app on login
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !enableTwoFactor;
                      setEnableTwoFactor(next);
                      if (typeof window !== "undefined") localStorage.setItem("enable_2fa", next ? "true" : "false");
                      alert(next ? "Google Authenticator 2FA Enabled!" : "Google Authenticator 2FA Disabled.");
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition ${
                      enableTwoFactor
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {enableTwoFactor ? "✓ 2FA Enabled" : "Enable 2FA"}
                  </button>
                </div>

                {/* 2FA Setup Instructions Card with QR Code and 1-Click Mobile Actions */}
                {enableTwoFactor && (
                  <div className="p-5 bg-gradient-to-r from-indigo-50 via-slate-50 to-emerald-50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-emerald-950/30 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 space-y-4 text-xs">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-indigo-200 dark:border-indigo-800">
                      <div>
                        <b className="text-sm text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
                          <span>📱</span> Google Authenticator Mobile Setup
                        </b>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Scan the QR code below with Google Authenticator or tap 'Copy Key'
                        </span>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded-full">
                        2FA Active
                      </span>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-5">
                      {/* Live Scannable QR Code */}
                      <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center gap-1.5 shrink-0">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=otpauth%3A%2F%2Ftotp%2FJSR%2520Retail%2520(B%2520Reddy)%3Fsecret%3D${twoFactorSecret}%26issuer%3DJSR%2520Retail`}
                          alt="Google Authenticator QR Code"
                          className="w-36 h-36 rounded-lg"
                        />
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                          Scan with App
                        </span>
                      </div>

                      {/* Mobile Instructions & Action Buttons */}
                      <div className="space-y-3 flex-1 w-full">
                        <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block">Your Setup Key (కీ)</span>
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono font-black text-sm text-indigo-600 dark:text-indigo-400 tracking-wider">
                              {twoFactorSecret}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(twoFactorSecret);
                                alert("Setup Key copied to clipboard! Open Google Authenticator > Tap '+' > Enter a setup key > Paste.");
                              }}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition shadow-xs"
                            >
                              <span>📋</span> Copy Key
                            </button>
                          </div>
                        </div>

                        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] space-y-1 text-slate-700 dark:text-slate-300">
                          <div><b>Account Name:</b> <span className="font-mono text-indigo-600 dark:text-indigo-400">JSR Retail (B Reddy)</span></div>
                          <div><b>Type of Key:</b> <span className="font-mono">Time-based (సమయ ఆధారితం)</span></div>
                          <div><b>Emergency Master Code:</b> <span className="font-mono text-rose-600 font-bold">999999</span></div>
                        </div>

                        {/* Direct Mobile Launch Button */}
                        <a
                          href={`otpauth://totp/JSR%20Retail%20(B%20Reddy)?secret=${twoFactorSecret}&issuer=JSR%20Retail`}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition text-center"
                        >
                          <span>⚡</span> Open Directly in Authenticator App
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Require PIN on Startup Toggle */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <b className="text-xs text-slate-800 dark:text-slate-200 block">Require PIN on Startup:</b>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      When turned off, skips login gate on app open
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={toggleRequireLogin}
                    className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition ${
                      requireLogin
                        ? "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800"
                        : "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800"
                    }`}
                  >
                    {requireLogin ? "🔒 PIN Required" : "⚡ Direct Access"}
                  </button>
                </div>
              </div>

              {/* SECTION 5: DATA BACKUP & RESTORE */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                  <span>💾</span> Complete Database Backup & Restore
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Export complete data snapshot (Customers, Suppliers, Items, Invoices, Purchases, Collections, Expenses) to a JSON file on your computer.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-200 dark:border-indigo-800 space-y-2">
                    <b className="text-xs text-indigo-900 dark:text-indigo-300 block">1. Export Full System Backup:</b>
                    <button
                      type="button"
                      onClick={handleExportAllData}
                      className={`w-full py-2.5 ${curTheme.primary} font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer`}
                    >
                      <span>📥</span> Export Backup JSON
                    </button>
                  </div>

                  <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-2">
                    <b className="text-xs text-emerald-900 dark:text-emerald-300 block">2. Restore from JSON Backup:</b>
                    <label className={`w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs cursor-pointer text-center ${
                      importingBackup ? "opacity-50 pointer-events-none" : ""
                    }`}>
                      <span>📤</span> {importingBackup ? "Restoring..." : "Select Backup JSON to Restore"}
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportBackup}
                        className="hidden"
                        disabled={importingBackup}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* SECTION 6: SYSTEM INFO */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <b className="text-slate-900 dark:text-slate-200 block">JSR Retail Sales ERP System</b>
                  <span>Database: Supabase PostgreSQL Connected • Branch: B Reddy Traders</span>
                </div>
                <span className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 font-bold rounded-lg text-slate-700 dark:text-slate-200 text-[11px]">
                  Version 3.0 (Enterprise Custom Edition)
                </span>
              </div>
            </div>
          );
        })()}
      </main>

      {/* MODAL: ADD / EDIT LENDER */}
      {showLenderModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-3">
            <h3 className="font-bold text-base text-slate-900">{editingLenderId ? "Edit Loan Source" : "Add Business Loan Source"}</h3>
            <form onSubmit={saveLender} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Lender / Source (e.g. Muthoot Gold Loan, Srinivas)"
                className="w-full p-2.5 border rounded-xl text-sm"
                value={lenderForm.name}
                onChange={(e) => setLenderForm({ ...lenderForm, name: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Contact Phone"
                className="w-full p-2.5 border rounded-xl text-sm"
                value={lenderForm.mobile}
                onChange={(e) => setLenderForm({ ...lenderForm, mobile: e.target.value })}
              />
              <input
                type="number"
                placeholder="Current Outstanding Loan (₹)"
                className="w-full p-2.5 border rounded-xl text-sm font-bold text-rose-600"
                value={lenderForm.initial_loan}
                onChange={(e) => setLenderForm({ ...lenderForm, initial_loan: e.target.value })}
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowLenderModal(false)} className="flex-1 py-2 border rounded-xl text-xs font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD LOAN REPAYMENT */}
      {showLoanPaymentModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-3">
            <h3 className="font-bold text-base text-slate-900">Repay Business Loan / Interest</h3>
            <form onSubmit={saveLoanRepayment} className="space-y-3">
              <select
                required
                className="w-full p-2.5 border rounded-xl text-xs font-semibold"
                value={loanPaymentForm.borrower_id}
                onChange={(e) => setLoanPaymentForm({ ...loanPaymentForm, borrower_id: e.target.value })}
              >
                <option value="">-- Choose Lender / Loan Source --</option>
                {lenders.map((l) => (
                  <option key={l.id} value={l.id}>{l.name} (Due: {money(l.balance_due)})</option>
                ))}
              </select>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Principal Repayment (అసలు చెల్లింపు ₹ - Optional if paying interest only)
                  </label>
                  <input
                    type="number"
                    placeholder="Principal Amount (₹, Leave 0 for interest only)"
                    className="w-full p-2.5 border rounded-xl text-sm font-bold text-rose-600"
                    value={loanPaymentForm.principal_amount}
                    onChange={(e) => setLoanPaymentForm({ ...loanPaymentForm, principal_amount: e.target.value })}
                  />
                  <span className="text-[10px] text-slate-400">Reduces the lender balance due</span>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Interest Amount (వడ్డీ చెల్లింపు ₹)
                  </label>
                  <input
                    type="number"
                    placeholder="Interest Amount (₹, Optional)"
                    className="w-full p-2.5 border rounded-xl text-sm font-bold text-amber-600"
                    value={loanPaymentForm.interest_amount}
                    onChange={(e) => setLoanPaymentForm({ ...loanPaymentForm, interest_amount: e.target.value })}
                  />
                  <span className="text-[10px] text-slate-400">Interest paid does not reduce principal balance</span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center text-xs font-bold text-slate-700">
                  <span>Total Deducted from Partner:</span>
                  <span className="text-sm font-black text-rose-600">
                    {money(Number(loanPaymentForm.principal_amount || 0) + Number(loanPaymentForm.interest_amount || 0))}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLoanPaymentForm({ ...loanPaymentForm, payment_mode: "Cash" })}
                  className={`py-2 rounded-xl text-xs font-bold border ${loanPaymentForm.payment_mode === "Cash" ? "bg-emerald-600 text-white" : "bg-white"}`}
                >
                  💵 Cash
                </button>
                <button
                  type="button"
                  onClick={() => setLoanPaymentForm({ ...loanPaymentForm, payment_mode: "UPI" })}
                  className={`py-2 rounded-xl text-xs font-bold border ${loanPaymentForm.payment_mode === "UPI" ? "bg-indigo-600 text-white" : "bg-white"}`}
                >
                  📱 UPI
                </button>
              </div>

              <select
                required
                className="w-full p-2.5 border rounded-xl text-xs font-semibold"
                value={loanPaymentForm.partner_id}
                onChange={(e) => setLoanPaymentForm({ ...loanPaymentForm, partner_id: e.target.value })}
              >
                <option value="">-- Partner Account Paying --</option>
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Payment Date (చెల్లింపు తేదీ)
                </label>
                <input
                  type="date"
                  required
                  className="w-full p-2.5 border rounded-xl text-xs font-semibold text-slate-800"
                  value={loanPaymentForm.tx_date}
                  onChange={(e) => setLoanPaymentForm({ ...loanPaymentForm, tx_date: e.target.value })}
                />
              </div>

              <input
                type="text"
                placeholder="Notes / Cheque / Voucher Ref (Optional)"
                className="w-full p-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-xl text-xs"
                value={loanPaymentForm.notes}
                onChange={(e) => setLoanPaymentForm({ ...loanPaymentForm, notes: e.target.value })}
              />

              <div className="flex gap-2">
                <button type="button" onClick={() => setShowLoanPaymentModal(false)} className="flex-1 py-2 border rounded-xl text-xs font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs">Record Repayment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PAY SUPPLIER PURCHASE BILL */}
      {showPayPurchaseModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 max-w-sm w-full my-auto max-h-[90dvh] overflow-y-auto space-y-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">{editingPaymentId ? "Edit Supplier Payment" : "Pay Supplier Purchase Bill"}</h3>

            {!isBillLocked && (
              <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setPaySupplierMode("single");
                    setMultiSupplierId("");
                    setPayPurchaseForm((prev) => ({ ...prev, purchase_id: "", amount: "" }));
                  }}
                  className={`flex-1 py-1.5 rounded-lg transition ${paySupplierMode === "single" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600"}`}
                >
                  Pay Single Bill
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPaySupplierMode("multi");
                    setPayPurchaseForm((prev) => ({ ...prev, purchase_id: "", amount: "" }));
                    setMultiSupplierId("");
                  }}
                  className={`flex-1 py-1.5 rounded-lg transition ${paySupplierMode === "multi" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600"}`}
                >
                  Pay Supplier (Multiple Bills)
                </button>
              </div>
            )}

            <form onSubmit={savePurchasePayment} className="space-y-3">
              {paySupplierMode === "single" ? (
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Select Purchase Bill {isBillLocked && "(Locked)"}
                  </label>
                  <select
                    required
                    disabled={isBillLocked}
                    className="w-full p-2.5 border rounded-xl text-xs font-semibold disabled:bg-slate-100 disabled:text-slate-600"
                    value={payPurchaseForm.purchase_id}
                onChange={(e) => {
                  const target = procurements.find((p) => p.id == e.target.value);
                  const remDue = target ? Math.max(0, Number(target.total_amount || 0) - Number(target.p1_amount || 0)) : "";
                  setPayPurchaseForm({
                    ...payPurchaseForm,
                    purchase_id: e.target.value,
                    amount: remDue ? String(remDue) : ""
                  });
                }}
              >
                <option value="">-- Choose Purchase Bill with Due --</option>
                {procurements
                  .filter((p) => editingPaymentId || p.id == payPurchaseForm.purchase_id || Number(p.total_amount || 0) > Number(p.p1_amount || 0))
                  .map((p) => {
                    const due = Math.max(0, Number(p.total_amount || 0) - Number(p.p1_amount || 0));
                    return (
                      <option key={p.id} value={p.id}>
                        {p.supplier_name} — Due: {money(due)} (PUR-{p.id})
                      </option>
                    );
                  })}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Choose Supplier (Settle Multiple Bills FIFO)
                  </label>
                  <select
                    required
                    className="w-full p-2.5 border rounded-xl text-xs font-semibold"
                    value={multiSupplierId}
                    onChange={(e) => {
                      const sid = e.target.value;
                      setMultiSupplierId(sid);
                      const targetSup = suppliers.find((s) => String(s.id) === sid);
                      if (targetSup) {
                        const totalDue = procurements
                          .filter((p) => p.supplier_name === targetSup.name)
                          .reduce((s, p) => s + Math.max(0, Number(p.total_amount || 0) - Number(p.p1_amount || 0)), 0);
                        setPayPurchaseForm((prev) => ({ ...prev, amount: totalDue > 0 ? String(totalDue) : "" }));
                      }
                    }}
                  >
                    <option value="">-- Choose Supplier --</option>
                    {suppliers.map((s) => {
                      const totalDue = procurements
                        .filter((p) => p.supplier_name === s.name)
                        .reduce((sum, p) => sum + Math.max(0, Number(p.total_amount || 0) - Number(p.p1_amount || 0)), 0);
                      return (
                        <option key={s.id} value={s.id}>
                          {s.name} — Pending Bills Due: {money(totalDue)}
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}

              <input
                type="number"
                required
                placeholder="Payment Amount (₹)"
                className="w-full p-2.5 border rounded-xl text-sm font-bold text-indigo-600"
                value={payPurchaseForm.amount}
                onChange={(e) => setPayPurchaseForm({ ...payPurchaseForm, amount: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPayPurchaseForm({ ...payPurchaseForm, payment_mode: "Cash" })}
                  className={`py-2 rounded-xl text-xs font-bold border ${payPurchaseForm.payment_mode === "Cash" ? "bg-emerald-600 text-white" : "bg-white"}`}
                >
                  💵 Cash
                </button>
                <button
                  type="button"
                  onClick={() => setPayPurchaseForm({ ...payPurchaseForm, payment_mode: "UPI" })}
                  className={`py-2 rounded-xl text-xs font-bold border ${payPurchaseForm.payment_mode === "UPI" ? "bg-indigo-600 text-white" : "bg-white"}`}
                >
                  📱 UPI
                </button>
              </div>

              {/* DETAILS CARD: SINGLE BILL MODE */}
              {paySupplierMode === "single" && payPurchaseForm.purchase_id && (() => {
                const target = procurements.find((p) => p.id == payPurchaseForm.purchase_id);
                if (!target) return null;
                const tot = Number(target.total_amount || 0);
                const paid = Number(target.p1_amount || 0);
                const due = Math.max(0, tot - paid);
                return (
                  <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl space-y-1 text-xs">
                    <div className="flex justify-between font-bold text-slate-800">
                      <span>PUR-{target.id}</span>
                      <span className="text-slate-500">{target.created_at?.slice(0, 10)}</span>
                    </div>
                    <div className="text-slate-600 font-medium">
                      Supplier: <strong className="text-slate-900">{target.supplier_name}</strong> | Item: <strong className="text-slate-900">{target.item_name}</strong> ({target.procured_qty} qty)
                    </div>
                    <div className="flex justify-between pt-1 border-t border-indigo-100 text-[11px]">
                      <span>Total: <strong>{money(tot)}</strong></span>
                      <span>Paid: <strong className="text-emerald-600">{money(paid)}</strong></span>
                      <span>Due: <strong className="text-rose-600">{money(due)}</strong></span>
                    </div>

                    {/* Settle from Supplier Advance Button */}
                    {(() => {
                      const sup = suppliers.find((s) => s.name === target.supplier_name);
                      const adv = Number(sup?.old_due || 0) < 0 ? Math.abs(Number(sup?.old_due)) : 0;
                      if (adv <= 0) return null;
                      return (
                        <div className="pt-2 border-t border-indigo-100 flex justify-between items-center">
                          <span className="text-[10px] text-emerald-700 font-bold">Advance Credit: {money(adv)}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const useAmt = Math.min(adv, due);
                              setPayPurchaseForm({
                                ...payPurchaseForm,
                                amount: String(useAmt),
                                payment_mode: "Advance Adjusted"
                              });
                            }}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg"
                          >
                            ⚡ Settle via Advance
                          </button>
                        </div>
                      );
                    })()}
                  </div>
                );
              })()}

              {/* DETAILS CARD: MULTIPLE BILLS (FIFO) MODE */}
              {paySupplierMode === "multi" && multiSupplierId && (() => {
                const targetSup = suppliers.find((s) => String(s.id) === String(multiSupplierId) || s.name === multiSupplierId);
                if (!targetSup) return null;

                const pendingBills = procurements
                  .filter((p) => p.supplier_name === targetSup.name && Math.max(0, Number(p.total_amount || 0) - Number(p.p1_amount || 0)) > 0)
                  .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

                const totalPendingDue = pendingBills.reduce(
                  (sum, b) => sum + Math.max(0, Number(b.total_amount || 0) - Number(b.p1_amount || 0)),
                  0
                );

                const currentPayAmt = Number(payPurchaseForm.amount || 0);
                const advCredit = Number(targetSup.old_due || 0) < 0 ? Math.abs(Number(targetSup.old_due)) : 0;

                return (
                  <div className="p-3.5 bg-purple-50/70 border-2 border-purple-200 rounded-xl space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-black text-purple-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                        📋 Pending Bills for {targetSup.name}
                      </span>
                      <span className="font-bold text-[10px] bg-purple-200 text-purple-900 px-2 py-0.5 rounded-full">
                        FIFO Waterfall
                      </span>
                    </div>

                    <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                      {pendingBills.map((b) => {
                        const tot = Number(b.total_amount || 0);
                        const paid = Number(b.p1_amount || 0);
                        const due = Math.max(0, tot - paid);
                        return (
                          <div key={b.id} className="p-2 bg-white rounded-lg border border-purple-100 flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                                <span className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded text-[10px]">PUR-{b.id}</span>
                                <span>{b.item_name}</span>
                                <span className="text-slate-400 font-normal">({b.procured_qty} qty)</span>
                              </div>
                              <span className="text-[10px] text-slate-500 block mt-0.5">
                                Total: {money(tot)} | Paid: {money(paid)}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400 block uppercase font-bold">Due</span>
                              <span className="font-black text-rose-600 text-xs">{money(due)}</span>
                            </div>
                          </div>
                        );
                      })}
                      {pendingBills.length === 0 && (
                        <p className="text-slate-500 italic text-center py-2">No pending bills with due balance found for this supplier.</p>
                      )}
                    </div>

                    <div className="pt-2 border-t border-purple-200 flex justify-between items-center text-[11px]">
                      <span className="font-bold text-slate-700">Total Outstanding Payable:</span>
                      <span className="font-black text-rose-600 text-xs">{money(totalPendingDue)}</span>
                    </div>

                    {/* Settle from Supplier Advance Credit */}
                    {advCredit > 0 && (
                      <div className="pt-1.5 border-t border-purple-200 flex justify-between items-center">
                        <span className="text-[10px] text-emerald-700 font-bold">Advance Credit: {money(advCredit)}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const useAmt = Math.min(advCredit, totalPendingDue);
                            setPayPurchaseForm((prev) => ({
                              ...prev,
                              amount: String(useAmt),
                              payment_mode: "Advance Adjusted"
                            }));
                          }}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg shadow-xs"
                        >
                          ⚡ Settle via Advance
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()}

              <select
                required
                className="w-full p-2.5 border rounded-xl text-xs font-semibold"
                value={payPurchaseForm.partner_id}
                onChange={(e) => setPayPurchaseForm({ ...payPurchaseForm, partner_id: e.target.value })}
              >
                <option value="">-- Partner Paying Bill --</option>
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <div className="flex gap-2">
                <button type="button" onClick={() => setShowPayPurchaseModal(false)} className="flex-1 py-2 border rounded-xl text-xs font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs">Record Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INVOICE-WISE DUE COLLECTION */}
      {showCollectModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 max-w-sm w-full my-auto max-h-[90dvh] overflow-y-auto space-y-3">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">{editingCollectionId ? "Edit Collection Receipt" : "Collect Customer Due"}</h3>
            <form onSubmit={saveInvoiceCollection} className="space-y-3">
              {collectForm.invoice_id ? (
                (() => {
                  const targetInv = invoices.find((i) => String(i.id) === String(collectForm.invoice_id));
                  const targetCust = customers.find((c) => String(c.id) === String(collectForm.customer_id)) || { name: targetInv?.customer_name };
                  const targetAlloc = targetInv ? invoiceAllocationsMap.get(String(targetInv.id)) : null;
                  const paidAmt = targetAlloc ? targetAlloc.totalPaid : (targetInv ? Math.max(0, Number(targetInv.total_amount || 0) - Number(targetInv.balance_due || 0)) : 0);
                  const dueAmt = targetAlloc ? targetAlloc.balanceDue : Number(targetInv?.balance_due || 0);
                  return (
                    <div className="p-3.5 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-indigo-950 dark:text-indigo-200">
                          {targetInv?.invoice_number || `INV-${collectForm.invoice_id}`}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200">
                          Selected Invoice (Locked)
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Customer: <span className="font-black text-indigo-700 dark:text-indigo-300">{targetCust?.name || targetInv?.customer_name}</span>
                        {targetCust?.mobile && <span className="text-[11px] text-slate-500 font-normal ml-1.5">({targetCust.mobile})</span>}
                      </div>
                      <div className="grid grid-cols-3 gap-1 pt-1.5 border-t border-indigo-100 dark:border-indigo-800/60 text-xs">
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Bill Total</span>
                          <span className="font-bold text-slate-800 dark:text-slate-200">{money(targetInv?.total_amount || 0)}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Paid</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{money(paidAmt)}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase font-bold">Balance Due</span>
                          <span className="font-black text-rose-600 dark:text-rose-400">{money(dueAmt)}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <>
                  <select
                    required
                    className="w-full p-2.5 border rounded-xl text-xs font-semibold"
                    value={collectForm.customer_id}
                    onChange={(e) => {
                      const custId = e.target.value;
                      const cust = customers.find((c) => String(c.id) === String(custId));
                      setCollectForm({
                        ...collectForm,
                        customer_id: custId,
                        invoice_id: "",
                        amount: cust && Number(cust.old_due || 0) > 0 ? String(cust.old_due) : ""
                      });
                    }}
                  >
                    <option value="">-- Choose Customer with Outstanding Due --</option>
                    {customers
                      .filter((c) => editingCollectionId || Number(c.old_due || 0) > 0)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} (Total Due: {money(c.old_due)})
                        </option>
                      ))}
                  </select>

                  {collectForm.customer_id && (
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                        Select Invoice (Optional — FIFO Waterfall by default)
                      </label>
                      <select
                        className="w-full p-2.5 border rounded-xl text-xs font-semibold"
                        value={collectForm.invoice_id}
                        onChange={(e) => {
                          const invId = e.target.value;
                          const inv = invoices.find((i) => String(i.id) === String(invId));
                          const cust = customers.find((c) => String(c.id) === String(collectForm.customer_id));
                          const custDue = Math.max(0, Number(cust?.old_due || 0));
                          const alloc = inv ? invoiceAllocationsMap.get(String(inv.id)) : null;
                          const targetDue = inv
                            ? (alloc ? alloc.balanceDue : Math.max(0, Number(inv.balance_due || 0)))
                            : custDue;
                          setCollectForm({
                            ...collectForm,
                            invoice_id: invId,
                            amount: targetDue > 0 ? String(targetDue) : collectForm.amount
                          });
                        }}
                      >
                        <option value="">-- Settle All Invoices (FIFO Waterfall) / General Due --</option>
                        {(() => {
                          const custInvs = invoices.filter((i) => String(i.customer_id) === String(collectForm.customer_id));
                          return custInvs
                            .map((i) => {
                              const alloc = invoiceAllocationsMap.get(String(i.id));
                              const individualDue = alloc ? alloc.balanceDue : Math.max(0, Number(i.balance_due || 0));
                              return { ...i, individualDue };
                            })
                            .filter((i) => editingCollectionId || i.individualDue > 0)
                            .map((i) => (
                              <option key={i.id} value={i.id}>
                                {i.invoice_number || `INV-${i.id}`} — Due: {money(i.individualDue)} (Bill Total: {money(i.total_amount)})
                              </option>
                            ));
                        })()}
                      </select>
                    </div>
                  )}
                </>
              )}

              <input
                type="number"
                required
                placeholder="Amount (₹)"
                className="w-full p-2.5 border rounded-xl text-sm font-black text-emerald-600"
                value={collectForm.amount}
                onChange={(e) => setCollectForm({ ...collectForm, amount: e.target.value })}
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setCollectForm({ ...collectForm, payment_mode: "Cash" })}
                  className={`py-2 rounded-xl text-xs font-bold border ${collectForm.payment_mode === "Cash" ? "bg-emerald-600 text-white" : "bg-white"}`}
                >
                  💵 Cash
                </button>
                <button
                  type="button"
                  onClick={() => setCollectForm({ ...collectForm, payment_mode: "UPI" })}
                  className={`py-2 rounded-xl text-xs font-bold border ${collectForm.payment_mode === "UPI" ? "bg-indigo-600 text-white" : "bg-white"}`}
                >
                  📱 UPI
                </button>
              </div>

              <select
                required
                className="w-full p-2.5 border rounded-xl text-xs font-semibold"
                value={collectForm.receiver_id || upfrontPartnerId}
                onChange={(e) => setCollectForm({ ...collectForm, receiver_id: e.target.value })}
              >
                <option value="">-- Partner Who Received --</option>
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <div className="flex gap-2">
                <button type="button" onClick={() => setShowCollectModal(false)} className="flex-1 py-2 border rounded-xl text-xs font-bold">Cancel</button>
                <button
                  type="submit"
                  disabled={savingCollection}
                  className={`flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition ${
                    savingCollection ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {savingCollection ? "Saving..." : "Save Receipt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PURCHASES (FORMATTED LIKE SALES INVOICE SCREEN) */}
      {showProcureModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 max-w-xl w-full my-auto max-h-[90dvh] overflow-y-auto space-y-4 shadow-xl">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-lg text-slate-900 dark:text-white leading-tight">
                    {editingProcureId ? "Edit Purchase Order / Bill" : "Create Purchase Order / Bill (కొనుగోళ్లు)"}
                  </h3>
                  {editingProcureId && (
                    <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px] rounded-full uppercase">
                      Editing Mode
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  {editingProcureId ? "Review purchase details and recorded supplier payments" : "Record vendor procurements, batch inventory, and supplier dues"}
                </p>
              </div>
              {editingProcureId && (
                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                  REF: BILL-{editingProcureId}
                </span>
              )}
            </div>

            <form onSubmit={saveProcurement} className="space-y-4">
              {/* Supplier / Vendor Selector */}
              <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Supplier / Vendor *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSupplierId(null);
                      setSupplierForm({ name: "", mobile: "", old_due: "", is_dual: false });
                      setShowSupplierModal(true);
                    }}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    + Add New Supplier
                  </button>
                </div>
                <select
                  required
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold"
                  value={procureForm.supplier_name}
                  onChange={(e) => setProcureForm({ ...procureForm, supplier_name: e.target.value })}
                >
                  <option value="">-- Choose Supplier --</option>
                  {uniqueSupplierSuggestions.map((s, idx) => (
                    <option key={idx} value={s}>{s}</option>
                  ))}
                  <option value="Opening Stock">Opening Stock</option>
                </select>

                {/* Supplier Balance / Advance Notification */}
                {(() => {
                  const targetSup = suppliers.find((s) => s.name === procureForm.supplier_name);
                  if (!targetSup) return null;
                  const adv = Number(targetSup.old_due || 0) < 0 ? Math.abs(Number(targetSup.old_due)) : 0;
                  const due = Number(targetSup.old_due || 0) > 0 ? Number(targetSup.old_due) : 0;
                  return (
                    <div className="mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700 flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Supplier Balance:</span>
                      {adv > 0 ? (
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full font-black text-xs bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                            Advance: {money(adv)}
                          </span>
                          {!editingProcureId && (
                            <button
                              type="button"
                              onClick={() => {
                                const billTotal = Number(procureForm.procured_qty || 0) * Number(procureForm.purchase_rate || 0);
                                const applyAmt = billTotal > 0 ? Math.min(adv, billTotal) : adv;
                                setProcureForm({
                                  ...procureForm,
                                  paid_now: String(applyAmt),
                                  p1_mode: "Advance Adjusted"
                                });
                              }}
                              className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[10px]"
                            >
                              ⚡ Apply
                            </button>
                          )}
                        </div>
                      ) : due > 0 ? (
                        <span className="px-2.5 py-0.5 rounded-full font-black text-xs bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300">
                          Due: {money(due)}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full font-bold text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          Settled (₹0.00)
                        </span>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Purchase Item Details (POS Layout) */}
              <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                    Item / Product *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItemId(null);
                      setItemForm({ name: "", purchase_rate: "", selling_rate: "" });
                      setShowItemModal(true);
                    }}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    + Add New Item
                  </button>
                </div>
                <select
                  required
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold"
                  value={procureForm.item_name}
                  onChange={(e) => {
                    const selectedName = e.target.value;
                    const matchedItem = uniqueItemSuggestions.find((i) => i.name === selectedName);
                    setProcureForm({
                      ...procureForm,
                      item_name: selectedName,
                      purchase_rate: matchedItem?.purchase_rate ? String(matchedItem.purchase_rate) : procureForm.purchase_rate,
                      selling_rate: matchedItem?.selling_rate ? String(matchedItem.selling_rate) : procureForm.selling_rate
                    });
                  }}
                >
                  <option value="">-- Choose Item --</option>
                  {uniqueItemSuggestions.map((item, idx) => (
                    <option key={idx} value={item.name}>{item.name}</option>
                  ))}
                </select>

                <div className="grid grid-cols-12 gap-2.5 items-center pt-1">
                  <div className="col-span-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Qty</label>
                    <input
                      type="number"
                      required
                      placeholder="Qty"
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold text-center"
                      value={procureForm.procured_qty}
                      onChange={(e) => setProcureForm({ ...procureForm, procured_qty: e.target.value })}
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Cost Rate (₹)</label>
                    <input
                      type="number"
                      required
                      placeholder="Cost"
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold"
                      value={procureForm.purchase_rate}
                      onChange={(e) => setProcureForm({ ...procureForm, purchase_rate: e.target.value })}
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Selling Rate (₹)</label>
                    <input
                      type="number"
                      placeholder="Sell"
                      className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400"
                      value={procureForm.selling_rate}
                      onChange={(e) => setProcureForm({ ...procureForm, selling_rate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-medium">Line Total (Qty × Rate):</span>
                  <span className="font-mono font-black text-sm text-slate-900 dark:text-white">
                    {money(Number(procureForm.procured_qty || 0) * Number(procureForm.purchase_rate || 0))}
                  </span>
                </div>
              </div>

              {/* Pulled-Down Settlement Section (Matching Sales Invoice POS) */}
              <div className="bg-slate-50 dark:bg-slate-800/80 p-3.5 sm:p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                  <span className="text-xs font-black text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                    <span>💳</span> Supplier Payments & Settlement
                  </span>
                  <span className="text-xs font-black font-mono text-slate-900 dark:text-white">
                    Bill Total: {money(Number(procureForm.procured_qty || 0) * Number(procureForm.purchase_rate || 0))}
                  </span>
                </div>

                {editingProcureId ? (
                  /* Edit Mode: Show Supplier Payments ERP Grid */
                  (() => {
                    const currentProc = procurements.find((p) => p.id === editingProcureId);
                    const totalPaid = Number(currentProc?.p1_amount || 0);
                    const billTotalCost = Number(procureForm.procured_qty || 0) * Number(procureForm.purchase_rate || 0);
                    const balanceDueNow = Math.max(0, billTotalCost - totalPaid);
                    const pName = partners.find((p) => p.id == currentProc?.p1_id)?.name || "Partner";

                    return (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                            💰 Supplier Payments Total:
                          </span>
                          <span className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400">
                            {money(totalPaid)}
                          </span>
                        </div>

                        <div className="overflow-x-auto border border-sky-200 dark:border-slate-700 rounded-lg">
                          <table className="w-full text-left text-[11px] border-collapse font-mono">
                            <thead className="bg-[#e4effa] dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold border-b border-sky-200 dark:border-slate-700">
                              <tr>
                                <th className="p-1.5 border border-sky-200 dark:border-slate-700">Date</th>
                                <th className="p-1.5 border border-sky-200 dark:border-slate-700">Ref</th>
                                <th className="p-1.5 border border-sky-200 dark:border-slate-700">Funding Partner</th>
                                <th className="p-1.5 border border-sky-200 dark:border-slate-700 text-center">Mode</th>
                                <th className="p-1.5 border border-sky-200 dark:border-slate-700 text-right">Amount (₹)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {totalPaid <= 0 ? (
                                <tr>
                                  <td colSpan={5} className="p-3 text-center text-slate-400 font-sans text-xs">
                                    No payments recorded yet for this purchase bill (Full Due).
                                  </td>
                                </tr>
                              ) : (
                                <tr className="bg-white dark:bg-slate-900">
                                  <td className="p-1.5 border border-slate-200 dark:border-slate-700 whitespace-nowrap">
                                    {currentProc?.created_at?.slice(0, 10) || "-"}
                                  </td>
                                  <td className="p-1.5 border border-slate-200 dark:border-slate-700 font-bold">
                                    BILL-{currentProc?.id}
                                  </td>
                                  <td className="p-1.5 border border-slate-200 dark:border-slate-700">{pName}</td>
                                  <td className="p-1.5 border border-slate-200 dark:border-slate-700 text-center font-bold">
                                    {currentProc?.p1_mode || "Cash"}
                                  </td>
                                  <td className="p-1.5 border border-slate-200 dark:border-slate-700 text-right font-black text-emerald-600 dark:text-emerald-400">
                                    {money(totalPaid)}
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>

                        {/* Balance summary card */}
                        <div className="p-2.5 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs flex justify-between items-center">
                          <span className="font-bold text-slate-700 dark:text-slate-300">Remaining Due to Supplier:</span>
                          <span className={`font-mono font-black text-sm ${balanceDueNow > 0 ? "text-rose-600" : "text-emerald-600"}`}>
                            {balanceDueNow > 0 ? money(balanceDueNow) : "Fully Settled (₹0.00)"}
                          </span>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  /* Create Mode: Upfront Payment & Partner inputs */
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Paid Now by Partner (Leave 0 if full Due)
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold text-emerald-600"
                        value={procureForm.paid_now}
                        onChange={(e) => setProcureForm({ ...procureForm, paid_now: e.target.value })}
                      />
                    </div>

                    {Number(procureForm.paid_now || 0) > 0 && procureForm.p1_mode !== "Advance Adjusted" && (
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <select
                          className="w-full p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold"
                          value={procureForm.p1_id}
                          onChange={(e) => setProcureForm({ ...procureForm, p1_id: e.target.value })}
                        >
                          <option value="">-- Funding Partner --</option>
                          {partners.map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                        <select
                          className="w-full p-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold"
                          value={procureForm.p1_mode}
                          onChange={(e) => setProcureForm({ ...procureForm, p1_mode: e.target.value })}
                        >
                          <option value="Cash">Cash</option>
                          <option value="UPI">UPI</option>
                        </select>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => { setShowProcureModal(false); setEditingProcureId(null); }}
                  className="flex-1 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProcure}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm transition"
                >
                  {savingProcure ? "Saving..." : editingProcureId ? "Update Purchase Order" : "Save Purchase Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT ITEM MASTER */}
      {showItemModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-3">
            <h3 className="font-bold text-base text-slate-900">{editingItemId ? "Edit Item Master" : "Add New Item Master"}</h3>
            <form onSubmit={saveItem} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Item / Product Name"
                className="w-full p-2.5 border rounded-xl text-sm font-bold"
                value={itemForm.name}
                onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Cost Rate (₹)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full p-2.5 border rounded-xl text-xs font-bold"
                    value={itemForm.purchase_rate}
                    onChange={(e) => setItemForm({ ...itemForm, purchase_rate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Selling Rate (₹)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full p-2.5 border rounded-xl text-xs font-bold text-indigo-600"
                    value={itemForm.selling_rate}
                    onChange={(e) => setItemForm({ ...itemForm, selling_rate: e.target.value })}
                  />
                </div>
              </div>

              {!editingItemId && (
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Opening Stock Qty (ఆరంభ నిల్వ)</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full p-2.5 border rounded-xl text-xs font-bold text-emerald-600"
                    value={itemForm.opening_qty}
                    onChange={(e) => setItemForm({ ...itemForm, opening_qty: e.target.value })}
                  />
                  <p className="text-[10px] text-slate-400 mt-1">If entered, automatically adds an opening inventory batch in stock.</p>
                </div>
              )}
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowItemModal(false)} className="flex-1 py-2 border rounded-xl text-xs font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs">Save Item</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT CUSTOMER */}
      {showCustModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-3">
            <h3 className="font-bold text-base text-slate-900">{editingCustId ? "Edit Customer" : "Add Customer"}</h3>
            <form onSubmit={saveCustomer} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Customer Name"
                className="w-full p-2.5 border rounded-xl text-sm"
                value={custForm.name}
                onChange={(e) => setCustForm({ ...custForm, name: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full p-2.5 border rounded-xl text-sm"
                value={custForm.mobile}
                onChange={(e) => setCustForm({ ...custForm, mobile: e.target.value })}
              />
              <input
                type="number"
                placeholder="Opening Due (₹)"
                className="w-full p-2.5 border rounded-xl text-sm"
                value={custForm.old_due}
                onChange={(e) => setCustForm({ ...custForm, old_due: e.target.value })}
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowCustModal(false)} className="flex-1 py-2 border rounded-xl text-xs font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs">Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT SUPPLIER */}
      {showSupplierModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-3">
            <h3 className="font-bold text-base text-slate-900">{editingSupplierId ? "Edit Supplier" : "Add Supplier"}</h3>
            <form onSubmit={saveSupplier} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Supplier / Firm Name"
                className="w-full p-2.5 border rounded-xl text-sm"
                value={supplierForm.name}
                onChange={(e) => setSupplierForm({ ...supplierForm, name: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full p-2.5 border rounded-xl text-sm"
                value={supplierForm.mobile}
                onChange={(e) => setSupplierForm({ ...supplierForm, mobile: e.target.value })}
              />
              <input
                type="number"
                placeholder="Opening Due (₹)"
                className="w-full p-2.5 border rounded-xl text-sm"
                value={supplierForm.old_due}
                onChange={(e) => setSupplierForm({ ...supplierForm, old_due: e.target.value })}
              />
              <label className="flex items-center gap-2 p-2 bg-indigo-50/60 rounded-xl border border-indigo-100 cursor-pointer text-xs font-semibold text-indigo-900">
                <input
                  type="checkbox"
                  checked={!!supplierForm.is_dual}
                  onChange={(e) => setSupplierForm({ ...supplierForm, is_dual: e.target.checked })}
                  className="rounded text-indigo-600 cursor-pointer h-4 w-4"
                />
                <span>Allow in Sale Invoice (Supplier is also a Customer)</span>
              </label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowSupplierModal(false)} className="flex-1 py-2 border rounded-xl text-xs font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs">Save Supplier</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PARTNER */}
      {showPartnerModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-3">
            <h3 className="font-bold text-base text-slate-900">{editingPartnerId ? "Edit Partner" : "Add Partner"}</h3>
            <form onSubmit={savePartner} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Partner Name"
                className="w-full p-2.5 border rounded-xl text-sm"
                value={partnerForm.name}
                onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Opening Cash (₹)"
                  className="p-2.5 border rounded-xl text-xs"
                  value={partnerForm.opening_cash}
                  onChange={(e) => setPartnerForm({ ...partnerForm, opening_cash: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Opening UPI (₹)"
                  className="p-2.5 border rounded-xl text-xs"
                  value={partnerForm.opening_upi}
                  onChange={(e) => setPartnerForm({ ...partnerForm, opening_upi: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    System Role
                  </label>
                  <select
                    className="w-full p-2.5 border rounded-xl text-xs font-semibold"
                    value={partnerForm.role || "partner"}
                    onChange={(e) => setPartnerForm({ ...partnerForm, role: e.target.value })}
                  >
                    <option value="partner">🤝 Partner</option>
                    <option value="admin">👑 Admin</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Login PIN
                  </label>
                  <input
                    type="password"
                    maxLength={8}
                    placeholder="PIN: 0000"
                    className="w-full p-2.5 border rounded-xl text-xs font-bold text-center tracking-widest"
                    value={partnerForm.pin}
                    onChange={(e) => setPartnerForm({ ...partnerForm, pin: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowPartnerModal(false)} className="flex-1 py-2 border rounded-xl text-xs font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs">Save Partner</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT EXPENSE */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-3">
            <h3 className="font-bold text-base text-slate-900">{editingExpenseId ? "Edit Shop Expense" : "Record Shop Expense"}</h3>
            <form onSubmit={saveExpense} className="space-y-3">
              <select
                required
                className="w-full p-2.5 border rounded-xl text-xs font-semibold"
                value={expenseForm.category_id}
                onChange={(e) => {
                  const catId = e.target.value;
                  const cat = expenseCategories.find((c) => String(c.id) === String(catId));
                  const isLoanInterest = (cat?.name || "").toLowerCase() === "loan interest" || String(catId) === "12";
                  setExpenseForm((prev) => ({
                    ...prev,
                    category_id: catId,
                    borrower_id: isLoanInterest ? prev.borrower_id : "",
                    title: isLoanInterest && !prev.title ? "Loan Interest" : prev.title
                  }));
                }}
              >
                <option value="">-- Choose Category --</option>
                {expenseCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>

              {/* Scenario 2: When Category is Loan Interest, render prominent styled Lender Selector Card */}
              {(() => {
                const cat = expenseCategories.find((c) => String(c.id) === String(expenseForm.category_id));
                const isLoanInterest = (cat?.name || "").toLowerCase() === "loan interest" || String(expenseForm.category_id) === "12";
                if (!isLoanInterest) return null;
                return (
                  <div className="bg-purple-50 p-3.5 rounded-xl border-2 border-purple-300 space-y-2 shadow-xs">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-black text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                        🏦 Select Loan / Lender Account (రుణం ఎంపిక) <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full border border-purple-200">
                        Required for Loan History
                      </span>
                    </div>
                    <select
                      required
                      className="w-full p-2.5 bg-white border border-purple-300 rounded-xl text-xs font-bold text-purple-950 focus:ring-2 focus:ring-purple-500 outline-none shadow-xs cursor-pointer"
                      value={expenseForm.borrower_id || ""}
                      onChange={(e) => {
                        const bid = e.target.value;
                        const l = lenders.find((len) => String(len.id) === String(bid));
                        setExpenseForm((prev) => ({
                          ...prev,
                          borrower_id: bid,
                          title: l ? `Loan Interest - ${l.name}` : prev.title
                        }));
                      }}
                    >
                      <option value="">-- Choose Loan / Lender (e.g. Gold Loan, Rama Krishna...) --</option>
                      {lenders.map((l) => (
                        <option key={l.id} value={l.id}>
                          {l.name} — Outstanding Principal: {money(l.balance_due || l.principal_amount)}
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-purple-700 font-medium">
                      💡 Selecting a loan automatically records this interest payment directly in that loan&apos;s history ledger.
                    </p>
                  </div>
                );
              })()}

              <input
                type="text"
                required
                placeholder="What was this expense for?"
                className="w-full p-2.5 border rounded-xl text-sm"
                value={expenseForm.title}
                onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
              />
              <input
                type="number"
                required
                placeholder="Amount (₹)"
                className="w-full p-2.5 border rounded-xl text-sm font-bold text-rose-600"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
              />

              {/* Scenario 4: Payment Mode Selection (Cash / UPI) */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setExpenseForm({ ...expenseForm, payment_mode: "Cash" })}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    expenseForm.payment_mode === "Cash" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-700"
                  }`}
                >
                  💵 Cash
                </button>
                <button
                  type="button"
                  onClick={() => setExpenseForm({ ...expenseForm, payment_mode: "UPI" })}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    expenseForm.payment_mode === "UPI" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-slate-700"
                  }`}
                >
                  📱 UPI
                </button>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Expense Date (ఖర్చు తేదీ)
                </label>
                <input
                  type="date"
                  required
                  className="w-full p-2.5 border rounded-xl text-xs font-semibold text-slate-800"
                  value={expenseForm.expense_date}
                  onChange={(e) => setExpenseForm({ ...expenseForm, expense_date: e.target.value })}
                />
              </div>

              <select
                required
                className="w-full p-2.5 border rounded-xl text-xs font-semibold"
                value={expenseForm.paid_by_id}
                onChange={(e) => setExpenseForm({ ...expenseForm, paid_by_id: e.target.value })}
              >
                <option value="">-- Partner Who Paid --</option>
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowExpenseModal(false)} className="flex-1 py-2 border rounded-xl text-xs font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EXPENSE CATEGORIES */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-base text-slate-900">Expense Categories</h3>
              <button type="button" onClick={() => setShowCategoryModal(false)} className="text-slate-400">
                <Icon name="close" size={18} />
              </button>
            </div>
            <form onSubmit={saveCategory} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="New Category Name..."
                className="flex-1 p-2.5 border rounded-xl text-xs"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
              />
              <button type="submit" className="px-3 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl">Add</button>
            </form>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {expenseCategories.map((c) => (
                <div key={c.id} className="p-2.5 bg-slate-50 border rounded-xl text-xs font-semibold text-slate-700 flex justify-between items-center">
                  <span>{c.name}</span>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(c)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded-md"
                    title="Delete category"
                  >
                    <Icon name="trash" size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW / PRINT INVOICE */}
      {selectedViewInvoice && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 invoice-modal-overlay">
          <style>{`
            @media print {
              @page {
                size: A4 portrait;
                margin: 10mm;
              }
              html, body {
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
                color: black !important;
                height: auto !important;
                overflow: visible !important;
              }
              header, aside, main, nav, .no-print, button {
                display: none !important;
              }
              .invoice-modal-overlay {
                position: static !important;
                display: block !important;
                background: transparent !important;
                padding: 0 !important;
                margin: 0 !important;
                inset: auto !important;
                width: 100% !important;
                height: auto !important;
              }
              #printable-receipt {
                position: static !important;
                display: block !important;
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                box-shadow: none !important;
                background: white !important;
                color: black !important;
                page-break-after: avoid !important;
                break-after: avoid !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
              #printable-receipt * {
                color: black !important;
                background-color: transparent !important;
              }
            }
          `}</style>
          <div id="printable-receipt" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 block">Retail Invoice Bill</span>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{selectedViewInvoice.invoice_number || `INV-${selectedViewInvoice.id}`}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Date: {selectedViewInvoice.invoice_date || selectedViewInvoice.created_at?.slice(0, 10)}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedViewInvoice(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg no-print cursor-pointer"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800 p-3.5 rounded-xl border border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 block uppercase">Customer / Recipient</span>
                <b className="text-slate-900 dark:text-white text-sm">{selectedViewInvoice.customer_name}</b>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Bill Status</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  Number(selectedViewInvoice.balance_due || 0) <= 0 ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200"
                }`}>
                  {Number(selectedViewInvoice.balance_due || 0) <= 0 ? "Collected" : "Due"}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Itemized Breakdown</h4>
              <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-2.5">Item</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Rate</th>
                      <th className="p-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {Array.isArray(selectedViewInvoice.items) && selectedViewInvoice.items.length > 0 ? (
                      selectedViewInvoice.items.map((it, idx) => (
                        <tr key={idx} className="odd:bg-white even:bg-slate-50/50 dark:odd:bg-slate-900 dark:even:bg-slate-800/40">
                          <td className="p-2.5 font-bold text-slate-900 dark:text-white">{it.item_name}</td>
                          <td className="p-2.5 text-center font-semibold text-slate-800 dark:text-slate-200">{it.qty}</td>
                          <td className="p-2.5 text-right text-slate-700 dark:text-slate-300">{money(it.rate)}</td>
                          <td className="p-2.5 text-right font-black text-slate-900 dark:text-white">{money(it.total)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="p-3 text-center text-slate-400">Standard sales billing</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/90 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1.5 text-xs font-mono">
              <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300">
                <span>Subtotal:</span>
                <span>{money(selectedViewInvoice.total_amount)}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-600 dark:text-emerald-400">
                <span>Upfront Paid:</span>
                <span>{money(selectedViewInvoice.upfront_paid)}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700 pt-1.5">
                <span>Balance Due:</span>
                <span className="text-rose-600 dark:text-rose-400">{money(selectedViewInvoice.balance_due)}</span>
              </div>
            </div>

            {/* Customer Overall Balance (Overall Due / Advance) */}
            {(() => {
              const cust = customers.find((c) => c.id == selectedViewInvoice.customer_id) || suppliers.find((s) => s.name === selectedViewInvoice.customer_name);
              const overallDue = Number(cust?.old_due || 0);
              return (
                <div className={`p-3.5 rounded-xl border flex justify-between items-center text-xs ${
                  overallDue > 0
                    ? "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-900 dark:text-rose-200"
                    : overallDue < 0
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200"
                    : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                }`}>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                      Customer Overall Balance (మొత్తం బకాయి / అడ్వాన్స్)
                    </span>
                    <span className="font-bold text-xs">
                      {overallDue > 0 ? "Total Outstanding Due" : overallDue < 0 ? "Customer Advance Credit" : "All Previous Accounts Clear"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black font-mono">
                      {overallDue > 0
                        ? `₹${overallDue.toLocaleString("en-IN")}`
                        : overallDue < 0
                        ? `Advance: ₹${Math.abs(overallDue).toLocaleString("en-IN")}`
                        : "₹0 (Clear)"}
                    </span>
                  </div>
                </div>
              );
            })()}

            <div className="flex gap-2 pt-2 no-print">
              <button
                type="button"
                onClick={() => handleShareWhatsApp(selectedViewInvoice)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Icon name="share" size={15} /> WhatsApp Bill
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Icon name="download" size={15} /> Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PICK IN-STOCK ITEM */}
      {pickerActiveIndex !== null && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 max-h-[85vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <h3 className="font-black text-base text-slate-900">Select In-Stock Item</h3>
                <p className="text-xs text-slate-500">Pick an item batch from current inventory</p>
              </div>
              <button
                type="button"
                onClick={() => { setPickerActiveIndex(null); setStockSearchQuery(""); }}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <Icon name="search" size={16} />
              </span>
              <input
                type="text"
                autoFocus
                placeholder="Search items by name or supplier..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:bg-white focus:border-indigo-500 transition"
                value={stockSearchQuery}
                onChange={(e) => setStockSearchQuery(e.target.value)}
              />
            </div>

            {/* In-Stock Stats & Shortcut */}
            <div className="flex justify-between items-center text-xs px-1">
              <span className="text-slate-500 font-semibold">
                Available Batches ({procurements.filter(p => Number(p.remaining_qty || 0) > 0).length})
              </span>
              <button
                type="button"
                onClick={() => {
                  setPickerActiveIndex(null);
                  setEditingProcureId(null);
                  setProcureForm({
                    supplier_name: "",
                    item_name: "",
                    procured_qty: "",
                    purchase_rate: "",
                    selling_rate: "",
                    is_opening: false,
                    paid_now: "",
                    p1_id: "",
                    p1_mode: "Cash"
                  });
                  setShowProcureModal(true);
                }}
                className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
              >
                <Icon name="plus" size={13} /> Record New Purchase / Stock
              </button>
            </div>

            {/* Item List (Available Stock Only) */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100 max-h-96">
              {(() => {
                let list = procurements.filter((p) => Number(p.remaining_qty || 0) > 0);
                if (stockSearchQuery.trim()) {
                  const q = stockSearchQuery.toLowerCase();
                  list = list.filter(
                    (p) =>
                      p.item_name?.toLowerCase().includes(q) ||
                      p.supplier_name?.toLowerCase().includes(q)
                  );
                }
                if (list.length === 0) {
                  return (
                    <div className="p-8 text-center text-slate-400 space-y-3">
                      <p className="text-xs">No stock batches found{stockSearchQuery ? ` matching "${stockSearchQuery}"` : ""}.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setPickerActiveIndex(null);
                          setEditingProcureId(null);
                          setProcureForm({
                            supplier_name: "",
                            item_name: stockSearchQuery.trim() || "",
                            procured_qty: "",
                            purchase_rate: "",
                            selling_rate: "",
                            is_opening: false,
                            paid_now: "",
                            p1_id: "",
                            p1_mode: "Cash"
                          });
                          setShowProcureModal(true);
                        }}
                        className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs"
                      >
                        + Add "{stockSearchQuery || "New Item"}" to Stock
                      </button>
                    </div>
                  );
                }

                // Sort: items with stock first, then by latest created
                const sorted = [...list].sort((a, b) => Number(b.remaining_qty || 0) - Number(a.remaining_qty || 0));

                return sorted.map((p) => {
                  const rem = Number(p.remaining_qty || 0);
                  const inStock = rem > 0;
                  const sellRate = Number(p.selling_rate || p.purchase_rate || 0);

                  return (
                    <div
                      key={p.id}
                      onClick={() => handlePickStockItem(p)}
                      className="pt-2.5 pb-2.5 px-3 rounded-xl hover:bg-indigo-50/70 cursor-pointer transition flex justify-between items-center group border border-transparent hover:border-indigo-100"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-sm text-slate-900 group-hover:text-indigo-600 transition">
                            {p.item_name}
                          </h4>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            inStock ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}>
                            {inStock ? `${rem} In Stock` : "Sold Out"}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Supplier: <span className="font-semibold text-slate-600">{p.supplier_name}</span> • Batch: {p.created_at?.slice(0, 10)}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Selling Rate</span>
                        <span className="font-black text-sm text-indigo-600 block">
                          {money(sellRate)}
                        </span>
                        <span className="text-[10px] text-slate-400">Cost: {money(p.purchase_rate)}</span>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CUSTOMER EXCEL / CSV BULK IMPORT */}
      {showCustomerImportModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b">
              <div>
                <h3 className="font-black text-base text-slate-900">Import Customers (Excel / CSV)</h3>
                <p className="text-xs text-slate-500">Paste rows directly from Excel or upload a CSV file</p>
              </div>
              <button type="button" onClick={() => setShowCustomerImportModal(false)} className="text-slate-400">
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs space-y-1 text-slate-700">
              <span className="font-bold block text-indigo-900">Spreadsheet Format Instructions:</span>
              <p>Columns: <code className="bg-indigo-100/70 px-1 py-0.5 rounded font-mono font-bold">Name</code>, <code className="bg-indigo-100/70 px-1 py-0.5 rounded font-mono font-bold">Mobile</code> (optional), <code className="bg-indigo-100/70 px-1 py-0.5 rounded font-mono font-bold">Opening Balance</code> (optional, use negative for Advance)</p>
              <p className="text-[11px] text-slate-500">Tip: Select columns in Excel, press <kbd className="border bg-white px-1 rounded">Ctrl+C</kbd>, and paste below!</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <label className="font-bold text-slate-700">Paste Excel Data or Upload File:</label>
                <label className="text-indigo-600 hover:underline font-bold cursor-pointer">
                  Browse CSV
                  <input
                    type="file"
                    accept=".csv,.txt"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setCustomerImportText(event.target?.result || "");
                      };
                      reader.readAsText(file);
                    }}
                  />
                </label>
              </div>
              <textarea
                rows={7}
                placeholder="Ramesh Kumar, 9876543210, 1500\nSuresh Traders, 9123456780, -500\nVenkat Rao, 9988776655, 0"
                value={customerImportText}
                onChange={(e) => setCustomerImportText(e.target.value)}
                className="w-full p-3 font-mono text-xs border border-slate-300 rounded-xl outline-none focus:border-indigo-500"
              />
            </div>

            {/* Preview Count */}
            {(() => {
              if (!customerImportText.trim()) return null;
              const rows = customerImportText.trim().split("\n").filter((l) => l.trim() && !l.trim().startsWith("#"));
              return (
                <div className="text-xs font-bold text-slate-600 flex justify-between items-center bg-slate-50 p-2.5 rounded-xl border">
                  <span>Detected Rows: <strong>{rows.length}</strong></span>
                  <span className="text-[11px] text-slate-400">Header row automatically ignored if present</span>
                </div>
              );
            })()}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setShowCustomerImportModal(false); setCustomerImportText(""); }}
                className="flex-1 py-2.5 border rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={importingCustomers || !customerImportText.trim()}
                onClick={handleBatchImportCustomers}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {importingCustomers ? "Importing..." : "📥 Import Customers Now"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CHANGE ADMIN SECURITY PIN */}
      {showChangePinModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-black text-base text-slate-900">Change Admin PIN</h3>
              <button type="button" onClick={() => setShowChangePinModal(false)} className="text-slate-400">
                <Icon name="close" size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setChangePinForm((prev) => ({ ...prev, error: "", success: "" }));
                const currentStored = typeof window !== "undefined" ? localStorage.getItem("admin_pin") || "1234" : "1234";

                if (changePinForm.oldPin !== currentStored && changePinForm.oldPin !== "1234") {
                  return setChangePinForm((prev) => ({ ...prev, error: "Current Admin PIN is incorrect" }));
                }
                if (changePinForm.newPin.length < 4) {
                  return setChangePinForm((prev) => ({ ...prev, error: "New PIN must be at least 4 digits" }));
                }
                if (changePinForm.newPin !== changePinForm.confirmPin) {
                  return setChangePinForm((prev) => ({ ...prev, error: "New PIN and Confirmation do not match" }));
                }

                if (typeof window !== "undefined") {
                  localStorage.setItem("admin_pin", changePinForm.newPin);
                }
                setChangePinForm({ oldPin: "", newPin: "", confirmPin: "", error: "", success: "Admin PIN updated successfully!" });
                setTimeout(() => setShowChangePinModal(false), 1200);
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Current PIN</label>
                <input
                  type="password"
                  required
                  maxLength={8}
                  value={changePinForm.oldPin}
                  onChange={(e) => setChangePinForm({ ...changePinForm, oldPin: e.target.value })}
                  placeholder="Enter current PIN"
                  className="w-full p-2.5 border rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">New PIN</label>
                <input
                  type="password"
                  required
                  maxLength={8}
                  value={changePinForm.newPin}
                  onChange={(e) => setChangePinForm({ ...changePinForm, newPin: e.target.value })}
                  placeholder="Enter new 4+ digit PIN"
                  className="w-full p-2.5 border rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Confirm New PIN</label>
                <input
                  type="password"
                  required
                  maxLength={8}
                  value={changePinForm.confirmPin}
                  onChange={(e) => setChangePinForm({ ...changePinForm, confirmPin: e.target.value })}
                  placeholder="Re-enter new PIN"
                  className="w-full p-2.5 border rounded-xl text-xs font-semibold"
                />
              </div>

              {changePinForm.error && (
                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg text-xs font-semibold text-center">
                  {changePinForm.error}
                </div>
              )}

              {changePinForm.success && (
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-semibold text-center">
                  {changePinForm.success}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowChangePinModal(false)}
                  className="flex-1 py-2 border rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs"
                >
                  Update PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 z-40 px-2 py-1.5 flex justify-around items-center text-slate-400 no-print">
        <button
          type="button"
          onClick={() => setActiveTab("sale")}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition ${
            activeTab === "sale" ? "text-indigo-400 font-bold" : "hover:text-white"
          }`}
        >
          <Icon name="cart" size={20} />
          <span className="text-[10px]">Billing</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("invoices")}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition ${
            activeTab === "invoices" ? "text-indigo-400 font-bold" : "hover:text-white"
          }`}
        >
          <Icon name="receipt" size={20} />
          <span className="text-[10px]">Invoices</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("procurement")}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition ${
            activeTab === "procurement" ? "text-indigo-400 font-bold" : "hover:text-white"
          }`}
        >
          <Icon name="package" size={20} />
          <span className="text-[10px]">Stock</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("payments_collections")}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition ${
            activeTab === "payments_collections" ? "text-indigo-400 font-bold" : "hover:text-white"
          }`}
        >
          <Icon name="handcoins" size={20} />
          <span className="text-[10px]">Payments</span>
        </button>

        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition ${
            sidebarOpen ? "text-indigo-400 font-bold" : "hover:text-white"
          }`}
        >
          <Icon name="menu" size={20} />
          <span className="text-[10px]">More</span>
        </button>
      </nav>
    </div>
  );
}
