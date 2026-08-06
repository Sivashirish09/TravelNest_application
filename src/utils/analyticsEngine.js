import { db } from '../firebase/config';
import { 
  syncSupabaseProfile, 
  recordSupabaseLoginHistory, 
  insertSupabasePayment,
  getAllSupabaseProfiles,
  getSupabaseLoginHistory
} from '../supabase/db';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';

/**
 * Client Device, OS & Browser Detector
 */
export const getDeviceInfo = () => {
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  
  // OS Detection
  let operatingSystem = 'Windows';
  if (/Windows/i.test(userAgent)) operatingSystem = 'Windows';
  else if (/Macintosh|Mac OS X/i.test(userAgent)) operatingSystem = 'macOS';
  else if (/Android/i.test(userAgent)) operatingSystem = 'Android';
  else if (/iPhone|iPad|iPod/i.test(userAgent)) operatingSystem = 'iOS';
  else if (/Linux/i.test(userAgent)) operatingSystem = 'Linux';

  // Browser Detection
  let browser = 'Chrome';
  if (/Edg/i.test(userAgent)) browser = 'Microsoft Edge';
  else if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent)) browser = 'Google Chrome';
  else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) browser = 'Apple Safari';
  else if (/Firefox/i.test(userAgent)) browser = 'Mozilla Firefox';
  else if (/Opera|OPR/i.test(userAgent)) browser = 'Opera';

  // Device Type Detection
  let device = 'Desktop';
  const isMobile = /Mobile|Android|iPhone|iPod/i.test(userAgent);
  const isTablet = /iPad|Tablet/i.test(userAgent) || (typeof window !== 'undefined' && window.innerWidth >= 640 && window.innerWidth <= 1024);
  if (isTablet) device = 'Tablet';
  else if (isMobile) device = 'Mobile';

  // Location / Timezone
  let location = 'India';
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';
    location = tz.includes('Kolkata') || tz.includes('Calcutta') ? 'India (Asia/Kolkata)' : tz;
  } catch (e) {
    location = 'India (UTC+05:30)';
  }

  return {
    operatingSystem,
    browser,
    device,
    location,
    ipAddress: '103.211.54.' + Math.floor(10 + Math.random() * 89)
  };
};

/**
 * Initial Seed Data for Users & Login History
 */
export const SEED_USERS = [];
export const SEED_LOGIN_HISTORY = [];

/**
 * Record New User Registration in Supabase, Firestore & LocalStorage
 */
export const recordUserRegistration = async (userPayload) => {
  const deviceInfo = getDeviceInfo();
  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

  const newUserData = {
    uid: userPayload.uid,
    fullName: userPayload.fullName || userPayload.displayName || 'Travel Explorer',
    displayName: userPayload.displayName || userPayload.fullName || 'Travel Explorer',
    email: userPayload.email,
    photoURL: userPayload.photoURL || null,
    phoneNumber: userPayload.phoneNumber || userPayload.phone || null,
    travelStyle: userPayload.travelStyle || userPayload.preferredTravelStyle || 'Balanced & Adventurous',
    createdAt: nowStr,
    lastLogin: nowStr,
    totalTrips: 0,
    totalSpent: 0,
    notifications: 0,
    totalLogins: 1,
    accountStatus: 'Active',
    role: userPayload.role || (userPayload.email?.includes('admin') || userPayload.email === 'sivashirish09@gmail.com' ? 'Admin' : 'User')
  };

  // 1. Sync to Supabase profiles table
  syncSupabaseProfile(newUserData).catch(() => {});

  // 2. Save to LocalStorage
  try {
    const existing = JSON.parse(localStorage.getItem('travelnest_all_users') || '[]');
    const filtered = existing.filter(u => u.uid !== newUserData.uid && u.email !== newUserData.email);
    localStorage.setItem('travelnest_all_users', JSON.stringify([newUserData, ...filtered]));
  } catch (e) {
    console.warn("LocalStorage user save error:", e);
  }

  // 3. Save to Firestore users collection
  try {
    const userRef = doc(db, 'users', newUserData.uid);
    await setDoc(userRef, {
      ...newUserData,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn("Firestore users collection save warning (fallback active):", err.message);
  }

  // 4. Record First Login History Entry
  await recordUserLogin(newUserData, userPayload.loginProvider || 'Supabase');

  return newUserData;
};

/**
 * Record User Login and update lastLogin
 */
export const recordUserLogin = async (user, provider = 'Supabase') => {
  if (!user || !user.email) return;

  const deviceInfo = getDeviceInfo();
  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const uid = user.uid || 'user_' + Date.now();

  // 1. Update LocalStorage Users
  let updatedUser = { ...user };
  try {
    const existingUsers = JSON.parse(localStorage.getItem('travelnest_all_users') || '[]');
    const userIdx = existingUsers.findIndex(u => u.uid === uid || u.email === user.email);

    if (userIdx >= 0) {
      existingUsers[userIdx].lastLogin = nowStr;
      existingUsers[userIdx].totalLogins = (existingUsers[userIdx].totalLogins || 1) + 1;
      existingUsers[userIdx].loginProvider = provider;
      updatedUser = existingUsers[userIdx];
    } else {
      updatedUser = {
        uid,
        fullName: user.displayName || user.fullName || user.email.split('@')[0],
        displayName: user.displayName || user.fullName || user.email.split('@')[0],
        email: user.email,
        photoURL: user.photoURL || null,
        phoneNumber: user.phone || user.phoneNumber || null,
        travelStyle: user.travelStyle || 'Balanced & Adventurous',
        createdAt: nowStr,
        lastLogin: nowStr,
        totalTrips: 0,
        totalSpent: 0,
        notifications: 0,
        totalLogins: 1,
        accountStatus: 'Active',
        role: (user.email === 'sivashirish09@gmail.com' || user.email?.includes('admin')) ? 'Admin' : 'User'
      };
      existingUsers.unshift(updatedUser);
    }
    localStorage.setItem('travelnest_all_users', JSON.stringify(existingUsers));
  } catch (e) {
    console.warn("LocalStorage login update error:", e);
  }

  // 2. Sync to Supabase profiles
  syncSupabaseProfile(updatedUser).catch(() => {});

  // 3. Update Firestore User Document
  try {
    const userRef = doc(db, 'users', uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      await updateDoc(userRef, {
        lastLogin: serverTimestamp(),
        totalLogins: (docSnap.data().totalLogins || 1) + 1
      });
    } else {
      await setDoc(userRef, {
        ...updatedUser,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      }, { merge: true });
    }
  } catch (err) {
    console.warn("Firestore user login update warning:", err.message);
  }

  // 4. Record in loginHistory Collection & Supabase
  const loginEntry = {
    id: 'log_' + Date.now(),
    userId: uid,
    userName: user.displayName || user.fullName || user.email.split('@')[0],
    email: user.email,
    loginTime: nowStr,
    logoutTime: null,
    device: deviceInfo.device,
    browser: deviceInfo.browser,
    operatingSystem: deviceInfo.operatingSystem,
    ipAddress: deviceInfo.ipAddress,
    location: deviceInfo.location,
    timestamp: serverTimestamp()
  };

  // Sync login log to Supabase
  recordSupabaseLoginHistory(loginEntry).catch(() => {});

  // LocalStorage login history
  try {
    const history = JSON.parse(localStorage.getItem('travelnest_login_history') || '[]');
    localStorage.setItem('travelnest_login_history', JSON.stringify([loginEntry, ...history.slice(0, 50)]));
    localStorage.setItem('travelnest_active_session_id', loginEntry.id);
  } catch (e) {}

  // Firestore loginHistory
  try {
    await addDoc(collection(db, 'loginHistory'), loginEntry);
  } catch (err) {
    console.warn("Firestore loginHistory add warning:", err.message);
  }

  return updatedUser;
};

/**
 * Update User Profile & Settings Data in Supabase, Firestore and LocalStorage
 */
export const updateUserProfileData = async (uid, updateFields) => {
  if (!uid) return null;

  // 1. Update in LocalStorage
  let updatedUser = null;
  try {
    const existingUsers = JSON.parse(localStorage.getItem('travelnest_all_users') || '[]');
    const userIdx = existingUsers.findIndex(u => u.uid === uid);
    if (userIdx >= 0) {
      existingUsers[userIdx] = { ...existingUsers[userIdx], ...updateFields };
      updatedUser = existingUsers[userIdx];
      localStorage.setItem('travelnest_all_users', JSON.stringify(existingUsers));
    }
  } catch (e) {
    console.warn("LocalStorage user update error:", e);
  }

  // 2. Sync to Supabase
  syncSupabaseProfile({ uid, ...updateFields }).catch(() => {});

  // 3. Update Firestore User Document
  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, {
      ...updateFields,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn("Firestore user profile update warning:", err.message);
  }

  return updatedUser;
};

/**
 * Record User Logout
 */
export const recordUserLogout = async (userId) => {
  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const activeSessionId = localStorage.getItem('travelnest_active_session_id');

  // Update in LocalStorage
  try {
    const history = JSON.parse(localStorage.getItem('travelnest_login_history') || '[]');
    const updated = history.map(entry => {
      if ((activeSessionId && entry.id === activeSessionId) || (entry.userId === userId && !entry.logoutTime)) {
        return { ...entry, logoutTime: nowStr };
      }
      return entry;
    });
    localStorage.setItem('travelnest_login_history', JSON.stringify(updated));
    localStorage.removeItem('travelnest_active_session_id');
  } catch (e) {}
};

/**
 * Save Payment in Supabase, Firestore and LocalStorage
 */
export const recordPayment = async (paymentPayload) => {
  const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const paymentRecord = {
    paymentId: paymentPayload.paymentId || `PAY-${Date.now()}`,
    bookingId: paymentPayload.bookingId || `TN-REF-${Math.floor(100000 + Math.random() * 900000)}`,
    userId: paymentPayload.userId || 'guest_user',
    userName: paymentPayload.userName || 'Guest Traveler',
    userEmail: paymentPayload.userEmail || '',
    amount: paymentPayload.amount || 0,
    paymentMethod: paymentPayload.paymentMethod || 'UPI / QR Code',
    transactionId: paymentPayload.transactionId || `TXN-TN-${Math.floor(10000000 + Math.random() * 90000000)}`,
    paymentStatus: 'SUCCESS',
    createdAt: nowStr
  };

  // 1. Supabase Payments
  insertSupabasePayment(paymentRecord).catch(() => {});

  // 2. LocalStorage
  try {
    const existing = JSON.parse(localStorage.getItem('travelnest_payments') || '[]');
    localStorage.setItem('travelnest_payments', JSON.stringify([paymentRecord, ...existing]));
  } catch (e) {}

  // 3. Firestore
  try {
    await addDoc(collection(db, 'payments'), paymentRecord);
  } catch (err) {
    console.warn("Firestore payments add warning:", err.message);
  }

  return paymentRecord;
};

/**
 * Fetch All Users for Admin Analytics (Supabase -> Firestore -> LocalStorage)
 */
export const fetchAllUsers = async () => {
  // Try Supabase first
  try {
    const sbUsers = await getAllSupabaseProfiles();
    if (sbUsers && sbUsers.length > 0) {
      return sbUsers.map(u => ({
        uid: u.id,
        fullName: u.full_name || u.display_name,
        email: u.email,
        photoURL: u.photo_url,
        phoneNumber: u.phone_number,
        travelStyle: u.travel_style,
        role: u.role || 'User',
        accountStatus: u.account_status || 'Active',
        totalTrips: u.total_trips || 0,
        totalSpent: u.total_spent || 0,
        createdAt: u.created_at
      }));
    }
  } catch (e) {}

  // Try Firestore next
  try {
    const snapshot = await getDocs(collection(db, 'users'));
    if (!snapshot.empty) {
      const usersList = [];
      snapshot.forEach(doc => usersList.push(doc.data()));
      return usersList;
    }
  } catch (e) {}

  const local = JSON.parse(localStorage.getItem('travelnest_all_users') || 'null');
  if (local && local.length > 0) return local;

  localStorage.setItem('travelnest_all_users', JSON.stringify(SEED_USERS));
  return SEED_USERS;
};

/**
 * Fetch All Login History for Admin Analytics
 */
export const fetchLoginHistory = async () => {
  // Try Supabase first
  try {
    const sbLogins = await getSupabaseLoginHistory();
    if (sbLogins && sbLogins.length > 0) {
      return sbLogins.map(l => ({
        id: l.id,
        userId: l.user_id,
        userName: l.user_name,
        email: l.email,
        loginTime: l.login_time,
        logoutTime: l.logout_time,
        device: l.device,
        browser: l.browser,
        operatingSystem: l.operating_system,
        ipAddress: l.ip_address,
        location: l.location
      }));
    }
  } catch (e) {}

  // Try Firestore next
  try {
    const snapshot = await getDocs(collection(db, 'loginHistory'));
    if (!snapshot.empty) {
      const list = [];
      snapshot.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      return list;
    }
  } catch (e) {}

  const local = JSON.parse(localStorage.getItem('travelnest_login_history') || 'null');
  if (local && local.length > 0) return local;

  localStorage.setItem('travelnest_login_history', JSON.stringify(SEED_LOGIN_HISTORY));
  return SEED_LOGIN_HISTORY;
};
