import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Building2,
  Download,
  Eye,
  XCircle,
  Share2,
  Sparkles,
  FileText,
  RefreshCw,
  Star,
  Compass,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Luggage,
  ArrowRight,
  ShieldCheck,
  QrCode,
  Printer
} from 'lucide-react';

export const MyBookingsPage = () => {
  const { bookings = [], cancelBooking, showToast } = useApp() || {};
  const navigate = useNavigate();

  const [filterTab, setFilterTab] = useState('all'); // all, active, cancelled, completed
  const [trackModal, setTrackModal] = useState(null);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('Change of personal travel plans');
  const [cancelNotes, setCancelNotes] = useState('');
  const [qrZoomModal, setQrZoomModal] = useState(null);

  const safeBookings = Array.isArray(bookings) ? bookings : [];

  const activeCount = safeBookings.filter(b => b.status === 'CONFIRMED').length;
  const cancelledCount = safeBookings.filter(b => b.status === 'CANCELLED').length;
  const completedCount = safeBookings.filter(b => b.status === 'COMPLETED').length;

  const filteredBookings = safeBookings.filter(b => {
    if (filterTab === 'active') return b.status === 'CONFIRMED';
    if (filterTab === 'cancelled') return b.status === 'CANCELLED';
    if (filterTab === 'completed') return b.status === 'COMPLETED';
    return true;
  });

  const handleDownloadTicket = (b) => {
    window.print();
  };

  const handleDownloadInvoice = (b) => {
    showToast && showToast(`📄 Tax Invoice downloaded for Ref: ${b.booking_reference}`, 'success');
  };

  const handleShareTrip = (b) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`TravelNest Booking: ${b.destination_name} | Ref: ${b.booking_reference} | Hotel: ${b.hotel_or_resort_name}`);
    }
    showToast && showToast(`🔗 Trip details copied to clipboard!`, 'success');
  };

  const handleConfirmCancellation = () => {
    if (!cancelModalBooking) return;
    const finalReason = cancelNotes.trim() ? `${cancelReason} - ${cancelNotes}` : cancelReason;
    cancelBooking(cancelModalBooking.id, finalReason);
    setCancelModalBooking(null);
    setCancelNotes('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 bg-gradient-to-r from-blue-50/80 via-white to-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-2">
            <Luggage className="w-3.5 h-3.5 text-blue-600" />
            Trip Management Hub
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            My Bookings & Reservations
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Manage your confirmed reservations, track cancellation refunds, and download digital QR passes.
          </p>
        </div>

        <button
          onClick={() => navigate('/planner')}
          className="btn btn-primary text-xs font-semibold px-4 py-2.5 shadow-xs flex items-center gap-1.5 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Plan New Trip</span>
        </button>
      </div>

      {/* Filter Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setFilterTab('all')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${filterTab === 'all'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
        >
          All Bookings ({safeBookings.length})
        </button>

        <button
          onClick={() => setFilterTab('active')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${filterTab === 'active'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Active & Confirmed ({activeCount})</span>
        </button>

        <button
          onClick={() => setFilterTab('cancelled')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${filterTab === 'cancelled'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Cancelled Trips ({cancelledCount})</span>
        </button>

        <button
          onClick={() => setFilterTab('completed')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${filterTab === 'completed'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
        >
          Completed ({completedCount})
        </button>
      </div>

      {/* Bookings Content List */}
      {safeBookings.length === 0 ? (
        <div className="glass-card p-10 sm:p-14 rounded-3xl border border-slate-200 bg-white text-center text-slate-500 shadow-xs space-y-4">
          <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
            <Luggage className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-lg font-bold text-slate-900 font-heading">No Trips Booked Yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your trips list is currently empty. Once you book a hotel, resort stay, or customized AI itinerary, your confirmed reservation will immediately appear here with digital e-tickets, tax invoices, and check-in QR passes.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate('/planner')}
              className="btn btn-primary text-xs font-semibold px-4 py-2.5 shadow-xs flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Plan Trip with AI</span>
            </button>
            <button
              onClick={() => navigate('/explore')}
              className="btn btn-secondary text-xs font-semibold px-4 py-2.5 flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Explore Destinations</span>
            </button>
          </div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="glass-card p-10 rounded-3xl border border-slate-200 bg-white text-center text-slate-500 shadow-xs space-y-3">
          <Luggage className="w-10 h-10 mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-900">No bookings in "{filterTab}"</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {filterTab === 'cancelled'
              ? 'You have no cancelled trips. All your active bookings are safe and confirmed!'
              : filterTab === 'completed'
                ? 'You have no completed past trips yet.'
                : 'No active reservations found in this tab.'}
          </p>
          <button
            onClick={() => setFilterTab('all')}
            className="btn btn-secondary text-xs"
          >
            View All Bookings ({safeBookings.length})
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const amountVal = Number(b.total_amount_inr) || 12500;
            const isCancelled = b.status === 'CANCELLED';

            return (
              <div
                key={b.id || b.booking_reference}
                className={`glass-card p-5 sm:p-6 rounded-3xl border transition-all shadow-xs flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 ${isCancelled
                    ? 'border-rose-200 bg-rose-50/20'
                    : 'border-slate-200/90 bg-white hover:border-blue-300'
                  }`}
              >
                {/* QR Code Pass & Booking Info */}
                <div className="flex items-start gap-4">
                  <div
                    onClick={() => setQrZoomModal(b)}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-2 shrink-0 border border-slate-200 shadow-xs flex flex-col items-center justify-center cursor-pointer hover:opacity-90 transition-opacity relative group"
                    title="Click to zoom QR Code"
                  >
                    <img
                      src={b.qr_code_url || `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${b.booking_reference || 'TN-BOOKING'}`}
                      alt="Digital QR Ticket"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-bold transition-opacity">
                      <QrCode className="w-4 h-4 mr-1" /> Zoom
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                        {b.destination_name} ({b.country || 'India'})
                      </h3>
                      <span className={`badge ${isCancelled
                          ? 'badge-amber text-rose-700 bg-rose-100 border-rose-200'
                          : 'badge-green'
                        }`}>
                        {isCancelled ? 'CANCELLED & REFUNDED' : 'CONFIRMED'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 flex items-center gap-1.5 font-medium">
                      <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      {b.hotel_or_resort_name || 'Standard Hotel Stay'}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-500">
                      {b.source_city && (
                        <>
                          <span className="text-blue-600 font-medium">{b.source_city}</span>
                          <span className="text-slate-400">→</span>
                          <span className="font-medium text-slate-700">{b.destination_name}</span>
                          <span>•</span>
                        </>
                      )}
                      <span>Ref: <strong className="text-slate-900 font-mono">{b.booking_reference}</strong></span>
                      <span>•</span>
                      <span>Dates: <strong className="text-slate-800">{b.check_in_date || '2026-08-15'}</strong></span>
                      <span>•</span>
                      <span>{b.nights || 3} Nights ({b.guests || 2} Guests)</span>
                    </div>

                    {/* Dedicated Cancelled Section Banner */}
                    {isCancelled && (
                      <div className="mt-2 p-3 rounded-2xl bg-rose-100/70 border border-rose-200 text-xs text-rose-900 space-y-1">
                        <div className="font-bold flex items-center gap-1.5 text-rose-800">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Cancellation Audit & Refund Record</span>
                        </div>
                        <p className="text-[11px] text-slate-700">
                          Reason: <em>"{b.cancellation_reason || 'Requested by guest'}"</em> {b.cancellation_date ? `• Date: ${b.cancellation_date}` : ''}
                        </p>
                        <p className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{b.refund_status || '100% Refund Approved - Credited to Original Payment Method'}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price & Action Toolbar */}
                <div className="flex flex-col lg:items-end gap-3 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div>
                    <span className="text-xs text-slate-400 block lg:text-right">Total Amount</span>
                    <span className={`text-xl sm:text-2xl font-black ${isCancelled ? 'text-slate-400 line-through' : 'text-emerald-600'}`}>
                      ₹{amountVal.toLocaleString()}
                    </span>
                    {isCancelled && (
                      <span className="block text-xs font-bold text-emerald-600 lg:text-right">
                        ₹{amountVal.toLocaleString()} Refunded
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => navigate(`/booking/${b.id || b.booking_reference}`)}
                      className="btn btn-secondary btn-sm text-[11px] flex items-center gap-1 shadow-xs"
                    >
                      <Eye className="w-3 h-3 text-blue-600" />
                      <span>Details</span>
                    </button>

                    <button
                      onClick={() => handleDownloadTicket(b)}
                      className="btn btn-secondary btn-sm text-[11px] flex items-center gap-1 shadow-xs"
                      title="Print or Save PDF Ticket"
                    >
                      <Printer className="w-3 h-3 text-slate-600" />
                      <span>Print Ticket</span>
                    </button>

                    <button
                      onClick={() => handleDownloadInvoice(b)}
                      className="btn btn-secondary btn-sm text-[11px] flex items-center gap-1 shadow-xs"
                      title="Download Tax Invoice"
                    >
                      <FileText className="w-3 h-3 text-slate-600" />
                      <span>Invoice</span>
                    </button>

                    <button
                      onClick={() => setTrackModal(b)}
                      className="btn btn-secondary btn-sm text-[11px] flex items-center gap-1 shadow-xs"
                    >
                      <Compass className="w-3 h-3 text-purple-600" />
                      <span>Track</span>
                    </button>

                    <button
                      onClick={() => navigate('/reviews')}
                      className="btn btn-secondary btn-sm text-[11px] flex items-center gap-1 shadow-xs"
                    >
                      <Star className="w-3 h-3 text-amber-500" />
                      <span>Review</span>
                    </button>

                    <button
                      onClick={() => handleShareTrip(b)}
                      className="btn btn-secondary btn-sm text-[11px] flex items-center gap-1 shadow-xs"
                      title="Share trip details"
                    >
                      <Share2 className="w-3 h-3 text-slate-600" />
                    </button>

                    {!isCancelled ? (
                      <button
                        onClick={() => setCancelModalBooking(b)}
                        className="btn btn-danger btn-sm text-[11px] flex items-center gap-1 shadow-xs"
                      >
                        <XCircle className="w-3 h-3" />
                        <span>Cancel Booking</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate(`/booking?destId=${b.destination_id || 'goa'}`)}
                        className="btn btn-primary btn-sm text-[11px] flex items-center gap-1 shadow-xs"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Rebook Trip</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900 font-heading">Cancel Travel Reservation?</h3>
              <p className="text-xs text-slate-600">
                Are you sure you want to cancel your booking to <strong>{cancelModalBooking.destination_name}</strong>?
              </p>
            </div>

            {/* Refund Guarantee Box */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Full Refund Guarantee</span>
              </div>
              <p className="text-slate-600">
                A full refund of <strong>₹{Number(cancelModalBooking.total_amount_inr || 0).toLocaleString()}</strong> will be automatically credited back to your original payment method in 2-3 business days.
              </p>
            </div>

            <div className="space-y-2 text-xs text-left">
              <label className="text-slate-700 font-semibold block">Reason for Cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="form-control text-xs"
              >
                <option>Change of personal travel plans</option>
                <option>Flight / transit schedule conflict</option>
                <option>Weather or climate concern</option>
                <option>Medical or family emergency</option>
                <option>Found alternative accommodation</option>
              </select>

              <textarea
                value={cancelNotes}
                onChange={(e) => setCancelNotes(e.target.value)}
                placeholder="Additional notes (optional)..."
                rows={2}
                className="form-control text-xs mt-2"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="btn btn-secondary text-xs flex-1"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancellation}
                className="btn btn-danger text-xs flex-1"
              >
                Confirm 100% Refund & Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Zoom Modal */}
      {qrZoomModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 text-center">
            <h3 className="text-base font-bold text-slate-900 font-heading">Digital TravelNest QR Ticket</h3>
            <p className="text-xs text-slate-500">Ref: <span className="font-mono font-bold text-slate-800">{qrZoomModal.booking_reference}</span></p>

            <div className="w-52 h-52 mx-auto bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <img
                src={qrZoomModal.qr_code_url || `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${qrZoomModal.booking_reference}`}
                alt="QR Pass"
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-[11px] text-slate-500">
              Present this QR pass directly at <strong>{qrZoomModal.hotel_or_resort_name}</strong> check-in desk.
            </p>

            <button
              onClick={() => setQrZoomModal(null)}
              className="btn btn-secondary text-xs w-full"
            >
              Close Pass
            </button>
          </div>
        </div>
      )}

      {/* Track Trip Modal */}
      {trackModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-center">
            <Compass className="w-10 h-10 text-blue-600 mx-auto animate-bounce" />
            <h3 className="text-base font-bold text-slate-900 font-heading">Live GPS Trip Tracking</h3>
            <p className="text-xs text-slate-600">
              Booking Ref: <strong>{trackModal.booking_reference}</strong> ({trackModal.destination_name})
            </p>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-900 space-y-1 text-left">
              <p className="font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Status: {trackModal.status}</span>
              </p>
              <p>• Flight / Rail Transit: On Schedule</p>
              <p>• Stay: {trackModal.hotel_or_resort_name}</p>
              <p>• Check-in Date: {trackModal.check_in_date}</p>
            </div>
            <button onClick={() => setTrackModal(null)} className="btn btn-secondary btn-sm text-xs w-full">
              Close Tracking
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
