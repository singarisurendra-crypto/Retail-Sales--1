'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { 
  Plus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  Phone, 
  User, 
  FileText, 
  Check, 
  RefreshCw 
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function CreateSaleScreen() {
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [invoiceNumber, setInvoiceNumber] = useState('Inv-0001');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const [entryRate, setEntryRate] = useState('');
  const [entryQty, setEntryQty] = useState(1);
  const [stockError, setStockError] = useState('');
  const [lineItems, setLineItems] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentType, setPaymentType] = useState('PAID');
  const [selectedReceiverId, setSelectedReceiverId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    setLoading(true);
    const [custRes, catRes, itemsRes, recRes, invCountRes] = await Promise.all([
      supabase.from('customers').select('*'),
      supabase.from('master_categories').select('*'),
      supabase.from('items').select('*'),
      supabase.from('receivers').select('*'),
      supabase.from('invoices').select('id', { count: 'exact', head: true })
    ]);

    if (custRes.data && custRes.data.length > 0) {
      setCustomers(custRes.data);
      setSelectedCustomerId(custRes.data[0].id);
    }
    if (catRes.data && catRes.data.length > 0) {
      setCategories(catRes.data);
      setSelectedCategoryId(catRes.data[0].id);
    }
    if (itemsRes.data) setItems(itemsRes.data);
    if (recRes.data && recRes.data.length > 0) {
      setReceivers(recRes.data);
      setSelectedReceiverId(recRes.data[0].id);
    }

    const nextCount = (invCountRes.count || 0) + 1;
    setInvoiceNumber(`Inv-${String(nextCount).padStart(4, '0')}`);
    setLoading(false);
  }

  const currentCustomer = useMemo(() => {
    return customers.find(c => c.id === Number(selectedCustomerId)) || customers[0] || {};
  }, [customers, selectedCustomerId]);

  const filteredItems = useMemo(() => {
    return items.filter(item => item.category_id === Number(selectedCategoryId));
  }, [items, selectedCategoryId]);

  const currentItem = useMemo(() => {
    return items.find(item => item.id === Number(selectedItemId));
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

  const handleAddItem = () => {
    if (!currentItem) return;
    const qty = Number(entryQty);
    const rate = Number(entryRate);

    if (qty <= 0) {
      setStockError('Quantity must be greater than zero');
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
        customer_id: currentCustomer.id,
        customer_name: currentCustomer.name,
        total_amount: totalInvoiceValue,
        payment_status: paymentType,
        receiver_id: paymentType === 'PAID' ? selectedReceiverId : null,
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

      for (const line of lineItems) {
        const itemObj = items.find(i => i.id === line.itemId);
        if (itemObj) {
          await supabase.from('items')
            .update({ current_stock: Math.max(0, itemObj.current_stock - line.qty) })
            .eq('id', line.itemId);
        }
      }

      if (paymentType === 'PAID' && selectedReceiverId) {
        const receiver = receivers.find(r => r.id === Number(selectedReceiverId));
        if (receiver) {
          await supabase.from('receivers')
            .update({ balance: Number(receiver.balance) + totalInvoiceValue })
            .eq('id', selectedReceiverId);
        }
      } else if (paymentType === 'DUE') {
        await supabase.from('customers')
          .update({ old_due: Number(currentCustomer.old_due || 0) + totalInvoiceValue })
          .eq('id', currentCustomer.id);
      }

      alert(`Invoice ${invoiceNumber} created and saved successfully!`);
      setLineItems([]);
      setIsModalOpen(false);
      fetchInitialData();
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
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-6">
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">{invoiceNumber}</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <span className="text-xs uppercase font-semibold text-slate-400">Old Due</span>
              <p className="text-base font-bold text-amber-600">
                ₹{Number(currentCustomer?.old_due || 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 px-5 py-2 rounded-xl text-right">
              <span className="text-xs uppercase font-semibold text-indigo-600">Total Value</span>
              <p className="text-2xl font-black text-indigo-700">₹{totalInvoiceValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-lg shadow-slate-200/50">
            <h2 className="text-sm font-bold uppercase text-slate-500 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" /> Customer Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Customer</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-medium"
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Contact Mobile</label>
                <input 
                  type="text" 
                  readOnly 
                  value={currentCustomer?.mobile || ''}
                  className="w-full bg-slate-100 border border-slate-200 rounded-lg p-2 text-sm text-slate-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Invoice Date</label>
                <input 
                  type="date" 
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase text-slate-500">Add Items</h2>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-2">Category</label>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {categories.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategoryId(cat.id);
                      setSelectedItemId('');
                      setEntryRate('');
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                      selectedCategoryId === cat.id 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-600">Select Item</label>
                {currentItem && (
                  <span className="text-xs font-bold text-emerald-600">
                    Stock: {currentItem.current_stock}
                  </span>
                )}
              </div>
              <select
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm font-medium"
                value={selectedItemId}
                onChange={handleItemSelect}
              >
                <option value="">-- Choose item --</option>
                {filteredItems.map(item => (
                  <option key={item.id} value={item.id} disabled={item.current_stock <= 0}>
                    {item.item_name} (Stock: {item.current_stock})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Rate (₹)</label>
                <input 
                  type="number" 
                  value={entryRate}
                  onChange={(e) => setEntryRate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Quantity</label>
                <input 
                  type="number" 
                  min="1"
                  value={entryQty}
                  onChange={(e) => setEntryQty(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm font-semibold"
                />
              </div>
            </div>

            {stockError && (
              <div className="p-2.5 bg-rose-50 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{stockError}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleAddItem}
              disabled={!selectedItemId}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Item
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
          <div className="p-5 flex-1">
            <h2 className="text-sm font-bold uppercase text-slate-500 mb-4">Invoice Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-xs uppercase">
                    <th className="pb-3">Item</th>
                    <th className="pb-3 text-right">Rate</th>
                    <th className="pb-3 text-center">Qty</th>
                    <th className="pb-3 text-right">Line Total</th>
                    <th className="pb-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lineItems.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-8 text-center text-slate-400">
                        No items added yet.
                      </td>
                    </tr>
                  ) : (
                    lineItems.map(item => (
                      <tr key={item.id}>
                        <td className="py-3 font-semibold text-slate-800">{item.itemName}</td>
                        <td className="py-3 text-right">₹{Number(item.rate).toFixed(2)}</td>
                        <td className="py-3 text-center text-indigo-700 font-bold">{item.qty}</td>
                        <td className="py-3 text-right font-bold text-slate-900">₹{item.lineTotal.toFixed(2)}</td>
                        <td className="py-3 text-center">
                          <button
                            type="button"
                            onClick={() => setLineItems(lineItems.filter(l => l.id !== item.id))}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-md"
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

          <div className="p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <span className="text-lg font-bold text-slate-900">Grand Total: ₹{totalInvoiceValue.toFixed(2)}</span>
            <button
              type="button"
              disabled={lineItems.length === 0}
              onClick={() => setIsModalOpen(true)}
              className="py-3 px-8 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold rounded-xl flex items-center gap-2"
            >
              <Check className="w-5 h-5" /> Save Invoice
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Confirm Payment Status</h3>
            <div className="grid grid-cols-2 gap-3 my-4">
              <button
                type="button"
                onClick={() => setPaymentType('PAID')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 font-semibold text-sm ${
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
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 font-semibold text-sm ${
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
                <label className="block text-xs font-semibold text-slate-600 mb-1">Deposit To Receiver</label>
                <select
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm"
                  value={selectedReceiverId}
                  onChange={(e) => setSelectedReceiverId(e.target.value)}
                >
                  {receivers.map(rec => (
                    <option key={rec.id} value={rec.id}>
                      {rec.name} (Bal: ₹{Number(rec.balance).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2.5 border border-slate-300 rounded-lg text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSaveInvoice}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
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
