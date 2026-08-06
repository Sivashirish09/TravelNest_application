package com.example.data

import android.content.Context
import com.example.ai.GeminiTripService
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.withContext

class TravelRepository(private val db: TravelDatabase) {

    val allTrips: Flow<List<TripEntity>> = db.tripDao().getAllTrips()
    val upcomingTrip: Flow<TripEntity?> = db.tripDao().getUpcomingTrip()
    val allDestinations: Flow<List<DestinationEntity>> = db.destinationDao().getAllDestinations()
    val favoriteDestinations: Flow<List<DestinationEntity>> = db.destinationDao().getFavoriteDestinations()
    val allPosts: Flow<List<CommunityPostEntity>> = db.communityDao().getAllPosts()

    fun getPackingItems(tripId: Long): Flow<List<PackingItemEntity>> = db.packingDao().getPackingItemsForTrip(tripId)
    fun getBudgetItems(tripId: Long): Flow<List<BudgetItemEntity>> = db.budgetDao().getBudgetItemsForTrip(tripId)

    suspend fun initializeSeedDataIfNeeded() = withContext(Dispatchers.IO) {
        // Seed Destinations if empty
        val existingDestinations = db.destinationDao().getAllDestinations().first()
        if (existingDestinations.isEmpty()) {
            val seeds = listOf(
                DestinationEntity(
                    id = "dest_kyoto",
                    name = "Kyoto",
                    country = "Japan",
                    category = "Historic",
                    rating = 4.9,
                    priceTier = "$$",
                    highlight = "Arashiyama Bamboo Grove & Torii Gates",
                    bestMonths = "Mar - May, Oct - Nov",
                    avgDailyCostUSD = 110,
                    description = "Ancient pagodas, serene Zen gardens, traditional tea ceremonies, and exquisite kaiseki dining.",
                    lat = 35.0116,
                    lng = 135.7681,
                    isFavorite = true
                ),
                DestinationEntity(
                    id = "dest_amalfi",
                    name = "Amalfi Coast",
                    country = "Italy",
                    category = "Beaches",
                    rating = 4.8,
                    priceTier = "$$$",
                    highlight = "Positano Cliffside & Lemon Groves",
                    bestMonths = "May - Sep",
                    avgDailyCostUSD = 220,
                    description = "Dramatic pastel-colored cliff villages overlooking turquoise Tyrrhenian waters and lemon orchards.",
                    lat = 40.6340,
                    lng = 14.6027,
                    isFavorite = true
                ),
                DestinationEntity(
                    id = "dest_santorini",
                    name = "Santorini",
                    country = "Greece",
                    category = "Luxury",
                    rating = 4.9,
                    priceTier = "$$$$",
                    highlight = "Oia Sunsets & White Caldera Villas",
                    bestMonths = "Jun - Sep",
                    avgDailyCostUSD = 280,
                    description = "Iconic blue-domed churches, volcanic beaches, cave suites, and world-class Mediterranean sunsets.",
                    lat = 36.3932,
                    lng = 25.4615,
                    isFavorite = false
                ),
                DestinationEntity(
                    id = "dest_bali",
                    name = "Ubud, Bali",
                    country = "Indonesia",
                    category = "Adventure",
                    rating = 4.7,
                    priceTier = "$",
                    highlight = "Tegallalang Rice Terraces & Yoga Retreats",
                    bestMonths = "Apr - Oct",
                    avgDailyCostUSD = 55,
                    description = "Lush jungle waterfalls, spiritual wellness sanctuaries, monkey forests, and vibrant artisan markets.",
                    lat = -8.5069,
                    lng = 115.2625,
                    isFavorite = true
                ),
                DestinationEntity(
                    id = "dest_swiss",
                    name = "Interlaken",
                    country = "Switzerland",
                    category = "Mountains",
                    rating = 4.9,
                    priceTier = "$$$$",
                    highlight = "Jungfraujoch Alpine Ridge & Lake Views",
                    bestMonths = "Dec - Mar, Jun - Sep",
                    avgDailyCostUSD = 260,
                    description = "Snow-capped Alpine peaks, crystal-clear glacial lakes, paragliding, and historic mountain cog railways.",
                    lat = 46.6863,
                    lng = 7.8632,
                    isFavorite = false
                ),
                DestinationEntity(
                    id = "dest_banff",
                    name = "Banff",
                    country = "Canada",
                    category = "Mountains",
                    rating = 4.8,
                    priceTier = "$$$",
                    highlight = "Lake Louise Glacier & Wildlife Trails",
                    bestMonths = "Jun - Sep, Dec - Mar",
                    avgDailyCostUSD = 180,
                    description = "Canadian Rockies wilderness, electric-turquoise lakes, natural hot springs, and elk wildlife spotting.",
                    lat = 51.1784,
                    lng = -115.5708,
                    isFavorite = false
                )
            )
            db.destinationDao().insertDestinations(seeds)
        }

        // Seed Community Posts if empty
        val existingPosts = db.communityDao().getAllPosts().first()
        if (existingPosts.isEmpty()) {
            val communitySeeds = listOf(
                CommunityPostEntity(
                    authorName = "Elena Rostova",
                    authorBadge = "Top Contributor",
                    title = "How I Explored Kyoto on a $40/day Budget 🍜",
                    location = "Kyoto, Japan",
                    content = "Tip 1: Grab convenience store bento boxes for lunch (7-Eleven and Lawson have restaurant-quality ramen and onigiri!). Tip 2: Get a 1-Day Bus Pass for 700 Yen.",
                    categoryTag = "#BudgetHack",
                    likesCount = 342,
                    commentsCount = 28,
                    isLiked = true,
                    isBookmarked = true,
                    timestamp = "2 hours ago"
                ),
                CommunityPostEntity(
                    authorName = "Marcus Vance",
                    authorBadge = "Solo Explorer",
                    title = "Hidden Sunset Spot in Positano Away from Crowds 🌅",
                    location = "Amalfi Coast, Italy",
                    content = "Skip the main crowded beach! Hike up the Path of the Gods starting at Bomerano. The 360-degree sunset view above the clouds is pure magic.",
                    categoryTag = "#HiddenGem",
                    likesCount = 512,
                    commentsCount = 45,
                    isLiked = false,
                    isBookmarked = false,
                    timestamp = "5 hours ago"
                ),
                CommunityPostEntity(
                    authorName = "Sarah Chen",
                    authorBadge = "Digital Nomad",
                    title = "Best Coworking Cafes in Ubud Bali with High-Speed WiFi ☕",
                    location = "Bali, Indonesia",
                    content = "Here are my top 3 spots: 1. Outpost Ubud (great community), 2. Hubud (rice field views), 3. Clear Cafe (amazing fresh smoothies & calm vibes).",
                    categoryTag = "#SoloTravel",
                    likesCount = 289,
                    commentsCount = 19,
                    isLiked = true,
                    isBookmarked = true,
                    timestamp = "1 day ago"
                )
            )
            db.communityDao().insertPosts(communitySeeds)
        }

        // Seed initial active trip if empty
        val existingTrips = db.tripDao().getAllTrips().first()
        if (existingTrips.isEmpty()) {
            val defaultTrip = GeminiTripService.generateTripPlan(
                destination = "Kyoto",
                durationDays = 5,
                budgetLevel = "Moderate",
                vibe = "Cultural",
                party = "Couple",
                interests = listOf("Historic Sights", "Food & Tea", "Gardens")
            )
            val tripId = db.tripDao().insertTrip(defaultTrip)

            // Seed packing items
            val packingItems = listOf(
                PackingItemEntity(tripId = tripId, itemName = "Passport & Visa Copy", category = "Docs", isPacked = true),
                PackingItemEntity(tripId = tripId, itemName = "Comfortable Walking Shoes", category = "Clothing", isPacked = true),
                PackingItemEntity(tripId = tripId, itemName = "Universal Travel Adapter", category = "Tech", isPacked = false),
                PackingItemEntity(tripId = tripId, itemName = "Japan Rail Pass Voucher", category = "Docs", isPacked = true),
                PackingItemEntity(tripId = tripId, itemName = "Portable Power Bank (10,000 mAh)", category = "Tech", isPacked = false),
                PackingItemEntity(tripId = tripId, itemName = "Lightweight Rain Jacket", category = "Clothing", isPacked = false)
            )
            packingItems.forEach { db.packingDao().insertPackingItem(it) }

            // Seed budget items
            val budgetItems = listOf(
                BudgetItemEntity(tripId = tripId, title = "Roundtrip Flights", amount = 650.0, category = "Flight", date = "2026-08-01"),
                BudgetItemEntity(tripId = tripId, title = "Traditional Ryokan Stay (4 nights)", amount = 480.0, category = "Stay", date = "2026-08-02"),
                BudgetItemEntity(tripId = tripId, title = "Tea Ceremony & Temple Passes", amount = 75.0, category = "Activities", date = "2026-08-03"),
                BudgetItemEntity(tripId = tripId, title = "Gourmet Kaiseki Dinner", amount = 120.0, category = "Food", date = "2026-08-04")
            )
            budgetItems.forEach { db.budgetDao().insertBudgetItem(it) }
        }
    }

    suspend fun saveTrip(trip: TripEntity): Long {
        return db.tripDao().insertTrip(trip)
    }

    suspend fun toggleDestinationFavorite(destination: DestinationEntity) {
        db.destinationDao().updateDestination(destination.copy(isFavorite = !destination.isFavorite))
    }

    suspend fun togglePostLike(post: CommunityPostEntity) {
        val newLikes = if (post.isLiked) post.likesCount - 1 else post.likesCount + 1
        db.communityDao().updatePost(post.copy(isLiked = !post.isLiked, likesCount = newLikes))
    }

    suspend fun togglePostBookmark(post: CommunityPostEntity) {
        db.communityDao().updatePost(post.copy(isBookmarked = !post.isBookmarked))
    }

    suspend fun addCommunityPost(post: CommunityPostEntity) {
        db.communityDao().insertPost(post)
    }

    suspend fun togglePackingItem(item: PackingItemEntity) {
        db.packingDao().updatePackingItem(item.copy(isPacked = !item.isPacked))
    }

    suspend fun addPackingItem(item: PackingItemEntity) {
        db.packingDao().insertPackingItem(item)
    }

    suspend fun deletePackingItem(item: PackingItemEntity) {
        db.packingDao().deletePackingItem(item)
    }

    suspend fun addBudgetItem(item: BudgetItemEntity) {
        db.budgetDao().insertBudgetItem(item)
    }

    suspend fun deleteBudgetItem(item: BudgetItemEntity) {
        db.budgetDao().deleteBudgetItem(item)
    }

    suspend fun deleteTrip(trip: TripEntity) {
        db.tripDao().deleteTrip(trip)
    }
}
