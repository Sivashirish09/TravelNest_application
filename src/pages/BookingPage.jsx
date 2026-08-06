import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { SEED_DESTINATIONS, findCanonicalDestination } from '../data/destinations';
import { recordPayment } from '../utils/analyticsEngine';
import { InvoiceModal } from '../components/common/InvoiceModal';
import { StripeCardPaymentForm } from '../components/payment/StripeCardPaymentForm';
import { processStripePayment } from '../services/stripeService';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  CreditCard, 
  ArrowLeft, 
  Lock, 
  ShieldCheck, 
  Star, 
  MapPin, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Users, 
  QrCode, 
  FileText, 
  Printer, 
  Check, 
  Heart, 
  Compass, 
  AlertCircle 
} from 'lucide-react';

import { resolveOrCreateDestination, generateDestinationHotels } from '../utils/aiPlannerEngine';

export const BookingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser } = useAuth();
  const { addBooking, showToast } = useApp();

  const destParam = searchParams.get('destId') || searchParams.get('dest') || 'chennai';
  const destNameParam = searchParams.get('destName') || '';
  const itinId = searchParams.get('itinId') || '';

  const matchedDest = resolveOrCreateDestination(destNameParam || destParam);

  // Read prefill from sessionStorage if coming from itinerary page
  const prefill = (() => {
    if (itinId) {
      try {
        const stored = sessionStorage.getItem(`booking_prefill_${itinId}`);
        return stored ? JSON.parse(stored) : null;
      } catch (e) { return null; }
    }
    return null;
  })();

  // Combined Hotels & Resorts
  const synthHotels = generateDestinationHotels(matchedDest.name, matchedDest.state);
  const combinedStays = [
    ...(matchedDest.hotels && matchedDest.hotels.length > 0 ? matchedDest.hotels.map(h => ({ ...h, type: 'Hotel' })) : synthHotels.premiumHotels.map(h => ({ ...h, price_per_night: h.pricePerNight, type: 'Hotel' }))),
    ...(matchedDest.resorts && matchedDest.resorts.length > 0 ? matchedDest.resorts.map(r => ({ ...r, type: 'Resort' })) : synthHotels.resorts.map(r => ({ ...r, price_per_night: r.pricePerNight, type: 'Resort' }))),
    ...synthHotels.budgetHotels.map(b => ({ ...b, price_per_night: b.pricePerNight, type: 'Budget Inn' }))
  ];

  const defaultStay = combinedStays[0] || {
    name: 'Taj Gateway Resort & Spa',
    price_per_night: matchedDest.accommodation_cost_per_night || 4500,
    rating: 4.85,
    type: 'Resort'
  };

  const initialHotelName = prefill?.hotel_or_resort_name || searchParams.get('hotel') || defaultStay.name;
  const [selectedStayName, setSelectedStayName] = useState(initialHotelName);
  const currentStayObj = combinedStays.find(s => s.name === selectedStayName) || defaultStay;

  const initialTripType = prefill?.trip_type || searchParams.get('tripType') || 'Couple';
  const [tripType, setTripType] = useState(initialTripType);

  // Source city from prefill or URL param
  const [sourceCity, setSourceCity] = useState(
    prefill?.source_city || searchParams.get('source') || 'Hyderabad'
  );

  const [nights, setNights] = useState(
    prefill?.nights || Number(searchParams.get('nights')) || matchedDest.recommended_days || 3
  );
  const [guests, setGuests] = useState(
    prefill?.guests || Number(searchParams.get('guests')) || (initialTripType === 'Solo' ? 1 : initialTripType === 'Family' ? 4 : 2)
  );
  const [roomType, setRoomType] = useState('Deluxe King Room');
  const [checkInDate, setCheckInDate] = useState(
    prefill?.check_in_date || searchParams.get('date') || '2026-08-15'
  );

  // Guest Details — always from Firebase Auth first
  const [fullName, setFullName] = useState(currentUser?.displayName || currentUser?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phoneNumber || currentUser?.phone || '');
  const [specialRequest, setSpecialRequest] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Stripe Card (Credit / Debit)');

  // Submission & Success Modal State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModalData, setSuccessModalData] = useState(null);
  const [invoiceModalBooking, setInvoiceModalBooking] = useState(null);

  // Pre-generate a booking reference for the QR Code
  const [bookingRef] = useState(() => `TN-REF-${Math.floor(100000 + Math.random() * 900000)}`);


  // Dynamic Price Calculations
  const roomMultiplier = roomType === 'Royal Villa / Suite' ? 1.4 : roomType === 'Executive Ocean View' ? 1.2 : 1.0;
  const stayRatePerNight = Math.round((currentStayObj.price_per_night || 4500) * roomMultiplier);
  const totalStayCost = stayRatePerNight * nights;
  const sightseeingAndTours = Math.round((matchedDest.sightseeing_cost || 1500) * (guests > 2 ? 1.5 : 1.0));
  const gstTax = Math.round((totalStayCost + sightseeingAndTours) * 0.12);
  const serviceFee = Math.round((totalStayCost + sightseeingAndTours) * 0.03);
  const totalAmount = totalStayCost + sightseeingAndTours + gstTax + serviceFee;

  const TRIP_TYPES = [
    { id: 'Solo', label: 'Solo Explorer', icon: '🎒', desc: 'Cafe hops & culture' },
    { id: 'Couple', label: 'Couple & Romantic', icon: '💑', desc: 'Scenic getaways & dinners' },
    { id: 'Family', label: 'Family & Kids', icon: '👨‍👩‍👧‍👦', desc: 'Kids & theme parks' },
    { id: 'Friends', label: 'Friends Getaway', icon: '🏕️', desc: 'Adventure & nightlife' },
    { id: 'Adventure & Trek', label: 'Adventure & Trek', icon: '🧗‍♂️', desc: 'High altitude peaks & trails' },
    { id: 'Luxury & Spa', label: 'Luxury & Wellness', icon: '✨', desc: '5-Star infinity pools & spa' },
    { id: 'Heritage & Spiritual', label: 'Heritage & Spiritual', icon: '🛕', desc: 'Ancient temples & forts' },
    { id: 'Road Trip & Biking', label: 'Road Trip & Biking', icon: '🏍️', desc: 'Scenic mountain & coastal drives' },
    { id: 'Corporate', label: 'Business & Workation', icon: '💼', desc: 'Executive lounges & Wi-Fi' },
    { id: 'Group', label: 'Group & Batch', icon: '🚌', desc: 'Shared villas & bus tours' }
  ];

  // Stripe Payment Processor Handler
  const handleStripeCardSuccess = async (cardData) => {
    if (!fullName || !email || !phone) {
      showToast('Please fill in your Contact & Guest details before making payment.', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      showToast('Connecting to Stripe Payment Gateway...', 'info');

      const stripeResult = await processStripePayment({
        amount: totalAmount,
        currency: 'inr',
        bookingRef,
        guestDetails: { fullName, email, phone },
        cardDetails: cardData
      });

      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const dateOnly = nowStr.substring(0, 10);
      const timeOnly = nowStr.substring(11, 19);

      // 1. Save Booking with Stripe Payment details
      const bookingPayload = {
        id: 'booking_' + Date.now(),
        source_city: sourceCity || searchParams.get('source') || 'Hyderabad',
        destination_id: matchedDest.id,
        destination_name: matchedDest.name,
        country: matchedDest.country || 'India',
        hotel_or_resort_name: selectedStayName,
        room_type: roomType,
        trip_type: tripType,
        check_in_date: checkInDate,
        nights: Number(nights),
        guests: Number(guests),
        total_amount_inr: totalAmount,
        guest_name: fullName,
        guest_email: email,
        guest_phone: phone,
        special_requests: specialRequest,
        payment_method: `Stripe (${stripeResult.card.brand} •••• ${stripeResult.card.last4})`,
        payment_gateway: 'Stripe',
        stripe_payment_intent_id: stripeResult.paymentIntentId,
        stripe_charge_id: stripeResult.chargeId,
        stripe_card_brand: stripeResult.card.brand,
        stripe_card_last4: stripeResult.card.last4,
        stripe_receipt_url: stripeResult.receiptUrl,
        booking_reference: bookingRef,
        status: 'CONFIRMED',
        payment_status: 'PAID',
        transaction_id: stripeResult.paymentIntentId,
        booking_date: dateOnly,
        booking_time: timeOnly,
        qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${bookingRef}`
      };

      const newBooking = await addBooking(bookingPayload);

      // 2. Save Payment Record to Firestore collection "payments"
      const paymentPayload = {
        paymentId: stripeResult.paymentIntentId,
        bookingId: bookingRef,
        userId: currentUser?.uid || 'guest_user',
        userName: fullName,
        userEmail: email,
        amount: totalAmount,
        paymentMethod: `Stripe (${stripeResult.card.brand})`,
        transactionId: stripeResult.paymentIntentId,
        stripeChargeId: stripeResult.chargeId,
        cardLast4: stripeResult.card.last4,
        paymentStatus: 'SUCCESS',
        createdAt: nowStr
      };

      await recordPayment(paymentPayload);

      // 3. Show Success Modal with Invoice Actions
      setSuccessModalData({
        booking: newBooking,
        transactionId: stripeResult.paymentIntentId,
        gateway: 'Stripe Gateway',
        cardBrand: stripeResult.card.brand,
        last4: stripeResult.card.last4,
        paymentDate: dateOnly,
        paymentTime: timeOnly,
        amount: totalAmount
      });

      showToast(`🎉 Stripe Payment Verified! Ref: ${bookingRef}`, 'success');
    } catch (err) {
      console.error(err);
      showToast(err.message || 'Stripe payment failed. Please check card details.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProcessPaymentAndBooking = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    if (!fullName || !email || !phone) {
      showToast('Please complete all contact details', 'error');
      return;
    }

    try {
      setIsSubmitting(true);

      const generatedTxnId = `TXN-TN-${Math.floor(10000000 + Math.random() * 90000000)}`;
      const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
      const dateOnly = nowStr.substring(0, 10);
      const timeOnly = nowStr.substring(11, 19);

      // 1. Booking Payload for AppContext & Firestore Bookings
      const bookingPayload = {
        id: 'booking_' + Date.now(),
        source_city: sourceCity || searchParams.get('source') || 'Hyderabad',
        destination_id: matchedDest.id,
        destination_name: matchedDest.name,
        country: matchedDest.country || 'India',
        hotel_or_resort_name: selectedStayName,
        room_type: roomType,
        trip_type: tripType,
        check_in_date: checkInDate,
        nights: Number(nights),
        guests: Number(guests),
        total_amount_inr: totalAmount,
        guest_name: fullName,
        guest_email: email,
        guest_phone: phone,
        special_requests: specialRequest,
        payment_method: paymentMethod,
        booking_reference: bookingRef,
        status: 'CONFIRMED',
        payment_status: 'PAID',
        transaction_id: generatedTxnId,
        booking_date: dateOnly,
        booking_time: timeOnly,
        qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${bookingRef}`
      };


      const newBooking = await addBooking(bookingPayload);

      // 2. Save Payment Record to Firestore collection "payments"
      const paymentPayload = {
        paymentId: `PAY-${Date.now()}`,
        bookingId: bookingRef,
        userId: currentUser?.uid || 'guest_user',
        userName: fullName,
        userEmail: email,
        amount: totalAmount,
        paymentMethod: paymentMethod,
        transactionId: generatedTxnId,
        paymentStatus: 'SUCCESS',
        createdAt: nowStr
      };

      await recordPayment(paymentPayload);

      // 3. Show Success Modal with Invoice Actions
      setSuccessModalData({
        booking: newBooking,
        transactionId: generatedTxnId,
        paymentDate: dateOnly,
        paymentTime: timeOnly,
        amount: totalAmount
      });

      showToast(`🎉 Payment & Booking Confirmed! Ref: ${bookingRef}`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Payment processing failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-5xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Destinations</span>
      </button>

      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 bg-gradient-to-r from-blue-50/80 via-white to-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5 text-blue-600" />
            Verified Stay & Package Reservation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Book Trip to {matchedDest.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {matchedDest.state || matchedDest.country} • Best Season: {matchedDest.best_season} • {matchedDest.weather_info}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Full Refund Guarantee</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleProcessPaymentAndBooking} className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/90 bg-white space-y-6 shadow-xs">
            
            {/* Step 1: Trip Type Selection */}
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading border-b border-slate-100 pb-3 flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-600" />
                1. Select Trip Type Persona
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
                {TRIP_TYPES.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setTripType(t.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer text-center space-y-1 ${
                      tripType === t.id
                        ? 'border-blue-600 bg-blue-50/70 shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl block">{t.icon}</span>
                    <div className="font-bold text-xs text-slate-900">{t.label}</div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">{t.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Stay & Room Selection */}
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading border-b border-slate-100 pb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                2. Select Accommodation & Room
              </h2>

              <div className="mt-4 space-y-3">
                <label className="text-xs font-semibold text-slate-700 block">Verified Hotel / Resort for {matchedDest.name}</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {combinedStays.map((stay, idx) => {
                    const isSelected = selectedStayName === stay.name;
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedStayName(stay.name)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50/50 shadow-xs' 
                            : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-slate-900">{stay.name}</span>
                            <span className="badge badge-blue text-[10px] py-0">{stay.type}</span>
                            <span className="text-xs text-amber-500 font-semibold flex items-center gap-0.5">
                              ⭐ {stay.rating || 4.8}
                            </span>
                          </div>
                          {stay.amenities && (
                            <p className="text-[11px] text-slate-500">
                              {stay.amenities.slice(0, 3).join(' • ')}
                            </p>
                          )}
                        </div>

                        <div className="text-right shrink-0">
                          <div className="font-black text-sm text-slate-900">
                            ₹{stay.price_per_night?.toLocaleString()}
                          </div>
                          <span className="text-[10px] text-slate-400">/ night</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Room Type Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                  {['Deluxe King Room', 'Executive Ocean View', 'Royal Villa / Suite'].map((rt) => (
                    <button
                      key={rt}
                      type="button"
                      onClick={() => setRoomType(rt)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                        roomType === rt 
                          ? 'border-blue-600 bg-blue-600 text-white' 
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {rt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Dates & Guests */}
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading border-b border-slate-100 pb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                3. Travel Dates & Duration
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block">Check-in Date</label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="form-control text-xs bg-slate-50"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block">Duration (Nights)</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={nights}
                    onChange={(e) => setNights(Number(e.target.value) || 1)}
                    className="form-control text-xs bg-slate-50"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block">Guests</label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value) || 1)}
                    className="form-control text-xs bg-slate-50"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Primary Guest Details */}
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading border-b border-slate-100 pb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                4. Primary Guest & Contact Info
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-xs">
                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block">Full Name</label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="form-control text-xs pl-10 bg-slate-50 border-slate-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-semibold block">Email (for E-Ticket delivery)</label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-control text-xs pl-10 bg-slate-50 border-slate-300"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-700 font-semibold block">Mobile Phone Number</label>
                  <div className="relative flex items-center">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="form-control text-xs pl-10 bg-slate-50 border-slate-300"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5: Payment Method & Stripe Gateway */}
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading border-b border-slate-100 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>5. Select Payment Gateway & Complete Reservation</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  Stripe Powered
                </span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 text-xs">
                {['Stripe Card (Credit / Debit)', 'UPI / GPay / PhonePe', 'Net Banking'].map((method) => (
                  <label
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                      paymentMethod === method 
                        ? 'bg-blue-50 border-blue-600 text-blue-900 font-bold shadow-xs' 
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="truncate">{method}</span>
                    <input type="radio" checked={paymentMethod === method} readOnly className="accent-blue-600 ml-2" />
                  </label>
                ))}
              </div>

              {/* 1. STRIPE CARD PAYMENT FORM */}
              {paymentMethod.includes('Stripe') && (
                <div className="mt-4 p-5 rounded-3xl bg-slate-50/80 border border-slate-200/90 shadow-xs">
                  <StripeCardPaymentForm
                    amount={totalAmount}
                    bookingRef={bookingRef}
                    onSuccess={handleStripeCardSuccess}
                    isProcessing={isSubmitting}
                  />
                </div>
              )}

              {/* 2. DEMO QR PAYMENT SECTION (When UPI is selected) */}
              {paymentMethod.includes('UPI') && (
                <div className="mt-4 p-5 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-sm text-slate-900">Demo QR Payment</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      (For Project Demonstration Only)
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
                    {/* Demo QR Code Graphic */}
                    <div className="w-36 h-36 bg-white p-2 rounded-2xl border border-slate-200 shrink-0 shadow-xs">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=travelnest.ai@icici&pn=TravelNest_AI&am=${totalAmount}&tr=${bookingRef}`}
                        alt="Demo UPI QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* QR Details */}
                    <div className="space-y-2 text-xs text-slate-700 flex-1 w-full">
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500">Merchant Name:</span>
                        <strong className="text-slate-900 font-heading">TravelNest AI Smart Trip Planner</strong>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500">UPI ID:</span>
                        <strong className="font-mono text-blue-600">travelnest.ai@icici</strong>
                      </div>
                      <div className="flex justify-between border-b border-slate-100 pb-1.5">
                        <span className="text-slate-500">Booking ID:</span>
                        <strong className="font-mono text-slate-800">{bookingRef}</strong>
                      </div>
                      <div className="flex justify-between pt-0.5">
                        <span className="text-slate-500 font-bold">Payable Amount:</span>
                        <strong className="text-base text-emerald-600 font-black">₹{totalAmount.toLocaleString()}</strong>
                      </div>
                    </div>
                  </div>

                  {/* "I Have Completed Payment" Button */}
                  <button
                    type="button"
                    onClick={handleProcessPaymentAndBooking}
                    disabled={isSubmitting}
                    className="w-full btn btn-primary py-3 text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>{isSubmitting ? 'Verifying Payment...' : 'I Have Completed Payment'}</span>
                  </button>
                </div>
              )}

              {/* 3. NET BANKING SECTION */}
              {paymentMethod === 'Net Banking' && (
                <div className="mt-4 p-5 rounded-3xl bg-slate-50 border border-slate-200/90 space-y-4">
                  <div className="space-y-2">
                    <label className="text-slate-700 font-semibold block text-xs">Select Your Bank</label>
                    <select className="form-control text-xs bg-white">
                      <option value="HDFC">HDFC Bank</option>
                      <option value="ICICI">ICICI Bank</option>
                      <option value="SBI">State Bank of India (SBI)</option>
                      <option value="AXIS">Axis Bank</option>
                      <option value="KOTAK">Kotak Mahindra Bank</option>
                    </select>
                  </div>

                  <button
                    type="button"
                    onClick={handleProcessPaymentAndBooking}
                    disabled={isSubmitting}
                    className="w-full btn btn-primary py-3.5 text-xs sm:text-sm font-bold shadow-md shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>{isSubmitting ? 'Connecting Bank Gateway...' : `Proceed to Net Banking ₹${totalAmount.toLocaleString()}`}</span>
                  </button>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Right Order Summary Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-card p-6 rounded-3xl border border-slate-200/90 bg-white space-y-4 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 font-heading border-b border-slate-100 pb-3">
              Booking Price Summary
            </h2>

            {/* Destination Preview Card */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              <img 
                src={matchedDest.image_url} 
                alt={matchedDest.name}
                className="w-14 h-14 rounded-xl object-cover" 
              />
              <div>
                <h3 className="font-bold text-sm text-slate-900">{matchedDest.name}</h3>
                <p className="text-[11px] text-slate-500">{matchedDest.state || matchedDest.country}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="badge badge-blue text-[10px] py-0">{tripType} Trip</span>
                  <span className="badge badge-amber text-[10px] py-0">{matchedDest.budget_level}</span>
                </div>
              </div>
            </div>

            {/* Stay Details */}
            <div className="space-y-2 text-xs border-b border-slate-100 pb-3">
              <div className="flex justify-between">
                <span className="text-slate-500">Selected Stay:</span>
                <span className="font-bold text-slate-800 text-right">{selectedStayName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Room Category:</span>
                <span className="font-semibold text-slate-800">{roomType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Duration & Guests:</span>
                <span className="font-semibold text-slate-800">{nights} Nights ({guests} Guests)</span>
              </div>
            </div>

            {/* Price Line Items */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Room Charges ({nights} nights x ₹{stayRatePerNight.toLocaleString()}):</span>
                <span className="font-semibold text-slate-900">₹{totalStayCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Sightseeing & Attraction Passes:</span>
                <span className="font-semibold text-slate-900">₹{sightseeingAndTours.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST Tax (12%):</span>
                <span className="font-semibold text-slate-900">₹{gstTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Convenience & Booking Fee:</span>
                <span className="font-semibold text-slate-900">₹{serviceFee.toLocaleString()}</span>
              </div>
            </div>

            {/* Grand Total */}
            <div className="flex justify-between border-t border-slate-200 pt-3 text-sm font-extrabold text-slate-900">
              <span>Total Payable:</span>
              <span className="text-emerald-600 text-lg">₹{totalAmount.toLocaleString()}</span>
            </div>

            {/* Refund Advisory */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-[11px] text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Free cancellation up to 24h before check-in. 100% full refund credited in 2-3 business days.</span>
            </div>
          </div>
        </div>

      </div>

      {/* PAYMENT SUCCESSFUL MODAL */}
      {successModalData && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <span className="badge badge-green text-xs">CONFIRMED & PERSISTED</span>
              <h3 className="text-xl font-black text-slate-900 font-heading">Payment Successful</h3>
              <p className="text-xs text-slate-600">
                Your reservation for <strong>{successModalData.booking.destination_name}</strong> has been secured!
              </p>
            </div>

            {/* Transaction & Booking Audit Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Booking ID:</span>
                <strong className="font-mono text-blue-600">{successModalData.booking.booking_reference}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Gateway:</span>
                <strong className="text-slate-900 font-semibold">{successModalData.gateway || 'Stripe Gateway'}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID:</span>
                <strong className="font-mono text-slate-800 truncate max-w-[200px]">{successModalData.transactionId}</strong>
              </div>
              {successModalData.cardBrand && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Card Used:</span>
                  <strong className="text-slate-800">{successModalData.cardBrand} •••• {successModalData.last4}</strong>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Date:</span>
                <strong className="text-slate-800">{successModalData.paymentDate} at {successModalData.paymentTime}</strong>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900">
                <span>Amount Paid:</span>
                <span className="text-emerald-600 text-sm font-black">₹{successModalData.amount.toLocaleString()}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setInvoiceModalBooking(successModalData.booking)}
                  className="btn btn-secondary text-xs flex-1 flex items-center justify-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  <span>View Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInvoiceModalBooking(successModalData.booking);
                    setTimeout(() => window.print(), 300);
                  }}
                  className="btn btn-secondary text-xs flex-1 flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-700" />
                  <span>Download Invoice</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => navigate('/bookings')}
                className="w-full btn btn-primary text-xs py-3 font-semibold shadow-xs"
              >
                Go to My Bookings & Trips
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Digital Tax Invoice Modal */}
      {invoiceModalBooking && (
        <InvoiceModal
          booking={invoiceModalBooking}
          payment={successModalData}
          onClose={() => setInvoiceModalBooking(null)}
        />
      )}
    </div>
  );
};
