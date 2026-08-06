import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Download, 
  ArrowLeft, 
  FileText, 
  XCircle
} from 'lucide-react';

export const BookingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookings = [], cancelBooking, showToast } = useApp() || {};

  const b = (bookings || []).find(item => item.id === id || item.booking_reference === id);

  if (!b) {
    return (
      <div className="glass-card p-10 rounded-3xl border border-slate-200 bg-white text-center space-y-4 max-w-lg mx-auto my-12 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <FileText className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 font-heading">Booking Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested booking reference could not be located in your active reservations list.
        </p>
        <button
          onClick={() => navigate('/bookings')}
          className="btn btn-primary text-xs font-semibold px-4 py-2"
        >
          Return to My Trips
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-3xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/bookings')}
        className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Bookings</span>
      </button>

      {/* Printable Digital Ticket Container */}
      <div className="glass-card p-8 rounded-3xl border border-slate-200 bg-white space-y-6 shadow-xl">
        {/* Ticket Top Branding */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-xs">
              <i className="fas fa-compass"></i>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 font-heading">Travel<span className="gradient-text">Nest</span></h1>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Official Digital E-Ticket & Receipt</p>
            </div>
          </div>

          <div className="text-right">
            <span className={`badge ${b.status === 'CONFIRMED' ? 'badge-green' : 'badge-amber'}`}>
              {b.status}
            </span>
            <p className="text-xs text-slate-500 mt-1">Ref: <strong>{b.booking_reference}</strong></p>
          </div>
        </div>

        {/* Ticket Details & QR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          <div className="sm:col-span-2 space-y-4">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Destination</span>
              <h2 className="text-xl font-bold text-slate-900">{b.destination_name} ({b.country})</h2>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Hotel / Resort Stay</span>
              <p className="text-sm font-semibold text-blue-600">{b.hotel_or_resort_name}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Check-in Date</span>
                <span className="font-bold text-slate-900">{b.check_in_date}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Duration & Guests</span>
                <span className="font-bold text-slate-900">{b.nights} Nights | {b.guests || 2} Guests</span>
              </div>
            </div>
          </div>

          {/* Large QR Code Display */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs">
            <img src={b.qr_code_url} alt="Digital Ticket QR" className="w-32 h-32 object-contain bg-white p-2 rounded-xl" />
            <span className="text-[10px] font-bold text-slate-700 mt-2 tracking-widest">{b.booking_reference}</span>
          </div>
        </div>

        {/* Price Breakdown */}
        <div className="pt-6 border-t border-slate-100 space-y-2 text-xs">
          <h3 className="font-bold text-slate-900 mb-2">Payment Breakdown</h3>
          <div className="flex justify-between text-slate-600">
            <span>Accommodation Charge ({b.nights} nights)</span>
            <span className="text-slate-900 font-semibold">₹{(b.total_amount_inr * 0.85).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Taxes & Service Fees</span>
            <span className="text-slate-900 font-semibold">₹{(b.total_amount_inr * 0.15).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm font-extrabold pt-2 border-t border-slate-100 text-slate-900">
            <span>Total Paid Amount</span>
            <span className="text-emerald-600">₹{b.total_amount_inr?.toLocaleString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button onClick={handlePrint} className="btn btn-primary text-xs">
              <Download className="w-4 h-4" />
              <span>Download / Print Ticket PDF</span>
            </button>

            <button onClick={() => showToast('Invoice downloaded', 'success')} className="btn btn-secondary text-xs">
              <FileText className="w-4 h-4" />
              <span>Download Invoice</span>
            </button>
          </div>

          {b.status === 'CONFIRMED' && (
            <button
              onClick={() => {
                cancelBooking(b.id);
                navigate('/bookings');
              }}
              className="btn btn-danger text-xs"
            >
              <XCircle className="w-4 h-4" />
              <span>Cancel Booking & Refund</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
