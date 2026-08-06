package com.example.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.animation.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
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
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.*
import com.example.ui.MainViewModel
import com.example.ui.TravelTab
import coil.compose.AsyncImage

@Composable
fun HomeScreen(
    viewModel: MainViewModel,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val scrollState = rememberScrollState()

    val userProfile by viewModel.userProfile.collectAsState()
    val upcomingTrip by viewModel.upcomingTrip.collectAsState()

    val firestorePlaces by viewModel.firestorePlaces.collectAsState()
    val firestoreHotels by viewModel.firestoreHotels.collectAsState()
    val firestoreBeaches by viewModel.firestoreBeaches.collectAsState()
    val firestorePackages by viewModel.firestorePackages.collectAsState()
    val firestoreReviews by viewModel.firestoreReviews.collectAsState()
    val firestoreBlogs by viewModel.firestoreBlogs.collectAsState()
    val firestoreWeather by viewModel.firestoreWeather.collectAsState()
    val firestoreOffers by viewModel.firestoreOffers.collectAsState()
    val firestoreFlights by viewModel.firestoreFlights.collectAsState()
    val firestoreNews by viewModel.firestoreNews.collectAsState()
    val firestoreFestivals by viewModel.firestoreFestivals.collectAsState()
    val recentlyViewed by viewModel.recentlyViewedPlaces.collectAsState()

    // Form inputs
    val currentLocation by viewModel.homeCurrentLocation.collectAsState()
    val destinationInput by viewModel.homeDestination.collectAsState()
    val startDateInput by viewModel.homeStartDate.collectAsState()
    val endDateInput by viewModel.homeEndDate.collectAsState()
    val numDays by viewModel.homeNumDays.collectAsState()
    val travelersCount by viewModel.homeTravelersCount.collectAsState()
    val travelParty by viewModel.homeTravelParty.collectAsState()
    val maxBudgetUSD by viewModel.homeMaxBudgetUSD.collectAsState()
    val selectedTripType by viewModel.homeSelectedTripType.collectAsState()

    // Dialog & Detail Modal states
    var selectedPlaceItem by remember { mutableStateOf<PlaceItem?>(null) }
    var selectedHotelItem by remember { mutableStateOf<HotelItem?>(null) }
    var selectedBeachItem by remember { mutableStateOf<BeachItem?>(null) }
    var selectedPackageItem by remember { mutableStateOf<PackageItem?>(null) }
    var selectedBlogItem by remember { mutableStateOf<BlogItem?>(null) }
    var selectedOfferItem by remember { mutableStateOf<OfferItem?>(null) }
    var selectedFlightItem by remember { mutableStateOf<FlightItem?>(null) }
    var showLocationPicker by remember { mutableStateOf(false) }
    var showEmergencyModal by remember { mutableStateOf(false) }

    // Filter tab for Destinations
    var destinationCategoryTab by remember { mutableStateOf("Popular") }

    val tripTypes = listOf(
        "Adventure", "Family", "Solo", "Couple",
        "Luxury", "Beach", "Hill Station", "Pilgrimage"
    )

    Column(
        modifier = modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(bottom = 80.dp)
    ) {
        // ================= HERO BANNER =================
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    brush = Brush.verticalGradient(
                        colors = listOf(
                            Color(0xFF0F2027),
                            Color(0xFF203A43),
                            Color(0xFF2C5364)
                        )
                    ),
                    shape = RoundedCornerShape(bottomStart = 32.dp, bottomEnd = 32.dp)
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
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "Hello, ${userProfile.name}",
                                fontSize = 22.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(text = "👋", fontSize = 20.sp)
                        }

                        // Current Location Selector Badge
                        Surface(
                            onClick = { showLocationPicker = true },
                            color = Color.White.copy(alpha = 0.15f),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.padding(top = 6.dp)
                        ) {
                            Row(
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Icon(
                                    imageVector = Icons.Filled.LocationOn,
                                    contentDescription = null,
                                    tint = Color(0xFF38BDF8),
                                    modifier = Modifier.size(14.dp)
                                )
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(
                                    text = currentLocation,
                                    fontSize = 12.sp,
                                    color = Color.White,
                                    fontWeight = FontWeight.Medium
                                )
                                Icon(
                                    imageVector = Icons.Filled.ArrowDropDown,
                                    contentDescription = null,
                                    tint = Color.White.copy(alpha = 0.7f),
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        }
                    }

                    // User Badge Icon
                    Surface(
                        onClick = { viewModel.setTab(TravelTab.PROFILE) },
                        shape = CircleShape,
                        color = Color(0xFF009688),
                        modifier = Modifier.size(46.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Icon(
                                imageVector = Icons.Filled.Person,
                                contentDescription = "Profile",
                                tint = Color.White,
                                modifier = Modifier.size(26.dp)
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(18.dp))

                Text(
                    text = "Where do you want to explore today?",
                    fontSize = 15.sp,
                    color = Color.White.copy(alpha = 0.9f),
                    fontWeight = FontWeight.Medium
                )

                Spacer(modifier = Modifier.height(16.dp))

                // ================= COMPREHENSIVE SEARCH & TRIP CONSOLE =================
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = Color(0xFF1E293B).copy(alpha = 0.92f)
                    ),
                    elevation = CardDefaults.cardElevation(defaultElevation = 10.dp)
                ) {
                    Column(modifier = Modifier.padding(18.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Filled.TravelExplore,
                                contentDescription = null,
                                tint = Color(0xFF009688),
                                modifier = Modifier.size(22.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Smart Trip Console",
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        // Current Location & Destination Row
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            // Location Input
                            OutlinedTextField(
                                value = currentLocation,
                                onValueChange = { viewModel.homeCurrentLocation.value = it },
                                label = { Text("From Location", color = Color.White.copy(alpha = 0.7f), fontSize = 11.sp) },
                                leadingIcon = { Icon(Icons.Filled.MyLocation, contentDescription = null, tint = Color(0xFF009688), modifier = Modifier.size(16.dp)) },
                                singleLine = true,
                                shape = RoundedCornerShape(14.dp),
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = Color(0xFF009688),
                                    unfocusedBorderColor = Color.White.copy(alpha = 0.25f),
                                    focusedTextColor = Color.White,
                                    unfocusedTextColor = Color.White
                                ),
                                modifier = Modifier.weight(1f)
                            )

                            // Destination Input
                            OutlinedTextField(
                                value = destinationInput,
                                onValueChange = { viewModel.homeDestination.value = it },
                                label = { Text("Destination", color = Color.White.copy(alpha = 0.7f), fontSize = 11.sp) },
                                leadingIcon = { Icon(Icons.Filled.Place, contentDescription = null, tint = Color(0xFFFF7043), modifier = Modifier.size(16.dp)) },
                                singleLine = true,
                                shape = RoundedCornerShape(14.dp),
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = Color(0xFFFF7043),
                                    unfocusedBorderColor = Color.White.copy(alpha = 0.25f),
                                    focusedTextColor = Color.White,
                                    unfocusedTextColor = Color.White
                                ),
                                modifier = Modifier.weight(1f)
                            )
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        // Dates & Days Row
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            OutlinedTextField(
                                value = startDateInput,
                                onValueChange = { viewModel.homeStartDate.value = it },
                                label = { Text("Start Date", color = Color.White.copy(alpha = 0.7f), fontSize = 11.sp) },
                                leadingIcon = { Icon(Icons.Filled.DateRange, contentDescription = null, tint = Color(0xFF38BDF8), modifier = Modifier.size(16.dp)) },
                                singleLine = true,
                                shape = RoundedCornerShape(14.dp),
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = Color(0xFF38BDF8),
                                    unfocusedBorderColor = Color.White.copy(alpha = 0.25f),
                                    focusedTextColor = Color.White,
                                    unfocusedTextColor = Color.White
                                ),
                                modifier = Modifier.weight(1f)
                            )

                            OutlinedTextField(
                                value = endDateInput,
                                onValueChange = { viewModel.homeEndDate.value = it },
                                label = { Text("End Date", color = Color.White.copy(alpha = 0.7f), fontSize = 11.sp) },
                                leadingIcon = { Icon(Icons.Filled.Event, contentDescription = null, tint = Color(0xFF38BDF8), modifier = Modifier.size(16.dp)) },
                                singleLine = true,
                                shape = RoundedCornerShape(14.dp),
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = Color(0xFF38BDF8),
                                    unfocusedBorderColor = Color.White.copy(alpha = 0.25f),
                                    focusedTextColor = Color.White,
                                    unfocusedTextColor = Color.White
                                ),
                                modifier = Modifier.weight(1f)
                            )
                        }

                        Spacer(modifier = Modifier.height(10.dp))

                        // Number of Days & Travelers Counter Row
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            // Days Counter
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("Days: ", color = Color.White.copy(alpha = 0.8f), fontSize = 12.sp)
                                IconButton(
                                    onClick = { if (numDays > 1) viewModel.homeNumDays.value = numDays - 1 },
                                    modifier = Modifier.size(28.dp)
                                ) {
                                    Icon(Icons.Filled.RemoveCircleOutline, contentDescription = null, tint = Color.White)
                                }
                                Text(
                                    text = "$numDays",
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp,
                                    modifier = Modifier.padding(horizontal = 6.dp)
                                )
                                IconButton(
                                    onClick = { viewModel.homeNumDays.value = numDays + 1 },
                                    modifier = Modifier.size(28.dp)
                                ) {
                                    Icon(Icons.Filled.AddCircleOutline, contentDescription = null, tint = Color.White)
                                }
                            }

                            // Travelers Counter
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text("Travelers: ", color = Color.White.copy(alpha = 0.8f), fontSize = 12.sp)
                                IconButton(
                                    onClick = { if (travelersCount > 1) viewModel.homeTravelersCount.value = travelersCount - 1 },
                                    modifier = Modifier.size(28.dp)
                                ) {
                                    Icon(Icons.Filled.RemoveCircleOutline, contentDescription = null, tint = Color.White)
                                }
                                Text(
                                    text = "$travelersCount ($travelParty)",
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 13.sp,
                                    modifier = Modifier.padding(horizontal = 4.dp)
                                )
                                IconButton(
                                    onClick = { viewModel.homeTravelersCount.value = travelersCount + 1 },
                                    modifier = Modifier.size(28.dp)
                                ) {
                                    Icon(Icons.Filled.AddCircleOutline, contentDescription = null, tint = Color.White)
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        // Budget Slider Section
                        Column {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "Max Daily Budget:",
                                    fontSize = 12.sp,
                                    color = Color.White.copy(alpha = 0.8f)
                                )
                                Text(
                                    text = "$${maxBudgetUSD.toInt()} / day",
                                    fontSize = 13.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF4ADE80)
                                )
                            }

                            Slider(
                                value = maxBudgetUSD,
                                onValueChange = { viewModel.homeMaxBudgetUSD.value = it },
                                valueRange = 50f..1000f,
                                colors = SliderDefaults.colors(
                                    thumbColor = Color(0xFF009688),
                                    activeTrackColor = Color(0xFF009688),
                                    inactiveTrackColor = Color.White.copy(alpha = 0.2f)
                                )
                            )
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        // Trip Type Selector Chips
                        Text(
                            text = "Trip Type Experience:",
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color.White.copy(alpha = 0.8f)
                        )

                        Spacer(modifier = Modifier.height(6.dp))

                        LazyRow(
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            items(tripTypes) { type ->
                                val isSelected = selectedTripType == type
                                FilterChip(
                                    selected = isSelected,
                                    onClick = { viewModel.homeSelectedTripType.value = type },
                                    label = { Text(type, fontSize = 11.sp) },
                                    colors = FilterChipDefaults.filterChipColors(
                                        selectedContainerColor = Color(0xFF009688),
                                        selectedLabelColor = Color.White,
                                        containerColor = Color.White.copy(alpha = 0.1f),
                                        labelColor = Color.White.copy(alpha = 0.8f)
                                    ),
                                    shape = RoundedCornerShape(12.dp)
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        // ================= AI SUGGESTION BUTTON =================
                        Button(
                            onClick = {
                                viewModel.setTab(TravelTab.AI_PLAN)
                            },
                            shape = RoundedCornerShape(16.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF009688)),
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(50.dp)
                                .testTag("ai_suggestion_button")
                        ) {
                            Icon(Icons.Filled.AutoAwesome, contentDescription = null, tint = Color.White)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "✨ Generate AI Itinerary for $destinationInput",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        }
                    }
                }
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // ================= UPCOMING ACTIVE TRIP CARD =================
        if (upcomingTrip != null) {
            UpcomingTripCard(
                trip = upcomingTrip!!,
                onViewItinerary = {
                    viewModel.showTripDetail(upcomingTrip)
                    viewModel.setTab(TravelTab.SAVED)
                },
                modifier = Modifier.padding(horizontal = 20.dp)
            ) {
                viewModel.setTab(TravelTab.AI_PLAN)
            }
            Spacer(modifier = Modifier.height(24.dp))
        }

        // ================= POPULAR / TRENDING / WEEKEND / NEARBY PLACES =================
        SectionHeader(
            title = "Explore Destinations",
            actionText = "See All Places",
            onAction = { viewModel.setTab(TravelTab.EXPLORE) }
        )

        Spacer(modifier = Modifier.height(10.dp))

        // Category Filter Row
        LazyRow(
            contentPadding = PaddingValues(horizontal = 20.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            val categories = listOf("Popular", "Trending", "Weekend", "Nearby")
            items(categories) { category ->
                val isSelected = destinationCategoryTab == category
                FilterChip(
                    selected = isSelected,
                    onClick = { destinationCategoryTab = category },
                    label = { Text(category) },
                    shape = RoundedCornerShape(16.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(12.dp))

        val filteredPlaces = remember(destinationCategoryTab, firestorePlaces) {
            firestorePlaces.filter {
                when (destinationCategoryTab) {
                    "Popular" -> it.category == "Popular" || it.rating >= 4.8
                    "Trending" -> it.category == "Trending"
                    "Weekend" -> it.category == "Weekend" || it.distanceKm <= 50
                    "Nearby" -> it.category == "Nearby" || it.distanceKm <= 20
                    else -> true
                }
            }
        }

        LazyRow(
            contentPadding = PaddingValues(horizontal = 20.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(filteredPlaces) { place ->
                PlaceItemCard(
                    place = place,
                    onClick = {
                        viewModel.addToRecentlyViewed(place)
                        selectedPlaceItem = place
                    }
                )
            }
        }

        Spacer(modifier = Modifier.height(28.dp))

        // ================= RECENTLY VIEWED & RECOMMENDED =================
        if (recentlyViewed.isNotEmpty()) {
            SectionHeader(title = "Recently Viewed")
            Spacer(modifier = Modifier.height(10.dp))
            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp),
                horizontalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                items(recentlyViewed) { place ->
                    CompactPlaceCard(
                        place = place,
                        onClick = { selectedPlaceItem = place }
                    )
                }
            }
            Spacer(modifier = Modifier.height(28.dp))
        }

        // ================= TOP BEACHES =================
        SectionHeader(title = "Top Beaches 🏖️")
        Spacer(modifier = Modifier.height(10.dp))
        LazyRow(
            contentPadding = PaddingValues(horizontal = 20.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(firestoreBeaches) { beach ->
                BeachCard(
                    beach = beach,
                    onClick = { selectedBeachItem = beach }
                )
            }
        }

        Spacer(modifier = Modifier.height(28.dp))

        // ================= TOP RESORTS & HOTELS =================
        SectionHeader(title = "Top Resorts & Hotels 🏨")
        Spacer(modifier = Modifier.height(10.dp))
        LazyRow(
            contentPadding = PaddingValues(horizontal = 20.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(firestoreHotels) { hotel ->
                HotelCard(
                    hotel = hotel,
                    onClick = { selectedHotelItem = hotel }
                )
            }
        }

        Spacer(modifier = Modifier.height(28.dp))

        // ================= POPULAR PACKAGES & OFFERS =================
        SectionHeader(title = "Travel Offers & Packages 🏷️")
        Spacer(modifier = Modifier.height(10.dp))
        LazyRow(
            contentPadding = PaddingValues(horizontal = 20.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(firestorePackages) { pkg ->
                PackageCard(
                    packageItem = pkg,
                    onClick = { selectedPackageItem = pkg }
                )
            }
        }

        Spacer(modifier = Modifier.height(28.dp))

        // Special Promo Offers Banner
        LazyRow(
            contentPadding = PaddingValues(horizontal = 20.dp),
            horizontalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            items(firestoreOffers) { offer ->
                OfferBannerCard(
                    offer = offer,
                    onClick = { selectedOfferItem = offer }
                )
            }
        }

        Spacer(modifier = Modifier.height(28.dp))

        // ================= FLIGHT DEALS =================
        SectionHeader(title = "Featured Flights ✈️")
        Spacer(modifier = Modifier.height(10.dp))
        Column(
            modifier = Modifier.padding(horizontal = 20.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            firestoreFlights.forEach { flight ->
                FlightDealRow(
                    flight = flight,
                    onClick = { selectedFlightItem = flight }
                )
            }
        }

        Spacer(modifier = Modifier.height(28.dp))

        // ================= INTERACTIVE WEATHER WIDGET =================
        SectionHeader(title = "Live Weather Radar 🌤️")
        Spacer(modifier = Modifier.height(10.dp))
        WeatherWidgetCard(
            weather = firestoreWeather,
            modifier = Modifier.padding(horizontal = 20.dp)
        )

        Spacer(modifier = Modifier.height(28.dp))

        // ================= INTERACTIVE CURRENCY CONVERTER =================
        SectionHeader(title = "Live Currency Converter 💱")
        Spacer(modifier = Modifier.height(10.dp))
        CurrencyConverterCard(modifier = Modifier.padding(horizontal = 20.dp))

        Spacer(modifier = Modifier.height(28.dp))

        // ================= TRAVEL CHECKLIST WIDGET =================
        SectionHeader(title = "Travel Checklist & Essentials 📝")
        Spacer(modifier = Modifier.height(10.dp))
        QuickChecklistWidgetCard(
            viewModel = viewModel,
            modifier = Modifier.padding(horizontal = 20.dp)
        )

        Spacer(modifier = Modifier.height(28.dp))

        // ================= MAP PREVIEW =================
        SectionHeader(title = "Interactive Map Preview 🗺️")
        Spacer(modifier = Modifier.height(10.dp))
        InteractiveMapPreviewCard(
            destinationName = destinationInput,
            lat = 35.0116,
            lng = 135.7681,
            modifier = Modifier.padding(horizontal = 20.dp)
        )

        Spacer(modifier = Modifier.height(28.dp))

        // ================= FESTIVAL CALENDAR =================
        SectionHeader(title = "Global Festival Calendar 🏮")
        Spacer(modifier = Modifier.height(10.dp))
        LazyRow(
            contentPadding = PaddingValues(horizontal = 20.dp),
            horizontalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            items(firestoreFestivals) { fest ->
                FestivalCard(festival = fest)
            }
        }

        Spacer(modifier = Modifier.height(28.dp))

        // ================= EMERGENCY CONTACTS =================
        SectionHeader(
            title = "Emergency Contacts & Support 🆘",
            actionText = "Quick Call",
            onAction = { showEmergencyModal = true }
        )
        Spacer(modifier = Modifier.height(10.dp))
        EmergencyContactWidget(
            modifier = Modifier.padding(horizontal = 20.dp),
            onOpenModal = { showEmergencyModal = true }
        )

        Spacer(modifier = Modifier.height(28.dp))

        // ================= CUSTOMER REVIEWS =================
        SectionHeader(title = "Traveler Reviews & Stories ⭐")
        Spacer(modifier = Modifier.height(10.dp))
        LazyRow(
            contentPadding = PaddingValues(horizontal = 20.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(firestoreReviews) { review ->
                ReviewCard(review = review)
            }
        }

        Spacer(modifier = Modifier.height(28.dp))

        // ================= FEATURED BLOGS & TIPS =================
        SectionHeader(title = "Featured Blogs & Travel Tips 📖")
        Spacer(modifier = Modifier.height(10.dp))
        LazyRow(
            contentPadding = PaddingValues(horizontal = 20.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(firestoreBlogs) { blog ->
                BlogCard(
                    blog = blog,
                    onClick = { selectedBlogItem = blog }
                )
            }
        }

        Spacer(modifier = Modifier.height(28.dp))

        // ================= TRAVEL NEWS =================
        SectionHeader(title = "Latest Travel News & Visa Updates 📰")
        Spacer(modifier = Modifier.height(10.dp))
        Column(
            modifier = Modifier.padding(horizontal = 20.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            firestoreNews.forEach { news ->
                TravelNewsCard(news = news)
            }
        }

        Spacer(modifier = Modifier.height(32.dp))

        // ================= FOOTER =================
        TravelNestFooter()
    }

    // ================= DETAIL MODAL DIALOGS =================
    selectedPlaceItem?.let { place ->
        PlaceDetailModal(
            place = place,
            onDismiss = { selectedPlaceItem = null },
            onPlanTrip = {
                viewModel.homeDestination.value = place.name
                selectedPlaceItem = null
                viewModel.setTab(TravelTab.AI_PLAN)
            }
        )
    }

    selectedHotelItem?.let { hotel ->
        HotelDetailModal(
            hotel = hotel,
            onDismiss = { selectedHotelItem = null }
        )
    }

    selectedBeachItem?.let { beach ->
        BeachDetailModal(
            beach = beach,
            onDismiss = { selectedBeachItem = null }
        )
    }

    selectedPackageItem?.let { pkg ->
        PackageDetailModal(
            packageItem = pkg,
            onDismiss = { selectedPackageItem = null },
            onBook = {
                selectedPackageItem = null
                viewModel.setTab(TravelTab.AI_PLAN)
            }
        )
    }

    selectedBlogItem?.let { blog ->
        BlogDetailModal(
            blog = blog,
            onDismiss = { selectedBlogItem = null }
        )
    }

    if (showEmergencyModal) {
        EmergencyModalDialog(onDismiss = { showEmergencyModal = false })
    }
}

// ================= COMPONENT CARDS =================

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
                Text(actionText, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
private fun PlaceItemCard(
    place: PlaceItem,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .width(260.dp)
            .clickable { onClick() },
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
    ) {
        Column {
            Box(modifier = Modifier.height(150.dp)) {
                AsyncImage(
                    model = place.imageUrl,
                    contentDescription = place.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
                Surface(
                    color = Color.Black.copy(alpha = 0.6f),
                    shape = RoundedCornerShape(10.dp),
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(10.dp)
                ) {
                    Row(
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(Icons.Filled.Star, contentDescription = null, tint = Color(0xFFFFB74D), modifier = Modifier.size(12.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(text = "${place.rating}", fontSize = 11.sp, color = Color.White, fontWeight = FontWeight.Bold)
                    }
                }
            }

            Column(modifier = Modifier.padding(14.dp)) {
                Text(text = place.name, fontWeight = FontWeight.Bold, fontSize = 15.sp, maxLines = 1, overflow = TextOverflow.Ellipsis)
                Text(text = place.location, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))

                Spacer(modifier = Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "$${place.pricePerNightUSD}/day",
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary,
                        fontSize = 13.sp
                    )
                    Text(
                        text = "${place.distanceKm} km away",
                        fontSize = 11.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                }
            }
        }
    }
}

@Composable
private fun CompactPlaceCard(
    place: PlaceItem,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .width(200.dp)
            .clickable { onClick() },
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
    ) {
        Row(
            modifier = Modifier.padding(10.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            AsyncImage(
                model = place.imageUrl,
                contentDescription = null,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .size(50.dp)
                    .clip(RoundedCornerShape(12.dp))
            )
            Spacer(modifier = Modifier.width(10.dp))
            Column {
                Text(place.name, fontWeight = FontWeight.Bold, fontSize = 12.sp, maxLines = 1, overflow = TextOverflow.Ellipsis)
                Text(place.location, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))
            }
        }
    }
}

@Composable
private fun BeachCard(
    beach: BeachItem,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .width(240.dp)
            .clickable { onClick() },
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column {
            Box(modifier = Modifier.height(130.dp)) {
                AsyncImage(
                    model = beach.imageUrl,
                    contentDescription = beach.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
                Surface(
                    color = Color(0xFF0284C7),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier
                        .align(Alignment.BottomStart)
                        .padding(8.dp)
                ) {
                    Text(
                        text = beach.waterColor,
                        color = Color.White,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                    )
                }
            }

            Column(modifier = Modifier.padding(12.dp)) {
                Text(beach.name, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Text(beach.location, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))
                Spacer(modifier = Modifier.height(4.dp))
                Text("Famous for: ${beach.popularFor}", fontSize = 11.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Medium)
            }
        }
    }
}

@Composable
private fun HotelCard(
    hotel: HotelItem,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .width(250.dp)
            .clickable { onClick() },
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column {
            Box(modifier = Modifier.height(130.dp)) {
                AsyncImage(
                    model = hotel.imageUrl,
                    contentDescription = hotel.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
                Surface(
                    color = Color(0xFFFF7043),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(8.dp)
                ) {
                    Text(
                        text = "${hotel.discountPercent}% OFF",
                        color = Color.White,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                    )
                }
            }

            Column(modifier = Modifier.padding(12.dp)) {
                Text(hotel.name, fontWeight = FontWeight.Bold, fontSize = 14.sp, maxLines = 1)
                Text(hotel.destination, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))
                Spacer(modifier = Modifier.height(6.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("$${hotel.pricePerNightUSD} / night", fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary, fontSize = 13.sp)
                    Text("⭐ ${hotel.rating}", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
private fun PackageCard(
    packageItem: PackageItem,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .width(260.dp)
            .clickable { onClick() },
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column {
            Box(modifier = Modifier.height(130.dp)) {
                AsyncImage(
                    model = packageItem.imageUrl,
                    contentDescription = packageItem.title,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
                Surface(
                    color = Color(0xFF009688),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier
                        .align(Alignment.TopStart)
                        .padding(8.dp)
                ) {
                    Text(
                        text = packageItem.tag,
                        color = Color.White,
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp)
                    )
                }
            }

            Column(modifier = Modifier.padding(12.dp)) {
                Text(packageItem.title, fontWeight = FontWeight.Bold, fontSize = 13.sp, maxLines = 1)
                Text("${packageItem.durationDays} Days • ${packageItem.destination}", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))
                Spacer(modifier = Modifier.height(6.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("$${packageItem.priceUSD}", fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary, fontSize = 14.sp)
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("$${packageItem.originalPriceUSD}", fontSize = 11.sp, color = Color.Gray, textDecoration = androidx.compose.ui.text.style.TextDecoration.LineThrough)
                }
            }
        }
    }
}

@Composable
private fun OfferBannerCard(
    offer: OfferItem,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .width(280.dp)
            .clickable { onClick() },
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF0F172A))
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Filled.LocalOffer,
                contentDescription = null,
                tint = Color(0xFFFFB74D),
                modifier = Modifier.size(32.dp)
            )
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                Text(offer.title, fontWeight = FontWeight.Bold, fontSize = 13.sp, color = Color.White)
                Text(offer.discountText, fontSize = 11.sp, color = Color.White.copy(alpha = 0.8f))
                Spacer(modifier = Modifier.height(4.dp))
                Surface(
                    color = Color.White.copy(alpha = 0.2f),
                    shape = RoundedCornerShape(6.dp)
                ) {
                    Text("CODE: ${offer.promoCode}", color = Color(0xFF38BDF8), fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
                }
            }
        }
    }
}

@Composable
private fun FlightDealRow(
    flight: FlightItem,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Row(
            modifier = Modifier.padding(14.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text("${flight.origin} ➔ ${flight.destination}", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                Text("${flight.airline} • ${flight.departureTime} • ${flight.stops}", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))
            }

            Column(horizontalAlignment = Alignment.End) {
                Text("$${flight.priceUSD}", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = MaterialTheme.colorScheme.primary)
                Text("${flight.durationHours} hrs", fontSize = 10.sp, color = Color.Gray)
            }
        }
    }
}

@Composable
private fun WeatherWidgetCard(
    weather: WeatherItem,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
    ) {
        Row(
            modifier = Modifier.padding(18.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(weather.city, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                Text(weather.condition, fontSize = 13.sp)
                Spacer(modifier = Modifier.height(4.dp))
                Text(weather.advisory, fontSize = 11.sp, color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f))
            }

            Column(horizontalAlignment = Alignment.End) {
                Text("${weather.tempC}°C", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                Text("Humidity: ${weather.humidityPercent}%", fontSize = 11.sp)
            }
        }
    }
}

@Composable
private fun CurrencyConverterCard(modifier: Modifier = Modifier) {
    var amountUSD by remember { mutableStateOf("100") }
    var selectedTargetCurrency by remember { mutableStateOf("JPY") }

    val exchangeRates = mapOf(
        "JPY" to 155.2f,
        "EUR" to 0.92f,
        "GBP" to 0.78f,
        "INR" to 83.5f,
        "AUD" to 1.52f
    )

    val rate = exchangeRates[selectedTargetCurrency] ?: 1.0f
    val convertedValue = (amountUSD.toFloatOrNull() ?: 0f) * rate

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Exchange Rate Calculator", fontWeight = FontWeight.Bold, fontSize = 14.sp)
            Spacer(modifier = Modifier.height(10.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedTextField(
                    value = amountUSD,
                    onValueChange = { amountUSD = it },
                    label = { Text("USD ($)") },
                    singleLine = true,
                    shape = RoundedCornerShape(12.dp),
                    modifier = Modifier.weight(1f)
                )

                Icon(Icons.Filled.SwapHoriz, contentDescription = null, tint = MaterialTheme.colorScheme.primary)

                Column(modifier = Modifier.weight(1f)) {
                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        exchangeRates.keys.take(3).forEach { curr ->
                            FilterChip(
                                selected = selectedTargetCurrency == curr,
                                onClick = { selectedTargetCurrency = curr },
                                label = { Text(curr, fontSize = 10.sp) }
                            )
                        }
                    }
                    Text(
                        text = "≈ %.2f %s".format(convertedValue, selectedTargetCurrency),
                        fontWeight = FontWeight.Bold,
                        fontSize = 15.sp,
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            }
        }
    }
}

@Composable
private fun QuickChecklistWidgetCard(
    viewModel: MainViewModel,
    modifier: Modifier = Modifier
) {
    val packingItems by viewModel.currentPackingItems.collectAsState()

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text("Essential Travel Checklist", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                TextButton(onClick = { viewModel.setTab(TravelTab.SAVED) }) {
                    Text("Full List", fontSize = 12.sp)
                }
            }

            if (packingItems.isEmpty()) {
                Text("Passport, Universal Adapter, Comfortable Shoes, Travel Insurance.", fontSize = 12.sp, color = Color.Gray)
            } else {
                packingItems.take(3).forEach { item ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clickable { viewModel.togglePackingItem(item) }
                            .padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Checkbox(
                            checked = item.isPacked,
                            onCheckedChange = { viewModel.togglePackingItem(item) },
                            modifier = Modifier.size(28.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = item.itemName,
                            fontSize = 13.sp,
                            textDecoration = if (item.isPacked) androidx.compose.ui.text.style.TextDecoration.LineThrough else null
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun InteractiveMapPreviewCard(
    destinationName: String,
    lat: Double,
    lng: Double,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B))
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text("Destination Location Map", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color.White)
                    Text("$destinationName ($lat, $lng)", fontSize = 11.sp, color = Color.White.copy(alpha = 0.7f))
                }
                Icon(Icons.Filled.Map, contentDescription = null, tint = Color(0xFF38BDF8))
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Simulated Styled Canvas Map Box
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(120.dp)
                    .clip(RoundedCornerShape(14.dp))
                    .background(Color(0xFF0F172A)),
                contentAlignment = Alignment.Center
            ) {
                Canvas(modifier = Modifier.fillMaxSize()) {
                    val width = size.width
                    val height = size.height

                    // Grid lines simulating map streets
                    drawLine(Color.White.copy(alpha = 0.1f), Offset(0f, height * 0.3f), Offset(width, height * 0.3f), strokeWidth = 3f)
                    drawLine(Color.White.copy(alpha = 0.1f), Offset(0f, height * 0.7f), Offset(width, height * 0.7f), strokeWidth = 3f)
                    drawLine(Color.White.copy(alpha = 0.1f), Offset(width * 0.4f, 0f), Offset(width * 0.4f, height), strokeWidth = 3f)

                    // Destination Marker
                    drawCircle(Color(0xFFEF4444), radius = 16f, center = Offset(width * 0.5f, height * 0.5f))
                    drawCircle(Color.White, radius = 6f, center = Offset(width * 0.5f, height * 0.5f))
                }

                Surface(
                    color = Color.Black.copy(alpha = 0.7f),
                    shape = RoundedCornerShape(8.dp),
                    modifier = Modifier
                        .align(Alignment.BottomEnd)
                        .padding(8.dp)
                ) {
                    Text("Tap to open Google Maps", color = Color.White, fontSize = 10.sp, modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp))
                }
            }
        }
    }
}

@Composable
private fun FestivalCard(festival: FestivalItem) {
    Card(
        modifier = Modifier.width(220.dp),
        shape = RoundedCornerShape(18.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(festival.icon, fontSize = 24.sp)
                Spacer(modifier = Modifier.width(8.dp))
                Column {
                    Text(festival.name, fontWeight = FontWeight.Bold, fontSize = 13.sp, maxLines = 1)
                    Text(festival.location, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f))
                }
            }
            Spacer(modifier = Modifier.height(8.dp))
            Surface(
                color = MaterialTheme.colorScheme.primaryContainer,
                shape = RoundedCornerShape(6.dp)
            ) {
                Text(festival.monthDate, fontSize = 10.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp))
            }
            Spacer(modifier = Modifier.height(6.dp))
            Text(festival.description, fontSize = 11.sp, maxLines = 2, overflow = TextOverflow.Ellipsis)
        }
    }
}

@Composable
private fun EmergencyContactWidget(
    modifier: Modifier = Modifier,
    onOpenModal: () -> Unit
) {
    Card(
        modifier = modifier
            .fillMaxWidth()
            .clickable { onOpenModal() },
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = Color(0xFFFEF2F2))
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Filled.Shield, contentDescription = null, tint = Color(0xFFEF4444), modifier = Modifier.size(28.dp))
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Text("Global Emergency Contacts", fontWeight = FontWeight.Bold, fontSize = 14.sp, color = Color(0xFF991B1B))
                    Text("Police 112/911 • Ambulance 108 • Embassy", fontSize = 11.sp, color = Color(0xFFB91C1C))
                }
            }
            Icon(Icons.Filled.PhoneInTalk, contentDescription = null, tint = Color(0xFFEF4444))
        }
    }
}

@Composable
private fun ReviewCard(review: ReviewItem) {
    Card(
        modifier = Modifier.width(260.dp),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                AsyncImage(
                    model = review.avatarUrl,
                    contentDescription = review.userName,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .size(38.dp)
                        .clip(CircleShape)
                )
                Spacer(modifier = Modifier.width(10.dp))
                Column {
                    Text(review.userName, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    Text(review.userBadge, fontSize = 10.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.SemiBold)
                }
            }

            Spacer(modifier = Modifier.height(10.dp))

            Text("⭐".repeat(review.rating.toInt()), fontSize = 12.sp)
            Text(review.title, fontWeight = FontWeight.Bold, fontSize = 13.sp, modifier = Modifier.padding(vertical = 4.dp))
            Text(review.comment, fontSize = 11.sp, maxLines = 3, overflow = TextOverflow.Ellipsis, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.8f))
        }
    }
}

@Composable
private fun BlogCard(
    blog: BlogItem,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .width(260.dp)
            .clickable { onClick() },
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column {
            AsyncImage(
                model = blog.imageUrl,
                contentDescription = blog.title,
                contentScale = ContentScale.Crop,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(130.dp)
            )

            Column(modifier = Modifier.padding(14.dp)) {
                Text(blog.category, fontSize = 10.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
                Text(blog.title, fontWeight = FontWeight.Bold, fontSize = 13.sp, maxLines = 2, overflow = TextOverflow.Ellipsis)
                Spacer(modifier = Modifier.height(6.dp))
                Text("${blog.readTimeMinutes} min read • By ${blog.author}", fontSize = 11.sp, color = Color.Gray)
            }
        }
    }
}

@Composable
private fun TravelNewsCard(news: TravelNewsItem) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(news.category, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                Text(news.timeAgo, fontSize = 10.sp, color = Color.Gray)
            }
            Spacer(modifier = Modifier.height(4.dp))
            Text(news.title, fontWeight = FontWeight.Bold, fontSize = 13.sp)
            Spacer(modifier = Modifier.height(4.dp))
            Text(news.snippet, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.75f))
        }
    }
}

@Composable
private fun TravelNestFooter() {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color(0xFF0F172A))
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.Filled.FlightTakeoff, contentDescription = null, tint = Color(0xFF009688))
            Spacer(modifier = Modifier.width(8.dp))
            Text("TravelNest AI Concierge", color = Color.White, fontWeight = FontWeight.Bold, fontSize = 18.sp)
        }

        Spacer(modifier = Modifier.height(8.dp))

        Text("Your AI-Powered Gateway to Global Adventures & Seamless Trip Vaults", color = Color.White.copy(alpha = 0.7f), fontSize = 12.sp)

        Spacer(modifier = Modifier.height(16.dp))

        Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            Text("Terms of Service", color = Color(0xFF38BDF8), fontSize = 11.sp)
            Text("Privacy Policy", color = Color(0xFF38BDF8), fontSize = 11.sp)
            Text("24/7 Support", color = Color(0xFF38BDF8), fontSize = 11.sp)
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text("© 2026 TravelNest Technologies. All rights reserved.", color = Color.White.copy(alpha = 0.4f), fontSize = 10.sp)
    }
}

@Composable
private fun UpcomingTripCard(
    trip: TripEntity,
    onViewItinerary: () -> Unit,
    modifier: Modifier = Modifier,
    onCreateNew: () -> Unit
) {
    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(24.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    brush = Brush.horizontalGradient(
                        listOf(Color(0xFF0F2027), Color(0xFF203A43), Color(0xFF2C5364))
                    )
                )
                .padding(20.dp)
        ) {
            Column {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Surface(
                        color = Color(0xFFFFB74D),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text(
                            text = "ACTIVE TRIP VAULT",
                            color = Color.Black,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                        )
                    }

                    IconButton(
                        onClick = onCreateNew,
                        modifier = Modifier.size(32.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Filled.AddCircle,
                            contentDescription = "New Plan",
                            tint = Color.White
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = trip.title,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )

                Spacer(modifier = Modifier.height(4.dp))

                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Filled.DateRange,
                        contentDescription = null,
                        tint = Color.White.copy(alpha = 0.8f),
                        modifier = Modifier.size(14.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "${trip.durationDays} Days • ${trip.vibe} Vibe • ${trip.budgetLevel}",
                        fontSize = 12.sp,
                        color = Color.White.copy(alpha = 0.8f)
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                Button(
                    onClick = onViewItinerary,
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF009688)),
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("view_upcoming_itinerary_button")
                ) {
                    Text("View Day-by-Day Itinerary & Vault", fontWeight = FontWeight.Bold, color = Color.White)
                    Spacer(modifier = Modifier.width(8.dp))
                    Icon(Icons.Filled.ArrowForward, contentDescription = null, modifier = Modifier.size(16.dp))
                }
            }
        }
    }
}

// ================= MODAL DIALOGS =================

@Composable
private fun PlaceDetailModal(
    place: PlaceItem,
    onDismiss: () -> Unit,
    onPlanTrip: () -> Unit
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(place.name, fontWeight = FontWeight.Bold) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("${place.location} • ${place.tripType} Experience", fontSize = 12.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
                Text(place.description, fontSize = 12.sp)
                Spacer(modifier = Modifier.height(4.dp))
                Text("Top Highlights:", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                place.highlights.forEach { hl ->
                    Text("• $hl", fontSize = 11.sp)
                }
                Text("Best time: ${place.bestTimeToVisit}", fontSize = 11.sp, color = Color.Gray)
            }
        },
        confirmButton = {
            Button(onClick = onPlanTrip, shape = RoundedCornerShape(12.dp)) {
                Text("Plan AI Trip Here")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Close") }
        }
    )
}

@Composable
private fun HotelDetailModal(hotel: HotelItem, onDismiss: () -> Unit) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(hotel.name, fontWeight = FontWeight.Bold) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("${hotel.destination} • ⭐ ${hotel.rating}", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                Text("Price: $${hotel.pricePerNightUSD} / night (${hotel.discountPercent}% OFF applied)", fontSize = 13.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
                Text("Amenities: ${hotel.amenities.joinToString(", ")}", fontSize = 12.sp)
            }
        },
        confirmButton = {
            Button(onClick = onDismiss, shape = RoundedCornerShape(12.dp)) { Text("Book Room Deal") }
        },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Close") } }
    )
}

@Composable
private fun BeachDetailModal(beach: BeachItem, onDismiss: () -> Unit) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(beach.name, fontWeight = FontWeight.Bold) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("${beach.location} • Water: ${beach.waterColor}", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                Text(beach.highlights, fontSize = 12.sp)
            }
        },
        confirmButton = { Button(onClick = onDismiss) { Text("Close") } }
    )
}

@Composable
private fun PackageDetailModal(packageItem: PackageItem, onDismiss: () -> Unit, onBook: () -> Unit) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(packageItem.title, fontWeight = FontWeight.Bold) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("${packageItem.durationDays} Days All-Inclusive in ${packageItem.destination}", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                Text("Price: $${packageItem.priceUSD} (Was $${packageItem.originalPriceUSD})", fontSize = 14.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
                Text("Inclusions:", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                packageItem.inclusions.forEach { inc -> Text("✓ $inc", fontSize = 11.sp) }
            }
        },
        confirmButton = { Button(onClick = onBook) { Text("Book Package") } },
        dismissButton = { TextButton(onClick = onDismiss) { Text("Close") } }
    )
}

@Composable
private fun BlogDetailModal(blog: BlogItem, onDismiss: () -> Unit) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text(blog.title, fontWeight = FontWeight.Bold) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Text("By ${blog.author} • ${blog.publishedDate}", fontSize = 11.sp, color = Color.Gray)
                Text(blog.content, fontSize = 12.sp)
            }
        },
        confirmButton = { Button(onClick = onDismiss) { Text("Close") } }
    )
}

@Composable
private fun EmergencyModalDialog(onDismiss: () -> Unit) {
    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Global Tourist Helpline", fontWeight = FontWeight.Bold, color = Color(0xFF991B1B)) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Text("• International Police: 112 / 911", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                Text("• Medical Emergency: 108", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                Text("• Tourist Passport Lost Desk: +1-800-555-SAFE", fontSize = 12.sp)
                Text("• TravelNest 24/7 Concierge: support@travelnest.ai", fontSize = 12.sp)
            }
        },
        confirmButton = { Button(onClick = onDismiss) { Text("Close") } }
    )
}
