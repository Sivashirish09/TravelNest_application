package com.example.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.ui.MainViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    viewModel: MainViewModel,
    modifier: Modifier = Modifier
) {
    val userProfile by viewModel.userProfile.collectAsState()
    val scrollState = rememberScrollState()

    // Dialog state controllers
    var showEditProfileDialog by remember { mutableStateOf(false) }
    var showCurrencyDialog by remember { mutableStateOf(false) }
    var showChangePasswordDialog by remember { mutableStateOf(false) }
    var showDeleteAccountDialog by remember { mutableStateOf(false) }
    var showHelpCenterDialog by remember { mutableStateOf(false) }
    var showAboutDialog by remember { mutableStateOf(false) }
    var showPrivacyDialog by remember { mutableStateOf(false) }
    var showTermsDialog by remember { mutableStateOf(false) }
    var snackbarMessage by remember { mutableStateOf<String?>(null) }

    Scaffold(
        modifier = modifier.fillMaxSize()
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(scrollState)
                .padding(bottom = 90.dp)
        ) {
            // ================= TOP USER HEADER =================
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.primaryContainer)
                    .statusBarsPadding()
                    .padding(20.dp)
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Box(contentAlignment = Alignment.BottomEnd) {
                        AsyncImage(
                            model = userProfile.photo,
                            contentDescription = "Profile Picture",
                            contentScale = ContentScale.Crop,
                            modifier = Modifier
                                .size(90.dp)
                                .clip(CircleShape)
                                .background(MaterialTheme.colorScheme.primary)
                        )
                        IconButton(
                            onClick = { showEditProfileDialog = true },
                            modifier = Modifier
                                .size(32.dp)
                                .clip(CircleShape)
                                .background(MaterialTheme.colorScheme.primary)
                        ) {
                            Icon(
                                Icons.Filled.Edit,
                                contentDescription = "Edit Profile Picture",
                                tint = Color.White,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = userProfile.name,
                        fontSize = 22.sp,
                        fontWeight = FontWeight.Bold
                    )

                    Text(
                        text = userProfile.email,
                        fontSize = 13.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                    )

                    Text(
                        text = "📍 San Francisco, CA • ${userProfile.phone}",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )

                    Spacer(modifier = Modifier.height(10.dp))

                    OutlinedButton(
                        onClick = { showEditProfileDialog = true },
                        shape = RoundedCornerShape(20.dp),
                        modifier = Modifier.testTag("edit_profile_button")
                    ) {
                        Icon(Icons.Filled.Person, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Edit Profile & Preferences", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // ================= MY BOOKINGS DASHBOARD =================
            MyBookingsSection(
                viewModel = viewModel,
                onShowSnackbar = { snackbarMessage = it }
            )

            Spacer(modifier = Modifier.height(24.dp))

            // ================= BADGES & ACHIEVEMENTS =================
            Text(
                text = "Achievements & Badges 🏆",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(horizontal = 20.dp)
            )

            Spacer(modifier = Modifier.height(10.dp))

            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                val badges = listOf(
                    "Globe Trotter 🧭",
                    "Elite Explorer 🏆",
                    "AI Adventurer ✨",
                    "Veteran Explorer 🌟",
                    "Culture Enthusiast ⛩️"
                )
                items(badges) { badge ->
                    Surface(
                        color = MaterialTheme.colorScheme.primary.copy(alpha = 0.12f),
                        shape = RoundedCornerShape(14.dp),
                        border = androidx.compose.foundation.BorderStroke(1.dp, MaterialTheme.colorScheme.primary.copy(alpha = 0.3f))
                    ) {
                        Text(
                            text = badge,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.padding(horizontal = 14.dp, vertical = 8.dp)
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // ================= TRAVEL HISTORY & MILESTONES =================
            Text(
                text = "Travel History & Stats 📊",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(horizontal = 20.dp)
            )

            Spacer(modifier = Modifier.height(12.dp))

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                StatCard(number = "5", label = "Total Trips", icon = Icons.Filled.Flight, modifier = Modifier.weight(1f))
                StatCard(number = "3", label = "Completed", icon = Icons.Filled.CheckCircle, modifier = Modifier.weight(1f))
                StatCard(number = "2", label = "Upcoming", icon = Icons.Filled.CalendarMonth, modifier = Modifier.weight(1f))
                StatCard(number = "${userProfile.favorites.size}", label = "Favorite Places", icon = Icons.Filled.Favorite, modifier = Modifier.weight(1f))
            }

            Spacer(modifier = Modifier.height(24.dp))

            // ================= FIRESTORE ACCOUNT & SECURITY =================
            Text(
                text = "Account Security & Credentials 🔒",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(horizontal = 20.dp)
            )

            Spacer(modifier = Modifier.height(10.dp))

            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    UserDetailRow(label = "Firebase UID", value = userProfile.uid)
                    UserDetailRow(label = "Primary Phone", value = userProfile.phone)
                    UserDetailRow(label = "Account Registered", value = userProfile.createdAt.take(10))
                    UserDetailRow(label = "Last Login Session", value = userProfile.lastLogin.take(10))
                    UserDetailRow(
                        label = "Email Status",
                        value = if (userProfile.isEmailVerified) "Verified ✓" else "Unverified",
                        isHighlight = true
                    )

                    Divider(modifier = Modifier.padding(vertical = 6.dp))

                    TextButton(
                        onClick = { showChangePasswordDialog = true },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Icon(Icons.Filled.LockReset, contentDescription = null, modifier = Modifier.size(18.dp))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Change Security Password", fontWeight = FontWeight.Bold)
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // ================= PREFERENCES & SETTINGS =================
            Text(
                text = "Preferences & App Settings ⚙️",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(horizontal = 20.dp)
            )

            Spacer(modifier = Modifier.height(12.dp))

            Column(
                modifier = Modifier.padding(horizontal = 20.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                SettingsTile(
                    icon = Icons.Filled.AttachMoney,
                    title = "Preferred Currency",
                    value = "${userProfile.currencyCode} (${userProfile.currencySymbol})",
                    onClick = { showCurrencyDialog = true }
                )

                SettingsTile(
                    icon = Icons.Filled.Language,
                    title = "App Language",
                    value = userProfile.language,
                    onClick = { showEditProfileDialog = true }
                )

                SettingsTile(
                    icon = Icons.Filled.AccountBalanceWallet,
                    title = "Target Budget Tier",
                    value = userProfile.budget,
                    onClick = { showEditProfileDialog = true }
                )

                SettingsToggleTile(
                    icon = Icons.Filled.Notifications,
                    title = "Push Notifications & Itinerary Alerts",
                    checked = userProfile.notifications,
                    onCheckedChange = { viewModel.toggleNotifications() }
                )

                SettingsToggleTile(
                    icon = Icons.Filled.DarkMode,
                    title = "Dark Theme",
                    checked = userProfile.isDarkMode,
                    onCheckedChange = { viewModel.toggleDarkMode() }
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            // ================= SUPPORT, HELP & LEGAL =================
            Text(
                text = "Support, Legal & About ℹ️",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(horizontal = 20.dp)
            )

            Spacer(modifier = Modifier.height(12.dp))

            Column(
                modifier = Modifier.padding(horizontal = 20.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                SettingsTile(
                    icon = Icons.Filled.Help,
                    title = "Help Center & FAQs",
                    value = "Support",
                    onClick = { showHelpCenterDialog = true }
                )

                SettingsTile(
                    icon = Icons.Filled.Info,
                    title = "About TravelNest",
                    value = "v1.0.0 Pro",
                    onClick = { showAboutDialog = true }
                )

                SettingsTile(
                    icon = Icons.Filled.PrivacyTip,
                    title = "Privacy Policy",
                    value = "View",
                    onClick = { showPrivacyDialog = true }
                )

                SettingsTile(
                    icon = Icons.Filled.Description,
                    title = "Terms of Service",
                    value = "View",
                    onClick = { showTermsDialog = true }
                )
            }

            Spacer(modifier = Modifier.height(28.dp))

            // ================= LOGOUT & DELETE ACCOUNT =================
            Column(
                modifier = Modifier.padding(horizontal = 20.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Button(
                    onClick = { viewModel.logout() },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEF4444)),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp)
                        .testTag("logout_button")
                ) {
                    Icon(Icons.Filled.Logout, contentDescription = null, tint = Color.White)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Sign Out of TravelNest", fontWeight = FontWeight.Bold, color = Color.White)
                }

                OutlinedButton(
                    onClick = { showDeleteAccountDialog = true },
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFFDC2626)),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(Icons.Filled.DeleteForever, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Delete User Account", fontWeight = FontWeight.Bold)
                }
            }
        }

        // ================= DIALOGS & MODALS =================

        // Edit Profile Dialog
        if (showEditProfileDialog) {
            EditProfileDialog(
                userProfile = userProfile,
                onDismiss = { showEditProfileDialog = false },
                onSave = { name, phone, budget, language, photo ->
                    viewModel.updateFullUserProfile(name, phone, budget, language, photo)
                    showEditProfileDialog = false
                    snackbarMessage = "Profile updated successfully!"
                }
            )
        }

        // Change Password Dialog
        if (showChangePasswordDialog) {
            ChangePasswordDialog(
                onDismiss = { showChangePasswordDialog = false },
                onChange = {
                    showChangePasswordDialog = false
                    snackbarMessage = "Security password changed successfully!"
                }
            )
        }

        // Delete Account Dialog
        if (showDeleteAccountDialog) {
            AlertDialog(
                onDismissRequest = { showDeleteAccountDialog = false },
                title = { Text("Delete User Account?", fontWeight = FontWeight.Bold) },
                text = { Text("Are you sure you want to permanently delete your TravelNest account? All saved trips, bookings, and preferences will be removed.") },
                confirmButton = {
                    Button(
                        onClick = {
                            showDeleteAccountDialog = false
                            viewModel.logout()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFDC2626))
                    ) {
                        Text("Yes, Delete My Account", color = Color.White)
                    }
                },
                dismissButton = {
                    TextButton(onClick = { showDeleteAccountDialog = false }) {
                        Text("Cancel")
                    }
                }
            )
        }

        // Currency Selector Dialog
        if (showCurrencyDialog) {
            val currencies = listOf("USD" to "$", "EUR" to "€", "GBP" to "£", "JPY" to "¥", "INR" to "₹")
            AlertDialog(
                onDismissRequest = { showCurrencyDialog = false },
                title = { Text("Select Preferred Currency") },
                text = {
                    Column {
                        currencies.forEach { (code, symbol) ->
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable {
                                        viewModel.updateProfileCurrency(code, symbol)
                                        showCurrencyDialog = false
                                        snackbarMessage = "Currency updated to $code ($symbol)"
                                    }
                                    .padding(vertical = 12.dp),
                                horizontalArrangement = Arrangement.SpaceBetween
                            ) {
                                Text("$code ($symbol)", fontWeight = FontWeight.Bold)
                                if (userProfile.currencyCode == code) {
                                    Icon(Icons.Filled.Check, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                                }
                            }
                        }
                    }
                },
                confirmButton = {}
            )
        }

        // Help Center Dialog
        if (showHelpCenterDialog) {
            AlertDialog(
                onDismissRequest = { showHelpCenterDialog = false },
                title = { Text("TravelNest Help Center ❓", fontWeight = FontWeight.Bold) },
                text = {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text("• How do I generate an AI Trip Plan?", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Text("Go to the AI Plan tab, enter your location, destination & budget, then tap Generate Plan.", fontSize = 12.sp)

                        Text("• Where are my QR tickets stored?", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Text("Navigate to Travel Hub ➔ Bookings & Tickets to view boarding passes with QR codes.", fontSize = 12.sp)

                        Text("• Support Email: support@travelnest.ai", fontWeight = FontWeight.Bold, fontSize = 12.sp, color = MaterialTheme.colorScheme.primary)
                    }
                },
                confirmButton = {
                    Button(onClick = { showHelpCenterDialog = false }) { Text("Close") }
                }
            )
        }

        // About Dialog
        if (showAboutDialog) {
            AlertDialog(
                onDismissRequest = { showAboutDialog = false },
                title = { Text("About TravelNest Pro ✈️", fontWeight = FontWeight.Bold) },
                text = {
                    Text("TravelNest v1.0.0 Pro is an all-in-one AI Travel Concierge powered by Gemini AI, Firebase Auth, and local Room persistence. Plan itineraries, track expenses, store documents, and export PDF invoices effortlessly.")
                },
                confirmButton = {
                    Button(onClick = { showAboutDialog = false }) { Text("Got it") }
                }
            )
        }

        // Privacy Policy Dialog
        if (showPrivacyDialog) {
            AlertDialog(
                onDismissRequest = { showPrivacyDialog = false },
                title = { Text("Privacy Policy 🛡️", fontWeight = FontWeight.Bold) },
                text = {
                    Text("TravelNest respects your personal privacy. User authentication tokens and travel itineraries are securely managed using Firebase Auth and encrypted Firestore cloud storage.")
                },
                confirmButton = {
                    Button(onClick = { showPrivacyDialog = false }) { Text("Acknowledge") }
                }
            )
        }

        // Terms Dialog
        if (showTermsDialog) {
            AlertDialog(
                onDismissRequest = { showTermsDialog = false },
                title = { Text("Terms of Service 📜", fontWeight = FontWeight.Bold) },
                text = {
                    Text("By using TravelNest, you agree to our standard terms regarding AI itinerary creation, booking references, and digital travel storage.")
                },
                confirmButton = {
                    Button(onClick = { showTermsDialog = false }) { Text("I Agree") }
                }
            )
        }

        // Snackbar Toast
        snackbarMessage?.let { msg ->
            Snackbar(
                action = { TextButton(onClick = { snackbarMessage = null }) { Text("OK", color = Color.White) } },
                modifier = Modifier.padding(16.dp)
            ) {
                Text(msg)
            }
        }
    }
}

// ================= SUB-COMPONENTS & DIALOGS =================

@Composable
private fun EditProfileDialog(
    userProfile: com.example.ui.UserProfile,
    onDismiss: () -> Unit,
    onSave: (String, String, String, String, String) -> Unit
) {
    var name by remember { mutableStateOf(userProfile.name) }
    var phone by remember { mutableStateOf(userProfile.phone) }
    var budget by remember { mutableStateOf(userProfile.budget) }
    var language by remember { mutableStateOf(userProfile.language) }
    var photoUrl by remember { mutableStateOf(userProfile.photo) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Edit User Profile ✏️", fontWeight = FontWeight.Bold) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Full Name") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = phone,
                    onValueChange = { phone = it },
                    label = { Text("Phone Number") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = budget,
                    onValueChange = { budget = it },
                    label = { Text("Preferred Budget Tier") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = language,
                    onValueChange = { language = it },
                    label = { Text("Preferred Language") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = photoUrl,
                    onValueChange = { photoUrl = it },
                    label = { Text("Profile Photo URL / Firebase Storage") },
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (name.isNotBlank()) {
                        onSave(name, phone, budget, language, photoUrl)
                    }
                }
            ) {
                Text("Save Changes")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel") }
        }
    )
}

@Composable
private fun ChangePasswordDialog(
    onDismiss: () -> Unit,
    onChange: () -> Unit
) {
    var oldPass by remember { mutableStateOf("") }
    var newPass by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Change Password 🔑", fontWeight = FontWeight.Bold) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedTextField(
                    value = oldPass,
                    onValueChange = { oldPass = it },
                    label = { Text("Current Password") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = newPass,
                    onValueChange = { newPass = it },
                    label = { Text("New Security Password") },
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (oldPass.isNotBlank() && newPass.length >= 6) {
                        onChange()
                    }
                }
            ) {
                Text("Update Password")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel") }
        }
    )
}

@Composable
private fun StatCard(
    number: String,
    label: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(
            modifier = Modifier.padding(12.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(20.dp))
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = number, fontSize = 16.sp, fontWeight = FontWeight.Bold)
            Text(text = label, fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.65f))
        }
    }
}

@Composable
private fun SettingsTile(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    value: String,
    onClick: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        modifier = Modifier.clickable { onClick() }
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                Spacer(modifier = Modifier.width(12.dp))
                Text(text = title, fontWeight = FontWeight.Medium, fontSize = 14.sp)
            }
            Text(text = value, fontSize = 13.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
private fun SettingsToggleTile(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
                Spacer(modifier = Modifier.width(12.dp))
                Text(text = title, fontWeight = FontWeight.Medium, fontSize = 14.sp)
            }
            Switch(checked = checked, onCheckedChange = onCheckedChange)
        }
    }
}

@Composable
private fun UserDetailRow(
    label: String,
    value: String,
    isHighlight: Boolean = false
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 2.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = label,
            fontSize = 12.sp,
            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.65f)
        )
        Text(
            text = value,
            fontSize = 12.sp,
            fontWeight = FontWeight.Bold,
            color = if (isHighlight) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface
        )
    }
}

// ================= MY BOOKINGS SECTION & MODALS =================

@Composable
private fun MyBookingsSection(
    viewModel: MainViewModel,
    onShowSnackbar: (String) -> Unit
) {
    val bookings by viewModel.hubBookings.collectAsState()
    var selectedFilter by remember { mutableStateOf("All") }
    val filters = listOf("All", "Confirmed", "Completed", "Cancelled")

    var activeBookingDetail by remember { mutableStateOf<com.example.data.BookingHubItem?>(null) }
    var activeInvoiceBooking by remember { mutableStateOf<com.example.data.BookingHubItem?>(null) }
    var bookingToCancel by remember { mutableStateOf<com.example.data.BookingHubItem?>(null) }

    val filteredBookings = when (selectedFilter) {
        "Confirmed" -> bookings.filter { it.status == "Confirmed" || it.status == "Upcoming" }
        "Completed" -> bookings.filter { it.status == "Completed" }
        "Cancelled" -> bookings.filter { it.status == "Cancelled" }
        else -> bookings
    }

    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "My Bookings 🧳 (${bookings.size})",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "Synced with Firestore",
                fontSize = 11.sp,
                fontWeight = FontWeight.SemiBold,
                color = MaterialTheme.colorScheme.primary
            )
        }

        // Filter chips
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(filters) { filter ->
                val isSelected = filter == selectedFilter
                FilterChip(
                    selected = isSelected,
                    onClick = { selectedFilter = filter },
                    label = { Text(filter, fontSize = 12.sp, fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal) }
                )
            }
        }

        if (filteredBookings.isEmpty()) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f))
            ) {
                Column(
                    modifier = Modifier.padding(24.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(Icons.Filled.CardTravel, contentDescription = null, modifier = Modifier.size(36.dp), tint = MaterialTheme.colorScheme.primary)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("No $selectedFilter Bookings Found", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Text("Book hotels, resorts & packages from Explore or AI Plan!", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                }
            }
        } else {
            filteredBookings.forEach { booking ->
                BookingCardItem(
                    booking = booking,
                    onViewDetails = { activeBookingDetail = booking },
                    onDownloadInvoice = { activeInvoiceBooking = booking },
                    onCancelBooking = { bookingToCancel = booking },
                    onShareBooking = { onShowSnackbar("Booking details copied to clipboard! 📋") },
                    onContactHotel = { onShowSnackbar("Calling ${booking.hotelName} front desk...") }
                )
            }
        }
    }

    // Modal: View Full Booking Details & QR
    activeBookingDetail?.let { booking ->
        BookingDetailModal(
            booking = booking,
            onDismiss = { activeBookingDetail = null },
            onDownloadInvoice = {
                activeBookingDetail = null
                activeInvoiceBooking = booking
            },
            onShare = { onShowSnackbar("Trip itinerary & QR pass shared successfully!") }
        )
    }

    // Modal: Download / View Invoice
    activeInvoiceBooking?.let { booking ->
        InvoiceModal(
            booking = booking,
            onDismiss = { activeInvoiceBooking = null },
            onDownload = {
                activeInvoiceBooking = null
                onShowSnackbar("Invoice #${booking.invoiceNumber} downloaded to device! 📄")
            }
        )
    }

    // Dialog: Cancel Booking
    bookingToCancel?.let { booking ->
        AlertDialog(
            onDismissRequest = { bookingToCancel = null },
            title = { Text("Cancel Booking #${booking.referenceCode}?", fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text("Hotel / Resort: ${booking.title}", fontWeight = FontWeight.SemiBold)
                    Text("Dates: ${booking.checkInDate} to ${booking.checkOutDate}")
                    Text("Paid Amount: ₹${booking.totalAmountINR}")
                    Divider(modifier = Modifier.padding(vertical = 4.dp))
                    Text("Cancellation Policy: Free cancellation within 24h. Refund of ₹${booking.totalAmountINR} will be credited to ${booking.paymentMethod} within 3 business days.", fontSize = 12.sp, color = Color(0xFF10B981))
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.cancelHubBooking(booking.id)
                        bookingToCancel = null
                        onShowSnackbar("Booking cancelled. Refund of ₹${booking.totalAmountINR} initiated! 💸")
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEF4444))
                ) {
                    Text("Confirm Cancellation", color = Color.White)
                }
            },
            dismissButton = {
                TextButton(onClick = { bookingToCancel = null }) { Text("Keep Booking") }
            }
        )
    }
}

@Composable
private fun BookingCardItem(
    booking: com.example.data.BookingHubItem,
    onViewDetails: () -> Unit,
    onDownloadInvoice: () -> Unit,
    onCancelBooking: () -> Unit,
    onShareBooking: () -> Unit,
    onContactHotel: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(2.dp)
    ) {
        Column {
            Box(modifier = Modifier.fillMaxWidth().height(140.dp)) {
                AsyncImage(
                    model = booking.imageUrl,
                    contentDescription = booking.title,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(
                            androidx.compose.ui.graphics.Brush.verticalGradient(
                                colors = listOf(Color.Transparent, Color.Black.copy(alpha = 0.75f))
                            )
                        )
                )
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp)
                        .align(Alignment.TopCenter),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Surface(
                        color = MaterialTheme.colorScheme.primary,
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(booking.type, color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp))
                    }
                    Surface(
                        color = if (booking.status == "Cancelled") Color(0xFFEF4444) else Color(0xFF10B981),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text(booking.status, color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp))
                    }
                }
                Column(
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .padding(12.dp)
                ) {
                    Text(booking.title, color = Color.White, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                    Text("📍 ${booking.destination}", color = Color.White.copy(alpha = 0.85f), fontSize = 12.sp)
                }
            }

            Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text("Check-In ➔ Check-Out", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                        Text("${booking.checkInDate} - ${booking.checkOutDate}", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    }
                    Column(horizontalAlignment = Alignment.End) {
                        Text("Total Amount Paid", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                        Text("₹${booking.totalAmountINR}", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                    }
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("Booking ID: #${booking.referenceCode}", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                    Text("Payment: ${booking.paymentMethod}", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF10B981))
                }

                Divider(modifier = Modifier.padding(vertical = 4.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Button(
                        onClick = onViewDetails,
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(10.dp),
                        contentPadding = PaddingValues(vertical = 6.dp)
                    ) {
                        Icon(Icons.Filled.QrCode, contentDescription = null, modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Details & QR", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }

                    OutlinedButton(
                        onClick = onDownloadInvoice,
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(10.dp),
                        contentPadding = PaddingValues(vertical = 6.dp)
                    ) {
                        Icon(Icons.Filled.ReceiptLong, contentDescription = null, modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Invoice", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }

                    if (booking.status != "Cancelled") {
                        IconButton(onClick = onShareBooking) {
                            Icon(Icons.Filled.Share, contentDescription = "Share", tint = MaterialTheme.colorScheme.primary)
                        }
                        IconButton(onClick = onContactHotel) {
                            Icon(Icons.Filled.Call, contentDescription = "Contact Hotel", tint = MaterialTheme.colorScheme.primary)
                        }
                        IconButton(onClick = onCancelBooking) {
                            Icon(Icons.Filled.Cancel, contentDescription = "Cancel", tint = Color(0xFFEF4444))
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun BookingDetailModal(
    booking: com.example.data.BookingHubItem,
    onDismiss: () -> Unit,
    onDownloadInvoice: () -> Unit,
    onShare: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.SpaceBetween, modifier = Modifier.fillMaxWidth()) {
                Text("Booking #${booking.referenceCode}", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                Surface(color = Color(0xFF10B981), shape = RoundedCornerShape(6.dp)) {
                    Text(booking.status, color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                }
            }
        },
        text = {
            Column(
                modifier = Modifier.verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(10.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // QR Code
                Card(shape = RoundedCornerShape(12.dp), colors = CardDefaults.cardColors(containerColor = Color.White)) {
                    Column(modifier = Modifier.padding(12.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                        AsyncImage(
                            model = booking.qrCodeUrl,
                            contentDescription = "Pass QR Code",
                            modifier = Modifier.size(120.dp)
                        )
                        Text("Digital Pass / QR Check-In", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
                    }
                }

                Column(modifier = Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text(booking.title, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                    Text("📍 Location: ${booking.destination}", fontSize = 12.sp)
                    Text("🏨 Provider: ${booking.provider}", fontSize = 12.sp)
                    Text("🛏️ Room / Seat: ${booking.seatOrRoom}", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                    Text("📅 Check-In: ${booking.checkInDate}", fontSize = 12.sp)
                    Text("📅 Check-Out: ${booking.checkOutDate}", fontSize = 12.sp)
                    Text("👥 Guests: ${booking.numberOfGuests} Guests • ${booking.numberOfNights} Nights", fontSize = 12.sp)
                    Text("💳 Payment Method: ${booking.paymentMethod}", fontSize = 12.sp)
                    Text("💰 Total Amount Paid: ₹${booking.totalAmountINR}", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                }

                Divider()

                // Recommended Nearby Attractions
                Text("Nearby Recommendations 🌟", fontWeight = FontWeight.Bold, fontSize = 13.sp, modifier = Modifier.align(Alignment.Start))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Surface(color = MaterialTheme.colorScheme.primaryContainer, shape = RoundedCornerShape(8.dp), modifier = Modifier.weight(1f)) {
                        Text("🍽️ Top Seafood Cafe\n0.5 km away", fontSize = 10.sp, modifier = Modifier.padding(6.dp))
                    }
                    Surface(color = MaterialTheme.colorScheme.primaryContainer, shape = RoundedCornerShape(8.dp), modifier = Modifier.weight(1f)) {
                        Text("🏖️ Beach Promenade\n1.2 km away", fontSize = 10.sp, modifier = Modifier.padding(6.dp))
                    }
                }
            }
        },
        confirmButton = {
            Button(onClick = onDownloadInvoice) {
                Text("View Invoice")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Close")
            }
        }
    )
}

@Composable
private fun InvoiceModal(
    booking: com.example.data.BookingHubItem,
    onDismiss: () -> Unit,
    onDownload: () -> Unit
) {
    val roomRate = (booking.totalAmountINR * 0.75).toInt()
    val gst = (booking.totalAmountINR * 0.18).toInt()
    val serviceFee = booking.totalAmountINR - roomRate - gst

    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Column {
                Text("Tax Invoice", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                Text("Invoice No: ${booking.invoiceNumber}", fontSize = 12.sp, color = MaterialTheme.colorScheme.primary)
            }
        },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("Billed To: Siva Shirish", fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                Text("Hotel / Resort: ${booking.title}", fontSize = 12.sp)
                Text("Dates: ${booking.checkInDate} - ${booking.checkOutDate}", fontSize = 12.sp)

                Divider(modifier = Modifier.padding(vertical = 4.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Accommodation Cost (${booking.numberOfNights} Nights)", fontSize = 12.sp)
                    Text("₹$roomRate", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                }
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("GST & Taxes (18%)", fontSize = 12.sp)
                    Text("₹$gst", fontSize = 12.sp)
                }
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Service & Convenience Fee", fontSize = 12.sp)
                    Text("₹$serviceFee", fontSize = 12.sp)
                }

                Divider(modifier = Modifier.padding(vertical = 4.dp))

                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                    Text("Total Paid (INR)", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Text("₹${booking.totalAmountINR}", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = MaterialTheme.colorScheme.primary)
                }

                Text("Payment Status: PAID ✓ (${booking.paymentMethod})", fontSize = 11.sp, color = Color(0xFF10B981), fontWeight = FontWeight.Bold)
            }
        },
        confirmButton = {
            Button(onClick = onDownload) {
                Icon(Icons.Filled.Download, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text("Download PDF Invoice")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Close") }
        }
    )
}
