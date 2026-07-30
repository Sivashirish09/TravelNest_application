package com.example.data

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface TripDao {
    @Query("SELECT * FROM trips ORDER BY id DESC")
    fun getAllTrips(): Flow<List<TripEntity>>

    @Query("SELECT * FROM trips WHERE id = :id")
    suspend fun getTripById(id: Long): TripEntity?

    @Query("SELECT * FROM trips WHERE isUpcoming = 1 ORDER BY id DESC LIMIT 1")
    fun getUpcomingTrip(): Flow<TripEntity?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertTrip(trip: TripEntity): Long

    @Update
    suspend fun updateTrip(trip: TripEntity)

    @Delete
    suspend fun deleteTrip(trip: TripEntity)
}

@Dao
interface DestinationDao {
    @Query("SELECT * FROM destinations")
    fun getAllDestinations(): Flow<List<DestinationEntity>>

    @Query("SELECT * FROM destinations WHERE isFavorite = 1")
    fun getFavoriteDestinations(): Flow<List<DestinationEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertDestinations(destinations: List<DestinationEntity>)

    @Update
    suspend fun updateDestination(destination: DestinationEntity)
}

@Dao
interface CommunityDao {
    @Query("SELECT * FROM community_posts ORDER BY id DESC")
    fun getAllPosts(): Flow<List<CommunityPostEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPost(post: CommunityPostEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPosts(posts: List<CommunityPostEntity>)

    @Update
    suspend fun updatePost(post: CommunityPostEntity)
}

@Dao
interface PackingDao {
    @Query("SELECT * FROM packing_items WHERE tripId = :tripId")
    fun getPackingItemsForTrip(tripId: Long): Flow<List<PackingItemEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertPackingItem(item: PackingItemEntity)

    @Update
    suspend fun updatePackingItem(item: PackingItemEntity)

    @Delete
    suspend fun deletePackingItem(item: PackingItemEntity)
}

@Dao
interface BudgetDao {
    @Query("SELECT * FROM budget_items WHERE tripId = :tripId")
    fun getBudgetItemsForTrip(tripId: Long): Flow<List<BudgetItemEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBudgetItem(item: BudgetItemEntity)

    @Delete
    suspend fun deleteBudgetItem(item: BudgetItemEntity)
}
