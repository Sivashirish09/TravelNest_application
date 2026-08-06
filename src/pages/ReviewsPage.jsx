import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Star, Plus, MapPin } from 'lucide-react';

export const ReviewsPage = () => {
  const { reviews, addReview } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [dest, setDest] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addReview({ destination: dest, rating: Number(rating), title, comment });
    setShowModal(false);
    setDest('');
    setTitle('');
    setComment('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 max-w-3xl mx-auto">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">My Reviews & Ratings</h1>
          </div>
          <p className="text-xs text-slate-500">
            Share ratings and reviews for destinations and hotel stays
          </p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary text-xs font-semibold">
          <Plus className="w-4 h-4" />
          <span>Write Review</span>
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map(r => (
          <div key={r.id} className="glass-card p-5 rounded-2xl border border-slate-200 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {r.destination}
              </span>
              <div className="flex items-center gap-1 text-amber-600 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-500" />
                <span>{r.rating}.0 / 5.0</span>
              </div>
            </div>

            <h3 className="text-sm font-bold text-slate-900">{r.title}</h3>
            <p className="text-xs text-slate-600">{r.comment}</p>
            <span className="text-[10px] text-slate-400 block pt-1">Reviewed on {r.date}</span>
          </div>
        ))}
      </div>

      {/* Write Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-4">Write Destination Review</h3>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="form-group">
                <label className="text-slate-700 font-semibold mb-1 block">Destination Name</label>
                <input type="text" value={dest} onChange={(e) => setDest(e.target.value)} placeholder="e.g. Visakhapatnam, Araku, Goa" className="form-control text-xs" required />
              </div>

              <div className="form-group">
                <label className="text-slate-700 font-semibold mb-1 block">Star Rating (1-5)</label>
                <select value={rating} onChange={(e) => setRating(e.target.value)} className="form-control text-xs">
                  <option value={5}>⭐⭐⭐⭐⭐ (5/5) Excellent</option>
                  <option value={4}>⭐⭐⭐⭐ (4/5) Very Good</option>
                  <option value={3}>⭐⭐⭐ (3/5) Average</option>
                </select>
              </div>

              <div className="form-group">
                <label className="text-slate-700 font-semibold mb-1 block">Review Title</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Headline summary" className="form-control text-xs" required />
              </div>

              <div className="form-group">
                <label className="text-slate-700 font-semibold mb-1 block">Written Experience</label>
                <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder="Share your experience..." className="form-control text-xs" required />
              </div>

              <div className="flex gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary text-xs flex-1">Cancel</button>
                <button type="submit" className="btn btn-primary text-xs flex-1">Publish Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
