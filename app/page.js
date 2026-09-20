'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  Check, 
  RefreshCw,
  Users,
  Package,
  FolderTree,
  Wallet,
  Receipt,
  Layers,
  X
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  // Navigation: 'sale' | 'masters' | 'history'
  const [activeTab, setActiveTab] = useState('sale');
  const [masterTab, setMasterTab] = useState('items'); // 'items' | 'customers' | 'categories' | 'receivers'

  // Master Data States
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Invoice Creation States
  const [invoiceNumber, setInvoiceNumber] = useState('Inv-0001');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('ALL');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [entryRate, setEntryRate] = useState('');
  const [entryQty, setEntryQty] = useState(1);
  const [stockError, setStockError] = useState('');
  const [lineItems, setLineItems] = useState([]);

  // Payment Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentType, setPaymentType] = useState('PAID');
  const [selectedReceiverId, setSelectedReceiverId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Forms for Creating Master Data
  const [newCustomer, setNewCustomer] = useState({ name: '', mobile: '', old_due: 0 });
  const [newCategory, setNewCategory] = useState({ name: '' });
  const [newItem, setNewItem] = useState({ item_name: '', category_id: '', unit_price: '', current_stock: '' });
  const [newReceiver, setNewReceiver] = useState({ name: '', balance: 0 });
  const [formMsg, setFormMsg] = useState('');

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    setLoading(true);
    try {
      const [custRes, catRes, itemsRes, recRes, invRes] = await Promise.all([
        supabase.from('customers').select('*').order('name'),
        supabase.from('master_categories').select('*').order('name'),
        supabase.from('items').select('*').order('item_name'),
        supabase.from('receivers').select('*').order('name'),
        supabase.from('invoices').select('*').order('created_at', { ascending: false }).limit(20)
      ]);

      if (custRes.data) {
        setCustomers(custRes.data);
        if (custRes.data.length > 0 && !selectedCustomerId) {
          setSelectedCustomerId(custRes.data[0].id);
        }
      }
      if (catRes.data) setCategories(catRes.data);
      if (itemsRes.data) setItems(itemsRes.data);
      if (recRes.data) {
        setReceivers(recRes.data);
        if (recRes.data.length > 0 && !selectedReceiverId) {
          setSelectedReceiverId(recRes.data[0].id);
        }
      }
      if (invRes.data) setInvoices(invRes.data);

      const nextCount = (invRes.data ? invRes.data.length : 0) + 1;
      setInvoiceNumber(`Inv-${String(nextCount).padStart(4, '0')}`);
    } catch (err) {
      console.error('Data load error:', err);
    } finally {
      setLoading(false);
    }
  }

  // Master Data Add Handlers
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.mobile) return;
    const { error } = await supabase.from('customers').insert([newCustomer]);
    if (error) {
      setFormMsg(`Error: ${error.message}`);
    } else {
      setFormMsg('Customer added successfully!');
      setNewCustomer({ name: '', mobile: '', old_due: 0 });
      fetchAllData();
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name) return;
    const { error } = await supabase.from('master_categories').insert([newCategory]);
    if (error) {
      setFormMsg(`Error: ${error.message}`);
    } else {
      setFormMsg('Category added successfully!');
      setNewCategory({ name: '' });
      fetchAllData();
    }
  };

  const handleAddItemMaster = async (e) => {
    e.preventDefault();
    if (!newItem.item_name || !newItem.unit_price) return;
    const { error } = await supabase.from('items').insert([{
      item_name: newItem.item_name,
      category_id: newItem.category_id ? Number(newItem.category_id) : null,
      unit_price: Number(newItem.unit_price),
      current_stock: Number(newItem.current_stock || 0)
    }]);
    if (error) {
      setFormMsg(`Error: ${error.message}`);
    } else {
      setFormMsg('Item added successfully!');
      setNewItem({ item_name: '', category_id: '', unit_price: '', current_stock: '' });
      fetchAllData();
    }
  };

  const handleAddReceiver = async (e) => {
    e.preventDefault();
    if (!newReceiver.name) return;
    const { error } = await supabase.from('receivers').insert([{
      name: newReceiver.name,
      balance: Number(newReceiver.balance || 0)
    }]);
    if (error) {
      setFormMsg(`Error: ${error.message}`);
    } else {
      setFormMsg('Receiver/Account added successfully!');
      setNewReceiver({ name: '', balance: 0 });
      fetchAllData();
    }
  };

  // Sale Screen Computations
  const currentCustomer = useMemo(() => {
    return customers.find(c => c.id === Number(selectedCustomerId)) || customers[0] || {};
  }, [customers, selectedCustomerId]);

  const filteredItems = useMemo(() => {
    if (selectedCategoryId === 'ALL') return items;
    return items.filter(i => i.category_id === Number(selectedCategoryId));
  }, [items, selectedCategoryId]);

  const currentItem = useMemo(() => {
    return items.find(i => i.id === Number(selectedItemId));
  }, [items, selectedItemId]);

  const handleItemSelect = (e) => {
    const id = e.target.value;
    setSelectedItemId(id);
    setStockError('');
    const found = items.find(i => i.id === Number(id));
    if (found) {
      setEntryRate(found.unit_price);
      setEntryQty(1);
    } else {
      setEntryRate('');
    }
  };

  const handleAddLineItem = () => {
    if (!currentItem) return;
    const qty = Number(entryQty);
    const rate = Number(entryRate);

    if (qty <= 0) {
      setStockError('Quantity must be greater than 0');
      return;
    }
    const existing = lineItems.find(l => l.itemId === currentItem.id);
    const demanded = (existing ? existing.qty : 0) + qty;

    if (demanded > currentItem.current_stock) {
      setStockError(`Insufficient stock! Available: ${currentItem.current_stock}`);
      return;
    }

    if (existing) {
      setLineItems(lineItems.map(l => l.itemId === currentItem.id 
        ? { ...l, qty: demanded, lineTotal: demanded * rate }
        : l
      ));
    } else {
      setLineItems([...lineItems, {
        id: Date.now(),
        itemId: currentItem.id,
        itemName: currentItem.item_name,
        rate,
        qty,
        lineTotal: qty * rate
      }]);
    }

    setSelectedItemId('');
    setEntryRate('');
    setEntryQty(1);
    setStockError('');
  };

  const totalInvoiceValue = useMemo(() => {
    return lineItems.reduce((acc, curr) => acc + curr.lineTotal, 0);
  }, [lineItems]);

  const handleSaveInvoice = async () => {
    if (lineItems.length === 0) return;
    setSubmitting(true);

    try {
      const { data: invData, error: invErr } = await supabase.from('invoices').insert({
        invoice_number: invoiceNumber,
        customer_id: currentCustomer?.id || null,
        customer_name: currentCustomer?.name || 'Cash Customer',
        total_amount: totalInvoiceValue,
        payment_status: paymentType,
        receiver_id: paymentType === 'PAID' ? Number(selectedReceiverId) : null,
        invoice_date: invoiceDate
      }).select().single();

      if (invErr) throw invErr;

      const itemsToInsert = lineItems.map(item => ({
        invoice_id: invData.id,
        item_id: item.itemId,
        item_name: item.itemName,
        quantity: item.qty,
        rate: item.rate,
        line_total: item.lineTotal
      }));

      await supabase.from('invoice_items').insert(itemsToInsert);

      // Deduct item stocks
      for (const line of lineItems) {
        const itemObj = items.find(i => i.id === line.itemId);
        if (itemObj) {
          await supabase.from('items')
            .update({ current_stock: Math.max(0, itemObj.current_stock - line.qty) })
            .eq('id', line.itemId);
        }
      }

      // Update Receiver balance or Customer due
      if (paymentType === 'PAID' && selectedReceiverId) {
        const receiver = receivers.find(r => r.id === Number(selectedReceiverId));
        if (receiver) {
          await supabase.from('receivers')
            .update({ balance: Number(receiver.balance || 0) + totalInvoiceValue })
            .eq('id', selectedReceiverId);
        }
      } else if (paymentType === 'DUE' && currentCustomer?.id) {
        await supabase.from('customers')
          .update({ old_due: Number(currentCustomer.old_due || 0) + totalInvoiceValue })
          .eq('id', currentCustomer.id);
      }

      alert(`Invoice ${invoiceNumber} created successfully!`);
      setLineItems([]);
      setIsModalOpen(false);
      fetchAllData();
    } catch (err) {
      alert(`Error saving invoice: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 pb-24">
      {/* Top Header Navigation */}
      <header className="bg-indigo-600 text-white shadow sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-6 h-6" />
            <span className="font-bold text-lg tracking-tight">Retail Sales</span>
          </div>

          <div className="flex gap-1">
            <button
              onClick={() => setActiveTab('sale')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                activeTab === 'sale' ? 'bg-white text-indigo-700' : 'text-indigo-100 hover:bg-indigo-500'
              }`}
            >
              New Sale
            </button>
            <button
              onClick={() => { setActiveTab('masters'); setFormMsg(''); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                activeTab === 'masters' ? 'bg-white text-indigo-700' : 'text-indigo-100 hover:bg-indigo-500'
              }`}
            >
              Master Data
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                activeTab === 'history' ? 'bg-white text-indigo-700' : 'text-indigo-100 hover:bg-indigo-500'
              }`}
            >
              Invoices
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-6">
        {/* ===================== VIEW 1: CREATE INVOICE ===================== */}
        {activeTab === 'sale' && (
          <div className="space-y-6">
            {/* Invoice Top Bar */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Current Invoice</span>
                <h1 className="text-xl font-black text-slate-900">{invoiceNumber}</h1>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-indigo-600 uppercase">Total Bill</span>
                <p className="text-2xl font-black text-indigo-700">₹{totalInvoiceValue.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Customer & Item Selection */}
              <div className="space-y-4">
                {/* Customer Box */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-500 uppercase">Customer</label>
                    <button
                      onClick={() => { setActiveTab('masters'); setMasterTab('customers'); }}
                      className="text-xs text-indigo-600 font-semibold hover:underline"
                    >
                      + Add New
                    </button>
                  </div>
                  {customers.length === 0 ? (
                    <div className="p-3 bg-amber-50 rounded-lg text-xs text-amber-800 border border-amber-200">
                      No customers found. Tap <b>+ Add New</b> above to create one.
                    </div>
                  ) : (
                    <select
                      value={selectedCustomerId}
                      onChange={(e) => setSelectedCustomerId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold"
                    >
                      {customers.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.mobile}) - Due: ₹{Number(c.old_due || 0)}
                        </option>
                      ))}
                    </select>
                  )}

                  <div>
                    <label className="text-xs font-semibold text-slate-500 block mb-1">Date</label>
                    <input
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm"
                    />
                  </div>
                </div>

                {/* Add Item Box */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-500 uppercase">Add Product</label>
                    <button
                      onClick={() => { setActiveTab('masters'); setMasterTab('items'); }}
                      className="text-xs text-indigo-600 font-semibold hover:underline"
                    >
                      + Add New Item
                    </button>
                  </div>

                  {/* Category Pills */}
                  {categories.length > 0 && (
                    <div className="flex gap-1.5 overflow-x-auto pb-1">
                      <button
                        type="button"
                        onClick={() => setSelectedCategoryId('ALL')}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${
                          selectedCategoryId === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        All
                      </button>
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedCategoryId(cat.id)}
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${
                            selectedCategoryId === cat.id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {items.length === 0 ? (
                    <div className="p-3 bg-amber-50 rounded-lg text-xs text-amber-800 border border-amber-200">
                      No items created yet. Tap <b>+ Add New Item</b> above to add items to your catalog.
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                          <span>Select Item</span>
                          {currentItem && (
                            <span className="text-emerald-600 font-bold">Stock: {currentItem.current_stock}</span>
                          )}
                        </div>
                        <select
                          value={selectedItemId}
                          onChange={handleItemSelect}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-semibold"
                        >
                          <option value="">-- Choose an item --</option>
                          {filteredItems.map(item => (
                            <option key={item.id} value={item.id} disabled={item.current_stock <= 0}>
                              {item.item_name} (₹{item.unit_price}) {item.current_stock <= 0 ? '- Out of stock' : ''}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-semibold text-slate-500 block mb-1">Rate (₹)</label>
                          <input
                            type="number"
                            value={entryRate}
                            onChange={(e) => setEntryRate(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-slate-500 block mb-1">Qty</label>
                          <input
                            type="number"
                            min="1"
                            value={entryQty}
                            onChange={(e) => setEntryQty(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm font-bold"
                          />
                        </div>
                      </div>

                      {stockError && (
                        <p className="text-xs text-rose-600 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> {stockError}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={handleAddLineItem}
                        disabled={!selectedItemId}
                        className="w-full py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 disabled:bg-slate-300 flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Add to Bill
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Right Column: Invoice Cart Table */}
              <div className="md:col-span-2 bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <h2 className="text-xs font-bold text-slate-500 uppercase mb-3">Bill Items</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b text-xs uppercase text-slate-400">
                          <th className="pb-2">Item</th>
                          <th className="pb-2 text-right">Rate</th>
                          <th className="pb-2 text-center">Qty</th>
                          <th className="pb-2 text-right">Total</th>
                          <th className="pb-2 text-center">Del</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {lineItems.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="py-12 text-center text-slate-400 text-sm">
                              Cart is empty. Select an item from the left and tap &ldquo;Add to Bill&rdquo;.
                            </td>
                          </tr>
                        ) : (
                          lineItems.map(item => (
                            <tr key={item.id}>
                              <td className="py-2.5 font-semibold text-slate-800">{item.itemName}</td>
                              <td className="py-2.5 text-right">₹{Number(item.rate).toFixed(2)}</td>
                              <td className="py-2.5 text-center font-bold text-indigo-600">{item.qty}</td>
                              <td className="py-2.5 text-right font-bold text-slate-900">₹{item.lineTotal.toFixed(2)}</td>
                              <td className="py-2.5 text-center">
                                <button
                                  onClick={() => setLineItems(lineItems.filter(l => l.id !== item.id))}
                                  className="text-rose-500 hover:text-rose-700 p-1"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Subtotal summary */}
                <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                  <span className="font-bold text-slate-800">Grand Total: ₹{totalInvoiceValue.toFixed(2)}</span>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    disabled={lineItems.length === 0}
                    className="py-2.5 px-6 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 disabled:bg-slate-300 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Create Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===================== VIEW 2: MASTER DATA MANAGEMENT ===================== */}
        {activeTab === 'masters' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Master sub-tabs */}
            <div className="border-b border-slate-200 bg-slate-50 flex overflow-x-auto">
              {[
                { id: 'items', label: 'Items / Products', icon: Package },
                { id: 'customers', label: 'Customers', icon: Users },
                { id: 'categories', label: 'Categories', icon: FolderTree },
                { id: 'receivers', label: 'Receivers / Accounts', icon: Wallet }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => { setMasterTab(tab.id); setFormMsg(''); }}
                    className={`flex items-center gap-2 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 ${
                      masterTab === tab.id 
                        ? 'border-indigo-600 text-indigo-600 bg-white' 
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="p-4 md:p-6 space-y-6">
              {formMsg && (
                <div className={`p-3 rounded-lg text-xs font-semibold ${
                  formMsg.startsWith('Error') ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
                }`}>
                  {formMsg}
                </div>
              )}

              {/* Master Tab: ITEMS */}
              {masterTab === 'items' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <form onSubmit={handleAddItemMaster} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <h3 className="text-sm font-bold text-slate-800">Add New Item</h3>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Item Name *</label>
                      <input
                        type="text"
                        required
                        value={newItem.item_name}
                        onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                        placeholder="e.g. Basmati Rice 25kg"
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Category</label>
                      <select
                        value={newItem.category_id}
                        onChange={(e) => setNewItem({ ...newItem, category_id: e.target.value })}
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm"
                      >
                        <option value="">-- None --</option>
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Price (₹) *</label>
                        <input
                          type="number"
                          required
                          value={newItem.unit_price}
                          onChange={(e) => setNewItem({ ...newItem, unit_price: e.target.value })}
                          placeholder="0.00"
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Opening Stock</label>
                        <input
                          type="number"
                          value={newItem.current_stock}
                          onChange={(e) => setNewItem({ ...newItem, current_stock: e.target.value })}
                          placeholder="0"
                          className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm font-bold"
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700">
                      Save Item
                    </button>
                  </form>

                  <div className="md:col-span-2 overflow-x-auto">
                    <h3 className="text-sm font-bold text-slate-800 mb-3">Item Catalog ({items.length})</h3>
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b text-slate-400 uppercase">
                          <th className="pb-2">Name</th>
                          <th className="pb-2">Rate</th>
                          <th className="pb-2">Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {items.length === 0 ? (
                          <tr><td colSpan="3" className="py-6 text-center text-slate-400">No items added yet.</td></tr>
                        ) : (
                          items.map(i => (
                            <tr key={i.id}>
                              <td className="py-2 font-semibold text-slate-800">{i.item_name}</td>
                              <td className="py-2 text-slate-700">₹{i.unit_price}</td>
                              <td className="py-2 font-bold text-emerald-600">{i.current_stock}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Master Tab: CUSTOMERS */}
              {masterTab === 'customers' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <form onSubmit={handleAddCustomer} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <h3 className="text-sm font-bold text-slate-800">Add Customer</h3>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Customer Name *</label>
                      <input
                        type="text"
                        required
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={newCustomer.mobile}
                        onChange={(e) => setNewCustomer({ ...newCustomer, mobile: e.target.value })}
                        placeholder="e.g. 9876543210"
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Opening Due (₹)</label>
                      <input
                        type="number"
                        value={newCustomer.old_due}
                        onChange={(e) => setNewCustomer({ ...newCustomer, old_due: e.target.value })}
                        placeholder="0.00"
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm font-bold"
                      />
                    </div>
                    <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700">
                      Save Customer
                    </button>
                  </form>

                  <div className="md:col-span-2 overflow-x-auto">
                    <h3 className="text-sm font-bold text-slate-800 mb-3">Customer Directory ({customers.length})</h3>
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b text-slate-400 uppercase">
                          <th className="pb-2">Name</th>
                          <th className="pb-2">Mobile</th>
                          <th className="pb-2">Due (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {customers.length === 0 ? (
                          <tr><td colSpan="3" className="py-6 text-center text-slate-400">No customers yet.</td></tr>
                        ) : (
                          customers.map(c => (
                            <tr key={c.id}>
                              <td className="py-2 font-semibold text-slate-800">{c.name}</td>
                              <td className="py-2 text-slate-600">{c.mobile}</td>
                              <td className="py-2 font-bold text-amber-600">₹{Number(c.old_due || 0).toFixed(2)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Master Tab: CATEGORIES */}
              {masterTab === 'categories' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <form onSubmit={handleAddCategory} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <h3 className="text-sm font-bold text-slate-800">Add Category</h3>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Category Name *</label>
                      <input
                        type="text"
                        required
                        value={newCategory.name}
                        onChange={(e) => setNewCategory({ name: e.target.value })}
                        placeholder="e.g. Oils, Grains, Biscuits"
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm"
                      />
                    </div>
                    <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700">
                      Save Category
                    </button>
                  </form>

                  <div className="md:col-span-2 overflow-x-auto">
                    <h3 className="text-sm font-bold text-slate-800 mb-3">Categories ({categories.length})</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(c => (
                        <span key={c.id} className="bg-slate-100 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 border border-slate-200">
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Master Tab: RECEIVERS */}
              {masterTab === 'receivers' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <form onSubmit={handleAddReceiver} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <h3 className="text-sm font-bold text-slate-800">Add Account / Receiver</h3>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Account Name *</label>
                      <input
                        type="text"
                        required
                        value={newReceiver.name}
                        onChange={(e) => setNewReceiver({ ...newReceiver, name: e.target.value })}
                        placeholder="e.g. Cash Counter 1, Shop PhonePe"
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Opening Balance (₹)</label>
                      <input
                        type="number"
                        value={newReceiver.balance}
                        onChange={(e) => setNewReceiver({ ...newReceiver, balance: e.target.value })}
                        placeholder="0.00"
                        className="w-full bg-white border border-slate-300 rounded-lg p-2 text-sm font-bold"
                      />
                    </div>
                    <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700">
                      Save Receiver
                    </button>
                  </form>

                  <div className="md:col-span-2 overflow-x-auto">
                    <h3 className="text-sm font-bold text-slate-800 mb-3">Payment Receivers ({receivers.length})</h3>
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b text-slate-400 uppercase">
                          <th className="pb-2">Account Name</th>
                          <th className="pb-2">Current Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {receivers.map(r => (
                          <tr key={r.id}>
                            <td className="py-2 font-semibold text-slate-800">{r.name}</td>
                            <td className="py-2 font-bold text-emerald-600">₹{Number(r.balance || 0).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================== VIEW 3: INVOICES HISTORY ===================== */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-4">Past Invoices ({invoices.length})</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b text-slate-400 uppercase">
                    <th className="pb-2">Inv No</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.length === 0 ? (
                    <tr><td colSpan="5" className="py-8 text-center text-slate-400">No invoices saved yet.</td></tr>
                  ) : (
                    invoices.map(inv => (
                      <tr key={inv.id}>
                        <td className="py-3 font-bold text-indigo-700">{inv.invoice_number}</td>
                        <td className="py-3 text-slate-500">{inv.invoice_date}</td>
                        <td className="py-3 font-semibold text-slate-800">{inv.customer_name}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            inv.payment_status === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {inv.payment_status}
                          </span>
                        </td>
                        <td className="py-3 text-right font-bold text-slate-900">₹{Number(inv.total_amount).toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Sticky Bottom Action Bar for Mobile */}
      {activeTab === 'sale' && lineItems.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-slate-300 p-3 shadow-2xl flex items-center justify-between z-40 max-w-5xl mx-auto">
          <div>
            <span className="text-xs text-slate-400 font-semibold block uppercase">Total Bill</span>
            <span className="text-xl font-black text-indigo-700">₹{totalInvoiceValue.toFixed(2)}</span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="py-2.5 px-6 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-700 shadow-md flex items-center gap-2"
          >
            <Check className="w-5 h-5" /> Create Invoice
          </button>
        </div>
      )}

      {/* Payment Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Confirm Invoice Payment</h3>
            <p className="text-xs text-slate-500 mb-4">Select how this invoice is settled:</p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setPaymentType('PAID')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 font-semibold text-xs ${
                  paymentType === 'PAID'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-600" /> Fully Paid
              </button>
              <button
                type="button"
                onClick={() => setPaymentType('DUE')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 font-semibold text-xs ${
                  paymentType === 'DUE'
                    ? 'border-amber-500 bg-amber-50 text-amber-700 ring-2 ring-amber-500/20'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                <AlertCircle className="w-5 h-5 text-amber-600" /> Mark as Due
              </button>
            </div>

            {paymentType === 'PAID' && (
              <div className="mb-4">
                <label className="text-xs font-semibold text-slate-600 block mb-1">Payment Method / Account</label>
                {receivers.length === 0 ? (
                  <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                    No receivers configured. Add one under Master Data.
                  </p>
                ) : (
                  <select
                    value={selectedReceiverId}
                    onChange={(e) => setSelectedReceiverId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm"
                  >
                    {receivers.map(r => (
                      <option key={r.id} value={r.id}>{r.name} (Bal: ₹{r.balance})</option>
                    ))}
                  </select>
                )}
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2.5 border border-slate-300 rounded-lg text-xs font-bold"
              >
                Cancel
              </button>
              <button
                disabled={submitting}
                onClick={handleSaveInvoice}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1"
              >
                {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Confirm & Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
