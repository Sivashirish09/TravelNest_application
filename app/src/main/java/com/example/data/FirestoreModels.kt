package com.example.data

// Firestore Collection Models
data class PlaceItem(
    val id: String,
    val name: String,
    val location: String,
    val category: String, // Nearby, Trending, Weekend, Recommended
    val tripType: String, // Adventure, Family, Solo, Couple, Luxury, Beach, Hill Station, Pilgrimage
    val rating: Double,
    val reviewsCount: Int,
    val pricePerNightUSD: Int,
    val bestTimeToVisit: String,
    val distanceKm: Double,
    val imageUrl: String,
    val description: String,
    val highlights: List<String>,
    val lat: Double,
    val lng: Double,
    val country: String = "Japan",
    val state: String = "Kansai",
    val city: String = "Kyoto",
    val safetyScore: Int = 96,
    val tabCategory: String = "Popular Now", // Popular Now, Top Rated, Trending, Hidden Gems
    val petFriendly: Boolean = true,
    val isCamping: Boolean = false,
    val isWaterSport: Boolean = false,
    val hasResorts: Boolean = true,
    val hasRestaurants: Boolean = true,
    val nearbyAirports: List<String> = listOf("KIX (Kansai Intl)", "ITM (Osaka Itami)"),
    val estimatedFlightHours: Double = 11.5,
    val galleryImages: List<String> = listOf(
        "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80"
    )
)

data class RestaurantItem(
    val id: String,
    val name: String,
    val destination: String,
    val cuisine: String,
    val rating: Double,
    val reviewsCount: Int = 340,
    val priceRange: String, // $, $$, $$$, $$$$
    val imageUrl: String,
    val specialty: String,
    val petFriendly: Boolean = true,
    val address: String = "City Center Promenade"
)

data class RouteItem(
    val id: String,
    val origin: String,
    val destination: String,
    val travelDistanceKm: Double,
    val estimatedHours: Double,
    val estimatedCostUSD: Int,
    val transportMode: String,
    val scenicHighlights: String,
    val safetyScore: Int = 95
)

data class RatingItem(
    val id: String,
    val destination: String,
    val overallScore: Double,
    val safetyScore: Int,
    val cleanlinessScore: Int,
    val hospitalityScore: Int,
    val valueScore: Int
)

data class ActivityItem(
    val id: String,
    val title: String,
    val destination: String,
    val category: String,
    val priceUSD: Int,
    val rating: Double,
    val imageUrl: String,
    val petFriendly: Boolean = false,
    val isWaterSport: Boolean = false
)

data class VideoItem(
    val id: String,
    val title: String,
    val destination: String,
    val duration: String,
    val thumbnailUrl: String,
    val views: String,
    val author: String
)

data class BookingHubItem(
    val id: String,
    val title: String,
    val type: String, // Flight, Hotel, Resort, Train, Bus
    val destination: String,
    val provider: String,
    val referenceCode: String,
    val date: String,
    val priceUSD: Int,
    val status: String, // Confirmed, Upcoming, Completed, Cancelled
    val pnr: String,
    val seatOrRoom: String,
    val qrCodeUrl: String,
    val invoiceNumber: String = "INV-2026-8891",
    val checkInDate: String = "Aug 15, 2026",
    val checkOutDate: String = "Aug 18, 2026",
    val numberOfNights: Int = 3,
    val numberOfGuests: Int = 2,
    val totalAmountINR: Int = priceUSD * 83,
    val paymentMethod: String = "UPI (Google Pay)",
    val paymentStatus: String = "Paid",
    val imageUrl: String = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
    val hotelName: String = provider
)

data class TicketItem(
    val id: String,
    val bookingId: String,
    val ticketNumber: String,
    val passengerName: String,
    val transportType: String, // Flight, Train, Bus, Attraction
    val departureLocation: String,
    val arrivalLocation: String,
    val departureTime: String,
    val arrivalTime: String,
    val seatNumber: String,
    val classType: String,
    val gateOrPlatform: String,
    val qrCodeUrl: String
)

data class VisaStatusItem(
    val id: String,
    val country: String,
    val passportNumber: String,
    val visaType: String,
    val status: String, // Approved, Processing, Visa Free, Required
    val validUntil: String,
    val entriesAllowed: String,
    val applicationRef: String
)

data class TravelDocumentItem(
    val id: String,
    val title: String,
    val category: String, // Passport, Visa, Insurance, Vaccination, Driver License
    val docNumber: String,
    val expiryDate: String,
    val fileUrl: String,
    val isVerified: Boolean = true
)

data class PackingHubItem(
    val id: String,
    val category: String, // Essentials, Electronics, Clothes, Toiletries, Documents
    val itemTitle: String,
    val isPacked: Boolean,
    val quantity: Int = 1
)

data class TravelExpenseItem(
    val id: String,
    val title: String,
    val category: String, // Flight, Hotel, Food, Shopping, Transport, Activities
    val amountUSD: Double,
    val date: String,
    val paymentMethod: String, // Credit Card, Cash, Apple Pay
    val receiptUrl: String
)

data class TravelNoteItem(
    val id: String,
    val title: String,
    val content: String,
    val date: String,
    val tag: String
)

data class EmergencyContactItem(
    val id: String,
    val name: String,
    val relationship: String,
    val phone: String,
    val email: String,
    val country: String,
    val isLocalEmergency: Boolean = false
)

data class TimelineItem(
    val id: String,
    val tripId: String,
    val dayNumber: Int,
    val date: String,
    val title: String,
    val time: String,
    val location: String,
    val description: String,
    val category: String, // Flight, Check-in, Dining, Tour, Relaxation
    val status: String // Completed, In Progress, Upcoming
)

data class PhotoMemoryItem(
    val id: String,
    val tripId: String,
    val caption: String,
    val photoUrl: String,
    val location: String,
    val date: String,
    val likesCount: Int = 0,
    val tags: List<String> = emptyList()
)

data class InvoiceLineItem(
    val description: String,
    val category: String,
    val amountUSD: Double
)

data class TripInvoiceItem(
    val id: String,
    val invoiceNumber: String,
    val tripName: String,
    val totalAmountUSD: Double,
    val issueDate: String,
    val paymentStatus: String, // Paid, Pending
    val items: List<InvoiceLineItem>
)

data class StateItem(
    val id: String,
    val name: String,
    val country: String,
    val code: String,
    val totalDestinations: Int,
    val imageUrl: String
)

data class CityItem(
    val id: String,
    val stateId: String,
    val name: String,
    val country: String,
    val rating: Double,
    val bestSeason: String,
    val imageUrl: String
)

data class SearchHistoryItem(
    val id: String,
    val userId: String,
    val query: String,
    val category: String,
    val createdAt: String
)

data class NotificationItem(
    val id: String,
    val userId: String,
    val title: String,
    val message: String,
    val category: String,
    val isRead: Boolean,
    val timestamp: String
)

data class MessageItem(
    val id: String,
    val userId: String,
    val senderName: String,
    val senderAvatar: String,
    val text: String,
    val timestamp: String,
    val isAiAssistant: Boolean = false
)

data class SupportTicketItem(
    val id: String,
    val userId: String,
    val subject: String,
    val category: String,
    val status: String, // Open, In Progress, Resolved
    val priority: String, // High, Medium, Low
    val createdAt: String
)

data class HotelItem(
    val id: String,
    val name: String,
    val destination: String,
    val stars: Int,
    val rating: Double,
    val reviewsCount: Int,
    val pricePerNightUSD: Int,
    val discountPercent: Int = 0,
    val amenities: List<String>,
    val type: String, // Resort, Luxury Hotel, Boutique, Eco-Lodge
    val imageUrl: String
)

data class BeachItem(
    val id: String,
    val name: String,
    val location: String,
    val waterColor: String,
    val rating: Double,
    val highlights: String,
    val distanceKm: Double,
    val popularFor: String,
    val imageUrl: String
)

data class PackageItem(
    val id: String,
    val title: String,
    val destination: String,
    val durationDays: Int,
    val priceUSD: Int,
    val originalPriceUSD: Int,
    val tag: String, // Bestseller, Limited Offer, AI Special
    val rating: Double,
    val inclusions: List<String>,
    val imageUrl: String
)

data class ReviewItem(
    val id: String,
    val userName: String,
    val userBadge: String,
    val avatarUrl: String,
    val destination: String,
    val rating: Double,
    val title: String,
    val comment: String,
    val date: String
)

data class BlogItem(
    val id: String,
    val title: String,
    val category: String,
    val author: String,
    val readTimeMinutes: Int,
    val publishedDate: String,
    val snippet: String,
    val content: String,
    val tag: String,
    val imageUrl: String
)

data class WeatherItem(
    val city: String,
    val tempC: Int,
    val tempF: Int,
    val condition: String,
    val humidityPercent: Int,
    val windKmH: Int,
    val iconName: String,
    val advisory: String
)

data class OfferItem(
    val id: String,
    val promoCode: String,
    val title: String,
    val discountText: String,
    val validUntil: String,
    val minSpendUSD: Int,
    val bgGradient: String
)

data class FlightItem(
    val id: String,
    val origin: String,
    val destination: String,
    val airline: String,
    val priceUSD: Int,
    val departureTime: String,
    val durationHours: Double,
    val stops: String
)

data class TravelNewsItem(
    val id: String,
    val title: String,
    val source: String,
    val timeAgo: String,
    val category: String,
    val snippet: String
)

data class FestivalItem(
    val name: String,
    val location: String,
    val monthDate: String,
    val description: String,
    val icon: String
)

// Firestore Sample Mock Collection Repository Data
object FirestoreMockData {

    val places = listOf(
        PlaceItem(
            id = "p1",
            name = "Kyoto Bamboo Grove & Fushimi Inari",
            location = "Kyoto, Japan",
            category = "Trending",
            tripType = "Adventure",
            rating = 4.9,
            reviewsCount = 1420,
            pricePerNightUSD = 120,
            bestTimeToVisit = "October - November & March - April",
            distanceKm = 12.5,
            imageUrl = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
            description = "Walk through thousands of vermilion torii gates winding up Mount Inari, then wander serene bamboo forests in Arashiyama.",
            highlights = listOf("10,000 Torii Gates", "Traditional Matcha Tea Houses", "Zen Rock Gardens"),
            lat = 35.0116,
            lng = 135.7681
        ),
        PlaceItem(
            id = "p2",
            name = "Positano Cliffside Paradise",
            location = "Amalfi Coast, Italy",
            category = "Recommended",
            tripType = "Luxury",
            rating = 4.8,
            reviewsCount = 980,
            pricePerNightUSD = 250,
            bestTimeToVisit = "May - September",
            distanceKm = 48.0,
            imageUrl = "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
            description = "Vertical town built into dramatic cliffside, cascading into sparkling turquoise waters with coastal lemon orchards.",
            highlights = listOf("Path of the Gods Hike", "Private Boat Charters", "Limoncello Tastings"),
            lat = 40.6340,
            lng = 14.6027
        ),
        PlaceItem(
            id = "p3",
            name = "Oia Blue Dome Sunset Village",
            location = "Santorini, Greece",
            category = "Popular",
            tripType = "Couple",
            rating = 4.9,
            reviewsCount = 2100,
            pricePerNightUSD = 310,
            bestTimeToVisit = "June - September",
            distanceKm = 85.0,
            imageUrl = "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80",
            description = "Iconic white whitewashed cave buildings suspended above the Mediterranean caldera with world-famous sunset vistas.",
            highlights = listOf("Caldera Wine Tasting", "Catamaran Cruise", "Volcanic Hot Springs"),
            lat = 36.3932,
            lng = 25.4615
        ),
        PlaceItem(
            id = "p4",
            name = "Ubud Sacred Monkey Sanctuary & Terraces",
            location = "Bali, Indonesia",
            category = "Nearby",
            tripType = "Solo",
            rating = 4.7,
            reviewsCount = 850,
            pricePerNightUSD = 65,
            bestTimeToVisit = "April - October",
            distanceKm = 8.2,
            imageUrl = "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80",
            description = "Lush emerald jungle sanctuaries, yoga retreats, ancient stone temples, and tiered rice paddies.",
            highlights = listOf("Tegallalang Rice Terrace", "Spiritual Sound Baths", "Organic Cafe Crawls"),
            lat = -8.5069,
            lng = 115.2625
        ),
        PlaceItem(
            id = "p5",
            name = "Interlaken Jungfrau Alpine Ridge",
            location = "Bernese Oberland, Switzerland",
            category = "Weekend",
            tripType = "Hill Station",
            rating = 4.9,
            reviewsCount = 1130,
            pricePerNightUSD = 280,
            bestTimeToVisit = "December - March & June - September",
            distanceKm = 15.0,
            imageUrl = "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80",
            description = "Glacial lakes, snow-capped peaks, alpine train ascents, and thrill-seeker paragliding above valley floors.",
            highlights = listOf("Top of Europe Railway", "Glacier Walking", "Fondue Dining"),
            lat = 46.6863,
            lng = 7.8632
        ),
        PlaceItem(
            id = "p6",
            name = "Varanasi Ganges Spiritual Ghats",
            location = "Uttar Pradesh, India",
            category = "Recommended",
            tripType = "Pilgrimage",
            rating = 4.8,
            reviewsCount = 740,
            pricePerNightUSD = 45,
            bestTimeToVisit = "October - March",
            distanceKm = 24.0,
            imageUrl = "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80",
            description = "One of the oldest living cities on Earth, famed for sacred morning boat rides on the Ganges and evening Ganga Aarti ceremonies.",
            highlights = listOf("Sunrise Boat Cruise", "Ganga Aarti Ceremony", "Ancient Temple Corridors"),
            lat = 25.3176,
            lng = 82.9739
        )
    )

    val hotels = listOf(
        HotelItem(
            id = "h1",
            name = "Grand Hyatt Regency & Spa",
            destination = "Kyoto, Japan",
            stars = 5,
            rating = 4.9,
            reviewsCount = 620,
            pricePerNightUSD = 240,
            discountPercent = 15,
            amenities = listOf("Onsen Hot Spring", "Michelin Dining", "Free High-Speed WiFi", "Spa & Wellness"),
            type = "Luxury Hotel",
            imageUrl = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80"
        ),
        HotelItem(
            id = "h2",
            name = "Hotel Le Sirenuse Cliff Resort",
            destination = "Positano, Italy",
            stars = 5,
            rating = 4.95,
            reviewsCount = 410,
            pricePerNightUSD = 480,
            discountPercent = 10,
            amenities = listOf("Caldera Pool", "Private Balcony", "Champagne Bar", "Valet Parking"),
            type = "Resort",
            imageUrl = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80"
        ),
        HotelItem(
            id = "h3",
            name = "Maya Ubud Eco Jungle Retreat",
            destination = "Bali, Indonesia",
            stars = 4,
            rating = 4.75,
            reviewsCount = 890,
            pricePerNightUSD = 110,
            discountPercent = 20,
            amenities = listOf("Infinity Pool", "Yoga Pavilion", "Vegan Breakfast", "Free Shuttle"),
            type = "Eco-Lodge",
            imageUrl = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
        )
    )

    val beaches = listOf(
        BeachItem(
            id = "b1",
            name = "Grace Bay Beach",
            location = "Turks & Caicos",
            waterColor = "Crystal Turquoise",
            rating = 4.95,
            highlights = "Pristine white sand barrier reef with gentle snorkeling waves.",
            distanceKm = 12.0,
            popularFor = "Scuba Diving & Sunbathing",
            imageUrl = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
        ),
        BeachItem(
            id = "b2",
            name = "White Beach Boracay",
            location = "Boracay, Philippines",
            waterColor = "Powder White & Emerald",
            rating = 4.85,
            highlights = "4-kilometer soft flour sand beach lined with vibrant coconut palms.",
            distanceKm = 25.0,
            popularFor = "Sunset Cruises & Beach Nightlife",
            imageUrl = "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=600&q=80"
        ),
        BeachItem(
            id = "b3",
            name = "Anse Source d'Argent",
            location = "La Digue, Seychelles",
            waterColor = "Deep Azure",
            rating = 4.9,
            highlights = "Dramatic granite boulders framing shallow calm lagoons.",
            distanceKm = 40.0,
            popularFor = "Photography & Kayaking",
            imageUrl = "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=600&q=80"
        )
    )

    val packages = listOf(
        PackageItem(
            id = "pkg1",
            title = "7-Day Japan Blossom & Ancient Heritage",
            destination = "Tokyo, Kyoto & Nara",
            durationDays = 7,
            priceUSD = 1290,
            originalPriceUSD = 1550,
            tag = "Bestseller",
            rating = 4.9,
            inclusions = listOf("4-Star Hotels", "Bullet Train Pass", "Guided Temples", "Daily Breakfast"),
            imageUrl = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80"
        ),
        PackageItem(
            id = "pkg2",
            title = "5-Day Amalfi Coast & Capri Boat Escapade",
            destination = "Amalfi, Positano, Capri",
            durationDays = 5,
            priceUSD = 1480,
            originalPriceUSD = 1750,
            tag = "AI Special",
            rating = 4.8,
            inclusions = listOf("Sea View Villa", "Private Yacht Charter", "Wine Tasting", "Airport Transfer"),
            imageUrl = "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80"
        ),
        PackageItem(
            id = "pkg3",
            title = "6-Day Swiss Alps & Scenic Glaciers",
            destination = "Zurich, Interlaken, Zermatt",
            durationDays = 6,
            priceUSD = 1620,
            originalPriceUSD = 1890,
            tag = "Limited Offer",
            rating = 4.9,
            inclusions = listOf("Swiss Travel Pass", "Glacier Express", "Mountain Lodges", "Breakfast"),
            imageUrl = "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80"
        )
    )

    val reviews = listOf(
        ReviewItem(
            id = "r1",
            userName = "Samantha Reed",
            userBadge = "Verified Explorer",
            avatarUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
            destination = "Kyoto, Japan",
            rating = 5.0,
            title = "Flawless AI Generated Itinerary!",
            comment = "TravelNest's AI planned every morning and afternoon detail so smoothly. We found hidden ramen spots in Gion that weren't in standard guidebooks!",
            date = "3 days ago"
        ),
        ReviewItem(
            id = "r2",
            userName = "David K. Vance",
            userBadge = "Frequent Flyer",
            avatarUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
            destination = "Amalfi Coast, Italy",
            rating = 5.0,
            title = "Unforgettable Cliffside Honeymoon",
            comment = "The hotel deals and package recommendations saved us over $400. The currency converter and offline checklist were super handy!",
            date = "1 week ago"
        )
    )

    val blogs = listOf(
        BlogItem(
            id = "b1",
            title = "10 Essential Tips for First-Time Japan Travelers in 2026",
            category = "Travel Guide",
            author = "Emi Takahashi",
            readTimeMinutes = 5,
            publishedDate = "July 24, 2026",
            snippet = "From pocket WiFi setup to IC cards and etiquette rules at traditional onsens.",
            content = "Traveling to Japan is a dream experience. Ensure you grab a Welcome Suica IC card for subway rides, reserve shinkansen seats in advance, and carry local cash for street food stalls.",
            tag = "#JapanTips",
            imageUrl = "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80"
        ),
        BlogItem(
            id = "b2",
            title = "How to Pack Light for a 2-Week Multi-Country European Summer",
            category = "Packing Hacks",
            author = "Alex Rivera",
            readTimeMinutes = 4,
            publishedDate = "July 20, 2026",
            snippet = "Mastering the 5-4-3-2-1 capsule wardrobe method with merino wool and compression cubes.",
            content = "Packing light frees you from heavy cobblestone street lugging. Focus on quick-dry breathable fabrics, versatile comfortable footwear, and compact travel adapters.",
            tag = "#PackingLight",
            imageUrl = "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80"
        )
    )

    val weather = WeatherItem(
        city = "Kyoto, Japan",
        tempC = 24,
        tempF = 75,
        condition = "Partly Cloudy ⛅",
        humidityPercent = 62,
        windKmH = 11,
        iconName = "wb_sunny",
        advisory = "Ideal outdoor sightseeing weather! Mild humidity with clear evening skies."
    )

    val offers = listOf(
        OfferItem(
            id = "o1",
            promoCode = "SUMMER2026",
            title = "Flat 20% OFF on Luxury Resorts",
            discountText = "Save up to $250 on 4+ Night Stays",
            validUntil = "Aug 15, 2026",
            minSpendUSD = 500,
            bgGradient = "Teal"
        ),
        OfferItem(
            id = "o2",
            promoCode = "AITRIP100",
            title = "Instant $100 Flight Credit",
            discountText = "Valid on International Roundtrips",
            validUntil = "Sep 01, 2026",
            minSpendUSD = 600,
            bgGradient = "Orange"
        )
    )

    val flights = listOf(
        FlightItem(
            id = "f1",
            origin = "SFO (San Francisco)",
            destination = "KIX (Osaka/Kyoto)",
            airline = "Japan Airlines (JAL)",
            priceUSD = 780,
            departureTime = "11:30 AM",
            durationHours = 11.5,
            stops = "Non-stop"
        ),
        FlightItem(
            id = "f2",
            origin = "JFK (New York)",
            destination = "FCO (Rome, Italy)",
            airline = "ITA Airways",
            priceUSD = 690,
            departureTime = "05:45 PM",
            durationHours = 8.7,
            stops = "Non-stop"
        )
    )

    val travelNews = listOf(
        TravelNewsItem(
            id = "n1",
            title = "Japan Launches New Fast-Track E-Visa System for 2026 Tourists",
            source = "Global Travel Pulse",
            timeAgo = "1 hour ago",
            category = "Visa & Entry",
            snippet = "Tourists from 45 countries can now obtain instant digital e-visas within 24 hours."
        ),
        TravelNewsItem(
            id = "n2",
            title = "Airlines Expand Direct Summer Routes to Amalfi & Capri Coast",
            source = "Aviation Times",
            timeAgo = "4 hours ago",
            category = "Flights",
            snippet = "Increased direct flights into Naples (NAP) and Salerno airports reduce transit times by 2 hours."
        )
    )

    val festivals = listOf(
        FestivalItem(
            name = "Gion Matsuri Festival",
            location = "Kyoto, Japan",
            monthDate = "July 1 - 31",
            description = "Grand procession of ornate floats, traditional music, and yukata street night markets.",
            icon = "🏮"
        ),
        FestivalItem(
            name = "Venice Carnival",
            location = "Venice, Italy",
            monthDate = "Feb 10 - 28",
            description = "Masquerade balls, elegant silk costumes, and gondola parades along grand canals.",
            icon = "🎭"
        ),
        FestivalItem(
            name = "Yi Peng Lantern Festival",
            location = "Chiang Mai, Thailand",
            monthDate = "Nov 15 - 17",
            description = "Thousands of glowing paper lanterns released simultaneously into the night sky.",
            icon = "✨"
        )
    )

    val restaurants = listOf(
        RestaurantItem(
            id = "rest1",
            name = "Gion Duck Noodles & Ramen",
            destination = "Kyoto, Japan",
            cuisine = "Japanese Ramen",
            rating = 4.9,
            reviewsCount = 420,
            priceRange = "$$",
            imageUrl = "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80",
            specialty = "Michelin Bib Gourmand Duck Tsukemen",
            petFriendly = true
        ),
        RestaurantItem(
            id = "rest2",
            name = "La Sponda Cliffside Dining",
            destination = "Amalfi Coast, Italy",
            cuisine = "Italian Seafood & Wine",
            rating = 4.8,
            reviewsCount = 310,
            priceRange = "$$$$",
            imageUrl = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
            specialty = "Candlelit Lemon Tree Terrace & Handmade Pasta",
            petFriendly = true
        ),
        RestaurantItem(
            id = "rest3",
            name = "Clear Cafe & Organic Pavilion",
            destination = "Bali, Indonesia",
            cuisine = "Organic & Vegan Fusion",
            rating = 4.7,
            reviewsCount = 530,
            priceRange = "$$",
            imageUrl = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
            specialty = "Spiral Bamboo Architecture & Dragonfruit Smoothies",
            petFriendly = true
        )
    )

    val routes = listOf(
        RouteItem(
            id = "r1",
            origin = "San Francisco (SFO)",
            destination = "Kyoto, Japan",
            travelDistanceKm = 8350.0,
            estimatedHours = 11.5,
            estimatedCostUSD = 780,
            transportMode = "Flight + Bullet Train",
            scenicHighlights = "Pacific Skyline & Mt. Fuji Transit Vistas",
            safetyScore = 98
        ),
        RouteItem(
            id = "r2",
            origin = "Rome (FCO)",
            destination = "Positano, Italy",
            travelDistanceKm = 270.0,
            estimatedHours = 3.2,
            estimatedCostUSD = 85,
            transportMode = "High-Speed Rail + Coastal Ferry",
            scenicHighlights = "Tyrrhenian Sea Coastal Cliffs",
            safetyScore = 95
        ),
        RouteItem(
            id = "r3",
            origin = "Zurich Airport",
            destination = "Interlaken, Switzerland",
            travelDistanceKm = 120.0,
            estimatedHours = 1.8,
            estimatedCostUSD = 45,
            transportMode = "GoldenPass Express Train",
            scenicHighlights = "Lake Thun & Glacier Valleys",
            safetyScore = 99
        )
    )

    val ratings = listOf(
        RatingItem(
            id = "rat1",
            destination = "Kyoto, Japan",
            overallScore = 4.9,
            safetyScore = 98,
            cleanlinessScore = 99,
            hospitalityScore = 97,
            valueScore = 92
        ),
        RatingItem(
            id = "rat2",
            destination = "Positano, Italy",
            overallScore = 4.8,
            safetyScore = 94,
            cleanlinessScore = 95,
            hospitalityScore = 96,
            valueScore = 88
        ),
        RatingItem(
            id = "rat3",
            destination = "Interlaken, Switzerland",
            overallScore = 4.9,
            safetyScore = 99,
            cleanlinessScore = 99,
            hospitalityScore = 98,
            valueScore = 90
        )
    )

    val activities = listOf(
        ActivityItem(
            id = "act1",
            title = "Kitsune Shrine Night Tour & Matcha Tea",
            destination = "Kyoto, Japan",
            category = "Adventure",
            priceUSD = 45,
            rating = 4.9,
            imageUrl = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
            petFriendly = false,
            isWaterSport = false
        ),
        ActivityItem(
            id = "act2",
            title = "Emerald Cave Snorkeling & Yacht Charter",
            destination = "Amalfi Coast, Italy",
            category = "Water Sports",
            priceUSD = 120,
            rating = 4.8,
            imageUrl = "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
            petFriendly = true,
            isWaterSport = true
        ),
        ActivityItem(
            id = "act3",
            title = "Eiger Glacier Paragliding Flight",
            destination = "Bernese Oberland, Switzerland",
            category = "Mountains",
            priceUSD = 180,
            rating = 4.9,
            imageUrl = "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80",
            petFriendly = true,
            isWaterSport = false
        )
    )

    val videos = listOf(
        VideoItem(
            id = "v1",
            title = "4K Scenic Walk: Kyoto Bamboo Forest & Torii Gates",
            destination = "Kyoto, Japan",
            duration = "12:40",
            thumbnailUrl = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
            views = "2.4M views",
            author = "Nomad Explorers 4K"
        ),
        VideoItem(
            id = "v2",
            title = "Top 10 Hidden Amalfi Coast Spots You Must Visit",
            destination = "Amalfi Coast, Italy",
            duration = "08:15",
            thumbnailUrl = "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
            views = "1.1M views",
            author = "Travel Vibe Official"
        ),
        VideoItem(
            id = "v3",
            title = "Paragliding Over Interlaken Alpine Valley",
            destination = "Interlaken, Switzerland",
            duration = "05:50",
            thumbnailUrl = "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80",
            views = "890K views",
            author = "Adrenaline Seekers"
        )
    )

    val hubBookings = listOf(
        BookingHubItem(
            id = "b1",
            title = "Taj Exotica Resort & Spa Goa",
            type = "Resort",
            destination = "Benaulim, Goa, India",
            provider = "Taj Exotica Goa",
            referenceCode = "TAJ-GOA-8821",
            date = "Aug 15 - Aug 18, 2026",
            priceUSD = 280,
            status = "Confirmed",
            pnr = "RES-GOA-9812",
            seatOrRoom = "Luxury Sea View Villa #204",
            qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TAJ-GOA-8821",
            invoiceNumber = "INV-2026-9041",
            checkInDate = "Aug 15, 2026",
            checkOutDate = "Aug 18, 2026",
            numberOfNights = 3,
            numberOfGuests = 2,
            totalAmountINR = 23240,
            paymentMethod = "Google Pay (UPI)",
            paymentStatus = "Paid",
            imageUrl = "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80",
            hotelName = "Taj Exotica Resort & Spa Goa"
        ),
        BookingHubItem(
            id = "b2",
            title = "The Oberoi Cecil Heritage Resort",
            type = "Hotel",
            destination = "Shimla, Himachal Pradesh",
            provider = "Oberoi Cecil Shimla",
            referenceCode = "OBR-SHM-5529",
            date = "Sep 10 - Sep 14, 2026",
            priceUSD = 210,
            status = "Confirmed",
            pnr = "RES-SHM-4410",
            seatOrRoom = "Valley View Suite #302",
            qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=OBR-SHM-5529",
            invoiceNumber = "INV-2026-8102",
            checkInDate = "Sep 10, 2026",
            checkOutDate = "Sep 14, 2026",
            numberOfNights = 4,
            numberOfGuests = 2,
            totalAmountINR = 17430,
            paymentMethod = "PhonePe UPI",
            paymentStatus = "Paid",
            imageUrl = "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
            hotelName = "Oberoi Cecil Shimla"
        ),
        BookingHubItem(
            id = "b3",
            title = "Kumarakom Lake Luxury Resort",
            type = "Resort",
            destination = "Kumarakom, Kerala, India",
            provider = "Kumarakom Lake Resort",
            referenceCode = "KLR-KER-6629",
            date = "Oct 02 - Oct 05, 2026",
            priceUSD = 320,
            status = "Confirmed",
            pnr = "RES-KER-8890",
            seatOrRoom = "Heritage Meandering Pool Villa",
            qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=KLR-KER-6629",
            invoiceNumber = "INV-2026-7291",
            checkInDate = "Oct 02, 2026",
            checkOutDate = "Oct 05, 2026",
            numberOfNights = 3,
            numberOfGuests = 2,
            totalAmountINR = 26560,
            paymentMethod = "Paytm UPI",
            paymentStatus = "Paid",
            imageUrl = "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
            hotelName = "Kumarakom Lake Resort"
        )
    )

    val hubTickets = listOf(
        TicketItem(
            id = "t1",
            bookingId = "b1",
            ticketNumber = "TKT-JAL-90122",
            passengerName = "Siva Shirish",
            transportType = "Flight",
            departureLocation = "San Francisco (SFO) Gate 82",
            arrivalLocation = "Tokyo Haneda (HND) T3",
            departureTime = "10:30 AM, Oct 12",
            arrivalTime = "02:15 PM, Oct 13",
            seatNumber = "14A",
            classType = "Business Select",
            gateOrPlatform = "Gate 82",
            qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TKT-JAL-90122"
        ),
        TicketItem(
            id = "t2",
            bookingId = "b3",
            ticketNumber = "TKT-JR-8821",
            passengerName = "Siva Shirish",
            transportType = "Train",
            departureLocation = "Tokyo Station Platform 16",
            arrivalLocation = "Kyoto Station Track 2",
            departureTime = "04:00 PM, Oct 13",
            arrivalTime = "06:15 PM, Oct 13",
            seatNumber = "Car 3 - 8B",
            classType = "Green Car Reserved",
            gateOrPlatform = "Platform 16",
            qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TKT-JR-8821"
        )
    )

    val visaStatuses = listOf(
        VisaStatusItem(
            id = "v1",
            country = "Japan",
            passportNumber = "P-9821820A",
            visaType = "e-Visa Tourist Single Entry",
            status = "Approved",
            validUntil = "Jan 15, 2027",
            entriesAllowed = "Single Entry (90 Days)",
            applicationRef = "EVISA-JP-99210"
        ),
        VisaStatusItem(
            id = "v2",
            country = "Schengen Zone (Italy/France)",
            passportNumber = "P-9821820A",
            visaType = "Short-Stay C Visa",
            status = "Visa Free",
            validUntil = "ETIAS Active 2028",
            entriesAllowed = "Multiple Entry (90/180 Days)",
            applicationRef = "ETIAS-EU-8821"
        )
    )

    val travelDocuments = listOf(
        TravelDocumentItem(
            id = "d1",
            title = "Official Passport (US)",
            category = "Passport",
            docNumber = "P-9821820A",
            expiryDate = "Aug 2030",
            fileUrl = "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80",
            isVerified = true
        ),
        TravelDocumentItem(
            id = "d2",
            title = "Japan Tourist eVisa PDF",
            category = "Visa",
            docNumber = "EVISA-JP-99210",
            expiryDate = "Jan 2027",
            fileUrl = "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
            isVerified = true
        ),
        TravelDocumentItem(
            id = "d3",
            title = "Allianz World Travel Insurance",
            category = "Insurance",
            docNumber = "INS-881204-GLOBAL",
            expiryDate = "Nov 2026",
            fileUrl = "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
            isVerified = true
        )
    )

    val packingListHub = listOf(
        PackingHubItem(id = "p1", category = "Essentials", itemTitle = "Passport & eVisa Printouts", isPacked = true, quantity = 1),
        PackingHubItem(id = "p2", category = "Electronics", itemTitle = "Universal Adapter & Powerbank", isPacked = true, quantity = 2),
        PackingHubItem(id = "p3", category = "Clothes", itemTitle = "Light Rain Jacket & Walking Shoes", isPacked = false, quantity = 1),
        PackingHubItem(id = "p4", category = "Electronics", itemTitle = "Camera & Extra SD Cards", isPacked = false, quantity = 1),
        PackingHubItem(id = "p5", category = "Toiletries", itemTitle = "Sunscreen & Personal Meds", isPacked = true, quantity = 1)
    )

    val travelExpenses = listOf(
        TravelExpenseItem(id = "e1", title = "Japan Airlines Ticket", category = "Flight", amountUSD = 780.0, date = "Oct 10, 2026", paymentMethod = "Credit Card", receiptUrl = ""),
        TravelExpenseItem(id = "e2", title = "Granvia Kyoto Hotel Deposit", category = "Hotel", amountUSD = 300.0, date = "Oct 11, 2026", paymentMethod = "Apple Pay", receiptUrl = ""),
        TravelExpenseItem(id = "e3", title = "Gion Ramen & Matcha Dinner", category = "Food", amountUSD = 45.5, date = "Oct 13, 2026", paymentMethod = "Cash JPY", receiptUrl = "")
    )

    val travelNotes = listOf(
        TravelNoteItem(id = "n1", title = "Kyoto Tea Ceremony Rules", content = "Bow gently when entering the room. Remove shoes at tatami entrance. Avoid loud photos inside.", date = "Oct 12, 2026", tag = "Etiquette"),
        TravelNoteItem(id = "n2", title = "ICOCA Transport Card Top Up", content = "Top up 5000 JPY at Seven Eleven or Station Kiosk using cash.", date = "Oct 13, 2026", tag = "Transit")
    )

    val emergencyContacts = listOf(
        EmergencyContactItem(id = "ec1", name = "US Embassy Tokyo / Consular", relationship = "Official Embassy", phone = "+81 3-3224-5000", email = "tokyoacs@state.gov", country = "Japan", isLocalEmergency = true),
        EmergencyContactItem(id = "ec2", name = "Japan Emergency Police (110) & Ambulance (119)", relationship = "Local SOS Services", phone = "110 / 119", email = "sos@police.pref.kyoto.jp", country = "Japan", isLocalEmergency = true),
        EmergencyContactItem(id = "ec3", name = "Sarah Shirish (Sister)", relationship = "Primary Contact", phone = "+1 (555) 992-0192", email = "sarah.s@gmail.com", country = "USA", isLocalEmergency = false)
    )

    val tripTimeline = listOf(
        TimelineItem(id = "tm1", tripId = "tr1", dayNumber = 1, date = "Oct 12, 2026", title = "Flight Departure SFO ➔ HND", time = "10:30 AM", location = "San Francisco Intl Airport", description = "Board JAL Flight JL002. Enjoy in-flight dining and relax.", category = "Flight", status = "Completed"),
        TimelineItem(id = "tm2", tripId = "tr1", dayNumber = 2, date = "Oct 13, 2026", title = "Shinkansen to Kyoto & Hotel Check-in", time = "04:00 PM", location = "Kyoto Station", description = "Ride Shinkansen Green Car to Kyoto. Check into Granvia Kyoto.", category = "Check-in", status = "In Progress"),
        TimelineItem(id = "tm3", tripId = "tr1", dayNumber = 3, date = "Oct 14, 2026", title = "Arashiyama Bamboo Grove & Monkey Park", time = "08:30 AM", location = "Arashiyama, Kyoto", description = "Early morning walk in bamboo grove before crowds arrive.", category = "Tour", status = "Upcoming"),
        TimelineItem(id = "tm4", tripId = "tr1", dayNumber = 4, date = "Oct 15, 2026", title = "Fushimi Inari Shrine Sunset Tour", time = "04:30 PM", location = "Fushimi Inari", description = "Hike up the 10,000 torii gates to sunset overlook point.", category = "Tour", status = "Upcoming")
    )

    val photoMemories = listOf(
        PhotoMemoryItem(
            id = "ph1",
            tripId = "tr1",
            caption = "Sunset silhouette at Fushimi Inari Torii Gates ⛩️",
            photoUrl = "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
            location = "Kyoto, Japan",
            date = "Oct 14, 2026",
            likesCount = 124,
            tags = listOf("Japan", "Sunset", "Culture")
        ),
        PhotoMemoryItem(
            id = "ph2",
            tripId = "tr1",
            caption = "Morning coffee by the Amalfi Coast cliffside ☕🌊",
            photoUrl = "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80",
            location = "Positano, Italy",
            date = "Jul 08, 2025",
            likesCount = 210,
            tags = listOf("Italy", "Amalfi", "Seaside")
        ),
        PhotoMemoryItem(
            id = "ph3",
            tripId = "tr1",
            caption = "Alpine panorama from Matterhorn Gornergrat train 🏔️",
            photoUrl = "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80",
            location = "Zermatt, Switzerland",
            date = "Jan 20, 2025",
            likesCount = 189,
            tags = listOf("Alps", "Snow", "Train")
        )
    )

    val tripInvoices = listOf(
        TripInvoiceItem(
            id = "inv1",
            invoiceNumber = "INV-2026-JP881",
            tripName = "Japan Autumn Cultural Expedition",
            totalAmountUSD = 1835.50,
            issueDate = "Oct 11, 2026",
            paymentStatus = "Paid",
            items = listOf(
                InvoiceLineItem("Japan Airlines SFO-HND Flight", "Transportation", 780.00),
                InvoiceLineItem("Hotel Granvia Kyoto (5 Nights)", "Accommodation", 920.00),
                InvoiceLineItem("Shinkansen Bullet Train Pass", "Rail Transport", 135.50)
            )
        )
    )

    val states = listOf(
        StateItem("st_kansai", "Kansai Region", "Japan", "JP-26", 48, "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80"),
        StateItem("st_campania", "Campania Region", "Italy", "IT-72", 32, "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80"),
        StateItem("st_hawaii", "Hawaii State", "USA", "US-HI", 28, "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80")
    )

    val cities = listOf(
        CityItem("ct_kyoto", "st_kansai", "Kyoto", "Japan", 4.9, "Oct - Nov & Mar - Apr", "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80"),
        CityItem("ct_positano", "st_campania", "Positano", "Italy", 4.8, "May - Sep", "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80"),
        CityItem("ct_honolulu", "st_hawaii", "Honolulu", "USA", 4.7, "Dec - Apr", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80")
    )

    val searchHistory = listOf(
        SearchHistoryItem("sh1", "user_101", "Kyoto Tea Ceremony", "Activities", "2026-07-29T06:00:00Z"),
        SearchHistoryItem("sh2", "user_101", "Amalfi Coast Hotels", "Hotels", "2026-07-28T14:30:00Z"),
        SearchHistoryItem("sh3", "user_101", "Shinkansen Bullet Train", "Tickets", "2026-07-27T09:15:00Z")
    )

    val notifications = listOf(
        NotificationItem("n1", "user_101", "Flight Confirmation", "Your JAL flight JL002 seat 14A is confirmed for Oct 12.", "Booking", false, "10 mins ago"),
        NotificationItem("n2", "user_101", "eVisa Approved", "Your Japan e-Visa EVISA-JP-99210 is now active.", "Visa", true, "2 hours ago"),
        NotificationItem("n3", "user_101", "Weather Advisory", "Clear sunny skies expected in Kyoto next week (22°C).", "Weather", true, "1 day ago")
    )

    val messages = listOf(
        MessageItem("m1", "user_101", "TravelNest AI Concierge", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80", "Hello Siva! I've loaded your Kyoto itinerary and hotel bookings.", "08:30 AM", isAiAssistant = true),
        MessageItem("m2", "user_101", "Hotel Granvia Concierge", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80", "Looking forward to welcoming you on Oct 13! Your Deluxe King Room is ready.", "09:15 AM", isAiAssistant = false)
    )

    val supportTickets = listOf(
        SupportTicketItem("st1", "user_101", "Inquire about ICOCA Card Pass", "Transit", "Resolved", "Low", "2026-07-25"),
        SupportTicketItem("st2", "user_101", "Request PDF Invoice for Company Expense", "Billing", "Closed", "Medium", "2026-07-26")
    )
}

// Firestore Infrastructure Configuration: Security Rules, Indexes, Document Mappings
object FirestoreSchema {
    val collectionNames = listOf(
        "users", "places", "states", "cities", "hotels", "resorts",
        "restaurants", "beaches", "activities", "blogs", "reviews", "ratings",
        "bookings", "packages", "offers", "weather", "favorites", "tripHistory",
        "searchHistory", "notifications", "expenses", "documents", "AIPlans",
        "messages", "support"
    )

    val securityRulesSnippet = """
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            // Helper function to check auth
            function isAuthenticated() {
              return request.auth != null;
            }
            function isOwner(userId) {
              return isAuthenticated() && request.auth.uid == userId;
            }

            // Public Collections (Read-Only to Public, Write to Admin)
            match /places/{docId} { allow read: if true; }
            match /states/{docId} { allow read: if true; }
            match /cities/{docId} { allow read: if true; }
            match /hotels/{docId} { allow read: if true; }
            match /resorts/{docId} { allow read: if true; }
            match /restaurants/{docId} { allow read: if true; }
            match /beaches/{docId} { allow read: if true; }
            match /activities/{docId} { allow read: if true; }
            match /blogs/{docId} { allow read: if true; }
            match /reviews/{docId} { allow read: if true; allow create: if isAuthenticated(); }
            match /ratings/{docId} { allow read: if true; }
            match /packages/{docId} { allow read: if true; }
            match /offers/{docId} { allow read: if true; }
            match /weather/{docId} { allow read: if true; }

            // User-Scoped Collections (Protected by User UID)
            match /users/{userId} {
              allow read, write: if isOwner(userId);
            }
            match /favorites/{favId} {
              allow read, write: if isAuthenticated() && resource.data.userId == request.auth.uid;
              allow create: if isAuthenticated() && request.resource.data.userId == request.auth.uid;
            }
            match /bookings/{bookingId} { allow read, write: if isAuthenticated(); }
            match /tripHistory/{tripId} { allow read, write: if isAuthenticated(); }
            match /searchHistory/{shId} { allow read, write: if isAuthenticated(); }
            match /notifications/{notifId} { allow read, write: if isAuthenticated(); }
            match /expenses/{expId} { allow read, write: if isAuthenticated(); }
            match /documents/{docId} { allow read, write: if isAuthenticated(); }
            match /AIPlans/{planId} { allow read, write: if isAuthenticated(); }
            match /messages/{msgId} { allow read, write: if isAuthenticated(); }
            match /support/{ticketId} { allow read, write: if isAuthenticated(); }
          }
        }
    """.trimIndent()

    val indexesConfig = listOf(
        "favorites: userId ASC + createdAt DESC",
        "bookings: userId ASC + date DESC",
        "expenses: userId ASC + date DESC",
        "places: country ASC + rating DESC",
        "reviews: destination ASC + rating DESC",
        "AIPlans: userId ASC + createdAt DESC"
    )
}

