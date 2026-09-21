"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Plus,
  Trash2,
  Banknote,
  LogOut,
  BarChart3,
  Layers,
  Wallet,
  ArrowDownRight,
  PackageCheck
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

export default function RetailSalesApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUsername, setLoginUsername] = useState("admin");
  const [loginPin, setLoginPin] = useState("");
  const [loginError, setLoginError] = useState("");

  // Navigation Tabs: 'sale', 'procurement', 'summary', 'invoices', 'customers', 'receivers'
  const [activeTab, setActiveTab] = useState("sale");

  // Database Data
  const [customers, setCustomers] = useState([]);
  const [procurements, setProcurements] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [collections, setCollections] = useState([]);

  // Modals
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showReceiverModal, setShowReceiverModal] = useState(false);
  const [showProcureModal, setShowProcureModal] = useState(false);
  const [showCollectionModal, setShowCollectionModal] = useState(false);

  // Forms
  const [customerForm, setCustomerForm] = useState({ name: "", mobile: "", old_due: "" });
  const [receiverForm, setReceiverForm] = useState({ name: "", opening_cash: "", opening_upi: "" });

  const [isOpeningStock, setIsOpeningStock] = useState(false);
  const [procureForm, setProcureForm] = useState({
    supplier_name: "",
    item_name: "",
    procured_qty: "",
    purchase_rate: "",
    receiver_1_id: "",
    receiver_1_amount: "",
    receiver_1_mode: "Cash",
    has_second_receiver: false,
    receiver_2_id: "",
    receiver_2_amount: "",
    receiver_2_mode: "UPI"
  });

  const [collectionForm, setCollectionForm] = useState({
    customer_id: "",
    amount: "",
    payment_mode: "Cash",
    receiver_id: "",
    notes: "Opening Due / Bill Collection"
  });

  // Sales Entry State
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [cart, setCart] = useState([
    { procurement_id: "", item_name: "", rate: 0, qty: 1, total: 0, max_qty: 0 }
  ]);
  const [paymentType, setPaymentType] = useState("cash");
  const [saleReceiverId, setSaleReceiverId] = useState("");
  const [savingInvoice, setSavingInvoice] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const loadAllData = async () => {
    try {
      const [c, pr, rc, inv, col] = await Promise.all([
        db.from("customers").select("*").order("name", { ascending: true }),
        db.from("procurements").select("*").order("created_at", { ascending: false }),
        db.from("receivers").select("*").order("name", { ascending: true }),
        db.from("invoices").select("*").order("created_at", { ascending: false }),
        db.from("collections").select("*").order("created_at", { ascending: false })
      ]);

      if (c.data) setCustomers(c.data);
      if (pr.data) setProcurements(pr.data);
      if (rc.data) {
        setReceivers(rc.data);
        if (rc.data.length > 0 && !saleReceiverId) {
          setSaleReceiverId(rc.data[0].id);
        }
      }
      if (inv.data) setInvoices(inv.data);
      if (col.data) setCollections(col.data);
    } catch (e) {
      console.error("Data load error:", e);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");

    if (loginUsername === "admin" && loginPin === "1234") {
      setIsAuthenticated(true);
      return;
    }

    const { data, error } = await db
      .from("pos_users")
      .select("*")
      .eq("username", loginUsername.trim())
      .eq("pin_code", loginPin.trim())
      .single();

    if (error || !data) {
      setLoginError("Invalid Username or PIN");
    } else {
      setIsAuthenticated(true);
    }
  };

  // 1. Customer Save
  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    const { data, error } = await db
      .from("customers")
      .insert([{
        name: customerForm.name.trim(),
        mobile: customerForm.mobile || "0000000000",
        old_due: Number(customerForm.old_due || 0)
      }])
      .select();

    if (!error && data) {
      setCustomers([...customers, data[0]]);
      setSelectedCustomer(data[0]);
      setShowCustomerModal(false);
      setCustomerForm({ name: "", mobile: "", old_due: "" });
    } else {
      alert("Error saving customer: " + (error?.message || "Unknown error"));
    }
  };

  // 2. Receiver Save (Fixed with explicit fallback)
  const handleSaveReceiver = async (e) => {
    e.preventDefault();
    if (!receiverForm.name.trim()) {
      alert("Receiver name is required");
      return;
    }

    const payload = {
      name: receiverForm.name.trim(),
      opening_cash: Number(receiverForm.opening_cash || 0),
      opening_upi: Number(receiverForm.opening_upi || 0)
    };

    const { data, error } = await db.from("receivers").insert([payload]).select();

    if (error) {
      console.error("Receiver save error:", error);
      alert("Error saving receiver: " + error.message);
    } else if (data) {
      setReceivers([...receivers, data[0]]);
      if (!saleReceiverId) setSaleReceiverId(data[0].id);
      setShowReceiverModal(false);
      setReceiverForm({ name: "", opening_cash: "", opening_upi: "" });
      alert("Receiver saved successfully!");
    }
  };

  // 3. Procurement / Opening Stock Save (Dual Receiver Support)
  const handleSaveProcurement = async (e) => {
    e.preventDefault();
    const qty = Number(procureForm.procured_qty || 0);
    const rate = Number(procureForm.purchase_rate || 0);
    const totalAmount = qty * rate;

    const record = {
      supplier_name: isOpeningStock ? "Opening Stock" : (procureForm.supplier_name.trim() || "Local Supplier"),
      item_name: procureForm.item_name.trim(),
      procured_qty: qty,
      remaining_qty: qty,
      purchase_rate: rate,
      total_amount: totalAmount,
      receiver_1_id: procureForm.receiver_1_id ? Number(procureForm.receiver_1_id) : null,
      receiver_1_amount: Number(procureForm.receiver_1_amount || 0),
      receiver_1_mode: procureForm.receiver_1_mode,
      receiver_2_id: procureForm.has_second_receiver && procureForm.receiver_2_id ? Number(procureForm.receiver_2_id) : null,
      receiver_2_amount: procureForm.has_second_receiver ? Number(procureForm.receiver_2_amount || 0) : 0,
      receiver_2_mode: procureForm.receiver_2_mode,
      payment_mode: procureForm.receiver_1_mode
    };

    const { data, error } = await db.from("procurements").insert([record]).select();
    if (!error && data) {
      setProcurements([data[0], ...procurements]);
      setShowProcureModal(false);
      setIsOpeningStock(false);
      setProcureForm({
        supplier_name: "",
        item_name: "",
        procured_qty: "",
        purchase_rate: "",
        receiver_1_id: "",
        receiver_1_amount: "",
        receiver_1_mode: "Cash",
        has_second_receiver: false,
        receiver_2_id: "",
        receiver_2_amount: "",
        receiver_2_mode: "UPI"
      });
      alert(isOpeningStock ? "Opening stock added successfully!" : "Procurement bill saved!");
    } else {
      alert("Error saving procurement: " + (error?.message || "Check fields"));
    }
  };

  // 4. Pay Opening Due / Collect Due
  const handleSaveCollection = async (e) => {
    e.preventDefault();
    const collAmount = Number(collectionForm.amount || 0);
    if (collAmount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    const { data, error } = await db.from("collections").insert([{
      customer_id: collectionForm.customer_id,
      amount: collAmount,
      payment_mode: collectionForm.payment_mode,
      receiver_id: collectionForm.receiver_id || saleReceiverId || null
    }]).select();

    if (!error) {
      const targetCust = customers.find(c => c.id == collectionForm.customer_id);
      if (targetCust) {
        const newDue = Math.max(0, Number(targetCust.old_due || 0) - collAmount);
        await db.from("customers").update({ old_due: newDue }).eq("id", targetCust.id);
      }
      setShowCollectionModal(false);
      setCollectionForm({ customer_id: "", amount: "", payment_mode: "Cash", receiver_id: "", notes: "Due settlement" });
      loadAllData();
      alert("Payment recorded! Customer due updated.");
    } else {
      alert("Error recording payment: " + error.message);
    }
  };

  // Cart operations
  const handleProcureSelectInCart = (index, procurementId) => {
    const proc = procurements.find((p) => p.id == procurementId);
    if (!proc) return;

    const newCart = [...cart];
    newCart[index] = {
      procurement_id: proc.id,
      item_name: proc.item_name,
      rate: Number(proc.purchase_rate) > 0 ? Number(proc.purchase_rate) * 1.25 : 0,
      qty: 1,
      max_qty: Number(proc.remaining_qty),
      total: Number(proc.purchase_rate) > 0 ? Number(proc.purchase_rate) * 1.25 : 0
    };
    setCart(newCart);
  };

  const updateCartLine = (index, field, value) => {
    const newCart = [...cart];
    newCart[index][field] = value;
    if (field === "qty" || field === "rate") {
      newCart[index].total = Number(newCart[index].qty || 0) * Number(newCart[index].rate || 0);
    }
    setCart(newCart);
  };

  const addCartLine = () => {
    setCart([...cart, { procurement_id: "", item_name: "", rate: 0, qty: 1, total: 0, max_qty: 0 }]);
  };

  const removeCartLine = (index) => {
    if (cart.length === 1) return;
    setCart(cart.filter((_, i) => i !== index));
  };

  const billSubTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + Number(item.total || 0), 0);
  }, [cart]);

  // Save Sale
  const handleSaveSale = async () => {
    if (!selectedCustomer) {
      alert("Please select a customer.");
      return;
    }
    if (cart.some((c) => !c.procurement_id || c.qty <= 0)) {
      alert("Please pick valid procured items and quantity.");
      return;
    }

    setSavingInvoice(true);
    try {
      const invoiceRecord = {
        customer_id: selectedCustomer.id,
        customer_name: selectedCustomer.name,
        invoice_date: invoiceDate,
        total_amount: billSubTotal,
        payment_type: paymentType,
        receiver_id: saleReceiverId || null
      };

      const { data: invData, error: invError } = await db.from("invoices").insert([invoiceRecord]).select();
      if (invError) throw invError;

      // Update remaining stock
      for (const line of cart) {
        const proc = procurements.find((p) => p.id == line.procurement_id);
        if (proc) {
          const updatedQty = Math.max(0, Number(proc.remaining_qty) - Number(line.qty));
          await db.from("procurements").update({ remaining_qty: updatedQty }).eq("id", proc.id);
        }
      }

      // Add to due if credit
      if (paymentType === "due") {
        const newDue = Number(selectedCustomer.old_due || 0) + billSubTotal;
        await db.from("customers").update({ old_due: newDue }).eq("id", selectedCustomer.id);
      }

      alert("Invoice Created Successfully!");
      setCart([{ procurement_id: "", item_name: "", rate: 0, qty: 1, total: 0, max_qty: 0 }]);
      setSelectedCustomer(null);
      loadAllData();
    } catch (err) {
      alert("Error creating invoice: " + err.message);
    } finally {
      setSavingInvoice(false);
    }
  };

  // Dashboard Summary Metrics
  const summaryMetrics = useMemo(() => {
    const totalSales = invoices.reduce((acc, inv) => acc + Number(inv.total_amount || 0), 0);
    const totalDuesOutstanding = customers.reduce((acc, c) => acc + Number(c.old_due || 0), 0);
    const stockOnHandQty = procurements.reduce((acc, p) => acc + Number(p.remaining_qty || 0), 0);
    const stockOnHandVal = procurements.reduce((acc, p) => acc + (Number(p.remaining_qty || 0) * Number(p.purchase_rate || 0)), 0);

    const totalCollectedCash = collections.filter(c => c.payment_mode === "Cash").reduce((acc, c) => acc + Number(c.amount || 0), 0);
    const totalCollectedUPI = collections.filter(c => c.payment_mode === "UPI").reduce((acc, c) => acc + Number(c.amount || 0), 0);

    return { totalSales, totalDuesOutstanding, stockOnHandQty, stockOnHandVal, totalCollectedCash, totalCollectedUPI };
  }, [invoices, customers, procurements, collections]);

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-sm w-full">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto text-white font-black text-2xl mb-3 shadow-lg shadow-blue-300">
              B
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">B REDDY SALES</h2>
            <p className="text-xs text-slate-400 mt-1">Sign in to your register</p>
          </div>

          {loginError && (
            <div className="mb-4 text-xs font-semibold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200 text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">Username</label>
              <input
                type="text"
                className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-slate-500">PIN Code</label>
              <input
                type="password"
                maxLength={6}
                placeholder="1234"
                className="w-full mt-1.5 px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-center tracking-widest text-xl font-bold"
                value={loginPin}
                onChange={(e) => setLoginPin(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-lg shadow-blue-200 text-sm"
            >
              Unlock POS
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 shadow-sm sticky top-0 z-30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                B
              </div>
              <div>
                <h1 className="font-bold text-base sm:text-lg text-slate-900 leading-tight">B REDDY SALES</h1>
                <p className="text-[11px] text-slate-500">Retail Point of Sale</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:hidden">
              <button
                onClick={() => setShowCollectionModal(true)}
                className="px-2.5 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold flex items-center gap-1"
              >
                <Banknote size={14} /> Pay Due
              </button>
              <button onClick={() => setIsAuthenticated(false)} className="p-1.5 text-slate-400">
                <LogOut size={18} />
              </button>
            </div>
          </div>

          <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl overflow-x-auto">
            <button
              onClick={() => setActiveTab("sale")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                activeTab === "sale" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"
              }`}
            >
              + Sale
            </button>
            <button
              onClick={() => setActiveTab("procurement")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                activeTab === "procurement" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"
              }`}
            >
              Procurement / Stock
            </button>
            <button
              onClick={() => setActiveTab("summary")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                activeTab === "summary" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab("invoices")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                activeTab === "invoices" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"
              }`}
            >
              Invoices
            </button>
            <button
              onClick={() => setActiveTab("customers")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                activeTab === "customers" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"
              }`}
            >
              Customers
            </button>
            <button
              onClick={() => setActiveTab("receivers")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                activeTab === "receivers" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600"
              }`}
            >
              Receivers
            </button>
          </nav>

          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => setShowCollectionModal(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5"
            >
              <Banknote size={15} /> Pay Opening / Bill Due
            </button>
            <button onClick={() => setIsAuthenticated(false)} className="p-2 text-slate-400 hover:text-rose-600">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Workspace */}
      <main className="p-3 sm:p-6 flex-1 max-w-7xl w-full mx-auto">
        {/* VIEW 1: SALE INVOICING */}
        {activeTab === "sale" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
            <div className="lg:col-span-8 bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                <h2 className="font-bold text-slate-800 text-base">New Sales Invoice</h2>
                <input
                  type="date"
                  className="p-2 text-xs border rounded-lg font-medium"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                />
              </div>

              {/* Customer Selector */}
              <div className="mb-6 bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase text-slate-500">Customer *</label>
                  <button
                    type="button"
                    onClick={() => setShowCustomerModal(true)}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    + New Customer
                  </button>
                </div>
                <select
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs sm:text-sm font-medium"
                  value={selectedCustomer ? selectedCustomer.id : ""}
                  onChange={(e) => {
                    const found = customers.find((c) => c.id == e.target.value);
                    setSelectedCustomer(found || null);
                  }}
                >
                  <option value="">-- Choose Customer --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.mobile}) — Outstanding: {money(c.old_due)}
                    </option>
                  ))}
                </select>
                {selectedCustomer && (
                  <div className="mt-2 text-xs flex gap-4 text-slate-600">
                    <span>Mobile: <b>{selectedCustomer.mobile || "N/A"}</b></span>
                    <span>Opening / Ledger Due: <b className="text-rose-600">{money(selectedCustomer.old_due)}</b></span>
                  </div>
                )}
              </div>

              {/* Procured Items Cart */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase text-slate-500">Pick Procured Stock Items *</h3>
                  <button onClick={addCartLine} className="text-xs font-bold text-blue-600 flex items-center gap-1">
                    <Plus size={14} /> Add Line
                  </button>
                </div>

                <div className="space-y-3">
                  {cart.map((line, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex-1">
                        <select
                          className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-medium"
                          value={line.procurement_id}
                          onChange={(e) => handleProcureSelectInCart(idx, e.target.value)}
                        >
                          <option value="">-- Select In-Stock / Procured Item --</option>
                          {procurements
                            .filter((p) => Number(p.remaining_qty) > 0)
                            .map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.item_name} [{p.supplier_name}] — Avail: {p.remaining_qty}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex-1 sm:w-24">
                          <input
                            type="number"
                            placeholder="Rate"
                            className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-medium"
                            value={line.rate}
                            onChange={(e) => updateCartLine(idx, "rate", e.target.value)}
                          />
                        </div>
                        <div className="w-20">
                          <input
                            type="number"
                            min="1"
                            max={line.max_qty || 9999}
                            placeholder="Qty"
                            className="w-full p-2 text-xs bg-white border border-slate-300 rounded-lg font-medium"
                            value={line.qty}
                            onChange={(e) => updateCartLine(idx, "qty", e.target.value)}
                          />
                        </div>
                        <div className="w-24 text-right font-bold text-xs sm:text-sm">
                          {money(line.total)}
                        </div>
                        <button onClick={() => removeCartLine(idx)} className="text-slate-400 hover:text-rose-600 p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bill Payment Summary Panel */}
            <div className="lg:col-span-4 space-y-4 sm:space-y-6">
              <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200">
                <h3 className="text-xs font-bold uppercase text-slate-500 mb-4">Invoice Total</h3>
                <div className="space-y-2 pb-4 border-b border-slate-100 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Bill Amount:</span>
                    <span className="font-bold">{money(billSubTotal)}</span>
                  </div>
                  {selectedCustomer && (
                    <div className="flex justify-between text-rose-600">
                      <span>Existing Due:</span>
                      <span className="font-bold">{money(selectedCustomer.old_due)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base sm:text-lg font-black pt-2 border-t text-slate-900">
                    <span>Payable Now:</span>
                    <span className="text-blue-600">{money(billSubTotal)}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-xs font-bold uppercase text-slate-500 block mb-2">Payment Method</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentType("cash")}
                      className={`py-2 rounded-xl text-xs font-bold border ${
                        paymentType === "cash" ? "bg-emerald-600 text-white border-emerald-600" : "border-slate-200"
                      }`}
                    >
                      Cash
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentType("upi")}
                      className={`py-2 rounded-xl text-xs font-bold border ${
                        paymentType === "upi" ? "bg-indigo-600 text-white border-indigo-600" : "border-slate-200"
                      }`}
                    >
                      UPI
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentType("due")}
                      className={`py-2 rounded-xl text-xs font-bold border ${
                        paymentType === "due" ? "bg-amber-600 text-white border-amber-600" : "border-slate-200"
                      }`}
                    >
                      Credit Due
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Receiver Account</label>
                  <select
                    className="w-full p-2 border rounded-lg text-xs font-medium"
                    value={saleReceiverId}
                    onChange={(e) => setSaleReceiverId(e.target.value)}
                  >
                    {receivers.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  disabled={savingInvoice || billSubTotal <= 0}
                  onClick={handleSaveSale}
                  className="w-full mt-6 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition text-sm"
                >
                  {savingInvoice ? "Processing..." : "Complete & Save Sale"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: SUMMARY DASHBOARD */}
        {activeTab === "summary" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold uppercase text-slate-400 mb-1">Total Sales Generated</p>
                <h3 className="text-2xl font-black text-slate-900">{money(summaryMetrics.totalSales)}</h3>
                <p className="text-[11px] text-slate-500 mt-2">{invoices.length} invoices generated</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold uppercase text-slate-400 mb-1">Customer Dues Pending</p>
                <h3 className="text-2xl font-black text-rose-600">{money(summaryMetrics.totalDuesOutstanding)}</h3>
                <p className="text-[11px] text-slate-500 mt-2">Uncollected balances</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold uppercase text-slate-400 mb-1">Current Stock on Hand</p>
                <h3 className="text-2xl font-black text-emerald-600">{summaryMetrics.stockOnHandQty} Units</h3>
                <p className="text-[11px] text-slate-500 mt-2">Asset Value: {money(summaryMetrics.stockOnHandVal)}</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold uppercase text-slate-400 mb-1">Total Collections</p>
                <div className="text-sm font-bold text-slate-800 mt-1">
                  <div>Cash: <span className="text-emerald-600">{money(summaryMetrics.totalCollectedCash)}</span></div>
                  <div>UPI: <span className="text-indigo-600">{money(summaryMetrics.totalCollectedUPI)}</span></div>
                </div>
              </div>
            </div>

            {/* Receiver Balance Breakdown */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-base text-slate-800 mb-4">Receiver Initial Fund Status</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {receivers.map((r) => (
                  <div key={r.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-2">{r.name}</h4>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Opening Cash:</span>
                        <span className="font-semibold">{money(r.opening_cash)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Opening UPI:</span>
                        <span className="font-semibold text-indigo-600">{money(r.opening_upi)}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t font-black">
                        <span>Total Initial:</span>
                        <span>{money(Number(r.opening_cash || 0) + Number(r.opening_upi || 0))}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: PROCUREMENT & OPENING STOCK */}
        {activeTab === "procurement" && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="font-bold text-base sm:text-lg text-slate-800">Procurements & Stock Register</h2>
                <p className="text-xs text-slate-500">Opening stock and supplier purchases</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIsOpeningStock(true);
                    setProcureForm(prev => ({ ...prev, supplier_name: "Opening Stock", purchase_rate: 0 }));
                    setShowProcureModal(true);
                  }}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <PackageCheck size={16} /> Add Opening Stock
                </button>
                <button
                  onClick={() => {
                    setIsOpeningStock(false);
                    setShowProcureModal(true);
                  }}
                  className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  <Plus size={16} /> Add Supplier Bill
                </button>
              </div>
            </div>

            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b text-[11px] uppercase text-slate-400 font-bold bg-slate-50">
                    <th className="p-3">Date</th>
                    <th className="p-3">Type/Supplier</th>
                    <th className="p-3">Item Name</th>
                    <th className="p-3">Purchased</th>
                    <th className="p-3">Remaining Stock</th>
                    <th className="p-3">Cost Rate</th>
                    <th className="p-3">Total Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700 font-medium">
                  {procurements.map((p) => (
                    <tr key={p.id}>
                      <td className="p-3">{p.purchase_date || p.created_at?.slice(0, 10)}</td>
                      <td className="p-3 font-bold text-slate-900">
                        {p.supplier_name === "Opening Stock" ? (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs">Opening Stock</span>
                        ) : (
                          p.supplier_name
                        )}
                      </td>
                      <td className="p-3">{p.item_name}</td>
                      <td className="p-3">{p.procured_qty}</td>
                      <td className="p-3 font-bold text-emerald-600">{p.remaining_qty}</td>
                      <td className="p-3">{money(p.purchase_rate)}</td>
                      <td className="p-3 font-bold">{money(p.total_amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 4: CUSTOMERS LEDGER */}
        {activeTab === "customers" && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="font-bold text-base sm:text-lg text-slate-800">Customers Ledger & Opening Dues</h2>
                <p className="text-xs text-slate-500">Record customer balances and take settlements</p>
              </div>
              <button
                onClick={() => setShowCustomerModal(true)}
                className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus size={16} /> New Customer
              </button>
            </div>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b text-[11px] uppercase text-slate-400 bg-slate-50 font-bold">
                    <th className="p-3">Customer Name</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Remaining Due</th>
                    <th className="p-3 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {customers.map((c) => (
                    <tr key={c.id}>
                      <td className="p-3 font-bold">{c.name}</td>
                      <td className="p-3">{c.mobile || "-"}</td>
                      <td className="p-3 font-bold text-rose-600">{money(c.old_due)}</td>
                      <td className="p-3 text-right">
                        {Number(c.old_due) > 0 && (
                          <button
                            onClick={() => {
                              setCollectionForm({
                                customer_id: c.id,
                                amount: c.old_due,
                                payment_mode: "Cash",
                                receiver_id: saleReceiverId,
                                notes: "Due settlement"
                              });
                              setShowCollectionModal(true);
                            }}
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg inline-flex items-center gap-1"
                          >
                            Pay Due
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 5: RECEIVERS */}
        {activeTab === "receivers" && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="font-bold text-base sm:text-lg text-slate-800">Receivers</h2>
                <p className="text-xs text-slate-500">Opening balances (Cash & UPI)</p>
              </div>
              <button
                onClick={() => setShowReceiverModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus size={16} /> Add Receiver
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {receivers.map((r) => (
                <div key={r.id} className="p-4 sm:p-5 rounded-xl border border-slate-200 bg-slate-50/50">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 mb-3">{r.name}</h3>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Opening Cash:</span>
                      <span className="font-bold text-slate-800">{money(r.opening_cash)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Opening UPI:</span>
                      <span className="font-bold text-indigo-600">{money(r.opening_upi)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-black text-slate-900">
                      <span>Total Initial:</span>
                      <span>{money(Number(r.opening_cash || 0) + Number(r.opening_upi || 0))}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 6: INVOICES */}
        {activeTab === "invoices" && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200">
            <h2 className="font-bold text-base sm:text-lg text-slate-800 mb-4">Past Invoices</h2>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b text-[11px] uppercase text-slate-400 bg-slate-50">
                    <th className="p-3">ID</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-slate-700">
                  {invoices.map((inv) => (
                    <tr key={inv.id}>
                      <td className="p-3 font-bold">INV-{inv.id}</td>
                      <td className="p-3">{inv.invoice_date || inv.created_at?.slice(0, 10)}</td>
                      <td className="p-3">{inv.customer_name}</td>
                      <td className="p-3 font-bold">{money(inv.total_amount)}</td>
                      <td className="p-3 uppercase font-bold text-xs">{inv.payment_type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: ADD CUSTOMER */}
      {showCustomerModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-base text-slate-800 mb-4">Add Customer</h3>
            <form onSubmit={handleSaveCustomer} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500">Customer Name *</label>
                <input
                  type="text"
                  required
                  className="w-full mt-1 p-2 border rounded-lg text-sm"
                  value={customerForm.name}
                  onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Mobile</label>
                <input
                  type="text"
                  className="w-full mt-1 p-2 border rounded-lg text-sm"
                  value={customerForm.mobile}
                  onChange={(e) => setCustomerForm({ ...customerForm, mobile: e.target.value })}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500">Opening Balance / Due (₹)</label>
                <input
                  type="number"
                  className="w-full mt-1 p-2 border rounded-lg text-sm"
                  placeholder="0"
                  value={customerForm.old_due}
                  onChange={(e) => setCustomerForm({ ...customerForm, old_due: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowCustomerModal(false)} className="px-4 py-2 border rounded-xl text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs">
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD RECEIVER */}
      {showReceiverModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-base text-slate-800 mb-4">Add Receiver</h3>
            <form onSubmit={handleSaveReceiver} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500">Receiver Name *</label>
                <input
                  type="text"
                  required
                  className="w-full mt-1 p-2 border rounded-lg text-sm"
                  value={receiverForm.name}
                  onChange={(e) => setReceiverForm({ ...receiverForm, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-500">Opening Cash (₹)</label>
                  <input
                    type="number"
                    className="w-full mt-1 p-2 border rounded-lg text-sm"
                    placeholder="0"
                    value={receiverForm.opening_cash}
                    onChange={(e) => setReceiverForm({ ...receiverForm, opening_cash: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">Opening UPI (₹)</label>
                  <input
                    type="number"
                    className="w-full mt-1 p-2 border rounded-lg text-sm"
                    placeholder="0"
                    value={receiverForm.opening_upi}
                    onChange={(e) => setReceiverForm({ ...receiverForm, opening_upi: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowReceiverModal(false)} className="px-4 py-2 border rounded-xl text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs">
                  Save Receiver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PROCUREMENT (SPLIT INTO 2 RECEIVERS SUPPORTED) */}
      {showProcureModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full my-8">
            <h3 className="font-bold text-base text-slate-800 mb-1">
              {isOpeningStock ? "Add Opening Stock" : "Add Procurement Bill"}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              {isOpeningStock ? "Directly adds items to your available sales stock" : "Records purchase invoice & deducts payments from receivers"}
            </p>

            <form onSubmit={handleSaveProcurement} className="space-y-3">
              {!isOpeningStock && (
                <div>
                  <label className="text-xs font-bold text-slate-500">Supplier Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full mt-1 p-2 border rounded-lg text-sm"
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
                  className="w-full mt-1 p-2 border rounded-lg text-sm"
                  value={procureForm.item_name}
                  onChange={(e) => setProcureForm({ ...procureForm, item_name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-500">Quantity *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full mt-1 p-2 border rounded-lg text-sm font-bold"
                    value={procureForm.procured_qty}
                    onChange={(e) => setProcureForm({ ...procureForm, procured_qty: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500">Cost Rate (₹)</label>
                  <input
                    type="number"
                    className="w-full mt-1 p-2 border rounded-lg text-sm"
                    value={procureForm.purchase_rate}
                    onChange={(e) => setProcureForm({ ...procureForm, purchase_rate: e.target.value })}
                  />
                </div>
              </div>

              {!isOpeningStock && (
                <div className="pt-2 border-t border-slate-100">
                  <label className="text-xs font-bold uppercase text-slate-500 block mb-1">Paid by Receiver 1</label>
                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <select
                      className="p-2 border rounded-lg text-xs"
                      value={procureForm.receiver_1_id}
                      onChange={(e) => setProcureForm({ ...procureForm, receiver_1_id: e.target.value })}
                    >
                      <option value="">-- Receiver 1 --</option>
                      {receivers.map((r) => (
                        <option key={r.id} value={r.id}>{r.name}</option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Amount"
                      className="p-2 border rounded-lg text-xs"
                      value={procureForm.receiver_1_amount}
                      onChange={(e) => setProcureForm({ ...procureForm, receiver_1_amount: e.target.value })}
                    />
                    <select
                      className="p-2 border rounded-lg text-xs font-bold"
                      value={procureForm.receiver_1_mode}
                      onChange={(e) => setProcureForm({ ...procureForm, receiver_1_mode: e.target.value })}
                    >
                      <option value="Cash">Cash</option>
                      <option value="UPI">UPI</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 mt-2 mb-2">
                    <input
                      type="checkbox"
                      id="second_rec"
                      checked={procureForm.has_second_receiver}
                      onChange={(e) => setProcureForm({ ...procureForm, has_second_receiver: e.target.checked })}
                    />
                    <label htmlFor="second_rec" className="text-xs font-bold text-slate-600">
                      Paid with 2nd Receiver also (Split Bill)
                    </label>
                  </div>

                  {procureForm.has_second_receiver && (
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        className="p-2 border rounded-lg text-xs"
                        value={procureForm.receiver_2_id}
                        onChange={(e) => setProcureForm({ ...procureForm, receiver_2_id: e.target.value })}
                      >
                        <option value="">-- Receiver 2 --</option>
                        {receivers.map((r) => (
                          <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        placeholder="Amount"
                        className="p-2 border rounded-lg text-xs"
                        value={procureForm.receiver_2_amount}
                        onChange={(e) => setProcureForm({ ...procureForm, receiver_2_amount: e.target.value })}
                      />
                      <select
                        className="p-2 border rounded-lg text-xs font-bold"
                        value={procureForm.receiver_2_mode}
                        onChange={(e) => setProcureForm({ ...procureForm, receiver_2_mode: e.target.value })}
                      >
                        <option value="UPI">UPI</option>
                        <option value="Cash">Cash</option>
                      </select>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowProcureModal(false)} className="px-4 py-2 border rounded-xl text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl text-xs">
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PAY OPENING DUE / SETTLE DUE */}
      {showCollectionModal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-base text-slate-800 mb-2">Pay Due / Opening Balance</h3>
            <p className="text-xs text-slate-400 mb-4">Record customer settlement into Cash or UPI</p>

            <form onSubmit={handleSaveCollection} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-500">Customer *</label>
                <select
                  required
                  className="w-full mt-1 p-2 border rounded-lg text-sm"
                  value={collectionForm.customer_id}
                  onChange={(e) => {
                    const cust = customers.find(c => c.id == e.target.value);
                    setCollectionForm({
                      ...collectionForm,
                      customer_id: e.target.value,
                      amount: cust ? cust.old_due : ""
                    });
                  }}
                >
                  <option value="">-- Select Customer --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Due: {money(c.old_due)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500">Settlement Amount (₹) *</label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full mt-1 p-2 border rounded-lg text-sm font-bold text-slate-900"
                  value={collectionForm.amount}
                  onChange={(e) => setCollectionForm({ ...collectionForm, amount: e.target.value })}
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Received As</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCollectionForm({ ...collectionForm, payment_mode: "Cash" })}
                    className={`py-2 rounded-lg text-xs font-bold border ${
                      collectionForm.payment_mode === "Cash" ? "bg-emerald-600 text-white border-emerald-600" : "border-slate-200"
                    }`}
                  >
                    💵 Cash
                  </button>
                  <button
                    type="button"
                    onClick={() => setCollectionForm({ ...collectionForm, payment_mode: "UPI" })}
                    className={`py-2 rounded-lg text-xs font-bold border ${
                      collectionForm.payment_mode === "UPI" ? "bg-indigo-600 text-white border-indigo-600" : "border-slate-200"
                    }`}
                  >
                    📱 UPI
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Receiver Account</label>
                <select
                  className="w-full p-2 border rounded-lg text-xs"
                  value={collectionForm.receiver_id || saleReceiverId}
                  onChange={(e) => setCollectionForm({ ...collectionForm, receiver_id: e.target.value })}
                >
                  {receivers.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button type="button" onClick={() => setShowCollectionModal(false)} className="px-4 py-2 border rounded-xl text-xs font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-xl text-xs">
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
