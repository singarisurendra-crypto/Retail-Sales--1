"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import * as LucideIcons from "lucide-react";

// Safe icon loader to prevent undefined element crashes
const getIcon = (name, props) => {
  const IconComponent = LucideIcons[name] || LucideIcons.HelpCircle;
  return <IconComponent {...props} />;
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
  const [loading, setLoading] = useState(true);

  // Modals
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showCustModal, setShowCustModal] = useState(false);
  const [showProcureModal, setShowProcureModal] = useState(false);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBorrowerModal, setShowBorrowerModal] = useState(false);
  const [showBorrowerTxModal, setShowBorrowerTxModal] = useState(false);

  // Stock Picker Modal
  const [pickerActiveIndex, setPickerActiveIndex] = useState(null);
  const [stockSearchQuery, setStockSearchQuery] = useState("");

  // Customer Form
  const [custForm, setCustForm] = useState({ name: "", mobile: "", old_due: "" });

  // Partner Form
  const [partnerForm, setPartnerForm] = useState({ name: "", opening_cash: "", opening_upi: "" });

  // Procurement Form
  const [editingProcureId, setEditingProcureId] = useState(null);
  const [procureForm, setProcureForm] = useState({
    supplier_name: "",
    item_name: "",
    procured_qty: "",
    purchase_rate: "",
    selling_rate: "",
    is_opening: false,
    p1_id: "",
    p1_amount: "",
    p1_mode: "Cash",
    split_p2: false,
    p2_id: "",
    p2_amount: "",
    p2_mode: "UPI"
  });

  // Expense Form
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    category_id: "",
    amount: "",
    payment_mode: "Cash",
    paid_by_id: "",
    expense_date: new Date().toISOString().split("T")[0],
    notes: ""
  });

  // Borrower Form
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
        if (p.p2_id == pid && p.p2_mode === "Cash") amt += Number(p.p2_amount || 0);
        return s + amt;
      }, 0);
      const procUpi = procurements.reduce((s, p) => {
        let amt = 0;
        if (p.p1_id == pid && p.p1_mode === "UPI") amt += Number(p.p1_amount || 0);
        if (p.p2_id == pid && p.p2_mode === "UPI") amt += Number(p.p2_amount || 0);
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
    const stockValuation = procurements.reduce(
      (s, p) => s + Number(p.remaining_qty || 0) * Number(p.purchase_rate || 0),
      0
    );
    const bReddyNetProfit = totalCustomerDues + stockValuation - totalDebts;

    const totalCash = partnerAccounts.reduce((s, p) => s + p.netCash, 0);
    const totalUpi = partnerAccounts.reduce((s, p) => s + p.netUpi, 0);

    return { totalSales, totalCustomerDues, totalDebts, stockValuation, bReddyNetProfit, totalCash, totalUpi };
  }, [invoices, customers, borrowers, procurements, partnerAccounts]);

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
      const status = upfrontPaidNum === 0 ? "Unpaid" : upfrontPaidNum >= cartTotal ? "Paid" : "Partial";
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
        alert(`Invoice created! Due: ${money(remainingBillDue)}`);
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
    if (!confirm(`Delete invoice ${inv.invoice_number || "INV-" + inv.id}? This will return stock and remove dues.`)) return;

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
      alert("Invoice deleted and stock restored!");
      refreshData();
    } catch (err) {
      alert("Error deleting invoice: " + err.message);
    }
  };

  const handleEditInvoice = (inv) => {
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

  const saveExpense = async (e) => {
    e.preventDefault();
    const amt = Number(expenseForm.amount || 0);
    if (amt <= 0) return alert("Enter a valid amount");
    if (!expenseForm.paid_by_id) return alert("Select who paid");

    const cat = expenseCategories.find((c) => c.id == expenseForm.category_id);
    try {
      const { error } = await db.from("expenses").insert([{
        title: expenseForm.title.trim(),
        category_id: expenseForm.category_id ? Number(expenseForm.category_id) : null,
        category_name: cat ? cat.name : "General",
        amount: amt,
        payment_mode: expenseForm.payment_mode,
        paid_by_id: Number(expenseForm.paid_by_id),
        expense_date: expenseForm.expense_date,
        notes: expenseForm.notes.trim()
      }]);
      if (error) throw error;
      setShowExpenseModal(false);
      setExpenseForm({
        title: "",
        category_id: "",
        amount: "",
        payment_mode: "Cash",
        paid_by_id: upfrontPartnerId || "",
        expense_date: new Date().toISOString().split("T")[0],
        notes: ""
      });
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
      const { error } = await db.from("borrowers").insert([{
        name: borrowerForm.name.trim(),
        mobile: borrowerForm.mobile.trim(),
        total_borrowed: initialDue,
        balance_due: initialDue
      }]);
      if (error) throw error;
      setShowBorrowerModal(false);
      setBorrowerForm({ name: "", mobile: "", initial_due: "" });
      refreshData();
      alert("Borrower profile added!");
    } catch (err) {
      alert(err.message);
    }
  };

  const saveBorrowerTransaction = async (e) => {
    e.preventDefault();
    const amt = Number(borrowerTxForm.amount || 0);
    if (amt <= 0) return alert("Enter valid loan amount");
    if (!borrowerTxForm.borrower_id) return alert("Select borrower");
    if (!borrowerTxForm.partner_id) return alert("Select partner");

    try {
      const { error } = await db.from("borrower_transactions").insert([{
        borrower_id: Number(borrowerTxForm.borrower_id),
        tx_type: borrowerTxForm.tx_type,
        amount: amt,
        payment_mode: borrowerTxForm.payment_mode,
        partner_id: Number(borrowerTxForm.partner_id),
        notes: borrowerTxForm.notes.trim(),
        tx_date: borrowerTxForm.tx_date
      }]);
      if (error) throw error;

      const targetB = borrowers.find((b) => b.id == borrowerTxForm.borrower_id);
      if (targetB) {
        let newBorrowed = Number(targetB.total_borrowed || 0);
        let newRepaid = Number(targetB.total_repaid || 0);

        if (borrowerTxForm.tx_type === "Given") {
          newBorrowed += amt;
        } else {
          newRepaid += amt;
        }
        const newBalance = Math.max(0, newBorrowed - newRepaid);
        await db.from("borrowers").update({
          total_borrowed: newBorrowed,
          total_repaid: newRepaid,
          balance_due: newBalance
        }).eq("id", targetB.id);
      }

      setShowBorrowerTxModal(false);
      setBorrowerTxForm({
        borrower_id: "",
        tx_type: "Given",
        amount: "",
        payment_mode: "Cash",
        partner_id: upfrontPartnerId || "",
        notes: "",
        tx_date: new Date().toISOString().split("T")[0]
      });
      refreshData();
      alert("Loan entry recorded!");
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

    const payload = {
      supplier_name: procureForm.is_opening ? "Opening Stock" : procureForm.supplier_name.trim() || "Vendor",
      item_name: procureForm.item_name.trim(),
      procured_qty: qty,
      remaining_qty: qty,
      purchase_rate: purchaseRate,
      selling_rate: sellingRate,
      total_amount: total,
      p1_id: procureForm.p1_id ? Number(procureForm.p1_id) : null,
      p1_amount: Number(procureForm.p1_amount || (procureForm.split_p2 ? 0 : total)),
      p1_mode: procureForm.p1_mode,
      p2_id: procureForm.split_p2 && procureForm.p2_id ? Number(procureForm.p2_id) : null,
      p2_amount: procureForm.split_p2 ? Number(procureForm.p2_amount || 0) : 0,
      p2_mode: procureForm.p2_mode
    };

    try {
      if (editingProcureId) {
        const { error } = await db.from("procurements").update(payload).eq("id", editingProcureId);
        if (error) throw error;
      } else {
        const { error } = await db.from("procurements").insert([payload]);
        if (error) throw error;
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
      {/* Mobile Top Header */}
      <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-sm">B</div>
          <span className="font-bold text-sm tracking-wide">B Reddy Sales</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 -mr-1 rounded-xl text-slate-300">
          {sidebarOpen ? getIcon("X", { size: 22 }) : getIcon("Menu", { size: 22 })}
        </button>
      </header>

      {/* SIDEBAR NAVIGATION */}
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
              {getIcon("ShoppingCart", { size: 18 })} Point of Sale (Billing)
            </button>

            <button
              onClick={() => { setActiveTab("summary"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "summary" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              {getIcon("LayoutDashboard", { size: 18 })} Business Summary
            </button>

            <button
              onClick={() => { setActiveTab("invoices"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "invoices" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              {getIcon("FileSpreadsheet", { size: 18 })} Invoices & Edit/Delete
            </button>

            <button
              onClick={() => { setActiveTab("borrowers"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "borrowers" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              {getIcon("HandCoins", { size: 18 })} Borrowers (Loans)
            </button>

            <button
              onClick={() => { setActiveTab("expenses"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "expenses" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              {getIcon("CreditCard", { size: 18 })} Expenses & Master
            </button>

            <button
              onClick={() => { setActiveTab("reports"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "reports" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              {getIcon("FileText", { size: 18 })} Excel Report (PDF)
            </button>

            <button
              onClick={() => { setActiveTab("customers"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "customers" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              {getIcon("Users", { size: 18 })} Customers & Dues
            </button>

            <button
              onClick={() => { setActiveTab("procurement"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "procurement" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              {getIcon("PackagePlus", { size: 18 })} Procurements & Stock
            </button>

            <button
              onClick={() => { setActiveTab("partners"); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "partners" ? "bg-indigo-600 text-white shadow-md" : "hover:bg-slate-800 text-slate-400"
              }`}
            >
              {getIcon("Wallet", { size: 18 })} Partner Accounts
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => { setShowCollectModal(true); setSidebarOpen(false); }}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg"
          >
            {getIcon("IndianRupee", { size: 16 })} Collect Customer Due
          </button>
        </div>
      </aside>

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-xs" />}

      {/* MAIN VIEW AREA */}
      <main className="flex-1 p-3.5 sm:p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
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
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Customer *</label>
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

              {/* Stock Items Cart */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase text-slate-500">Bill Items *</label>
                  <button
                    onClick={() =>
                      setCart([
                        ...cart,
                        { procure_id: "", item_name: "", supplier_name: "", purchase_rate: 0, rate: "", qty: "1", total: 0, max_qty: 0 }
                      ])
                    }
                    className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline"
                  >
                    {getIcon("Plus", { size: 15 })} Add Line
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
                      {getIcon("ChevronRight", { size: 16, className: "text-slate-400" })}
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
                          onClick={() => cart.length > 1 && setCart(cart.filter((_, i) => i !== idx))}
                          className="p-1.5 text-slate-400 hover:text-rose-600"
                        >
                          {getIcon("Trash2", { size: 16 })}
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
                disabled={savingSale || cartTotal <= 0}
                onClick={saveSaleInvoice}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-black rounded-xl text-xs uppercase tracking-wider"
              >
                {savingSale ? "Saving..." : editingInvoiceId ? "Update & Save Invoice" : "Save Invoice & Bill"}
              </button>
            </div>
          </div>
        )}

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
                <p className="text-[10px] font-bold text-slate-400 uppercase">Debts / Borrowings (అప్పులు)</p>
                <h3 className="text-lg sm:text-2xl font-black text-amber-600 mt-1">{money(businessSummary.totalDebts)}</h3>
              </div>
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Net Profit (లాభం 2+3-1)</p>
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

        {activeTab === "invoices" && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Invoices Directory</h2>
              <p className="text-xs text-slate-500">Edit quantities or delete bills and restore warehouse stock</p>
            </div>

            <div className="space-y-3">
              {invoices.map((inv) => (
                <div key={inv.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-bold text-indigo-600 uppercase">{inv.invoice_number || `INV-${inv.id}`}</span>
                      <h4 className="font-black text-sm text-slate-900">{inv.customer_name}</h4>
                      <span className="text-[11px] text-slate-400">{inv.invoice_date || inv.created_at?.slice(0, 10)}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      Due: {money(inv.balance_due)}
                    </span>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-slate-200 justify-end">
                    <button
                      onClick={() => handleEditInvoice(inv)}
                      className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 font-bold text-xs rounded-lg flex items-center gap-1"
                    >
                      {getIcon("Edit2", { size: 13 })} Edit
                    </button>
                    <button
                      onClick={() => handleDeleteInvoice(inv)}
                      className="px-3 py-1.5 bg-rose-50 text-rose-600 font-bold text-xs rounded-lg flex items-center gap-1"
                    >
                      {getIcon("Trash2", { size: 13 })} Delete
                    </button>
                    <button
                      onClick={() => handleShareWhatsApp(inv)}
                      className="px-3 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-lg flex items-center gap-1"
                    >
                      {getIcon("Share2", { size: 13 })} WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "borrowers" && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h2 className="text-lg font-black text-slate-900">Borrowers & Loans (అప్పులు)</h2>
                <p className="text-xs text-slate-500">Track loans taken or given (e.g. Gold Loan, Srikanth Reddy, Swamy Ongole)</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowBorrowerModal(true)}
                  className="flex-1 sm:flex-none px-3.5 py-2.5 border border-slate-200 font-bold text-xs rounded-xl"
                >
                  + Add Borrower
                </button>
                <button
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
                <div key={b.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{b.name}</h4>
                    <span className="text-xs text-slate-400 block">{b.mobile || "No Mobile"}</span>
                    <span className="text-[11px] text-slate-500">
                      Total Borrowed: {money(b.total_borrowed)} | Repaid: {money(b.total_repaid)}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block uppercase font-bold">Outstanding Balance</span>
                    <span className="font-black text-rose-600 text-sm">{money(b.balance_due)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "expenses" && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-slate-900">Expenses</h2>
                <p className="text-xs text-slate-500">Record shop outlays paid by partners</p>
              </div>
              <button
                onClick={() => {
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
                className="px-3.5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl"
              >
                + Record Expense
              </button>
            </div>

            <div className="space-y-3">
              {expenses.map((e) => {
                const partner = partners.find((p) => p.id == e.paid_by_id);
                return (
                  <div key={e.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex justify-between items-center">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-indigo-600">{e.category_name}</span>
                      <h4 className="font-bold text-sm text-slate-900">{e.title}</h4>
                      <p className="text-[11px] text-slate-400">
                        Paid by: {partner?.name || "N/A"} ({e.payment_mode}) on {e.expense_date}
                      </p>
                    </div>
                    <span className="font-black text-rose-600 text-sm">{money(e.amount)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-5">
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-lg font-black text-slate-900">B Reddy Statement (Excel Sheet Format)</h2>
                  <p className="text-xs text-slate-500">Complete statement mirroring your B Reddy.xlsx balance sheet</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow"
                >
                  {getIcon("Download", { size: 15 })} Download / Print PDF
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
                      <td className="p-2.5 border border-slate-300">అప్పులు (Debts / Borrowings)</td>
                      <td className="p-2.5 border border-slate-300 text-right text-rose-600">{money(businessSummary.totalDebts)}</td>
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
                    <tr className="bg-emerald-100/80 font-black text-sm">
                      <td colSpan={2} className="p-3 border border-slate-300 text-right uppercase">
                        లాభం (Net Business Profit = 2 + 3 - 1)
                      </td>
                      <td className="p-3 border border-slate-300 text-right text-emerald-800">
                        {money(businessSummary.bReddyNetProfit)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-2">
                <h3 className="font-bold text-sm text-slate-900 mb-2">నిలువలు (Stock Batches Breakdown)</h3>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs border-collapse font-mono">
                    <thead className="bg-slate-100 text-slate-600 font-bold">
                      <tr>
                        <th className="p-2 border border-slate-200">S.No</th>
                        <th className="p-2 border border-slate-200">Stock Item</th>
                        <th className="p-2 border border-slate-200 text-center">Available Qty</th>
                        <th className="p-2 border border-slate-200 text-right">Rate</th>
                        <th className="p-2 border border-slate-200 text-right">Total Valuation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {procurements.map((p, idx) => (
                        <tr key={p.id}>
                          <td className="p-2 border border-slate-200 text-center">{idx + 1}</td>
                          <td className="p-2 border border-slate-200 font-bold">{p.item_name}</td>
                          <td className="p-2 border border-slate-200 text-center">{p.remaining_qty}</td>
                          <td className="p-2 border border-slate-200 text-right">{money(p.purchase_rate)}</td>
                          <td className="p-2 border border-slate-200 text-right font-bold">
                            {money(Number(p.remaining_qty || 0) * Number(p.purchase_rate || 0))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "customers" && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-slate-900">Customer Directory</h2>
                <p className="text-xs text-slate-500">Manage dues and mobile numbers</p>
              </div>
              <button
                onClick={() => {
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
                <div key={c.id} className="p-3.5 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{c.name}</h4>
                    <span className="text-xs text-slate-400">{c.mobile || "No Mobile"}</span>
                  </div>
                  <span className="font-black text-rose-600 text-sm">{money(c.old_due)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "procurement" && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-slate-900">Procurements & Inventory</h2>
                <p className="text-xs text-slate-500">Stock purchase entries and warehouse rates</p>
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
                    p1_id: "",
                    p1_amount: "",
                    p1_mode: "Cash",
                    split_p2: false,
                    p2_id: "",
                    p2_amount: "",
                    p2_mode: "UPI"
                  });
                  setShowProcureModal(true);
                }}
                className="px-3.5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl"
              >
                + Add Procurement
              </button>
            </div>
            <div className="space-y-2">
              {procurements.map((p) => (
                <div key={p.id} className="p-3.5 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{p.supplier_name}</span>
                    <h4 className="font-bold text-sm text-slate-900">{p.item_name}</h4>
                    <span className="text-xs text-slate-500">Cost: {money(p.purchase_rate)} | Sell: {money(p.selling_rate)}</span>
                  </div>
                  <span className="font-black text-emerald-600 text-xs bg-emerald-50 px-2.5 py-1 rounded-lg">
                    {p.remaining_qty} in stock
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "partners" && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-slate-900">Operating Partners</h2>
                <p className="text-xs text-slate-500">Individual Partner Cash and Bank holdings</p>
              </div>
              <button onClick={() => setShowPartnerModal(true)} className="px-3.5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl">
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

      {/* MODALS */}
      {pickerActiveIndex !== null && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex justify-between items-center pb-3 border-b">
              <h3 className="font-black text-base text-slate-900">Select Item Batch</h3>
              <button onClick={() => setPickerActiveIndex(null)} className="text-slate-400">{getIcon("X", { size: 20 })}</button>
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

      {showBorrowerModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-3">
            <h3 className="font-bold text-base text-slate-900">Add New Borrower</h3>
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
                placeholder="Opening Borrowed Balance (₹)"
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

      {showExpenseModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-3">
            <h3 className="font-bold text-base text-slate-900">Record Shop Expense</h3>
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

      {showProcureModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-3">
            <h3 className="font-bold text-base text-slate-900">Add Procurement</h3>
            <form onSubmit={saveProcurement} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Supplier Name (e.g. JB Company)"
                className="w-full p-2.5 border rounded-xl text-sm"
                value={procureForm.supplier_name}
                onChange={(e) => setProcureForm({ ...procureForm, supplier_name: e.target.value })}
              />
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Item Name (Pick existing or type new)</label>
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
                <input
                  type="number"
                  required
                  placeholder="Qty"
                  className="p-2.5 border rounded-xl text-xs font-bold"
                  value={procureForm.procured_qty}
                  onChange={(e) => setProcureForm({ ...procureForm, procured_qty: e.target.value })}
                />
                <input
                  type="number"
                  required
                  placeholder="Cost Rate"
                  className="p-2.5 border rounded-xl text-xs font-bold"
                  value={procureForm.purchase_rate}
                  onChange={(e) => setProcureForm({ ...procureForm, purchase_rate: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Selling Rate"
                  className="p-2.5 border rounded-xl text-xs font-bold text-indigo-600"
                  value={procureForm.selling_rate}
                  onChange={(e) => setProcureForm({ ...procureForm, selling_rate: e.target.value })}
                />
              </div>

              <select
                required
                className="w-full p-2.5 border rounded-xl text-xs font-semibold"
                value={procureForm.p1_id}
                onChange={(e) => setProcureForm({ ...procureForm, p1_id: e.target.value })}
              >
                <option value="">-- Funded by Partner 1 --</option>
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <div className="flex gap-2">
                <button type="button" onClick={() => setShowProcureModal(false)} className="flex-1 py-2 border rounded-xl text-xs font-bold">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs">Save Stock</button>
              </div>
            </form>
          </div>
        </div>
      )}

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

      {showCustModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-3">
            <h3 className="font-bold text-base text-slate-900">Add Customer</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              await db.from("customers").insert([{
                name: custForm.name.trim(),
                mobile: custForm.mobile.trim(),
                old_due: Number(custForm.old_due || 0)
              }]);
              setShowCustModal(false);
              refreshData();
            }} className="space-y-3">
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

      {showCollectModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-3">
            <h3 className="font-bold text-base text-slate-900">Collect Due</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              const amt = Number(collectForm.amount || 0);
              await db.from("collections").insert([{
                customer_id: Number(collectForm.customer_id),
                amount: amt,
                payment_mode: collectForm.payment_mode,
                receiver_id: Number(collectForm.receiver_id)
              }]);
              const cust = customers.find((c) => c.id == collectForm.customer_id);
              if (cust) {
                await db.from("customers").update({ old_due: Math.max(0, Number(cust.old_due || 0) - amt) }).eq("id", cust.id);
              }
              setShowCollectModal(false);
              refreshData();
            }} className="space-y-3">
              <select
                required
                className="w-full p-2.5 border rounded-xl text-xs font-semibold"
                value={collectForm.customer_id}
                onChange={(e) => {
                  const c = customers.find((x) => x.id == e.target.value);
                  setCollectForm({ ...collectForm, customer_id: e.target.value, amount: c ? c.old_due : "" });
                }}
              >
                <option value="">-- Choose Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} (Due: {money(c.old_due)})</option>
                ))}
              </select>

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
                <button type="submit" className="flex-1 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">Save Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
