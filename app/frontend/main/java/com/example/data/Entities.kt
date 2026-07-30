package com.example.data

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "trips")
data class TripEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val destination: String,
    val title: String,
    val durationDays: Int,
    val startDate: String,
    val budgetLevel: String, // Backpacker, Moderate, Luxury
    val totalEstimatedCost: Double,
    val vibe: String, // Relaxed, Cultural, Adventure, Foodie
    val travelParty: String, // Solo, Couple, Family, Friends
    val coverGradient: String = "TealAmber",
    val isSaved: Boolean = true,
    val isUpcoming: Boolean = true,
    val itineraryJson: String // Stores serialized JSON for days & activities
)

@Entity(tableName = "destinations")
data class DestinationEntity(
    @PrimaryKey val id: String,
    val name: String,
    val country: String,
    val category: String, // Beaches, Mountains, Historic, Foodie, Adventure, Luxury
    val rating: Double,
    val priceTier: String, // $, $$, $$$, $$$$
    val highlight: String,
    val bestMonths: String,
    val avgDailyCostUSD: Int,
    val description: String,
    val lat: Double,
    val lng: Double,
    val isFavorite: Boolean = false
)

@Entity(tableName = "community_posts")
data class CommunityPostEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val authorName: String,
    val authorBadge: String,
    val title: String,
    val location: String,
    val content: String,
    val categoryTag: String, // #SoloTravel, #BudgetHack, #FoodieGuide, #HiddenGem
    val likesCount: Int = 0,
    val commentsCount: Int = 0,
    val isLiked: Boolean = false,
    val isBookmarked: Boolean = false,
    val timestamp: String
)

@Entity(tableName = "packing_items")
data class PackingItemEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val tripId: Long,
    val itemName: String,
    val category: String, // Clothing, Tech, Essentials, Toiletries, Docs
    val isPacked: Boolean = false
)

@Entity(tableName = "budget_items")
data class BudgetItemEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val tripId: Long,
    val title: String,
    val amount: Double,
    val category: String, // Flight, Stay, Food, Activities, Shopping
    val date: String
)

// Helper Data Classes for Day & Activity parsing from Gemini AI
data class DayItinerary(
    val dayNumber: Int,
    val theme: String,
    val morningActivity: ActivityDetail,
    val afternoonActivity: ActivityDetail,
    val eveningActivity: ActivityDetail,
    val foodieSpot: String,
    val insiderTip: String
)

data class ActivityDetail(
    val time: String,
    val title: String,
    val description: String,
    val estCostUSD: Int,
    val locationName: String,
    var isDone: Boolean = false
)
