import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Calendar, Download, FileText, ArrowRight, Home } from 'lucide-react';

export const BookingConfirmationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { bookings = [], showToast } = useApp() || {};

  const b = (bookings || []).find(item => item.id === id || item.booking_reference === id);

  if (!b) {
    return (
      <div className="glass-card p-10 rounded-3xl border border-slate-200 bg-white text-center space-y-4 max-w-lg mx-auto my-12 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 font-heading">Reservation Record</h2>
        <p className="text-xs text-slate-500">
          Your booking was registered. Return to your trips dashboard to view all active tickets.
        </p>
        <button
          onClick={() => navigate('/bookings')}
          className="btn btn-primary text-xs font-semibold px-4 py-2"
        >
          View My Trips
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-2xl mx-auto text-center">
      {/* Success Celebration Card */}
      <div className="glass-card p-8 rounded-3xl border border-emerald-200 bg-gradient-to-b from-emerald-50 via-white to-white space-y-4 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
          Booking Confirmed! 🎉
        </h1>
        <p className="text-xs text-slate-600 max-w-md mx-auto">
          Your stay at <strong>{b.hotel_or_resort_name}</strong> in <strong>{b.destination_name}</strong> has been successfully registered.
        </p>

        <div className="inline-block bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold font-mono tracking-widest my-2">
          Ref: {b.booking_reference}
        </div>

        {/* Digital Ticket & QR Preview */}
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-4 max-w-lg mx-auto">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Destination</span>
              <h3 className="text-base font-bold text-slate-900">{b.destination_name} ({b.country})</h3>
            </div>
            <span className="badge badge-green">CONFIRMED</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {b.source_city && (
              <div className="col-span-2">
                <span className="text-slate-500 text-[10px] block">Route</span>
                <strong className="text-slate-900">{b.source_city} → {b.destination_name}</strong>
              </div>
            )}
            <div>
              <span className="text-slate-500 text-[10px] block">Check-in Date</span>
              <strong className="text-slate-900">{b.check_in_date}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Duration</span>
              <strong className="text-slate-900">{b.nights} Nights | {b.guests || 2} Guests</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Total Paid</span>
              <strong className="text-emerald-700 text-sm">₹{Number(b.total_amount_inr || 0).toLocaleString('en-IN')}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Payment Status</span>
              <strong className="text-emerald-700">{b.payment_status || 'PAID'}</strong>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-3 border-t border-slate-200">
            <img src={b.qr_code_url} alt="Ticket QR" className="w-20 h-20 bg-white p-1 rounded-xl border border-slate-300" />
            <div className="text-xs space-y-1">
              <p className="font-bold text-slate-900">Digital E-Ticket</p>
              <p className="text-slate-500">Show this QR code at hotel reception during check-in.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button onClick={() => navigate('/bookings')} className="btn btn-primary text-xs font-semibold">
            <Calendar className="w-4 h-4" />
            <span>View My Trips</span>
          </button>

          <button onClick={handlePrint} className="btn btn-secondary text-xs">
            <Download className="w-4 h-4" />
            <span>Download Ticket PDF</span>
          </button>

          <button onClick={() => navigate('/home')} className="btn btn-secondary text-xs">
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
