package com.example.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.data.*
import com.example.ui.MainViewModel
import com.example.ui.components.PackingChecklistComponent

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HubScreen(
    viewModel: MainViewModel,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current

    // State Flows from ViewModel
    val trips by viewModel.allTrips.collectAsState()
    val bookings by viewModel.hubBookings.collectAsState()
    val tickets by viewModel.hubTickets.collectAsState()
    val visaStatuses by viewModel.visaStatuses.collectAsState()
    val documents by viewModel.travelDocuments.collectAsState()
    val packingItems by viewModel.packingListHub.collectAsState()
    val expenses by viewModel.travelExpenses.collectAsState()
    val notes by viewModel.travelNotes.collectAsState()
    val emergencyContacts by viewModel.emergencyContacts.collectAsState()
    val timeline by viewModel.tripTimeline.collectAsState()
    val photoMemories by viewModel.photoMemories.collectAsState()
    val invoices by viewModel.tripInvoices.collectAsState()

    // Sub-Navigation Tabs inside Travel Hub
    var selectedHubCategory by remember { mutableStateOf("My Trips") }
    val hubCategories = listOf(
        "My Trips",
        "Bookings & Tickets",
        "Visas & Docs",
        "Packing & Expenses",
        "Timeline & Notes",
        "Memories & Invoices"
    )

    // Dialog / Modal States
    var showAddExpenseDialog by remember { mutableStateOf(false) }
    var showAddNoteDialog by remember { mutableStateOf(false) }
    var showAddPackingDialog by remember { mutableStateOf(false) }
    var showAddPhotoDialog by remember { mutableStateOf(false) }
    var showUploadDocDialog by remember { mutableStateOf(false) }
    var selectedTicketModal by remember { mutableStateOf<TicketItem?>(null) }
    var selectedPhotoModal by remember { mutableStateOf<PhotoMemoryItem?>(null) }
    var toastMessage by remember { mutableStateOf<String?>(null) }

    Scaffold(
        modifier = modifier.fillMaxSize()
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            // ================= HEADER =================
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        brush = Brush.verticalGradient(
                            colors = listOf(
                                Color(0xFF0F172A),
                                Color(0xFF1E293B),
                                Color(0xFF0D9488)
                            )
                        ),
                        shape = RoundedCornerShape(bottomStart = 24.dp, bottomEnd = 24.dp)
                    )
                    .statusBarsPadding()
                    .padding(20.dp)
            ) {
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = "Travel Hub 🧳",
                                fontSize = 26.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Text(
                                text = "Your trips, bookings, documents & memories in one place",
                                fontSize = 12.sp,
                                color = Color.White.copy(alpha = 0.8f)
                            )
                        }

                        // Share Trip / Export Hub Button
                        IconButton(
                            onClick = {
                                val shareIntent = Intent(Intent.ACTION_SEND).apply {
                                    type = "text/plain"
                                    putExtra(Intent.EXTRA_SUBJECT, "My Travel Hub Itinerary & Details")
                                    putExtra(Intent.EXTRA_TEXT, "Hey! Here is my Travel Hub summary. I have 2 upcoming trips booked with Japan Airlines & Granvia Hotel.")
                                }
                                context.startActivity(Intent.createChooser(shareIntent, "Share Travel Hub"))
                            },
                            modifier = Modifier
                                .background(Color.White.copy(alpha = 0.2f), CircleShape)
                                .size(40.dp)
                        ) {
                            Icon(Icons.Filled.Share, contentDescription = "Share Hub", tint = Color.White)
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // ================= CATEGORY SCROLL TABS =================
                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(hubCategories) { category ->
                            val isSelected = selectedHubCategory == category
                            FilterChip(
                                selected = isSelected,
                                onClick = { selectedHubCategory = category },
                                label = {
                                    Text(
                                        text = category,
                                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                                        fontSize = 12.sp
                                    )
                                },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = Color.White,
                                    selectedLabelColor = Color(0xFF0F172A),
                                    containerColor = Color.White.copy(alpha = 0.15f),
                                    labelColor = Color.White
                                ),
                                shape = RoundedCornerShape(12.dp)
                            )
                        }
                    }
                }
            }

            // ================= MAIN HUB CONTENT AREA =================
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 16.dp, vertical = 12.dp)
            ) {
                when (selectedHubCategory) {
                    "My Trips" -> MyTripsTab(
                        trips = trips,
                        onPlanNew = { viewModel.setTab(com.example.ui.TravelTab.AI_PLAN) }
                    )

                    "Bookings & Tickets" -> BookingsAndTicketsTab(
                        bookings = bookings,
                        tickets = tickets,
                        onViewTicket = { selectedTicketModal = it }
                    )

                    "Visas & Docs" -> VisasAndDocumentsTab(
                        visaStatuses = visaStatuses,
                        documents = documents,
                        onUploadDoc = { showUploadDocDialog = true }
                    )

                    "Packing & Expenses" -> PackingAndExpensesTab(
                        viewModel = viewModel,
                        expenses = expenses,
                        onAddExpense = { showAddExpenseDialog = true }
                    )

                    "Timeline & Notes" -> TimelineAndNotesTab(
                        timeline = timeline,
                        notes = notes,
                        emergencyContacts = emergencyContacts,
                        onAddNote = { showAddNoteDialog = true }
                    )

                    "Memories & Invoices" -> MemoriesAndInvoicesTab(
                        photoMemories = photoMemories,
                        invoices = invoices,
                        onAddPhoto = { showAddPhotoDialog = true },
                        onViewPhoto = { selectedPhotoModal = it },
                        onDownloadPdf = { invoice ->
                            toastMessage = "📄 Downloaded PDF Invoice for ${invoice.tripName} (${invoice.invoiceNumber})"
                        },
                        onShareTrip = {
                            val shareIntent = Intent(Intent.ACTION_SEND).apply {
                                type = "text/plain"
                                putExtra(Intent.EXTRA_SUBJECT, "Check out my Travel Memories")
                                putExtra(Intent.EXTRA_TEXT, "Shared from Travel Hub: Japan Autumn Cultural Expedition!")
                            }
                            context.startActivity(Intent.createChooser(shareIntent, "Share Trip Memories"))
                        }
                    )
                }
            }
        }

        // ================= MODALS & DIALOGS =================

        // Ticket QR Code View Modal
        selectedTicketModal?.let { ticket ->
            AlertDialog(
                onDismissRequest = { selectedTicketModal = null },
                title = {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Filled.ConfirmationNumber, contentDescription = null, tint = Color(0xFF0D9488))
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(ticket.passengerName, fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    }
                },
                text = {
                    Column(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Text("Ticket Number: ${ticket.ticketNumber}", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        Text("${ticket.departureLocation} ➔ ${ticket.arrivalLocation}", fontSize = 12.sp, color = Color.Gray, textAlign = TextAlign.Center)

                        Spacer(modifier = Modifier.height(16.dp))

                        AsyncImage(
                            model = ticket.qrCodeUrl,
                            contentDescription = "Boarding Pass QR",
                            modifier = Modifier.size(160.dp)
                        )

                        Spacer(modifier = Modifier.height(12.dp))
                        Text("${ticket.classType} • Seat: ${ticket.seatNumber} • ${ticket.gateOrPlatform}", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                    }
                },
                confirmButton = {
                    Button(onClick = { selectedTicketModal = null }) {
                        Text("Close Ticket")
                    }
                }
            )
        }

        // Add Expense Dialog
        if (showAddExpenseDialog) {
            AddExpenseDialog(
                onDismiss = { showAddExpenseDialog = false },
                onAdd = { title, category, amount ->
                    viewModel.addExpense(
                        TravelExpenseItem(
                            id = "e_${System.currentTimeMillis()}",
                            title = title,
                            category = category,
                            amountUSD = amount,
                            date = "Today",
                            paymentMethod = "Credit Card",
                            receiptUrl = ""
                        )
                    )
                    showAddExpenseDialog = false
                    toastMessage = "Added expense: $$amount for $title"
                }
            )
        }

        // Add Note Dialog
        if (showAddNoteDialog) {
            AddNoteDialog(
                onDismiss = { showAddNoteDialog = false },
                onAdd = { title, content, tag ->
                    viewModel.addNote(
                        TravelNoteItem(
                            id = "n_${System.currentTimeMillis()}",
                            title = title,
                            content = content,
                            date = "Today",
                            tag = tag
                        )
                    )
                    showAddNoteDialog = false
                    toastMessage = "Saved Travel Note: $title"
                }
            )
        }

        // Add Packing Item Dialog
        if (showAddPackingDialog) {
            AddPackingItemDialog(
                onDismiss = { showAddPackingDialog = false },
                onAdd = { title, category ->
                    viewModel.addHubPackingItem(title, category)
                    showAddPackingDialog = false
                    toastMessage = "Added $title to packing list"
                }
            )
        }

        // Add Photo Memory Dialog
        if (showAddPhotoDialog) {
            AddPhotoMemoryDialog(
                onDismiss = { showAddPhotoDialog = false },
                onAdd = { caption, location, url ->
                    viewModel.addPhotoMemory(
                        PhotoMemoryItem(
                            id = "ph_${System.currentTimeMillis()}",
                            tripId = "tr1",
                            caption = caption,
                            photoUrl = if (url.isBlank()) "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80" else url,
                            location = location,
                            date = "Just now",
                            likesCount = 1
                        )
                    )
                    showAddPhotoDialog = false
                    toastMessage = "Added memory to Photo Gallery!"
                }
            )
        }

        // Upload Document Dialog
        if (showUploadDocDialog) {
            UploadDocumentDialog(
                onDismiss = { showUploadDocDialog = false },
                onUpload = { title, category, number ->
                    viewModel.addTravelDocument(
                        TravelDocumentItem(
                            id = "d_${System.currentTimeMillis()}",
                            title = title,
                            category = category,
                            docNumber = number,
                            expiryDate = "Dec 2028",
                            fileUrl = "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
                            isVerified = true
                        )
                    )
                    showUploadDocDialog = false
                    toastMessage = "Uploaded document: $title to Travel Vault"
                }
            )
        }

        // Photo Detail Fullscreen Modal
        selectedPhotoModal?.let { photo ->
            AlertDialog(
                onDismissRequest = { selectedPhotoModal = null },
                title = { Text(photo.location, fontWeight = FontWeight.Bold, fontSize = 16.sp) },
                text = {
                    Column {
                        AsyncImage(
                            model = photo.photoUrl,
                            contentDescription = photo.caption,
                            contentScale = ContentScale.Crop,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(200.dp)
                                .clip(RoundedCornerShape(12.dp))
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        Text(photo.caption, fontSize = 13.sp)
                        Text("${photo.date} • ❤️ ${photo.likesCount} likes", fontSize = 11.sp, color = Color.Gray)
                    }
                },
                confirmButton = {
                    Button(onClick = { selectedPhotoModal = null }) {
                        Text("Close")
                    }
                }
            )
        }

        // Toast Message
        toastMessage?.let { msg ->
            Snackbar(
                action = { TextButton(onClick = { toastMessage = null }) { Text("OK", color = Color.White) } },
                modifier = Modifier
                    .padding(16.dp)
            ) {
                Text(msg)
            }
        }
    }
}

// ================= TAB 1: MY TRIPS =================
@Composable
private fun MyTripsTab(
    trips: List<TripEntity>,
    onPlanNew: () -> Unit
) {
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(bottom = 80.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        // Upcoming Trips Header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Upcoming Trips (2)", fontWeight = FontWeight.Bold, fontSize = 18.sp)
            Button(
                onClick = onPlanNew,
                shape = RoundedCornerShape(10.dp),
                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
            ) {
                Icon(Icons.Filled.Add, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text("Plan New Trip", fontSize = 12.sp)
            }
        }

        // Active Trip Card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
        ) {
            Column(modifier = Modifier.padding(18.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Surface(color = MaterialTheme.colorScheme.primary, shape = RoundedCornerShape(8.dp)) {
                        Text("✈️ IN 7 DAYS", color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp))
                    }
                    Text("Oct 12 - Oct 20, 2026", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }

                Spacer(modifier = Modifier.height(10.dp))
                Text("Japan Autumn Cultural Expedition", fontWeight = FontWeight.Bold, fontSize = 17.sp)
                Text("Tokyo ➔ Kyoto ➔ Nara ➔ Osaka", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.8f))

                Spacer(modifier = Modifier.height(12.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                    Text("🏨 Hotel: Granvia Kyoto", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Text("✈️ Flight: JAL002", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
            }
        }

        // Completed Trips Section
        Text("Completed Trips (3)", fontWeight = FontWeight.Bold, fontSize = 18.sp)

        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("Amalfi Coast Cliffside Getaway", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                    Surface(color = Color(0xFF15803D), shape = RoundedCornerShape(6.dp)) {
                        Text("Completed", color = Color.White, fontSize = 10.sp, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                    }
                }
                Text("Positano & Capri, Italy • Jul 2025", fontSize = 12.sp, color = Color.Gray)
                Spacer(modifier = Modifier.height(8.dp))
                Text("7 Days • Total Expense: $2,450 USD • 12 Saved Memories", fontSize = 11.sp)
            }
        }

        // Travel Calendar Widget
        Text("Travel Calendar 📅", fontWeight = FontWeight.Bold, fontSize = 18.sp)
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("October 2026", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Spacer(modifier = Modifier.height(8.dp))
                Text("• Oct 12: Board JAL Flight JL002 @ 10:30 AM", fontSize = 12.sp)
                Text("• Oct 13: Shinkansen Bullet Train to Kyoto Station", fontSize = 12.sp)
                Text("• Oct 14: Arashiyama Bamboo Grove Guided Walk", fontSize = 12.sp)
                Text("• Oct 15: Fushimi Inari Shrine Sunset Photography", fontSize = 12.sp)
            }
        }
    }
}

// ================= TAB 2: BOOKINGS & TICKETS =================
@Composable
private fun BookingsAndTicketsTab(
    bookings: List<BookingHubItem>,
    tickets: List<TicketItem>,
    onViewTicket: (TicketItem) -> Unit
) {
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(bottom = 80.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        Text("Flight, Train & Bus Tickets 🎫", fontWeight = FontWeight.Bold, fontSize = 18.sp)

        tickets.forEach { ticket ->
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onViewTicket(ticket) },
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 3.dp)
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Surface(
                            color = if (ticket.transportType == "Flight") Color(0xFF0284C7) else Color(0xFF0D9488),
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text(
                                text = ticket.transportType.uppercase(),
                                color = Color.White,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 2.dp)
                            )
                        }
                        Spacer(modifier = Modifier.height(6.dp))
                        Text("${ticket.departureLocation} ➔ ${ticket.arrivalLocation}", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Text("Departs: ${ticket.departureTime} • Seat ${ticket.seatNumber}", fontSize = 11.sp, color = Color.Gray)
                    }

                    Column(horizontalAlignment = Alignment.End) {
                        AsyncImage(
                            model = ticket.qrCodeUrl,
                            contentDescription = "QR Code",
                            modifier = Modifier.size(50.dp)
                        )
                        Text("Tap for QR", fontSize = 10.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))
        Text("Hotel Reservations & Transport Bookings 🏨", fontWeight = FontWeight.Bold, fontSize = 18.sp)

        bookings.forEach { booking ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(booking.title, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Text("$${booking.priceUSD}", fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                    }
                    Text("${booking.provider} • Ref: ${booking.referenceCode}", fontSize = 12.sp, color = Color.Gray)
                    Spacer(modifier = Modifier.height(6.dp))
                    Text("Date: ${booking.date} • ${booking.seatOrRoom}", fontSize = 11.sp)
                }
            }
        }
    }
}

// ================= TAB 3: VISAS & DOCUMENTS =================
@Composable
private fun VisasAndDocumentsTab(
    visaStatuses: List<VisaStatusItem>,
    documents: List<TravelDocumentItem>,
    onUploadDoc: () -> Unit
) {
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(bottom = 80.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        // Visa Status Tracker
        Text("Visa Status Tracker 🛂", fontWeight = FontWeight.Bold, fontSize = 18.sp)

        visaStatuses.forEach { visa ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(visa.country, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Surface(
                            color = if (visa.status == "Approved" || visa.status == "Visa Free") Color(0xFF15803D) else Color(0xFFD97706),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text(
                                text = "✓ ${visa.status}",
                                color = Color.White,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text("${visa.visaType} • Valid until ${visa.validUntil}", fontSize = 12.sp)
                    Text("Passport Ref: ${visa.passportNumber} • Ref: ${visa.applicationRef}", fontSize = 11.sp, color = Color.Gray)
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Digital Travel Document Vault
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Travel Document Vault 🔒", fontWeight = FontWeight.Bold, fontSize = 18.sp)
            IconButton(onClick = onUploadDoc) {
                Icon(Icons.Filled.FileUpload, contentDescription = "Upload Document", tint = MaterialTheme.colorScheme.primary)
            }
        }

        documents.forEach { doc ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    AsyncImage(
                        model = doc.fileUrl,
                        contentDescription = doc.title,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .size(50.dp)
                            .clip(RoundedCornerShape(10.dp))
                    )
                    Spacer(modifier = Modifier.width(14.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(doc.title, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Text("Category: ${doc.category} • Expiry: ${doc.expiryDate}", fontSize = 11.sp, color = Color.Gray)
                    }
                    Icon(Icons.Filled.VerifiedUser, contentDescription = "Verified", tint = Color(0xFF0284C7))
                }
            }
        }
    }
}

// ================= TAB 4: PACKING & EXPENSES =================
@Composable
private fun PackingAndExpensesTab(
    viewModel: MainViewModel,
    expenses: List<TravelExpenseItem>,
    onAddExpense: () -> Unit
) {
    val scrollState = rememberScrollState()
    val totalExpenseUSD = expenses.sumOf { it.amountUSD }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(bottom = 80.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        // Interactive Persistent Packing Checklist
        PackingChecklistComponent(viewModel = viewModel)

        Spacer(modifier = Modifier.height(10.dp))

        // Expense Tracker
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text("Expense Tracker 💸", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                Text("Total Spending: $$totalExpenseUSD USD", fontSize = 13.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
            }
            Button(onClick = onAddExpense, shape = RoundedCornerShape(10.dp)) {
                Text("+ Add Expense", fontSize = 12.sp)
            }
        }

        expenses.forEach { exp ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(exp.title, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Text("${exp.category} • ${exp.date} • ${exp.paymentMethod}", fontSize = 11.sp, color = Color.Gray)
                    }
                    Text("$$${exp.amountUSD}", fontWeight = FontWeight.Bold, fontSize = 15.sp, color = MaterialTheme.colorScheme.primary)
                }
            }
        }
    }
}

// ================= TAB 5: TIMELINE & NOTES =================
@Composable
private fun TimelineAndNotesTab(
    timeline: List<TimelineItem>,
    notes: List<TravelNoteItem>,
    emergencyContacts: List<EmergencyContactItem>,
    onAddNote: () -> Unit
) {
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(bottom = 80.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        Text("Trip Timeline 🕒", fontWeight = FontWeight.Bold, fontSize = 18.sp)

        timeline.forEach { item ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Surface(color = Color(0xFF0F172A), shape = RoundedCornerShape(6.dp)) {
                            Text("Day ${item.dayNumber} • ${item.time}", color = Color.White, fontSize = 10.sp, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                        }
                        Text(item.status, fontWeight = FontWeight.Bold, fontSize = 11.sp, color = MaterialTheme.colorScheme.primary)
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(item.title, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                    Text("📍 ${item.location}", fontSize = 12.sp, color = Color.Gray)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(item.description, fontSize = 12.sp)
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Emergency Contacts
        Text("Emergency Contacts 🆘", fontWeight = FontWeight.Bold, fontSize = 18.sp)
        emergencyContacts.forEach { contact ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.errorContainer)
            ) {
                Row(
                    modifier = Modifier.padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(contact.name, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Text("${contact.relationship} • ${contact.phone}", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    }
                    Icon(Icons.Filled.Call, contentDescription = "Call Emergency", tint = MaterialTheme.colorScheme.error)
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Travel Notes
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Travel Notes 📝", fontWeight = FontWeight.Bold, fontSize = 18.sp)
            IconButton(onClick = onAddNote) {
                Icon(Icons.Filled.Add, contentDescription = "Add Note", tint = MaterialTheme.colorScheme.primary)
            }
        }

        notes.forEach { note ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text(note.title, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Text(note.content, fontSize = 12.sp, color = Color.Gray)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text("#${note.tag} • ${note.date}", fontSize = 10.sp, color = MaterialTheme.colorScheme.primary)
                }
            }
        }
    }
}

// ================= TAB 6: MEMORIES & INVOICES =================
@Composable
private fun MemoriesAndInvoicesTab(
    photoMemories: List<PhotoMemoryItem>,
    invoices: List<TripInvoiceItem>,
    onAddPhoto: () -> Unit,
    onViewPhoto: (PhotoMemoryItem) -> Unit,
    onDownloadPdf: (TripInvoiceItem) -> Unit,
    onShareTrip: () -> Unit
) {
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(bottom = 80.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        // Photo Gallery
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Travel Memories (Photo Gallery) 📸", fontWeight = FontWeight.Bold, fontSize = 18.sp)
            IconButton(onClick = onAddPhoto) {
                Icon(Icons.Filled.AddAPhoto, contentDescription = "Add Photo", tint = MaterialTheme.colorScheme.primary)
            }
        }

        LazyRow(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            items(photoMemories) { photo ->
                Card(
                    modifier = Modifier
                        .width(200.dp)
                        .clickable { onViewPhoto(photo) },
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Column {
                        AsyncImage(
                            model = photo.photoUrl,
                            contentDescription = photo.caption,
                            contentScale = ContentScale.Crop,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(120.dp)
                        )
                        Column(modifier = Modifier.padding(10.dp)) {
                            Text(photo.caption, fontWeight = FontWeight.Bold, fontSize = 12.sp, maxLines = 1, overflow = TextOverflow.Ellipsis)
                            Text(photo.location, fontSize = 10.sp, color = Color.Gray)
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(10.dp))

        // Trip Invoices & Export
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text("Invoices & PDF Export 📄", fontWeight = FontWeight.Bold, fontSize = 18.sp)
            OutlinedButton(onClick = onShareTrip) {
                Icon(Icons.Filled.Share, contentDescription = null, modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text("Share Trip", fontSize = 12.sp)
            }
        }

        invoices.forEach { invoice ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column {
                            Text(invoice.tripName, fontWeight = FontWeight.Bold, fontSize = 15.sp)
                            Text("Invoice: ${invoice.invoiceNumber} • ${invoice.issueDate}", fontSize = 11.sp, color = Color.Gray)
                        }
                        Text("$$${invoice.totalAmountUSD}", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = MaterialTheme.colorScheme.primary)
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    invoice.items.forEach { line ->
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("• ${line.description}", fontSize = 12.sp)
                            Text("$$${line.amountUSD}", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    Button(
                        onClick = { onDownloadPdf(invoice) },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Icon(Icons.Filled.PictureAsPdf, contentDescription = "Download PDF")
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Download Official PDF Invoice")
                    }
                }
            }
        }
    }
}

// ================= HELPER DIALOGS =================

@Composable
private fun AddExpenseDialog(
    onDismiss: () -> Unit,
    onAdd: (String, String, Double) -> Unit
) {
    var title by remember { mutableStateOf("") }
    var category by remember { mutableStateOf("Food") }
    var amountText by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Record Travel Expense 💸") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("Description (e.g. Dinner in Kyoto)") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = amountText,
                    onValueChange = { amountText = it },
                    label = { Text("Amount ($ USD)") },
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val amount = amountText.toDoubleOrNull() ?: 0.0
                    if (title.isNotBlank() && amount > 0) {
                        onAdd(title, category, amount)
                    }
                }
            ) {
                Text("Add Expense")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel") }
        }
    )
}

@Composable
private fun AddNoteDialog(
    onDismiss: () -> Unit,
    onAdd: (String, String, String) -> Unit
) {
    var title by remember { mutableStateOf("") }
    var content by remember { mutableStateOf("") }
    var tag by remember { mutableStateOf("Guide") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("New Travel Note 📝") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("Title") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = content,
                    onValueChange = { content = it },
                    label = { Text("Notes / Reminders") },
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (title.isNotBlank()) {
                        onAdd(title, content, tag)
                    }
                }
            ) {
                Text("Save Note")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel") }
        }
    )
}

@Composable
private fun AddPackingItemDialog(
    onDismiss: () -> Unit,
    onAdd: (String, String) -> Unit
) {
    var title by remember { mutableStateOf("") }
    var category by remember { mutableStateOf("Essentials") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Add Packing Item 🎒") },
        text = {
            OutlinedTextField(
                value = title,
                onValueChange = { title = it },
                label = { Text("Item Name (e.g. Swimming Goggles)") },
                modifier = Modifier.fillMaxWidth()
            )
        },
        confirmButton = {
            Button(
                onClick = {
                    if (title.isNotBlank()) {
                        onAdd(title, category)
                    }
                }
            ) {
                Text("Add Item")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel") }
        }
    )
}

@Composable
private fun AddPhotoMemoryDialog(
    onDismiss: () -> Unit,
    onAdd: (String, String, String) -> Unit
) {
    var caption by remember { mutableStateOf("") }
    var location by remember { mutableStateOf("") }
    var url by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Add Photo Memory 📸") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedTextField(
                    value = caption,
                    onValueChange = { caption = it },
                    label = { Text("Caption") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = location,
                    onValueChange = { location = it },
                    label = { Text("Location (e.g. Kyoto, Japan)") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = url,
                    onValueChange = { url = it },
                    label = { Text("Image URL (Optional)") },
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (caption.isNotBlank()) {
                        onAdd(caption, if (location.isBlank()) "Kyoto, Japan" else location, url)
                    }
                }
            ) {
                Text("Post Memory")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel") }
        }
    )
}

@Composable
private fun UploadDocumentDialog(
    onDismiss: () -> Unit,
    onUpload: (String, String, String) -> Unit
) {
    var title by remember { mutableStateOf("") }
    var category by remember { mutableStateOf("Passport") }
    var docNumber by remember { mutableStateOf("") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Upload Travel Document 🔒") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("Document Title (e.g. Drivers License)") },
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = docNumber,
                    onValueChange = { docNumber = it },
                    label = { Text("Document Ref / ID Number") },
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (title.isNotBlank()) {
                        onUpload(title, category, docNumber)
                    }
                }
            ) {
                Text("Upload Document")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel") }
        }
    )
}
