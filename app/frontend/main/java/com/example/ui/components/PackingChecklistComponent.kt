package com.example.ui.components

import androidx.compose.animation.*
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.PackingHubItem
import com.example.ui.MainViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PackingChecklistComponent(
    viewModel: MainViewModel,
    modifier: Modifier = Modifier
) {
    val packingItems by viewModel.packingListHub.collectAsState()

    var searchQuery by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("All") }
    var showAddItemDialog by remember { mutableStateOf(false) }
    var showResetConfirmDialog by remember { mutableStateOf(false) }

    val categories = listOf("All", "Essentials", "Clothes", "Electronics", "Toiletries", "Documents")

    // Quick templates for instant addition
    val templateSuggestions = listOf(
        "Passport & Visa 🛂" to "Documents",
        "Universal Adapter 🔌" to "Electronics",
        "Sunscreen & SPF ☀️" to "Toiletries",
        "Power Bank 🔋" to "Electronics",
        "Headphones 🎧" to "Electronics",
        "First Aid Kit 💊" to "Essentials",
        "Rain Jacket ☔" to "Clothes"
    )

    // Filter items
    val filteredItems = packingItems.filter { item ->
        val matchesCategory = (selectedCategory == "All") || item.category.equals(selectedCategory, ignoreCase = true)
        val matchesSearch = item.itemTitle.contains(searchQuery, ignoreCase = true)
        matchesCategory && matchesSearch
    }

    val totalCount = packingItems.size
    val packedCount = packingItems.count { it.isPacked }
    val progress = if (totalCount > 0) packedCount.toFloat() / totalCount else 0f
    val animatedProgress by animateFloatAsState(targetValue = progress, label = "progressAnimation")

    Card(
        modifier = modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Column(
            modifier = Modifier.padding(18.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // ================= HEADER & PROGRESS BAR =================
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            text = "Packing Checklist 🎒",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Surface(
                            color = MaterialTheme.colorScheme.primaryContainer,
                            shape = CircleShape
                        ) {
                            Text(
                                text = "$packedCount/$totalCount",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                            )
                        }
                    }
                    Text(
                        text = "Toggle items as packed • Persisted locally",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.65f)
                    )
                }

                Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    IconButton(
                        onClick = { showAddItemDialog = true },
                        modifier = Modifier
                            .testTag("add_packing_item_button")
                            .background(MaterialTheme.colorScheme.primary, CircleShape)
                            .size(38.dp)
                    ) {
                        Icon(Icons.Filled.Add, contentDescription = "Add Item", tint = Color.White)
                    }

                    IconButton(
                        onClick = { showResetConfirmDialog = true },
                        modifier = Modifier.size(38.dp)
                    ) {
                        Icon(
                            Icons.Filled.RestartAlt,
                            contentDescription = "Reset List",
                            tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.7f)
                        )
                    }
                }
            }

            // Progress Bar Visualizer
            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = if (progress >= 1f) "🎉 100% Fully Packed & Ready!" else "${(progress * 100).toInt()}% Prepared",
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = if (progress >= 1f) Color(0xFF10B981) else MaterialTheme.colorScheme.primary
                    )
                    Text(
                        text = "${totalCount - packedCount} remaining",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                    )
                }

                LinearProgressIndicator(
                    progress = { animatedProgress },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(8.dp)
                        .clip(RoundedCornerShape(4.dp)),
                    color = if (progress >= 1f) Color(0xFF10B981) else MaterialTheme.colorScheme.primary,
                    trackColor = MaterialTheme.colorScheme.surfaceVariant
                )
            }

            // ================= CATEGORY FILTER CHIPS =================
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(categories) { category ->
                    val isSelected = selectedCategory == category
                    val count = if (category == "All") packingItems.size
                    else packingItems.count { it.category.equals(category, ignoreCase = true) }

                    FilterChip(
                        selected = isSelected,
                        onClick = { selectedCategory = category },
                        label = {
                            Text(
                                text = "$category ($count)",
                                fontSize = 12.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                            )
                        },
                        shape = RoundedCornerShape(12.dp)
                    )
                }
            }

            // ================= QUICK SEARCH & ACTIONS =================
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = { searchQuery = it },
                    placeholder = { Text("Search items...", fontSize = 12.sp) },
                    leadingIcon = { Icon(Icons.Filled.Search, contentDescription = null, modifier = Modifier.size(18.dp)) },
                    trailingIcon = {
                        if (searchQuery.isNotEmpty()) {
                            IconButton(onClick = { searchQuery = "" }) {
                                Icon(Icons.Filled.Clear, contentDescription = "Clear search", modifier = Modifier.size(16.dp))
                            }
                        }
                    },
                    modifier = Modifier
                        .weight(1f)
                        .height(48.dp),
                    shape = RoundedCornerShape(12.dp),
                    singleLine = true
                )

                if (packedCount > 0) {
                    TextButton(
                        onClick = { viewModel.clearPackedHubItems() }
                    ) {
                        Text("Clear Packed", fontSize = 11.sp, color = MaterialTheme.colorScheme.error)
                    }
                }
            }

            // ================= TEMPLATE SUGGESTIONS =================
            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                Text("Quick Add Essentials:", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f))
                LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    items(templateSuggestions) { (title, cat) ->
                        val alreadyExists = packingItems.any { it.itemTitle.contains(title.replace(Regex("[^a-zA-Z ]"), "").trim(), ignoreCase = true) }
                        if (!alreadyExists) {
                            AssistChip(
                                onClick = {
                                    viewModel.addHubPackingItem(title, cat)
                                },
                                label = { Text("+ $title", fontSize = 11.sp) },
                                shape = RoundedCornerShape(10.dp)
                            )
                        }
                    }
                }
            }

            Divider(color = MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.5f))

            // ================= PACKING ITEMS LIST =================
            if (filteredItems.isEmpty()) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 24.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            Icons.Filled.ChecklistRtl,
                            contentDescription = null,
                            tint = MaterialTheme.colorScheme.primary.copy(alpha = 0.4f),
                            modifier = Modifier.size(48.dp)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = if (searchQuery.isNotEmpty()) "No items matching '$searchQuery'" else "No items in this category",
                            fontSize = 13.sp,
                            color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        TextButton(onClick = { showAddItemDialog = true }) {
                            Text("+ Add New Packing Item", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            } else {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    filteredItems.forEach { item ->
                        PackingItemRow(
                            item = item,
                            onToggle = { viewModel.toggleHubPackingItem(item.id) },
                            onQuantityChange = { newQty -> viewModel.updateHubPackingQuantity(item.id, newQty) },
                            onDelete = { viewModel.deleteHubPackingItem(item.id) }
                        )
                    }
                }
            }
        }
    }

    // ================= ADD PACKING ITEM DIALOG =================
    if (showAddItemDialog) {
        AddPackingItemDialog(
            categories = categories.filter { it != "All" },
            onDismiss = { showAddItemDialog = false },
            onAdd = { title, cat, qty ->
                viewModel.addHubPackingItem(title, cat, qty)
                showAddItemDialog = false
            }
        )
    }

    // ================= RESET CONFIRM DIALOG =================
    if (showResetConfirmDialog) {
        AlertDialog(
            onDismissRequest = { showResetConfirmDialog = false },
            title = { Text("Reset Packing Checklist?", fontWeight = FontWeight.Bold) },
            text = { Text("This will mark all items as unpacked so you can start packing fresh for your next trip.") },
            confirmButton = {
                Button(
                    onClick = {
                        viewModel.resetHubPackingList()
                        showResetConfirmDialog = false
                    }
                ) {
                    Text("Reset All to Unpacked")
                }
            },
            dismissButton = {
                TextButton(onClick = { showResetConfirmDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }
}

@Composable
private fun PackingItemRow(
    item: PackingHubItem,
    onToggle: () -> Unit,
    onQuantityChange: (Int) -> Unit,
    onDelete: () -> Unit
) {
    Surface(
        shape = RoundedCornerShape(14.dp),
        color = if (item.isPacked) MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.5f)
        else MaterialTheme.colorScheme.surface,
        border = androidx.compose.foundation.BorderStroke(
            1.dp,
            if (item.isPacked) MaterialTheme.colorScheme.outlineVariant.copy(alpha = 0.3f)
            else MaterialTheme.colorScheme.outlineVariant
        ),
        modifier = Modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clickable { onToggle() }
                .padding(horizontal = 12.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.weight(1f)
            ) {
                Checkbox(
                    checked = item.isPacked,
                    onCheckedChange = { onToggle() },
                    modifier = Modifier.testTag("packing_checkbox_${item.id}")
                )

                Spacer(modifier = Modifier.width(6.dp))

                Column {
                    Text(
                        text = item.itemTitle,
                        fontSize = 14.sp,
                        fontWeight = if (item.isPacked) FontWeight.Normal else FontWeight.SemiBold,
                        textDecoration = if (item.isPacked) TextDecoration.LineThrough else TextDecoration.None,
                        color = if (item.isPacked) MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f)
                        else MaterialTheme.colorScheme.onSurface,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )

                    Row(
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            color = MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f),
                            shape = RoundedCornerShape(6.dp)
                        ) {
                            Text(
                                text = item.category,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = MaterialTheme.colorScheme.primary,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
                            )
                        }

                        if (item.quantity > 1) {
                            Text(
                                text = "Qty: ${item.quantity}",
                                fontSize = 11.sp,
                                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                            )
                        }
                    }
                }
            }

            // Quantity controls & Delete
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconButton(
                    onClick = { if (item.quantity > 1) onQuantityChange(item.quantity - 1) },
                    modifier = Modifier.size(28.dp)
                ) {
                    Icon(
                        Icons.Filled.RemoveCircleOutline,
                        contentDescription = "Decrease Quantity",
                        tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f),
                        modifier = Modifier.size(16.dp)
                    )
                }

                Text(
                    text = "${item.quantity}",
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(horizontal = 4.dp)
                )

                IconButton(
                    onClick = { onQuantityChange(item.quantity + 1) },
                    modifier = Modifier.size(28.dp)
                ) {
                    Icon(
                        Icons.Filled.AddCircleOutline,
                        contentDescription = "Increase Quantity",
                        tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.5f),
                        modifier = Modifier.size(16.dp)
                    )
                }

                Spacer(modifier = Modifier.width(4.dp))

                IconButton(
                    onClick = onDelete,
                    modifier = Modifier
                        .testTag("delete_packing_${item.id}")
                        .size(28.dp)
                ) {
                    Icon(
                        Icons.Filled.Delete,
                        contentDescription = "Delete Item",
                        tint = MaterialTheme.colorScheme.error.copy(alpha = 0.7f),
                        modifier = Modifier.size(16.dp)
                    )
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun AddPackingItemDialog(
    categories: List<String>,
    onDismiss: () -> Unit,
    onAdd: (String, String, Int) -> Unit
) {
    var title by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf(categories.firstOrNull() ?: "Essentials") }
    var quantity by remember { mutableIntStateOf(1) }

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Add Packing Item 🎒", fontWeight = FontWeight.Bold) },
        text = {
            Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                OutlinedTextField(
                    value = title,
                    onValueChange = { title = it },
                    label = { Text("Item Name (e.g. Passport, Camera)") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .testTag("add_packing_item_input"),
                    singleLine = true
                )

                Text("Category:", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                LazyRow(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                    items(categories) { cat ->
                        FilterChip(
                            selected = selectedCategory == cat,
                            onClick = { selectedCategory = cat },
                            label = { Text(cat, fontSize = 11.sp) }
                        )
                    }
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Quantity:", fontSize = 13.sp, fontWeight = FontWeight.Medium)
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        IconButton(onClick = { if (quantity > 1) quantity-- }) {
                            Icon(Icons.Filled.Remove, contentDescription = null)
                        }
                        Text("$quantity", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        IconButton(onClick = { quantity++ }) {
                            Icon(Icons.Filled.Add, contentDescription = null)
                        }
                    }
                }
            }
        },
        confirmButton = {
            Button(
                onClick = {
                    if (title.isNotBlank()) {
                        onAdd(title.trim(), selectedCategory, quantity)
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
