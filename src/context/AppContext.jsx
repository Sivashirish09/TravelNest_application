import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';
import { 
  insertSupabaseBooking, 
  cancelSupabaseBooking, 
  insertSupabaseMemory, 
  deleteSupabaseMemory, 
  insertSupabaseNotification, 
  markSupabaseNotificationRead,
  syncSupabaseProfile
} from '../supabase/db';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  setDoc,
  getDoc,
  doc, 
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { SEED_DESTINATIONS } from '../data/destinations';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

const getUserKey = (user) => {
  if (!user) return 'guest';
  return user.uid || user.email?.replace(/[^a-zA-Z0-9]/g, '_') || 'guest';
};

const getStoredData = (key, fallback) => {
  try {
    const item = localStorage.getItem(`travelnest_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStoredData = (key, value) => {
  try {
    localStorage.setItem(`travelnest_${key}`, JSON.stringify(value));
  } catch (e) {}
};

const getInitialUserNotifications = (user) => [
  {
    id: `notif-welcome-${getUserKey(user)}`,
    type: 'general',
    category: 'Welcome to TravelNest',
    title: `🎉 Welcome ${user?.displayName || user?.fullName || 'Traveler'}!`,
    description: 'Your account has been created successfully. Start planning your first trip — discover curated destinations, generate AI itineraries, and reserve hotel stays with instant confirmation.',
    message: 'Your account has been created successfully. Start planning your first trip.',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    timeCategory: 'Today',
    read: false,
    created_at: new Date().toISOString()
  }
];

export const AppProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const userKey = getUserKey(currentUser);

  const [destinations] = useState(SEED_DESTINATIONS);

  const [bookings, setBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [memories, setMemories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [userProfile, setUserProfile] = useState({
    displayName: currentUser?.displayName || currentUser?.fullName || '',
    email: currentUser?.email || '',
    photoURL: currentUser?.photoURL || null,
    phoneNumber: currentUser?.phoneNumber || '',
    travelerLevel: 'Gold Explorer 🧭',
    bio: '',
    travelStyle: currentUser?.preferredTravelStyle || 'Balanced & Adventurous',
    dietaryPreference: '',
    preferredTransport: '',
    emergencyContact: { name: '', relation: '', phoneNumber: '' }
  });

  const [toast, setToast] = useState(null);

  // Reload per-user state on user switch
  const prevUserKeyRef = useRef(userKey);
  useEffect(() => {
    if (prevUserKeyRef.current !== userKey) {
      prevUserKeyRef.current = userKey;

      const lb = getStoredData(`bookings_${userKey}`, []);
      setBookings(Array.isArray(lb) ? lb : []);
      setWishlist(getStoredData(`wishlist_${userKey}`, []));
      setMemories(getStoredData(`memories_${userKey}`, []));
      setReviews(getStoredData(`reviews_${userKey}`, []));
      const ln = getStoredData(`notifications_${userKey}`, null);
      setNotifications(Array.isArray(ln) && ln.length > 0 ? ln : getInitialUserNotifications(currentUser));

      const savedProfile = getStoredData(`user_profile_${userKey}`, {});
      setUserProfile({
        displayName: currentUser?.displayName || currentUser?.fullName || 'Traveler',
        email: currentUser?.email || '',
        photoURL: currentUser?.photoURL || null,
        phoneNumber: currentUser?.phoneNumber || '',
        travelerLevel: 'Gold Explorer 🧭',
        bio: 'Passionate globetrotter, mountain hiker, and heritage explorer.',
        travelStyle: 'Balanced & Adventurous',
        dietaryPreference: 'Vegetarian',
        preferredTransport: 'Flight + Scenic Train',
        emergencyContact: { name: 'Family Contact', relation: 'Guardian', phoneNumber: '' },
        ...savedProfile
      });
    }
  }, [currentUser, userKey]);

  // Always sync userProfile.displayName/email from Firebase Auth (source of truth)
  useEffect(() => {
    if (currentUser?.email) {
      setUserProfile(prev => ({
        ...prev,
        displayName: currentUser.displayName || currentUser.fullName || prev.displayName,
        email: currentUser.email,
        photoURL: currentUser.photoURL || prev.photoURL,
        phoneNumber: currentUser.phoneNumber || prev.phoneNumber
      }));
    }
  }, [currentUser?.uid, currentUser?.displayName, currentUser?.email]);

  // Sync to localStorage cache
  useEffect(() => { setStoredData(`bookings_${userKey}`, bookings); setStoredData('bookings', bookings); }, [bookings, userKey]);
  useEffect(() => { setStoredData(`wishlist_${userKey}`, wishlist); }, [wishlist, userKey]);
  useEffect(() => { setStoredData(`memories_${userKey}`, memories); }, [memories, userKey]);
  useEffect(() => { setStoredData(`reviews_${userKey}`, reviews); }, [reviews, userKey]);
  useEffect(() => { setStoredData(`notifications_${userKey}`, notifications); }, [notifications, userKey]);
  useEffect(() => { setStoredData(`user_profile_${userKey}`, userProfile); }, [userProfile, userKey]);

  // Real-time Firestore Listeners (Firestore is primary source of truth)
  useEffect(() => {
    if (!currentUser?.uid) return;

    // Bookings listener
    const bookingsQ = query(collection(db, 'bookings'), where('userId', '==', currentUser.uid));
    const unsubBookings = onSnapshot(bookingsQ, (snap) => {
      if (!snap.empty) {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setBookings(docs);
      }
    }, err => console.warn('Firestore bookings:', err));

    // Notifications listener
    const notifQ = query(collection(db, 'notifications'), where('userId', '==', currentUser.uid));
    const unsubNotif = onSnapshot(notifQ, (snap) => {
      if (!snap.empty) {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        // Sort by created_at descending
        docs.sort((a, b) => (b.created_at || '') > (a.created_at || '') ? 1 : -1);
        setNotifications(docs);
      }
    }, err => console.warn('Firestore notifications:', err));

    // Memories listener
    const memQ = query(collection(db, 'memories'), where('userId', '==', currentUser.uid));
    const unsubMem = onSnapshot(memQ, (snap) => {
      if (!snap.empty) {
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setMemories(docs);
      }
    }, err => console.warn('Firestore memories:', err));

    // User profile from Firestore users collection
    const userDocRef = doc(db, 'users', currentUser.uid);
    const unsubProfile = onSnapshot(userDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setUserProfile(prev => ({
          ...prev,
          ...data,
          displayName: currentUser.displayName || data.displayName || prev.displayName,
          email: currentUser.email || data.email || prev.email,
          photoURL: currentUser.photoURL || data.photoURL || prev.photoURL
        }));
      }
    }, err => console.warn('Firestore user profile:', err));

    // Ensure welcome notification exists for this user
    ensureWelcomeNotification(currentUser);

    return () => {
      unsubBookings();
      unsubNotif();
      unsubMem();
      unsubProfile();
    };
  }, [currentUser?.uid]);

  // Ensure welcome notification is created only once per user
  const ensureWelcomeNotification = async (user) => {
    if (!user?.uid || !db) return;
    try {
      const welcomeId = `welcome_${user.uid}`;
      const existingRef = doc(db, 'notifications', welcomeId);
      const existing = await getDoc(existingRef);
      if (!existing.exists()) {
        await setDoc(existingRef, {
          id: welcomeId,
          userId: user.uid,
          type: 'general',
          category: 'Welcome to TravelNest',
          title: `🎉 Welcome ${user.displayName || user.fullName || 'Traveler'}!`,
          description: 'Your account has been created successfully. Start planning your first trip — discover curated destinations, generate AI itineraries, and reserve hotel stays with instant confirmation.',
          message: 'Your account has been created successfully. Start planning your first trip.',
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timeCategory: 'Today',
          read: false,
          created_at: new Date().toISOString(),
          timestamp: serverTimestamp()
        });
      }
    } catch (e) {
      console.warn('Welcome notification:', e);
    }
  };

  // Computed trip statistics
  const userStats = useMemo(() => {
    const confirmed = bookings.filter(b => b.status === 'CONFIRMED');
    const completed = bookings.filter(b => b.status === 'COMPLETED');
    const cancelled = bookings.filter(b => b.status === 'CANCELLED');
    const totalSpent = [...confirmed, ...completed]
      .reduce((sum, b) => sum + (Number(b.total_amount_inr) || 0), 0);
    const totalDays = [...confirmed, ...completed]
      .reduce((sum, b) => sum + (Number(b.nights) || 0), 0);
    const refunded = cancelled.reduce((sum, b) => sum + (Number(b.total_amount_inr) || 0), 0);

    return {
      totalTrips: bookings.length,
      confirmedTrips: confirmed.length,
      completedTrips: completed.length,
      cancelledTrips: cancelled.length,
      totalSpent,
      totalDays,
      refunded,
      upcomingTrips: confirmed.length
    };
  }, [bookings]);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const dispatchNotification = async ({ type, category, title, description, bookingId }) => {
    const now = new Date();
    const newNotif = {
      id: `notif_${Date.now()}`,
      userId: currentUser?.uid || 'guest_user',
      type: type || 'general',
      category: category || 'Travel Update',
      title: title || 'New Notification',
      description: description || '',
      message: description || '',
      bookingId: bookingId || null,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timeCategory: 'Today',
      read: false,
      created_at: now.toISOString()
    };

    if (db && currentUser?.uid) {
      try {
        const docRef = await addDoc(collection(db, 'notifications'), { ...newNotif, timestamp: serverTimestamp() });
        newNotif.id = docRef.id;
      } catch (e) { console.warn('Firestore notification:', e); }
    }

    // Sync to Supabase notifications table
    insertSupabaseNotification(newNotif).catch(() => {});

    setNotifications(prev => [newNotif, ...prev]);
    return newNotif;
  };

  const addBooking = async (bookingData) => {
    const refNum = Math.floor(100000 + Math.random() * 900000);
    const bookingReference = bookingData.booking_reference || `TN-REF-${refNum}`;
    const now = new Date();
    const destName = bookingData.destination_name || 'Trip';

    const newBooking = {
      ...bookingData,
      booking_reference: bookingReference,
      userId: currentUser?.uid || userKey,
      status: 'CONFIRMED',
      payment_status: 'PAID',
      created_at: now.toISOString(),
      booking_date: now.toISOString().split('T')[0],
      qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${bookingReference}-${encodeURIComponent(destName)}`
    };

    let docId = `booking_${Date.now()}`;
    if (db && currentUser?.uid) {
      try {
        const docRef = await addDoc(collection(db, 'bookings'), { ...newBooking, timestamp: serverTimestamp() });
        docId = docRef.id;
      } catch (e) { console.warn('Firestore addBooking:', e); }
    }

    const createdBooking = { id: docId, ...newBooking };
    setBookings(prev => [createdBooking, ...prev]);

    // Sync to Supabase bookings table
    insertSupabaseBooking(createdBooking).catch(() => {});

    // Booking Confirmed notification
    await dispatchNotification({
      type: 'booking',
      category: 'Booking Confirmed',
      title: `✅ Booking Confirmed — ${destName}`,
      description: `Trip from ${createdBooking.source_city || 'Your City'} to ${destName} | Hotel: ${createdBooking.hotel_or_resort_name || 'Luxury Stay'} | ${createdBooking.nights || 3} Nights | ${createdBooking.guests || 2} Guests | Total: ₹${Number(createdBooking.total_amount_inr || 0).toLocaleString('en-IN')} | Ref: ${bookingReference}`,
      bookingId: docId
    });

    // Payment Successful notification
    await dispatchNotification({
      type: 'payment',
      category: 'Payment Successful',
      title: `💳 Payment Successful — ₹${Number(createdBooking.total_amount_inr || 0).toLocaleString('en-IN')}`,
      description: `Payment of ₹${Number(createdBooking.total_amount_inr || 0).toLocaleString('en-IN')} confirmed via ${createdBooking.payment_method || 'UPI / Card'} for trip to ${destName}. Digital QR ticket generated. Travel Date: ${createdBooking.check_in_date || 'As scheduled'}.`,
      bookingId: docId
    });

    // Update user stats in Firestore & Supabase
    if (db && currentUser?.uid) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid), {
          lastBookingDate: now.toISOString(),
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (e) {}
    }

    showToast(`🎉 Trip to ${destName} Confirmed!`, 'success');
    return createdBooking;
  };

  const cancelBooking = async (bookingId, reason = 'Change of travel plans') => {
    const todayStr = new Date().toISOString().split('T')[0];
    let cancelledDest = 'Trip', cancelledAmount = 0, cancelledRef = '';

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId || b.booking_reference === bookingId) {
        cancelledDest = b.destination_name || 'Trip';
        cancelledAmount = b.total_amount_inr || b.total_budget || 0;
        cancelledRef = b.booking_reference || bookingId;
        return { ...b, status: 'CANCELLED', cancellation_date: todayStr, cancellation_reason: reason, refund_status: '100% Full Refund Initiated — Credited in 2-3 Business Days' };
      }
      return b;
    }));

    // Sync cancellation to Supabase
    cancelSupabaseBooking(bookingId, reason).catch(() => {});

    if (db && currentUser?.uid) {
      try {
        await updateDoc(doc(db, 'bookings', bookingId), {
          status: 'CANCELLED', cancellation_date: todayStr, cancellation_reason: reason,
          refund_status: '100% Full Refund Initiated — Credited in 2-3 Business Days'
        });
        // Also add to cancelledTrips collection
        await addDoc(collection(db, 'cancelledTrips'), {
          userId: currentUser.uid, bookingId, destinationName: cancelledDest,
          amount: cancelledAmount, reason, cancelledAt: todayStr, timestamp: serverTimestamp()
        });
      } catch (e) { console.warn('Firestore cancelBooking:', e); }
    }

    await dispatchNotification({
      type: 'cancellation', category: 'Booking Cancelled',
      title: `❌ Trip Cancelled — ${cancelledDest}`,
      description: `Booking ${cancelledRef} cancelled. Reason: "${reason}". 100% refund of ₹${Number(cancelledAmount).toLocaleString('en-IN')} initiated.`,
      bookingId
    });
    await dispatchNotification({
      type: 'refund', category: 'Refund Processed',
      title: `💳 100% Refund Approved — ₹${Number(cancelledAmount).toLocaleString('en-IN')}`,
      description: `Full refund for booking ${cancelledRef} will be credited to your original payment method within 2-3 business days.`,
      bookingId
    });

    showToast('Booking cancelled. 100% refund initiated.', 'info');
  };

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    markSupabaseNotificationRead(id).catch(() => {});
    if (db && currentUser?.uid) {
      try { updateDoc(doc(db, 'notifications', id), { read: true }); } catch (e) {}
    }
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('✓ All notifications marked as read', 'success');
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (db && currentUser?.uid) {
      try { deleteDoc(doc(db, 'notifications', id)); } catch (e) {}
    }
    showToast('Notification removed', 'info');
  };

  const addMemory = async (memData) => {
    // Gate: require at least one completed OR confirmed booking
    const hasTrip = bookings.some(b => b.status === 'COMPLETED' || b.status === 'CONFIRMED');
    if (!hasTrip) {
      showToast('You can only upload memories after completing or booking a trip.', 'error');
      return null;
    }

    const newMem = {
      id: `mem_${Date.now()}`,
      userId: currentUser?.uid || 'guest_user',
      ...memData,
      createdAt: new Date().toISOString()
    };

    // Sync to Supabase memories table
    insertSupabaseMemory(newMem).catch(() => {});

    if (db && currentUser?.uid) {
      try {
        const docRef = await addDoc(collection(db, 'memories'), { ...newMem, timestamp: serverTimestamp() });
        newMem.id = docRef.id;
      } catch (e) { console.warn('Firestore addMemory:', e); }
    }

    setMemories(prev => [newMem, ...prev]);

    await dispatchNotification({
      type: 'memory', category: 'Travel Memory Uploaded',
      title: `📸 New Travel Memory — ${newMem.destination || 'Adventure'}`,
      description: `"${newMem.title}" has been saved to your travel memories journal.`
    });

    showToast('✨ Travel memory added to your journal!', 'success');
    return newMem;
  };

  const deleteMemory = async (memId) => {
    setMemories(prev => prev.filter(m => m.id !== memId));
    deleteSupabaseMemory(memId).catch(() => {});
    if (db && currentUser?.uid) {
      try { await deleteDoc(doc(db, 'memories', memId)); } catch (e) {}
    }
    showToast('Memory entry removed', 'info');
  };

  const addReview = async (reviewData) => {
    const newReview = {
      id: `rev_${Date.now()}`,
      userId: currentUser?.uid || 'guest_user',
      ...reviewData,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };

    if (db && currentUser?.uid) {
      try {
        await addDoc(collection(db, 'reviews'), { ...newReview, timestamp: serverTimestamp() });
      } catch (e) { console.warn('Firestore addReview:', e); }
    }

    setReviews(prev => [newReview, ...prev]);
    showToast('⭐ Review published successfully!', 'success');
    return newReview;
  };

  const deleteReview = (revId) => {
    setReviews(prev => prev.filter(r => r.id !== revId));
    showToast('Review removed', 'info');
  };

  const updateProfileData = async (updates) => {
    const merged = { ...userProfile, ...updates };
    setUserProfile(merged);

    // Sync to Supabase profiles
    syncSupabaseProfile({ uid: currentUser?.uid, ...merged }).catch(() => {});

    if (db && currentUser?.uid) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid), {
          ...updates,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (e) { console.warn('Firestore updateProfile:', e); }
    }

    dispatchNotification({
      type: 'profile', category: 'Profile Updated',
      title: '👤 Profile & Travel Preferences Updated',
      description: 'Your traveler profile details, dietary settings, and emergency contacts were saved successfully.'
    });
    showToast('✓ Profile updated successfully!', 'success');
  };

  const toggleWishlist = (destId) => {
    setWishlist(prev => {
      if (prev.includes(destId)) {
        showToast('Removed from Wishlist', 'info');
        return prev.filter(id => id !== destId);
      } else {
        showToast('❤️ Saved to Wishlist!', 'success');
        return [...prev, destId];
      }
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      destinations,
      bookings,
      wishlist,
      memories,
      reviews,
      notifications,
      unreadCount,
      userProfile,
      userStats,
      toast,
      showToast,
      addBooking,
      cancelBooking,
      dispatchNotification,
      markNotificationRead,
      markAllNotificationsRead,
      deleteNotification,
      addMemory,
      deleteMemory,
      addReview,
      deleteReview,
      updateProfileData,
      toggleWishlist
    }}>
      {children}
    </AppContext.Provider>
  );
};
