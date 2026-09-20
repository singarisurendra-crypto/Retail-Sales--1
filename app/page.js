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
  UserPlus,
  PackagePlus
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

const supabase = createClient(supabaseUrl, supabaseKey);

export default function CreateSaleScreen() {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [receivers, setReceivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [invoiceNumber, setInvoiceNumber] = useState('Inv-0001');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);

  // Customer state: select existing or type custom
  const [selectedCustomerId, setSelectedCustomerId] = useState('NEW');
  const [customCustomerName, setCustomCustomerName] = useState('');
  const [customCustomerMobile, setCustomCustomerMobile] = useState('');

  // Item entry state: select existing or type manual item
  const [selectedItemId, setSelectedItemId] = useState('NEW');
  const [customItemName, setCustomItemName] = useState('');
  const [entryRate, setEntryRate] = useState('');
  const [entryQty, setEntryQty] = useState(1);
  const [stockError, setStockError] = useState('');
  const [lineItems, setLineItems] = useState([]);

  // Payment & submission
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentType, setPaymentType] = useState('PAID');
  const [selectedReceiverId, setSelectedReceiverId] = useState('');
  const [customReceiverName, setCustomReceiverName] = useState('Cash');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    setLoading(true);
    try {
      const [custRes, itemsRes, recRes, invCountRes] = await Promise.all([
        supabase.from('customers').select('*'),
        supabase.from('items').select('*'),
        supabase.from('receivers').select('*'),
        supabase.from('invoices').select('id', { count: 'exact', head: true })
      ]);

      if (custRes.data && custRes.data.length > 0) {
        setCustomers(custRes.data);
      }
      if (itemsRes.data && itemsRes.data.length > 0) {
        setItems(itemsRes.data);
      }
      if (recRes.data && recRes.data.length > 0) {
        setReceivers(recRes.data);
        setSelectedReceiverId(recRes.data[0].id);
      }

      const nextCount = (invCountRes.count || 0) + 1;
      setInvoiceNumber(`Inv-${String(nextCount).padStart(4, '0')}`);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddItem = () => {
    const qty = Number(entryQty);
    const rate = Number(entryRate);

    const nameToUse = selectedItemId === 'NEW' 
      ? customItemName.trim() 
      : (items.find(i => i.id === Number(selectedItemId))?.item_name || '');

    if (!nameToUse) {
      setStockError('Please enter or select an item name');
      return;
    }
    if (qty <= 0) {
      setStockError('Quantity must be greater than zero');
      return;
    }
    if (rate < 0 || isNaN(rate)) {
      setStockError('Enter a valid rate');
      return;
    }

    setLineItems([
      ...lineItems,
      {
        id: Date.now(),
        itemId: selectedItemId === 'NEW' ? null : Number(selectedItemId),
        itemName: nameToUse,
        rate,
        qty,
        lineTotal: qty * rate
      }
    ]);

    // Reset input fields
    setCustomItemName('');
    setSelectedItemId('NEW');
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
      let finalCustomerId = null;
      let finalCustomerName = customCustomerName.trim() || 'Walk-in Customer';

      // 1. Resolve Customer
      if (selectedCustomerId !== 'NEW') {
        const found = customers.find(c => c.id === Number(selectedCustomerId));
        if (found) {
          finalCustomerId = found.id;
          finalCustomerName = found.name;
        }
      } else if (customCustomerName.trim()) {
        const mobile = customCustomerMobile.trim() || `000-${Date.now()}`;
        const { data: newCust } = await supabase
          .from('customers')
          .insert({ name: customCustomerName.trim(), mobile, old_due: 0 })
          .select()
          .single();
        if (newCust) {
          finalCustomerId = newCust.id;
          finalCustomerName = newCust.name;
        }
      }

      // 2. Resolve Receiver
      let finalReceiverId = selectedReceiverId ? Number(selectedReceiverId) : null;
      if (paymentType === 'PAID' && !finalReceiverId) {
        const { data: newRec } = await supabase
          .from('receivers')
          .insert({ name: customReceiverName || 'General Cash', balance: 0 })
          .select()
          .single();
        if (newRec) finalReceiverId = newRec.id;
      }

      // 3. Insert Invoice
      const { data: invData, error: invErr } = await supabase.from('invoices').insert({
        invoice_number: invoiceNumber,
        customer_id: finalCustomerId,
        customer_name: finalCustomerName,
        total_amount: totalInvoiceValue,
        payment_status: paymentType,
        receiver_id: paymentType === 'PAID' ? finalReceiverId : null,
        invoice_date: invoiceDate
      }).select().single();

      if (invErr) throw invErr;

      // 4. Insert Line Items
      const itemsToInsert = lineItems.map(item => ({
        invoice_id: invData.id,
        item_id: item.itemId,
        item_name: item.itemName,
        quantity: item.qty,
        rate: item.rate,
        line_total: item.lineTotal
      }));

      await supabase.from('invoice_items').insert(itemsToInsert);

      // 5. Update receiver or customer balance if applicable
      if (paymentType === 'PAID' && finalReceiverId) {
        const rec = receivers.find(r => r.id === finalReceiverId);
        const currentBal = rec ? Number(rec.balance || 0) : 0;
        await supabase
          .from('receivers')
          .update({ balance: currentBal + totalInvoiceValue })
          .eq('id', finalReceiverId);
      } else if (paymentType === 'DUE' && finalCustomerId) {
        const cust = customers.find(c => c.id === finalCustomerId);
        const curDue = cust ? Number(cust.old_due || 0) : 0;
        await supabase
          .from('customers')
          .update({ old_due: curDue + totalInvoiceValue })
          .eq('id', finalCustomerId);
      }

      alert(`Invoice ${invoiceNumber} created successfully!`);
      setLineItems([]);
      setCustomCustomerName('');
      setCustomCustomerMobile('');
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
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-6 pb-20">
      {/* Top Header */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            <h1 className="text-xl font-bold text-slate-900">{invoiceNumber}</h1>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 px-5 py-2 rounded-xl text-right">
            <span className="text-xs uppercase font-semibold text-indigo-600">Total Value</span>
            <p className="text-2xl font-black text-indigo-700">₹{totalInvoiceValue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Direct Entry Forms */}
        <div className="space-y-6">
          {/* Customer Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase text-slate-600 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-600" /> Customer Information
              </h2>
              {customers.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedCustomerId(selectedCustomerId === 'NEW' ? customers[0].id : 'NEW')}
                  className="text-xs text-indigo-600 font-semibold underline"
                >
                  {selectedCustomerId === 'NEW' ? 'Select Existing' : '+ Type New'}
                </button>
              )}
            </div>

            {selectedCustomerId === 'NEW' ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Customer Name</label>
                  <input
                    type="text"
                    placeholder="Enter customer name"
                    value={customCustomerName}
                    onChange={(e) => setCustomCustomerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Mobile (Optional)</label>
                  <input
                    type="tel"
                    placeholder="Mobile number"
                    value={customCustomerMobile}
                    onChange={(e) => setCustomCustomerMobile(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Select Customer</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm"
                >
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.mobile})</option>
                  ))}
                </select>
              </div>
            )}

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

          {/* Item Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase text-slate-600 flex items-center gap-2">
                <PackagePlus className="w-4 h-4 text-indigo-600" /> Add Item
              </h2>
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedItemId(selectedItemId === 'NEW' ? items[0].id : 'NEW')}
                  className="text-xs text-indigo-600 font-semibold underline"
                >
                  {selectedItemId === 'NEW' ? 'Select Existing' : '+ Type Custom Item'}
                </button>
              )}
            </div>

            {selectedItemId === 'NEW' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Item Name / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Rice Bag 25kg, Oil 1L"
                  value={customItemName}
                  onChange={(e) => setCustomItemName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Select Item</label>
                <select
                  value={selectedItemId}
                  onChange={(e) => {
                    setSelectedItemId(e.target.value);
                    const itm = items.find(i => i.id === Number(e.target.value));
                    if (itm) setEntryRate(itm.unit_price);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm"
                >
                  {items.map(i => (
                    <option key={i.id} value={i.id}>{i.item_name} (₹{i.unit_price})</option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Price / Rate (₹)</label>
                <input 
                  type="number" 
                  placeholder="0.00"
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
              <div className="p-2 bg-rose-50 text-rose-700 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{stockError}</span>
              </div>
            )}

            <button
              type="button"
              onClick={handleAddItem}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add to Invoice
            </button>
          </div>
        </div>

        {/* Right Side: Invoice Line Items Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between overflow-hidden">
          <div className="p-5 flex-1">
            <h2 className="text-sm font-bold uppercase text-slate-600 mb-4">Invoice Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 text-xs uppercase">
                    <th className="pb-3">Item</th>
                    <th className="pb-3 text-right">Rate</th>
                    <th className="pb-3 text-center">Qty</th>
                    <th className="pb-3 text-right">Total</th>
                    <th className="pb-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lineItems.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-slate-400">
                        No items added yet. Enter items on the left to begin.
                      </td>
                    </tr>
                  ) : (
                    lineItems.map(item => (
                      <tr key={item.id}>
                        <td className="py-3 font-medium text-slate-800">{item.itemName}</td>
                        <td className="py-3 text-right">₹{Number(item.rate).toFixed(2)}</td>
                        <td className="py-3 text-center font-bold text-indigo-700">{item.qty}</td>
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

      {/* Confirmation & Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Confirm Payment</h3>
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
                <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Method / Account</label>
                {receivers.length > 0 ? (
                  <select
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm"
                    value={selectedReceiverId}
                    onChange={(e) => setSelectedReceiverId(e.target.value)}
                  >
                    {receivers.map(rec => (
                      <option key={rec.id} value={rec.id}>{rec.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={customReceiverName}
                    onChange={(e) => setCustomReceiverName(e.target.value)}
                    placeholder="Cash / UPI / Account"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-sm"
                  />
                )}
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
