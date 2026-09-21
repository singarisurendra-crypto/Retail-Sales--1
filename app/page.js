"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Clean inline SVG icons to prevent undefined Next.js build crashes
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
    package: (
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    wallet: (
      <path d="M21 18V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2h15a2 2 0 002-2zM2 10h19M16 14h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    ),
    history: (
      <path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8m0 0V3m0 5h5M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
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

  // Core Data State
  const [partners, setPartners] = useState([]);
  const [procurements, setProcurements] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [collections, setCollections] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);
  const [borrowers, setBorrowers] = useState([]);
  const [borrowerTx, setBorrowerTx] = useState([]);
  const [purchasePayments, setPurchasePayments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showCustModal, setShowCustModal] = useState(false);
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

  // Customer Form
  const [editingCustId, setEditingCustId] = useState(null);
  const [custForm, setCustForm] = useState({ name: "", mobile: "", old_due: "" });

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

  // Supplier Purchase Bill Payment Form
  const [payPurchaseForm, setPayPurchaseForm] = useState({
    purchase_id: "",
    amount: "",
    partner_id: "",
    payment_mode: "Cash",
    payment_date: new Date().toISOString().split("T")[0]
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

  // Due Collection Form (Invoice-Wise)
  const [collectForm, setCollectForm] = useState({
    customer_id: "",
    invoice_id: "",
    amount: "",
    payment_mode: "Cash",
    receiver_id: ""
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
      const [p, pr, c, inv, col, exp, cats, b, bTx] = await Promise.all([
        db.from("receivers").select("*").order("name", { ascending: true }),
        db.from("procurements").select("*").order("created_at", { ascending: false }),
        db.from("customers").select("*").order("name", { ascending: true }),
        db.from("invoices").select("*").order("created_at", { ascending: false }),
        db.from("collections").select("*").order("created_at", { ascending: false }),
        db.from("expenses").select("*").order("expense_date", { ascending: false }),
        db.from("expense_categories").select("*").order("name", { ascending: true }),
        db.from("borrowers").select("*").order("name", { ascending: true }),
        db.from("borrower_transactions").select("*").order("tx_date", { ascending: false })
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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const uniqueItemSuggestions = useMemo(() => {
    const map = new Map();
    procurements.forEach((p) => {
      const trimmed = (p.item_name || "").trim();
      if (trimmed && !map.has(trimmed.toLowerCase())) {
        map.set(trimmed.toLowerCase(), trimmed);
      }
    });
    return Array.from(map.values());
  }, [procurements]);

  const uniqueSupplierSuggestions = useMemo(() => {
    const map = new Map();
    procurements.forEach((p) => {
      const trimmed = (p.supplier_name || "").trim();
      if (trimmed && trimmed !== "Opening Stock" && !map.has(trimmed.toLowerCase())) {
        map.set(trimmed.toLowerCase(), trimmed);
      }
    });
    return Array.from(map.values());
  }, [procurements]);

  // Partner Ledger including purchase settlements
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

  // Overall Business Statement Summary
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

  // Unified Audit Trail History Logs
  const auditHistory = useMemo(() => {
    const list = [];

    invoices.forEach((inv) => {
      list.push({
        id: `inv-${inv.id}`,
        date: inv.invoice_date || inv.created_at?.slice(0, 10),
        type: "Sale Invoice",
        title: `${inv.customer_name} (${inv.invoice_number || `INV-${inv.id}`})`,
        amount: Number(inv.total_amount || 0),
        status: inv.status || (Number(inv.balance_due) <= 0 ? "Collected" : "Due"),
        mode: inv.upfront_mode || "Bill",
        details: `Upfront: ${money(inv.upfront_paid || 0)} | Due: ${money(inv.balance_due || 0)}`
      });
    });

    collections.forEach((col) => {
      const p = partners.find((pt) => pt.id == col.receiver_id);
      list.push({
        id: `col-${col.id}`,
        date: col.created_at?.slice(0, 10),
        type: "Due Collection",
        title: `Customer Payment Received (${col.invoice_id ? `INV-${col.invoice_id}` : "Account"})`,
        amount: Number(col.amount || 0),
        status: "Collected",
        mode: col.payment_mode,
        details: `Collected by: ${p?.name || "Partner"}`
      });
    });

    procurements.forEach((pr) => {
      const total = Number(pr.total_amount || 0);
      const paid = Number(pr.p1_amount || 0);
      const isPaid = paid >= total;
      list.push({
        id: `pr-${pr.id}`,
        date: pr.created_at?.slice(0, 10),
        type: "Purchase Bill",
        title: `${pr.item_name} from ${pr.supplier_name}`,
        amount: total,
        status: isPaid ? "Paid" : paid > 0 ? "Partial" : "Due",
        mode: pr.p1_mode || "Cash",
        details: `Paid: ${money(paid)} | Supplier Due: ${money(Math.max(0, total - paid))}`
      });
    });

    expenses.forEach((e) => {
      const p = partners.find((pt) => pt.id == e.paid_by_id);
      list.push({
        id: `exp-${e.id}`,
        date: e.expense_date || e.created_at?.slice(0, 10),
        type: "Shop Expense",
        title: `${e.title} (${e.category_name || "General"})`,
        amount: Number(e.amount || 0),
        status: "Outflow",
        mode: e.payment_mode,
        details: `Paid by: ${p?.name || "Partner"}`
      });
    });

    borrowerTx.forEach((tx) => {
      const b = borrowers.find((br) => br.id == tx.borrower_id);
      list.push({
        id: `tx-${tx.id}`,
        date: tx.tx_date || tx.created_at?.slice(0, 10),
        type: tx.tx_type === "Given" ? "Loan Given" : "Loan Repaid",
        title: `${b?.name || "Borrower"} (${tx.tx_type})`,
        amount: Number(tx.amount || 0),
        status: tx.tx_type,
        mode: tx.payment_mode,
        details: tx.notes || "Borrower Ledger Entry"
      });
    });

    return list.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
  }, [invoices, collections, procurements, expenses, borrowerTx, partners, borrowers]);

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

  // SAVE INVOICE (Assigns status Collected, Partial, or Due)
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
    if (!confirm(`Delete invoice ${inv.invoice_number || "INV-" + inv.id}? This will restore stock and remove dues.`)) return;

    try {
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
      alert("Invoice deleted!");
      refreshData();
    } catch (err) {
      alert("Error deleting invoice: " + err.message);
    }
  };

  const handleEditInvoice = (inv) => {
    if (inv.status === "Collected" || Number(inv.balance_due || 0) <= 0) {
      return alert("This invoice has been fully Collected and cannot be edited as per business rules.");
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

  // INVOICE-WISE DUE COLLECTION HANDLER
  const saveInvoiceCollection = async (e) => {
    e.preventDefault();
    const amt = Number(collectForm.amount || 0);
    if (amt <= 0) return alert("Enter valid collection amount");
    if (!collectForm.receiver_id) return alert("Select partner who collected");

    try {
      await db.from("collections").insert([{
        customer_id: Number(collectForm.customer_id),
        invoice_id: collectForm.invoice_id ? Number(collectForm.invoice_id) : null,
        amount: amt,
        payment_mode: collectForm.payment_mode,
        receiver_id: Number(collectForm.receiver_id)
      }]);

      if (collectForm.invoice_id) {
        const targetInv = invoices.find((i) => i.id == collectForm.invoice_id);
        if (targetInv) {
          const currentBal = Number(targetInv.balance_due || 0);
          const newBal = Math.max(0, currentBal - amt);
          const newStatus = newBal <= 0 ? "Collected" : "Partial";
          await db.from("invoices").update({
            balance_due: newBal,
            status: newStatus
          }).eq("id", targetInv.id);
        }
      }

      const cust = customers.find((c) => c.id == collectForm.customer_id);
      if (cust) {
        await db.from("customers").update({ old_due: Math.max(0, Number(cust.old_due || 0) - amt) }).eq("id", cust.id);
      }

      alert("Collection recorded and invoice status updated!");
      setShowCollectModal(false);
      refreshData();
    } catch (err) {
      alert("Error saving collection: " + err.message);
    }
  };

  // BILL-WISE PURCHASE PAYMENT HANDLER
  const savePurchasePayment = async (e) => {
    e.preventDefault();
    const amt = Number(payPurchaseForm.amount || 0);
    if (amt <= 0) return alert("Enter valid payment amount");
    if (!payPurchaseForm.purchase_id) return alert("Select purchase bill");
    if (!payPurchaseForm.partner_id) return alert("Select partner paying this bill");

    const targetP = procurements.find((p) => p.id == payPurchaseForm.purchase_id);
    if (!targetP) return alert("Purchase not found");

    const currentTotal = Number(targetP.total_amount || 0);
    const alreadyPaid = Number(targetP.p1_amount || 0);
    const newPaidTotal = alreadyPaid + amt;

    if (newPaidTotal > currentTotal) {
      return alert("Payment exceeds remaining purchase bill balance!");
    }

    try {
      await db.from("procurements").update({
        p1_amount: newPaidTotal,
        p1_id: Number(payPurchaseForm.partner_id),
        p1_mode: payPurchaseForm.payment_mode
      }).eq("id", targetP.id);

      alert(`Purchase bill payment recorded! Remaining due: ${money(currentTotal - newPaidTotal)}`);
      setShowPayPurchaseModal(false);
      setPayPurchaseForm({
        purchase_id: "",
        amount: "",
        partner_id: upfrontPartnerId || "",
        payment_mode: "Cash",
        payment_date: new Date().toISOString().split("T")[0]
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
    if (!confirm(`Delete customer "${c.name}"? This removes their customer record.`)) return;
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

  // PURCHASES HANDLERS (Locks edit when fully Paid)
  const handleEditProcurement = (p) => {
    const total = Number(p.total_amount || 0);
    const paid = Number(p.p1_amount || 0);
    if (paid >= total && total > 0) {
      return alert("This purchase bill is fully Paid and locked from edits according to business rules.");
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
              onClick={() => { setActiveTab("invoices"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "invoices" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              <Icon name="invoice" size={18} /> Invoices & Collections
            </button>

            <button
              onClick={() => { setActiveTab("procurement"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "procurement" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              <Icon name="package" size={18} /> Purchases & Supplier Bills
            </button>

            <button
              onClick={() => { setActiveTab("history"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "history" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              <Icon name="history" size={18} /> Audit History & Ledger
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
              <Icon name="creditcard" size={18} /> Expenses & Master
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
              onClick={() => { setActiveTab("customers"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "customers" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              <Icon name="users" size={18} /> Customers Directory
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
              setCollectForm({ customer_id: "", invoice_id: "", amount: "", payment_mode: "Cash", receiver_id: upfrontPartnerId });
              setShowCollectModal(true);
              setSidebarOpen(false);
            }}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow"
          >
            <Icon name="rupee" size={15} /> Collect Invoice Due
          </button>
          <button
            onClick={() => {
              setPayPurchaseForm({ purchase_id: "", amount: "", partner_id: upfrontPartnerId, payment_mode: "Cash", payment_date: new Date().toISOString().split("T")[0] });
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

        {/* VIEW 3: INVOICES & COLLECTIONS */}
        {activeTab === "invoices" && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h2 className="text-lg font-black text-slate-900">Invoices Directory</h2>
                <p className="text-xs text-slate-500">Track bills, invoice-wise collections, and settlement status</p>
              </div>
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
                            setCollectForm({
                              customer_id: String(inv.customer_id),
                              invoice_id: String(inv.id),
                              amount: String(inv.balance_due || ""),
                              payment_mode: "Cash",
                              receiver_id: upfrontPartnerId
                            });
                            setShowCollectModal(true);
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg flex items-center gap-1"
                        >
                          <Icon name="rupee" size={13} /> Collect This Bill
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

        {/* VIEW 4: PURCHASES & SUPPLIER BILLS */}
        {activeTab === "procurement" && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h2 className="text-lg font-black text-slate-900">Purchases & Stock (కొనుగోళ్లు)</h2>
                <p className="text-xs text-slate-500">Supplier bills, settlements, and live stock tracking</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setPayPurchaseForm({ purchase_id: "", amount: "", partner_id: upfrontPartnerId, payment_mode: "Cash", payment_date: new Date().toISOString().split("T")[0] });
                    setShowPayPurchaseModal(true);
                  }}
                  className="flex-1 sm:flex-none px-3.5 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs rounded-xl"
                >
                  Pay Supplier Bill
                </button>
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
                            setPayPurchaseForm({
                              purchase_id: String(p.id),
                              amount: String(due),
                              partner_id: upfrontPartnerId,
                              payment_mode: "Cash",
                              payment_date: new Date().toISOString().split("T")[0]
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

        {/* VIEW 5: AUDIT TRAIL / LEDGER HISTORY */}
        {activeTab === "history" && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Audit Trail & Transaction History</h2>
              <p className="text-xs text-slate-500">Chronological timeline of all sales, collections, purchase bills, loans, and expenses</p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead className="bg-slate-100 text-slate-600 font-bold">
                  <tr>
                    <th className="p-2.5 border border-slate-200">Date</th>
                    <th className="p-2.5 border border-slate-200">Module / Event</th>
                    <th className="p-2.5 border border-slate-200">Reference / Title</th>
                    <th className="p-2.5 border border-slate-200">Status</th>
                    <th className="p-2.5 border border-slate-200">Mode</th>
                    <th className="p-2.5 border border-slate-200 text-right">Amount</th>
                    <th className="p-2.5 border border-slate-200">Audit Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {auditHistory.map((h) => (
                    <tr key={h.id} className="hover:bg-slate-50/80">
                      <td className="p-2.5 border border-slate-200 text-slate-500">{h.date}</td>
                      <td className="p-2.5 border border-slate-200 font-bold text-indigo-600">{h.type}</td>
                      <td className="p-2.5 border border-slate-200 font-bold text-slate-900">{h.title}</td>
                      <td className="p-2.5 border border-slate-200">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {h.status}
                        </span>
                      </td>
                      <td className="p-2.5 border border-slate-200">{h.mode}</td>
                      <td className="p-2.5 border border-slate-200 text-right font-black text-slate-900">{money(h.amount)}</td>
                      <td className="p-2.5 border border-slate-200 text-slate-500 text-[11px]">{h.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 6: BORROWERS */}
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

        {/* VIEW 7: EXPENSES */}
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

        {/* VIEW 8: EXCEL REPORT (ZERO QTY FILTERED OUT) */}
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

              {/* Master Balance Sheet Table */}
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

              {/* Available Stock Inventory Table (Filtered to non-zero qty) */}
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

              {/* Customer Dues Ledger */}
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

        {/* VIEW 9: CUSTOMERS */}
        {activeTab === "customers" && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-slate-900">Customer Directory</h2>
                <p className="text-xs text-slate-500">Manage dues and contact details</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingCustId(null);
                  setCustForm({ name: "", mobile: "", old_due: "" });
                  setShowCustModal(true);
                }}
                className="px-3.5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl"
              >
                + Add Customer
              </button>
            </div>
            <div className="space-y-2">
              {customers.map((c) => (
                <div key={c.id} className="p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{c.name}</h4>
                    <span className="text-xs text-slate-400">{c.mobile || "No Mobile"}</span>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="font-black text-rose-600 text-sm">{money(c.old_due)}</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditCustomer(c)}
                        className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1"
                      >
                        <Icon name="edit" size={13} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomer(c)}
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

        {/* VIEW 10: PARTNER ACCOUNTS */}
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
            <h3 className="font-bold text-base text-slate-900">Pay Purchase Bill</h3>
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
                  .filter((p) => Number(p.total_amount || 0) > Number(p.p1_amount || 0))
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.item_name} ({p.supplier_name}) — Due: {money(Number(p.total_amount || 0) - Number(p.p1_amount || 0))}
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
            <h3 className="font-bold text-base text-slate-900">Collect Customer Invoice Due</h3>
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
                    .filter((i) => i.customer_id == collectForm.customer_id && Number(i.balance_due || 0) > 0)
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
                <button type="submit" className="flex-1 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">Save Collection</button>
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
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Supplier / Vendor *</label>
                <input
                  list="supplier-master-list"
                  type="text"
                  required
                  placeholder="Type or select existing supplier..."
                  className="w-full p-2.5 border rounded-xl text-sm font-semibold"
                  value={procureForm.supplier_name}
                  onChange={(e) => setProcureForm({ ...procureForm, supplier_name: e.target.value })}
                />
                <datalist id="supplier-master-list">
                  {uniqueSupplierSuggestions.map((s, idx) => (
                    <option key={idx} value={s} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Item Name *</label>
                <input
                  list="item-master-list"
                  type="text"
                  required
                  placeholder="Type or select existing item..."
                  className="w-full p-2.5 border rounded-xl text-sm font-bold"
                  value={procureForm.item_name}
                  onChange={(e) => setProcureForm({ ...procureForm, item_name: e.target.value })}
                />
                <datalist id="item-master-list">
                  {uniqueItemSuggestions.map((item, idx) => (
                    <option key={idx} value={item} />
                  ))}
                </datalist>
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
