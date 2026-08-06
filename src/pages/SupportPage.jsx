import React, { useState, useRef, useEffect } from 'react';
import { 
  HelpCircle, 
  MessageSquare, 
  Send, 
  ChevronDown, 
  Sparkles, 
  Bot, 
  User, 
  RotateCcw, 
  MapPin, 
  Hotel, 
  Sun, 
  DollarSign, 
  ShieldCheck, 
  Plane, 
  Phone, 
  Mail, 
  Clock, 
  ArrowRight,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  processSupportQuery, 
  SUPPORT_CATEGORIES, 
  QUICK_PROMPTS 
} from '../utils/aiSupportEngine';

export const SupportPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { 
      id: 'welcome',
      sender: 'bot', 
      text: "👋 Hello! I am your TravelNest AI Customer Support Assistant.\n\nI can help you with hotel and resort bookings, budget estimates, weather & best seasons to visit, top attractions, flight transit, and our 100% full refund cancellation policy.\n\nWhat would you like to explore today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [openFaq, setOpenFaq] = useState(0);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputMsg).trim();
    if (!query) return;

    const userMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputMsg('');
    setIsTyping(true);

    setTimeout(() => {
      const response = processSupportQuery(query, messages);
      const botMessage = {
        id: `bot_${Date.now()}`,
        sender: 'bot',
        text: response.reply,
        relatedDestination: response.relatedDestination,
        actionType: response.actionType,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 600);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleResetChat = () => {
    setMessages([
      { 
        id: 'reset-welcome',
        sender: 'bot', 
        text: "✨ Chat cleared! I am ready to answer any travel questions about destinations, budget planning, hotels, or booking policies. How can I help you?",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const faqs = [
    {
      q: 'How does the AI Trip Planner generate personalized itineraries?',
      category: 'itinerary',
      a: 'Our smart AI engine analyzes your starting location, chosen destination, travel companion group (Solo, Couple, Family, Friends), interest tags (Heritage, Nature, Beach, Luxury), and budget tier. It creates a day-by-day sequence of morning, afternoon, and evening attractions optimized for travel distance, including top-rated hotels, local cuisines, and transit routes.'
    },
    {
      q: 'What is the 100% Full Refund & Cancellation Policy?',
      category: 'cancellation',
      a: 'TravelNest provides zero-fee cancellations for all bookings cancelled at least 24 hours before check-in date. When you cancel via "My Trips", 100% of the total paid amount is automatically processed back to your original payment method (UPI/Card) within 2 to 3 business days.'
    },
    {
      q: 'How do I access and use my digital QR Ticket?',
      category: 'booking',
      a: 'Every confirmed trip automatically generates a unique TravelNest reference (e.g. TN-REF-789210) and an encrypted QR ticket. You can view, download, or screenshot this ticket anytime from "My Trips" -> "View Details" to present at hotel check-in counters.'
    },
    {
      q: 'What budget tiers are available on TravelNest?',
      category: 'budget',
      a: 'We support 5 transparent budget levels: Weekend (₹5k - ₹15k), Budget Explorer (₹15k - ₹35k), Standard (₹35k - ₹75k), Premium (₹75k - ₹1.5L), and Ultra Luxury (₹1.5L+). Each includes calculated breakdowns for accommodation, food, local transport, and sightseeing passes.'
    },
    {
      q: 'How do I check weather conditions and best seasons to visit?',
      category: 'weather',
      a: 'Every destination card and itinerary on TravelNest displays real-time weather summaries, average temperatures, and recommended seasonal windows. You can also ask our AI Support Assistant for personalized packing tips and climate advice.'
    },
    {
      q: 'Are international destinations supported with flight guidance?',
      category: 'transport',
      a: 'Yes! TravelNest features prime international destinations including Maldives, Bali, Dubai, Singapore, Thailand, Japan, Switzerland, and France, complete with nearest airport IATA codes, transit times, and local currency/budget estimates.'
    }
  ];

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(f => f.category === activeCategory);

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200/80 bg-gradient-to-r from-blue-50/70 via-white to-purple-50/70 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 text-blue-700 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            24/7 Intelligent Customer Support
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            AI Travel Support & Help Center
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Ask our intelligent travel assistant about trip bookings, hotels, budget planning, weather updates, flight transit, or cancellation refunds.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/90 p-3 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900">100% Refund Guarantee</div>
            <div className="text-[11px] text-slate-500">Zero cancellation fee policy</div>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Columns: AI Support Chat Assistant */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-card rounded-3xl border border-slate-200/90 bg-white shadow-sm flex flex-col h-[650px] overflow-hidden">
            
            {/* Chatbox Header */}
            <div className="p-4 sm:px-6 bg-slate-50/90 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-sm font-bold text-slate-900">TravelNest AI Assistant</h2>
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <p className="text-[11px] text-slate-500">Live • Natural Language Travel Intelligence</p>
                </div>
              </div>

              <button 
                onClick={handleResetChat}
                title="Reset conversation"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-xs sm:text-sm bg-slate-50/30">
              {messages.map((m) => {
                const isBot = m.sender === 'bot';
                return (
                  <div key={m.id} className={`flex gap-3 ${isBot ? 'justify-start' : 'justify-end'}`}>
                    {isBot && (
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 shadow-xs ${
                      isBot 
                        ? 'bg-white border border-slate-200 text-slate-800 rounded-tl-none' 
                        : 'bg-blue-600 text-white rounded-tr-none'
                    }`}>
                      <div className="whitespace-pre-line leading-relaxed">
                        {m.text}
                      </div>

                      {/* Related Destination Quick Card */}
                      {m.relatedDestination && (
                        <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <img 
                              src={m.relatedDestination.image_url} 
                              alt={m.relatedDestination.name}
                              className="w-10 h-10 rounded-lg object-cover" 
                            />
                            <div>
                              <div className="font-bold text-xs">{m.relatedDestination.name}</div>
                              <div className="text-[11px] text-slate-500">{m.relatedDestination.best_season} • ₹{m.relatedDestination.estimated_budget_inr?.toLocaleString()}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => navigate('/explore')}
                            className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 flex items-center gap-1 shrink-0"
                          >
                            <span>View</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      <div className={`text-[10px] mt-2 text-right ${isBot ? 'text-slate-400' : 'text-blue-100'}`}>
                        {m.time}
                      </div>
                    </div>

                    {!isBot && (
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-1.5 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-4 py-2.5 bg-white border-t border-slate-100 overflow-x-auto scrollbar-none flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-400 shrink-0">Suggestions:</span>
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-3 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 text-xs whitespace-nowrap transition-colors border border-slate-200/60 shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleFormSubmit} className="p-3 sm:p-4 bg-slate-50/80 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Ask about hotels, weather, flights, budget, cancellation..."
                className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 transition-all placeholder:text-slate-400"
              />
              <button 
                type="submit" 
                disabled={!inputMsg.trim()}
                className="px-4 py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-xs flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Right 5 Columns: Categorized FAQs & Direct Support */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* FAQ Category Pills */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200/90 bg-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 font-heading">
                Help Topics & FAQs
              </h2>
              <span className="text-xs text-slate-500">{filteredFaqs.length} Guides</span>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-1.5 pb-2">
              {SUPPORT_CATEGORIES.slice(0, 6).map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                    activeCategory === cat.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Accordion FAQ Items */}
            <div className="space-y-3">
              {filteredFaqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div 
                    key={idx} 
                    className={`border rounded-2xl transition-all overflow-hidden ${
                      isOpen ? 'border-blue-200 bg-blue-50/20 shadow-xs' : 'border-slate-200/80 bg-slate-50/50'
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-3.5 text-left font-semibold text-xs sm:text-sm text-slate-900 flex justify-between items-center gap-2 hover:text-blue-600 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-blue-600' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Direct Support Channels Contact Card */}
          <div className="glass-card p-6 rounded-3xl border border-slate-200/90 bg-white shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-600" />
              Direct Support Channels
            </h2>

            <div className="grid grid-cols-1 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Email Support</div>
                  <a href="mailto:support@travelnest.ai" className="text-blue-600 hover:underline">
                    support@travelnest.ai
                  </a>
                  <div className="text-[10px] text-slate-400">Response within 2 hours</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">24x7 Helpline</div>
                  <div className="text-slate-700 font-mono font-medium">1800-419-NEST (Toll Free)</div>
                  <div className="text-[10px] text-slate-400">Emergency & Booking Concierge</div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
