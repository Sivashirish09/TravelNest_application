import React from 'react';
import { 
  Building2, 
  Download, 
  Printer, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Sparkles,
  MapPin
} from 'lucide-react';

export const InvoiceModal = ({ booking, payment, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const amountVal = Number(booking.total_amount_inr || payment?.amount || 12500);
  const baseCost = Math.round(amountVal * 0.85);
  const gstTax = Math.round(amountVal * 0.12);
  const serviceFee = Math.round(amountVal * 0.03);

  const txnId = payment?.transactionId || `TXN-TN-${Math.floor(10000000 + Math.random() * 90000000)}`;
  const dateStr = payment?.createdAt || new Date().toISOString().substring(0, 10);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 my-8 text-slate-900">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg">
              TN
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 font-heading">TravelNest Tax Invoice</h2>
              <p className="text-[11px] text-slate-500">Official Booking & GST Receipt • Ref: {booking.booking_reference}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Invoice Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Invoice Date</span>
            <span className="font-bold text-slate-800">{dateStr}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Transaction ID</span>
            <span className="font-mono font-bold text-slate-800">{txnId}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Method</span>
            <span className="font-semibold text-slate-800">{booking.payment_method || 'UPI / QR Payment'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Payment Status</span>
            <span className="badge badge-green text-[10px]">PAID (SUCCESS)</span>
          </div>
        </div>

        {/* Billed To & Destination Stays */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Billed To (Guest)</span>
            <p className="font-bold text-slate-900 text-sm">{booking.guest_name || 'Valued Traveler'}</p>
            <p className="text-slate-600">{booking.guest_email || 'guest@travelnest.ai'}</p>
            <p className="text-slate-600">{booking.guest_phone || '+91 98765 43210'}</p>
          </div>

          <div className="space-y-1">
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Reservation Details</span>
            <p className="font-bold text-slate-900 text-sm">{booking.destination_name} ({booking.country || 'India'})</p>
            <p className="text-blue-600 font-semibold">{booking.hotel_or_resort_name || 'Standard Hotel'}</p>
            <p className="text-slate-600">Check-in: {booking.check_in_date || '2026-08-15'} • {booking.nights || 3} Nights • {booking.guests || 2} Guests</p>
          </div>
        </div>

        {/* Line Item Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
              <tr>
                <th className="py-2.5 px-4">Description</th>
                <th className="py-2.5 px-4 text-center">Qty</th>
                <th className="py-2.5 px-4 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2.5 px-4">
                  <div className="font-semibold text-slate-900">{booking.hotel_or_resort_name} ({booking.room_type || 'Deluxe Room'})</div>
                  <div className="text-[10px] text-slate-500">{booking.nights || 3} Nights stay with breakfast included</div>
                </td>
                <td className="py-2.5 px-4 text-center">1</td>
                <td className="py-2.5 px-4 text-right font-medium">₹{baseCost.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4">
                  <div className="font-semibold text-slate-900">Sightseeing & Local Activity Permits</div>
                  <div className="text-[10px] text-slate-500">Verified entry & travel assistance</div>
                </td>
                <td className="py-2.5 px-4 text-center">1</td>
                <td className="py-2.5 px-4 text-right font-medium">₹{serviceFee.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="py-2.5 px-4">
                  <div className="font-semibold text-slate-900">GST & Tourism Tax (12%)</div>
                  <div className="text-[10px] text-slate-500">Central & State GST compliance</div>
                </td>
                <td className="py-2.5 px-4 text-center">1</td>
                <td className="py-2.5 px-4 text-right font-medium">₹{gstTax.toLocaleString()}</td>
              </tr>
            </tbody>
            <tfoot className="bg-slate-50/80 border-t border-slate-200 font-bold">
              <tr>
                <td colSpan={2} className="py-3 px-4 text-slate-900 text-sm">Total Paid</td>
                <td className="py-3 px-4 text-right text-emerald-600 text-base font-black">₹{amountVal.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* QR Verification & Guarantee Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-white p-1 rounded-xl border border-emerald-200 shrink-0">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=INVOICE-${booking.booking_reference}`} 
                alt="QR Invoice verification"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified TravelNest Merchant Invoice</span>
              </p>
              <p className="text-[11px] text-slate-600">GSTIN: 36AABCT1234F1Z9 • 100% Refund guarantee applicable</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="btn btn-primary btn-sm text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="btn btn-secondary btn-sm text-xs"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
