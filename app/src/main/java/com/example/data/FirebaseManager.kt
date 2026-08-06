package com.example.data

import android.net.Uri
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.auth.FirebaseUser
import com.google.firebase.auth.UserProfileChangeRequest
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.storage.FirebaseStorage
import kotlinx.coroutines.tasks.await
import java.util.UUID

/**
 * Centralized Manager for Firebase Services:
 * - Firebase Authentication (Email/Password, Email Verification, Password Reset)
 * - Firebase Firestore (User Profiles, Bookings, Places, Reviews)
 * - Firebase Cloud Storage (Profile Photos, Trip Documents, Hotel Images)
 */
object FirebaseManager {

    val auth: FirebaseAuth by lazy { FirebaseAuth.getInstance() }
    val firestore: FirebaseFirestore by lazy { FirebaseFirestore.getInstance() }
    val storage: FirebaseStorage by lazy { FirebaseStorage.getInstance() }

    val currentUser: FirebaseUser?
        get() = try { auth.currentUser } catch (e: Exception) { null }

    val isUserLoggedIn: Boolean
        get() = currentUser != null

    // ─────────────────────────────────────────────────────────────
    // AUTHENTICATION
    // ─────────────────────────────────────────────────────────────

    suspend fun signInWithEmail(email: String, pass: String): Result<FirebaseUser?> {
        return try {
            val result = auth.signInWithEmailAndPassword(email, pass).await()
            Result.success(result.user)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun signUpWithEmail(name: String, email: String, pass: String): Result<FirebaseUser?> {
        return try {
            val result = auth.createUserWithEmailAndPassword(email, pass).await()
            val user = result.user
            
            // Set Display Name
            user?.updateProfile(
                UserProfileChangeRequest.Builder()
                    .setDisplayName(name)
                    .build()
            )?.await()

            // Send Verification Email
            user?.sendEmailVerification()?.await()

            // Save initial User Document in Firestore
            if (user != null) {
                saveUserProfileToFirestore(
                    uid = user.uid,
                    name = name,
                    email = email,
                    photoUrl = ""
                )
            }

            Result.success(user)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun sendPasswordReset(email: String): Result<Unit> {
        return try {
            auth.sendPasswordResetEmail(email).await()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    fun signOut() {
        try {
            auth.signOut()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    // ─────────────────────────────────────────────────────────────
    // FIRESTORE DATABASE (User Data, Bookings, Places, Reviews)
    // ─────────────────────────────────────────────────────────────

    suspend fun saveUserProfileToFirestore(
        uid: String,
        name: String,
        email: String,
        photoUrl: String
    ): Result<Unit> {
        return try {
            val userMap = hashMapOf(
                "uid" to uid,
                "name" to name,
                "email" to email,
                "photoUrl" to photoUrl,
                "updatedAt" to System.currentTimeMillis()
            )
            firestore.collection("users").document(uid).set(userMap).await()
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun saveBookingToFirestore(uid: String, bookingData: Map<String, Any>): Result<String> {
        return try {
            val bookingId = "bk_" + UUID.randomUUID().toString().take(8)
            firestore.collection("users")
                .document(uid)
                .collection("bookings")
                .document(bookingId)
                .set(bookingData)
                .await()
            Result.success(bookingId)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    // ─────────────────────────────────────────────────────────────
    // CLOUD STORAGE (Images, Profile Photos, Files)
    // ─────────────────────────────────────────────────────────────

    suspend fun uploadProfilePhoto(uid: String, imageUri: Uri): Result<String> {
        return try {
            val ref = storage.reference.child("profile_photos/$uid.jpg")
            ref.putFile(imageUri).await()
            val downloadUrl = ref.downloadUrl.await().toString()

            // Update user profile in Firestore
            firestore.collection("users").document(uid).update("photoUrl", downloadUrl).await()

            Result.success(downloadUrl)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun uploadTripImage(tripId: String, imageUri: Uri): Result<String> {
        return try {
            val fileName = "trip_${tripId}_${UUID.randomUUID().toString().take(6)}.jpg"
            val ref = storage.reference.child("trip_images/$fileName")
            ref.putFile(imageUri).await()
            val downloadUrl = ref.downloadUrl.await().toString()
            Result.success(downloadUrl)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
