import React, { useState } from 'react';
import { 
  CreditCard, 
  Lock, 
  ShieldCheck, 
  Calendar, 
  User, 
  KeyRound, 
  Sparkles, 
  CheckCircle2, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { 
  formatCardNumber, 
  formatExpiry, 
  detectCardBrand, 
  STRIPE_PUBLISHABLE_KEY 
} from '../../services/stripeService';

export const StripeCardPaymentForm = ({ 
  amount, 
  bookingRef, 
  onSuccess, 
  onError,
  isProcessing,
  setIsProcessing
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [postalCode, setPostalCode] = useState('500081');
  const [saveCard, setSaveCard] = useState(true);
  const [formError, setFormError] = useState('');

  const brand = detectCardBrand(cardNumber);

  // Quick 1-click test card filler
  const handleUseTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setExpiry('12/28');
    setCvc('999');
    if (!cardholderName) setCardholderName('TravelNest Explorer');
    setFormError('');
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    if (formError) setFormError('');
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    setExpiry(formatted);
    if (formError) setFormError('');
  };

  const handleCvcChange = (e) => {
    const clean = e.target.value.replace(/\D/g, '').substring(0, 4);
    setCvc(clean);
    if (formError) setFormError('');
  };

  const handleSubmitPayment = (e) => {
    e.preventDefault();
    setFormError('');

    if (cardNumber.replace(/\s/g, '').length < 16) {
      setFormError('Please enter a complete 16-digit card number.');
      return;
    }
    if (!expiry || expiry.length < 5) {
      setFormError('Please enter a valid expiry date (MM/YY).');
      return;
    }
    if (!cvc || cvc.length < 3) {
      setFormError('Please enter a 3 or 4 digit CVC security code.');
      return;
    }
    if (!cardholderName.trim()) {
      setFormError('Please enter the name printed on your card.');
      return;
    }

    onSuccess({
      cardNumber,
      expiry,
      cvc,
      cardholderName: cardholderName.trim(),
      postalCode: postalCode.trim(),
      saveCard
    });
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Stripe Gateway Header Banner */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
            <Lock className="w-4 h-4 text-blue-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs">Stripe Secure Checkout</span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-500/30 text-blue-200 border border-blue-400/20">
                TEST MODE
              </span>
            </div>
            <p className="text-[10px] text-slate-300">256-Bit SSL End-to-End Encrypted</p>
          </div>
        </div>

        {/* Quick Test Card Helper Button */}
        <button
          type="button"
          onClick={handleUseTestCard}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-semibold transition-all cursor-pointer shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Use Test Card</span>
        </button>
      </div>

      {/* Interactive Live Card Visualizer */}
      <div className="relative mx-auto max-w-sm rounded-2xl p-5 text-white shadow-xl overflow-hidden bg-gradient-to-tr from-slate-950 via-slate-900 to-blue-950 border border-slate-700/60">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-blue-500/20 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col justify-between h-36">
          <div className="flex items-center justify-between">
            {/* EMV Chip */}
            <div className="w-10 h-7 rounded-md bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 shadow-inner flex items-center justify-center opacity-90">
              <div className="w-8 h-5 border border-amber-800/40 rounded-xs" />
            </div>

            {/* Brand Logo or Stripe Indicator */}
            <div className="text-right">
              <span className="font-extrabold text-xs tracking-wider uppercase text-blue-300">
                {brand === 'visa' && 'VISA'}
                {brand === 'mastercard' && 'Mastercard'}
                {brand === 'amex' && 'AMEX'}
                {brand === 'discover' && 'Discover'}
                {brand === 'unknown' && 'STRIPE'}
              </span>
            </div>
          </div>

          {/* Card Number */}
          <div className="font-mono text-base tracking-widest text-slate-100 font-medium">
            {cardNumber || '•••• •••• •••• ••••'}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <div>
              <span className="text-[9px] uppercase tracking-wider block text-slate-400">Cardholder</span>
              <span className="font-semibold uppercase truncate max-w-[150px] block text-white">
                {cardholderName || 'YOUR FULL NAME'}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[9px] uppercase tracking-wider block text-slate-400">Expires</span>
              <span className="font-semibold font-mono text-white">
                {expiry || 'MM/YY'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stripe Payment Input Fields */}
      <div className="space-y-3.5 text-xs">
        {formError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{formError}</span>
          </div>
        )}

        {/* Card Number */}
        <div className="space-y-1">
          <label className="text-slate-700 font-semibold block">Card Number</label>
          <div className="relative flex items-center">
            <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="4242 4242 4242 4242"
              maxLength={19}
              className="form-control text-xs pl-10 pr-20 bg-slate-50 border-slate-300 font-mono tracking-wider"
              required
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase">{brand !== 'unknown' ? brand : 'Card'}</span>
            </div>
          </div>
        </div>

        {/* Expiry & CVC in 2 Cols */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-slate-700 font-semibold block">Expiry Date</label>
            <div className="relative flex items-center">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
              <input
                type="text"
                value={expiry}
                onChange={handleExpiryChange}
                placeholder="MM/YY"
                maxLength={5}
                className="form-control text-xs pl-10 bg-slate-50 border-slate-300 font-mono"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-700 font-semibold block">CVC / CVV</label>
            <div className="relative flex items-center">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
              <input
                type="password"
                value={cvc}
                onChange={handleCvcChange}
                placeholder="123"
                maxLength={4}
                className="form-control text-xs pl-10 bg-slate-50 border-slate-300 font-mono"
                required
              />
            </div>
          </div>
        </div>

        {/* Cardholder Name */}
        <div className="space-y-1">
          <label className="text-slate-700 font-semibold block">Name on Card</label>
          <div className="relative flex items-center">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              type="text"
              value={cardholderName}
              onChange={(e) => {
                setCardholderName(e.target.value);
                if (formError) setFormError('');
              }}
              placeholder="e.g. Siva Sirish"
              className="form-control text-xs pl-10 bg-slate-50 border-slate-300"
              required
            />
          </div>
        </div>

        {/* Billing Postal Code & Save Card Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 items-center">
          <div className="space-y-1">
            <label className="text-slate-700 font-semibold block">Postal / ZIP Code</label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              placeholder="500081"
              maxLength={10}
              className="form-control text-xs bg-slate-50 border-slate-300"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-slate-600 text-[11px] pt-4 sm:pt-4">
            <input
              type="checkbox"
              checked={saveCard}
              onChange={(e) => setSaveCard(e.target.checked)}
              className="accent-blue-600 w-3.5 h-3.5"
            />
            <span>Save card for 1-click booking</span>
          </label>
        </div>

        {/* Submit & Pay with Stripe Button */}
        <button
          type="button"
          onClick={handleSubmitPayment}
          disabled={isProcessing}
          className="w-full btn btn-primary py-3.5 text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 mt-4 cursor-pointer"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Verifying with Stripe Gateway...</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4 text-blue-200" />
              <span>Pay ₹{amount.toLocaleString()} with Stripe</span>
            </>
          )}
        </button>

        {/* Security Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[10px] text-slate-500">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            PCI-DSS Level 1 Certified
          </span>
          <span>•</span>
          <span>Stripe Gateway v3</span>
          <span>•</span>
          <span>Instant Confirmation</span>
        </div>
      </div>
    </div>
  );
};
