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
      <path d="M14 2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2V4a2 2 0 00-2-2zM8 7h8M8 11h8M8 15h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
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

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://yfptlgypcmykkwxnzgcw.supabase.co";
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_C2CTElJlxJ5rktW2YBuAaA_lKWcrQk5";

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
  const [borrowers, setBorrowers] = useState([]);
  const [borrowerTx, setBorrowerTx] = useState([]);
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
  const [showBorrowerModal, setShowBorrowerModal] = useState(false);
  const [showBorrowerTxModal, setShowBorrowerTxModal] = useState(false);

  // Stock Picker Modal
  const [pickerActiveIndex, setPickerActiveIndex] = useState(null);
  const [stockSearchQuery, setStockSearchQuery] = useState("");

  // Audit Inspection State
  const [selectedAuditTx, setSelectedAuditTx] = useState(null);
  const [auditFilterType, setAuditFilterType] = useState("all");
  const [auditSearchQuery, setAuditSearchQuery] = useState("");

  // Customer Form
  const [editingCustId, setEditingCustId] = useState(null);
  const [custForm, setCustForm] = useState({ name: "", mobile: "", old_due: "" });

  // Supplier Form
  const [editingSupplierId, setEditingSupplierId] = useState(null);
  const [supplierForm, setSupplierForm] = useState({ name: "", mobile: "", old_due: "" });

  // Item Form
  const [editingItemId, setEditingItemId] = useState(null);
  const [itemForm, setItemForm] = useState({ name: "", purchase_rate: "", selling_rate: "" });

  // Partner Form
  const [partnerForm, setPartnerForm] = useState({ name: "", opening_cash: "", opening_upi: "" });

  // Purchase Form
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

  // Pay Supplier Purchase Bill Form
  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const [payPurchaseForm, setPayPurchaseForm] = useState({
    purchase_id: "",
    amount: "",
    partner_id: "",
    payment_mode: "Cash",
    reference_no: "",
    notes: ""
  });

  // Expense Form
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

  // Borrower Form
  const [editingBorrowerId, setEditingBorrowerId] = useState(null);
  const [borrowerForm, setBorrowerForm] = useState({ name: "", mobile: "", initial_due: "" });
  const [borrowerTxForm, setBorrowerTxForm] = useState({
    borrower_id: "",
    tx_type: "Given",
    amount: "",
    payment_mode: "Cash",
    partner_id: "",
    notes: "",
    tx_date: new Date().toISOString().split("T")[0]
  });

  // Due Collection Form
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
        setPartners(p.data);
        if (p.data.length > 0 && !upfrontPartnerId) setUpfrontPartnerId(p.data[0].id);
      }
      if (pr.data) setProcurements(pr.data);
      if (c.data) setCustomers(c.data);
      if (inv.data) setInvoices(inv.data);
      if (col.data) setCollections(col.data);
      if (exp.data) setExpenses(exp.data);
      if (cats.data) setExpenseCategories(cats.data);
      if (b.data) setBorrowers(b.data);
      if (bTx.data) setBorrowerTx(bTx.data);
      if (sup.data) setSuppliers(sup.data);
      if (itemsRes.data) setMasterItems(itemsRes.data);
    } catch (e) {
      console.error(e);
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

      const bGivenCash = borrowerTx
        .filter((b) => b.partner_id == pid && b.tx_type === "Given" && b.payment_mode === "Cash")
        .reduce((s, b) => s + Number(b.amount || 0), 0);
      const bGivenUpi = borrowerTx
        .filter((b) => b.partner_id == pid && b.tx_type === "Given" && b.payment_mode === "UPI")
        .reduce((s, b) => s + Number(b.amount || 0), 0);

      const bRecCash = borrowerTx
        .filter((b) => b.partner_id == pid && b.tx_type === "Received" && b.payment_mode === "Cash")
        .reduce((s, b) => s + Number(b.amount || 0), 0);
      const bRecUpi = borrowerTx
        .filter((b) => b.partner_id == pid && b.tx_type === "Received" && b.payment_mode === "UPI")
        .reduce((s, b) => s + Number(b.amount || 0), 0);

      const netCash = initCash + saleCash + colCash + bRecCash - procCash - expCash - bGivenCash;
      const netUpi = initUpi + saleUpi + colUpi + bRecUpi - procUpi - expUpi - bGivenUpi;

      return {
        ...partner,
        initCash,
        initUpi,
        netCash,
        netUpi,
        totalBalance: netCash + netUpi
      };
    });
  }, [partners, invoices, collections, procurements, expenses, borrowerTx]);

  const businessSummary = useMemo(() => {
    const totalSales = invoices.reduce((s, i) => s + Number(i.total_amount || 0), 0);
    const totalCustomerDues = customers.reduce((s, c) => s + Number(c.old_due || 0), 0);
    const totalDebts = borrowers.reduce((s, b) => s + Number(b.balance_due || 0), 0);
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

    const bReddyNetProfit = totalCustomerDues + stockValuation - (totalDebts + totalPurchaseDues + totalExpenses);
    const totalCash = partnerAccounts.reduce((s, p) => s + p.netCash, 0);
    const totalUpi = partnerAccounts.reduce((s, p) => s + p.netUpi, 0);

    return { totalSales, totalCustomerDues, totalDebts, totalPurchaseDues, stockValuation, totalExpenses, bReddyNetProfit, totalCash, totalUpi };
  }, [invoices, customers, borrowers, procurements, expenses, partnerAccounts]);

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
      return alert("This invoice is fully Collected and locked from edits. Delete or edit the collection receipts in Payments & Collections first.");
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

  // DUE COLLECTIONS
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
    if (!confirm(`Delete collection receipt of ₹${col.amount}? This will restore the customer and invoice dues, unlocking the invoice for edit.`)) return;

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

        alert(`Collection receipt recorded (${refNo})!`);
      }

      setShowCollectModal(false);
      setEditingCollectionId(null);
      refreshData();
    } catch (err) {
      alert("Error saving collection: " + err.message);
    }
  };

  // BILL-WISE PURCHASE PAYMENT
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
    if (!confirm(`Void payment for purchase bill "${p.item_name}"? This restores the supplier due to full.`)) return;

    try {
      await db.from("procurements").update({
        p1_amount: 0,
        p1_id: null
      }).eq("id", p.id);

      alert("Purchase payment voided! Bill restored to unpaid.");
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

      alert(`Purchase bill payment recorded! Remaining due: ${money(currentTotal - amt)}`);
      setShowPayPurchaseModal(false);
      setEditingPaymentId(null);
      setPayPurchaseForm({
        purchase_id: "",
        amount: "",
        partner_id: upfrontPartnerId || "",
        payment_mode: "Cash",
        reference_no: "",
        notes: ""
      });
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
      const { error } = await db.from("customers").delete().eq("id", c.id);
      if (error) throw error;
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
      const { error } = await db.from("suppliers").delete().eq("id", s.id);
      if (error) throw error;
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
    if (!confirm(`Delete item "${item.name}" from items master?`)) return;
    try {
      const { error } = await db.from("items").delete().eq("id", item.id);
      if (error) throw error;
      alert("Item deleted from master!");
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

  // EXPENSE HANDLERS
  const handleEditExpense = (exp) => {
    setEditingExpenseId(exp.id);
    setExpenseForm({
      title: exp.title || "",
      category_id: exp.category_id ? String(exp.category_id) : "",
      amount: exp.amount || "",
      payment_mode: exp.payment_mode || "Cash",
      paid_by_id: exp.paid_by_id ? String(exp.paid_by_id) : "",
      expense_date: exp.expense_date || new Date().toISOString().split("T")[0],
      notes: exp.notes || ""
    });
    setShowExpenseModal(true);
  };

  const handleDeleteExpense = async (exp) => {
    if (!confirm(`Delete expense "${exp.title}" of ₹${exp.amount}?`)) return;
    try {
      await db.from("expenses").delete().eq("id", exp.id);
      alert("Expense deleted!");
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  const saveExpense = async (e) => {
    e.preventDefault();
    const amt = Number(expenseForm.amount || 0);
    if (amt <= 0) return alert("Enter a valid amount");
    if (!expenseForm.paid_by_id) return alert("Select which partner paid");

    const cat = expenseCategories.find((c) => c.id == expenseForm.category_id);
    const payload = {
      title: expenseForm.title.trim(),
      category_id: expenseForm.category_id ? Number(expenseForm.category_id) : null,
      category_name: cat ? cat.name : "General",
      amount: amt,
      payment_mode: expenseForm.payment_mode,
      paid_by_id: Number(expenseForm.paid_by_id),
      expense_date: expenseForm.expense_date,
      notes: expenseForm.notes.trim()
    };

    try {
      if (editingExpenseId) {
        await db.from("expenses").update(payload).eq("id", editingExpenseId);
        alert("Expense updated!");
      } else {
        await db.from("expenses").insert([payload]);
        alert("Expense recorded!");
      }
      setShowExpenseModal(false);
      setEditingExpenseId(null);
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  const saveCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await db.from("expense_categories").insert([{ name: newCatName.trim() }]);
      setNewCatName("");
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  // BORROWER HANDLERS
  const handleEditBorrower = (b) => {
    setEditingBorrowerId(b.id);
    setBorrowerForm({ name: b.name, mobile: b.mobile || "", initial_due: b.balance_due || b.total_borrowed || "" });
    setShowBorrowerModal(true);
  };

  const handleDeleteBorrower = async (b) => {
    if (!confirm(`Delete borrower "${b.name}"?`)) return;
    try {
      await db.from("borrower_transactions").delete().eq("borrower_id", b.id);
      await db.from("borrowers").delete().eq("id", b.id);
      alert("Borrower deleted!");
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  const saveBorrower = async (e) => {
    e.preventDefault();
    if (!borrowerForm.name.trim()) return alert("Borrower name is required");
    const initialDue = Number(borrowerForm.initial_due || 0);

    try {
      if (editingBorrowerId) {
        await db.from("borrowers").update({
          name: borrowerForm.name.trim(),
          mobile: borrowerForm.mobile.trim(),
          balance_due: initialDue
        }).eq("id", editingBorrowerId);
        alert("Borrower updated!");
      } else {
        await db.from("borrowers").insert([{
          name: borrowerForm.name.trim(),
          mobile: borrowerForm.mobile.trim(),
          total_borrowed: initialDue,
          balance_due: initialDue
        }]);
        alert("Borrower added!");
      }
      setShowBorrowerModal(false);
      setEditingBorrowerId(null);
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  const saveBorrowerTransaction = async (e) => {
    e.preventDefault();
    const amt = Number(borrowerTxForm.amount || 0);
    if (amt <= 0) return alert("Enter valid loan amount");

    try {
      await db.from("borrower_transactions").insert([{
        borrower_id: Number(borrowerTxForm.borrower_id),
        tx_type: borrowerTxForm.tx_type,
        amount: amt,
        payment_mode: borrowerTxForm.payment_mode,
        partner_id: Number(borrowerTxForm.partner_id),
        notes: borrowerTxForm.notes.trim(),
        tx_date: borrowerTxForm.tx_date
      }]);

      const targetB = borrowers.find((b) => b.id == borrowerTxForm.borrower_id);
      if (targetB) {
        let newBorrowed = Number(targetB.total_borrowed || 0);
        let newRepaid = Number(targetB.total_repaid || 0);

        if (borrowerTxForm.tx_type === "Given") newBorrowed += amt;
        else newRepaid += amt;

        await db.from("borrowers").update({
          total_borrowed: newBorrowed,
          total_repaid: newRepaid,
          balance_due: Math.max(0, newBorrowed - newRepaid)
        }).eq("id", targetB.id);
      }

      setShowBorrowerTxModal(false);
      refreshData();
      alert("Loan transaction saved!");
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
      return alert("This purchase bill is fully Paid and locked from edits. Void the payment in Payments & Collections first.");
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
        alert(`Purchase saved! Supplier Due: ${money(total - paidNowNum)}`);
      }
      setShowProcureModal(false);
      setEditingProcureId(null);
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

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
          <div className="p-6 border-b border-slate-800 hidden md:flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-600/30">
              B
            </div>
            <div>
              <h1 className="font-black text-white text-base tracking-wide">B REDDY SALES</h1>
              <p className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold">Wholesale & Retail</p>
            </div>
          </div>

          <nav className="p-3 space-y-1 mt-2">
            <button
              onClick={() => { setActiveTab("sale"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "sale" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              <Icon name="cart" size={18} /> Point of Sale (Billing)
            </button>

            <button
              onClick={() => { setActiveTab("summary"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "summary" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              <Icon name="dashboard" size={18} /> Business Summary
            </button>

            <button
              onClick={() => { setActiveTab("history_audit"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "history_audit" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              <Icon name="history" size={18} /> History & Audit Ledger
            </button>

            <button
              onClick={() => { setActiveTab("payments_collections"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "payments_collections" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              <Icon name="receipt" size={18} /> Payments & Collections
            </button>

            <button
              onClick={() => { setActiveTab("invoices"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "invoices" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              <Icon name="invoice" size={18} /> Invoices Directory
            </button>

            <button
              onClick={() => { setActiveTab("procurement"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "procurement" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              <Icon name="package" size={18} /> Purchases & Stock
            </button>

            <button
              onClick={() => { setActiveTab("masters"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "masters" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              <Icon name="layers" size={18} /> Master Management
            </button>

            <button
              onClick={() => { setActiveTab("borrowers"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "borrowers" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              <Icon name="handcoins" size={18} /> Borrowers (Loans)
            </button>

            <button
              onClick={() => { setActiveTab("expenses"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "expenses" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              <Icon name="creditcard" size={18} /> Expenses & Cash Out
            </button>

            <button
              onClick={() => { setActiveTab("reports"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "reports" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              <Icon name="filetext" size={18} /> Excel Report (PDF)
            </button>

            <button
              onClick={() => { setActiveTab("partners"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "partners" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              <Icon name="wallet" size={18} /> Partner Accounts
            </button>
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

      {/* MAIN VIEW */}
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

        {/* VIEW 2: BUSINESS SUMMARY */}
        {activeTab === "summary" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-black text-slate-900">Business Snapshot</h2>
              <p className="text-xs text-slate-500">Live operational ledger across partners, loans, and inventory</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Total Sales Invoiced</p>
                <h3 className="text-lg sm:text-2xl font-black text-slate-900 mt-1">{money(businessSummary.totalSales)}</h3>
              </div>
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Customer Dues (కస్టమర్ బ్యాలెన్స్)</p>
                <h3 className="text-lg sm:text-2xl font-black text-rose-600 mt-1">{money(businessSummary.totalCustomerDues)}</h3>
              </div>
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Debts & Purchase Dues (అప్పులు)</p>
                <h3 className="text-lg sm:text-2xl font-black text-amber-600 mt-1">{money(businessSummary.totalDebts + businessSummary.totalPurchaseDues)}</h3>
              </div>
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Net Profit (లాభం 2+3-1-4)</p>
                <h3 className="text-lg sm:text-2xl font-black text-emerald-600 mt-1">
                  {money(businessSummary.bReddyNetProfit)}
                </h3>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-base text-slate-900 mb-4">Partner Cash / UPI In-Hand</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {partnerAccounts.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-black text-base text-slate-900">{p.name}</h4>
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg">
                        Total: {money(p.totalBalance)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="text-slate-400 text-[11px]">Physical Cash</span>
                        <p className="font-black text-sm text-emerald-600 mt-0.5">{money(p.netCash)}</p>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="text-slate-400 text-[11px]">UPI / Bank</span>
                        <p className="font-black text-sm text-indigo-600 mt-0.5">{money(p.netUpi)}</p>
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
                  <p className="text-xs text-slate-500">Select any transaction row to inspect its full itemized breakdown and settlement history.</p>
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
                    Sales Only
                  </button>
                  <button
                    onClick={() => setAuditFilterType("purchase")}
                    className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg ${auditFilterType === "purchase" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600"}`}
                  >
                    Purchases Only
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
                      <th className="p-3">Party (Customer / Supplier)</th>
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
                    {combinedAuditTransactions.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-6 text-center text-slate-400">
                          No transactions found matching your filter criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: UNIFIED MASTERS HUB */}
        {activeTab === "masters" && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-black text-slate-900">Master Creation Hub</h2>
                <p className="text-xs text-slate-500">Configure master records for Customers, Suppliers, Items, Borrowers, Partners, and Expense Categories.</p>
              </div>
              <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setMastersSubTab("customers")}
                  className={`px-3 py-1.5 rounded-lg ${mastersSubTab === "customers" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600"}`}
                >
                  Customers ({customers.length})
                </button>
                <button
                  onClick={() => setMastersSubTab("suppliers")}
                  className={`px-3 py-1.5 rounded-lg ${mastersSubTab === "suppliers" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600"}`}
                >
                  Suppliers ({suppliers.length})
                </button>
                <button
                  onClick={() => setMastersSubTab("items")}
                  className={`px-3 py-1.5 rounded-lg ${mastersSubTab === "items" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600"}`}
                >
                  Items / Products ({uniqueItemSuggestions.length})
                </button>
                <button
                  onClick={() => setMastersSubTab("borrowers")}
                  className={`px-3 py-1.5 rounded-lg ${mastersSubTab === "borrowers" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600"}`}
                >
                  Borrowers ({borrowers.length})
                </button>
                <button
                  onClick={() => setMastersSubTab("partners")}
                  className={`px-3 py-1.5 rounded-lg ${mastersSubTab === "partners" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600"}`}
                >
                  Partners ({partners.length})
                </button>
                <button
                  onClick={() => setMastersSubTab("categories")}
                  className={`px-3 py-1.5 rounded-lg ${mastersSubTab === "categories" ? "bg-white text-indigo-600 shadow-xs" : "text-slate-600"}`}
                >
                  Categories ({expenseCategories.length})
                </button>
              </div>
            </div>

            {/* Masters Sub-Tab 1: Customers */}
            {mastersSubTab === "customers" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-900">Customer Records</h3>
                  <button
                    onClick={() => {
                      setEditingCustId(null);
                      setCustForm({ name: "", mobile: "", old_due: "" });
                      setShowCustModal(true);
                    }}
                    className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-xl"
                  >
                    + Add Customer
                  </button>
                </div>
                <div className="space-y-2">
                  {customers.map((c) => (
                    <div key={c.id} className="p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{c.name}</h4>
                        <span className="text-xs text-slate-400">{c.mobile || "No Mobile"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-rose-600 text-sm">{money(c.old_due)}</span>
                        <button onClick={() => handleEditCustomer(c)} className="px-2 py-1 bg-white border border-slate-300 text-xs font-bold rounded-lg">Edit</button>
                        <button onClick={() => handleDeleteCustomer(c)} className="px-2 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Masters Sub-Tab 2: Suppliers */}
            {mastersSubTab === "suppliers" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-900">Supplier / Vendor Records</h3>
                  <button
                    onClick={() => {
                      setEditingSupplierId(null);
                      setSupplierForm({ name: "", mobile: "", old_due: "" });
                      setShowSupplierModal(true);
                    }}
                    className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-xl"
                  >
                    + Add Supplier
                  </button>
                </div>
                <div className="space-y-2">
                  {suppliers.map((s) => (
                    <div key={s.id} className="p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{s.name}</h4>
                        <span className="text-xs text-slate-400">{s.mobile || "No Mobile"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-amber-600 text-sm">{money(s.old_due)}</span>
                        <button onClick={() => handleEditSupplier(s)} className="px-2 py-1 bg-white border border-slate-300 text-xs font-bold rounded-lg">Edit</button>
                        <button onClick={() => handleDeleteSupplier(s)} className="px-2 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg">Delete</button>
                      </div>
                    </div>
                  ))}
                  {suppliers.length === 0 && (
                    <div className="p-4 text-center text-slate-400 text-xs">No suppliers registered yet. Click + Add Supplier above.</div>
                  )}
                </div>
              </div>
            )}

            {/* Masters Sub-Tab 3: Items / Products */}
            {mastersSubTab === "items" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">Items & Product Master</h3>
                    <p className="text-xs text-slate-400">Pre-saved products with standard cost and selling prices</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingItemId(null);
                      setItemForm({ name: "", purchase_rate: "", selling_rate: "" });
                      setShowItemModal(true);
                    }}
                    className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-xl"
                  >
                    + Add Item Master
                  </button>
                </div>
                <div className="space-y-2">
                  {uniqueItemSuggestions.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-slate-200 flex justify-between items-center bg-slate-50/50">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                        <span className="text-xs text-slate-500">
                          Cost: {money(item.purchase_rate)} | Selling: {money(item.selling_rate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
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
                          className="px-2.5 py-1 bg-white border border-slate-300 text-xs font-bold rounded-lg"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Masters Sub-Tab 4: Borrowers */}
            {mastersSubTab === "borrowers" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-900">Loan Borrowers Master</h3>
                  <button
                    onClick={() => {
                      setEditingBorrowerId(null);
                      setBorrowerForm({ name: "", mobile: "", initial_due: "" });
                      setShowBorrowerModal(true);
                    }}
                    className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-xl"
                  >
                    + Add Borrower
                  </button>
                </div>
                <div className="space-y-2">
                  {borrowers.map((b) => (
                    <div key={b.id} className="p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{b.name}</h4>
                        <span className="text-xs text-slate-400">{b.mobile || "No Mobile"}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-rose-600 text-sm">{money(b.balance_due)}</span>
                        <button onClick={() => handleEditBorrower(b)} className="px-2 py-1 bg-white border border-slate-300 text-xs font-bold rounded-lg">Edit</button>
                        <button onClick={() => handleDeleteBorrower(b)} className="px-2 py-1 bg-rose-50 text-rose-600 text-xs font-bold rounded-lg">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Masters Sub-Tab 5: Partners */}
            {mastersSubTab === "partners" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-900">Operating Partners Master</h3>
                  <button
                    onClick={() => setShowPartnerModal(true)}
                    className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-xl"
                  >
                    + Add Partner
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {partners.map((p) => (
                    <div key={p.id} className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                      <h4 className="font-black text-slate-900">{p.name}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Opening Cash: {money(p.opening_cash)} | Opening UPI: {money(p.opening_upi)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Masters Sub-Tab 6: Categories */}
            {mastersSubTab === "categories" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm text-slate-900">Expense Categories Master</h3>
                  <button
                    onClick={() => setShowCategoryModal(true)}
                    className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-xl"
                  >
                    + Add Category
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {expenseCategories.map((c) => (
                    <div key={c.id} className="p-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50">
                      {c.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: INVOICES DIRECTORY */}
        {activeTab === "invoices" && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Invoices Directory</h2>
              <p className="text-xs text-slate-500">Track invoices. Fully collected invoices are locked. Deleting invoice removes linked collections.</p>
            </div>

            <div className="space-y-3">
              {invoices.map((inv) => {
                const isCollected = inv.status === "Collected" || Number(inv.balance_due || 0) <= 0;

                return (
                  <div key={inv.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-indigo-600 uppercase">{inv.invoice_number || `INV-${inv.id}`}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            isCollected ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                          }`}>
                            {isCollected ? "Collected" : inv.status || "Due"}
                          </span>
                        </div>
                        <h4 className="font-black text-sm text-slate-900 mt-0.5">{inv.customer_name}</h4>
                        <span className="text-[11px] text-slate-400">{inv.invoice_date || inv.created_at?.slice(0, 10)}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-400 block font-bold">Total: {money(inv.total_amount)}</span>
                        <span className="font-black text-xs text-rose-600">Due: {money(inv.balance_due)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-slate-200 justify-end items-center">
                      {!isCollected && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCollectionId(null);
                            setCollectForm({
                              customer_id: String(inv.customer_id),
                              invoice_id: String(inv.id),
                              amount: String(inv.balance_due || ""),
                              payment_mode: "Cash",
                              receiver_id: upfrontPartnerId,
                              reference_no: "",
                              notes: `Payment for ${inv.invoice_number || `INV-${inv.id}`}`
                            });
                            setShowCollectModal(true);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1"
                        >
                          <Icon name="rupee" size={13} /> Collect Due
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={isCollected}
                        onClick={() => handleEditInvoice(inv)}
                        className={`px-3 py-1.5 font-bold text-xs rounded-lg flex items-center gap-1 border ${
                          isCollected
                            ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                            : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                        }`}
                        title={isCollected ? "Locked (Fully Collected)" : "Edit Invoice"}
                      >
                        <Icon name={isCollected ? "lock" : "edit"} size={13} /> {isCollected ? "Locked" : "Edit"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteInvoice(inv)}
                        className="px-3 py-1.5 bg-rose-50 text-rose-600 font-bold text-xs rounded-lg flex items-center gap-1"
                      >
                        <Icon name="trash" size={13} /> Delete
                      </button>

                      <button
                        type="button"
                        onClick={() => handleShareWhatsApp(inv)}
                        className="px-3 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-lg flex items-center gap-1"
                      >
                        <Icon name="share" size={13} /> WhatsApp
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 6: PURCHASES & STOCK */}
        {activeTab === "procurement" && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h2 className="text-lg font-black text-slate-900">Purchases & Stock (కొనుగోళ్లు)</h2>
                <p className="text-xs text-slate-500">Supplier purchases. Fully paid bills are locked from edit.</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
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
                      p1_id: partners[0]?.id ? String(partners[0].id) : "",
                      p1_mode: "Cash"
                    });
                    setShowProcureModal(true);
                  }}
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl"
                >
                  + Add Purchase
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {procurements.map((p) => {
                const total = Number(p.total_amount || 0);
                const paid = Number(p.p1_amount || 0);
                const due = Math.max(0, total - paid);
                const isPaid = paid >= total && total > 0;
                const partner = partners.find((pt) => pt.id == p.p1_id);

                return (
                  <div key={p.id} className="p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">{p.supplier_name}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          isPaid ? "bg-emerald-100 text-emerald-800" : paid > 0 ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {isPaid ? "Paid" : paid > 0 ? "Partial" : "Due"}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 mt-0.5">{p.item_name}</h4>
                      <span className="text-xs text-slate-500">
                        Cost: {money(p.purchase_rate)} | Sell: {money(p.selling_rate)} | Available Stock: <b>{p.remaining_qty}</b>
                      </span>
                      <div className="text-xs font-semibold text-slate-600 mt-1">
                        Total: {money(total)} | Paid: {money(paid)} by {partner?.name || "Partner"} | <span className="text-rose-600 font-bold">Due: {money(due)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {due > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPaymentId(null);
                            setPayPurchaseForm({
                              purchase_id: String(p.id),
                              amount: String(due),
                              partner_id: upfrontPartnerId,
                              payment_mode: "Cash",
                              reference_no: "",
                              notes: `Payment for ${p.item_name}`
                            });
                            setShowPayPurchaseModal(true);
                          }}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg"
                        >
                          Pay Bill
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={isPaid}
                        onClick={() => handleEditProcurement(p)}
                        className={`px-2.5 py-1 font-bold text-xs rounded-lg flex items-center gap-1 border ${
                          isPaid
                            ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                            : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
                        }`}
                        title={isPaid ? "Locked (Fully Paid)" : "Edit Purchase"}
                      >
                        <Icon name={isPaid ? "lock" : "edit"} size={13} /> {isPaid ? "Locked" : "Edit"}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteProcurement(p)}
                        className="px-2.5 py-1 bg-rose-50 text-rose-600 font-bold text-xs rounded-lg flex items-center gap-1"
                      >
                        <Icon name="trash" size={13} /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 7: PAYMENTS & COLLECTIONS */}
        {activeTab === "payments_collections" && (
          <div className="space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Payments & Collections Ledger</h2>
                  <p className="text-xs text-slate-500">Edit or delete payments. Deleting all collections/payments restores bills to unpaid and unlocks them for edit.</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCollectionId(null);
                      setCollectForm({ customer_id: "", invoice_id: "", amount: "", payment_mode: "Cash", receiver_id: upfrontPartnerId, reference_no: "", notes: "" });
                      setShowCollectModal(true);
                    }}
                    className="px-3.5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl"
                  >
                    + Customer Collection
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingPaymentId(null);
                      setPayPurchaseForm({ purchase_id: "", amount: "", partner_id: upfrontPartnerId, payment_mode: "Cash", reference_no: "", notes: "" });
                      setShowPayPurchaseModal(true);
                    }}
                    className="px-3.5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl"
                  >
                    + Supplier Payment
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <h3 className="font-bold text-sm text-slate-900 mb-2">Customer Collections (వసూళ్లు)</h3>
                <div className="space-y-2">
                  {collections.map((c) => {
                    const cust = customers.find((x) => x.id == c.customer_id);
                    const inv = invoices.find((x) => x.id == c.invoice_id);
                    const p = partners.find((x) => x.id == c.receiver_id);

                    return (
                      <div key={c.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                              {c.reference_no || `REC-${c.id}`}
                            </span>
                            <h4 className="font-bold text-sm text-slate-900">{cust?.name || "Customer"}</h4>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Invoice: <b>{inv?.invoice_number || (c.invoice_id ? `INV-${c.invoice_id}` : "Account Credit")}</b> | Collected by: {p?.name || "Partner"} ({c.payment_mode})
                          </p>
                          {c.notes && <p className="text-[11px] text-slate-400 italic">"{c.notes}"</p>}
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                          <span className="font-black text-emerald-600 text-sm">{money(c.amount)}</span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleEditCollection(c)}
                              className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1"
                            >
                              <Icon name="edit" size={13} /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCollection(c)}
                              className="px-2.5 py-1 bg-rose-50 text-rose-600 font-bold text-xs rounded-lg flex items-center gap-1"
                            >
                              <Icon name="trash" size={13} /> Void / Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-bold text-sm text-slate-900 mb-2">Supplier Purchase Payments (చెల్లింపులు)</h3>
                <div className="space-y-2">
                  {procurements
                    .filter((p) => Number(p.p1_amount || 0) > 0)
                    .map((p) => {
                      const partner = partners.find((x) => x.id == p.p1_id);

                      return (
                        <div key={p.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                                PAY-{p.id}
                              </span>
                              <h4 className="font-bold text-sm text-slate-900">{p.supplier_name}</h4>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">
                              Item: <b>{p.item_name}</b> | Paid by: {partner?.name || "Partner"} ({p.p1_mode || "Cash"})
                            </p>
                          </div>
                          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                            <span className="font-black text-indigo-600 text-sm">{money(p.p1_amount)}</span>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleEditPurchasePayment(p)}
                                className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1"
                              >
                                <Icon name="edit" size={13} /> Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePurchasePayment(p)}
                                className="px-2.5 py-1 bg-rose-50 text-rose-600 font-bold text-xs rounded-lg flex items-center gap-1"
                              >
                                <Icon name="trash" size={13} /> Void / Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 8: BORROWERS */}
        {activeTab === "borrowers" && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h2 className="text-lg font-black text-slate-900">Borrowers & Loans (అప్పులు)</h2>
                <p className="text-xs text-slate-500">Track loans taken or given (e.g. Gold Loan, Srikanth Reddy)</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setEditingBorrowerId(null);
                    setBorrowerForm({ name: "", mobile: "", initial_due: "" });
                    setShowBorrowerModal(true);
                  }}
                  className="flex-1 sm:flex-none px-3.5 py-2.5 border border-slate-200 font-bold text-xs rounded-xl"
                >
                  + Add Borrower
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setBorrowerTxForm({
                      borrower_id: borrowers[0]?.id ? String(borrowers[0].id) : "",
                      tx_type: "Given",
                      amount: "",
                      payment_mode: "Cash",
                      partner_id: upfrontPartnerId || "",
                      notes: "",
                      tx_date: new Date().toISOString().split("T")[0]
                    });
                    setShowBorrowerTxModal(true);
                  }}
                  className="flex-1 sm:flex-none px-3.5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl"
                >
                  Record Loan Tx
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {borrowers.map((b) => (
                <div key={b.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{b.name}</h4>
                    <span className="text-xs text-slate-400 block">{b.mobile || "No Mobile"}</span>
                    <span className="text-[11px] text-slate-500">
                      Total Borrowed: {money(b.total_borrowed)} | Repaid: {money(b.total_repaid)}
                    </span>
                  </div>
                  <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-2">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block uppercase font-bold">Outstanding Balance</span>
                      <span className="font-black text-rose-600 text-sm">{money(b.balance_due)}</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditBorrower(b)}
                        className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1"
                      >
                        <Icon name="edit" size={13} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBorrower(b)}
                        className="px-2.5 py-1 bg-rose-50 text-rose-600 font-bold text-xs rounded-lg flex items-center gap-1"
                      >
                        <Icon name="trash" size={13} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(true)}
                  className="flex-1 sm:flex-none px-3.5 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Icon name="layers" size={15} /> Categories
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
                      notes: ""
                    });
                    setShowExpenseModal(true);
                  }}
                  className="flex-1 sm:flex-none px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  + Add Expense
                </button>
              </div>
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
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="font-black text-rose-600 text-sm">{money(e.amount)}</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditExpense(e)}
                          className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1"
                        >
                          <Icon name="edit" size={13} /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteExpense(e)}
                          className="px-2.5 py-1 bg-rose-50 text-rose-600 font-bold text-xs rounded-lg flex items-center gap-1"
                        >
                          <Icon name="trash" size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 10: EXCEL REPORT */}
        {activeTab === "reports" && (
          <div className="space-y-6">
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-5">
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
                      <td className="p-2.5 border border-slate-300 text-right text-rose-600">{money(businessSummary.totalDebts + businessSummary.totalPurchaseDues)}</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="p-2.5 border border-slate-300 text-center">2</td>
                      <td className="p-2.5 border border-slate-300">కస్టమర్ బ్యాలెన్స్ (Customer Dues)</td>
                      <td className="p-2.5 border border-slate-300 text-right text-slate-900">{money(businessSummary.totalCustomerDues)}</td>
                    </tr>
                    <tr className="bg-slate-50 font-bold">
                      <td className="p-2.5 border border-slate-300 text-center">3</td>
                      <td className="p-2.5 border border-slate-300">నిలువలు (Stock Valuation)</td>
                      <td className="p-2.5 border border-slate-300 text-right text-slate-900">{money(businessSummary.stockValuation)}</td>
                    </tr>
                    <tr className="bg-rose-50/70 font-bold">
                      <td className="p-2.5 border border-slate-300 text-center">4</td>
                      <td className="p-2.5 border border-slate-300">ఖర్చులు (Expenses & Outlays)</td>
                      <td className="p-2.5 border border-slate-300 text-right text-rose-600">{money(businessSummary.totalExpenses)}</td>
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

              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm text-slate-900">నిలువలు (Available Stock with Qty &gt; 0)</h3>
                  <span className="text-xs font-bold text-slate-600">Total Valuation: {money(businessSummary.stockValuation)}</span>
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

              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-sm text-slate-900">కస్టమర్ బ్యాలెన్స్ (Customer Dues Ledger)</h3>
                  <span className="text-xs font-bold text-rose-600">Total Dues: {money(businessSummary.totalCustomerDues)}</span>
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

        {/* VIEW 11: PARTNER ACCOUNTS */}
        {activeTab === "partners" && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-slate-900">Operating Partners</h2>
                <p className="text-xs text-slate-500">Individual Partner Cash and UPI holdings</p>
              </div>
              <button
                type="button"
                onClick={() => setShowPartnerModal(true)}
                className="px-3.5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl"
              >
                + Add Partner
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {partnerAccounts.map((p) => (
                <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <h4 className="font-black text-base text-slate-900">{p.name}</h4>
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

      {/* DRAWER: AUDIT TRANSACTION INSPECTION */}
      {selectedAuditTx && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex justify-end z-50">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
            <div className="flex justify-between items-start pb-4 border-b">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">
                  {selectedAuditTx.txType === "sale" ? "Sales Invoice Audit" : "Purchase Bill Audit"}
                </span>
                <h3 className="font-black text-lg text-slate-900">{selectedAuditTx.docNumber}</h3>
                <p className="text-xs text-slate-400">{selectedAuditTx.date}</p>
              </div>
              <button onClick={() => setSelectedAuditTx(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="py-4 space-y-4 flex-1">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Party Name</span>
                <h4 className="font-black text-sm text-slate-900">{selectedAuditTx.partyName}</h4>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">Itemized Breakdown</h4>
                <div className="space-y-2">
                  {selectedAuditTx.items.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{item.item_name}</span>
                        <span className="text-[11px] text-slate-400">{item.qty} pcs @ ₹{item.rate}</span>
                      </div>
                      <span className="font-black text-slate-900">{money(item.total)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Total Bill Amount:</span>
                  <span className="font-bold text-slate-900">{money(selectedAuditTx.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Settled / Paid:</span>
                  <span className="font-bold text-emerald-600">{money(selectedAuditTx.paidAmount)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-bold text-slate-900">Remaining Balance Due:</span>
                  <span className="font-black text-rose-600">{money(selectedAuditTx.balanceDue)}</span>
                </div>
              </div>

              {selectedAuditTx.txType === "sale" && (
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">Linked Collections</h4>
                  <div className="space-y-1.5">
                    {collections
                      .filter((c) => c.invoice_id == selectedAuditTx.id)
                      .map((c) => (
                        <div key={c.id} className="p-2 border border-slate-200 rounded-lg text-xs flex justify-between items-center">
                          <div>
                            <span className="font-bold text-slate-900">{c.reference_no || `REC-${c.id}`}</span>
                            <span className="text-[10px] text-slate-400 block">{c.payment_mode}</span>
                          </div>
                          <span className="font-bold text-emerald-600">{money(c.amount)}</span>
                        </div>
                      ))}
                    {collections.filter((c) => c.invoice_id == selectedAuditTx.id).length === 0 && (
                      <p className="text-xs text-slate-400 italic">No secondary collection receipts against this invoice.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedAuditTx(null)}
              className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl"
            >
              Close Audit
            </button>
          </div>
        </div>
      )}

      {/* MODAL: STOCK PICKER */}
      {pickerActiveIndex !== null && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="font-black text-base text-slate-900">Select Item Batch</h3>
              <button type="button" onClick={() => setPickerActiveIndex(null)} className="text-slate-400">
                <Icon name="close" size={20} />
              </button>
            </div>
            <input
              type="text"
              placeholder="Search items..."
              className="w-full my-3 p-2.5 border border-slate-200 rounded-xl text-xs font-semibold outline-none"
              value={stockSearchQuery}
              onChange={(e) => setStockSearchQuery(e.target.value)}
            />
            <div className="overflow-y-auto space-y-2 flex-1">
              {procurements
                .filter((p) => Number(p.remaining_qty) > 0)
                .filter((p) => !stockSearchQuery || p.item_name?.toLowerCase().includes(stockSearchQuery.toLowerCase()))
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handlePickStockItem(item)}
                    className="p-3 border rounded-xl hover:border-indigo-500 cursor-pointer flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-black text-sm text-slate-900">{item.item_name}</h4>
                      <span className="text-xs text-slate-400">Rate: ₹{item.selling_rate || item.purchase_rate}</span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">{item.remaining_qty} in stock</span>
                  </div>
                ))}
            </div>
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

              <input
                type="text"
                placeholder="Reference / Receipt No (Auto-generated if empty)"
                className="w-full p-2 border rounded-xl text-xs"
                value={collectForm.reference_no}
                onChange={(e) => setCollectForm({ ...collectForm, reference_no: e.target.value })}
              />

              <div className="flex gap-2">
                <button type="button" onClick={() => setShowCollectModal(false)} className="flex-1 py-2 border rounded-xl text-xs font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">Save Receipt</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PURCHASES WITH CLEAN SINGLE DROPDOWNS */}
      {showProcureModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-3">
            <h3 className="font-bold text-base text-slate-900">
              {editingProcureId ? "Edit Purchase" : "Record Purchase & Stock (కొనుగోళ్లు)"}
            </h3>
            <form onSubmit={saveProcurement} className="space-y-3">
              {/* Supplier Clean Dropdown */}
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

              {/* Item Clean Dropdown */}
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
                placeholder="Item / Product Name (e.g. JB, Gold Leaf)"
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

      {/* MODAL: ADD / EDIT BORROWER */}
      {showBorrowerModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-3">
            <h3 className="font-bold text-base text-slate-900">{editingBorrowerId ? "Edit Borrower" : "Add New Borrower"}</h3>
            <form onSubmit={saveBorrower} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Borrower Name (e.g. Swamy Ongole)"
                className="w-full p-2.5 border rounded-xl text-sm"
                value={borrowerForm.name}
                onChange={(e) => setBorrowerForm({ ...borrowerForm, name: e.target.value })}
              />
              <input
                type="tel"
                placeholder="Mobile Number"
                className="w-full p-2.5 border rounded-xl text-sm"
                value={borrowerForm.mobile}
                onChange={(e) => setBorrowerForm({ ...borrowerForm, mobile: e.target.value })}
              />
              <input
                type="number"
                placeholder="Outstanding Due Balance (₹)"
                className="w-full p-2.5 border rounded-xl text-sm"
                value={borrowerForm.initial_due}
                onChange={(e) => setBorrowerForm({ ...borrowerForm, initial_due: e.target.value })}
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowBorrowerModal(false)} className="flex-1 py-2 border rounded-xl text-xs font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BORROWER TRANSACTION */}
      {showBorrowerTxModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-3">
            <h3 className="font-bold text-base text-slate-900">Record Loan Transaction</h3>
            <form onSubmit={saveBorrowerTransaction} className="space-y-3">
              <select
                required
                className="w-full p-2.5 border rounded-xl text-xs font-semibold"
                value={borrowerTxForm.borrower_id}
                onChange={(e) => setBorrowerTxForm({ ...borrowerTxForm, borrower_id: e.target.value })}
              >
                <option value="">-- Choose Borrower --</option>
                {borrowers.map((b) => (
                  <option key={b.id} value={b.id}>{b.name} (Due: {money(b.balance_due)})</option>
                ))}
              </select>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBorrowerTxForm({ ...borrowerTxForm, tx_type: "Given" })}
                  className={`py-2 rounded-xl text-xs font-bold border ${borrowerTxForm.tx_type === "Given" ? "bg-rose-600 text-white" : "bg-white"}`}
                >
                  Outflow (Given)
                </button>
                <button
                  type="button"
                  onClick={() => setBorrowerTxForm({ ...borrowerTxForm, tx_type: "Received" })}
                  className={`py-2 rounded-xl text-xs font-bold border ${borrowerTxForm.tx_type === "Received" ? "bg-emerald-600 text-white" : "bg-white"}`}
                >
                  Inflow (Repaid)
                </button>
              </div>

              <input
                type="number"
                required
                placeholder="Amount (₹)"
                className="w-full p-2.5 border rounded-xl text-sm font-bold"
                value={borrowerTxForm.amount}
                onChange={(e) => setBorrowerTxForm({ ...borrowerTxForm, amount: e.target.value })}
              />

              <select
                required
                className="w-full p-2.5 border rounded-xl text-xs font-semibold"
                value={borrowerTxForm.partner_id}
                onChange={(e) => setBorrowerTxForm({ ...borrowerTxForm, partner_id: e.target.value })}
              >
                <option value="">-- Partner In/Out Account --</option>
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <div className="flex gap-2">
                <button type="button" onClick={() => setShowBorrowerTxModal(false)} className="flex-1 py-2 border rounded-xl text-xs font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs">Save Entry</button>
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

      {/* MODAL: ADD PARTNER */}
      {showPartnerModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-3">
            <h3 className="font-bold text-base text-slate-900">Add Partner</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              await db.from("receivers").insert([{
                name: partnerForm.name.trim(),
                opening_cash: Number(partnerForm.opening_cash || 0),
                opening_upi: Number(partnerForm.opening_upi || 0)
              }]);
              setShowPartnerModal(false);
              refreshData();
            }} className="space-y-3">
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
    </div>
  );
}
