-- ========================================================
-- TRAVELNEST POSTGRESQL DATABASE SCHEMA
-- ========================================================

DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS ai_plans CASCADE;
DROP TABLE IF EXISTS saved_items CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS resorts CASCADE;
DROP TABLE IF EXISTS hotels CASCADE;
DROP TABLE IF EXISTS destinations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS TABLE
CREATE TABLE users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    phone VARCHAR(32),
    avatar_url VARCHAR(512),
    preferred_budget INT DEFAULT 25000,
    travel_style VARCHAR(64) DEFAULT 'Moderate',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. DESTINATIONS TABLE
CREATE TABLE destinations (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url VARCHAR(512) NOT NULL,
    best_season VARCHAR(128) NOT NULL,
    weather_info VARCHAR(128) NOT NULL,
    estimated_budget_inr INT NOT NULL,
    recommended_days INT NOT NULL,
    rating NUMERIC(3,2) DEFAULT 4.5,
    review_count INT DEFAULT 120,
    category VARCHAR(64) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL
);

-- 3. HOTELS TABLE
CREATE TABLE hotels (
    id VARCHAR(64) PRIMARY KEY,
    destination_id VARCHAR(64) REFERENCES destinations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    image_url VARCHAR(512) NOT NULL,
    rating NUMERIC(3,2) DEFAULT 4.7,
    price_per_night_inr INT NOT NULL,
    category VARCHAR(64) DEFAULT 'Luxury',
    amenities TEXT NOT NULL,
    distance_km NUMERIC(4,2) DEFAULT 1.5
);

-- 4. RESORTS TABLE
CREATE TABLE resorts (
    id VARCHAR(64) PRIMARY KEY,
    destination_id VARCHAR(64) REFERENCES destinations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    image_url VARCHAR(512) NOT NULL,
    rating NUMERIC(3,2) DEFAULT 4.8,
    price_per_night_inr INT NOT NULL,
    category VARCHAR(64) DEFAULT 'Beach Resort',
    amenities TEXT NOT NULL,
    distance_km NUMERIC(4,2) DEFAULT 2.0
);

-- 5. BOOKINGS TABLE
CREATE TABLE bookings (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    destination_name VARCHAR(255) NOT NULL,
    hotel_or_resort_name VARCHAR(255) NOT NULL,
    type VARCHAR(64) NOT NULL,
    booking_reference VARCHAR(64) UNIQUE NOT NULL,
    invoice_number VARCHAR(64) UNIQUE NOT NULL,
    check_in_date VARCHAR(64) NOT NULL,
    check_out_date VARCHAR(64) NOT NULL,
    number_of_nights INT DEFAULT 3,
    number_of_guests INT DEFAULT 2,
    total_amount_inr INT NOT NULL,
    payment_method VARCHAR(64) DEFAULT 'UPI (Google Pay)',
    payment_status VARCHAR(32) DEFAULT 'PAID',
    status VARCHAR(32) DEFAULT 'CONFIRMED',
    qr_code_url VARCHAR(512) NOT NULL,
    image_url VARCHAR(512) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. SAVED ITEMS
CREATE TABLE saved_items (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    item_type VARCHAR(32) NOT NULL,
    item_id VARCHAR(64) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    image_url VARCHAR(512) NOT NULL,
    saved_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. AI PLANS TABLE
CREATE TABLE ai_plans (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) REFERENCES users(id) ON DELETE CASCADE,
    destination VARCHAR(255) NOT NULL,
    days INT NOT NULL,
    budget_inr INT NOT NULL,
    travel_style VARCHAR(64) NOT NULL,
    itinerary_json TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR FAST QUERYING
CREATE INDEX idx_destinations_state ON destinations(state);
CREATE INDEX idx_destinations_category ON destinations(category);
CREATE INDEX idx_hotels_destination ON hotels(destination_id);
CREATE INDEX idx_resorts_destination ON resorts(destination_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
