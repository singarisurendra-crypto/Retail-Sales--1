"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  LayoutDashboard,
  ShoppingCart,
  PackagePlus,
  Users,
  WalletCards,
  FileSpreadsheet,
  Plus,
  Trash2,
  Edit2,
  Menu,
  X,
  IndianRupee,
  Receipt,
  Search,
  ChevronRight,
  Printer,
  Share2,
  Layers,
  CreditCard,
  FileText,
  AlertCircle
} from "lucide-react";

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
  // Navigation
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
  const [loading, setLoading] = useState(true);

  // Modals
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showCustModal, setShowCustModal] = useState(false);
  const [showProcureModal, setShowProcureModal] = useState(false);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showCategoryMasterModal, setShowCategoryMasterModal] = useState(false);
  const [printInvoiceData, setPrintInvoiceData] = useState(null);

  // Stock Picker Modal
  const [pickerActiveIndex, setPickerActiveIndex] = useState(null);
  const [stockSearchQuery, setStockSearchQuery] = useState("");

  // Customer Form State
  const [editingCustId, setEditingCustId] = useState(null);
  const [custForm, setCustForm] = useState({ name: "", mobile: "", old_due: "" });

  // Partner Form State
  const [partnerForm, setPartnerForm] = useState({ name: "", opening_cash: "", opening_upi: "" });

  // Procurement Form State
  const [editingProcureId, setEditingProcureId] = useState(null);
  const [procureForm, setProcureForm] = useState({
    supplier_name: "",
    item_name: "",
    procured_qty: "",
    remaining_qty: "",
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

  // Expense Form State
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    category_id: "",
    amount: "",
    payment_mode: "Cash",
    paid_by_id: "",
    expense_date: new Date().toISOString().split("T")[0],
    notes: ""
  });
  const [newCategoryName, setNewCategoryName] = useState("");

  // Collection State
  const [collectForm, setCollectForm] = useState({
    customer_id: "",
    invoice_id: "",
    amount: "",
    payment_mode: "Cash",
    receiver_id: ""
  });

  // Sales Entry State
  const [selectedCust, setSelectedCust] = useState(null);
  const [saleDate, setSaleDate] = useState(new Date().toISOString().split("T")[0]);
  const [cart, setCart] = useState([
    { procure_id: "", item_name: "", supplier_name: "", purchase_rate: 0, rate: "", qty: "1", total: 0, max_qty: 0 }
  ]);
  const [upfrontAmount, setUpfrontAmount] = useState("");
  const [upfrontMode, setUpfrontMode] = useState("Cash");
  const [upfrontPartnerId, setUpfrontPartnerId] = useState("");
  const [savingSale, setSavingSale] = useState(false);

  // Reports Filter State
  const [reportStartDate, setReportStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0]
  );
  const [reportEndDate, setReportEndDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      const [p, pr, c, inv, col, exp, cats] = await Promise.all([
        db.from("receivers").select("*").order("name", { ascending: true }),
        db.from("procurements").select("*").order("created_at", { ascending: false }),
        db.from("customers").select("*").order("name", { ascending: true }),
        db.from("invoices").select("*").order("created_at", { ascending: false }),
        db.from("collections").select("*").order("created_at", { ascending: false }),
        db.from("expenses").select("*").order("expense_date", { ascending: false }),
        db.from("expense_categories").select("*").order("name", { ascending: true })
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
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Partner Real-Time Balances
  const partnerAccounts = useMemo(() => {
    return partners.map((partner) => {
      const pid = partner.id;

      const initCash = Number(partner.opening_cash || 0);
      const initUpi = Number(partner.opening_upi || 0);

      const saleUpfrontCash = invoices
        .filter((i) => i.upfront_receiver_id == pid && i.upfront_mode === "Cash")
        .reduce((sum, i) => sum + Number(i.upfront_paid || 0), 0);
      const saleUpfrontUpi = invoices
        .filter((i) => i.upfront_receiver_id == pid && i.upfront_mode === "UPI")
        .reduce((sum, i) => sum + Number(i.upfront_paid || 0), 0);

      const colCash = collections
        .filter((c) => c.receiver_id == pid && c.payment_mode === "Cash")
        .reduce((sum, c) => sum + Number(c.amount || 0), 0);
      const colUpi = collections
        .filter((c) => c.receiver_id == pid && c.payment_mode === "UPI")
        .reduce((sum, c) => sum + Number(c.amount || 0), 0);

      const procureCashOut = procurements.reduce((sum, p) => {
        let amt = 0;
        if (p.p1_id == pid && p.p1_mode === "Cash") amt += Number(p.p1_amount || 0);
        if (p.p2_id == pid && p.p2_mode === "Cash") amt += Number(p.p2_amount || 0);
        return sum + amt;
      }, 0);

      const procureUpiOut = procurements.reduce((sum, p) => {
        let amt = 0;
        if (p.p1_id == pid && p.p1_mode === "UPI") amt += Number(p.p1_amount || 0);
        if (p.p2_id == pid && p.p2_mode === "UPI") amt += Number(p.p2_amount || 0);
        return sum + amt;
      }, 0);

      const expenseCashOut = (expenses || [])
        .filter((e) => e.paid_by_id == pid && e.payment_mode === "Cash")
        .reduce((sum, e) => sum + Number(e.amount || 0), 0);
      const expenseUpiOut = (expenses || [])
        .filter((e) => e.paid_by_id == pid && e.payment_mode === "UPI")
        .reduce((sum, e) => sum + Number(e.amount || 0), 0);

      const netCash = initCash + saleUpfrontCash + colCash - procureCashOut - expenseCashOut;
      const netUpi = initUpi + saleUpfrontUpi + colUpi - procureUpiOut - expenseUpiOut;

      return {
        ...partner,
        initCash,
        initUpi,
        netCash,
        netUpi,
        totalBalance: netCash + netUpi
      };
    });
  }, [partners, invoices, collections, procurements, expenses]);

  // Business Summary
  const businessSummary = useMemo(() => {
    const totalSales = invoices.reduce((s, i) => s + Number(i.total_amount || 0), 0);
    const totalMarketDues = customers.reduce((s, c) => s + Number(c.old_due || 0), 0);
    const totalExpenses = (expenses || []).reduce((s, e) => s + Number(e.amount || 0), 0);
    const stockUnits = procurements.reduce((s, p) => s + Number(p.remaining_qty || 0), 0);
    const stockValuation = procurements.reduce(
      (s, p) => s + Number(p.remaining_qty || 0) * Number(p.purchase_rate || 0),
      0
    );
    const totalCashInHand = partnerAccounts.reduce((s, p) => s + p.netCash, 0);
    const totalUpiInBank = partnerAccounts.reduce((s, p) => s + p.netUpi, 0);

    return { totalSales, totalMarketDues, totalExpenses, stockUnits, stockValuation, totalCashInHand, totalUpiInBank };
  }, [invoices, customers, expenses, procurements, partnerAccounts]);

  // Report Filtering
  const reportFiltered = useMemo(() => {
    const filteredInvoices = invoices.filter((i) => {
      const d = i.invoice_date || i.created_at?.slice(0, 10);
      return (!reportStartDate || d >= reportStartDate) && (!reportEndDate || d <= reportEndDate);
    });

    const filteredExpenses = (expenses || []).filter((e) => {
      const d = e.expense_date || e.created_at?.slice(0, 10);
      return (!reportStartDate || d >= reportStartDate) && (!reportEndDate || d <= reportEndDate);
    });

    const salesTotal = filteredInvoices.reduce((s, i) => s + Number(i.total_amount || 0), 0);
    const expensesTotal = filteredExpenses.reduce((s, e) => s + Number(e.amount || 0), 0);

    let estimatedCost = 0;
    filteredInvoices.forEach((inv) => {
      if (Array.isArray(inv.items)) {
        inv.items.forEach((item) => {
          estimatedCost += Number(item.purchase_rate || 0) * Number(item.qty || 0);
        });
      }
    });

    const estimatedGrossProfit = Math.max(0, salesTotal - estimatedCost);
    const netProfit = estimatedGrossProfit - expensesTotal;

    return {
      filteredInvoices,
      filteredExpenses,
      salesTotal,
      expensesTotal,
      estimatedGrossProfit,
      netProfit
    };
  }, [invoices, expenses, reportStartDate, reportEndDate]);

  // Cart Management
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

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.total || 0), 0);
  }, [cart]);

  const upfrontPaidNum = Number(upfrontAmount || 0);
  const remainingBillDue = Math.max(0, cartTotal - upfrontPaidNum);

  const customerUnpaidInvoices = useMemo(() => {
    if (!collectForm.customer_id) return [];
    return invoices.filter((i) => i.customer_id == collectForm.customer_id && Number(i.balance_due || 0) > 0);
  }, [collectForm.customer_id, invoices]);

  const filteredStock = useMemo(() => {
    return procurements
      .filter((p) => Number(p.remaining_qty) > 0)
      .filter((p) => {
        if (!stockSearchQuery) return true;
        const q = stockSearchQuery.toLowerCase();
        return (
          p.item_name?.toLowerCase().includes(q) ||
          p.supplier_name?.toLowerCase().includes(q)
        );
      });
  }, [procurements, stockSearchQuery]);

  // Save Sale Invoice
  const saveSaleInvoice = async () => {
    if (!selectedCust) return alert("Select a customer");
    if (cart.some((c) => !c.procure_id || Number(c.qty) <= 0)) {
      return alert("Select items from stock with valid quantities");
    }

    if (upfrontPaidNum > cartTotal) {
      return alert("Upfront payment cannot be greater than bill total");
    }

    if (upfrontPaidNum > 0 && !upfrontPartnerId) {
      return alert("Select which partner received the upfront payment");
    }

    setSavingSale(true);
    try {
      const status = upfrontPaidNum === 0 ? "Unpaid" : upfrontPaidNum >= cartTotal ? "Paid" : "Partial";

      const datePrefix = (saleDate || new Date().toISOString().split("T")[0]).replace(/-/g, "").slice(2);
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const generatedInvoiceNumber = `INV-${datePrefix}-${randomSuffix}`;

      const invoiceRecord = {
        invoice_number: generatedInvoiceNumber,
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

      let { data: invData, error: invErr } = await db
        .from("invoices")
        .insert([invoiceRecord])
        .select();

      if (invErr && invErr.message?.includes("column")) {
        const safeRecord = {
          invoice_number: generatedInvoiceNumber,
          customer_id: selectedCust.id,
          customer_name: selectedCust.name,
          invoice_date: saleDate,
          total_amount: cartTotal,
          status: status
        };
        const safeRes = await db.from("invoices").insert([safeRecord]).select();
        if (safeRes.error) throw safeRes.error;
        invData = safeRes.data;
      } else if (invErr) {
        throw invErr;
      }

      for (const line of cart) {
        const batch = procurements.find((p) => p.id == line.procure_id);
        if (batch) {
          const rem = Math.max(0, Number(batch.remaining_qty) - Number(line.qty));
          await db.from("procurements").update({ remaining_qty: rem }).eq("id", batch.id);
        }
      }

      if (remainingBillDue > 0) {
        const newTotalCustomerDue = Number(selectedCust.old_due || 0) + remainingBillDue;
        await db.from("customers").update({ old_due: newTotalCustomerDue }).eq("id", selectedCust.id);
      }

      const savedInv = invData && invData[0] ? invData[0] : invoiceRecord;
      alert(`Invoice saved! Bill Due: ${money(remainingBillDue)}`);

      setPrintInvoiceData({
        ...savedInv,
        invoice_number: generatedInvoiceNumber,
        customer_phone: selectedCust.mobile,
        items: invoiceRecord.items
      });

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

  // WhatsApp Share Helper
  const handleShareWhatsApp = (inv) => {
    const cust = customers.find((c) => c.id === inv.customer_id) || { mobile: inv.customer_phone || "" };
    const rawMobile = cust.mobile || "";
    const cleanMobile = rawMobile.replace(/[^0-9]/g, "");

    let itemLines = "";
    if (Array.isArray(inv.items)) {
      itemLines = inv.items
        .map((i, idx) => `${idx + 1}. *${i.item_name}* - ${i.qty} Qty x ₹${i.rate} = ₹${i.total}`)
        .join("\n");
    }

    const message = `🧾 *INVOICE: B REDDY SALES*
Date: ${inv.invoice_date || inv.created_at?.slice(0, 10)}
Bill No: ${inv.invoice_number || "INV-" + inv.id}
Customer: ${inv.customer_name}

*Items:*
${itemLines || "Goods / Wholesale Supplies"}

--------------------------------
*Total Amount:* ₹${Number(inv.total_amount || 0).toLocaleString("en-IN")}
*Upfront Paid:* ₹${Number(inv.upfront_paid || 0).toLocaleString("en-IN")}
*Balance Due:* ₹${Number(inv.balance_due || 0).toLocaleString("en-IN")}
*Status:* ${inv.status || (inv.balance_due > 0 ? "Due" : "Paid")}
--------------------------------
Thank you for your business!`;

    const encoded = encodeURIComponent(message);
    const targetUrl = cleanMobile.length >= 10
      ? `https://wa.me/${cleanMobile.length === 10 ? "91" + cleanMobile : cleanMobile}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;

    window.open(targetUrl, "_blank");
  };

  // Expenses Category Management
  const saveExpenseCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return alert("Enter category name");
    try {
      const { error } = await db.from("expense_categories").insert([{ name: newCategoryName.trim() }]);
      if (error) throw error;
      setNewCategoryName("");
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteExpenseCategory = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      const { error } = await db.from("expense_categories").delete().eq("id", id);
      if (error) throw error;
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Expenses Save
  const saveExpense = async (e) => {
    e.preventDefault();
    const amt = Number(expenseForm.amount || 0);
    if (amt <= 0) return alert("Enter valid expense amount");
    if (!expenseForm.title.trim()) return alert("Enter expense title");
    if (!expenseForm.paid_by_id) return alert("Select who paid for this expense");

    const cat = expenseCategories.find((c) => c.id == expenseForm.category_id);

    try {
      const { error } = await db.from("expenses").insert([
        {
          title: expenseForm.title.trim(),
          category_id: expenseForm.category_id ? Number(expenseForm.category_id) : null,
          category_name: cat ? cat.name : "General",
          amount: amt,
          payment_mode: expenseForm.payment_mode,
          paid_by_id: Number(expenseForm.paid_by_id),
          expense_date: expenseForm.expense_date,
          notes: expenseForm.notes.trim()
        }
      ]);
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
      alert("Expense recorded successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteExpense = async (id) => {
    if (!confirm("Are you sure you want to delete this expense voucher?")) return;
    try {
      const { error } = await db.from("expenses").delete().eq("id", id);
      if (error) throw error;
      refreshData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Customer Management
  const saveCustomer = async (e) => {
    e.preventDefault();
    if (!custForm.name.trim()) return alert("Customer name is required");
    const payload = {
      name: custForm.name.trim(),
      mobile: custForm.mobile.trim(),
      old_due: Number(custForm.old_due || 0)
    };

    const query = editingCustId
      ? db.from("customers").update(payload).eq("id", editingCustId)
      : db.from("customers").insert([payload]);

    const { error } = await query;
    if (!error) {
      setEditingCustId(null);
      setCustForm({ name: "", mobile: "", old_due: "" });
      setShowCustModal(false);
      refreshData();
    } else {
      alert(error.message);
    }
  };

  const handleEditCustomer = (c) => {
    setEditingCustId(c.id);
    setCustForm({ name: c.name, mobile: c.mobile || "", old_due: c.old_due || "" });
    setShowCustModal(true);
  };

  const handleDeleteCustomer = async (c) => {
    if (!confirm(`Delete customer "${c.name}"?`)) return;
    const { error } = await db.from("customers").delete().eq("id", c.id);
    if (!error) {
      if (selectedCust?.id === c.id) setSelectedCust(null);
      refreshData();
    } else {
      alert(error.message);
    }
  };

  // Due Collection
  const saveCollection = async (e) => {
    e.preventDefault();
    const amt = Number(collectForm.amount || 0);
    if (amt <= 0) return alert("Enter valid collection amount");
    if (!collectForm.receiver_id) return alert("Select receiver partner");

    try {
      const isBillWise = Boolean(collectForm.invoice_id);
      const collRecord = {
        customer_id: Number(collectForm.customer_id),
        invoice_id: isBillWise ? Number(collectForm.invoice_id) : null,
        collection_type: isBillWise ? "Bill Wise" : "On Account",
        amount: amt,
        payment_mode: collectForm.payment_mode,
        receiver_id: Number(collectForm.receiver_id)
      };

      const { error: collErr } = await db.from("collections").insert([collRecord]);
      if (collErr) throw collErr;

      if (isBillWise) {
        const targetInv = invoices.find((i) => i.id == collectForm.invoice_id);
        if (targetInv) {
          const newInvDue = Math.max(0, Number(targetInv.balance_due || 0) - amt);
          await db.from("invoices").update({ balance_due: newInvDue, status: newInvDue === 0 ? "Paid" : "Partial" }).eq("id", targetInv.id);
        }
      }

      const targetCust = customers.find((c) => c.id == collectForm.customer_id);
      if (targetCust) {
        const updatedTotalDue = Math.max(0, Number(targetCust.old_due || 0) - amt);
        await db.from("customers").update({ old_due: updatedTotalDue }).eq("id", targetCust.id);
      }

      setShowCollectModal(false);
      setCollectForm({ customer_id: "", invoice_id: "", amount: "", payment_mode: "Cash", receiver_id: "" });
      refreshData();
      alert("Payment recorded successfully!");
    } catch (err) {
      alert(err.message);
    }
  };

  // Partner Management
  const savePartner = async (e) => {
    e.preventDefault();
    const { error } = await db.from("receivers").insert([
      {
        name: partnerForm.name.trim(),
        opening_cash: Number(partnerForm.opening_cash || 0),
        opening_upi: Number(partnerForm.opening_upi || 0)
      }
    ]);
    if (!error) {
      setPartnerForm({ name: "", opening_cash: "", opening_upi: "" });
      setShowPartnerModal(false);
      refreshData();
    } else {
      alert(error.message);
    }
  };

  // Procurement Management
  const handleEditProcurement = (p) => {
    setEditingProcureId(p.id);
    setProcureForm({
      supplier_name: p.supplier_name === "Opening Stock" ? "" : p.supplier_name || "",
      item_name: p.item_name || "",
      procured_qty: p.procured_qty || "",
      remaining_qty: p.remaining_qty ?? p.procured_qty ?? "",
      purchase_rate: p.purchase_rate || "",
      selling_rate: p.selling_rate || "",
      is_opening: p.supplier_name === "Opening Stock",
      p1_id: p.p1_id ? String(p.p1_id) : "",
      p1_amount: p.p1_amount || "",
      p1_mode: p.p1_mode || "Cash",
      split_p2: Boolean(p.p2_id),
      p2_id: p.p2_id ? String(p.p2_id) : "",
      p2_amount: p.p2_amount || "",
      p2_mode: p.p2_mode || "UPI"
    });
    setShowProcureModal(true);
  };

  const handleDeleteProcurement = async (p) => {
    if (!confirm(`Delete batch "${p.item_name}"?`)) return;
    try {
      const { error } = await db.from("procurements").delete().eq("id", p.id);
      if (error) throw error;
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

    let remaining = qty;
    if (editingProcureId) {
      const existing = procurements.find((p) => p.id === editingProcureId);
      if (existing) {
        const soldQty = Math.max(0, Number(existing.procured_qty || 0) - Number(existing.remaining_qty || 0));
        remaining = Math.max(0, qty - soldQty);
      }
    }

    const fullRecord = {
      supplier_name: procureForm.is_opening ? "Opening Stock" : procureForm.supplier_name.trim() || "Vendor",
      item_name: procureForm.item_name.trim(),
      procured_qty: qty,
      remaining_qty: remaining,
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
        const { error } = await db.from("procurements").update(fullRecord).eq("id", editingProcureId);
        if (error) throw error;
      } else {
        const { error } = await db.from("procurements").insert([fullRecord]);
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
      {/* Mobile Top App Bar */}
      <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-sm">B</div>
          <span className="font-bold text-sm tracking-wide">B Reddy Sales</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 -mr-1 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
          aria-label="Toggle Menu"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </header>

      {/* SIDEBAR NAVIGATION */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen w-72 bg-slate-900 text-slate-300 flex flex-col justify-between z-40 transition-transform duration-200 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="overflow-y-auto">
          <div className="p-6 border-b border-slate-800 hidden md:flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-600/30">
              B
            </div>
            <div>
              <h1 className="font-black text-white text-base tracking-wide leading-tight">B REDDY SALES</h1>
              <p className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold">Wholesale & Retail</p>
            </div>
          </div>

          <nav className="p-3 space-y-1 mt-2">
            {[
              { id: "sale", label: "Point of Sale (Billing)", icon: ShoppingCart },
              { id: "summary", label: "Business Summary", icon: LayoutDashboard },
              { id: "invoices", label: "Invoices & Bills", icon: FileSpreadsheet },
              { id: "expenses", label: "Expenses Management", icon: CreditCard },
              { id: "reports", label: "Reports & P&L", icon: FileText },
              { id: "customers", label: "Customers & Dues", icon: Users },
              { id: "procurement", label: "Procurements & Stock", icon: PackagePlus },
              { id: "partners", label: "Partner Accounts", icon: WalletCards }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "hover:bg-slate-800 hover:text-white text-slate-400"
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => {
              setShowCollectModal(true);
              setSidebarOpen(false);
            }}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition"
          >
            <IndianRupee size={16} /> Collect Due (Bill/Account)
          </button>
        </div>
      </aside>

      {/* BACKDROP FOR MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-xs"
        />
      )}

      {/* RIGHT WORKSPACE */}
      <main className="flex-1 p-3.5 sm:p-6 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* VIEW 1: POINT OF SALE (BILLING) */}
        {activeTab === "sale" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
            <div className="lg:col-span-8 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="font-black text-lg text-slate-900 leading-tight">Create Sales Invoice</h2>
                  <p className="text-xs text-slate-400">Bills go to customer credit by default unless paid upfront</p>
                </div>
                <input
                  type="date"
                  className="w-full sm:w-auto px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                />
              </div>

              {/* Customer Selector */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Customer *</label>
                  <button
                    onClick={() => {
                      setEditingCustId(null);
                      setCustForm({ name: "", mobile: "", old_due: "" });
                      setShowCustModal(true);
                    }}
                    className="text-xs font-bold text-indigo-600 hover:underline active:text-indigo-700"
                  >
                    + Add New Customer
                  </button>
                </div>
                <select
                  className="w-full p-3 bg-white border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
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
                {selectedCust && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-xs flex flex-wrap gap-x-4 gap-y-1 text-slate-600">
                    <span>Phone: <b className="text-slate-900">{selectedCust.mobile || "N/A"}</b></span>
                    <span>Existing Market Due: <b className="text-rose-600">{money(selectedCust.old_due)}</b></span>
                  </div>
                )}
              </div>

              {/* Stock Items Cart */}
              <div>
                <div className="flex justify-between items-center mb-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Stock Items to Bill *</label>
                  <button
                    onClick={() =>
                      setCart([
                        ...cart,
                        { procure_id: "", item_name: "", supplier_name: "", purchase_rate: 0, rate: "", qty: "1", total: 0, max_qty: 0 }
                      ])
                    }
                    className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline active:text-indigo-700"
                  >
                    <Plus size={15} /> Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {cart.map((line, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200 space-y-2.5">
                      {/* Item Selector Picker */}
                      <div>
                        <button
                          type="button"
                          onClick={() => {
                            setPickerActiveIndex(idx);
                            setStockSearchQuery("");
                          }}
                          className={`w-full p-3 rounded-xl text-xs font-bold text-left flex items-center justify-between border transition ${
                            line.procure_id
                              ? "bg-white border-indigo-200 text-slate-900 shadow-xs"
                              : "bg-white border-dashed border-slate-300 text-slate-400 hover:border-indigo-400"
                          }`}
                        >
                          <div className="truncate">
                            {line.procure_id ? (
                              <div className="flex items-center gap-2">
                                <span className="text-indigo-600 font-black text-sm">{line.item_name}</span>
                                <span className="text-slate-400 font-medium text-[11px]">[{line.supplier_name}]</span>
                              </div>
                            ) : (
                              <span>🔍 Select Item from Stock...</span>
                            )}
                          </div>
                          <ChevronRight size={16} className="text-slate-400 shrink-0 ml-2" />
                        </button>
                      </div>

                      {/* Line Inputs: Optimized for Mobile Touch */}
                      <div className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-5 sm:col-span-4">
                          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Rate (₹)</label>
                          <input
                            type="number"
                            placeholder="Selling Rate"
                            className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500"
                            value={line.rate}
                            onChange={(e) => updateCart(idx, "rate", e.target.value)}
                          />
                        </div>

                        <div className="col-span-3 sm:col-span-3">
                          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Qty</label>
                          <input
                            type="number"
                            min="1"
                            max={line.max_qty || 9999}
                            placeholder="1"
                            className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-center outline-none focus:ring-2 focus:ring-indigo-500"
                            value={line.qty}
                            onChange={(e) => updateCart(idx, "qty", e.target.value)}
                          />
                        </div>

                        <div className="col-span-3 sm:col-span-4 text-right">
                          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Total</label>
                          <span className="font-black text-xs sm:text-sm text-slate-900 block truncate">
                            {money(line.total)}
                          </span>
                        </div>

                        <div className="col-span-1 sm:col-span-1 flex justify-end">
                          <button
                            onClick={() => cart.length > 1 && setCart(cart.filter((_, i) => i !== idx))}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Remove Line"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bill Summary Column */}
            <div className="lg:col-span-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 h-fit">
              <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">Bill & Payment Terms</h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Current Bill Total:</span>
                  <span className="font-bold text-slate-800 text-sm">{money(cartTotal)}</span>
                </div>
                {selectedCust && (
                  <div className="flex justify-between text-rose-600">
                    <span>Previous Outstanding:</span>
                    <span className="font-bold">{money(selectedCust.old_due)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-black pt-2 border-t text-slate-900">
                  <span>Total Payable:</span>
                  <span>{money(cartTotal + Number(selectedCust?.old_due || 0))}</span>
                </div>
              </div>

              {/* Upfront Payment Section */}
              <div className="bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Upfront Payment</label>
                  <span className="text-[10px] text-slate-400">Leave 0 for full credit</span>
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-3 text-xs text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full pl-7 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-black text-emerald-600 outline-none focus:ring-2 focus:ring-emerald-500"
                    value={upfrontAmount}
                    onChange={(e) => setUpfrontAmount(e.target.value)}
                  />
                </div>

                {upfrontPaidNum > 0 && (
                  <div className="space-y-2.5 pt-2 border-t border-slate-200">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setUpfrontMode("Cash")}
                        className={`py-2 rounded-xl text-xs font-bold border transition ${
                          upfrontMode === "Cash" ? "bg-emerald-600 text-white border-emerald-600" : "bg-white border-slate-300"
                        }`}
                      >
                        💵 Cash
                      </button>
                      <button
                        type="button"
                        onClick={() => setUpfrontMode("UPI")}
                        className={`py-2 rounded-xl text-xs font-bold border transition ${
                          upfrontMode === "UPI" ? "bg-indigo-600 text-white border-indigo-600" : "bg-white border-slate-300"
                        }`}
                      >
                        📱 UPI
                      </button>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-500 block mb-1">Partner Receiving *</label>
                      <select
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold outline-none"
                        value={upfrontPartnerId}
                        onChange={(e) => setUpfrontPartnerId(e.target.value)}
                      >
                        {partners.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>
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
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-black rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-indigo-600/20 active:scale-98"
              >
                {savingSale ? "Saving Bill..." : "Save Invoice & Update Ledger"}
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: EXECUTIVE SUMMARY */}
        {activeTab === "summary" && (
          <div className="space-y-5 md:space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">Executive Overview</h2>
              <p className="text-xs text-slate-500">Live operational snapshot across partners, dues, and inventory</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Sales</p>
                <h3 className="text-lg sm:text-2xl font-black text-slate-900 mt-1 truncate">{money(businessSummary.totalSales)}</h3>
                <span className="text-[10px] text-slate-400">{invoices.length} invoices</span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Market Dues</p>
                <h3 className="text-lg sm:text-2xl font-black text-rose-600 mt-1 truncate">{money(businessSummary.totalMarketDues)}</h3>
                <span className="text-[10px] text-slate-400">Pending collections</span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Expenses</p>
                <h3 className="text-lg sm:text-2xl font-black text-amber-600 mt-1 truncate">{money(businessSummary.totalExpenses)}</h3>
                <span className="text-[10px] text-slate-400">{expenses.length} vouchers</span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
                <p className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">Net Cash & Bank</p>
                <h3 className="text-lg sm:text-2xl font-black text-emerald-600 mt-1 truncate">
                  {money(businessSummary.totalCashInHand + businessSummary.totalUpiInBank)}
                </h3>
                <span className="text-[10px] text-slate-400">
                  Cash: {money(businessSummary.totalCashInHand)}
                </span>
              </div>
            </div>

            {/* Partner Passbooks */}
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base text-slate-900">Partner Cash / UPI Balances</h3>
                <button
                  onClick={() => setShowPartnerModal(true)}
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <Plus size={14} /> Add Partner
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {partnerAccounts.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-black text-base text-slate-900">{p.name}</h4>
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg">
                        Total: {money(p.totalBalance)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="text-slate-400 text-[11px]">Cash In Hand</span>
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

        {/* VIEW 3: INVOICES (RESPONSIVE CARDS ON MOBILE, TABLE ON DESKTOP) */}
        {activeTab === "invoices" && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Invoices & Bill Status</h2>
              <p className="text-xs text-slate-500">Print receipt or share directly via WhatsApp</p>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-slate-400 uppercase tracking-wider font-bold bg-slate-50">
                    <th className="p-3">Bill #</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Paid</th>
                    <th className="p-3">Due</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700 font-medium">
                  {invoices.map((inv) => {
                    const due = Number(inv.balance_due || 0);
                    return (
                      <tr key={inv.id}>
                        <td className="p-3 font-bold text-slate-900">{inv.invoice_number || `INV-${inv.id}`}</td>
                        <td className="p-3">{inv.invoice_date || inv.created_at?.slice(0, 10)}</td>
                        <td className="p-3 font-bold">{inv.customer_name}</td>
                        <td className="p-3">{money(inv.total_amount)}</td>
                        <td className="p-3 text-emerald-600 font-semibold">{money(inv.upfront_paid)}</td>
                        <td className="p-3 font-black text-rose-600">{money(due)}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              due === 0 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {due === 0 ? "Paid" : "Due"}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setPrintInvoiceData(inv)}
                              className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                              title="Print Receipt"
                            >
                              <Printer size={16} />
                            </button>
                            <button
                              onClick={() => handleShareWhatsApp(inv)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                              title="Share on WhatsApp"
                            >
                              <Share2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden space-y-3">
              {invoices.map((inv) => {
                const due = Number(inv.balance_due || 0);
                return (
                  <div key={inv.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[11px] font-bold text-indigo-600 uppercase">{inv.invoice_number || `INV-${inv.id}`}</span>
                        <h4 className="font-black text-sm text-slate-900">{inv.customer_name}</h4>
                        <span className="text-[11px] text-slate-400">{inv.invoice_date || inv.created_at?.slice(0, 10)}</span>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          due === 0 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {due === 0 ? "Paid" : "Due"}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 pt-2 border-t border-slate-200 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Total</span>
                        <b className="text-slate-800">{money(inv.total_amount)}</b>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Paid</span>
                        <b className="text-emerald-600">{money(inv.upfront_paid)}</b>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Balance</span>
                        <b className="text-rose-600">{money(due)}</b>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-slate-200">
                      <button
                        onClick={() => setPrintInvoiceData(inv)}
                        className="flex-1 py-2 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Printer size={14} /> Print
                      </button>
                      <button
                        onClick={() => handleShareWhatsApp(inv)}
                        className="flex-1 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Share2 size={14} /> WhatsApp
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 4: EXPENSES MANAGEMENT */}
        {activeTab === "expenses" && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">Expenses & Cash Outflow</h2>
                <p className="text-xs text-slate-500">Record shop costs and manage master categories</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setShowCategoryMasterModal(true)}
                  className="flex-1 sm:flex-none px-3.5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Layers size={15} /> Categories
                </button>
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
                  className="flex-1 sm:flex-none px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Plus size={15} /> Add Expense
                </button>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-slate-400 uppercase tracking-wider font-bold bg-slate-50">
                    <th className="p-3">Date</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Title / Details</th>
                    <th className="p-3">Paid By</th>
                    <th className="p-3">Mode</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700 font-medium">
                  {expenses.map((e) => {
                    const partner = partners.find((p) => p.id == e.paid_by_id);
                    return (
                      <tr key={e.id}>
                        <td className="p-3">{e.expense_date}</td>
                        <td className="p-3 font-bold text-indigo-600">{e.category_name}</td>
                        <td className="p-3 font-semibold text-slate-900">{e.title}</td>
                        <td className="p-3">{partner ? partner.name : "-"}</td>
                        <td className="p-3">{e.payment_mode}</td>
                        <td className="p-3 font-black text-rose-600">{money(e.amount)}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => deleteExpense(e.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden space-y-3">
              {expenses.map((e) => {
                const partner = partners.find((p) => p.id == e.paid_by_id);
                return (
                  <div key={e.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-indigo-600">{e.category_name}</span>
                      <h4 className="font-bold text-sm text-slate-900">{e.title}</h4>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {e.expense_date} • {partner ? partner.name : "N/A"} ({e.payment_mode})
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black text-rose-600 text-sm">{money(e.amount)}</span>
                      <button
                        onClick={() => deleteExpense(e.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 5: REPORTS & P&L */}
        {activeTab === "reports" && (
          <div className="space-y-5">
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Business Reports & P&L</h2>
                  <p className="text-xs text-slate-500">Filter sales, expenses, and profitability by date range</p>
                </div>

                <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
                  <input
                    type="date"
                    className="p-2 border border-slate-200 rounded-xl text-xs font-semibold"
                    value={reportStartDate}
                    onChange={(e) => setReportStartDate(e.target.value)}
                  />
                  <input
                    type="date"
                    className="p-2 border border-slate-200 rounded-xl text-xs font-semibold"
                    value={reportEndDate}
                    onChange={(e) => setReportEndDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-bold text-slate-400 uppercase">Sales Revenue</span>
                  <h3 className="text-xl font-black text-slate-900 mt-1">{money(reportFiltered.salesTotal)}</h3>
                  <span className="text-[11px] text-slate-500">{reportFiltered.filteredInvoices.length} bills in range</span>
                </div>

                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
                  <span className="text-xs font-bold text-rose-500 uppercase">Operating Expenses</span>
                  <h3 className="text-xl font-black text-rose-700 mt-1">{money(reportFiltered.expensesTotal)}</h3>
                  <span className="text-[11px] text-rose-600">{reportFiltered.filteredExpenses.length} entries</span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-600 uppercase">Net Estimated Profit</span>
                  <h3 className="text-xl font-black text-emerald-700 mt-1">{money(reportFiltered.netProfit)}</h3>
                  <span className="text-[11px] text-emerald-600 font-semibold">After all overheads</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 6: CUSTOMERS & DUES */}
        {activeTab === "customers" && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-slate-900">Customers Directory</h2>
                <p className="text-xs text-slate-500">Manage customer balances and collections</p>
              </div>
              <button
                onClick={() => {
                  setEditingCustId(null);
                  setCustForm({ name: "", mobile: "", old_due: "" });
                  setShowCustModal(true);
                }}
                className="px-3.5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Plus size={15} /> Add
              </button>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-slate-400 uppercase tracking-wider font-bold bg-slate-50">
                    <th className="p-3">Customer Name</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Total Outstanding</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700 font-medium">
                  {customers.map((c) => (
                    <tr key={c.id}>
                      <td className="p-3 font-bold text-slate-900">{c.name}</td>
                      <td className="p-3">{c.mobile || "-"}</td>
                      <td className="p-3 font-black text-rose-600">{money(c.old_due)}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {Number(c.old_due) > 0 && (
                            <button
                              onClick={() => {
                                setCollectForm({
                                  customer_id: c.id,
                                  invoice_id: "",
                                  amount: c.old_due,
                                  payment_mode: "Cash",
                                  receiver_id: upfrontPartnerId
                                });
                                setShowCollectModal(true);
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg"
                            >
                              Collect Due
                            </button>
                          )}
                          <button onClick={() => handleEditCustomer(c)} className="p-1 text-slate-400 hover:text-indigo-600">
                            <Edit2 size={15} />
                          </button>
                          <button onClick={() => handleDeleteCustomer(c)} className="p-1 text-slate-400 hover:text-rose-600">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden space-y-3">
              {customers.map((c) => (
                <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{c.name}</h4>
                    <span className="text-[11px] text-slate-400 block">{c.mobile || "No phone"}</span>
                    <span className="font-black text-rose-600 text-xs mt-1 block">Due: {money(c.old_due)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {Number(c.old_due) > 0 && (
                      <button
                        onClick={() => {
                          setCollectForm({
                            customer_id: c.id,
                            invoice_id: "",
                            amount: c.old_due,
                            payment_mode: "Cash",
                            receiver_id: upfrontPartnerId
                          });
                          setShowCollectModal(true);
                        }}
                        className="px-2.5 py-1.5 bg-emerald-600 text-white font-bold text-xs rounded-lg"
                      >
                        Collect
                      </button>
                    )}
                    <button onClick={() => handleEditCustomer(c)} className="p-1.5 text-slate-400">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDeleteCustomer(c)} className="p-1.5 text-slate-400 hover:text-rose-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 7: PROCUREMENTS & STOCK */}
        {activeTab === "procurement" && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">Procurements & Inventory</h2>
                <p className="text-xs text-slate-500">Record supplier purchases and manage stock batches</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setEditingProcureId(null);
                    setProcureForm({
                      supplier_name: "Opening Stock",
                      item_name: "",
                      procured_qty: "",
                      remaining_qty: "",
                      purchase_rate: "",
                      selling_rate: "",
                      is_opening: true,
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
                  className="flex-1 sm:flex-none px-3.5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Plus size={15} /> Opening Stock
                </button>
                <button
                  onClick={() => {
                    setEditingProcureId(null);
                    setProcureForm({
                      supplier_name: "",
                      item_name: "",
                      procured_qty: "",
                      remaining_qty: "",
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
                  className="flex-1 sm:flex-none px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
                >
                  <Plus size={15} /> Add Purchase
                </button>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-slate-400 uppercase tracking-wider font-bold bg-slate-50">
                    <th className="p-3">Date</th>
                    <th className="p-3">Supplier</th>
                    <th className="p-3">Item Name</th>
                    <th className="p-3">Total Qty</th>
                    <th className="p-3">Remaining</th>
                    <th className="p-3">Cost Rate</th>
                    <th className="p-3">Sale Rate</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700 font-medium">
                  {procurements.map((p) => (
                    <tr key={p.id}>
                      <td className="p-3">{p.purchase_date || p.created_at?.slice(0, 10)}</td>
                      <td className="p-3 font-bold text-slate-900">{p.supplier_name}</td>
                      <td className="p-3 font-bold text-slate-900">{p.item_name}</td>
                      <td className="p-3">{p.procured_qty}</td>
                      <td className="p-3 font-black text-emerald-600">{p.remaining_qty}</td>
                      <td className="p-3">{money(p.purchase_rate)}</td>
                      <td className="p-3 font-bold text-indigo-600">{money(p.selling_rate || p.purchase_rate)}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => handleEditProcurement(p)} className="p-1 text-slate-400 hover:text-indigo-600">
                            <Edit2 size={15} />
                          </button>
                          <button onClick={() => handleDeleteProcurement(p)} className="p-1 text-slate-400 hover:text-rose-600">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="md:hidden space-y-3">
              {procurements.map((p) => (
                <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400">{p.supplier_name}</span>
                      <h4 className="font-black text-sm text-slate-900">{p.item_name}</h4>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-black bg-emerald-100 text-emerald-800">
                      {p.remaining_qty} in stock
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Purchase Cost</span>
                      <span className="font-bold text-slate-800">{money(p.purchase_rate)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Selling Rate</span>
                      <span className="font-bold text-indigo-600">{money(p.selling_rate || p.purchase_rate)}</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                    <button onClick={() => handleEditProcurement(p)} className="p-1.5 text-slate-500 hover:text-indigo-600">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDeleteProcurement(p)} className="p-1.5 text-slate-400 hover:text-rose-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 8: PARTNER ACCOUNTS */}
        {activeTab === "partners" && (
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-slate-900">Operating Partners</h2>
                <p className="text-xs text-slate-500">Track liquid cash and bank distribution</p>
              </div>
              <button
                onClick={() => setShowPartnerModal(true)}
                className="px-3.5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Plus size={15} /> Add Partner
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {partnerAccounts.map((p) => (
                <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-black text-base text-slate-900">{p.name}</h4>
                    <span className="font-black text-xs text-indigo-600">Total: {money(p.totalBalance)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Cash Holding</span>
                      <b className="text-emerald-600">{money(p.netCash)}</b>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">UPI / Bank</span>
                      <b className="text-indigo-600">{money(p.netUpi)}</b>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* --- RESPONSIVE MODAL: INVOICE PRINT VIEW --- */}
      {printInvoiceData && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-3xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div id="printable-bill" className="p-4 border border-dashed border-slate-300 rounded-2xl space-y-4 font-mono text-xs text-slate-800">
              <div className="text-center border-b pb-3 border-slate-200">
                <h2 className="font-black text-base text-slate-900">B REDDY SALES</h2>
                <p className="text-[11px] text-slate-500">Wholesale & Retail Supplies</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Giddalur, Andhra Pradesh</p>
              </div>

              <div className="flex justify-between text-[11px]">
                <div>
                  <p>Bill: <b>{printInvoiceData.invoice_number || `INV-${printInvoiceData.id || "N/A"}`}</b></p>
                  <p>Customer: <b>{printInvoiceData.customer_name}</b></p>
                </div>
                <div className="text-right">
                  <p>Date: {printInvoiceData.invoice_date || printInvoiceData.created_at?.slice(0, 10)}</p>
                </div>
              </div>

              <table className="w-full text-left text-[11px] border-t border-b border-slate-200 py-2">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="py-1">Item</th>
                    <th className="text-center py-1">Qty</th>
                    <th className="text-right py-1">Rate</th>
                    <th className="text-right py-1">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Array.isArray(printInvoiceData.items) ? (
                    printInvoiceData.items.map((i, idx) => (
                      <tr key={idx}>
                        <td className="py-1">{i.item_name}</td>
                        <td className="text-center py-1">{i.qty}</td>
                        <td className="text-right py-1">₹{i.rate}</td>
                        <td className="text-right py-1 font-bold">₹{i.total}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-2 text-center text-slate-400">Standard Bill Items</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="space-y-1 text-right text-[11px]">
                <p>Bill Total: <b>{money(printInvoiceData.total_amount)}</b></p>
                <p className="text-emerald-700">Amount Paid: <b>{money(printInvoiceData.upfront_paid)}</b></p>
                <p className="text-rose-600 font-bold border-t pt-1">Balance Due: {money(printInvoiceData.balance_due)}</p>
              </div>

              <div className="text-center text-[10px] text-slate-400 pt-2 border-t border-slate-100">
                Thank you! Please visit again.
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-1">
              <button
                type="button"
                onClick={() => setPrintInvoiceData(null)}
                className="flex-1 sm:flex-none px-4 py-2.5 border rounded-xl text-xs font-bold text-slate-600"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => handleShareWhatsApp(printInvoiceData)}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <Share2 size={14} /> WhatsApp
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <Printer size={14} /> Print
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- RESPONSIVE MODAL: STOCK PICKER --- */}
      {pickerActiveIndex !== null && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-end sm:items-center justify-center sm:p-4 z-50">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-base text-slate-900">Select Stock Item</h3>
                <p className="text-xs text-slate-400">Click any batch to populate cart</p>
              </div>
              <button
                onClick={() => setPickerActiveIndex(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="my-3 relative">
              <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Search item or supplier..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
                value={stockSearchQuery}
                onChange={(e) => setStockSearchQuery(e.target.value)}
              />
            </div>

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {filteredStock.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handlePickStockItem(item)}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/40 cursor-pointer transition flex items-center justify-between active:scale-98"
                >
                  <div>
                    <h4 className="font-black text-sm text-slate-900">{item.item_name}</h4>
                    <span className="text-[11px] text-slate-500">Rate: ₹{item.selling_rate || item.purchase_rate}</span>
                  </div>
                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                    {item.remaining_qty} in stock
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-3 mt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setPickerActiveIndex(null)}
                className="w-full sm:w-auto px-4 py-2.5 border rounded-xl text-xs font-bold text-slate-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- RESPONSIVE MODAL: ADD / EDIT CUSTOMER --- */}
      {showCustModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-end sm:items-center justify-center sm:p-4 z-50">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 max-w-sm w-full">
            <h3 className="font-bold text-base text-slate-900 mb-3">
              {editingCustId ? "Edit Customer Details" : "Add New Customer"}
            </h3>
            <form onSubmit={saveCustomer} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Customer Name *</label>
                <input
                  type="text"
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  value={custForm.name}
                  onChange={(e) => setCustForm({ ...custForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Phone Number</label>
                <input
                  type="tel"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  value={custForm.mobile}
                  onChange={(e) => setCustForm({ ...custForm, mobile: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Opening Due (₹)</label>
                <input
                  type="number"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="0"
                  value={custForm.old_due}
                  onChange={(e) => setCustForm({ ...custForm, old_due: e.target.value })}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustModal(false)}
                  className="flex-1 py-2.5 border rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs">
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- RESPONSIVE MODAL: COLLECT DUE --- */}
      {showCollectModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-end sm:items-center justify-center sm:p-4 z-50">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 max-w-sm w-full">
            <h3 className="font-bold text-base text-slate-900 mb-1">Customer Due Collection</h3>
            <p className="text-xs text-slate-400 mb-3">Pay against bill or on general account</p>

            <form onSubmit={saveCollection} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Customer *</label>
                <select
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-semibold"
                  value={collectForm.customer_id}
                  onChange={(e) => {
                    const c = customers.find((x) => x.id == e.target.value);
                    setCollectForm({
                      ...collectForm,
                      customer_id: e.target.value,
                      invoice_id: "",
                      amount: c ? c.old_due : ""
                    });
                  }}
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Due: {money(c.old_due)})
                    </option>
                  ))}
                </select>
              </div>

              {customerUnpaidInvoices.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Select Bill (Optional)</label>
                  <select
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-semibold"
                    value={collectForm.invoice_id}
                    onChange={(e) => {
                      const inv = customerUnpaidInvoices.find((i) => i.id == e.target.value);
                      setCollectForm({
                        ...collectForm,
                        invoice_id: e.target.value,
                        amount: inv ? inv.balance_due : collectForm.amount
                      });
                    }}
                  >
                    <option value="">-- On Account (General Due) --</option>
                    {customerUnpaidInvoices.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.invoice_number || `INV-${inv.id}`} — Due: {money(inv.balance_due)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-black text-emerald-600"
                  value={collectForm.amount}
                  onChange={(e) => setCollectForm({ ...collectForm, amount: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Mode *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCollectForm({ ...collectForm, payment_mode: "Cash" })}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      collectForm.payment_mode === "Cash" ? "bg-emerald-600 text-white border-emerald-600" : "border-slate-300"
                    }`}
                  >
                    💵 Cash
                  </button>
                  <button
                    type="button"
                    onClick={() => setCollectForm({ ...collectForm, payment_mode: "UPI" })}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      collectForm.payment_mode === "UPI" ? "bg-indigo-600 text-white border-indigo-600" : "border-slate-300"
                    }`}
                  >
                    📱 UPI
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Partner Who Received *</label>
                <select
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-semibold"
                  value={collectForm.receiver_id || upfrontPartnerId}
                  onChange={(e) => setCollectForm({ ...collectForm, receiver_id: e.target.value })}
                >
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCollectModal(false)}
                  className="flex-1 py-2.5 border rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-emerald-600 text-white font-bold rounded-xl text-xs">
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- RESPONSIVE MODAL: RECORD EXPENSE --- */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-end sm:items-center justify-center sm:p-4 z-50">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 max-w-sm w-full">
            <h3 className="font-bold text-base text-slate-900 mb-3">Record Shop Expense</h3>
            <form onSubmit={saveExpense} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Category *</label>
                <select
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-semibold"
                  value={expenseForm.category_id}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category_id: e.target.value })}
                >
                  <option value="">-- Choose Category --</option>
                  {expenseCategories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Expense Title / Details *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electric bill / tea"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm"
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-bold text-rose-600"
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-semibold"
                    value={expenseForm.expense_date}
                    onChange={(e) => setExpenseForm({ ...expenseForm, expense_date: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Payment Mode *</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setExpenseForm({ ...expenseForm, payment_mode: "Cash" })}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      expenseForm.payment_mode === "Cash" ? "bg-emerald-600 text-white border-emerald-600" : "border-slate-300"
                    }`}
                  >
                    💵 Cash
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpenseForm({ ...expenseForm, payment_mode: "UPI" })}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      expenseForm.payment_mode === "UPI" ? "bg-indigo-600 text-white border-indigo-600" : "border-slate-300"
                    }`}
                  >
                    📱 UPI
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Partner Who Paid *</label>
                <select
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-xs font-semibold"
                  value={expenseForm.paid_by_id}
                  onChange={(e) => setExpenseForm({ ...expenseForm, paid_by_id: e.target.value })}
                >
                  <option value="">-- Choose Partner --</option>
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="flex-1 py-2.5 border rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs">
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- RESPONSIVE MODAL: ADD / EDIT PROCUREMENT --- */}
      {showProcureModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-end sm:items-center justify-center sm:p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 max-w-md w-full my-auto max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-slate-900 mb-3">
              {editingProcureId ? "Edit Stock Batch" : procureForm.is_opening ? "Add Opening Stock" : "Add Purchase Invoice"}
            </h3>
            <form onSubmit={saveProcurement} className="space-y-3">
              {!procureForm.is_opening && (
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Supplier Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-sm"
                    value={procureForm.supplier_name}
                    onChange={(e) => setProcureForm({ ...procureForm, supplier_name: e.target.value })}
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm"
                  value={procureForm.item_name}
                  onChange={(e) => setProcureForm({ ...procureForm, item_name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Procured Qty *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-bold"
                    value={procureForm.procured_qty}
                    onChange={(e) => setProcureForm({ ...procureForm, procured_qty: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Purchase Cost *</label>
                  <input
                    type="number"
                    required
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-bold"
                    value={procureForm.purchase_rate}
                    onChange={(e) => setProcureForm({ ...procureForm, purchase_rate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Selling Rate (MRP/Sale)</label>
                <input
                  type="number"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm font-bold text-indigo-600"
                  value={procureForm.selling_rate}
                  onChange={(e) => setProcureForm({ ...procureForm, selling_rate: e.target.value })}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProcureModal(false)}
                  className="flex-1 py-2.5 border rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs">
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- RESPONSIVE MODAL: ADD PARTNER --- */}
      {showPartnerModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-end sm:items-center justify-center sm:p-4 z-50">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 max-w-sm w-full">
            <h3 className="font-bold text-base text-slate-900 mb-3">Add Partner Account</h3>
            <form onSubmit={savePartner} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Partner Name *</label>
                <input
                  type="text"
                  required
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm"
                  value={partnerForm.name}
                  onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Opening Cash</label>
                  <input
                    type="number"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-sm"
                    value={partnerForm.opening_cash}
                    onChange={(e) => setPartnerForm({ ...partnerForm, opening_cash: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 block mb-1">Opening UPI</label>
                  <input
                    type="number"
                    className="w-full p-2.5 border border-slate-300 rounded-xl text-sm"
                    value={partnerForm.opening_upi}
                    onChange={(e) => setPartnerForm({ ...partnerForm, opening_upi: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPartnerModal(false)}
                  className="flex-1 py-2.5 border rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-xs">
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- RESPONSIVE MODAL: EXPENSE CATEGORY MASTER --- */}
      {showCategoryMasterModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-end sm:items-center justify-center sm:p-4 z-50">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 max-w-sm w-full space-y-3">
            <div className="flex justify-between items-center pb-2 border-b">
              <h3 className="font-bold text-base text-slate-900">Expense Master Categories</h3>
              <button onClick={() => setShowCategoryMasterModal(false)} className="text-slate-400">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveExpenseCategory} className="flex gap-2">
              <input
                type="text"
                placeholder="Category name..."
                className="flex-1 p-2.5 border border-slate-300 rounded-xl text-xs font-semibold outline-none"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <button type="submit" className="px-4 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl">
                Add
              </button>
            </form>

            <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
              {expenseCategories.map((c) => (
                <div key={c.id} className="flex justify-between items-center p-2.5 rounded-lg bg-slate-50 text-xs font-semibold">
                  <span>{c.name}</span>
                  <button onClick={() => deleteExpenseCategory(c.id)} className="text-slate-400 hover:text-rose-600">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
