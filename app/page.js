"use client";

import { useEffect, useMemo, useState } from "react";
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

export default function App() {
  const [activeTab, setActiveTab] = useState("sale");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mastersSubTab, setMastersSubTab] = useState("customers");

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
  const [pickerActiveIndex, setPickerActiveIndex] = useState(null);
  const [stockSearchQuery, setStockSearchQuery] = useState("");
  const [selectedAuditTx, setSelectedAuditTx] = useState(null);
  const [auditFilterType, setAuditFilterType] = useState("all");
  const [auditSearchQuery, setAuditSearchQuery] = useState("");
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState("");
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState("all");
  const [procureSearchQuery, setProcureSearchQuery] = useState("");
  const [procureStockFilter, setProcureStockFilter] = useState("all");
  const [paymentsSubTab, setPaymentsSubTab] = useState("collections");
  const [paymentsSearchQuery, setPaymentsSearchQuery] = useState("");
  const [selectedViewInvoice, setSelectedViewInvoice] = useState(null);

  // Forms
  const [editingCustId, setEditingCustId] = useState(null);
  const [custForm, setCustForm] = useState({ name: "", mobile: "", old_due: "" });

  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const [supplierForm, setSupplierForm] = useState({ name: "", mobile: "", old_due: "" });

  const [editingItemId, setEditingItemId] = useState(null);
  const [itemForm, setItemForm] = useState({ name: "", purchase_rate: "", selling_rate: "" });

  const [editingPartnerId, setEditingPartnerId] = useState(null);
  const [partnerForm, setPartnerForm] = useState({ name: "", opening_cash: "", opening_upi: "" });

  const [editingLenderId, setEditingLenderId] = useState(null);
  const [lenderForm, setLenderForm] = useState({ name: "", mobile: "", initial_loan: "" });

  const [loanPaymentForm, setLoanPaymentForm] = useState({
    borrower_id: "",
    amount: "",
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
    notes: ""
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
        db.from("items").select("*").order("name", { ascending: true })
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
      if (sup.data) setSuppliers(sup.data);
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
      const trimmed = (i.name || "").trim();
      if (trimmed && !map.has(trimmed.toLowerCase())) {
        map.set(trimmed.toLowerCase(), {
          id: i.id,
          name: trimmed,
          purchase_rate: i.purchase_rate,
          selling_rate: i.selling_rate
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
        .filter((i) => i.upfront_receiver_id == pid && i.upfront_mode === "Cash")
        .reduce((s, i) => s + Number(i.upfront_paid || 0), 0);
      const saleUpi = invoices
        .filter((i) => i.upfront_receiver_id == pid && i.upfront_mode === "UPI")
        .reduce((s, i) => s + Number(i.upfront_paid || 0), 0);

      const colCash = collections
        .filter((c) => c.receiver_id == pid && c.payment_mode === "Cash")
        .reduce((s, c) => s + Number(c.amount || 0), 0);
      const colUpi = collections
        .filter((c) => c.receiver_id == pid && c.payment_mode === "UPI")
        .reduce((s, c) => s + Number(c.amount || 0), 0);

      const procCash = procurements.reduce((s, p) => {
        let amt = 0;
        if (p.p1_id == pid && p.p1_mode === "Cash") amt += Number(p.p1_amount || 0);
        return s + amt;
      }, 0);
      const procUpi = procurements.reduce((s, p) => {
        let amt = 0;
        if (p.p1_id == pid && p.p1_mode === "UPI") amt += Number(p.p1_amount || 0);
        return s + amt;
      }, 0);

      const expCash = expenses
        .filter((e) => e.paid_by_id == pid && e.payment_mode === "Cash")
        .reduce((s, e) => s + Number(e.amount || 0), 0);
      const expUpi = expenses
        .filter((e) => e.paid_by_id == pid && e.payment_mode === "UPI")
        .reduce((s, e) => s + Number(e.amount || 0), 0);

      const loanPaidCash = loanTransactions
        .filter((tx) => tx.partner_id == pid && tx.tx_type === "Repayment" && tx.payment_mode === "Cash")
        .reduce((s, tx) => s + Number(tx.amount || 0), 0);
      const loanPaidUpi = loanTransactions
        .filter((tx) => tx.partner_id == pid && tx.tx_type === "Repayment" && tx.payment_mode === "UPI")
        .reduce((s, tx) => s + Number(tx.amount || 0), 0);

      const loanTakenCash = loanTransactions
        .filter((tx) => tx.partner_id == pid && tx.tx_type === "LoanTaken" && tx.payment_mode === "Cash")
        .reduce((s, tx) => s + Number(tx.amount || 0), 0);
      const loanTakenUpi = loanTransactions
        .filter((tx) => tx.partner_id == pid && tx.tx_type === "LoanTaken" && tx.payment_mode === "UPI")
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

  // Overall Business Statement Summary
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

    const bReddyNetProfit = totalCustomerDues + stockValuation - (totalLoansPayable + totalPurchaseDues + totalExpenses);
    const totalCash = partnerAccounts.reduce((s, p) => s + p.netCash, 0);
    const totalUpi = partnerAccounts.reduce((s, p) => s + p.netUpi, 0);

    return { totalSales, totalCustomerDues, totalLoansPayable, totalPurchaseDues, stockValuation, totalExpenses, bReddyNetProfit, totalCash, totalUpi };
  }, [invoices, customers, lenders, procurements, expenses, partnerAccounts]);

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

    let combined = [...invList, ...procList].sort((a, b) => new Date(b.date || b.rawTimestamp) - new Date(a.date || a.rawTimestamp));

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
  }, [invoices, procurements, auditFilterType, auditSearchQuery]);

  const filteredInvoices = useMemo(() => {
    let list = invoices;
    if (invoiceStatusFilter !== "all") {
      list = list.filter((i) => {
        const bal = Number(i.balance_due || 0);
        const up = Number(i.upfront_paid || 0);
        const s = i.status || (bal <= 0 ? "Collected" : up > 0 ? "Partial" : "Due");
        return s.toLowerCase() === invoiceStatusFilter.toLowerCase();
      });
    }
    if (invoiceSearchQuery.trim()) {
      const q = invoiceSearchQuery.toLowerCase();
      list = list.filter((i) =>
        (i.invoice_number || `INV-${i.id}`)?.toLowerCase().includes(q) ||
        i.customer_name?.toLowerCase().includes(q) ||
        i.invoice_date?.includes(q)
      );
    }
    return list;
  }, [invoices, invoiceStatusFilter, invoiceSearchQuery]);

  const filteredProcurements = useMemo(() => {
    let list = procurements;
    if (procureStockFilter === "in_stock") {
      list = list.filter((p) => Number(p.remaining_qty || 0) > 0);
    } else if (procureStockFilter === "out_of_stock") {
      list = list.filter((p) => Number(p.remaining_qty || 0) <= 0);
    }
    if (procureSearchQuery.trim()) {
      const q = procureSearchQuery.toLowerCase();
      list = list.filter((p) =>
        p.item_name?.toLowerCase().includes(q) ||
        p.supplier_name?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [procurements, procureStockFilter, procureSearchQuery]);

  const filteredCollections = useMemo(() => {
    if (!paymentsSearchQuery.trim()) return collections;
    const q = paymentsSearchQuery.toLowerCase();
    return collections.filter((c) => {
      const cust = customers.find((cu) => cu.id === c.customer_id);
      return (
        c.reference_no?.toLowerCase().includes(q) ||
        cust?.name?.toLowerCase().includes(q) ||
        c.notes?.toLowerCase().includes(q)
      );
    });
  }, [collections, customers, paymentsSearchQuery]);

  const filteredSupplierPayments = useMemo(() => {
    let list = procurements.filter((p) => Number(p.p1_amount || 0) > 0 || Number(p.total_amount || 0) > 0);
    if (paymentsSearchQuery.trim()) {
      const q = paymentsSearchQuery.toLowerCase();
      list = list.filter((p) =>
        p.supplier_name?.toLowerCase().includes(q) ||
        p.item_name?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [procurements, paymentsSearchQuery]);

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
    if (upfrontPaidNum > cartTotal) {
      return alert("Upfront payment cannot exceed total amount");
    }
    if (upfrontPaidNum > 0 && !upfrontPartnerId) {
      return alert("Select which partner received the upfront payment");
    }

    setSavingSale(true);
    try {
      const status = upfrontPaidNum >= cartTotal ? "Collected" : upfrontPaidNum > 0 ? "Partial" : "Due";
      const datePrefix = (saleDate || new Date().toISOString().split("T")[0]).replace(/-/g, "").slice(2);
      const generatedInvoiceNumber = `INV-${datePrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

      const invoicePayload = {
        invoice_number: editingInvoiceId ? undefined : generatedInvoiceNumber,
        customer_id: selectedCust.id,
        customer_name: selectedCust.name,
        invoice_date: saleDate,
        total_amount: cartTotal,
        upfront_paid: upfrontPaidNum,
        balance_due: remainingBillDue,
        upfront_mode: upfrontPaidNum > 0 ? upfrontMode : "None",
        upfront_receiver_id: upfrontPaidNum > 0 ? Number(upfrontPartnerId) : null,
        status: status,
        payment_mode: upfrontPaidNum === 0 ? "Due" : upfrontPaidNum >= cartTotal ? upfrontMode : "Partial",
        items: cart.map((c) => ({
          procure_id: c.procure_id,
          item_name: c.item_name,
          qty: c.qty,
          rate: c.rate,
          total: c.total,
          purchase_rate: c.purchase_rate
        }))
      };

      if (editingInvoiceId) {
        const oldInv = invoices.find((i) => i.id === editingInvoiceId);
        if (oldInv && Array.isArray(oldInv.items)) {
          for (const item of oldInv.items) {
            const batch = procurements.find((p) => p.id == item.procure_id);
            if (batch) {
              await db.from("procurements").update({ remaining_qty: Number(batch.remaining_qty) + Number(item.qty) }).eq("id", batch.id);
            }
          }
          const restoredCustDue = Math.max(0, Number(selectedCust.old_due || 0) - Number(oldInv.balance_due || 0));
          await db.from("customers").update({ old_due: restoredCustDue }).eq("id", selectedCust.id);
        }

        const { error } = await db.from("invoices").update(invoicePayload).eq("id", editingInvoiceId);
        if (error) throw error;
        alert("Invoice updated successfully!");
      } else {
        const { error } = await db.from("invoices").insert([invoicePayload]);
        if (error) throw error;
        alert(`Invoice created! Status: ${status}`);
      }

      for (const line of cart) {
        const batch = procurements.find((p) => p.id == line.procure_id);
        if (batch) {
          const rem = Math.max(0, Number(batch.remaining_qty) - Number(line.qty));
          await db.from("procurements").update({ remaining_qty: rem }).eq("id", batch.id);
        }
      }

      if (remainingBillDue > 0) {
        const currentCust = customers.find((c) => c.id === selectedCust.id);
        const updatedDue = Number(currentCust?.old_due || 0) + remainingBillDue;
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

      if (Number(inv.balance_due || 0) > 0) {
        const cust = customers.find((c) => c.id == inv.customer_id);
        if (cust) {
          const newDue = Math.max(0, Number(cust.old_due || 0) - Number(inv.balance_due || 0));
          await db.from("customers").update({ old_due: newDue }).eq("id", cust.id);
        }
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
    const isCollected = inv.status === "Collected" || Number(inv.balance_due || 0) <= 0;
    if (isCollected) {
      return alert("This invoice is fully Collected and locked from edits.");
    }

    setEditingInvoiceId(inv.id);
    const cust = customers.find((c) => c.id == inv.customer_id);
    setSelectedCust(cust || { id: inv.customer_id, name: inv.customer_name, old_due: 0 });
    setSaleDate(inv.invoice_date || inv.created_at?.slice(0, 10));
    setUpfrontAmount(String(inv.upfront_paid || ""));
    setUpfrontMode(inv.upfront_mode || "Cash");
    setUpfrontPartnerId(inv.upfront_receiver_id ? String(inv.upfront_receiver_id) : upfrontPartnerId);

    if (Array.isArray(inv.items) && inv.items.length > 0) {
      setCart(inv.items.map((i) => ({ ...i })));
    }
    setActiveTab("sale");
  };

  const handleShareWhatsApp = (inv) => {
    const cust = customers.find((c) => c.id === inv.customer_id) || {};
    const cleanMobile = (cust.mobile || "").replace(/[^0-9]/g, "");

    let itemLines = "";
    if (Array.isArray(inv.items)) {
      itemLines = inv.items.map((i, idx) => `${idx + 1}. *${i.item_name}* - ${i.qty} x ₹${i.rate} = ₹${i.total}`).join("\n");
    }

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
Thank you for your business!`;

    const targetUrl = cleanMobile.length >= 10
      ? `https://wa.me/${cleanMobile.length === 10 ? "91" + cleanMobile : cleanMobile}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(targetUrl, "_blank");
  };

  // CUSTOMER DUES COLLECTIONS
  const handleEditCollection = (col) => {
    setEditingCollectionId(col.id);
    setCollectForm({
      customer_id: String(col.customer_id),
      invoice_id: col.invoice_id ? String(col.invoice_id) : "",
      amount: String(col.amount),
      payment_mode: col.payment_mode || "Cash",
      receiver_id: col.receiver_id ? String(col.receiver_id) : upfrontPartnerId,
      reference_no: col.reference_no || "",
      notes: col.notes || ""
    });
    setShowCollectModal(true);
  };

  const handleDeleteCollection = async (col) => {
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

          await db.from("invoices").update({
            balance_due: newBal,
            status: newStatus
          }).eq("id", targetInv.id);
        }
      }

      const cust = customers.find((c) => c.id == col.customer_id);
      if (cust) {
        await db.from("customers").update({
          old_due: Number(cust.old_due || 0) + amt
        }).eq("id", cust.id);
      }

      await db.from("collections").delete().eq("id", col.id);
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
    if (!collectForm.receiver_id) return alert("Select partner who collected");

    const datePrefix = new Date().toISOString().split("T")[0].replace(/-/g, "").slice(2);
    const refNo = collectForm.reference_no.trim() || `REC-${datePrefix}-${Math.floor(1000 + Math.random() * 9000)}`;

    const payload = {
      customer_id: Number(collectForm.customer_id),
      invoice_id: collectForm.invoice_id ? Number(collectForm.invoice_id) : null,
      amount: amt,
      payment_mode: collectForm.payment_mode,
      receiver_id: Number(collectForm.receiver_id),
      reference_no: refNo,
      notes: collectForm.notes.trim()
    };

    try {
      if (editingCollectionId) {
        const oldCol = collections.find((c) => c.id === editingCollectionId);
        const diff = amt - Number(oldCol.amount || 0);

        if (collectForm.invoice_id) {
          const targetInv = invoices.find((i) => i.id == collectForm.invoice_id);
          if (targetInv) {
            const newBal = Math.max(0, Number(targetInv.balance_due || 0) - diff);
            await db.from("invoices").update({
              balance_due: newBal,
              status: newBal <= 0 ? "Collected" : "Partial"
            }).eq("id", targetInv.id);
          }
        }

        const cust = customers.find((c) => c.id == collectForm.customer_id);
        if (cust) {
          await db.from("customers").update({ old_due: Math.max(0, Number(cust.old_due || 0) - diff) }).eq("id", cust.id);
        }

        await db.from("collections").update(payload).eq("id", editingCollectionId);
        alert("Collection updated successfully!");
      } else {
        await db.from("collections").insert([payload]);

        if (collectForm.invoice_id) {
          const targetInv = invoices.find((i) => i.id == collectForm.invoice_id);
          if (targetInv) {
            const currentBal = Number(targetInv.balance_due || 0);
            const newBal = Math.max(0, currentBal - amt);
            await db.from("invoices").update({
              balance_due: newBal,
              status: newBal <= 0 ? "Collected" : "Partial"
            }).eq("id", targetInv.id);
          }
        }

        const cust = customers.find((c) => c.id == collectForm.customer_id);
        if (cust) {
          await db.from("customers").update({ old_due: Math.max(0, Number(cust.old_due || 0) - amt) }).eq("id", cust.id);
        }

        alert(`Collection recorded (${refNo})!`);
      }

      setShowCollectModal(false);
      setEditingCollectionId(null);
      refreshData();
    } catch (err) {
      alert("Error saving collection: " + err.message);
    }
  };

  // PURCHASES PAYMENTS
  const handleEditPurchasePayment = (p) => {
    setEditingPaymentId(p.id);
    setPayPurchaseForm({
      purchase_id: String(p.id),
      amount: String(p.p1_amount || ""),
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
    if (!payPurchaseForm.purchase_id) return alert("Select purchase bill");
    if (!payPurchaseForm.partner_id) return alert("Select partner paying this bill");

    const targetP = procurements.find((p) => p.id == payPurchaseForm.purchase_id);
    if (!targetP) return alert("Purchase not found");

    const currentTotal = Number(targetP.total_amount || 0);
    if (amt > currentTotal) {
      return alert("Payment exceeds total purchase bill valuation!");
    }

    try {
      await db.from("procurements").update({
        p1_amount: amt,
        p1_id: Number(payPurchaseForm.partner_id),
        p1_mode: payPurchaseForm.payment_mode
      }).eq("id", targetP.id);

      alert(`Purchase payment recorded!`);
      setShowPayPurchaseModal(false);
      setEditingPaymentId(null);
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
    const payload = { name: custForm.name.trim(), mobile: custForm.mobile.trim(), old_due: Number(custForm.old_due || 0) };
    try {
      if (editingCustId) {
        await db.from("customers").update(payload).eq("id", editingCustId);
        alert("Customer updated!");
      } else {
        await db.from("customers").insert([payload]);
        alert("Customer created!");
      }
      setShowCustModal(false);
      setEditingCustId(null);
      setCustForm({ name: "", mobile: "", old_due: "" });
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  // SUPPLIER HANDLERS
  const handleEditSupplier = (s) => {
    setEditingSupplierId(s.id);
    setSupplierForm({ name: s.name || "", mobile: s.mobile || "", old_due: s.old_due || "" });
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
    const payload = {
      name: supplierForm.name.trim(),
      mobile: supplierForm.mobile.trim(),
      old_due: Number(supplierForm.old_due || 0)
    };
    try {
      if (editingSupplierId) {
        await db.from("suppliers").update(payload).eq("id", editingSupplierId);
        alert("Supplier updated!");
      } else {
        await db.from("suppliers").insert([payload]);
        alert("Supplier created!");
      }
      setProcureForm((prev) => ({ ...prev, supplier_name: payload.name }));
      setShowSupplierModal(false);
      setEditingSupplierId(null);
      setSupplierForm({ name: "", mobile: "", old_due: "" });
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
    if (!confirm(`Delete item "${item.name}" from master?`)) return;
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
    const payload = {
      name: itemForm.name.trim(),
      purchase_rate: Number(itemForm.purchase_rate || 0),
      selling_rate: Number(itemForm.selling_rate || 0)
    };
    try {
      if (editingItemId) {
        await db.from("items").update(payload).eq("id", editingItemId);
        alert("Item updated!");
      } else {
        await db.from("items").insert([payload]);
        alert("Item created!");
      }
      setProcureForm((prev) => ({
        ...prev,
        item_name: payload.name,
        purchase_rate: payload.purchase_rate > 0 ? String(payload.purchase_rate) : prev.purchase_rate,
        selling_rate: payload.selling_rate > 0 ? String(payload.selling_rate) : prev.selling_rate
      }));
      setShowItemModal(false);
      setEditingItemId(null);
      setItemForm({ name: "", purchase_rate: "", selling_rate: "" });
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  // PARTNER HANDLERS
  const handleEditPartner = (p) => {
    setEditingPartnerId(p.id);
    setPartnerForm({
      name: p.name || "",
      opening_cash: String(p.opening_cash || ""),
      opening_upi: String(p.opening_upi || "")
    });
    setShowPartnerModal(true);
  };

  const handleDeletePartner = async (p) => {
    if (!confirm(`Permanently delete partner "${p.name}"?`)) return;
    try {
      await db.from("receivers").delete().eq("id", p.id);
      alert("Partner deleted!");
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  const savePartner = async (e) => {
    e.preventDefault();
    const payload = {
      name: partnerForm.name.trim(),
      opening_cash: Number(partnerForm.opening_cash || 0),
      opening_upi: Number(partnerForm.opening_upi || 0)
    };
    try {
      if (editingPartnerId) {
        await db.from("receivers").update(payload).eq("id", editingPartnerId);
        alert("Partner updated!");
      } else {
        await db.from("receivers").insert([payload]);
        alert("Partner added!");
      }
      setShowPartnerModal(false);
      setEditingPartnerId(null);
      setPartnerForm({ name: "", opening_cash: "", opening_upi: "" });
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
    if (!lenderForm.name.trim()) return alert("Enter lender or finance source name");
    const initialAmount = Number(lenderForm.initial_loan || 0);

    try {
      if (editingLenderId) {
        await db.from("borrowers").update({
          name: lenderForm.name.trim(),
          mobile: lenderForm.mobile.trim(),
          balance_due: initialAmount
        }).eq("id", editingLenderId);
        alert("Lender updated!");
      } else {
        await db.from("borrowers").insert([{
          name: lenderForm.name.trim(),
          mobile: lenderForm.mobile.trim(),
          total_borrowed: initialAmount,
          balance_due: initialAmount
        }]);
        alert("Lender added!");
      }
      setShowLenderModal(false);
      setEditingLenderId(null);
      setLenderForm({ name: "", mobile: "", initial_loan: "" });
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  const saveLoanRepayment = async (e) => {
    e.preventDefault();
    const amt = Number(loanPaymentForm.amount || 0);
    if (amt <= 0) return alert("Enter valid repayment amount");
    if (!loanPaymentForm.partner_id) return alert("Select which partner account is paying");

    try {
      await db.from("borrower_transactions").insert([{
        borrower_id: Number(loanPaymentForm.borrower_id),
        tx_type: "Repayment",
        amount: amt,
        payment_mode: loanPaymentForm.payment_mode,
        partner_id: Number(loanPaymentForm.partner_id),
        notes: loanPaymentForm.notes.trim(),
        tx_date: loanPaymentForm.tx_date
      }]);

      const targetL = lenders.find((l) => l.id == loanPaymentForm.borrower_id);
      if (targetL) {
        const currentBal = Number(targetL.balance_due || targetL.total_borrowed || 0);
        const newBal = Math.max(0, currentBal - amt);
        const newRepaid = Number(targetL.total_repaid || 0) + amt;

        await db.from("borrowers").update({
          total_repaid: newRepaid,
          balance_due: newBal
        }).eq("id", targetL.id);
      }

      setShowLoanPaymentModal(false);
      refreshData();
      alert("Loan repayment recorded!");
    } catch (err) {
      alert(err.message);
    }
  };

  // PURCHASES HANDLERS
  const handleEditProcurement = (p) => {
    const total = Number(p.total_amount || 0);
    const paid = Number(p.p1_amount || 0);
    const isPaid = paid >= total && total > 0;
    if (isPaid) {
      return alert("This purchase bill is fully Paid and locked from edits.");
    }

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
    if (!confirm(`Delete purchase "${p.item_name}" from ${p.supplier_name}?`)) return;
    try {
      await db.from("procurements").delete().eq("id", p.id);
      alert("Purchase deleted!");
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  const saveProcurement = async (e) => {
    e.preventDefault();
    if (!procureForm.supplier_name) return alert("Select or add a Supplier");
    if (!procureForm.item_name) return alert("Select or add an Item");

    const qty = Number(procureForm.procured_qty || 0);
    const purchaseRate = Number(procureForm.purchase_rate || 0);
    const sellingRate = Number(procureForm.selling_rate || purchaseRate);
    const total = qty * purchaseRate;
    const paidNowNum = Number(procureForm.paid_now || 0);

    if (paidNowNum > total) return alert("Amount paid cannot exceed purchase total.");
    if (paidNowNum > 0 && !procureForm.p1_id) return alert("Select funding partner.");

    const payload = {
      supplier_name: procureForm.is_opening ? "Opening Stock" : procureForm.supplier_name.trim() || "Vendor",
      item_name: procureForm.item_name.trim(),
      procured_qty: qty,
      remaining_qty: qty,
      purchase_rate: purchaseRate,
      selling_rate: sellingRate,
      total_amount: total,
      p1_id: paidNowNum > 0 ? Number(procureForm.p1_id) : null,
      p1_amount: paidNowNum,
      p1_mode: procureForm.p1_mode
    };

    try {
      if (editingProcureId) {
        await db.from("procurements").update(payload).eq("id", editingProcureId);
        alert("Purchase record updated!");
      } else {
        await db.from("procurements").insert([payload]);
        alert(`Purchase saved!`);
      }
      setShowProcureModal(false);
      setEditingProcureId(null);
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Filtered Masters Collections
  const filteredCustomers = useMemo(() => {
    if (!masterSearchQuery) return customers;
    const q = masterSearchQuery.toLowerCase();
    return customers.filter((c) => c.name?.toLowerCase().includes(q) || c.mobile?.includes(q));
  }, [customers, masterSearchQuery]);

  const filteredSuppliers = useMemo(() => {
    if (!masterSearchQuery) return suppliers;
    const q = masterSearchQuery.toLowerCase();
    return suppliers.filter((s) => s.name?.toLowerCase().includes(q) || s.mobile?.includes(q));
  }, [suppliers, masterSearchQuery]);

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

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-800 antialiased">
      {/* Mobile Header */}
      <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-sm">B</div>
          <span className="font-bold text-sm tracking-wide">B Reddy Sales</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 -mr-1 rounded-xl text-slate-300">
          <Icon name={sidebarOpen ? "close" : "menu"} size={22} />
        </button>
      </header>

      {/* SIDEBAR */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-72 bg-slate-900 text-slate-300 flex flex-col justify-between z-40 transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="overflow-y-auto">
          <div className="p-5 border-b border-slate-800 hidden md:flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-600/30">
              B
            </div>
            <div>
              <h1 className="font-black text-white text-base tracking-wide leading-tight">B REDDY SALES</h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Wholesale & Retail</p>
            </div>
          </div>

          <nav className="p-3 space-y-4 mt-1">
            <div>
              <span className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Sales & Purchases</span>
              <div className="space-y-1">
                <button
                  onClick={() => { setActiveTab("sale"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === "sale" ? "bg-indigo-600 text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon name="cart" size={17} /> Point of Sale (Billing)
                </button>
                <button
                  onClick={() => { setActiveTab("invoices"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === "invoices" ? "bg-indigo-600 text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon name="invoice" size={17} /> Sales Invoices Directory
                </button>
                <button
                  onClick={() => { setActiveTab("procurement"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === "procurement" ? "bg-indigo-600 text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon name="package" size={17} /> Purchases & Stock
                </button>
                <button
                  onClick={() => { setActiveTab("payments_collections"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === "payments_collections" ? "bg-indigo-600 text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"
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
                    activeTab === "summary" ? "bg-indigo-600 text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon name="dashboard" size={17} /> Business Snapshot
                </button>
                <button
                  onClick={() => { setActiveTab("history_audit"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === "history_audit" ? "bg-indigo-600 text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon name="history" size={17} /> Transaction Audit Ledger
                </button>
                <button
                  onClick={() => { setActiveTab("lenders"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === "lenders" ? "bg-indigo-600 text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon name="handcoins" size={17} /> Business Loans (అప్పులు)
                </button>
                <button
                  onClick={() => { setActiveTab("expenses"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === "expenses" ? "bg-indigo-600 text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon name="creditcard" size={17} /> Shop Expenses & Outflow
                </button>
                <button
                  onClick={() => { setActiveTab("reports"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === "reports" ? "bg-indigo-600 text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon name="filetext" size={17} /> B Reddy Excel Sheet (PDF)
                </button>
              </div>
            </div>

            <div>
              <span className="px-3 text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">Administration</span>
              <div className="space-y-1">
                <button
                  onClick={() => { setActiveTab("masters"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === "masters" ? "bg-indigo-600 text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon name="layers" size={17} /> Master Management
                </button>
                <button
                  onClick={() => { setActiveTab("partners"); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    activeTab === "partners" ? "bg-indigo-600 text-white shadow-sm" : "hover:bg-slate-800 text-slate-400"
                  }`}
                >
                  <Icon name="wallet" size={17} /> Partner Capital Accounts
                </button>
              </div>
            </div>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-2">
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
              setPayPurchaseForm({ purchase_id: "", amount: "", partner_id: upfrontPartnerId, payment_mode: "Cash", reference_no: "", notes: "" });
              setShowPayPurchaseModal(true);
              setSidebarOpen(false);
            }}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow"
          >
            <Icon name="wallet" size={15} /> Pay Purchase Bill
          </button>
        </div>
      </aside>

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-xs" />}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-3.5 sm:p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* VIEW 1: POS BILLING */}
        {activeTab === "sale" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="font-black text-lg text-slate-900 leading-tight">
                    {editingInvoiceId ? "Edit Sales Invoice" : "Create Sales Invoice"}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {editingInvoiceId ? "Adjust items and rates, then re-save" : "Bills go to customer credit by default"}
                  </p>
                </div>
                <input
                  type="date"
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                />
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
                  value={selectedCust ? selectedCust.id : ""}
                  onChange={(e) => {
                    const c = customers.find((x) => x.id == e.target.value);
                    setSelectedCust(c || null);
                  }}
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.mobile || "No Mobile"}) — Due: {money(c.old_due)}
                    </option>
                  ))}
                </select>
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

            {/* Bill Summary */}
            <div className="lg:col-span-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 h-fit">
              <h3 className="font-bold text-base text-slate-900 border-b pb-3">Payment Terms</h3>
              <div className="flex justify-between text-sm font-black text-slate-900">
                <span>Bill Total:</span>
                <span>{money(cartTotal)}</span>
              </div>

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
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold"
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

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs flex justify-between items-center text-amber-900 font-bold">
                <span>Adding to Customer Due:</span>
                <span className="text-sm text-rose-600 font-black">{money(remainingBillDue)}</span>
              </div>

              <button
                type="button"
                disabled={savingSale || cartTotal <= 0}
                onClick={saveSaleInvoice}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-black rounded-xl text-xs uppercase tracking-wider"
              >
                {savingSale ? "Saving..." : editingInvoiceId ? "Update & Save Invoice" : "Save Invoice & Bill"}
              </button>
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
                <Icon name="plus" size={15} /> + Create New Bill
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

            {/* Search & Filters */}
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

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold overflow-x-auto">
                  {[
                    { id: "all", label: "All Bills" },
                    { id: "collected", label: "Collected" },
                    { id: "partial", label: "Partial" },
                    { id: "due", label: "Unpaid Due" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setInvoiceStatusFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                        invoiceStatusFilter === tab.id ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Invoices List / Table */}
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b">
                    <tr>
                      <th className="p-3">Invoice #</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Items Summary</th>
                      <th className="p-3 text-right">Total</th>
                      <th className="p-3 text-right">Paid</th>
                      <th className="p-3 text-right">Balance Due</th>
                      <th className="p-3 text-center">Status</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredInvoices.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-slate-400">
                          No invoices found matching your criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredInvoices.map((inv) => {
                        const isPaid = Number(inv.balance_due || 0) <= 0;
                        const isPartial = !isPaid && Number(inv.upfront_paid || 0) > 0;
                        const statusLabel = isPaid ? "Collected" : isPartial ? "Partial" : "Due";
                        const itemCount = Array.isArray(inv.items) ? inv.items.length : 0;
                        const firstItemName = Array.isArray(inv.items) && inv.items[0]?.item_name;

                        return (
                          <tr key={inv.id} className="hover:bg-slate-50 transition">
                            <td className="p-3 font-mono font-bold text-indigo-600">
                              {inv.invoice_number || `INV-${inv.id}`}
                            </td>
                            <td className="p-3 text-slate-500 whitespace-nowrap">
                              {inv.invoice_date || inv.created_at?.slice(0, 10)}
                            </td>
                            <td className="p-3 font-bold text-slate-900">
                              <div>{inv.customer_name}</div>
                            </td>
                            <td className="p-3 text-slate-500 text-[11px]">
                              {itemCount > 0 ? (
                                <span>
                                  {firstItemName}
                                  {itemCount > 1 && <span className="text-slate-400"> +{itemCount - 1} more</span>}
                                </span>
                              ) : (
                                <span className="text-slate-400">Standard Bill</span>
                              )}
                            </td>
                            <td className="p-3 text-right font-black text-slate-900">
                              {money(inv.total_amount)}
                            </td>
                            <td className="p-3 text-right text-emerald-600 font-bold">
                              {money(inv.upfront_paid)}
                            </td>
                            <td className="p-3 text-right font-black text-rose-600">
                              {money(inv.balance_due)}
                            </td>
                            <td className="p-3 text-center">
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
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  title="View / Print Invoice"
                                  onClick={() => setSelectedViewInvoice(inv)}
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                                >
                                  <Icon name="receipt" size={14} />
                                </button>
                                <button
                                  type="button"
                                  title="Share to WhatsApp"
                                  onClick={() => handleShareWhatsApp(inv)}
                                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg transition"
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
                                        amount: String(inv.balance_due),
                                        payment_mode: "Cash",
                                        receiver_id: upfrontPartnerId || "",
                                        reference_no: "",
                                        notes: `Payment for ${inv.invoice_number || "INV-" + inv.id}`
                                      });
                                      setShowCollectModal(true);
                                    }}
                                    className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition"
                                  >
                                    <Icon name="handcoins" size={14} />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  title="Edit Invoice"
                                  onClick={() => handleEditInvoice(inv)}
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                                >
                                  <Icon name="edit" size={14} />
                                </button>
                                <button
                                  type="button"
                                  title="Delete Invoice"
                                  onClick={() => handleDeleteInvoice(inv)}
                                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                                >
                                  <Icon name="trash" size={14} />
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
            </div>
          </div>
        )}

        {/* VIEW: PURCHASES & STOCK */}
        {activeTab === "procurement" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Purchases & Stock (కొనుగోళ్లు & స్టాక్)</h2>
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
                <Icon name="plus" size={15} /> + Record Purchase & Stock
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

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold overflow-x-auto">
                  {[
                    { id: "all", label: "All Items" },
                    { id: "in_stock", label: "In Stock" },
                    { id: "out_of_stock", label: "Out of Stock" }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setProcureStockFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                        procureStockFilter === tab.id ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b">
                    <tr>
                      <th className="p-3">Date</th>
                      <th className="p-3">Item Name</th>
                      <th className="p-3">Supplier</th>
                      <th className="p-3 text-center">Stock (Left / Total)</th>
                      <th className="p-3 text-right">Cost Rate</th>
                      <th className="p-3 text-right">Selling Rate</th>
                      <th className="p-3 text-right">Total Bill</th>
                      <th className="p-3 text-right">Paid</th>
                      <th className="p-3 text-right">Due</th>
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredProcurements.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="p-8 text-center text-slate-400">
                          No purchases or stock records found.
                        </td>
                      </tr>
                    ) : (
                      filteredProcurements.map((p) => {
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
                                <button
                                  type="button"
                                  title="Delete Procurement"
                                  onClick={() => handleDeleteProcurement(p)}
                                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                                >
                                  <Icon name="trash" size={14} />
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
            </div>
          </div>
        )}

        {/* VIEW: PAYMENTS & COLLECTIONS */}
        {activeTab === "payments_collections" && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Payments & Collections (చెల్లింపులు & వసూళ్లు)</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Manage customer due collections and supplier purchase payments</p>
              </div>
              <div className="flex items-center gap-2">
                {paymentsSubTab === "collections" ? (
                  <button
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
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Icon name="handcoins" size={15} /> + Collect Customer Due
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingPaymentId(null);
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
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Icon name="wallet" size={15} /> + Pay Supplier Bill
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
                📥 Customer Collections ({collections.length})
              </button>
              <button
                onClick={() => { setPaymentsSubTab("supplier_payments"); setPaymentsSearchQuery(""); }}
                className={`px-4 py-2 rounded-xl transition ${
                  paymentsSubTab === "supplier_payments" ? "bg-white text-indigo-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                📤 Supplier Payments ({procurements.filter((p) => Number(p.p1_amount || 0) > 0).length})
              </button>
            </div>

            {/* SUB-VIEW 1: CUSTOMER COLLECTIONS */}
            {paymentsSubTab === "collections" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Recoveries</span>
                    <b className="text-xl font-black text-emerald-600 mt-1 block">
                      {money(collections.reduce((s, c) => s + Number(c.amount || 0), 0))}
                    </b>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">{collections.length} payment receipts recorded</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Cash Collected</span>
                    <b className="text-xl font-black text-slate-900 mt-1 block">
                      {money(collections.filter((c) => c.payment_mode === "Cash").reduce((s, c) => s + Number(c.amount || 0), 0))}
                    </b>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">Physical cash receipts</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">UPI Collected</span>
                    <b className="text-xl font-black text-indigo-600 mt-1 block">
                      {money(collections.filter((c) => c.payment_mode === "UPI").reduce((s, c) => s + Number(c.amount || 0), 0))}
                    </b>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">Direct bank transfers</span>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="relative">
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

                  <div className="overflow-x-auto border border-slate-100 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b">
                        <tr>
                          <th className="p-3">Receipt #</th>
                          <th className="p-3">Date</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Invoice Ref</th>
                          <th className="p-3 text-right">Amount</th>
                          <th className="p-3 text-center">Mode</th>
                          <th className="p-3">Receiver Partner</th>
                          <th className="p-3">Notes</th>
                          <th className="p-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {filteredCollections.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="p-8 text-center text-slate-400">
                              No customer collections recorded yet.
                            </td>
                          </tr>
                        ) : (
                          filteredCollections.map((c) => {
                            const cust = customers.find((cu) => cu.id === c.customer_id);
                            const receiver = partners.find((p) => p.id === c.receiver_id);
                            const inv = invoices.find((i) => i.id === c.invoice_id);

                            return (
                              <tr key={c.id} className="hover:bg-slate-50 transition">
                                <td className="p-3 font-mono font-bold text-emerald-700">
                                  {c.reference_no || `REC-${c.id}`}
                                </td>
                                <td className="p-3 text-slate-500 whitespace-nowrap">
                                  {c.created_at?.slice(0, 10)}
                                </td>
                                <td className="p-3 font-bold text-slate-900">
                                  {cust?.name || "Customer"}
                                </td>
                                <td className="p-3 font-mono text-[11px] text-indigo-600">
                                  {inv ? (inv.invoice_number || `INV-${inv.id}`) : "-"}
                                </td>
                                <td className="p-3 text-right font-black text-emerald-700">
                                  {money(c.amount)}
                                </td>
                                <td className="p-3 text-center">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                    c.payment_mode === "UPI" ? "bg-indigo-100 text-indigo-800" : "bg-emerald-100 text-emerald-800"
                                  }`}>
                                    {c.payment_mode || "Cash"}
                                  </span>
                                </td>
                                <td className="p-3 text-slate-700 font-medium">
                                  {receiver?.name || "-"}
                                </td>
                                <td className="p-3 text-slate-400 text-[11px] max-w-xs truncate">
                                  {c.notes || "-"}
                                </td>
                                <td className="p-3 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
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
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
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
                  <div className="relative">
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

                  <div className="overflow-x-auto border border-slate-100 rounded-xl">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b">
                        <tr>
                          <th className="p-3">Date</th>
                          <th className="p-3">Supplier Name</th>
                          <th className="p-3">Item Procured</th>
                          <th className="p-3 text-right">Total Bill</th>
                          <th className="p-3 text-right">Amount Paid</th>
                          <th className="p-3 text-right">Remaining Due</th>
                          <th className="p-3 text-center">Payment Mode</th>
                          <th className="p-3">Funding Partner</th>
                          <th className="p-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {filteredSupplierPayments.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="p-8 text-center text-slate-400">
                              No supplier payments recorded.
                            </td>
                          </tr>
                        ) : (
                          filteredSupplierPayments.map((p) => {
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
              <button
                onClick={() => refreshData()}
                className="self-start sm:self-auto px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Icon name="history" size={14} /> Refresh Data
              </button>
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
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-100 block">Net Business Profit (లాభం)</span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">{money(businessSummary.bReddyNetProfit)}</h3>
                <span className="text-[11px] font-bold text-emerald-200 mt-1 block">Receivables + Stock - Payables</span>
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

                <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-bold w-full sm:w-auto">
                  <button
                    onClick={() => setAuditFilterType("all")}
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg ${auditFilterType === "all" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600"}`}
                  >
                    All Transactions
                  </button>
                  <button
                    onClick={() => setAuditFilterType("sale")}
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg ${auditFilterType === "sale" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600"}`}
                  >
                    Sales
                  </button>
                  <button
                    onClick={() => setAuditFilterType("purchase")}
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg ${auditFilterType === "purchase" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600"}`}
                  >
                    Purchases
                  </button>
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

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b">
                    <tr>
                      <th className="p-3">Doc #</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Party</th>
                      <th className="p-3 text-right">Total (₹)</th>
                      <th className="p-3 text-right">Paid (₹)</th>
                      <th className="p-3 text-right">Balance Due</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {combinedAuditTransactions.map((tx) => (
                      <tr
                        key={`${tx.txType}-${tx.id}`}
                        onClick={() => setSelectedAuditTx(tx)}
                        className="hover:bg-indigo-50/50 cursor-pointer transition"
                      >
                        <td className="p-3 font-mono font-bold text-indigo-600">{tx.docNumber}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            tx.txType === "sale" ? "bg-indigo-100 text-indigo-800" : "bg-emerald-100 text-emerald-800"
                          }`}>
                            {tx.txType === "sale" ? "Sales Bill" : "Purchase"}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500">{tx.date}</td>
                        <td className="p-3 font-bold text-slate-900">{tx.partyName}</td>
                        <td className="p-3 text-right font-bold">{money(tx.totalAmount)}</td>
                        <td className="p-3 text-right text-emerald-600">{money(tx.paidAmount)}</td>
                        <td className="p-3 text-right text-rose-600 font-bold">{money(tx.balanceDue)}</td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            tx.status === "Collected" || tx.status === "Paid"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

              {mastersSubTab === "customers" && (
                <button
                  onClick={() => { setEditingCustId(null); setCustForm({ name: "", mobile: "", old_due: "" }); setShowCustModal(true); }}
                  className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Icon name="plus" size={14} /> Add Customer
                </button>
              )}
              {mastersSubTab === "suppliers" && (
                <button
                  onClick={() => { setEditingSupplierId(null); setSupplierForm({ name: "", mobile: "", old_due: "" }); setShowSupplierModal(true); }}
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

            {/* SUB-VIEW: CUSTOMERS */}
            {mastersSubTab === "customers" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {filteredCustomers.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-2xs flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 font-black text-sm flex items-center justify-center">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-slate-900">{c.name}</h4>
                        <span className="text-xs text-slate-400 block">{c.mobile || "No Mobile"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Due Balance</span>
                        <span className="font-black text-rose-600 text-sm">{money(c.old_due)}</span>
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={() => handleEditCustomer(c)} className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
                          <Icon name="edit" size={14} />
                        </button>
                        <button onClick={() => handleDeleteCustomer(c)} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-100">
                          <Icon name="trash" size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SUB-VIEW: SUPPLIERS */}
            {mastersSubTab === "suppliers" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {filteredSuppliers.map((s) => (
                  <div key={s.id} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-2xs flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 font-black text-sm flex items-center justify-center">
                        {s.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-slate-900">{s.name}</h4>
                        <span className="text-xs text-slate-400 block">{s.mobile || "No Mobile"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Payable Due</span>
                        <span className="font-black text-amber-600 text-sm">{money(s.old_due)}</span>
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={() => handleEditSupplier(s)} className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
                          <Icon name="edit" size={14} />
                        </button>
                        <button onClick={() => handleDeleteSupplier(s)} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-100">
                          <Icon name="trash" size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SUB-VIEW: ITEMS */}
            {mastersSubTab === "items" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {filteredItems.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-2xs flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-black text-sm flex items-center justify-center">
                        <Icon name="package" size={17} />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-slate-900">{item.name}</h4>
                        <span className="text-xs text-slate-400">
                          Cost: {money(item.purchase_rate)} | Selling: <b className="text-indigo-600">{money(item.selling_rate)}</b>
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          setEditingItemId(item.id || null);
                          setItemForm({
                            name: item.name,
                            purchase_rate: item.purchase_rate ? String(item.purchase_rate) : "",
                            selling_rate: item.selling_rate ? String(item.selling_rate) : ""
                          });
                          setShowItemModal(true);
                        }}
                        className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 flex items-center gap-1"
                      >
                        <Icon name="edit" size={13} /> Edit
                      </button>
                      {item.id && (
                        <button onClick={() => handleDeleteItem(item)} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-100">
                          <Icon name="trash" size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SUB-VIEW: LENDERS (BUSINESS LOANS) */}
            {mastersSubTab === "lenders" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {filteredLenders.map((l) => (
                  <div key={l.id} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-2xs flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 font-black text-sm flex items-center justify-center">
                        <Icon name="handcoins" size={17} />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-slate-900">{l.name}</h4>
                        <span className="text-xs text-slate-400 block">{l.mobile || "No Mobile"}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Pending Loan</span>
                        <span className="font-black text-rose-600 text-sm">{money(l.balance_due)}</span>
                      </div>
                      <div className="flex gap-1.5">
                        <button onClick={() => handleEditLender(l)} className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
                          <Icon name="edit" size={14} />
                        </button>
                        <button onClick={() => handleDeleteLender(l)} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-100">
                          <Icon name="trash" size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SUB-VIEW: PARTNERS */}
            {mastersSubTab === "partners" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {partners.map((p) => (
                  <div key={p.id} className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition shadow-2xs flex justify-between items-center">
                    <div>
                      <h4 className="font-black text-base text-slate-900">{p.name}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Opening Cash: {money(p.opening_cash)} | Opening UPI: {money(p.opening_upi)}
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      <button onClick={() => handleEditPartner(p)} className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 flex items-center gap-1">
                        <Icon name="edit" size={13} /> Edit
                      </button>
                      <button onClick={() => handleDeletePartner(p)} className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-100">
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SUB-VIEW: CATEGORIES */}
            {mastersSubTab === "categories" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 pt-2">
                {expenseCategories.map((c) => (
                  <div key={c.id} className="p-3.5 rounded-2xl border border-slate-200 bg-white text-xs font-bold text-slate-700 shadow-2xs flex items-center justify-between">
                    <span>{c.name}</span>
                  </div>
                ))}
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
                      amount: "",
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

            <div className="space-y-3">
              {lenders.map((l) => (
                <div key={l.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Lender / Finance Source</span>
                    <h4 className="font-black text-base text-slate-900 mt-0.5">{l.name}</h4>
                    <span className="text-xs text-slate-400 block">{l.mobile || "No Contact Stored"}</span>
                    <span className="text-[11px] font-semibold text-slate-500 mt-1 block">
                      Total Borrowed: {money(l.total_borrowed)} | Total Repaid: <b className="text-emerald-600">{money(l.total_repaid)}</b>
                    </span>
                  </div>

                  <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-2">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Remaining Loan Due</span>
                      <span className="font-black text-rose-600 text-base">{money(l.balance_due)}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setLoanPaymentForm({
                            borrower_id: String(l.id),
                            amount: String(l.balance_due || ""),
                            payment_mode: "Cash",
                            partner_id: upfrontPartnerId || "",
                            notes: `Repayment to ${l.name}`,
                            tx_date: new Date().toISOString().split("T")[0]
                          });
                          setShowLoanPaymentModal(true);
                        }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg"
                      >
                        Repay
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEditLender(l)}
                        className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-lg"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteLender(l)}
                        className="px-2.5 py-1 bg-rose-50 text-rose-600 font-bold text-xs rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {lenders.length === 0 && (
                <div className="p-8 text-center text-slate-400 text-sm">
                  No active business loans recorded. Click <b>+ Add Loan Source</b> to add Gold Loans or outside finance.
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 9: EXPENSES */}
        {activeTab === "expenses" && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h2 className="text-lg font-black text-slate-900">Expenses & Cash Outflow</h2>
                <p className="text-xs text-slate-500">Record shop costs and manage master categories</p>
              </div>
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
                    notes: ""
                  });
                  setShowExpenseModal(true);
                }}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                + Add Expense
              </button>
            </div>

            <div className="space-y-3">
              {expenses.map((e) => {
                const partner = partners.find((p) => p.id == e.paid_by_id);
                return (
                  <div key={e.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-indigo-600">{e.category_name}</span>
                      <h4 className="font-bold text-sm text-slate-900">{e.title}</h4>
                      <p className="text-[11px] text-slate-400">
                        Paid by: {partner?.name || "N/A"} ({e.payment_mode}) on {e.expense_date}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-rose-600 text-sm">{money(e.amount)}</span>
                      <button onClick={() => handleEditExpense(e)} className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-lg">Edit</button>
                      <button onClick={() => handleDeleteExpense(e)} className="px-2.5 py-1 bg-rose-50 text-rose-600 font-bold text-xs rounded-lg">Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 10: EXCEL REPORT (WITH STOCK & CUSTOMER DUES FULLY RESTORED) */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-lg font-black text-slate-900">B Reddy Statement (Excel Sheet Format)</h2>
                  <p className="text-xs text-slate-500">Complete balance sheet. Zero stock batches are excluded.</p>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow"
                >
                  <Icon name="download" size={15} /> Download / Print PDF
                </button>
              </div>

              {/* SECTION 1: MASTER BALANCE SHEET TABLE */}
              <div className="overflow-x-auto border border-slate-300 rounded-xl">
                <table className="w-full text-left text-xs border-collapse font-mono">
                  <thead>
                    <tr className="bg-slate-900 text-white font-bold">
                      <th className="p-3 border border-slate-800">S.No</th>
                      <th className="p-3 border border-slate-800">వివరణ (Description)</th>
                      <th className="p-3 border border-slate-800 text-right">మొత్తం విలువ (Value ₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-amber-50/70 font-bold">
                      <td className="p-2.5 border border-slate-300 text-center">1</td>
                      <td className="p-2.5 border border-slate-300">అప్పులు (Debts & Supplier Purchase Dues)</td>
                      <td className="p-2.5 border border-slate-300 text-right text-rose-600">
                        {money(businessSummary.totalLoansPayable + businessSummary.totalPurchaseDues)}
                      </td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="p-2.5 border border-slate-300 text-center">2</td>
                      <td className="p-2.5 border border-slate-300">కస్టమర్ బ్యాలెన్స్ (Customer Dues)</td>
                      <td className="p-2.5 border border-slate-300 text-right text-slate-900">
                        {money(businessSummary.totalCustomerDues)}
                      </td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="p-2.5 border border-slate-300 text-center">3</td>
                      <td className="p-2.5 border border-slate-300">నిలువలు (Stock Valuation)</td>
                      <td className="p-2.5 border border-slate-300 text-right text-slate-900">
                        {money(businessSummary.stockValuation)}
                      </td>
                    </tr>
                    <tr className="bg-rose-50/70 font-bold">
                      <td className="p-2.5 border border-slate-300 text-center">4</td>
                      <td className="p-2.5 border border-slate-300">ఖర్చులు (Expenses & Outlays)</td>
                      <td className="p-2.5 border border-slate-300 text-right text-rose-600">
                        {money(businessSummary.totalExpenses)}
                      </td>
                    </tr>
                    <tr className="bg-emerald-100/80 font-black text-sm">
                      <td colSpan={2} className="p-3 border border-slate-300 text-right uppercase">
                        లాభం (NET BUSINESS PROFIT = 2 + 3 - 1 - 4)
                      </td>
                      <td className="p-3 border border-slate-300 text-right text-emerald-800">
                        {money(businessSummary.bReddyNetProfit)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* SECTION 2: AVAILABLE STOCK TABLE */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm text-slate-900">నిలువలు (Available Stock with Qty &gt; 0)</h3>
                  <span className="text-xs font-bold text-slate-600">
                    Total Valuation: {money(businessSummary.stockValuation)}
                  </span>
                </div>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse font-mono">
                    <thead className="bg-slate-100 text-slate-600 font-bold">
                      <tr>
                        <th className="p-2 border border-slate-200 text-center">S.No</th>
                        <th className="p-2 border border-slate-200">Stock Item</th>
                        <th className="p-2 border border-slate-200">Supplier</th>
                        <th className="p-2 border border-slate-200 text-center">Available Qty</th>
                        <th className="p-2 border border-slate-200 text-right">Cost Rate</th>
                        <th className="p-2 border border-slate-200 text-right">Selling Rate</th>
                        <th className="p-2 border border-slate-200 text-right">Total Valuation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {procurements
                        .filter((p) => Number(p.remaining_qty || 0) > 0)
                        .map((p, idx) => (
                          <tr key={p.id}>
                            <td className="p-2 border border-slate-200 text-center">{idx + 1}</td>
                            <td className="p-2 border border-slate-200 font-bold">{p.item_name}</td>
                            <td className="p-2 border border-slate-200 text-slate-500">{p.supplier_name}</td>
                            <td className="p-2 border border-slate-200 text-center font-bold text-indigo-600">{p.remaining_qty}</td>
                            <td className="p-2 border border-slate-200 text-right">{money(p.purchase_rate)}</td>
                            <td className="p-2 border border-slate-200 text-right">{money(p.selling_rate)}</td>
                            <td className="p-2 border border-slate-200 text-right font-bold text-slate-900">
                              {money(Number(p.remaining_qty || 0) * Number(p.purchase_rate || 0))}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION 3: CUSTOMER DUES LEDGER */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm text-slate-900">కస్టమర్ బ్యాలెన్స్ (Customer Dues Ledger)</h3>
                  <span className="text-xs font-bold text-rose-600">
                    Total Dues: {money(businessSummary.totalCustomerDues)}
                  </span>
                </div>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse font-mono">
                    <thead className="bg-slate-100 text-slate-600 font-bold">
                      <tr>
                        <th className="p-2 border border-slate-200 text-center">S.No</th>
                        <th className="p-2 border border-slate-200">Customer Name</th>
                        <th className="p-2 border border-slate-200">Mobile</th>
                        <th className="p-2 border border-slate-200 text-right">Outstanding Due</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers.map((c, idx) => (
                        <tr key={c.id}>
                          <td className="p-2 border border-slate-200 text-center">{idx + 1}</td>
                          <td className="p-2 border border-slate-200 font-bold">{c.name}</td>
                          <td className="p-2 border border-slate-200">{c.mobile || "N/A"}</td>
                          <td className="p-2 border border-slate-200 text-right font-bold text-rose-600">{money(c.old_due)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 11: PARTNER CAPITAL ACCOUNTS */}
        {activeTab === "partners" && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-slate-900">Operating Partner Capital Accounts</h2>
                <p className="text-xs text-slate-500">Track liquid cash and UPI holdings tied to partners</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingPartnerId(null);
                  setPartnerForm({ name: "", opening_cash: "", opening_upi: "" });
                  setShowPartnerModal(true);
                }}
                className="px-3.5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl"
              >
                + Add Partner
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {partnerAccounts.map((p) => (
                <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-black text-base text-slate-900">{p.name}</h4>
                    <div className="flex gap-1.5">
                      <button onClick={() => handleEditPartner(p)} className="px-2 py-1 bg-white border border-slate-300 text-xs font-bold rounded-lg">Edit</button>
                      <button onClick={() => handleDeletePartner(p)} className="px-2 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg">Delete</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t">
                    <div>
                      <span className="text-slate-400 block">Cash</span>
                      <b className="text-emerald-600">{money(p.netCash)}</b>
                    </div>
                    <div>
                      <span className="text-slate-400 block">UPI</span>
                      <b className="text-indigo-600">{money(p.netUpi)}</b>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL: ADD / EDIT LENDER */}
      {showLenderModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-3">
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
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-3">
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

              <input
                type="number"
                required
                placeholder="Repayment Amount (₹)"
                className="w-full p-2.5 border rounded-xl text-sm font-bold text-rose-600"
                value={loanPaymentForm.amount}
                onChange={(e) => setLoanPaymentForm({ ...loanPaymentForm, amount: e.target.value })}
              />

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

              <input
                type="text"
                placeholder="Notes / Cheque / Voucher Ref (Optional)"
                className="w-full p-2 border rounded-xl text-xs"
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
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-3">
            <h3 className="font-bold text-base text-slate-900">{editingPaymentId ? "Edit Supplier Payment" : "Pay Supplier Purchase Bill"}</h3>
            <form onSubmit={savePurchasePayment} className="space-y-3">
              <select
                required
                className="w-full p-2.5 border rounded-xl text-xs font-semibold"
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
                <option value="">-- Choose Purchase Bill --</option>
                {procurements
                  .filter((p) => editingPaymentId || Number(p.total_amount || 0) > Number(p.p1_amount || 0))
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.item_name} ({p.supplier_name}) — Total: {money(p.total_amount)}
                    </option>
                  ))}
              </select>

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

              <input
                type="text"
                placeholder="Reference No / Voucher (Optional)"
                className="w-full p-2 border rounded-xl text-xs"
                value={payPurchaseForm.reference_no}
                onChange={(e) => setPayPurchaseForm({ ...payPurchaseForm, reference_no: e.target.value })}
              />

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
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-3">
            <h3 className="font-bold text-base text-slate-900">{editingCollectionId ? "Edit Collection Receipt" : "Collect Customer Due"}</h3>
            <form onSubmit={saveInvoiceCollection} className="space-y-3">
              <select
                required
                className="w-full p-2.5 border rounded-xl text-xs font-semibold"
                value={collectForm.customer_id}
                onChange={(e) => {
                  const custId = e.target.value;
                  const firstInv = invoices.find((i) => i.customer_id == custId && Number(i.balance_due || 0) > 0);
                  setCollectForm({
                    ...collectForm,
                    customer_id: custId,
                    invoice_id: firstInv ? String(firstInv.id) : "",
                    amount: firstInv ? String(firstInv.balance_due) : ""
                  });
                }}
              >
                <option value="">-- Choose Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} (Total Due: {money(c.old_due)})</option>
                ))}
              </select>

              {collectForm.customer_id && (
                <select
                  className="w-full p-2.5 border rounded-xl text-xs font-semibold"
                  value={collectForm.invoice_id}
                  onChange={(e) => {
                    const inv = invoices.find((i) => i.id == e.target.value);
                    setCollectForm({
                      ...collectForm,
                      invoice_id: e.target.value,
                      amount: inv ? String(inv.balance_due) : collectForm.amount
                    });
                  }}
                >
                  <option value="">-- Select Specific Invoice (Optional) --</option>
                  {invoices
                    .filter((i) => i.customer_id == collectForm.customer_id && (editingCollectionId || Number(i.balance_due || 0) > 0))
                    .map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.invoice_number || `INV-${i.id}`} — Due: {money(i.balance_due)}
                      </option>
                    ))}
                </select>
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
                <button type="submit" className="flex-1 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">Save Receipt</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PURCHASES */}
      {showProcureModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-3">
            <h3 className="font-bold text-base text-slate-900">
              {editingProcureId ? "Edit Purchase" : "Record Purchase & Stock (కొనుగోళ్లు)"}
            </h3>
            <form onSubmit={saveProcurement} className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Supplier / Vendor *</label>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingSupplierId(null);
                      setSupplierForm({ name: "", mobile: "", old_due: "" });
                      setShowSupplierModal(true);
                    }}
                    className="text-[11px] font-bold text-indigo-600 hover:underline"
                  >
                    + Add New Supplier
                  </button>
                </div>
                <select
                  required
                  className="w-full p-2.5 border rounded-xl text-sm font-semibold bg-white"
                  value={procureForm.supplier_name}
                  onChange={(e) => setProcureForm({ ...procureForm, supplier_name: e.target.value })}
                >
                  <option value="">-- Choose Supplier --</option>
                  {uniqueSupplierSuggestions.map((s, idx) => (
                    <option key={idx} value={s}>{s}</option>
                  ))}
                  <option value="Opening Stock">Opening Stock</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">Item Name *</label>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingItemId(null);
                      setItemForm({ name: "", purchase_rate: "", selling_rate: "" });
                      setShowItemModal(true);
                    }}
                    className="text-[11px] font-bold text-indigo-600 hover:underline"
                  >
                    + Add New Item
                  </button>
                </div>
                <select
                  required
                  className="w-full p-2.5 border rounded-xl text-sm font-bold bg-white"
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
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Qty</label>
                  <input
                    type="number"
                    required
                    placeholder="Qty"
                    className="w-full p-2.5 border rounded-xl text-xs font-bold"
                    value={procureForm.procured_qty}
                    onChange={(e) => setProcureForm({ ...procureForm, procured_qty: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Cost Rate</label>
                  <input
                    type="number"
                    required
                    placeholder="Cost Rate"
                    className="w-full p-2.5 border rounded-xl text-xs font-bold"
                    value={procureForm.purchase_rate}
                    onChange={(e) => setProcureForm({ ...procureForm, purchase_rate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Selling Rate</label>
                  <input
                    type="number"
                    placeholder="Selling Rate"
                    className="w-full p-2.5 border rounded-xl text-xs font-bold text-indigo-600"
                    value={procureForm.selling_rate}
                    onChange={(e) => setProcureForm({ ...procureForm, selling_rate: e.target.value })}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Total Purchase Cost:</span>
                  <span>{money(Number(procureForm.procured_qty || 0) * Number(procureForm.purchase_rate || 0))}</span>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Paid Now by Partner (Leave 0 if full Due)</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-emerald-600"
                    value={procureForm.paid_now}
                    onChange={(e) => setProcureForm({ ...procureForm, paid_now: e.target.value })}
                  />
                </div>

                {Number(procureForm.paid_now || 0) > 0 && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <select
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                      value={procureForm.p1_id}
                      onChange={(e) => setProcureForm({ ...procureForm, p1_id: e.target.value })}
                    >
                      <option value="">-- Funding Partner --</option>
                      {partners.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <select
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                      value={procureForm.p1_mode}
                      onChange={(e) => setProcureForm({ ...procureForm, p1_mode: e.target.value })}
                    >
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={() => setShowProcureModal(false)} className="flex-1 py-2 border rounded-xl text-xs font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs">Save Purchase</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT ITEM MASTER */}
      {showItemModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-3">
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
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-3">
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
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-3">
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
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-3">
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
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-3">
            <h3 className="font-bold text-base text-slate-900">{editingExpenseId ? "Edit Shop Expense" : "Record Shop Expense"}</h3>
            <form onSubmit={saveExpense} className="space-y-3">
              <select
                required
                className="w-full p-2.5 border rounded-xl text-xs font-semibold"
                value={expenseForm.category_id}
                onChange={(e) => setExpenseForm({ ...expenseForm, category_id: e.target.value })}
              >
                <option value="">-- Choose Category --</option>
                {expenseCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
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
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4">
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
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW / PRINT INVOICE */}
      {selectedViewInvoice && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-start border-b pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 block">Retail Invoice Bill</span>
                <h3 className="text-lg font-black text-slate-900">{selectedViewInvoice.invoice_number || `INV-${selectedViewInvoice.id}`}</h3>
                <p className="text-xs text-slate-500">Date: {selectedViewInvoice.invoice_date || selectedViewInvoice.created_at?.slice(0, 10)}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedViewInvoice(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Customer / Recipient</span>
                <b className="text-slate-900 text-sm">{selectedViewInvoice.customer_name}</b>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Bill Status</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  Number(selectedViewInvoice.balance_due || 0) <= 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                }`}>
                  {Number(selectedViewInvoice.balance_due || 0) <= 0 ? "Collected" : "Due"}
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Itemized Breakdown</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b">
                    <tr>
                      <th className="p-2.5">Item</th>
                      <th className="p-2.5 text-center">Qty</th>
                      <th className="p-2.5 text-right">Rate</th>
                      <th className="p-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {Array.isArray(selectedViewInvoice.items) && selectedViewInvoice.items.length > 0 ? (
                      selectedViewInvoice.items.map((it, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-bold text-slate-800">{it.item_name}</td>
                          <td className="p-2.5 text-center font-semibold">{it.qty}</td>
                          <td className="p-2.5 text-right text-slate-600">{money(it.rate)}</td>
                          <td className="p-2.5 text-right font-black text-slate-900">{money(it.total)}</td>
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

            <div className="bg-slate-50 p-3.5 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between font-bold text-slate-600">
                <span>Subtotal:</span>
                <span>{money(selectedViewInvoice.total_amount)}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-600">
                <span>Upfront Paid:</span>
                <span>{money(selectedViewInvoice.upfront_paid)}</span>
              </div>
              <div className="flex justify-between font-black text-sm text-slate-900 border-t pt-1.5">
                <span>Balance Due:</span>
                <span className="text-rose-600">{money(selectedViewInvoice.balance_due)}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleShareWhatsApp(selectedViewInvoice)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <Icon name="share" size={15} /> WhatsApp Bill
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
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
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 space-y-4 max-h-[85vh] flex flex-col shadow-2xl">
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
                <Icon name="plus" size={13} /> + Record New Purchase / Stock
              </button>
            </div>

            {/* Item List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100 max-h-96">
              {(() => {
                let list = procurements;
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
    </div>
  );
}
