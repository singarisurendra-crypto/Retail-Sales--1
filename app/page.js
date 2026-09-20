"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  LayoutDashboard,
  Receipt,
  Users,
  Package,
  Settings,
  Plus,
  Trash2,
  Menu,
  X,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Wallet,
  ArrowDownLeft
} from "lucide-react";

const supabaseUrl = "https://YOUR-PROJECT-REF.supabase.co";
const supabaseKey = "sb_publishable_YOUR_KEY_HERE";
const db = createClient(supabaseUrl, supabaseKey);

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const today = () => new Date().toISOString().slice(0, 10);
const displayDate = (value) => {
  if (!value) return "-";
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const emptyCustomer = { customer_name: "", mobile_no: "", opening_due: 0 };
const emptyItem = { item_name: "", sale_rate: 0, opening_stock: 0 };
const emptyReceiver = { receiver_name: "", opening_balance: 0 };
const emptyCollection = { customer_id: "", receiver_id: "", amount: "", notes: "" };

export default function Home() {
  const [screen, setScreen] = useState("sale");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Entities
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const [sales, setSales] = useState([]);
  const [collections, setCollections] = useState([]);

  // Modals
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showReceiverForm, setShowReceiverForm] = useState(false);
  const [showCollectModal, setShowCollectModal] = useState(false);
  const [customerForm, setCustomerForm] = useState(emptyCustomer);
  const [itemForm, setItemForm] = useState(emptyItem);
  const [receiverForm, setReceiverForm] = useState(emptyReceiver);
  const [collectForm, setCollectForm] = useState(emptyCollection);
  const [masterTab, setMasterTab] = useState("receivers");

  // Sale Entry
  const [saleDate, setSaleDate] = useState(today());
  const [saleCustomer, setSaleCustomer] = useState("");
  const [saleCustomerSearch, setSaleCustomerSearch] = useState("");
  const [openCustomerPicker, setOpenCustomerPicker] = useState(false);
  const [saleItems, setSaleItems] = useState([{ item_id: "", rate: 0, qty: 1 }]);
  const [salePayment, setSalePayment] = useState("DUE");
  const [saleReceiver, setSaleReceiver] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [c, i, r, sa, co] = await Promise.all([
        db.from("customers").select("*").order("name"),
        db.from("items").select("*").order("item_name"),
        db.from("receivers").select("*").order("name"),
        db.from("invoices").select("*").order("invoice_date", { ascending: false }),
        db.from("collections").select("*").order("created_at", { ascending: false })
      ]);

      if (c.data) setCustomers(c.data);
      if (i.data) setItems(i.data);
      if (r.data) setReceivers(r.data);
      if (sa.data) setSales(sa.data);
      if (co.data) setCollections(co.data);
    } catch (err) {
      console.error(err);
      flash("Error loading records from database.");
    } finally {
      setLoading(false);
    }
  }

  function flash(msg) {
    setNotice(msg);
    setTimeout(() => setNotice(""), 4000);
  }

  function go(screenName) {
    setScreen(screenName);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const stockMap = useMemo(() => {
    const m = {};
    items.forEach((x) => (m[x.id] = Number(x.current_stock || 0)));
    return m;
  }, [items]);

  const customerDue = (customerId) => {
    const c = customers.find((x) => x.id === Number(customerId));
    const invDue = sales
      .filter((x) => x.customer_id === Number(customerId) && x.payment_status === "DUE")
      .reduce((a, x) => a + Number(x.total_amount || 0), 0);
    return Number(c?.old_due || 0) + invDue;
  };

  const saleTotal = saleItems.reduce((a, x) => a + Number(x.rate || 0) * Number(x.qty || 0), 0);
  const saleCustomerRecord = customers.find((x) => x.id === Number(saleCustomer));
  const pickerCustomers = customers.filter((c) =>
    `${c.name || ""} ${c.mobile || ""}`.toLowerCase().includes(saleCustomerSearch.toLowerCase())
  );

  // Save Masters
  async function saveCustomer(e) {
    e.preventDefault();
    if (!customerForm.customer_name.trim()) return flash("Customer name is required.");
    const payload = {
      name: customerForm.customer_name,
      mobile: customerForm.mobile_no || "0000000000",
      old_due: Number(customerForm.opening_due || 0)
    };
    const { data, error } = await db.from("customers").insert(payload).select().single();
    if (error) return flash(error.message);
    setCustomerForm(emptyCustomer);
    setShowCustomerForm(false);
    await loadAll();
    if (data?.id) setSaleCustomer(String(data.id));
    flash("Customer added successfully!");
  }

  async function saveItem(e) {
    e.preventDefault();
    if (!itemForm.item_name.trim()) return flash("Item name is required.");
    const payload = {
      item_name: itemForm.item_name,
      unit_price: Number(itemForm.sale_rate || 0),
      current_stock: Number(itemForm.opening_stock || 0)
    };
    const { error } = await db.from("items").insert(payload);
    if (error) return flash(error.message);
    setItemForm(emptyItem);
    setShowItemForm(false);
    await loadAll();
    flash("Item added successfully!");
  }

  async function saveReceiver(e) {
    e.preventDefault();
    if (!receiverForm.receiver_name.trim()) return flash("Account name is required.");
    const payload = {
      name: receiverForm.receiver_name,
      balance: Number(receiverForm.opening_balance || 0)
    };
    const { error } = await db.from("receivers").insert(payload);
    if (error) return flash(error.message);
    setReceiverForm(emptyReceiver);
    setShowReceiverForm(false);
    await loadAll();
    flash("Receiver account added!");
  }

  // Record Collection From Customer
  async function saveCollection(e) {
    e.preventDefault();
    const custId = Number(collectForm.customer_id);
    const recId = Number(collectForm.receiver_id);
    const amount = Number(collectForm.amount);

    if (!custId) return flash("Please select a customer.");
    if (!recId) return flash("Please select a receiver account.");
    if (amount <= 0) return flash("Enter a valid payment amount.");

    const customer = customers.find((c) => c.id === custId);
    const receiver = receivers.find((r) => r.id === recId);

    // 1. Save Collection Log
    await db.from("collections").insert({
      collection_no: `COL-${Date.now()}`,
      collection_date: today(),
      customer_id: custId,
      receiver_id: recId,
      payment_mode: "CASH",
      total_amount: amount,
      remarks: collectForm.notes || `Collection from ${customer?.name}`
    });

    // 2. Reduce Customer Due
    const currentDue = Number(customer?.old_due || 0);
    await db
      .from("customers")
      .update({ old_due: Math.max(0, currentDue - amount) })
      .eq("id", custId);

    // 3. Increase Receiver Account Balance
    const currentBal = Number(receiver?.balance || 0);
    await db
      .from("receivers")
      .update({ balance: currentBal + amount })
      .eq("id", recId);

    flash(`Received ${money(amount)} into ${receiver?.name}!`);
    setCollectForm(emptyCollection);
    setShowCollectModal(false);
    await loadAll();
  }

  // Create Sale
  async function createSale(e) {
    e.preventDefault();
    if (!saleCustomer) return flash("Please select a customer.");
    if (!saleItems.length || saleItems.some((x) => !x.item_id || Number(x.qty) <= 0)) {
      return flash("Please select items and valid quantities.");
    }

    const nextInvoiceNo = `Inv-${String(sales.length + 1).padStart(4, "0")}`;
    const { data: sale, error } = await db
      .from("invoices")
      .insert({
        invoice_number: nextInvoiceNo,
        invoice_date: saleDate,
        customer_id: Number(saleCustomer),
        customer_name: saleCustomerRecord?.name || "Customer",
        total_amount: saleTotal,
        payment_status: salePayment,
        receiver_id: salePayment === "PAID" && saleReceiver ? Number(saleReceiver) : null
      })
      .select()
      .single();

    if (error) return flash(error.message);

    const rows = saleItems.map((x) => {
      const itm = items.find((i) => i.id === Number(x.item_id));
      return {
        invoice_id: sale.id,
        item_id: Number(x.item_id),
        item_name: itm?.item_name || "Item",
        rate: Number(x.rate),
        quantity: Number(x.qty),
        line_total: Number(x.rate) * Number(x.qty)
      };
    });

    await db.from("invoice_items").insert(rows);

    for (const x of saleItems) {
      const it = items.find((i) => i.id === Number(x.item_id));
      if (it) {
        await db
          .from("items")
          .update({ current_stock: Math.max(0, Number(it.current_stock || 0) - Number(x.qty)) })
          .eq("id", x.item_id);
      }
    }

    if (salePayment === "PAID" && saleReceiver) {
      const r = receivers.find((rec) => rec.id === Number(saleReceiver));
      if (r) {
        await db
          .from("receivers")
          .update({ balance: Number(r.balance || 0) + saleTotal })
          .eq("id", Number(saleReceiver));
      }
    } else if (salePayment === "DUE") {
      const currentDue = Number(saleCustomerRecord?.old_due || 0);
      await db
        .from("customers")
        .update({ old_due: currentDue + saleTotal })
        .eq("id", Number(saleCustomer));
    }

    flash(`Invoice ${nextInvoiceNo} created successfully!`);
    setSaleCustomer("");
    setSaleItems([{ item_id: "", rate: 0, qty: 1 }]);
    setSalePayment("DUE");
    await loadAll();
    go("sales");
  }

  const navLinks = [
    { id: "sale", label: "Create Sale", icon: Plus, highlight: true },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "sales", label: "Invoices", icon: Receipt },
    { id: "customers", label: "Customers", icon: Users },
    { id: "receivers", label: "Receivers (Cash)", icon: Wallet },
    { id: "stock", label: "Stock", icon: Package },
    { id: "master", label: "Settings", icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg active:bg-slate-200"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => go("dashboard")}>
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-sm">
                B
              </div>
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                B REDDY <span className="text-indigo-600">SALES</span>[span_11](start_span)[span_11](end_span)
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => go(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition ${
                    screen === tab.id
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100"
                  } ${tab.highlight ? "bg-indigo-600 !text-white hover:!bg-indigo-700 ml-2" : ""}`}
                >
                  <Icon className="w-4 h-4" /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex print:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-2xl flex flex-col justify-between p-5 z-50">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                    B
                  </div>
                  <span className="font-extrabold text-sm text-slate-900">B REDDY SALES</span>[span_12](start_span)[span_12](end_span)
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-1">
                {navLinks.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => go(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition ${
                        screen === tab.id
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-400">
              Retail Inventory & Billing
            </div>
          </div>
        </div>
      )}

      {/* Floating Notice Alert */}
      {notice && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700 max-w-sm print:hidden">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <span className="text-sm font-medium">{notice}</span>
          <button onClick={() => setNotice("")} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-24 lg:pb-12">
        {/* VIEW: CREATE SALE */}
        {screen === "sale" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sales Entry</span>
                <h1 className="text-xl font-black text-slate-900">Create Invoice</h1>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Total Bill</span>
                <div className="text-2xl font-black text-indigo-700">{money(saleTotal)}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                {/* Customer Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Customer *</label>
                    <button
                      type="button"
                      onClick={() => { setCustomerForm(emptyCustomer); setShowCustomerForm(true); }}
                      className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                    >
                      + New Customer
                    </button>
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenCustomerPicker(!openCustomerPicker)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-left flex justify-between items-center text-sm font-semibold"
                    >
                      <span>{saleCustomerRecord?.name || "Select Customer"}</span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </button>

                    {openCustomerPicker && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 p-2 max-h-60 overflow-y-auto">
                        <input
                          type="text"
                          placeholder="Search customer..."
                          value={saleCustomerSearch}
                          onChange={(e) => setSaleCustomerSearch(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs mb-2 font-medium"
                        />
                        {pickerCustomers.map((c) => (
                          <div
                            key={c.id}
                            onClick={() => { setSaleCustomer(String(c.id)); setOpenCustomerPicker(false); }}
                            className="p-2 hover:bg-slate-50 rounded-lg cursor-pointer flex justify-between items-center text-xs"
                          >
                            <span className="font-bold text-slate-800">{c.name}</span>
                            <span className="text-amber-600 font-bold">Due: {money(customerDue(c.id))}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">Invoice Date</label>
                    <input
                      type="date"
                      value={saleDate}
                      onChange={(e) => setSaleDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-semibold"
                    />
                  </div>
                </div>

                {/* Pick Products Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Pick Product</label>
                    <button
                      type="button"
                      onClick={() => { setItemForm(emptyItem); setShowItemForm(true); }}
                      className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer"
                    >
                      + New Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {saleItems.map((row, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">Item #{idx + 1}</span>
                          {saleItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setSaleItems(saleItems.filter((_, i) => i !== idx))}
                              className="text-rose-500 hover:bg-rose-50 p-1 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <select
                          value={row.item_id}
                          onChange={(e) => {
                            const found = items.find((i) => i.id === Number(e.target.value));
                            setSaleItems(
                              saleItems.map((r, i) =>
                                i === idx ? { ...r, item_id: e.target.value, rate: found?.unit_price || 0 } : r
                              )
                            );
                          }}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-semibold"
                        >
                          <option value="">-- Choose Item --</option>
                          {items.map((i) => (
                            <option key={i.id} value={i.id}>
                              {i.item_name} (Stock: {stockMap[i.id] || 0})
                            </option>
                          ))}
                        </select>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block mb-1">Rate (₹)</span>
                            <input
                              type="number"
                              value={row.rate}
                              onChange={(e) =>
                                setSaleItems(saleItems.map((r, i) => (i === idx ? { ...r, rate: e.target.value } : r)))
                              }
                              className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold"
                            />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block mb-1">Qty</span>
                            <input
                              type="number"
                              min="1"
                              value={row.qty}
                              onChange={(e) =>
                                setSaleItems(saleItems.map((r, i) => (i === idx ? { ...r, qty: e.target.value } : r)))
                              }
                              className="w-full bg-white border border-slate-300 rounded-lg p-2 text-xs font-bold"
                            />
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => setSaleItems([...saleItems, { item_id: "", rate: 0, qty: 1 }])}
                      className="w-full py-2 border-2 border-dashed border-slate-300 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Add Another Item
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Summary & Settle */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between min-h-[380px]">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">Invoice Items</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b text-slate-400 uppercase font-bold">
                            <th className="pb-2">Item</th>
                            <th className="pb-2 text-right">Price</th>
                            <th className="pb-2 text-center">Qty</th>
                            <th className="pb-2 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium">
                          {saleItems.filter((x) => x.item_id).length === 0 ? (
                            <tr>
                              <td colSpan="4" className="py-12 text-center text-slate-400 font-medium">
                                No items added yet. Pick products on the left.
                              </td>
                            </tr>
                          ) : (
                            saleItems
                              .filter((x) => x.item_id)
                              .map((r, i) => {
                                const itm = items.find((it) => it.id === Number(r.item_id));
                                return (
                                  <tr key={i}>
                                    <td className="py-2.5 font-bold text-slate-800">{itm?.item_name}</td>
                                    <td className="py-2.5 text-right font-bold text-slate-600">{money(r.rate)}</td>
                                    <td className="py-2.5 text-center font-bold text-indigo-600">{r.qty}</td>
                                    <td className="py-2.5 text-right font-black text-slate-900">{money(Number(r.rate) * Number(r.qty))}</td>
                                  </tr>
                                );
                              })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-4 mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-bold text-slate-500">Bill Total</span>
                      <span className="text-2xl font-black text-slate-900">{money(saleTotal)}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <button
                        type="button"
                        onClick={() => setSalePayment("PAID")}
                        className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                          salePayment === "PAID" ? "bg-emerald-50 border-emerald-500 text-emerald-700" : "bg-white border-slate-300 text-slate-600"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" /> Fully Paid
                      </button>
                      <button
                        type="button"
                        onClick={() => setSalePayment("DUE")}
                        className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 ${
                          salePayment === "DUE" ? "bg-amber-50 border-amber-500 text-amber-700" : "bg-white border-slate-300 text-slate-600"
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4" /> Due / Credit
                      </button>
                    </div>

                    {salePayment === "PAID" && (
                      <div className="mb-4">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Deposit To Receiver (Cash/PhonePe)</label>
                        <select
                          value={saleReceiver}
                          onChange={(e) => setSaleReceiver(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
                        >
                          <option value="">Select receiver account...</option>
                          {receivers.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.name} ({money(r.balance)})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={createSale}
                      disabled={!saleCustomer || saleTotal <= 0}
                      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-extrabold text-sm rounded-xl shadow-md transition cursor-pointer"
                    >
                      Complete & Save Sale
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: RECEIVERS & CASH BALANCES */}
        {screen === "receivers" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Receivers & Cash Drawer</h1>
                <p className="text-xs text-slate-500 mt-1">Track balances in your cash boxes, UPI, and bank accounts</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setCollectForm(emptyCollection); setShowCollectModal(true); }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <ArrowDownLeft className="w-4 h-4" /> Collect Money from Customer
                </button>
                <button
                  onClick={() => { setReceiverForm(emptyReceiver); setShowReceiverForm(true); }}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Receiver
                </button>
              </div>
            </div>

            {/* Receiver Balance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {receivers.map((r) => (
                <div key={r.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Account</span>
                    <h3 className="text-base font-bold text-slate-800 mt-1">{r.name}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Balance</span>
                    <div className="text-xl font-black text-slate-900 mt-0.5">{money(r.balance)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Collections Log Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-800">Recent Collections Received ({collections.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b text-slate-400 uppercase font-bold">
                      <th className="pb-3">Receipt No</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {collections.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-slate-400">
                          No collections recorded yet. Tap &ldquo;Collect Money from Customer&rdquo; above to receive payments.
                        </td>
                      </tr>
                    ) : (
                      collections.map((co) => (
                        <tr key={co.id}>
                          <td className="py-3 font-bold text-indigo-600">{co.collection_no}</td>
                          <td className="py-3 text-slate-600">{displayDate(co.collection_date || co.created_at?.slice(0, 10))}</td>
                          <td className="py-3 font-black text-emerald-600">{money(co.total_amount)}</td>
                          <td className="py-3 text-slate-500">{co.remarks || "-"}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: DASHBOARD */}
        {screen === "dashboard" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-slate-900">Store Dashboard</h1>
              <button
                onClick={() => go("sale")}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> New Sale
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-400">Total Invoices</span>
                <p className="text-2xl font-black text-slate-900 mt-2">{sales.length}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-400">Registered Customers</span>
                <p className="text-2xl font-black text-slate-900 mt-2">{customers.length}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold uppercase text-slate-400">Catalog Products</span>
                <p className="text-2xl font-black text-slate-900 mt-2">{items.length}</p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: INVOICES */}
        {screen === "sales" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900">Invoices ({sales.length})</h2>
              <button onClick={() => go("sale")} className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                + New Sale
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-slate-400 uppercase font-bold">
                    <th className="pb-3">Invoice</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sales.map((s) => (
                    <tr key={s.id}>
                      <td className="py-3 font-bold text-indigo-600">{s.invoice_number}</td>
                      <td className="py-3 text-slate-600">{displayDate(s.invoice_date)}</td>
                      <td className="py-3 font-semibold text-slate-800">{s.customer_name}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${s.payment_status === "PAID" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                          {s.payment_status || "DUE"}
                        </span>
                      </td>
                      <td className="py-3 text-right font-black text-slate-900">{money(s.total_amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW: CUSTOMERS */}
        {screen === "customers" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900">Customers ({customers.length})</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => { setCollectForm(emptyCollection); setShowCollectModal(true); }}
                  className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg"
                >
                  Collect Due
                </button>
                <button onClick={() => { setCustomerForm(emptyCustomer); setShowCustomerForm(true); }} className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                  + Add Customer
                </button>
              </div>
            </div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b text-slate-400 uppercase font-bold">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Mobile</th>
                  <th className="pb-2 text-right">Due Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td className="py-2.5 font-bold text-slate-800">{c.name}</td>
                    <td className="py-2.5 text-slate-500">{c.mobile}</td>
                    <td className="py-2.5 text-right font-black text-amber-600">{money(customerDue(c.id))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* VIEW: STOCK */}
        {screen === "stock" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-900">Current Stock ({items.length})</h2>
              <button onClick={() => { setItemForm(emptyItem); setShowItemForm(true); }} className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
                + Add Item
              </button>
            </div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b text-slate-400 uppercase font-bold">
                  <th className="pb-2">Product Name</th>
                  <th className="pb-2 text-right">Price</th>
                  <th className="pb-2 text-right">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map((it) => (
                  <tr key={it.id}>
                    <td className="py-3 font-bold text-slate-800">{it.item_name}</td>
                    <td className="py-3 text-right font-medium text-slate-600">{money(it.unit_price)}</td>
                    <td className="py-3 text-right font-black text-indigo-600">{stockMap[it.id] || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* VIEW: MASTER DATA */}
        {screen === "master" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Application Settings</h2>
            <p className="text-xs text-slate-500">Connected to Supabase Project</p>
          </div>
        )}
      </main>

      {/* Fixed Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-1.5 flex justify-around items-center z-30 shadow-2xl print:hidden">
        {navLinks.slice(0, 5).map((tab) => {
          const Icon = tab.icon;
          const isActive = screen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => go(tab.id)}
              className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition cursor-pointer ${
                isActive ? "text-indigo-600 font-bold" : "text-slate-500 font-medium"
              }`}
            >
              <Icon className={`w-5 h-5 ${tab.highlight ? "text-indigo-600" : ""}`} />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* COLLECT DUE MONEY MODAL */}
      {showCollectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={saveCollection} className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-slate-900">Collect Due Payment</h3>
              <button type="button" onClick={() => setShowCollectModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Select Customer *</label>
              <select
                required
                value={collectForm.customer_id}
                onChange={(e) => setCollectForm({ ...collectForm, customer_id: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold"
              >
                <option value="">-- Choose customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (Due: {money(customerDue(c.id))})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Deposit To Receiver (Cash/PhonePe) *</label>
              <select
                required
                value={collectForm.receiver_id}
                onChange={(e) => setCollectForm({ ...collectForm, receiver_id: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold"
              >
                <option value="">-- Choose receiver account --</option>
                {receivers.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} ({money(r.balance)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Amount Received (₹) *</label>
              <input
                type="number"
                required
                min="1"
                placeholder="0.00"
                value={collectForm.amount}
                onChange={(e) => setCollectForm({ ...collectForm, amount: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Notes / Remarks</label>
              <input
                type="text"
                placeholder="e.g. Received via PhonePe or Cash"
                value={collectForm.notes}
                onChange={(e) => setCollectForm({ ...collectForm, notes: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-medium"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCollectModal(false)}
                className="flex-1 py-2.5 border border-slate-300 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button type="submit" className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold">
                Confirm & Collect
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Customer Modal */}
      {showCustomerForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={saveCustomer} className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Add Customer</h3>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Customer Name *</label>
              <input
                type="text"
                required
                value={customerForm.customer_name}
                onChange={(e) => setCustomerForm({ ...customerForm, customer_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Mobile Number</label>
              <input
                type="tel"
                value={customerForm.mobile_no}
                onChange={(e) => setCustomerForm({ ...customerForm, mobile_no: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Opening Due (₹)</label>
              <input
                type="number"
                value={customerForm.opening_due}
                onChange={(e) => setCustomerForm({ ...customerForm, opening_due: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCustomerForm(false)}
                className="flex-1 py-2.5 border border-slate-300 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold">
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Item Modal */}
      {showItemForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={saveItem} className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Add Item</h3>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Item Name *</label>
              <input
                type="text"
                required
                value={itemForm.item_name}
                onChange={(e) => setItemForm({ ...itemForm, item_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={itemForm.sale_rate}
                  onChange={(e) => setItemForm({ ...itemForm, sale_rate: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Opening Stock</label>
                <input
                  type="number"
                  value={itemForm.opening_stock}
                  onChange={(e) => setItemForm({ ...itemForm, opening_stock: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowItemForm(false)}
                className="flex-1 py-2.5 border border-slate-300 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold">
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Receiver Modal */}
      {showReceiverForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={saveReceiver} className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Add Account</h3>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Account Name *</label>
              <input
                type="text"
                required
                value={receiverForm.receiver_name}
                onChange={(e) => setReceiverForm({ ...receiverForm, receiver_name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 block mb-1">Opening Balance (₹)</label>
              <input
                type="number"
                value={receiverForm.opening_balance}
                onChange={(e) => setReceiverForm({ ...receiverForm, opening_balance: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowReceiverForm(false)}
                className="flex-1 py-2.5 border border-slate-300 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button type="submit" className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
