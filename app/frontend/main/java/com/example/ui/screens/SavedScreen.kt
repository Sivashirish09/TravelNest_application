package com.example.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
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
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.ai.GeminiTripService
import com.example.data.BudgetItemEntity
import com.example.data.PackingItemEntity
import com.example.data.TripEntity
import com.example.ui.MainViewModel
import com.example.ui.components.DestinationCard

@Composable
fun SavedScreen(
    viewModel: MainViewModel,
    modifier: Modifier = Modifier
) {
    val trips by viewModel.allTrips.collectAsState()
    val favoriteDestinations by viewModel.favoriteDestinations.collectAsState()
    val packingItems by viewModel.currentPackingItems.collectAsState()
    val budgetItems by viewModel.currentBudgetItems.collectAsState()

    var selectedSubTab by remember { mutableStateOf("Itineraries") }
    var showAddPackingDialog by remember { mutableStateOf(false) }
    var showAddBudgetDialog by remember { mutableStateOf(false) }

    val subTabs = listOf("Itineraries", "Checklist", "Budget", "Favorites")

    Scaffold(
        modifier = modifier
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            // Header
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(MaterialTheme.colorScheme.surface)
                    .statusBarsPadding()
                    .padding(horizontal = 20.dp, vertical = 12.dp)
            ) {
                Text(
                    text = "My Travel Vault",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "Saved itineraries, packing checklists & budget manager",
                    fontSize = 13.sp,
                    color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.65f)
                )

                Spacer(modifier = Modifier.height(14.dp))

                // SubTab Row
                TabRow(
                    selectedTabIndex = subTabs.indexOf(selectedSubTab),
                    containerColor = Color.Transparent,
                    contentColor = MaterialTheme.colorScheme.primary
                ) {
                    subTabs.forEach { tabName ->
                        Tab(
                            selected = tabName == selectedSubTab,
                            onClick = { selectedSubTab = tabName },
                            text = { Text(tabName, fontWeight = FontWeight.Bold, fontSize = 13.sp) }
                        )
                    }
                }
            }

            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 20.dp, vertical = 12.dp)
            ) {
                when (selectedSubTab) {
                    "Itineraries" -> SavedItinerariesTab(trips = trips, viewModel = viewModel)
                    "Checklist" -> PackingChecklistTab(
                        items = packingItems,
                        onToggle = { viewModel.togglePackingItem(it) },
                        onDelete = { viewModel.deletePackingItem(it) },
                        onAddItemClick = { showAddPackingDialog = true }
                    )
                    "Budget" -> BudgetTrackerTab(
                        items = budgetItems,
                        onDelete = { viewModel.deleteBudgetItem(it) },
                        onAddExpenseClick = { showAddBudgetDialog = true }
                    )
                    "Favorites" -> SavedFavoritesTab(
                        favorites = favoriteDestinations,
                        onCardClick = { viewModel.showDestinationDetail(it) },
                        onFavoriteToggle = { viewModel.toggleDestinationFavorite(it) }
                    )
                }
            }
        }

        // Add Packing Item Dialog
        if (showAddPackingDialog) {
            AddPackingItemDialog(
                onDismiss = { showAddPackingDialog = false },
                onSubmit = { name, cat ->
                    viewModel.addPackingItem(name, cat)
                    showAddPackingDialog = false
                }
            )
        }

        // Add Budget Item Dialog
        if (showAddBudgetDialog) {
            AddBudgetItemDialog(
                onDismiss = { showAddBudgetDialog = false },
                onSubmit = { title, amount, cat ->
                    viewModel.addBudgetItem(title, amount, cat)
                    showAddBudgetDialog = false
                }
            )
        }
    }
}

@Composable
private fun SavedItinerariesTab(trips: List<TripEntity>, viewModel: MainViewModel) {
    if (trips.isEmpty()) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("No saved itineraries yet.", color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
        }
    } else {
        LazyColumn(
            contentPadding = PaddingValues(bottom = 90.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(trips) { trip ->
                val daysList = remember(trip.itineraryJson) {
                    GeminiTripService.deserializeDays(trip.itineraryJson)
                }
                var expanded by remember { mutableStateOf(false) }

                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
                    elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column(modifier = Modifier.weight(1f)) {
                                Text(text = trip.title, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                                Text(
                                    text = "${trip.destination} • ${trip.durationDays} Days • Est $${trip.totalEstimatedCost.toInt()}",
                                    fontSize = 12.sp,
                                    color = MaterialTheme.colorScheme.primary
                                )
                            }

                            Row {
                                IconButton(onClick = { viewModel.deleteTrip(trip) }) {
                                    Icon(Icons.Filled.DeleteOutline, contentDescription = "Delete", tint = Color.Gray)
                                }
                                IconButton(onClick = { expanded = !expanded }) {
                                    Icon(
                                        imageVector = if (expanded) Icons.Filled.ExpandLess else Icons.Filled.ExpandMore,
                                        contentDescription = "Expand"
                                    )
                                }
                            }
                        }

                        AnimatedVisibility(visible = expanded) {
                            Column(
                                modifier = Modifier.padding(top = 12.dp),
                                verticalArrangement = Arrangement.spacedBy(12.dp)
                            ) {
                                daysList.forEach { day ->
                                    DayItineraryCard(day = day)
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun PackingChecklistTab(
    items: List<PackingItemEntity>,
    onToggle: (PackingItemEntity) -> Unit,
    onDelete: (PackingItemEntity) -> Unit,
    onAddItemClick: () -> Unit
) {
    val packedCount = items.count { it.isPacked }
    val progress = if (items.isNotEmpty()) packedCount.toFloat() / items.size else 0f

    Column {
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(text = "Packing Completion", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                    Text(text = "$packedCount / ${items.size} Packed", fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                }

                Spacer(modifier = Modifier.height(8.dp))

                LinearProgressIndicator(
                    progress = { progress },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(8.dp)
                        .clip(RoundedCornerShape(4.dp)),
                    color = MaterialTheme.colorScheme.primary
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(text = "Checklist Items", fontWeight = FontWeight.Bold, fontSize = 16.sp)
            IconButton(
                onClick = onAddItemClick,
                modifier = Modifier
                    .size(36.dp)
                    .background(MaterialTheme.colorScheme.primary, CircleShape)
            ) {
                Icon(Icons.Filled.Add, contentDescription = "Add Item", tint = Color.White)
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        LazyColumn(
            contentPadding = PaddingValues(bottom = 90.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(items) { item ->
                Card(
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 12.dp, vertical = 8.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Checkbox(
                                checked = item.isPacked,
                                onCheckedChange = { onToggle(item) }
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text(
                                    text = item.itemName,
                                    fontWeight = FontWeight.Medium,
                                    textDecoration = if (item.isPacked) TextDecoration.LineThrough else TextDecoration.None
                                )
                                Text(text = item.category, fontSize = 10.sp, color = Color.Gray)
                            }
                        }

                        IconButton(onClick = { onDelete(item) }) {
                            Icon(Icons.Filled.Close, contentDescription = "Delete", tint = Color.Gray, modifier = Modifier.size(18.dp))
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun BudgetTrackerTab(
    items: List<BudgetItemEntity>,
    onDelete: (BudgetItemEntity) -> Unit,
    onAddExpenseClick: () -> Unit
) {
    val totalSpent = items.sumOf { it.amount }

    Column {
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(20.dp),
            colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(text = "Total Recorded Expenses", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                Text(text = "$${String.format("%.2f", totalSpent)}", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(text = "Expense Log", fontWeight = FontWeight.Bold, fontSize = 16.sp)
            IconButton(
                onClick = onAddExpenseClick,
                modifier = Modifier
                    .size(36.dp)
                    .background(MaterialTheme.colorScheme.primary, CircleShape)
            ) {
                Icon(Icons.Filled.Add, contentDescription = "Add Expense", tint = Color.White)
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        LazyColumn(
            contentPadding = PaddingValues(bottom = 90.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(items) { item ->
                Card(
                    shape = RoundedCornerShape(14.dp),
                    colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(text = item.title, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            Text(text = "${item.category} • ${item.date}", fontSize = 11.sp, color = Color.Gray)
                        }

                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(text = "$${String.format("%.2f", item.amount)}", fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                            IconButton(onClick = { onDelete(item) }) {
                                Icon(Icons.Filled.DeleteOutline, contentDescription = null, tint = Color.Gray, modifier = Modifier.size(18.dp))
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun SavedFavoritesTab(
    favorites: List<com.example.data.DestinationEntity>,
    onCardClick: (com.example.data.DestinationEntity) -> Unit,
    onFavoriteToggle: (com.example.data.DestinationEntity) -> Unit
) {
    if (favorites.isEmpty()) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("No favorite destinations bookmarked.", color = Color.Gray)
        }
    } else {
        LazyColumn(
            contentPadding = PaddingValues(bottom = 90.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            items(favorites) { dest ->
                DestinationCard(
                    destination = dest,
                    onCardClick = { onCardClick(dest) },
                    onFavoriteToggle = { onFavoriteToggle(dest) }
                )
            }
        }
    }
}

@Composable
private fun AddPackingItemDialog(
    onDismiss: () -> Unit,
    onSubmit: (String, String) -> Unit
) {
    var name by remember { mutableStateOf("") }
    var category by remember { mutableStateOf("Clothing") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Add Packing Item") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Item Name") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(onClick = { if (name.isNotBlank()) onSubmit(name, category) }) {
                Text("Add")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel") }
        }
    )
}

@Composable
private fun AddBudgetItemDialog(
    onDismiss: () -> Unit,
    onSubmit: (String, Double, String) -> Unit
) {
    var title by remember { mutableStateOf("") }
    var amountText by remember { mutableStateOf("") }
    var category by remember { mutableStateOf("Activities") }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Add Expense") },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("Expense Title") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
                OutlinedTextField(
                    value = amountText,
                    onValueChange = { amountText = it },
                    label = { Text("Amount ($)") },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    val amt = amountText.toDoubleOrNull() ?: 0.0
                    if (title.isNotBlank() && amt > 0) onSubmit(title, amt, category)
                }
            ) {
                Text("Save")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) { Text("Cancel") }
        }
    )
}
