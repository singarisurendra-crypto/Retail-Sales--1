"use client";

import { Children, cloneElement, isValidElement, useEffect, useMemo, useState } from "react";
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
  Printer,
  ChevronDown,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Wallet
} from "lucide-react";

// Supabase client initialization with guard against missing env variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";
const db = createClient(supabaseUrl, supabaseKey);

const money = (n) => `₹${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const today = () => new Date().toISOString().slice(0, 10);
const displayDate = (value) => {
  if (!value) return "-";
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const emptyCustomer = { customer_name: "", mobile_no: "", address: "", opening_due: 0 };
const emptyItem = { item_name: "", sale_rate: 0, purchase_rate: 0, opening_stock: 0 };
const emptyReceiver = { receiver_name: "", opening_balance: 0 };

export default function Home() {
  const [screen, setScreen] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Data Collections
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const [sales, setSales] = useState([]);
  const [collections, setCollections] = useState([]);
  const [invoiceItems, setInvoiceItems] = useState([]);

  // Periods for Dashboard
  const [dashboardSalesPeriod, setDashboardSalesPeriod] = useState("day");
  const [dashboardCollectionsPeriod, setDashboardCollectionsPeriod] = useState("day");
  const [dashboardDuePeriod, setDashboardDuePeriod] = useState("day");

  // Masters UI & Modals
  const [masterTab, setMasterTab] = useState("customers");
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showReceiverForm, setShowReceiverForm] = useState(false);
  const [customerForm, setCustomerForm] = useState(emptyCustomer);
  const [itemForm, setItemForm] = useState(emptyItem);
  const [receiverForm, setReceiverForm] = useState(emptyReceiver);

  // Selected Invoice Detail (For Print/Preview)
  const [selectedInvoice, setSelectedInvoice] = useState(null);

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
      const [c, i, r, sa, co, ii] = await Promise.all([
        db.from("customers").select("*").order("name"),
        db.from("items").select("*").order("item_name"),
        db.from("receivers").select("*").order("name"),
        db.from("invoices").select("*").order("invoice_date", { ascending: false }),
        db.from("collections").select("*").order("created_at", { ascending: false }),
        db.from("invoice_items").select("*")
      ]);

      if (c.data) setCustomers(c.data);
      if (i.data) setItems(i.data);
      if (r.data) setReceivers(r.data);
      if (sa.data) setSales(sa.data);
      if (co.data) setCollections(co.data);
      if (ii.data) setInvoiceItems(ii.data);
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

  const inPeriod = (date, period) => {
    if (!date) return false;
    const end = new Date(today() + "T23:59:59");
    const d = new Date(date + "T00:00:00");
    if (d > end) return false;
    if (period === "day") return date === today();
    if (period === "week") {
      const start = new Date(end);
      start.setDate(end.getDate() - end.getDay());
      start.setHours(0, 0, 0, 0);
      return d >= start;
    }
    return d.getFullYear() === end.getFullYear() && d.getMonth() === end.getMonth();
  };

  const periodSales = sales.filter((s) => inPeriod(s.invoice_date, dashboardSalesPeriod));
  const periodCollections = collections.filter((c) => inPeriod(c.collection_date || c.created_at?.slice(0, 10), dashboardCollectionsPeriod));
  const periodDueSales = sales.filter((s) => inPeriod(s.invoice_date, dashboardDuePeriod) && s.payment_status === "DUE");
  const periodSalesTotal = periodSales.reduce((a, x) => a + Number(x.total_amount || 0), 0);
  const periodCollectionsTotal = periodCollections.reduce((a, x) => a + Number(x.total_amount || 0), 0);
  const periodDueTotal = periodDueSales.reduce((a, x) => a + Number(x.total_amount || 0), 0);

  // Master Handlers
  async function saveCustomer(e) {
    e.preventDefault();
    if (!customerForm.customer_name.trim()) return flash("Customer name is required.");
    const payload = {
      name: customerForm.customer_name,
      mobile: customerForm.mobile_no || "0000000000",
      old_due: Number(customerForm.opening_due || 0)
    };
    const { error } = await db.from("customers").insert(payload);
    if (error) return flash(error.message);
    setCustomerForm(emptyCustomer);
    setShowCustomerForm(false);
    await loadAll();
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
    if (!receiverForm.receiver_name.trim()) return flash("Receiver name is required.");
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

  const saleCustomerRecord = customers.find((x) => x.id === Number(saleCustomer));
  const pickerCustomers = customers.filter((c) =>
    `${c.name || ""} ${c.mobile || ""}`.toLowerCase().includes(saleCustomerSearch.toLowerCase())
  );

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
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "sale", label: "Create Sale", icon: Plus, highlight: true },
    { id: "sales", label: "Invoices", icon: Receipt },
    { id: "customers", label: "Customers", icon: Users },
    { id: "stock", label: "Stock", icon: Package },
    { id: "master", label: "Master Data", icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col antialiased">
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => go("dashboard")}>
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-sm">
                B
              </div>
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                B REDDY <span className="text-indigo-600">SALES</span>[span_1](start_span)[span_1](end_span)
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

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-24 lg:pb-12">
        {/* VIEW 1: DASHBOARD */}
        {screen === "dashboard" && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-xs text-slate-500 mt-1">Live metrics and store inventory</p>
              </div>
              <button
                onClick={() => go("sale")}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md"
              >
                <Plus className="w-4 h-4" /> New Invoice
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Total Sales", val: money(periodSalesTotal), period: dashboardSalesPeriod, setPeriod: setDashboardSalesPeriod },
                { label: "Collections", val: money(periodCollectionsTotal), period: dashboardCollectionsPeriod, setPeriod: setDashboardCollectionsPeriod },
                { label: "Outstanding Due", val: money(periodDueTotal), period: dashboardDuePeriod, setPeriod: setDashboardDuePeriod }
              ].map((m, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{m.label}</span>
                    <div className="flex bg-slate-100 rounded-lg p-0.5 text-[10px] font-bold">
                      {["day", "week", "month"].map((p) => (
                        <button
                          key={p}
                          onClick={() => m.setPeriod(p)}
                          className={`px-2 py-0.5 rounded capitalize ${m.period === p ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500"}`}
                        >
                          {p[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="text-2xl font-black text-slate-900">{m.val}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Stock Overview</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {items.map((it) => (
                  <div key={it.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col justify-between">
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">{it.item_name}</span>
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-lg font-black text-indigo-600">{stockMap[it.id] || 0}</span>
                      <span className="text-[10px] font-semibold text-slate-400">units</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: CREATE SALE */}
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
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Customer *</label>
                    <button
                      onClick={() => { setCustomerForm(emptyCustomer); setShowCustomerForm(true); }}
                      className="text-xs font-bold text-indigo-600 hover:underline"
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

                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Pick Product</label>
                    <button
                      onClick={() => { setItemForm(emptyItem); setShowItemForm(true); }}
                      className="text-xs font-bold text-indigo-600 hover:underline"
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
                        <tbody className="divide-y divide-slate-100">
                          {saleItems.filter((x) => x.item_id).length === 0 ? (
                            <tr>
                              <td colSpan="4" className="py-12 text-center text-slate-400">
                                No items added yet.
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

                    {salePayment === "PAID" && receivers.length > 0 && (
                      <div className="mb-4">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Deposit To Receiver</label>
                        <select
                          value={saleReceiver}
                          onChange={(e) => setSaleReceiver(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-bold"
                        >
                          <option value="">Select receiver...</option>
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
                      className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-extrabold text-sm rounded-xl shadow-md transition"
                    >
                      Complete & Save Sale
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: INVOICES LIST */}
        {screen === "sales" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-base font-bold text-slate-900">Invoices</h2>
                <p className="text-xs text-slate-500">Sales records and bills</p>
              </div>
              <button
                onClick={() => go("sale")}
                className="bg-indigo-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Create Sale
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
                    <th className="pb-3 text-center">Print</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sales.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-slate-400">
                        No invoices created yet.
                      </td>
                    </tr>
                  ) : (
                    sales.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="py-3 font-bold text-indigo-600">{s.invoice_number}</td>
                        <td className="py-3 text-slate-600">{displayDate(s.invoice_date)}</td>
                        <td className="py-3 font-semibold text-slate-800">{s.customer_name}</td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              s.payment_status === "PAID"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {s.payment_status || "DUE"}
                          </span>
                        </td>
                        <td className="py-3 text-right font-black text-slate-900">{money(s.total_amount)}</td>
                        <td className="py-3 text-center">
                          <button
                            onClick={() => { setSelectedInvoice(s); go("invoice-detail"); }}
                            className="p-1.5 text-slate-600 hover:text-indigo-600 rounded-md"
                            title="Print / View"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW: INVOICE DETAIL & BROWSER PRINT */}
        {screen === "invoice-detail" && selectedInvoice && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex justify-between items-center print:hidden">
              <button onClick={() => go("sales")} className="flex items-center gap-1 text-xs font-bold text-slate-600">
                <ArrowLeft className="w-4 h-4" /> Back to List
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
              >
                <Printer className="w-4 h-4" /> Print / Save as PDF
              </button>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm print:border-none print:shadow-none print:p-0">
              <div className="border-b pb-4 mb-4 flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">B REDDY SALES</h1>
                  <p className="text-xs text-slate-500">Retail Sales Management</p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-indigo-600">{selectedInvoice.invoice_number}</span>
                  <p className="text-xs text-slate-400 mt-0.5">{displayDate(selectedInvoice.invoice_date)}</p>
                </div>
              </div>

              <div className="mb-6">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Customer Details</span>
                <p className="text-sm font-bold text-slate-800">{selectedInvoice.customer_name}</p>
              </div>

              <table className="w-full text-left text-xs mb-6">
                <thead>
                  <tr className="border-b text-slate-400 uppercase">
                    <th className="pb-2">Item</th>
                    <th className="pb-2 text-right">Price</th>
                    <th className="pb-2 text-center">Qty</th>
                    <th className="pb-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoiceItems
                    .filter((ii) => ii.invoice_id === selectedInvoice.id)
                    .map((item) => (
                      <tr key={item.id}>
                        <td className="py-2 font-bold text-slate-800">{item.item_name}</td>
                        <td className="py-2 text-right">{money(item.rate)}</td>
                        <td className="py-2 text-center">{item.quantity}</td>
                        <td className="py-2 text-right font-bold">{money(item.line_total)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>

              <div className="border-t pt-4 flex justify-between items-center text-sm font-bold">
                <span>Grand Total:</span>
                <span className="text-lg font-black text-indigo-700">{money(selectedInvoice.total_amount)}</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: MASTER DATA */}
        {screen === "master" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="border-b border-slate-200 bg-slate-50/50 flex overflow-x-auto p-1.5 gap-1">
              {[
                { id: "customers", label: "Customers", icon: Users },
                { id: "items", label: "Products / Items", icon: Package },
                { id: "receivers", label: "Receivers / Accounts", icon: Wallet }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setMasterTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      masterTab === tab.id ? "bg-white text-indigo-600 shadow-xs border border-slate-200" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="p-5">
              {masterTab === "customers" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-800">Customers ({customers.length})</h3>
                    <button
                      onClick={() => { setCustomerForm(emptyCustomer); setShowCustomerForm(true); }}
                      className="bg-indigo-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Customer
                    </button>
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

              {masterTab === "items" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-800">Items Catalog ({items.length})</h3>
                    <button
                      onClick={() => { setItemForm(emptyItem); setShowItemForm(true); }}
                      className="bg-indigo-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Item
                    </button>
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b text-slate-400 uppercase font-bold">
                        <th className="pb-2">Item Name</th>
                        <th className="pb-2 text-right">Unit Price</th>
                        <th className="pb-2 text-right">Stock</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {items.map((i) => (
                        <tr key={i.id}>
                          <td className="py-2.5 font-bold text-slate-800">{i.item_name}</td>
                          <td className="py-2.5 text-right font-semibold text-slate-700">{money(i.unit_price)}</td>
                          <td className="py-2.5 text-right font-black text-emerald-600">{stockMap[i.id] || 0}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {masterTab === "receivers" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-slate-800">Receivers / Accounts ({receivers.length})</h3>
                    <button
                      onClick={() => { setReceiverForm(emptyReceiver); setShowReceiverForm(true); }}
                      className="bg-indigo-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Receiver
                    </button>
                  </div>
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b text-slate-400 uppercase font-bold">
                        <th className="pb-2">Account Name</th>
                        <th className="pb-2 text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {receivers.map((r) => (
                        <tr key={r.id}>
                          <td className="py-2.5 font-bold text-slate-800">{r.name}</td>
                          <td className="py-2.5 text-right font-black text-indigo-600">{money(r.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 5: STOCK LIST */}
        {screen === "stock" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Inventory Stock</h2>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b text-slate-400 uppercase font-bold">
                  <th className="pb-2">Item Name</th>
                  <th className="pb-2 text-right">Price</th>
                  <th className="pb-2 text-right">Current Stock</th>
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
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-1.5 flex justify-around items-center z-30 shadow-2xl print:hidden">
        {navLinks.slice(0, 5).map((tab) => {
          const Icon = tab.icon;
          const isActive = screen === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => go(tab.id)}
              className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition ${
                isActive ? "text-indigo-600 font-bold" : "text-slate-500 font-medium"
              }`}
            >
              <Icon className={`w-5 h-5 ${tab.highlight ? "text-indigo-600" : ""}`} />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Customer Modal */}
      {showCustomerForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
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

      {/* Item Modal */}
      {showItemForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
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

      {/* Receiver Modal */}
      {showReceiverForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={saveReceiver} className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Add Receiver</h3>
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
              <label className="text-xs font-bold text-slate-500 block mb-1">Balance (₹)</label>
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
