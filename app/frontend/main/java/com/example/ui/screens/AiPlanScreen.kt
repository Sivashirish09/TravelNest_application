package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ai.GeminiTripService
import com.example.data.DayItinerary
import com.example.data.TripEntity
import com.example.ui.MainViewModel
import com.example.ui.TravelTab

@Composable
fun AiPlanScreen(
    viewModel: MainViewModel,
    modifier: Modifier = Modifier
) {
    val isGenerating by viewModel.isGenerating.collectAsState()
    val aiStatusText by viewModel.aiStatusText.collectAsState()
    val activeGeneratedTrip by viewModel.activeGeneratedTrip.collectAsState()

    var destinationInput by remember { mutableStateOf("Kyoto") }
    var durationDays by remember { mutableStateOf(5) }
    var budgetLevel by remember { mutableStateOf("Moderate") }
    var selectedVibe by remember { mutableStateOf("Cultural") }
    var partyType by remember { mutableStateOf("Couple") }
    var selectedInterests by remember { mutableStateOf(setOf("Historic Sights", "Food & Tea")) }

    val surpriseDestinations = listOf("Kyoto, Japan", "Amalfi Coast, Italy", "Santorini, Greece", "Banff, Canada", "Interlaken, Switzerland", "Ubud, Bali")

    val scrollState = rememberScrollState()

    Scaffold(
        modifier = modifier
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .verticalScroll(scrollState)
                .padding(bottom = 90.dp)
        ) {
            // Header
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.surface)
                    .statusBarsPadding()
                    .padding(horizontal = 20.dp, vertical = 12.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Filled.AutoAwesome,
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(28.dp)
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(
                        text = "AI Smart Trip Planner",
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
                Text(
                    text = "Powered by Gemini AI • Tailored day-by-day itineraries",
                    fontSize = 13.sp,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.65f)
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            if (isGenerating) {
                // Loading View
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(20.dp),
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 6.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(32.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        CircularProgressIndicator(
                            color = MaterialTheme.colorScheme.primary,
                            strokeWidth = 4.dp,
                            modifier = Modifier.size(56.dp)
                        )
                        Spacer(modifier = Modifier.height(24.dp))
                        Text(
                            text = "Crafting Your Dream Trip",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = aiStatusText,
                            fontSize = 13.sp,
                            color = MaterialTheme.colorScheme.primary,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            } else if (activeGeneratedTrip != null) {
                // Show Result View
                GeneratedTripResultView(
                    trip = activeGeneratedTrip!!,
                    onPlanAnother = { viewModel.generateAiPlan("Paris", 4, "Moderate", "Cultural", "Solo", listOf("Art")) },
                    onGoToSaved = { viewModel.setTab(TravelTab.SAVED) }
                )
            } else {
                // Input Form
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp),
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        // Destination Input
                        Column {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(text = "1. Where do you want to go?", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                                TextButton(onClick = { destinationInput = surpriseDestinations.random() }) {
                                    Text("Surprise Me! 🎲", fontSize = 12.sp, color = MaterialTheme.colorScheme.primary)
                                }
                            }

                            OutlinedTextField(
                                value = destinationInput,
                                onValueChange = { destinationInput = it },
                                leadingIcon = { Icon(Icons.Filled.Place, contentDescription = null) },
                                placeholder = { Text("e.g. Kyoto, Paris, Cancun") },
                                singleLine = true,
                                shape = RoundedCornerShape(16.dp),
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .testTag("ai_planner_destination_input")
                            )
                        }

                        // Duration Slider
                        Column {
                            Text(
                                text = "2. How many days? ($durationDays Days)",
                                fontWeight = FontWeight.Bold,
                                fontSize = 15.sp
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Slider(
                                value = durationDays.toFloat(),
                                onValueChange = { durationDays = it.toInt() },
                                valueRange = 1f..10f,
                                steps = 8,
                                colors = SliderDefaults.colors(
                                    thumbColor = MaterialTheme.colorScheme.primary,
                                    activeTrackColor = MaterialTheme.colorScheme.primary
                                )
                            )
                        }

                        // Budget Tier Selection
                        Column {
                            Text(text = "3. What is your budget level?", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                            Spacer(modifier = Modifier.height(8.dp))
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                listOf("Backpacker", "Moderate", "Luxury").forEach { b ->
                                    FilterChip(
                                        selected = b == budgetLevel,
                                        onClick = { budgetLevel = b },
                                        label = { Text(b) },
                                        modifier = Modifier.weight(1f)
                                    )
                                }
                            }
                        }

                        // Travel Party & Vibe
                        Column {
                            Text(text = "4. Travel Vibe", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                            Spacer(modifier = Modifier.height(8.dp))
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                listOf("Cultural", "Relaxed", "Adventure", "Foodie").forEach { v ->
                                    FilterChip(
                                        selected = v == selectedVibe,
                                        onClick = { selectedVibe = v },
                                        label = { Text(v) },
                                        modifier = Modifier.weight(1f)
                                    )
                                }
                            }
                        }

                        // Party Type
                        Column {
                            Text(text = "5. Travel Party", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                            Spacer(modifier = Modifier.height(8.dp))
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                listOf("Solo", "Couple", "Family", "Friends").forEach { p ->
                                    FilterChip(
                                        selected = p == partyType,
                                        onClick = { partyType = p },
                                        label = { Text(p) },
                                        modifier = Modifier.weight(1f)
                                    )
                                }
                            }
                        }

                        // Interests Multi-select
                        Column {
                            Text(text = "6. Key Interests", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                            Spacer(modifier = Modifier.height(8.dp))
                            val interestsList = listOf("Historic Sights", "Food & Tea", "Gardens", "Nightlife", "Shopping", "Wellness")
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(6.dp)
                            ) {
                                interestsList.take(3).forEach { interest ->
                                    val isSel = selectedInterests.contains(interest)
                                    FilterChip(
                                        selected = isSel,
                                        onClick = {
                                            selectedInterests = if (isSel) selectedInterests - interest else selectedInterests + interest
                                        },
                                        label = { Text(interest, fontSize = 11.sp) }
                                    )
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        // Generate CTA Button
                        Button(
                            onClick = {
                                if (destinationInput.isNotBlank()) {
                                    viewModel.generateAiPlan(
                                        destination = destinationInput,
                                        durationDays = durationDays,
                                        budgetLevel = budgetLevel,
                                        vibe = selectedVibe,
                                        party = partyType,
                                        interests = selectedInterests.toList()
                                    )
                                }
                            },
                            shape = RoundedCornerShape(16.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary),
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(54.dp)
                                .testTag("generate_ai_plan_button")
                        ) {
                            Icon(Icons.Filled.AutoAwesome, contentDescription = null)
                            Spacer(modifier = Modifier.width(8.dp))
                            Text("Generate Smart Itinerary with Gemini AI", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun GeneratedTripResultView(
    trip: TripEntity,
    onPlanAnother: () -> Unit,
    onGoToSaved: () -> Unit
) {
    val daysList = remember(trip.itineraryJson) {
        GeminiTripService.deserializeDays(trip.itineraryJson)
    }

    Column(
        modifier = Modifier.padding(horizontal = 20.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
        ) {
            Column(modifier = Modifier.padding(20.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "AI ITINERARY READY",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Text(
                        text = "Total Est: $${trip.totalEstimatedCost.toInt()}",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = trip.title,
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold
                )

                Text(
                    text = "${trip.destination} • ${trip.durationDays} Days • ${trip.vibe}",
                    fontSize = 13.sp,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                )

                Spacer(modifier = Modifier.height(14.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Button(
                        onClick = onGoToSaved,
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("View in Saved Vault")
                    }
                }
            }
        }

        Text(
            text = "Day-by-Day Gemini Itinerary",
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold
        )

        daysList.forEach { day ->
            DayItineraryCard(day = day)
        }
    }
}

@Composable
fun DayItineraryCard(day: DayItinerary) {
    var expanded by remember { mutableStateOf(true) }

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 3.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .padding(4.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Surface(
                        color = MaterialTheme.colorScheme.primary,
                        shape = CircleShape,
                        modifier = Modifier.size(32.dp)
                    ) {
                        Box(contentAlignment = Alignment.Center) {
                            Text(
                                text = "${day.dayNumber}",
                                color = Color.White,
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp
                            )
                        }
                    }

                    Spacer(modifier = Modifier.width(12.dp))

                    Column {
                        Text(
                            text = "Day ${day.dayNumber}: ${day.theme}",
                            fontWeight = FontWeight.Bold,
                            fontSize = 15.sp
                        )
                        Text(
                            text = "Foodie Spot: ${day.foodieSpot}",
                            fontSize = 11.sp,
                            color = MaterialTheme.colorScheme.primary
                        )
                    }
                }

                IconButton(onClick = { expanded = !expanded }) {
                    Icon(
                        imageVector = if (expanded) Icons.Filled.ExpandLess else Icons.Filled.ExpandMore,
                        contentDescription = "Expand"
                    )
                }
            }

            AnimatedVisibility(visible = expanded) {
                Column(
                    modifier = Modifier.padding(top = 12.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    ActivityRow(time = day.morningActivity.time, title = day.morningActivity.title, desc = day.morningActivity.description, cost = day.morningActivity.estCostUSD)
                    ActivityRow(time = day.afternoonActivity.time, title = day.afternoonActivity.title, desc = day.afternoonActivity.description, cost = day.afternoonActivity.estCostUSD)
                    ActivityRow(time = day.eveningActivity.time, title = day.eveningActivity.title, desc = day.eveningActivity.description, cost = day.eveningActivity.estCostUSD)

                    Spacer(modifier = Modifier.height(4.dp))

                    Surface(
                        color = Color(0xFFFFB74D).copy(alpha = 0.15f),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(10.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(Icons.Filled.TipsAndUpdates, contentDescription = null, tint = Color(0xFFF57C00), modifier = Modifier.size(18.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(text = "Insider Tip: ${day.insiderTip}", fontSize = 12.sp, fontWeight = FontWeight.Medium)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ActivityRow(time: String, title: String, desc: String, cost: Int) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.Top
    ) {
        Surface(
            color = MaterialTheme.colorScheme.surfaceVariant,
            shape = RoundedCornerShape(8.dp)
        ) {
            Text(
                text = time,
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
            )
        }

        Spacer(modifier = Modifier.width(10.dp))

        Column(modifier = Modifier.weight(1f)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(text = title, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                Text(text = "~$$cost", fontSize = 12.sp, color = MaterialTheme.colorScheme.primary, fontWeight = FontWeight.Bold)
            }
            Text(text = desc, fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.75f))
        }
    }
}
