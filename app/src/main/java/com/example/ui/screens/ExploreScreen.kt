package com.example.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.animation.*
import androidx.compose.foundation.Canvas
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.*
import com.example.ui.MainViewModel
import com.example.ui.TravelTab
import com.example.ui.components.InteractiveMapCard
import coil.compose.AsyncImage

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
fun ExploreScreen(
    viewModel: MainViewModel,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val scrollState = rememberScrollState()

    // Firestore Collections from ViewModel
    val firestorePlaces by viewModel.firestorePlaces.collectAsState()
    val firestoreHotels by viewModel.firestoreHotels.collectAsState()
    val firestoreBeaches by viewModel.firestoreBeaches.collectAsState()
    val firestoreRestaurants by viewModel.firestoreRestaurants.collectAsState()
    val firestoreRoutes by viewModel.firestoreRoutes.collectAsState()
    val firestoreRatings by viewModel.firestoreRatings.collectAsState()
    val firestoreActivities by viewModel.firestoreActivities.collectAsState()
    val firestoreVideos by viewModel.firestoreVideos.collectAsState()
    val firestoreReviews by viewModel.firestoreReviews.collectAsState()
    val firestoreWeather by viewModel.firestoreWeather.collectAsState()

    // Search and Quick Category Tab State
    var searchQuery by remember { mutableStateOf("") }
    var selectedCategoryTab by remember { mutableStateOf("Popular Now") } // Popular Now, Top Rated, Trending, Hidden Gems

    // Voice Search State
    var showVoiceModal by remember { mutableStateOf(false) }
    var isListening by remember { mutableStateOf(false) }

    // Filters Sheet State
    var showFilterSheet by remember { mutableStateOf(false) }
    var filterCountry by remember { mutableStateOf("All") }
    var filterState by remember { mutableStateOf("All") }
    var filterCity by remember { mutableStateOf("All") }
    var filterMaxBudget by remember { mutableStateOf(500f) }
    var filterMinRating by remember { mutableStateOf(4.0f) }
    var filterMaxDistanceKm by remember { mutableStateOf(500f) }

    // Vibe & Amenity Toggles
    var filterBeachOnly by remember { mutableStateOf(false) }
    var filterMountainsOnly by remember { mutableStateOf(false) }
    var filterAdventureOnly by remember { mutableStateOf(false) }
    var filterFamilyOnly by remember { mutableStateOf(false) }
    var filterLuxuryOnly by remember { mutableStateOf(false) }
    var filterPetFriendlyOnly by remember { mutableStateOf(false) }
    var filterCampingOnly by remember { mutableStateOf(false) }
    var filterWaterSportsOnly by remember { mutableStateOf(false) }
    var filterResortsOnly by remember { mutableStateOf(false) }
    var filterRestaurantsOnly by remember { mutableStateOf(false) }

    // Dialogs / Modals State
    var selectedPlaceDetail by remember { mutableStateOf<PlaceItem?>(null) }
    var selectedVideo by remember { mutableStateOf<VideoItem?>(null) }
    var galleryImagesPlace by remember { mutableStateOf<PlaceItem?>(null) }
    var bookingPlace by remember { mutableStateOf<PlaceItem?>(null) }
    var comparePlace1 by remember { mutableStateOf<PlaceItem?>(null) }
    var comparePlace2 by remember { mutableStateOf<PlaceItem?>(null) }
    var showCompareModal by remember { mutableStateOf(false) }
    var savedPlacesIds by remember { mutableStateOf(setOf<String>()) }
    var toastMessage by remember { mutableStateOf<String?>(null) }

    val categoryTabs = listOf("Popular Now", "Top Rated", "Trending", "Hidden Gems")

    // Filter Logic
    val filteredPlaces = remember(
        firestorePlaces, searchQuery, selectedCategoryTab,
        filterCountry, filterState, filterCity, filterMaxBudget,
        filterMinRating, filterMaxDistanceKm, filterBeachOnly,
        filterMountainsOnly, filterAdventureOnly, filterFamilyOnly,
        filterLuxuryOnly, filterPetFriendlyOnly, filterCampingOnly,
        filterWaterSportsOnly, filterResortsOnly, filterRestaurantsOnly
    ) {
        firestorePlaces.filter { place ->
            val matchesSearch = searchQuery.isBlank() ||
                    place.name.contains(searchQuery, ignoreCase = true) ||
                    place.location.contains(searchQuery, ignoreCase = true) ||
                    place.country.contains(searchQuery, ignoreCase = true) ||
                    place.city.contains(searchQuery, ignoreCase = true) ||
                    place.tripType.contains(searchQuery, ignoreCase = true)

            val matchesTab = when (selectedCategoryTab) {
                "Popular Now" -> place.rating >= 4.8 || place.category == "Popular"
                "Top Rated" -> place.rating >= 4.85
                "Trending" -> place.category == "Trending" || place.reviewsCount >= 1000
                "Hidden Gems" -> place.reviewsCount < 900 || place.category == "Nearby"
                else -> true
            }

            val matchesCountry = filterCountry == "All" || place.country.equals(filterCountry, ignoreCase = true)
            val matchesState = filterState == "All" || place.state.equals(filterState, ignoreCase = true)
            val matchesCity = filterCity == "All" || place.city.equals(filterCity, ignoreCase = true)
            val matchesBudget = place.pricePerNightUSD <= filterMaxBudget
            val matchesRating = place.rating >= filterMinRating
            val matchesDistance = place.distanceKm <= filterMaxDistanceKm

            val matchesBeach = !filterBeachOnly || place.tripType.contains("Beach", ignoreCase = true)
            val matchesMountains = !filterMountainsOnly || place.tripType.contains("Hill Station", ignoreCase = true)
            val matchesAdventure = !filterAdventureOnly || place.tripType.contains("Adventure", ignoreCase = true)
            val matchesFamily = !filterFamilyOnly || place.tripType.contains("Family", ignoreCase = true)
            val matchesLuxury = !filterLuxuryOnly || place.tripType.contains("Luxury", ignoreCase = true)
            val matchesPetFriendly = !filterPetFriendlyOnly || place.petFriendly
            val matchesCamping = !filterCampingOnly || place.isCamping
            val matchesWaterSports = !filterWaterSportsOnly || place.isWaterSport
            val matchesResorts = !filterResortsOnly || place.hasResorts
            val matchesRestaurants = !filterRestaurantsOnly || place.hasRestaurants

            matchesSearch && matchesTab && matchesCountry && matchesState && matchesCity &&
                    matchesBudget && matchesRating && matchesDistance && matchesBeach &&
                    matchesMountains && matchesAdventure && matchesFamily && matchesLuxury &&
                    matchesPetFriendly && matchesCamping && matchesWaterSports && matchesResorts && matchesRestaurants
        }
    }

    Box(modifier = modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(scrollState)
                .padding(bottom = 90.dp)
        ) {
            // ================= SEARCH HEADER BANNER =================
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        brush = Brush.verticalGradient(
                            colors = listOf(
                                Color(0xFF0F172A),
                                Color(0xFF1E293B),
                                Color(0xFF0284C7)
                            )
                        ),
                        shape = RoundedCornerShape(bottomStart = 28.dp, bottomEnd = 28.dp)
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
                                text = "Explore the World 🌏",
                                fontSize = 24.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Text(
                                text = "Discover places, routes, beaches, resorts & AI picks",
                                fontSize = 12.sp,
                                color = Color.White.copy(alpha = 0.8f)
                            )
                        }

                        // Compare Destinations Button
                        IconButton(
                            onClick = { showCompareModal = true },
                            modifier = Modifier
                                .background(Color.White.copy(alpha = 0.15f), CircleShape)
                                .size(42.dp)
                        ) {
                            Icon(
                                imageVector = Icons.Filled.CompareArrows,
                                contentDescription = "Compare Destinations",
                                tint = Color.White
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // ================= TOP SEARCH BAR WITH VOICE & FILTERS =================
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        OutlinedTextField(
                            value = searchQuery,
                            onValueChange = { searchQuery = it },
                            placeholder = { Text("Search country, state, city, vibe...", color = Color.White.copy(alpha = 0.6f), fontSize = 13.sp) },
                            leadingIcon = { Icon(Icons.Filled.Search, contentDescription = null, tint = Color(0xFF38BDF8)) },
                            trailingIcon = {
                                if (searchQuery.isNotEmpty()) {
                                    IconButton(onClick = { searchQuery = "" }) {
                                        Icon(Icons.Filled.Close, contentDescription = "Clear", tint = Color.White)
                                    }
                                }
                            },
                            singleLine = true,
                            shape = RoundedCornerShape(16.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = Color(0xFF38BDF8),
                                unfocusedBorderColor = Color.White.copy(alpha = 0.3f),
                                focusedTextColor = Color.White,
                                unfocusedTextColor = Color.White
                            ),
                            modifier = Modifier
                                .weight(1f)
                                .testTag("advanced_explore_search_bar")
                        )

                        // Voice Search Button
                        IconButton(
                            onClick = {
                                showVoiceModal = true
                                isListening = true
                            },
                            modifier = Modifier
                                .background(Color(0xFF009688), RoundedCornerShape(14.dp))
                                .size(50.dp)
                                .testTag("voice_search_button")
                        ) {
                            Icon(
                                imageVector = Icons.Filled.Mic,
                                contentDescription = "Voice Search",
                                tint = Color.White
                            )
                        }

                        // Filter Button
                        IconButton(
                            onClick = { showFilterSheet = true },
                            modifier = Modifier
                                .background(Color(0xFFFF7043), RoundedCornerShape(14.dp))
                                .size(50.dp)
                                .testTag("explore_filter_button")
                        ) {
                            Icon(
                                imageVector = Icons.Filled.FilterList,
                                contentDescription = "Filters",
                                tint = Color.White
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // ================= CATEGORIES / TABS =================
                    LazyRow(
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        items(categoryTabs) { tab ->
                            val isSelected = selectedCategoryTab == tab
                            FilterChip(
                                selected = isSelected,
                                onClick = { selectedCategoryTab = tab },
                                label = {
                                    Text(
                                        text = tab,
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
                                shape = RoundedCornerShape(14.dp)
                            )
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))

            // ================= AI RECOMMENDATIONS BANNER =================
            AiRecommendationBanner(
                destination = firestorePlaces.firstOrNull() ?: FirestoreMockData.places[0],
                onExplore = {
                    selectedPlaceDetail = firestorePlaces.firstOrNull()
                },
                onPlan = {
                    viewModel.homeDestination.value = firestorePlaces.firstOrNull()?.name ?: "Kyoto, Japan"
                    viewModel.setTab(TravelTab.AI_PLAN)
                },
                modifier = Modifier.padding(horizontal = 20.dp)
            )

            Spacer(modifier = Modifier.height(24.dp))

            // ================= MAIN DESTINATIONS LIST / CARDS =================
            SectionHeader(
                title = "Destinations (${filteredPlaces.size})",
                actionText = "Clear Filters",
                onAction = {
                    searchQuery = ""
                    filterCountry = "All"
                    filterState = "All"
                    filterCity = "All"
                    filterMaxBudget = 500f
                    filterMinRating = 4.0f
                    filterMaxDistanceKm = 500f
                    filterBeachOnly = false
                    filterMountainsOnly = false
                    filterAdventureOnly = false
                    filterFamilyOnly = false
                    filterLuxuryOnly = false
                    filterPetFriendlyOnly = false
                    filterCampingOnly = false
                    filterWaterSportsOnly = false
                    filterResortsOnly = false
                    filterRestaurantsOnly = false
                }
            )

            Spacer(modifier = Modifier.height(12.dp))

            if (filteredPlaces.isEmpty()) {
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
                ) {
                    Column(
                        modifier = Modifier.padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(Icons.Filled.SearchOff, contentDescription = null, modifier = Modifier.size(48.dp), tint = Color.Gray)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text("No destinations matched your active filters.", fontWeight = FontWeight.Bold)
                        Text("Try relaxing budget or rating sliders.", fontSize = 12.sp, color = Color.Gray)
                    }
                }
            } else {
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 20.dp),
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    items(filteredPlaces) { place ->
                        val isSaved = savedPlacesIds.contains(place.id)
                        ExplorePlaceCard(
                            place = place,
                            isSaved = isSaved,
                            onCardClick = { selectedPlaceDetail = place },
                            onSaveToggle = {
                                savedPlacesIds = if (isSaved) savedPlacesIds - place.id else savedPlacesIds + place.id
                                toastMessage = if (isSaved) "Removed ${place.name} from Saved" else "Saved ${place.name} to Favorites!"
                            },
                            onBookNow = { bookingPlace = place },
                            onShare = {
                                val shareIntent = Intent(Intent.ACTION_SEND).apply {
                                    type = "text/plain"
                                    putExtra(Intent.EXTRA_SUBJECT, "Check out ${place.name}")
                                    putExtra(Intent.EXTRA_TEXT, "Hey! Look at this awesome travel spot: ${place.name} in ${place.location}. Price: $${place.pricePerNightUSD}/night. Rating: ${place.rating}⭐")
                                }
                                context.startActivity(Intent.createChooser(shareIntent, "Share Destination"))
                            },
                            onViewGallery = { galleryImagesPlace = place }
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(28.dp))

            // ================= TRAVEL VIDEOS =================
            SectionHeader(title = "Travel Videos 🎬")
            Spacer(modifier = Modifier.height(10.dp))
            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                items(firestoreVideos) { video ->
                    VideoCard(
                        video = video,
                        onClick = { selectedVideo = video }
                    )
                }
            }

            Spacer(modifier = Modifier.height(28.dp))

            // ================= NEARBY HOTELS & RESORTS =================
            SectionHeader(title = "Nearby Hotels & Resorts 🏨")
            Spacer(modifier = Modifier.height(10.dp))
            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                items(firestoreHotels) { hotel ->
                    HotelExploreCard(hotel = hotel)
                }
            }

            Spacer(modifier = Modifier.height(28.dp))

            // ================= NEARBY BEACHES =================
            SectionHeader(title = "Nearby Beaches 🏖️")
            Spacer(modifier = Modifier.height(10.dp))
            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                items(firestoreBeaches) { beach ->
                    BeachExploreCard(beach = beach)
                }
            }

            Spacer(modifier = Modifier.height(28.dp))

            // ================= NEARBY RESTAURANTS & CUISINE =================
            SectionHeader(title = "Nearby Restaurants & Local Dining 🍽️")
            Spacer(modifier = Modifier.height(10.dp))
            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                items(firestoreRestaurants) { restaurant ->
                    RestaurantCard(restaurant = restaurant)
                }
            }

            Spacer(modifier = Modifier.height(28.dp))

            // ================= ROUTE PLANNER & TRAVEL DISTANCE =================
            SectionHeader(title = "Route Planner & Cost Estimates 🛣️")
            Spacer(modifier = Modifier.height(10.dp))
            Column(
                modifier = Modifier.padding(horizontal = 20.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                firestoreRoutes.forEach { route ->
                    RoutePlannerCard(route = route)
                }
            }

            Spacer(modifier = Modifier.height(28.dp))

            // ================= SAFETY SCORE & REVIEWS =================
            SectionHeader(title = "Safety Scores & Traveler Ratings 🛡️")
            Spacer(modifier = Modifier.height(10.dp))
            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                items(firestoreRatings) { rating ->
                    SafetyScoreCard(rating = rating)
                }
            }

            Spacer(modifier = Modifier.height(28.dp))

            // ================= LIVE WEATHER RADAR =================
            SectionHeader(title = "Live Destination Weather ⛅")
            Spacer(modifier = Modifier.height(10.dp))
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Column {
                        Text(firestoreWeather.city, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        Text("${firestoreWeather.tempC}°C / ${firestoreWeather.tempF}°F • ${firestoreWeather.condition}", fontSize = 13.sp, color = MaterialTheme.colorScheme.primary)
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(firestoreWeather.advisory, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))
                    }
                    Text("🌤️", fontSize = 36.sp)
                }
            }

            Spacer(modifier = Modifier.height(32.dp))
        }

        // ================= TOAST / SNACKBAR OVERLAY =================
        toastMessage?.let { msg ->
            Snackbar(
                action = {
                    TextButton(onClick = { toastMessage = null }) {
                        Text("OK", color = Color.White)
                    }
                },
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 100.dp, start = 16.dp, end = 16.dp)
            ) {
                Text(msg)
            }
        }
    }

    // ================= MODAL DIALOGS =================

    // 1. Voice Search Modal
    if (showVoiceModal) {
        VoiceSearchModal(
            isListening = isListening,
            onResult = { query ->
                searchQuery = query
                showVoiceModal = false
            },
            onDismiss = { showVoiceModal = false }
        )
    }

    // 2. Comprehensive Filters Sheet Modal
    if (showFilterSheet) {
        ExploreFiltersSheet(
            country = filterCountry,
            onCountryChange = { filterCountry = it },
            state = filterState,
            onStateChange = { filterState = it },
            city = filterCity,
            onCityChange = { filterCity = it },
            maxBudget = filterMaxBudget,
            onMaxBudgetChange = { filterMaxBudget = it },
            minRating = filterMinRating,
            onMinRatingChange = { filterMinRating = it },
            maxDistance = filterMaxDistanceKm,
            onMaxDistanceChange = { filterMaxDistanceKm = it },
            beachOnly = filterBeachOnly,
            onBeachChange = { filterBeachOnly = it },
            mountainsOnly = filterMountainsOnly,
            onMountainsChange = { filterMountainsOnly = it },
            adventureOnly = filterAdventureOnly,
            onAdventureChange = { filterAdventureOnly = it },
            familyOnly = filterFamilyOnly,
            onFamilyChange = { filterFamilyOnly = it },
            luxuryOnly = filterLuxuryOnly,
            onLuxuryChange = { filterLuxuryOnly = it },
            petFriendlyOnly = filterPetFriendlyOnly,
            onPetFriendlyChange = { filterPetFriendlyOnly = it },
            campingOnly = filterCampingOnly,
            onCampingChange = { filterCampingOnly = it },
            waterSportsOnly = filterWaterSportsOnly,
            onWaterSportsChange = { filterWaterSportsOnly = it },
            resortsOnly = filterResortsOnly,
            onResortsChange = { filterResortsOnly = it },
            restaurantsOnly = filterRestaurantsOnly,
            onRestaurantsChange = { filterRestaurantsOnly = it },
            onDismiss = { showFilterSheet = false }
        )
    }

    // 3. Destination Detailed Modal
    selectedPlaceDetail?.let { place ->
        PlaceDetailExploreModal(
            place = place,
            onDismiss = { selectedPlaceDetail = null },
            onBookNow = {
                selectedPlaceDetail = null
                bookingPlace = place
            },
            onOpenMaps = {
                val gmmIntentUri = Uri.parse("geo:${place.lat},${place.lng}?q=${Uri.encode(place.name)}")
                val mapIntent = Intent(Intent.ACTION_VIEW, gmmIntentUri)
                mapIntent.setPackage("com.google.android.apps.maps")
                if (mapIntent.resolveActivity(context.packageManager) != null) {
                    context.startActivity(mapIntent)
                } else {
                    val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://maps.google.com/?q=${place.lat},${place.lng}"))
                    context.startActivity(browserIntent)
                }
            },
            onPlanAiTrip = {
                viewModel.homeDestination.value = place.name
                selectedPlaceDetail = null
                viewModel.setTab(TravelTab.AI_PLAN)
            }
        )
    }

    // 4. Video Player Simulation Modal
    selectedVideo?.let { video ->
        VideoPlayerModal(
            video = video,
            onDismiss = { selectedVideo = null }
        )
    }

    // 5. Image Gallery Modal
    galleryImagesPlace?.let { place ->
        ImageGalleryModal(
            place = place,
            onDismiss = { galleryImagesPlace = null }
        )
    }

    // 6. Booking Dialog Sheet
    bookingPlace?.let { place ->
        BookingConfirmationDialog(
            place = place,
            onDismiss = { bookingPlace = null },
            onConfirm = {
                bookingPlace = null
                toastMessage = "🎉 Successfully booked ${place.name}! Confirmation sent to your email."
            }
        )
    }

    // 7. Compare Destinations Modal
    if (showCompareModal) {
        CompareDestinationsModal(
            places = firestorePlaces,
            place1 = comparePlace1 ?: firestorePlaces.getOrNull(0),
            place2 = comparePlace2 ?: firestorePlaces.getOrNull(1),
            onSelectPlace1 = { comparePlace1 = it },
            onSelectPlace2 = { comparePlace2 = it },
            onDismiss = { showCompareModal = false }
        )
    }
}

// ================= UI SUB-COMPONENTS =================

@Composable
private fun SectionHeader(
    title: String,
    actionText: String? = null,
    onAction: (() -> Unit)? = null
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = title,
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold
        )
        if (actionText != null && onAction != null) {
            TextButton(onClick = onAction) {
                Text(actionText, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold, fontSize = 12.sp)
            }
        }
    }
}

@Composable
private fun AiRecommendationBanner(
    destination: PlaceItem,
    onExplore: () -> Unit,
    onPlan: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A))
    ) {
        Column(modifier = Modifier.padding(18.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Surface(
                    color = Color(0xFF009688),
                    shape = RoundedCornerShape(10.dp)
                ) {
                    Text(
                        text = "✨ 98% AI Match Pick",
                        color = Color.White,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                    )
                }

                Text("Recommended for You", fontSize = 11.sp, color = Color.White.copy(alpha = 0.7f))
            }

            Spacer(modifier = Modifier.height(12.dp))

            Row(verticalAlignment = Alignment.CenterVertically) {
                AsyncImage(
                    model = destination.imageUrl,
                    contentDescription = destination.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .size(70.dp)
                        .clip(RoundedCornerShape(16.dp))
                )
                Spacer(modifier = Modifier.width(14.dp))
                Column {
                    Text(destination.name, fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Color.White, maxLines = 1)
                    Text(destination.location, fontSize = 12.sp, color = Color.White.copy(alpha = 0.8f))
                    Spacer(modifier = Modifier.height(4.dp))
                    Text("Why AI Picked This: Fits your $${destination.pricePerNightUSD}/day budget with 4.9⭐ ratings.", fontSize = 11.sp, color = Color(0xFF38BDF8))
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedButton(
                    onClick = onExplore,
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White),
                    modifier = Modifier.weight(1f)
                ) {
                    Text("View Details", fontSize = 12.sp)
                }

                Button(
                    onClick = onPlan,
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF009688)),
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Build AI Trip", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
private fun ExplorePlaceCard(
    place: PlaceItem,
    isSaved: Boolean,
    onCardClick: () -> Unit,
    onSaveToggle: () -> Unit,
    onBookNow: () -> Unit,
    onShare: () -> Unit,
    onViewGallery: () -> Unit
) {
    Card(
        modifier = Modifier
            .width(280.dp)
            .clickable { onCardClick() },
        shape = RoundedCornerShape(22.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
    ) {
        Column {
            Box(modifier = Modifier.height(160.dp)) {
                AsyncImage(
                    model = place.imageUrl,
                    contentDescription = place.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )

                // Save Favorite Icon Button
                IconButton(
                    onClick = onSaveToggle,
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(8.dp)
                        .background(Color.Black.copy(alpha = 0.5f), CircleShape)
                        .size(36.dp)
                ) {
                    Icon(
                        imageVector = if (isSaved) Icons.Filled.Favorite else Icons.Filled.FavoriteBorder,
                        contentDescription = "Save",
                        tint = if (isSaved) Color.Red else Color.White,
                        modifier = Modifier.size(20.dp)
                    )
                }

                // Safety Score Badge
                Surface(
                    color = Color(0xFF15803D),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier
                        .align(Alignment.TopStart)
                        .padding(10.dp)
                ) {
                    Text(
                        text = "🛡️ Safety ${place.safetyScore}/100",
                        color = Color.White,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                    )
                }

                // Gallery Overlay Button
                Surface(
                    color = Color.Black.copy(alpha = 0.6f),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier
                        .align(Alignment.BottomEnd)
                        .padding(10.dp)
                        .clickable { onViewGallery() }
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.Filled.PhotoLibrary, contentDescription = null, tint = Color.White, modifier = Modifier.size(12.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Photos", color = Color.White, fontSize = 10.sp)
                    }
                }
            }

            Column(modifier = Modifier.padding(14.dp)) {
                Text(place.name, fontWeight = FontWeight.Bold, fontSize = 15.sp, maxLines = 1, overflow = TextOverflow.Ellipsis)
                Text("${place.city}, ${place.country}", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))

                Spacer(modifier = Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("$${place.pricePerNightUSD} / night", fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary, fontSize = 14.sp)
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Filled.Star, contentDescription = null, tint = Color(0xFFFFB74D), modifier = Modifier.size(14.dp))
                        Spacer(modifier = Modifier.width(2.dp))
                        Text("${place.rating}", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                    }
                }

                Spacer(modifier = Modifier.height(10.dp))

                // Action Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = onBookNow,
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Book Now", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }

                    OutlinedButton(
                        onClick = onShare,
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.size(38.dp),
                        contentPadding = PaddingValues(0.dp)
                    ) {
                        Icon(Icons.Filled.Share, contentDescription = "Share", modifier = Modifier.size(16.dp))
                    }
                }
            }
        }
    }
}

@Composable
private fun VideoCard(
    video: VideoItem,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .width(220.dp)
            .clickable { onClick() },
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column {
            Box(modifier = Modifier.height(120.dp)) {
                AsyncImage(
                    model = video.thumbnailUrl,
                    contentDescription = video.title,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color.Black.copy(alpha = 0.3f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Filled.PlayCircleFilled, contentDescription = "Play", tint = Color.White, modifier = Modifier.size(40.dp))
                }
                Surface(
                    color = Color.Black.copy(alpha = 0.7f),
                    shape = RoundedCornerShape(6.dp),
                    modifier = Modifier
                        .align(Alignment.BottomEnd)
                        .padding(6.dp)
                ) {
                    Text(video.duration, color = Color.White, fontSize = 10.sp, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                }
            }
            Column(modifier = Modifier.padding(10.dp)) {
                Text(video.title, fontWeight = FontWeight.Bold, fontSize = 12.sp, maxLines = 1, overflow = TextOverflow.Ellipsis)
                Text("${video.author} • ${video.views}", fontSize = 10.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
            }
        }
    }
}

@Composable
private fun HotelExploreCard(hotel: HotelItem) {
    Card(
        modifier = Modifier.width(210.dp),
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column {
            Box(modifier = Modifier.height(110.dp)) {
                AsyncImage(
                    model = hotel.imageUrl,
                    contentDescription = hotel.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
            }
            Column(modifier = Modifier.padding(10.dp)) {
                Text(hotel.name, fontWeight = FontWeight.Bold, fontSize = 13.sp, maxLines = 1)
                Text(hotel.destination, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))
                Spacer(modifier = Modifier.height(4.dp))
                Text("$${hotel.pricePerNightUSD}/night • ⭐ ${hotel.rating}", fontSize = 11.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
private fun BeachExploreCard(beach: BeachItem) {
    Card(
        modifier = Modifier.width(210.dp),
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column {
            Box(modifier = Modifier.height(110.dp)) {
                AsyncImage(
                    model = beach.imageUrl,
                    contentDescription = beach.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
            }
            Column(modifier = Modifier.padding(10.dp)) {
                Text(beach.name, fontWeight = FontWeight.Bold, fontSize = 13.sp, maxLines = 1)
                Text(beach.location, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))
                Text(beach.waterColor, fontSize = 10.sp, color = Color(0xFF0284C7), fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
private fun RestaurantCard(restaurant: RestaurantItem) {
    Card(
        modifier = Modifier.width(220.dp),
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column {
            Box(modifier = Modifier.height(110.dp)) {
                AsyncImage(
                    model = restaurant.imageUrl,
                    contentDescription = restaurant.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
            }
            Column(modifier = Modifier.padding(10.dp)) {
                Text(restaurant.name, fontWeight = FontWeight.Bold, fontSize = 13.sp, maxLines = 1)
                Text("${restaurant.cuisine} • ${restaurant.priceRange}", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))
                Text("Specialty: ${restaurant.specialty}", fontSize = 10.sp, color = MaterialTheme.colorScheme.primary, maxLines = 1)
            }
        }
    }
}

@Composable
private fun RoutePlannerCard(route: RouteItem) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("${route.origin} ➔ ${route.destination}", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Text("$${route.estimatedCostUSD} approx", fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary, fontSize = 13.sp)
            }
            Spacer(modifier = Modifier.height(6.dp))
            Text("Mode: ${route.transportMode} • ${route.estimatedHours} hrs • ${route.travelDistanceKm.toInt()} km", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.8f))
            Text("Highlights: ${route.scenicHighlights}", fontSize = 11.sp, color = Color.Gray)
        }
    }
}

@Composable
private fun SafetyScoreCard(rating: RatingItem) {
    Card(
        modifier = Modifier.width(220.dp),
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(rating.destination, fontWeight = FontWeight.Bold, fontSize = 14.sp, maxLines = 1)
                Text("${rating.overallScore}⭐", fontWeight = FontWeight.Bold)
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text("🛡️ Safety Score: ${rating.safetyScore}/100", fontSize = 12.sp, color = Color(0xFF15803D), fontWeight = FontWeight.Bold)
            Text("✨ Cleanliness: ${rating.cleanlinessScore}/100", fontSize = 11.sp)
            Text("🤝 Hospitality: ${rating.hospitalityScore}/100", fontSize = 11.sp)
        }
    }
}

// ================= MODAL DIALOG IMPLEMENTATIONS =================

@Composable
private fun VoiceSearchModal(
    isListening: Boolean,
    onResult: (String) -> Unit,
    onDismiss: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Filled.Mic, contentDescription = null, tint = Color(0xFF009688))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Voice Assistant Listening...")
            }
        },
        text = {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp)
            ) {
                CircularProgressIndicator(color = Color(0xFF009688))
                Spacer(modifier = Modifier.height(16.dp))
                Text("Say something like:", fontSize = 12.sp, color = Color.Gray)
                Text("\"Beach resorts in Japan with 4.8 rating\"", fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)

                Spacer(modifier = Modifier.height(16.dp))

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Button(onClick = { onResult("Japan") }) { Text("Japan") }
                    Button(onClick = { onResult("Beach") }) { Text("Beach") }
                    Button(onClick = { onResult("Kyoto") }) { Text("Kyoto") }
                }
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) { Text("Cancel") }
        }
    )
}

@OptIn(ExperimentalMaterial3Api::class, ExperimentalLayoutApi::class)
@Composable
private fun ExploreFiltersSheet(
    country: String, onCountryChange: (String) -> Unit,
    state: String, onStateChange: (String) -> Unit,
    city: String, onCityChange: (String) -> Unit,
    maxBudget: Float, onMaxBudgetChange: (Float) -> Unit,
    minRating: Float, onMinRatingChange: (Float) -> Unit,
    maxDistance: Float, onMaxDistanceChange: (Float) -> Unit,
    beachOnly: Boolean, onBeachChange: (Boolean) -> Unit,
    mountainsOnly: Boolean, onMountainsChange: (Boolean) -> Unit,
    adventureOnly: Boolean, onAdventureChange: (Boolean) -> Unit,
    familyOnly: Boolean, onFamilyChange: (Boolean) -> Unit,
    luxuryOnly: Boolean, onLuxuryChange: (Boolean) -> Unit,
    petFriendlyOnly: Boolean, onPetFriendlyChange: (Boolean) -> Unit,
    campingOnly: Boolean, onCampingChange: (Boolean) -> Unit,
    waterSportsOnly: Boolean, onWaterSportsChange: (Boolean) -> Unit,
    resortsOnly: Boolean, onResortsChange: (Boolean) -> Unit,
    restaurantsOnly: Boolean, onRestaurantsChange: (Boolean) -> Unit,
    onDismiss: () -> Unit
) {
    val scrollState = rememberScrollState()

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp)
                .verticalScroll(scrollState)
                .padding(bottom = 30.dp)
        ) {
            Text("Advanced Filters 🎛️", fontSize = 20.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(14.dp))

            // Location Selectors
            Text("Country", fontSize = 12.sp, fontWeight = FontWeight.Bold)
            LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                items(listOf("All", "Japan", "Italy", "Greece", "Indonesia", "Switzerland", "India")) { c ->
                    FilterChip(
                        selected = country == c,
                        onClick = { onCountryChange(c) },
                        label = { Text(c) }
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Budget Slider
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("Max Nightly Budget:", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                Text("$${maxBudget.toInt()}", color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
            }
            Slider(
                value = maxBudget,
                onValueChange = onMaxBudgetChange,
                valueRange = 50f..1000f
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Rating Slider
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text("Minimum Rating:", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                Text("${String.format("%.1f", minRating)} ⭐", color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
            }
            Slider(
                value = minRating,
                onValueChange = onMinRatingChange,
                valueRange = 3.0f..5.0f
            )

            Spacer(modifier = Modifier.height(12.dp))

            // Experience Toggles
            Text("Experience & Amenities", fontSize = 12.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(6.dp))
            FlowRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                FilterChip(selected = beachOnly, onClick = { onBeachChange(!beachOnly) }, label = { Text("Beach 🏖️") })
                FilterChip(selected = mountainsOnly, onClick = { onMountainsChange(!mountainsOnly) }, label = { Text("Mountains ⛰️") })
                FilterChip(selected = adventureOnly, onClick = { onAdventureChange(!adventureOnly) }, label = { Text("Adventure 🧗") })
                FilterChip(selected = familyOnly, onClick = { onFamilyChange(!familyOnly) }, label = { Text("Family 👨‍👩‍👧") })
                FilterChip(selected = luxuryOnly, onClick = { onLuxuryChange(!luxuryOnly) }, label = { Text("Luxury ✨") })
                FilterChip(selected = petFriendlyOnly, onClick = { onPetFriendlyChange(!petFriendlyOnly) }, label = { Text("Pet Friendly 🐾") })
                FilterChip(selected = campingOnly, onClick = { onCampingChange(!campingOnly) }, label = { Text("Camping ⛺") })
                FilterChip(selected = waterSportsOnly, onClick = { onWaterSportsChange(!waterSportsOnly) }, label = { Text("Water Sports 🚤") })
                FilterChip(selected = resortsOnly, onClick = { onResortsChange(!resortsOnly) }, label = { Text("Resorts 🏨") })
                FilterChip(selected = restaurantsOnly, onClick = { onRestaurantsChange(!restaurantsOnly) }, label = { Text("Restaurants 🍽️") })
            }

            Spacer(modifier = Modifier.height(20.dp))

            Button(
                onClick = onDismiss,
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp)
            ) {
                Text("Apply Filters", fontWeight = FontWeight.Bold)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun PlaceDetailExploreModal(
    place: PlaceItem,
    onDismiss: () -> Unit,
    onBookNow: () -> Unit,
    onOpenMaps: () -> Unit,
    onPlanAiTrip: () -> Unit
) {
    ModalBottomSheet(
        onDismissRequest = onDismiss,
        sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 24.dp)
                .verticalScroll(rememberScrollState())
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(200.dp)
            ) {
                AsyncImage(
                    model = place.imageUrl,
                    contentDescription = place.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
            }

            Column(modifier = Modifier.padding(20.dp)) {
                Text(place.name, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                Text("${place.location} • ${place.city}, ${place.country}", fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))

                Spacer(modifier = Modifier.height(10.dp))

                Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                    Text("$${place.pricePerNightUSD}/night", fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary, fontSize = 16.sp)
                    Text("⭐ ${place.rating} (${place.reviewsCount} reviews)", fontWeight = FontWeight.Bold)
                    Text("🛡️ Safety ${place.safetyScore}/100", color = Color(0xFF15803D), fontWeight = FontWeight.Bold)
                }

                Spacer(modifier = Modifier.height(14.dp))

                Text("Overview", fontWeight = FontWeight.Bold)
                Text(place.description, fontSize = 13.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.8f))

                Spacer(modifier = Modifier.height(14.dp))

                Text("Nearby Airports", fontWeight = FontWeight.Bold)
                Text(place.nearbyAirports.joinToString(", "), fontSize = 12.sp)

                Spacer(modifier = Modifier.height(16.dp))

                InteractiveMapCard(locationName = place.name, lat = place.lat, lng = place.lng)

                Spacer(modifier = Modifier.height(18.dp))

                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedButton(
                        onClick = onOpenMaps,
                        modifier = Modifier.weight(1f)
                    ) {
                        Icon(Icons.Filled.Map, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Google Maps")
                    }

                    Button(
                        onClick = onBookNow,
                        colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Book Now", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
private fun VideoPlayerModal(
    video: VideoItem,
    onDismiss: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(video.title, fontSize = 16.sp, fontWeight = FontWeight.Bold) },
        text = {
            Column {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(180.dp)
                        .clip(RoundedCornerShape(12.dp))
                ) {
                    AsyncImage(
                        model = video.thumbnailUrl,
                        contentDescription = null,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier.fillMaxSize()
                    )
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .background(Color.Black.copy(alpha = 0.4f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(Icons.Filled.PlayCircle, contentDescription = null, tint = Color.White, modifier = Modifier.size(54.dp))
                    }
                }
                Spacer(modifier = Modifier.height(10.dp))
                Text("Author: ${video.author}", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                Text("Views: ${video.views} • Duration: ${video.duration}", fontSize = 11.sp, color = Color.Gray)
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) { Text("Close") }
        }
    )
}

@Composable
private fun ImageGalleryModal(
    place: PlaceItem,
    onDismiss: () -> Unit
) {
    var selectedImg by remember { mutableStateOf(place.galleryImages.firstOrNull() ?: place.imageUrl) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Photo Gallery: ${place.name}", fontSize = 15.sp, fontWeight = FontWeight.Bold) },
        text = {
            Column {
                AsyncImage(
                    model = selectedImg,
                    contentDescription = null,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(200.dp)
                        .clip(RoundedCornerShape(12.dp))
                )
                Spacer(modifier = Modifier.height(12.dp))
                LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    items(place.galleryImages) { img ->
                        AsyncImage(
                            model = img,
                            contentDescription = null,
                            contentScale = ContentScale.Crop,
                            modifier = Modifier
                                .size(50.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .border(
                                    width = if (selectedImg == img) 2.dp else 0.dp,
                                    color = MaterialTheme.colorScheme.primary,
                                    shape = RoundedCornerShape(8.dp)
                                )
                                .clickable { selectedImg = img }
                        )
                    }
                }
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) { Text("Close") }
        }
    )
}

@Composable
private fun BookingConfirmationDialog(
    place: PlaceItem,
    onDismiss: () -> Unit,
    onConfirm: () -> Unit
) {
    var guests by remember { mutableStateOf(2) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Book Stay at ${place.name}") },
        text = {
            Column {
                Text("Price per night: $${place.pricePerNightUSD}")
                Spacer(modifier = Modifier.height(8.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("Guests: ")
                    IconButton(onClick = { if (guests > 1) guests-- }) { Icon(Icons.Filled.RemoveCircleOutline, contentDescription = null) }
                    Text("$guests", fontWeight = FontWeight.Bold)
                    IconButton(onClick = { guests++ }) { Icon(Icons.Filled.AddCircleOutline, contentDescription = null) }
                }
                Spacer(modifier = Modifier.height(8.dp))
                Text("Total Estimated (3 nights): $${place.pricePerNightUSD * 3 * guests}", fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
            }
        },
        confirmButton = {
            Button(onClick = onConfirm) { Text("Confirm & Pay") }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel") }
        }
    )
}

@Composable
private fun CompareDestinationsModal(
    places: List<PlaceItem>,
    place1: PlaceItem?,
    place2: PlaceItem?,
    onSelectPlace1: (PlaceItem) -> Unit,
    onSelectPlace2: (PlaceItem) -> Unit,
    onDismiss: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Compare Destinations ⚖️", fontWeight = FontWeight.Bold) },
        text = {
            Column(modifier = Modifier.verticalScroll(rememberScrollState())) {
                if (place1 != null && place2 != null) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(place1.name, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            Text("⭐ ${place1.rating}")
                            Text("💵 $${place1.pricePerNightUSD}/night")
                            Text("🛡️ Safety ${place1.safetyScore}")
                            Text("✈️ ${place1.estimatedFlightHours} hrs flight")
                        }

                        Divider(modifier = Modifier.width(1.dp).height(100.dp))

                        Column(modifier = Modifier.weight(1f), horizontalAlignment = Alignment.End) {
                            Text(place2.name, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                            Text("⭐ ${place2.rating}")
                            Text("💵 $${place2.pricePerNightUSD}/night")
                            Text("🛡️ Safety ${place2.safetyScore}")
                            Text("✈️ ${place2.estimatedFlightHours} hrs flight")
                        }
                    }
                }
            }
        },
        confirmButton = {
            TextButton(onClick = onDismiss) { Text("Close") }
        }
    )
}
