import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { storage } from '../firebase/config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  Camera, 
  Plus, 
  MapPin, 
  Trash2, 
  Download, 
  Share2, 
  Eye, 
  FileText,
  Upload,
  Sparkles,
  X
} from 'lucide-react';

export const TravelMemoriesPage = () => {
  const { memories, addMemory, deleteMemory, showToast, bookings } = useApp();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [title, setTitle] = useState('');
  const [dest, setDest] = useState('');
  const [journal, setJournal] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [lightboxImg, setLightboxImg] = useState(null);

  const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80';

  // Get list of booked destinations for the dropdown
  const bookedDestinations = Array.isArray(bookings)
    ? [...new Set(bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED').map(b => b.destination_name))]
    : [];

  // Gate: user must have at least one booking
  const hasBookings = Array.isArray(bookings) && bookings.some(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED');

  // Set default dest to first booked destination
  React.useEffect(() => {
    if (bookedDestinations.length > 0 && !dest) {
      setDest(bookedDestinations[0]);
    }
  }, [bookedDestinations]);


  // Handle local device image selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !dest || !journal) {
      showToast('Please fill in title, destination, and journal notes.', 'error');
      return;
    }

    setIsUploading(true);
    let finalImageUrl = DEFAULT_FALLBACK;

    if (selectedFile) {
      try {
        if (storage) {
          // Use user-specific storage path
          const uid = currentUser?.uid || 'guest';
          const storageRef = ref(storage, `memories/${uid}/${Date.now()}_${selectedFile.name}`);
          await uploadBytes(storageRef, selectedFile);
          finalImageUrl = await getDownloadURL(storageRef);
        } else {
          finalImageUrl = previewUrl || DEFAULT_FALLBACK;
        }
      } catch (err) {
        console.warn('Firebase Storage fallback:', err);
        finalImageUrl = previewUrl || DEFAULT_FALLBACK;
      }
    }

    addMemory({
      title,
      destination: dest,
      date: new Date().toISOString().split('T')[0],
      imageUrl: finalImageUrl,
      journal
    });

    setIsUploading(false);
    setShowModal(false);
    setTitle('');
    setDest('');
    setJournal('');
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleDownload = (imgUrl, memTitle) => {
    const link = document.createElement('a');
    link.href = imgUrl;
    link.download = `${memTitle.replace(/\s+/g, '_')}_memory.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('📄 Image download started', 'success');
  };

  const handleShare = (mem) => {
    navigator.clipboard?.writeText?.(`TravelNest Memory: ${mem.title} in ${mem.destination}`);
    showToast('🔗 Memory details copied to clipboard!', 'success');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-3xl border border-slate-200 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Camera className="w-5 h-5 text-purple-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">Travel Memories & Journal</h1>
          </div>
          <p className="text-xs text-slate-500">
            Upload device travel photos to Firebase Storage and maintain your personalized travel log
          </p>
        </div>

        {hasBookings ? (
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Memory</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-2xl px-4 py-2.5">
            <Camera className="w-4 h-4 text-amber-600" />
            <span>Book a trip first to upload memories</span>
          </div>
        )}
      </div>

      {/* No Bookings Gate — Show CTA */}
      {!hasBookings && memories.length === 0 && (
        <div className="glass-card p-8 rounded-3xl border border-amber-100 bg-amber-50/40 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
            <Camera className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 font-heading">No Travel Memories Yet</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Your travel memories journal is empty. You can upload photos and notes after booking and completing a trip.
          </p>
          <button
            onClick={() => navigate('/planner')}
            className="btn btn-primary text-xs font-semibold mx-auto"
          >
            <Sparkles className="w-4 h-4" />
            <span>Plan Your First Trip</span>
          </button>
        </div>
      )}

      {/* Memories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories.map((m) => {
          // Graceful fallback for invalid/legacy image URLs
          const validImg = (m.imageUrl && (m.imageUrl.startsWith('http') || m.imageUrl.startsWith('data:image'))) 
            ? m.imageUrl 
            : DEFAULT_FALLBACK;

          return (
            <div key={m.id} className="glass-card rounded-2xl overflow-hidden border border-slate-200 bg-white flex flex-col justify-between group">
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={validImg}
                  alt={m.title}
                  onError={(e) => { e.target.src = DEFAULT_FALLBACK; }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-3 right-3 flex gap-1.5">
                  <button
                    onClick={() => setLightboxImg(validImg)}
                    className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:bg-white shadow-xs"
                    title="Fullscreen View"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteMemory(m.id)}
                    className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-colors shadow-xs"
                    title="Delete Memory"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-blue-600 font-semibold">
                      <MapPin className="w-3.5 h-3.5" />
                      {m.destination}
                    </span>
                    <span>{m.date}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{m.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                    "{m.journal}"
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => handleDownload(validImg, m.title)}
                    className="flex-1 btn btn-secondary btn-sm text-xs"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>Download</span>
                  </button>

                  <button
                    onClick={() => handleShare(m)}
                    className="flex-1 btn btn-secondary btn-sm text-xs"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Memory Modal with File Picker & Live Preview */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Camera className="w-4 h-4 text-purple-600" />
                <span>Upload Travel Memory</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Native File Selector */}
              <div className="form-group">
                <label className="text-slate-700 font-semibold mb-1 block">Select Photo from Device</label>
                <div className="relative border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="w-6 h-6 text-purple-600 mx-auto mb-1" />
                  <span className="text-xs text-slate-600 block font-semibold">
                    {selectedFile ? selectedFile.name : 'Click to choose image file'}
                  </span>
                </div>
              </div>

              {/* Live Preview */}
              {previewUrl && (
                <div className="h-32 rounded-xl overflow-hidden border border-slate-200">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="form-group mb-0">
                <label className="text-slate-700 font-semibold mb-1 block">Memory Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Pangong Lake Sunrise"
                  className="form-control text-xs bg-slate-50"
                  required
                />
              </div>

              <div className="form-group mb-0">
                <label className="text-slate-700 font-semibold mb-1 block">Destination Location</label>
                {bookedDestinations.length > 0 ? (
                  <select
                    value={dest}
                    onChange={(e) => setDest(e.target.value)}
                    className="form-control text-xs bg-slate-50"
                    required
                  >
                    {bookedDestinations.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                    <option value="other">Other (type below)</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={dest}
                    onChange={(e) => setDest(e.target.value)}
                    placeholder="e.g. Leh Ladakh, India"
                    className="form-control text-xs bg-slate-50"
                    required
                  />
                )}
                {dest === 'other' && (
                  <input
                    type="text"
                    placeholder="Enter destination name"
                    onChange={(e) => setDest(e.target.value)}
                    className="form-control text-xs bg-slate-50 mt-2"
                    required
                  />
                )}
              </div>


              <div className="form-group mb-0">
                <label className="text-slate-700 font-semibold mb-1 block">Journal Notes</label>
                <textarea
                  value={journal}
                  onChange={(e) => setJournal(e.target.value)}
                  rows={3}
                  placeholder="Write your travel thoughts..."
                  className="form-control text-xs bg-slate-50"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary text-xs flex-1">Cancel</button>
                <button type="submit" disabled={isUploading} className="btn btn-primary text-xs flex-1">
                  {isUploading ? 'Uploading to Storage...' : 'Save Memory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxImg && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full">
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute -top-10 right-0 text-white font-bold flex items-center gap-1 text-xs hover:text-slate-300 cursor-pointer"
            >
              <X className="w-5 h-5" /> Close
            </button>
            <img src={lightboxImg} alt="Enlarged Memory" className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
};
