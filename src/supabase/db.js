import { supabase } from './config';

/**
 * =========================================================================
 * TRAVELNEST SUPABASE DATABASE & STORAGE SERVICE LAYER
 * =========================================================================
 * Provides robust CRUD operations directly with Supabase PostgreSQL tables
 * with built-in error handling and fallback capabilities.
 */

// -------------------------------------------------------------------------
// 1. PROFILES & USER DATA
// -------------------------------------------------------------------------

/**
 * Synchronize or create a user profile in Supabase `profiles` table
 */
export const syncSupabaseProfile = async (userData) => {
  if (!userData?.uid && !userData?.id) return null;
  const uid = userData.uid || userData.id;

  const profilePayload = {
    id: uid,
    email: userData.email,
    full_name: userData.fullName || userData.displayName || 'Travel Explorer',
    display_name: userData.displayName || userData.fullName || 'Travel Explorer',
    photo_url: userData.photoURL || null,
    phone_number: userData.phoneNumber || userData.phone || null,
    travel_style: userData.travelStyle || userData.preferredTravelStyle || 'Balanced Explorer',
    role: userData.role || (userData.email === 'sivashirish09@gmail.com' ? 'Admin' : 'User'),
    updated_at: new Date().toISOString()
  };

  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' })
      .select()
      .maybeSingle();

    if (error) {
      console.warn('Supabase syncProfile notice (table may need creation via supabase-schema.sql):', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase syncProfile exception:', err.message);
    return null;
  }
};

/**
 * Fetch user profile from Supabase
 */
export const getSupabaseProfile = async (uid) => {
  if (!uid) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (err) {
    return null;
  }
};

/**
 * Fetch all profiles (for Admin Analytics)
 */
export const getAllSupabaseProfiles = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    return [];
  }
};

// -------------------------------------------------------------------------
// 2. BOOKINGS
// -------------------------------------------------------------------------

/**
 * Fetch bookings for a user from Supabase
 */
export const getSupabaseBookings = async (userId) => {
  if (!userId) return [];
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    return [];
  }
};

/**
 * Insert new booking into Supabase
 */
export const insertSupabaseBooking = async (bookingData) => {
  try {
    const payload = {
      id: bookingData.id || `booking_${Date.now()}`,
      user_id: bookingData.userId || null,
      booking_reference: bookingData.booking_reference,
      destination_id: bookingData.destination_id || null,
      destination_name: bookingData.destination_name || 'Trip',
      source_city: bookingData.source_city || 'Home City',
      hotel_name: bookingData.hotel_or_resort_name || bookingData.hotel_name || 'Stay',
      hotel_or_resort_name: bookingData.hotel_or_resort_name || 'Stay',
      check_in_date: bookingData.check_in_date || null,
      check_out_date: bookingData.check_out_date || null,
      nights: bookingData.nights || 1,
      guests: bookingData.guests || 1,
      total_amount_inr: bookingData.total_amount_inr || 0,
      status: bookingData.status || 'CONFIRMED',
      payment_status: bookingData.payment_status || 'PAID',
      payment_method: bookingData.payment_method || 'UPI / Card',
      qr_code_url: bookingData.qr_code_url || null,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('bookings')
      .insert([payload])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase insertBooking notice:', err.message);
    return null;
  }
};

/**
 * Cancel a booking in Supabase
 */
export const cancelSupabaseBooking = async (bookingId, reason) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('bookings')
      .update({
        status: 'CANCELLED',
        cancellation_date: todayStr,
        cancellation_reason: reason,
        refund_status: '100% Full Refund Initiated — Credited in 2-3 Business Days',
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingId)
      .select();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase cancelBooking notice:', err.message);
    return null;
  }
};

// -------------------------------------------------------------------------
// 3. TRAVEL MEMORIES
// -------------------------------------------------------------------------

/**
 * Fetch memories for user from Supabase
 */
export const getSupabaseMemories = async (userId) => {
  try {
    let query = supabase.from('memories').select('*').order('created_at', { ascending: false });
    if (userId) {
      query = query.eq('user_id', userId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (err) {
    return [];
  }
};

/**
 * Insert travel memory into Supabase
 */
export const insertSupabaseMemory = async (memData) => {
  try {
    const payload = {
      id: memData.id || `mem_${Date.now()}`,
      user_id: memData.userId || null,
      title: memData.title,
      destination: memData.destination,
      date: memData.date || new Date().toISOString().split('T')[0],
      image_url: memData.imageUrl || memData.image_url,
      journal: memData.journal || '',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('memories')
      .insert([payload])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn('Supabase insertMemory notice:', err.message);
    return null;
  }
};

/**
 * Delete memory from Supabase
 */
export const deleteSupabaseMemory = async (memId) => {
  try {
    const { error } = await supabase.from('memories').delete().eq('id', memId);
    if (error) throw error;
    return true;
  } catch (err) {
    return false;
  }
};

// -------------------------------------------------------------------------
// 4. NOTIFICATIONS
// -------------------------------------------------------------------------

/**
 * Fetch user notifications from Supabase
 */
export const getSupabaseNotifications = async (userId) => {
  if (!userId) return [];
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (err) {
    return [];
  }
};

/**
 * Insert notification into Supabase
 */
export const insertSupabaseNotification = async (notifData) => {
  try {
    const payload = {
      id: notifData.id || `notif_${Date.now()}`,
      user_id: notifData.userId || null,
      type: notifData.type || 'general',
      category: notifData.category || 'Travel Update',
      title: notifData.title,
      description: notifData.description || '',
      message: notifData.description || notifData.message || '',
      booking_id: notifData.bookingId || null,
      is_read: false,
      date: notifData.date || new Date().toISOString().split('T')[0],
      time: notifData.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      time_category: notifData.timeCategory || 'Today',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('notifications')
      .insert([payload])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (err) {
    return null;
  }
};

/**
 * Mark notification as read
 */
export const markSupabaseNotificationRead = async (notifId) => {
  try {
    await supabase.from('notifications').update({ is_read: true }).eq('id', notifId);
  } catch (e) {}
};

// -------------------------------------------------------------------------
// 5. LOGIN AUDIT & SESSION LOGS
// -------------------------------------------------------------------------

/**
 * Record login audit log in Supabase `login_history` table
 */
export const recordSupabaseLoginHistory = async (loginData) => {
  try {
    const payload = {
      id: loginData.id || `log_${Date.now()}`,
      user_id: loginData.userId || null,
      user_name: loginData.userName || 'Traveler',
      email: loginData.email,
      login_time: loginData.loginTime || new Date().toISOString(),
      device: loginData.device || 'Desktop',
      browser: loginData.browser || 'Chrome',
      operating_system: loginData.operatingSystem || 'Windows',
      ip_address: loginData.ipAddress || '103.211.54.42',
      location: loginData.location || 'India',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('login_history')
      .insert([payload])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (err) {
    return null;
  }
};

/**
 * Fetch login history from Supabase
 */
export const getSupabaseLoginHistory = async () => {
  try {
    const { data, error } = await supabase
      .from('login_history')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  } catch (err) {
    return [];
  }
};

// -------------------------------------------------------------------------
// 6. PAYMENTS
// -------------------------------------------------------------------------

/**
 * Save payment in Supabase `payments` table
 */
export const insertSupabasePayment = async (paymentData) => {
  try {
    const payload = {
      id: paymentData.paymentId || `PAY-${Date.now()}`,
      user_id: paymentData.userId || null,
      user_name: paymentData.userName || 'Guest Traveler',
      user_email: paymentData.userEmail || '',
      booking_id: paymentData.bookingId || null,
      amount: paymentData.amount || 0,
      payment_method: paymentData.paymentMethod || 'UPI / QR Code',
      transaction_id: paymentData.transactionId || `TXN-TN-${Date.now()}`,
      payment_status: paymentData.paymentStatus || 'SUCCESS',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('payments')
      .insert([payload])
      .select()
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (err) {
    return null;
  }
};
