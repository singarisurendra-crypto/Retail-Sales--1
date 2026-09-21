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
  CheckCircle2,
  Clock,
  TrendingUp,
  Tag
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
  const [activeTab, setActiveTab] = useState("sale"); // default to Billing
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Core Data
  const [partners, setPartners] = useState([]);
  const [procurements, setProcurements] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showCustModal, setShowCustModal] = useState(false);
  const [showProcureModal, setShowProcureModal] = useState(false);
  const [showCollectModal, setShowCollectModal] = useState(false);

  // Customer Edit/Add Form State
  const [editingCustId, setEditingCustId] = useState(null);
  const [custForm, setCustForm] = useState({ name: "", mobile: "", old_due: "" });

  // Partner Form State
  const [partnerForm, setPartnerForm] = useState({ name: "", opening_cash: "", opening_upi: "" });

  // Procurement Form State (with Purchase Rate AND Selling Rate)
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

  // Collection State (Supports Bill-Wise & On-Account)
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
    { procure_id: "", item_name: "", purchase_rate: 0, rate: "", qty: "1", total: 0, max_qty: 0 }
  ]);
  const [upfrontAmount, setUpfrontAmount] = useState("");
  const [upfrontMode, setUpfrontMode] = useState("Cash"); // Cash, UPI
  const [upfrontPartnerId, setUpfrontPartnerId] = useState("");
  const [savingSale, setSavingSale] = useState(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    try {
      const [p, pr, c, inv, col] = await Promise.all([
        db.from("receivers").select("*").order("name", { ascending: true }),
        db.from("procurements").select("*").order("created_at", { ascending: false }),
        db.from("customers").select("*").order("name", { ascending: true }),
        db.from("invoices").select("*").order("created_at", { ascending: false }),
        db.from("collections").select("*").order("created_at", { ascending: false })
      ]);

      if (p.data) {
        setPartners(p.data);
        if (p.data.length > 0 && !upfrontPartnerId) setUpfrontPartnerId(p.data[0].id);
      }
      if (pr.data) setProcurements(pr.data);
      if (c.data) setCustomers(c.data);
      if (inv.data) setInvoices(inv.data);
      if (col.data) setCollections(col.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Partner Real-Time Balances (No main drawer / store UPI - pure partner accounting)
  const partnerAccounts = useMemo(() => {
    return partners.map((partner) => {
      const pid = partner.id;

      const initCash = Number(partner.opening_cash || 0);
      const initUpi = Number(partner.opening_upi || 0);

      // Inflows from upfront payments on sales
      const saleUpfrontCash = invoices
        .filter((i) => i.upfront_receiver_id == pid && i.upfront_mode === "Cash")
        .reduce((sum, i) => sum + Number(i.upfront_paid || 0), 0);
      const saleUpfrontUpi = invoices
        .filter((i) => i.upfront_receiver_id == pid && i.upfront_mode === "UPI")
        .reduce((sum, i) => sum + Number(i.upfront_paid || 0), 0);

      // Inflows from collections
      const colCash = collections
        .filter((c) => c.receiver_id == pid && c.payment_mode === "Cash")
        .reduce((sum, c) => sum + Number(c.amount || 0), 0);
      const colUpi = collections
        .filter((c) => c.receiver_id == pid && c.payment_mode === "UPI")
        .reduce((sum, c) => sum + Number(c.amount || 0), 0);

      // Outflows from procurement payments
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

      const netCash = initCash + saleUpfrontCash + colCash - procureCashOut;
      const netUpi = initUpi + saleUpfrontUpi + colUpi - procureUpiOut;

      return {
        ...partner,
        initCash,
        initUpi,
        netCash,
        netUpi,
        totalBalance: netCash + netUpi
      };
    });
  }, [partners, invoices, collections, procurements]);

  // Overall Business Metrics
  const businessSummary = useMemo(() => {
    const totalSales = invoices.reduce((s, i) => s + Number(i.total_amount || 0), 0);
    const totalMarketDues = customers.reduce((s, c) => s + Number(c.old_due || 0), 0);
    const stockUnits = procurements.reduce((s, p) => s + Number(p.remaining_qty || 0), 0);
    const stockValuation = procurements.reduce(
      (s, p) => s + Number(p.remaining_qty || 0) * Number(p.purchase_rate || 0),
      0
    );
    const totalCashInHand = partnerAccounts.reduce((s, p) => s + p.netCash, 0);
    const totalUpiInBank = partnerAccounts.reduce((s, p) => s + p.netUpi, 0);

    return { totalSales, totalMarketDues, stockUnits, stockValuation, totalCashInHand, totalUpiInBank };
  }, [invoices, customers, procurements, partnerAccounts]);

  // Item Selection in Billing: Uses Selling Rate if defined, else defaults to Purchase Rate
  const handleSelectProcuredItem = (idx, pid) => {
    const item = procurements.find((p) => p.id == pid);
    if (!item) return;

    const defaultSellingRate = Number(item.selling_rate || item.purchase_rate || 0);

    const newCart = [...cart];
    newCart[idx] = {
      procure_id: item.id,
      item_name: item.item_name,
      purchase_rate: Number(item.purchase_rate || 0),
      rate: defaultSellingRate > 0 ? String(defaultSellingRate) : "",
      qty: 1,
      total: defaultSellingRate,
      max_qty: Number(item.remaining_qty)
    };
    setCart(newCart);
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

      const invoiceRecord = {
        customer_id: selectedCust.id,
        customer_name: selectedCust.name,
        invoice_date: saleDate,
        total_amount: cartTotal,
        upfront_paid: upfrontPaidNum,
        balance_due: remainingBillDue,
        upfront_mode: upfrontPaidNum > 0 ? upfrontMode : "None",
        upfront_receiver_id: upfrontPaidNum > 0 ? Number(upfrontPartnerId) : null,
        status: status,
        payment_mode: upfrontPaidNum === 0 ? "Due" : upfrontPaidNum >= cartTotal ? upfrontMode : "Partial"
      };

      const { error: invErr } = await db.from("invoices").insert([invoiceRecord]);
      if (invErr) throw invErr;

      // Deduct inventory quantities
      for (const line of cart) {
        const batch = procurements.find((p) => p.id == line.procure_id);
        if (batch) {
          const rem = Math.max(0, Number(batch.remaining_qty) - Number(line.qty));
          await db.from("procurements").update({ remaining_qty: rem }).eq("id", batch.id);
        }
      }

      // Add remaining due portion directly to customer ledger
      if (remainingBillDue > 0) {
        const newTotalCustomerDue = Number(selectedCust.old_due || 0) + remainingBillDue;
        await db.from("customers").update({ old_due: newTotalCustomerDue }).eq("id", selectedCust.id);
      }

      alert(`Invoice saved! Bill Due: ${money(remainingBillDue)}`);
      setCart([{ procure_id: "", item_name: "", purchase_rate: 0, rate: "", qty: "1", total: 0, max_qty: 0 }]);
      setSelectedCust(null);
      setUpfrontAmount("");
      refreshData();
    } catch (err) {
      alert("Error saving invoice: " + err.message);
    } finally {
      setSavingSale(false);
    }
  };

  // Customer: Save (Create or Update)
  const saveCustomer = async (e) => {
    e.preventDefault();
    if (!custForm.name.trim()) return alert("Customer name is required");

    const payload = {
      name: custForm.name.trim(),
      mobile: custForm.mobile.trim(),
      old_due: Number(custForm.old_due || 0)
    };

    if (editingCustId) {
      const { error } = await db.from("customers").update(payload).eq("id", editingCustId);
      if (!error) {
        setEditingCustId(null);
        setCustForm({ name: "", mobile: "", old_due: "" });
        setShowCustModal(false);
        refreshData();
        alert("Customer updated successfully!");
      } else {
        alert(error.message);
      }
    } else {
      const { error } = await db.from("customers").insert([payload]);
      if (!error) {
        setCustForm({ name: "", mobile: "", old_due: "" });
        setShowCustModal(false);
        refreshData();
        alert("Customer added successfully!");
      } else {
        alert(error.message);
      }
    }
  };

  // Customer: Open Edit Modal
  const handleEditCustomer = (c) => {
    setEditingCustId(c.id);
    setCustForm({
      name: c.name,
      mobile: c.mobile || "",
      old_due: c.old_due || ""
    });
    setShowCustModal(true);
  };

  // Customer: Delete with confirmation
  const handleDeleteCustomer = async (c) => {
    if (!confirm(`Are you sure you want to delete customer "${c.name}"? This action cannot be undone.`)) {
      return;
    }

    const { error } = await db.from("customers").delete().eq("id", c.id);
    if (!error) {
      if (selectedCust && selectedCust.id === c.id) setSelectedCust(null);
      refreshData();
      alert("Customer deleted successfully!");
    } else {
      alert("Error deleting customer: " + error.message);
    }
  };

  // Save Collection
  const saveCollection = async (e) => {
    e.preventDefault();
    const amt = Number(collectForm.amount || 0);
    if (amt <= 0) return alert("Please enter a valid payment amount");
    if (!collectForm.receiver_id) return alert("Select which partner received the payment");

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
          const newStatus = newInvDue === 0 ? "Paid" : "Partial";
          await db.from("invoices").update({ balance_due: newInvDue, status: newStatus }).eq("id", targetInv.id);
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
      alert("Payment recorded and customer ledger updated!");
    } catch (err) {
      alert("Error saving payment: " + err.message);
    }
  };

  // Save Partner
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

  // Save Procurement (Supports Purchase Rate AND Selling Rate)
  const saveProcurement = async (e) => {
    e.preventDefault();
    const qty = Number(procureForm.procured_qty || 0);
    const purchaseRate = Number(procureForm.purchase_rate || 0);
    const sellingRate = Number(procureForm.selling_rate || purchaseRate);
    const total = qty * purchaseRate;

    const record = {
      supplier_name: procureForm.is_opening
        ? "Opening Stock"
        : procureForm.supplier_name.trim() || "Vendor",
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

    const { error } = await db.from("procurements").insert([record]);
    if (!error) {
      setShowProcureModal(false);
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
      refreshData();
    } else {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-800">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-black">B</div>
          <span className="font-bold text-base">B Reddy Sales</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* LEFT SIDEBAR NAVIGATION */}
      <aside
        className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-slate-900 text-slate-300 flex flex-col justify-between z-30 transition-transform
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        <div>
          <div className="p-6 border-b border-slate-800 hidden md:flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30">
              B
            </div>
            <div>
              <h1 className="font-black text-white text-base tracking-wide">B REDDY SALES</h1>
              <p className="text-[11px] text-slate-500 uppercase tracking-widest font-semibold">Wholesale & Retail</p>
            </div>
          </div>

          <nav className="p-3 space-y-1.5 mt-2">
            <button
              onClick={() => {
                setActiveTab("sale");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "sale"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <ShoppingCart size={18} /> Point of Sale (Billing)
            </button>

            <button
              onClick={() => {
                setActiveTab("summary");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "summary"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <LayoutDashboard size={18} /> Business Summary
            </button>

            <button
              onClick={() => {
                setActiveTab("customers");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "customers"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Users size={18} /> Customers & Dues
            </button>

            <button
              onClick={() => {
                setActiveTab("invoices");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "invoices"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <FileSpreadsheet size={18} /> Invoices & Bills
            </button>

            <button
              onClick={() => {
                setActiveTab("procurement");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "procurement"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <PackagePlus size={18} /> Procurements & Stock
            </button>

            <button
              onClick={() => {
                setActiveTab("partners");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${
                activeTab === "partners"
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
            >
              <WalletCards size={18} /> Partner Accounts
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => setShowCollectModal(true)}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
          >
            <IndianRupee size={15} /> Collect Due (Bill/Account)
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN WORKSPACE */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        {/* VIEW 1: POINT OF SALE (BILLING) */}
        {activeTab === "sale" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="font-black text-lg text-slate-900">Create Sales Invoice</h2>
                  <p className="text-xs text-slate-400">Bills go to customer credit by default unless paid upfront</p>
                </div>
                <input
                  type="date"
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold"
                  value={saleDate}
                  onChange={(e) => setSaleDate(e.target.value)}
                />
              </div>

              {/* Customer Selector */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-bold uppercase text-slate-500">Customer *</label>
                  <button
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
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-semibold outline-none"
                  value={selectedCust ? selectedCust.id : ""}
                  onChange={(e) => {
                    const c = customers.find((x) => x.id == e.target.value);
                    setSelectedCust(c || null);
                  }}
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.mobile || "No Mobile"}) — Outstanding Due: {money(c.old_due)}
                    </option>
                  ))}
                </select>
                {selectedCust && (
                  <div className="mt-2 text-xs flex gap-4 text-slate-600">
                    <span>Phone: <b>{selectedCust.mobile || "N/A"}</b></span>
                    <span>Total Existing Market Due: <b className="text-rose-600">{money(selectedCust.old_due)}</b></span>
                  </div>
                )}
              </div>

              {/* Cart Table with Clear Purchase Cost vs Selling Rate */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold uppercase text-slate-500">Stock Items to Bill *</label>
                  <button
                    onClick={() =>
                      setCart([
                        ...cart,
                        { procure_id: "", item_name: "", purchase_rate: 0, rate: "", qty: "1", total: 0, max_qty: 0 }
                      ])
                    }
                    className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline"
                  >
                    <Plus size={14} /> Add Line
                  </button>
                </div>

                <div className="space-y-3">
                  {cart.map((line, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                        <div className="flex-1">
                          <select
                            className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold outline-none text-slate-800"
                            value={line.procure_id}
                            onChange={(e) => handleSelectProcuredItem(idx, e.target.value)}
                          >
                            <option value="">-- Pick Stock Item --</option>
                            {procurements
                              .filter((p) => Number(p.remaining_qty) > 0)
                              .map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.item_name} [{p.supplier_name}] | Cost: ₹{p.purchase_rate} | Sale: ₹{p.selling_rate || p.purchase_rate} | Avail: {p.remaining_qty}
                                </option>
                              ))}
                          </select>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="w-28">
                            <input
                              type="number"
                              placeholder="Selling Rate"
                              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                              value={line.rate}
                              onChange={(e) => updateCart(idx, "rate", e.target.value)}
                            />
                          </div>
                          <div className="w-20">
                            <input
                              type="number"
                              min="1"
                              max={line.max_qty || 9999}
                              placeholder="Qty"
                              className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-center"
                              value={line.qty}
                              onChange={(e) => updateCart(idx, "qty", e.target.value)}
                            />
                          </div>
                          <div className="w-24 text-right font-black text-xs sm:text-sm text-slate-800">
                            {money(line.total)}
                          </div>
                          <button
                            onClick={() => cart.length > 1 && setCart(cart.filter((_, i) => i !== idx))}
                            className="text-slate-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Cost Rate & Profit Margin Indicator */}
                      {line.procure_id && (
                        <div className="pt-1 text-[11px] flex items-center justify-between border-t border-slate-200/60 text-slate-500">
                          <div className="flex items-center gap-3">
                            <span>
                              Purchase Cost: <b className="text-slate-700">₹{line.purchase_rate}</b>
                            </span>
                            <span>
                              Avail Stock: <b className="text-slate-700">{line.max_qty}</b>
                            </span>
                          </div>
                          {Number(line.rate) > 0 && (
                            <span
                              className={`font-bold ${
                                Number(line.rate) >= Number(line.purchase_rate)
                                  ? "text-emerald-600"
                                  : "text-rose-600"
                              }`}
                            >
                              Profit/Unit: ₹{Number(line.rate) - Number(line.purchase_rate)}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bill Summary & Upfront Payment to Partner */}
            <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 h-fit">
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
                  <span>Total With Past Due:</span>
                  <span className="text-slate-900">{money(cartTotal + Number(selectedCust?.old_due || 0))}</span>
                </div>
              </div>

              {/* Upfront / Partial Payment directly to Partner */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase text-slate-700">Upfront Payment (If Any)</label>
                  <span className="text-[11px] text-slate-400 font-medium">Leave 0 for full credit</span>
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-black text-emerald-600 outline-none"
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
                        className={`py-1.5 rounded-lg text-xs font-bold border ${
                          upfrontMode === "Cash"
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white border-slate-300"
                        }`}
                      >
                        💵 Cash
                      </button>
                      <button
                        type="button"
                        onClick={() => setUpfrontMode("UPI")}
                        className={`py-1.5 rounded-lg text-xs font-bold border ${
                          upfrontMode === "UPI"
                            ? "bg-indigo-600 text-white border-indigo-600"
                            : "bg-white border-slate-300"
                        }`}
                      >
                        📱 UPI
                      </button>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-500 block mb-1">Partner Receiving Amount *</label>
                      <select
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-bold"
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

              {/* Net Addition to Customer Due */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
                <div className="flex justify-between items-center text-amber-900 font-bold">
                  <span>Adding to Customer Due:</span>
                  <span className="text-sm text-rose-600 font-black">{money(remainingBillDue)}</span>
                </div>
              </div>

              <button
                disabled={savingSale || cartTotal <= 0}
                onClick={saveSaleInvoice}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-black rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-indigo-600/20"
              >
                {savingSale ? "Finalizing..." : "Save Invoice & Update Ledger"}
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: EXECUTIVE SUMMARY */}
        {activeTab === "summary" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900">Executive Overview</h2>
              <p className="text-xs text-slate-500">Live operational snapshot across partners, dues, and inventory</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Sales Invoiced</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{money(businessSummary.totalSales)}</h3>
                <span className="text-[11px] text-slate-500">{invoices.length} invoices generated</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Customer Dues</p>
                <h3 className="text-2xl font-black text-rose-600 mt-1">{money(businessSummary.totalMarketDues)}</h3>
                <span className="text-[11px] text-slate-500">Pending market collections</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Available Stock Value</p>
                <h3 className="text-2xl font-black text-indigo-600 mt-1">{money(businessSummary.stockValuation)}</h3>
                <span className="text-[11px] text-slate-500">{businessSummary.stockUnits} units on hand</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Cash & Bank</p>
                <h3 className="text-2xl font-black text-emerald-600 mt-1">
                  {money(businessSummary.totalCashInHand + businessSummary.totalUpiInBank)}
                </h3>
                <span className="text-[11px] text-slate-500">
                  Cash: {money(businessSummary.totalCashInHand)} | UPI: {money(businessSummary.totalUpiInBank)}
                </span>
              </div>
            </div>

            {/* Partner Accounts Passbook */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base text-slate-900">Partner Cash / UPI Holding</h3>
                <button
                  onClick={() => setShowPartnerModal(true)}
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <Plus size={14} /> Add Partner
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {partnerAccounts.map((p) => (
                  <div key={p.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-black text-lg text-slate-900">{p.name}</h4>
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-lg">
                        Total In Hand: {money(p.totalBalance)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-slate-400 font-medium">Physical Cash</span>
                        <p className="font-black text-base text-emerald-600 mt-0.5">{money(p.netCash)}</p>
                        <span className="text-[10px] text-slate-400">Opening: {money(p.initCash)}</span>
                      </div>

                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-slate-400 font-medium">UPI / Bank</span>
                        <p className="font-black text-base text-indigo-600 mt-0.5">{money(p.netUpi)}</p>
                        <span className="text-[10px] text-slate-400">Opening: {money(p.initUpi)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: CUSTOMERS & DUES (WITH EDIT & DELETE) */}
        {activeTab === "customers" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-slate-900">Customers Directory & Ledgers</h2>
                <p className="text-xs text-slate-500">Manage customer contacts, update dues, or collect balances</p>
              </div>
              <button
                onClick={() => {
                  setEditingCustId(null);
                  setCustForm({ name: "", mobile: "", old_due: "" });
                  setShowCustModal(true);
                }}
                className="px-3.5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Plus size={15} /> Add Customer
              </button>
            </div>

            <div className="overflow-x-auto -mx-6 sm:mx-0">
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
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg inline-flex items-center gap-1"
                            >
                              Collect Due
                            </button>
                          )}
                          <button
                            onClick={() => handleEditCustomer(c)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                            title="Edit Customer"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(c)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                            title="Delete Customer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 4: INVOICES */}
        {activeTab === "invoices" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-slate-900">Invoices & Bill Status</h2>
                <p className="text-xs text-slate-500">Track pending balances by bill number</p>
              </div>
            </div>

            <div className="overflow-x-auto -mx-6 sm:mx-0">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-slate-400 uppercase tracking-wider font-bold bg-slate-50">
                    <th className="p-3">Bill #</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Total</th>
                    <th className="p-3">Upfront Paid</th>
                    <th className="p-3">Balance Due</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700 font-medium">
                  {invoices.map((inv) => {
                    const due = Number(inv.balance_due || 0);
                    return (
                      <tr key={inv.id}>
                        <td className="p-3 font-bold text-slate-900">INV-{inv.id}</td>
                        <td className="p-3">{inv.invoice_date || inv.created_at?.slice(0, 10)}</td>
                        <td className="p-3 font-bold">{inv.customer_name}</td>
                        <td className="p-3">{money(inv.total_amount)}</td>
                        <td className="p-3 text-emerald-600 font-semibold">{money(inv.upfront_paid)}</td>
                        <td className="p-3 font-black text-rose-600">{money(due)}</td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              due === 0
                                ? "bg-emerald-100 text-emerald-800"
                                : Number(inv.upfront_paid || 0) > 0
                                ? "bg-indigo-100 text-indigo-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {due === 0 ? "Paid" : Number(inv.upfront_paid || 0) > 0 ? "Partial" : "Unpaid"}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          {due > 0 && (
                            <button
                              onClick={() => {
                                setCollectForm({
                                  customer_id: inv.customer_id,
                                  invoice_id: inv.id,
                                  amount: due,
                                  payment_mode: "Cash",
                                  receiver_id: upfrontPartnerId
                                });
                                setShowCollectModal(true);
                              }}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-lg"
                            >
                              Settle Bill
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 5: PROCUREMENTS & STOCK (SHOWING PURCHASE RATE AND SELLING RATE) */}
        {activeTab === "procurement" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900">Procurements & Inventory</h2>
                <p className="text-xs text-slate-500">Record supplier purchases with purchase cost and intended selling price</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setProcureForm({ ...procureForm, is_opening: true, supplier_name: "Opening Stock" });
                    setShowProcureModal(true);
                  }}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <Plus size={15} /> Add Opening Stock
                </button>
                <button
                  onClick={() => {
                    setProcureForm({ ...procureForm, is_opening: false });
                    setShowProcureModal(true);
                  }}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <Plus size={15} /> Add Purchase Bill
                </button>
              </div>
            </div>

            <div className="overflow-x-auto -mx-6 sm:mx-0">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-slate-400 uppercase tracking-wider font-bold bg-slate-50">
                    <th className="p-3">Date</th>
                    <th className="p-3">Source / Supplier</th>
                    <th className="p-3">Item Name</th>
                    <th className="p-3">Purchased</th>
                    <th className="p-3">Available</th>
                    <th className="p-3">Purchase Rate</th>
                    <th className="p-3">Selling Rate</th>
                    <th className="p-3">Total Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700 font-medium">
                  {procurements.map((p) => (
                    <tr key={p.id}>
                      <td className="p-3">{p.purchase_date || p.created_at?.slice(0, 10)}</td>
                      <td className="p-3 font-bold text-slate-900">
                        {p.supplier_name === "Opening Stock" ? (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[11px]">
                            Opening Stock
                          </span>
                        ) : (
                          p.supplier_name
                        )}
                      </td>
                      <td className="p-3">{p.item_name}</td>
                      <td className="p-3">{p.procured_qty}</td>
                      <td className="p-3 font-black text-emerald-600">{p.remaining_qty}</td>
                      <td className="p-3 font-bold text-slate-900">{money(p.purchase_rate)}</td>
                      <td className="p-3 font-bold text-indigo-600">{money(p.selling_rate || p.purchase_rate)}</td>
                      <td className="p-3 font-bold">{money(p.total_amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 6: PARTNER ACCOUNTS */}
        {activeTab === "partners" && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-black text-slate-900">Partner Ledgers & Books</h2>
                <p className="text-xs text-slate-500">Individual cash and UPI reconciliation</p>
              </div>
              <button
                onClick={() => setShowPartnerModal(true)}
                className="px-3.5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Plus size={15} /> Add Partner
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {partnerAccounts.map((p) => (
                <div key={p.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
                  <h3 className="font-black text-lg text-slate-900 mb-3">{p.name}</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Opening Cash:</span>
                      <span className="font-semibold">{money(p.initCash)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Opening UPI:</span>
                      <span className="font-semibold">{money(p.initUpi)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-black text-slate-900 text-sm">
                      <span>Net Current In Hand:</span>
                      <span className="text-indigo-600">{money(p.totalBalance)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* MODAL: ADD / EDIT CUSTOMER */}
      {showCustModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-base text-slate-900 mb-4">
              {editingCustId ? "Edit Customer Details" : "Add New Customer"}
            </h3>
            <form onSubmit={saveCustomer} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500">Customer Name *</label>
                <input
                  type="text"
                  required
                  className="w-full mt-1 p-2 border border-slate-200 rounded-xl text-sm"
                  value={custForm.name}
                  onChange={(e) => setCustForm({ ...custForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Phone Number</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border border-slate-200 rounded-xl text-sm"
                  value={custForm.mobile}
                  onChange={(e) => setCustForm({ ...custForm, mobile: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Opening Due / Balance (₹)</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border border-slate-200 rounded-xl text-sm"
                  placeholder="0"
                  value={custForm.old_due}
                  onChange={(e) => setCustForm({ ...custForm, old_due: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCustModal(false);
                    setEditingCustId(null);
                  }}
                  className="px-4 py-2 border rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs">
                  {editingCustId ? "Update Customer" : "Save Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: COLLECT DUE */}
      {showCollectModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-base text-slate-900 mb-1">Customer Due Collection</h3>
            <p className="text-xs text-slate-400 mb-4">Pay against specific invoice or on account</p>

            <form onSubmit={saveCollection} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500">Customer *</label>
                <select
                  required
                  className="w-full mt-1 p-2 border border-slate-200 rounded-xl text-xs font-semibold"
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
                      {c.name} (Total Due: {money(c.old_due)})
                    </option>
                  ))}
                </select>
              </div>

              {customerUnpaidInvoices.length > 0 && (
                <div>
                  <label className="text-xs font-bold text-slate-500">Select Bill (Optional)</label>
                  <select
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl text-xs font-semibold"
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
                        INV-{inv.id} ({inv.invoice_date}) — Due: {money(inv.balance_due)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-500">Amount Received (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full mt-1 p-2 border border-slate-200 rounded-xl text-sm font-black text-emerald-600"
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
                    className={`py-2 rounded-xl text-xs font-bold border ${
                      collectForm.payment_mode === "Cash"
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "border-slate-200"
                    }`}
                  >
                    💵 Cash
                  </button>
                  <button
                    type="button"
                    onClick={() => setCollectForm({ ...collectForm, payment_mode: "UPI" })}
                    className={`py-2 rounded-xl text-xs font-bold border ${
                      collectForm.payment_mode === "UPI"
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "border-slate-200"
                    }`}
                  >
                    📱 UPI
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Partner Who Received *</label>
                <select
                  className="w-full p-2 border border-slate-200 rounded-xl text-xs font-semibold"
                  value={collectForm.receiver_id || upfrontPartnerId}
                  onChange={(e) => setCollectForm({ ...collectForm, receiver_id: e.target.value })}
                >
                  {partners.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCollectModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">
                  Save Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PARTNER */}
      {showPartnerModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-base text-slate-900 mb-4">Add Operating Partner</h3>
            <form onSubmit={savePartner} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500">Partner Name *</label>
                <input
                  type="text"
                  required
                  className="w-full mt-1 p-2 border border-slate-200 rounded-xl text-sm"
                  value={partnerForm.name}
                  onChange={(e) => setPartnerForm({ ...partnerForm, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-500">Opening Cash (₹)</label>
                  <input
                    type="number"
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl text-sm"
                    value={partnerForm.opening_cash}
                    onChange={(e) => setPartnerForm({ ...partnerForm, opening_cash: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">Opening UPI (₹)</label>
                  <input
                    type="number"
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl text-sm"
                    value={partnerForm.opening_upi}
                    onChange={(e) => setPartnerForm({ ...partnerForm, opening_upi: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPartnerModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs">
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PROCUREMENT (PURCHASE RATE + SELLING RATE) */}
      {showProcureModal && (
        <div className="fixed inset-0 bg-slate-950/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full my-6">
            <h3 className="font-bold text-base text-slate-900 mb-1">
              {procureForm.is_opening ? "Add Opening Inventory" : "Add Purchase Invoice"}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {procureForm.is_opening
                ? "Direct stock entry into warehouse"
                : "Paid by Partner 1 and/or Partner 2"}
            </p>

            <form onSubmit={saveProcurement} className="space-y-3">
              {!procureForm.is_opening && (
                <div>
                  <label className="text-xs font-bold text-slate-500">Supplier Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl text-sm"
                    value={procureForm.supplier_name}
                    onChange={(e) => setProcureForm({ ...procureForm, supplier_name: e.target.value })}
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-500">Item Name *</label>
                <input
                  type="text"
                  required
                  className="w-full mt-1 p-2 border border-slate-200 rounded-xl text-sm"
                  value={procureForm.item_name}
                  onChange={(e) => setProcureForm({ ...procureForm, item_name: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500">Quantity *</label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full mt-1 p-2 border border-slate-200 rounded-xl text-sm font-bold"
                  value={procureForm.procured_qty}
                  onChange={(e) => setProcureForm({ ...procureForm, procured_qty: e.target.value })}
                />
              </div>

              {/* Purchase Rate & Expected Selling Rate Inputs */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-500">Purchase Rate (Cost) *</label>
                  <input
                    type="number"
                    required
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl text-sm font-bold"
                    placeholder="e.g. 25000"
                    value={procureForm.purchase_rate}
                    onChange={(e) => setProcureForm({ ...procureForm, purchase_rate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">Selling Rate (MRP/Sale)</label>
                  <input
                    type="number"
                    className="w-full mt-1 p-2 border border-slate-200 rounded-xl text-sm font-bold text-indigo-600"
                    placeholder="e.g. 30000"
                    value={procureForm.selling_rate}
                    onChange={(e) => setProcureForm({ ...procureForm, selling_rate: e.target.value })}
                  />
                </div>
              </div>

              {!procureForm.is_opening && (
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500 block">
                    Payment Source (Partner 1)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      className="p-2 border border-slate-200 rounded-lg text-xs"
                      value={procureForm.p1_id}
                      onChange={(e) => setProcureForm({ ...procureForm, p1_id: e.target.value })}
                    >
                      <option value="">-- Partner 1 --</option>
                      {partners.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Amount"
                      className="p-2 border border-slate-200 rounded-lg text-xs"
                      value={procureForm.p1_amount}
                      onChange={(e) => setProcureForm({ ...procureForm, p1_amount: e.target.value })}
                    />
                    <select
                      className="p-2 border border-slate-200 rounded-lg text-xs font-bold"
                      value={procureForm.p1_mode}
                      onChange={(e) => setProcureForm({ ...procureForm, p1_mode: e.target.value })}
                    >
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="split_p2"
                      checked={procureForm.split_p2}
                      onChange={(e) => setProcureForm({ ...procureForm, split_p2: e.target.checked })}
                    />
                    <label htmlFor="split_p2" className="text-xs font-bold text-slate-600">
                      Split Bill with Partner 2
                    </label>
                  </div>

                  {procureForm.split_p2 && (
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        className="p-2 border border-slate-200 rounded-lg text-xs"
                        value={procureForm.p2_id}
                        onChange={(e) => setProcureForm({ ...procureForm, p2_id: e.target.value })}
                      >
                        <option value="">-- Partner 2 --</option>
                        {partners.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Amount"
                        className="p-2 border border-slate-200 rounded-lg text-xs"
                        value={procureForm.p2_amount}
                        onChange={(e) => setProcureForm({ ...procureForm, p2_amount: e.target.value })}
                      />
                      <select
                        className="p-2 border border-slate-200 rounded-lg text-xs font-bold"
                        value={procureForm.p2_mode}
                        onChange={(e) => setProcureForm({ ...procureForm, p2_mode: e.target.value })}
                      >
                        <option value="UPI">UPI</option>
                        <option value="Cash">Cash</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowProcureModal(false)}
                  className="px-4 py-2 border rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-xl text-xs">
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
