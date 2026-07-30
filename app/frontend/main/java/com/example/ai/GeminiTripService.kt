package com.example.ai

import com.example.BuildConfig
import com.example.data.ActivityDetail
import com.example.data.DayItinerary
import com.example.data.TripEntity
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.TimeUnit

object GeminiTripService {

    private val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS)
        .readTimeout(30, TimeUnit.SECONDS)
        .build()

    suspend fun generateTripPlan(
        destination: String,
        durationDays: Int,
        budgetLevel: String,
        vibe: String,
        party: String,
        interests: List<String>
    ): TripEntity = withContext(Dispatchers.IO) {
        val apiKey = try {
            BuildConfig.GEMINI_API_KEY
        } catch (e: Exception) {
            ""
        }

        var jsonResponseText: String? = null

        if (apiKey.isNotBlank() && apiKey != "MY_GEMINI_API_KEY") {
            try {
                val prompt = """
                    You are TravelNest AI, an expert travel concierge.
                    Create a detailed $durationDays-day travel itinerary for $destination.
                    Traveler specs: Budget: $budgetLevel, Vibe: $vibe, Party: $party, Interests: ${interests.joinToString(", ")}.

                    Respond ONLY in raw valid JSON format matching this structure:
                    {
                      "title": "Unforgettable $destination $vibe Getaway",
                      "totalEstimatedCostUSD": ${durationDays * 120},
                      "days": [
                        {
                          "dayNumber": 1,
                          "theme": "Arrival & Iconic Landmarks",
                          "morningActivity": {
                            "time": "09:00 AM",
                            "title": "Explore Historic Center",
                            "description": "Walk through famous plazas and marvel at local architecture.",
                            "estCostUSD": 25,
                            "locationName": "Main Square, $destination"
                          },
                          "afternoonActivity": {
                            "time": "01:30 PM",
                            "title": "Culinary Tasting Tour",
                            "description": "Sample traditional dishes and regional delicacies.",
                            "estCostUSD": 40,
                            "locationName": "Old Town Market"
                          },
                          "eveningActivity": {
                            "time": "07:00 PM",
                            "title": "Sunset View & Lounge",
                            "description": "Enjoy panoramic views with refreshing drinks.",
                            "estCostUSD": 30,
                            "locationName": "Skyline Bar"
                          },
                          "foodieSpot": "Locals' Favorite Bistro",
                          "insiderTip": "Buy attraction tickets online to skip the line."
                        }
                      ]
                    }
                """.trimIndent()

                val requestBodyJson = JSONObject().apply {
                    put("contents", JSONArray().apply {
                        put(JSONObject().apply {
                            put("parts", JSONArray().apply {
                                put(JSONObject().put("text", prompt))
                            })
                        })
                    })
                }

                val url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=$apiKey"
                val request = Request.Builder()
                    .url(url)
                    .post(requestBodyJson.toString().toRequestBody("application/json".toMediaType()))
                    .build()

                val response = client.newCall(request).execute()
                val bodyString = response.body?.string()
                if (response.isSuccessful && !bodyString.isNullOrBlank()) {
                    val root = JSONObject(bodyString)
                    val candidates = root.optJSONArray("candidates")
                    if (candidates != null && candidates.length() > 0) {
                        val text = candidates.getJSONObject(0)
                            .getJSONObject("content")
                            .getJSONArray("parts")
                            .getJSONObject(0)
                            .getString("text")
                        
                        // Extract JSON from markdown backticks if present
                        val cleanJson = text.replace("```json", "").replace("```", "").trim()
                        jsonResponseText = cleanJson
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }

        // Fallback generator if AI API call fails or key is missing
        val daysList = mutableListOf<DayItinerary>()
        var title: String = "$durationDays-Day $vibe Trip to $destination"
        var totalCost: Double = (durationDays * 135).toDouble()

        if (jsonResponseText != null) {
            try {
                val parsedObj = JSONObject(jsonResponseText)
                title = parsedObj.optString("title", "$durationDays Days in $destination")
                totalCost = parsedObj.optDouble("totalEstimatedCostUSD", (durationDays * 135).toDouble())
                val daysArr = parsedObj.optJSONArray("days")
                if (daysArr != null) {
                    for (i in 0 until daysArr.length()) {
                        val dObj = daysArr.getJSONObject(i)
                        daysList.add(parseDayItinerary(dObj, i + 1, destination))
                    }
                }
            } catch (e: Exception) {
                generateFallbackDays(destination, durationDays, budgetLevel, daysList)
                title = "$durationDays-Day $vibe Experience in $destination"
                totalCost = (durationDays * 140).toDouble()
            }
        } else {
            generateFallbackDays(destination, durationDays, budgetLevel, daysList)
            title = "$durationDays-Day Smart $vibe Trip to $destination"
            totalCost = (durationDays * 125).toDouble()
        }

        // Serialize day list into JSON string
        val serializedItinerary = serializeDays(daysList)

        TripEntity(
            destination = destination,
            title = title,
            durationDays = durationDays,
            startDate = "2026-08-15",
            budgetLevel = budgetLevel,
            totalEstimatedCost = totalCost,
            vibe = vibe,
            travelParty = party,
            coverGradient = when(vibe) {
                "Luxury" -> "GoldDark"
                "Adventure" -> "CoralTeal"
                "Relaxed" -> "EmeraldSky"
                else -> "TealAmber"
            },
            isSaved = true,
            isUpcoming = true,
            itineraryJson = serializedItinerary
        )
    }

    private fun parseDayItinerary(dObj: JSONObject, fallbackDayNum: Int, destination: String): DayItinerary {
        val dayNum = dObj.optInt("dayNumber", fallbackDayNum)
        val theme = dObj.optString("theme", "Explore & Discover")
        
        val morning = parseActivity(dObj.optJSONObject("morningActivity"), "09:00 AM", "Morning Discovery", "Visit iconic local sights", 25, "$destination Spot")
        val afternoon = parseActivity(dObj.optJSONObject("afternoonActivity"), "01:30 PM", "Cultural Immersion", "Explore vibrant markets and museums", 35, "$destination Center")
        val evening = parseActivity(dObj.optJSONObject("eveningActivity"), "07:00 PM", "Sunset Dining", "Enjoy evening local cuisine", 40, "$destination Promenade")

        val food = dObj.optString("foodieSpot", "Traditional local eatery")
        val tip = dObj.optString("insiderTip", "Book tickets in advance to save time!")

        return DayItinerary(
            dayNumber = dayNum,
            theme = theme,
            morningActivity = morning,
            afternoonActivity = afternoon,
            eveningActivity = evening,
            foodieSpot = food,
            insiderTip = tip
        )
    }

    private fun parseActivity(obj: JSONObject?, defaultTime: String, defaultTitle: String, defaultDesc: String, defaultCost: Int, defaultLoc: String): ActivityDetail {
        if (obj == null) return ActivityDetail(defaultTime, defaultTitle, defaultDesc, defaultCost, defaultLoc)
        return ActivityDetail(
            time = obj.optString("time", defaultTime),
            title = obj.optString("title", defaultTitle),
            description = obj.optString("description", defaultDesc),
            estCostUSD = obj.optInt("estCostUSD", defaultCost),
            locationName = obj.optString("locationName", defaultLoc)
        )
    }

    private fun generateFallbackDays(destination: String, durationDays: Int, budgetLevel: String, daysList: MutableList<DayItinerary>) {
        val multiplier = when(budgetLevel) {
            "Backpacker" -> 0.6
            "Luxury" -> 2.2
            else -> 1.0
        }

        val sampleThemes = listOf(
            "Arrival & Iconic Sights",
            "Hidden Gems & Local Culture",
            "Culinary Trails & Food Markets",
            "Scenic Nature & Panorama Views",
            "Historic Heritage Walk",
            "Art, Shopping & Artisan Quarter",
            "Relaxation & Farewell Drinks"
        )

        for (i in 1..durationDays) {
            val themeIndex = (i - 1) % sampleThemes.size
            daysList.add(
                DayItinerary(
                    dayNumber = i,
                    theme = sampleThemes[themeIndex],
                    morningActivity = ActivityDetail(
                        time = "09:30 AM",
                        title = "Explore ${destination} Highlights",
                        description = "Guided walking tour through historic streets and prominent landmarks.",
                        estCostUSD = (20 * multiplier).toInt(),
                        locationName = "${destination} Downtown"
                    ),
                    afternoonActivity = ActivityDetail(
                        time = "02:00 PM",
                        title = "Local Market & Artisan Shops",
                        description = "Discover local crafts, textiles, and authentic hand-made souvenirs.",
                        estCostUSD = (35 * multiplier).toInt(),
                        locationName = "${destination} Central Market"
                    ),
                    eveningActivity = ActivityDetail(
                        time = "07:30 PM",
                        title = "Scenic Dinner & Evening Walk",
                        description = "Dine at a highly rated local restaurant followed by an illuminated night walk.",
                        estCostUSD = (45 * multiplier).toInt(),
                        locationName = "${destination} Waterfront"
                    ),
                    foodieSpot = "Bistro ${destination} Signature",
                    insiderTip = "Visit around golden hour for the best photo lighting and fewer crowds!"
                )
            )
        }
    }

    fun serializeDays(days: List<DayItinerary>): String {
        val arr = JSONArray()
        for (day in days) {
            val dObj = JSONObject().apply {
                put("dayNumber", day.dayNumber)
                put("theme", day.theme)
                put("foodieSpot", day.foodieSpot)
                put("insiderTip", day.insiderTip)
                put("morningActivity", activityToJson(day.morningActivity))
                put("afternoonActivity", activityToJson(day.afternoonActivity))
                put("eveningActivity", activityToJson(day.eveningActivity))
            }
            arr.put(dObj)
        }
        return arr.toString()
    }

    fun deserializeDays(jsonString: String): List<DayItinerary> {
        val result = mutableListOf<DayItinerary>()
        if (jsonString.isBlank()) return result
        try {
            val arr = JSONArray(jsonString)
            for (i in 0 until arr.length()) {
                val dObj = arr.getJSONObject(i)
                result.add(
                    DayItinerary(
                        dayNumber = dObj.optInt("dayNumber", i + 1),
                        theme = dObj.optString("theme", "Day ${i + 1}"),
                        morningActivity = jsonToActivity(dObj.optJSONObject("morningActivity")),
                        afternoonActivity = jsonToActivity(dObj.optJSONObject("afternoonActivity")),
                        eveningActivity = jsonToActivity(dObj.optJSONObject("eveningActivity")),
                        foodieSpot = dObj.optString("foodieSpot", "Local Cafe"),
                        insiderTip = dObj.optString("insiderTip", "Enjoy your day!")
                    )
                )
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
        return result
    }

    private fun activityToJson(act: ActivityDetail): JSONObject {
        return JSONObject().apply {
            put("time", act.time)
            put("title", act.title)
            put("description", act.description)
            put("estCostUSD", act.estCostUSD)
            put("locationName", act.locationName)
            put("isDone", act.isDone)
        }
    }

    private fun jsonToActivity(obj: JSONObject?): ActivityDetail {
        if (obj == null) return ActivityDetail("10:00 AM", "Free Exploration", "Explore at your own pace", 15, "City Center")
        return ActivityDetail(
            time = obj.optString("time", "10:00 AM"),
            title = obj.optString("title", "Activity"),
            description = obj.optString("description", "Description"),
            estCostUSD = obj.optInt("estCostUSD", 20),
            locationName = obj.optString("locationName", "Spot"),
            isDone = obj.optBoolean("isDone", false)
        )
    }
}
