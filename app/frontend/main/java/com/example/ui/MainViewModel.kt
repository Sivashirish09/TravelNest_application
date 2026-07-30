package com.example.ui

import android.app.Application
import android.content.Context
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.example.ai.GeminiTripService
import com.example.data.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import org.json.JSONArray
import org.json.JSONObject

enum class TravelTab(val title: String, val route: String) {
    HOME("Home", "home"),
    EXPLORE("Explore", "explore"),
    AI_PLAN("AI Plan", "ai_plan"),
    SAVED("Saved", "saved"),
    PROFILE("Profile", "profile")
}

data class UserProfile(
    val uid: String = "usr_traveler_9918",
    val name: String = "Siva Shirish",
    val email: String = "sivashirish09@gmail.com",
    val photo: String = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
    val phone: String = "+1 (555) 234-5678",
    val createdAt: String = "2025-01-15T10:30:00Z",
    val lastLogin: String = "2026-07-29T06:18:00Z",
    val isEmailVerified: Boolean = true,
    val travelBadge: String = "Globe Trotter 🧭",
    val tripsCount: Int = 12,
    val countriesCount: Int = 8,
    val totalSavedUSD: Int = 1450,
    val currencySymbol: String = "$",
    val currencyCode: String = "USD",
    val isDarkMode: Boolean = false,
    val favorites: List<String> = listOf("Kyoto Arashiyama", "Amalfi Coast Scenic", "Swiss Alps Zermatt"),
    val bookings: List<String> = listOf("BK-8821 (Tokyo Grand Hotel)", "BK-9022 (Amalfi Coast Villa)"),
    val searchHistory: List<String> = listOf("Kyoto Cherry Blossom", "Bali Luxury Villas", "Santorini Sunset Resort"),
    val tripHistory: List<String> = listOf("Tokyo & Kyoto Cultural Tour 2024", "Paris Romantic Gateway 2025"),
    val preferences: Map<String, String> = mapOf("vibe" to "Cultural & Foodie", "stay" to "Boutique Hotel", "diet" to "Vegetarian Friendly"),
    val budget: String = "Moderate ($150-$300/day)",
    val language: String = "English (US)",
    val notifications: Boolean = true
)

class MainViewModel(application: Application) : AndroidViewModel(application) {

    private val repository: TravelRepository

    val allTrips: StateFlow<List<TripEntity>>
    val upcomingTrip: StateFlow<TripEntity?>
    val allDestinations: StateFlow<List<DestinationEntity>>
    val favoriteDestinations: StateFlow<List<DestinationEntity>>
    val allPosts: StateFlow<List<CommunityPostEntity>>

    private val _currentTab = MutableStateFlow(TravelTab.HOME)
    val currentTab: StateFlow<TravelTab> = _currentTab.asStateFlow()

    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _selectedCategory = MutableStateFlow("All")
    val selectedCategory: StateFlow<String> = _selectedCategory.asStateFlow()

    private val _userProfile = MutableStateFlow(UserProfile())
    val userProfile: StateFlow<UserProfile> = _userProfile.asStateFlow()

    // Auth States
    private val _isLoggedIn = MutableStateFlow(false)
    val isLoggedIn: StateFlow<Boolean> = _isLoggedIn.asStateFlow()

    private val _isAuthLoading = MutableStateFlow(false)
    val isAuthLoading: StateFlow<Boolean> = _isAuthLoading.asStateFlow()

    private val _authSuccessMessage = MutableStateFlow<String?>(null)
    val authSuccessMessage: StateFlow<String?> = _authSuccessMessage.asStateFlow()

    private val _authErrorMessage = MutableStateFlow<String?>(null)
    val authErrorMessage: StateFlow<String?> = _authErrorMessage.asStateFlow()

    private val _isEmailSentVerification = MutableStateFlow(false)
    val isEmailSentVerification: StateFlow<Boolean> = _isEmailSentVerification.asStateFlow()

    // AI Generation States
    private val _isGenerating = MutableStateFlow(false)
    val isGenerating: StateFlow<Boolean> = _isGenerating.asStateFlow()

    private val _aiStatusText = MutableStateFlow("Initializing AI Planner...")
    val aiStatusText: StateFlow<String> = _aiStatusText.asStateFlow()

    private val _activeGeneratedTrip = MutableStateFlow<TripEntity?>(null)
    val activeGeneratedTrip: StateFlow<TripEntity?> = _activeGeneratedTrip.asStateFlow()

    private val _selectedDestinationDetail = MutableStateFlow<DestinationEntity?>(null)
    val selectedDestinationDetail: StateFlow<DestinationEntity?> = _selectedDestinationDetail.asStateFlow()

    private val _selectedTripDetail = MutableStateFlow<TripEntity?>(null)
    val selectedTripDetail: StateFlow<TripEntity?> = _selectedTripDetail.asStateFlow()

    // Active selected trip for packing/budget sub-tabs
    private val _selectedTripIdForVault = MutableStateFlow<Long?>(null)
    val selectedTripIdForVault: StateFlow<Long?> = _selectedTripIdForVault.asStateFlow()

    val currentPackingItems: StateFlow<List<PackingItemEntity>>
    val currentBudgetItems: StateFlow<List<BudgetItemEntity>>

    // Firestore Collections State
    val firestorePlaces = MutableStateFlow(FirestoreMockData.places).asStateFlow()
    val firestoreHotels = MutableStateFlow(FirestoreMockData.hotels).asStateFlow()
    val firestoreBeaches = MutableStateFlow(FirestoreMockData.beaches).asStateFlow()
    val firestorePackages = MutableStateFlow(FirestoreMockData.packages).asStateFlow()
    val firestoreReviews = MutableStateFlow(FirestoreMockData.reviews).asStateFlow()
    val firestoreBlogs = MutableStateFlow(FirestoreMockData.blogs).asStateFlow()
    val firestoreWeather = MutableStateFlow(FirestoreMockData.weather).asStateFlow()
    val firestoreOffers = MutableStateFlow(FirestoreMockData.offers).asStateFlow()
    val firestoreFlights = MutableStateFlow(FirestoreMockData.flights).asStateFlow()
    val firestoreNews = MutableStateFlow(FirestoreMockData.travelNews).asStateFlow()
    val firestoreFestivals = MutableStateFlow(FirestoreMockData.festivals).asStateFlow()
    val firestoreRestaurants = MutableStateFlow(FirestoreMockData.restaurants).asStateFlow()
    val firestoreRoutes = MutableStateFlow(FirestoreMockData.routes).asStateFlow()
    val firestoreRatings = MutableStateFlow(FirestoreMockData.ratings).asStateFlow()
    val firestoreActivities = MutableStateFlow(FirestoreMockData.activities).asStateFlow()
    val firestoreVideos = MutableStateFlow(FirestoreMockData.videos).asStateFlow()

    // Travel Hub Collections
    private val _hubBookings = MutableStateFlow(FirestoreMockData.hubBookings)
    val hubBookings: StateFlow<List<BookingHubItem>> = _hubBookings.asStateFlow()

    private val _hubTickets = MutableStateFlow(FirestoreMockData.hubTickets)
    val hubTickets: StateFlow<List<TicketItem>> = _hubTickets.asStateFlow()

    private val _visaStatuses = MutableStateFlow(FirestoreMockData.visaStatuses)
    val visaStatuses: StateFlow<List<VisaStatusItem>> = _visaStatuses.asStateFlow()

    private val _travelDocuments = MutableStateFlow(FirestoreMockData.travelDocuments)
    val travelDocuments: StateFlow<List<TravelDocumentItem>> = _travelDocuments.asStateFlow()

    private val _packingListHub = MutableStateFlow<List<PackingHubItem>>(emptyList())
    val packingListHub: StateFlow<List<PackingHubItem>> = _packingListHub.asStateFlow()

    private val _travelExpenses = MutableStateFlow(FirestoreMockData.travelExpenses)
    val travelExpenses: StateFlow<List<TravelExpenseItem>> = _travelExpenses.asStateFlow()

    private val _travelNotes = MutableStateFlow(FirestoreMockData.travelNotes)
    val travelNotes: StateFlow<List<TravelNoteItem>> = _travelNotes.asStateFlow()

    private val _emergencyContacts = MutableStateFlow(FirestoreMockData.emergencyContacts)
    val emergencyContacts: StateFlow<List<EmergencyContactItem>> = _emergencyContacts.asStateFlow()

    private val _tripTimeline = MutableStateFlow(FirestoreMockData.tripTimeline)
    val tripTimeline: StateFlow<List<TimelineItem>> = _tripTimeline.asStateFlow()

    private val _photoMemories = MutableStateFlow(FirestoreMockData.photoMemories)
    val photoMemories: StateFlow<List<PhotoMemoryItem>> = _photoMemories.asStateFlow()

    private val _tripInvoices = MutableStateFlow(FirestoreMockData.tripInvoices)
    val tripInvoices: StateFlow<List<TripInvoiceItem>> = _tripInvoices.asStateFlow()

    // Mutators for Travel Hub
    fun addExpense(item: TravelExpenseItem) {
        _travelExpenses.value = _travelExpenses.value + item
    }

    fun addNote(note: TravelNoteItem) {
        _travelNotes.value = _travelNotes.value + note
    }

    // Persistent Packing Checklist Methods
    private fun savePackingListToPrefs(items: List<PackingHubItem>) {
        try {
            val prefs = getApplication<Application>().getSharedPreferences("packing_checklist_prefs", Context.MODE_PRIVATE)
            val jsonArray = JSONArray()
            items.forEach { item ->
                val obj = JSONObject().apply {
                    put("id", item.id)
                    put("category", item.category)
                    put("itemTitle", item.itemTitle)
                    put("isPacked", item.isPacked)
                    put("quantity", item.quantity)
                }
                jsonArray.put(obj)
            }
            prefs.edit().putString("saved_packing_items", jsonArray.toString()).apply()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    private fun loadPackingListFromPrefs(): List<PackingHubItem> {
        return try {
            val prefs = getApplication<Application>().getSharedPreferences("packing_checklist_prefs", Context.MODE_PRIVATE)
            val jsonStr = prefs.getString("saved_packing_items", null)
            if (!jsonStr.isNullOrBlank()) {
                val jsonArray = JSONArray(jsonStr)
                val list = mutableListOf<PackingHubItem>()
                for (i in 0 until jsonArray.length()) {
                    val obj = jsonArray.getJSONObject(i)
                    list.add(
                        PackingHubItem(
                            id = obj.optString("id", "p_$i"),
                            category = obj.optString("category", "Essentials"),
                            itemTitle = obj.optString("itemTitle", ""),
                            isPacked = obj.optBoolean("isPacked", false),
                            quantity = obj.optInt("quantity", 1)
                        )
                    )
                }
                if (list.isNotEmpty()) list else FirestoreMockData.packingListHub
            } else {
                FirestoreMockData.packingListHub
            }
        } catch (e: Exception) {
            FirestoreMockData.packingListHub
        }
    }

    fun toggleHubPackingItem(id: String) {
        val updated = _packingListHub.value.map {
            if (it.id == id) it.copy(isPacked = !it.isPacked) else it
        }
        _packingListHub.value = updated
        savePackingListToPrefs(updated)
    }

    fun updateHubPackingQuantity(id: String, newQuantity: Int) {
        if (newQuantity < 1) return
        val updated = _packingListHub.value.map {
            if (it.id == id) it.copy(quantity = newQuantity) else it
        }
        _packingListHub.value = updated
        savePackingListToPrefs(updated)
    }

    fun addHubPackingItem(itemTitle: String, category: String, quantity: Int = 1) {
        val newItem = PackingHubItem(
            id = "p_${System.currentTimeMillis()}",
            category = category,
            itemTitle = itemTitle,
            isPacked = false,
            quantity = quantity
        )
        val updated = _packingListHub.value + newItem
        _packingListHub.value = updated
        savePackingListToPrefs(updated)
    }

    fun deleteHubPackingItem(id: String) {
        val updated = _packingListHub.value.filter { it.id != id }
        _packingListHub.value = updated
        savePackingListToPrefs(updated)
    }

    fun resetHubPackingList() {
        val updated = _packingListHub.value.map { it.copy(isPacked = false) }
        _packingListHub.value = updated
        savePackingListToPrefs(updated)
    }

    fun clearPackedHubItems() {
        val updated = _packingListHub.value.filter { !it.isPacked }
        _packingListHub.value = updated
        savePackingListToPrefs(updated)
    }

    fun addQuickTemplateItems(templateItems: List<Pair<String, String>>) {
        val newItems = templateItems.map { (title, cat) ->
            PackingHubItem(
                id = "p_${System.currentTimeMillis()}_${(100..999).random()}",
                category = cat,
                itemTitle = title,
                isPacked = false,
                quantity = 1
            )
        }
        val updated = _packingListHub.value + newItems
        _packingListHub.value = updated
        savePackingListToPrefs(updated)
    }

    fun addTravelDocument(doc: TravelDocumentItem) {
        _travelDocuments.value = _travelDocuments.value + doc
    }

    fun addHubBooking(
        title: String,
        type: String,
        destination: String,
        provider: String,
        date: String,
        priceINR: Int,
        pnr: String = "PNR${(100000..999999).random()}",
        seatOrRoom: String = "Deluxe Room #108",
        paymentMethod: String = "Google Pay (UPI)",
        guests: Int = 2,
        imageUrl: String = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
    ) {
        val newBooking = BookingHubItem(
            id = "b_${System.currentTimeMillis()}",
            title = title,
            type = type,
            destination = destination,
            provider = provider,
            referenceCode = "REF-${(10000..99999).random()}",
            date = date,
            priceUSD = (priceINR / 83).coerceAtLeast(10),
            status = "Confirmed",
            pnr = pnr,
            seatOrRoom = seatOrRoom,
            qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BOOKING-${System.currentTimeMillis()}",
            invoiceNumber = "INV-2026-${(1000..9999).random()}",
            checkInDate = date,
            checkOutDate = "Aug 20, 2026",
            numberOfNights = 3,
            numberOfGuests = guests,
            totalAmountINR = priceINR,
            paymentMethod = paymentMethod,
            paymentStatus = "Paid",
            imageUrl = imageUrl,
            hotelName = provider
        )
        _hubBookings.value = listOf(newBooking) + _hubBookings.value
    }

    fun cancelHubBooking(bookingId: String) {
        _hubBookings.value = _hubBookings.value.map {
            if (it.id == bookingId) it.copy(status = "Cancelled", paymentStatus = "Refund Pending") else it
        }
    }

    fun addPhotoMemory(photo: PhotoMemoryItem) {
        _photoMemories.value = listOf(photo) + _photoMemories.value
    }

    // Recently Viewed Places
    private val _recentlyViewedPlaces = MutableStateFlow<List<PlaceItem>>(
        listOf(FirestoreMockData.places[0], FirestoreMockData.places[1])
    )
    val recentlyViewedPlaces: StateFlow<List<PlaceItem>> = _recentlyViewedPlaces.asStateFlow()

    // Home Search Form Parameters
    val homeCurrentLocation = MutableStateFlow("San Francisco, CA 📍")
    val homeDestination = MutableStateFlow("Kyoto, Japan")
    val homeStartDate = MutableStateFlow("Aug 15, 2026")
    val homeEndDate = MutableStateFlow("Aug 22, 2026")
    val homeNumDays = MutableStateFlow(7)
    val homeTravelersCount = MutableStateFlow(2)
    val homeTravelParty = MutableStateFlow("Couple")
    val homeMaxBudgetUSD = MutableStateFlow(350f) // $350/day
    val homeSelectedTripType = MutableStateFlow("Adventure")

    fun addToRecentlyViewed(place: PlaceItem) {
        val updated = (_recentlyViewedPlaces.value.filter { it.id != place.id } + place).takeLast(5)
        _recentlyViewedPlaces.value = updated.reversed()
    }

    init {
        val db = TravelDatabase.getDatabase(application)
        repository = TravelRepository(db)

        _packingListHub.value = loadPackingListFromPrefs()

        allTrips = repository.allTrips.stateIn(viewModelScope, SharingStarted.Lazily, emptyList())
        upcomingTrip = repository.upcomingTrip.stateIn(viewModelScope, SharingStarted.Lazily, null)
        allDestinations = repository.allDestinations.stateIn(viewModelScope, SharingStarted.Lazily, emptyList())
        favoriteDestinations = repository.favoriteDestinations.stateIn(viewModelScope, SharingStarted.Lazily, emptyList())
        allPosts = repository.allPosts.stateIn(viewModelScope, SharingStarted.Lazily, emptyList())

        currentPackingItems = _selectedTripIdForVault.flatMapLatest { id ->
            if (id != null) repository.getPackingItems(id)
            else flowOf(emptyList())
        }.stateIn(viewModelScope, SharingStarted.Lazily, emptyList())

        currentBudgetItems = _selectedTripIdForVault.flatMapLatest { id ->
            if (id != null) repository.getBudgetItems(id)
            else flowOf(emptyList())
        }.stateIn(viewModelScope, SharingStarted.Lazily, emptyList())

        viewModelScope.launch {
            repository.initializeSeedDataIfNeeded()
            // Auto-select first trip ID for vault if available
            upcomingTrip.firstOrNull()?.let { trip ->
                if (trip != null && _selectedTripIdForVault.value == null) {
                    _selectedTripIdForVault.value = trip.id
                }
            }
        }
    }

    fun setTab(tab: TravelTab) {
        _currentTab.value = tab
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun setSelectedCategory(category: String) {
        _selectedCategory.value = category
    }

    fun showDestinationDetail(destination: DestinationEntity?) {
        _selectedDestinationDetail.value = destination
    }

    fun showTripDetail(trip: TripEntity?) {
        _selectedTripDetail.value = trip
        if (trip != null) {
            _selectedTripIdForVault.value = trip.id
        }
    }

    fun setSelectedTripForVault(tripId: Long) {
        _selectedTripIdForVault.value = tripId
    }

    fun generateAiPlan(
        destination: String,
        durationDays: Int,
        budgetLevel: String,
        vibe: String,
        party: String,
        interests: List<String>
    ) {
        viewModelScope.launch {
            _isGenerating.value = true
            _activeGeneratedTrip.value = null

            _aiStatusText.value = "Analyzing preferences for $destination..."
            delay(600)

            _aiStatusText.value = "Scanning top attraction points & weather..."
            delay(700)

            _aiStatusText.value = "Generating $durationDays-day day-by-day itinerary with Gemini AI..."
            val generatedTrip = GeminiTripService.generateTripPlan(
                destination = destination,
                durationDays = durationDays,
                budgetLevel = budgetLevel,
                vibe = vibe,
                party = party,
                interests = interests
            )

            _aiStatusText.value = "Optimizing budget & local insider secrets..."
            delay(500)

            val savedId = repository.saveTrip(generatedTrip)
            val fullTrip = generatedTrip.copy(id = savedId)

            _activeGeneratedTrip.value = fullTrip
            _selectedTripDetail.value = fullTrip
            _selectedTripIdForVault.value = savedId
            _isGenerating.value = false
        }
    }

    fun toggleDestinationFavorite(destination: DestinationEntity) {
        viewModelScope.launch {
            repository.toggleDestinationFavorite(destination)
        }
    }

    fun togglePostLike(post: CommunityPostEntity) {
        viewModelScope.launch {
            repository.togglePostLike(post)
        }
    }

    fun togglePostBookmark(post: CommunityPostEntity) {
        viewModelScope.launch {
            repository.togglePostBookmark(post)
        }
    }

    fun addCommunityPost(title: String, location: String, content: String, tag: String) {
        viewModelScope.launch {
            val post = CommunityPostEntity(
                authorName = _userProfile.value.name,
                authorBadge = _userProfile.value.travelBadge,
                title = title,
                location = location,
                content = content,
                categoryTag = if (tag.startsWith("#")) tag else "#$tag",
                likesCount = 1,
                commentsCount = 0,
                isLiked = true,
                isBookmarked = false,
                timestamp = "Just now"
            )
            repository.addCommunityPost(post)
        }
    }

    fun togglePackingItem(item: PackingItemEntity) {
        viewModelScope.launch {
            repository.togglePackingItem(item)
        }
    }

    fun addPackingItem(itemName: String, category: String) {
        val tripId = _selectedTripIdForVault.value ?: return
        viewModelScope.launch {
            repository.addPackingItem(
                PackingItemEntity(
                    tripId = tripId,
                    itemName = itemName,
                    category = category,
                    isPacked = false
                )
            )
        }
    }

    fun deletePackingItem(item: PackingItemEntity) {
        viewModelScope.launch {
            repository.deletePackingItem(item)
        }
    }

    fun addBudgetItem(title: String, amount: Double, category: String) {
        val tripId = _selectedTripIdForVault.value ?: return
        viewModelScope.launch {
            repository.addBudgetItem(
                BudgetItemEntity(
                    tripId = tripId,
                    title = title,
                    amount = amount,
                    category = category,
                    date = "2026-08-15"
                )
            )
        }
    }

    fun deleteBudgetItem(item: BudgetItemEntity) {
        viewModelScope.launch {
            repository.deleteBudgetItem(item)
        }
    }

    fun deleteTrip(trip: TripEntity) {
        viewModelScope.launch {
            repository.deleteTrip(trip)
            if (_selectedTripDetail.value?.id == trip.id) {
                _selectedTripDetail.value = null
            }
        }
    }

    fun updateProfileCurrency(currencyCode: String, symbol: String) {
        _userProfile.value = _userProfile.value.copy(
            currencyCode = currencyCode,
            currencySymbol = symbol
        )
    }

    fun toggleDarkMode() {
        _userProfile.value = _userProfile.value.copy(
            isDarkMode = !_userProfile.value.isDarkMode
        )
    }

    fun toggleNotifications() {
        _userProfile.value = _userProfile.value.copy(
            notifications = !_userProfile.value.notifications
        )
    }

    fun updateFullUserProfile(
        name: String,
        phone: String,
        budget: String,
        language: String,
        photoUrl: String
    ) {
        _userProfile.value = _userProfile.value.copy(
            name = name,
            phone = phone,
            budget = budget,
            language = language,
            photo = if (photoUrl.isNotBlank()) photoUrl else _userProfile.value.photo
        )
    }

    // Authentication Methods
    fun loginWithEmail(email: String, password: String, rememberMe: Boolean) {
        viewModelScope.launch {
            _isAuthLoading.value = true
            _authErrorMessage.value = null
            _authSuccessMessage.value = null

            delay(1200) // Simulate Firebase auth verification latency

            if (email.contains("@") && password.length >= 6) {
                _userProfile.value = _userProfile.value.copy(
                    email = email,
                    lastLogin = "2026-07-29T06:20:00Z"
                )
                _authSuccessMessage.value = "Login Successful! Welcome back."
                delay(600)
                _isLoggedIn.value = true
                _isAuthLoading.value = false
            } else {
                _authErrorMessage.value = "Invalid email or password credential."
                _isAuthLoading.value = false
            }
        }
    }

    fun registerWithEmail(name: String, email: String, phone: String, password: String) {
        viewModelScope.launch {
            _isAuthLoading.value = true
            _authErrorMessage.value = null
            _authSuccessMessage.value = null

            delay(1400) // Simulate Firebase Auth registration + Firestore profile creation

            val newUid = "usr_tn_" + System.currentTimeMillis().toString().takeLast(6)
            _userProfile.value = UserProfile(
                uid = newUid,
                name = name,
                email = email,
                phone = phone,
                createdAt = "2026-07-29T06:20:00Z",
                lastLogin = "2026-07-29T06:20:00Z",
                isEmailVerified = false
            )

            _isEmailSentVerification.value = true
            _authSuccessMessage.value = "Account created! Verification link dispatched to $email."
            delay(1000)
            _isLoggedIn.value = true
            _isAuthLoading.value = false
        }
    }

    fun loginWithGoogle() {
        viewModelScope.launch {
            _isAuthLoading.value = true
            _authErrorMessage.value = null
            delay(1000)

            _userProfile.value = _userProfile.value.copy(
                uid = "usr_google_88291",
                name = "Siva Shirish (Google)",
                email = "sivashirish09@gmail.com",
                photo = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
                isEmailVerified = true,
                lastLogin = "2026-07-29T06:20:00Z"
            )

            _authSuccessMessage.value = "Google OAuth 2.0 Login Successful!"
            delay(600)
            _isLoggedIn.value = true
            _isAuthLoading.value = false
        }
    }

    fun loginWithSocial(provider: String) {
        viewModelScope.launch {
            _isAuthLoading.value = true
            _authErrorMessage.value = null
            delay(1000)

            _userProfile.value = _userProfile.value.copy(
                uid = "usr_social_${provider.lowercase()}",
                name = "Siva Shirish ($provider)",
                lastLogin = "2026-07-29T06:20:00Z"
            )

            _authSuccessMessage.value = "$provider Authentication Successful!"
            delay(600)
            _isLoggedIn.value = true
            _isAuthLoading.value = false
        }
    }

    fun sendForgotPasswordEmail(email: String) {
        viewModelScope.launch {
            _authSuccessMessage.value = "Password reset instructions sent to $email"
            delay(3000)
            _authSuccessMessage.value = null
        }
    }

    fun verifyEmailSimulated() {
        viewModelScope.launch {
            _userProfile.value = _userProfile.value.copy(isEmailVerified = true)
            _isEmailSentVerification.value = false
            _authSuccessMessage.value = "Email verified successfully!"
            delay(3000)
            _authSuccessMessage.value = null
        }
    }

    fun logout() {
        _isLoggedIn.value = false
        _authSuccessMessage.value = "Logged out successfully"
        _authErrorMessage.value = null
    }
}
