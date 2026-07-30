-- ========================================================
-- SEED DATA FOR TRAVELNEST
-- ========================================================

-- Insert Sample User
INSERT INTO users (id, email, name, hashed_password, phone, preferred_budget, travel_style)
VALUES ('usr_sivashirish09', 'sivashirish09@gmail.com', 'Siva Shirish', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '+91 98765 43210', 35000, 'Luxury');

-- Insert Destinations
INSERT INTO destinations (id, name, state, description, image_url, best_season, weather_info, estimated_budget_inr, recommended_days, rating, review_count, category, latitude, longitude) VALUES
('goa', 'Goa', 'Goa', 'Famous for pristine golden beaches, Portuguese heritage architecture, vibrant nightlife, and spice plantations.', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80', 'Nov - Feb', '28°C Sunny & Breezy', 18000, 4, 4.8, 320, 'Beach', 15.2993, 74.1240),
('manali', 'Manali', 'Himachal Pradesh', 'High-altitude Himalayan resort town known for snow-capped peaks, Solang Valley adventures, and Rohtang Pass.', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80', 'Oct - Jun', '12°C Crisp Alpine Air', 22000, 5, 4.7, 280, 'Hill Station', 32.2432, 77.1892),
('shimla', 'Shimla', 'Himachal Pradesh', 'The capital of Himachal Pradesh, renowned for its colonial architecture, Mall Road, and Ridge views.', 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=600&q=80', 'Mar - Jun', '16°C Cool Mountain Mist', 16000, 3, 4.6, 210, 'Hill Station', 31.1048, 77.1734),
('leh_ladakh', 'Leh Ladakh', 'Ladakh', 'Dramatic high-desert mountain landscapes, crystal Pangong Lake, and historic Tibetan Buddhist monasteries.', 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80', 'May - Sep', '14°C Sunny Mountain Sky', 35000, 6, 4.9, 410, 'Adventure', 34.1526, 77.5771),
('jaipur', 'Jaipur', 'Rajasthan', 'The iconic Pink City featuring grand Amber Fort, Hawa Mahal, City Palace, and rich Royal Rajasthani heritage.', 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80', 'Oct - Mar', '24°C Pleasant Desert Sun', 15000, 3, 4.7, 340, 'Heritage', 26.9124, 75.7873),
('munnar', 'Munnar', 'Kerala', 'Rolling emerald tea plantations, foggy hills, Anamudi peak, and serene mountain wildlife sanctuaries.', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', 'Sep - Mar', '19°C Pleasant Tea Breeze', 17000, 4, 4.8, 290, 'Hill Station', 10.0889, 77.0595),
('alleppey', 'Alleppey', 'Kerala', 'Venice of the East, famous for luxury houseboat cruises along calm palm-fringed backwaters.', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80', 'Nov - Feb', '27°C Humid Coastal Breeze', 19000, 3, 4.9, 380, 'Backwaters', 9.4981, 76.3388),
('varanasi', 'Varanasi', 'Uttar Pradesh', 'Spiritual capital of India along the sacred Ganges river, famous for evening Ganga Aarti and ancient ghats.', 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80', 'Oct - Mar', '22°C Mild Pleasant Air', 12000, 3, 4.8, 450, 'Spiritual', 25.3176, 82.9739);

-- Insert Hotels
INSERT INTO hotels (id, destination_id, name, image_url, rating, price_per_night_inr, category, amenities, distance_km) VALUES
('htl_goa_1', 'goa', 'Taj Exotica Resort & Spa Goa', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', 4.9, 14500, 'Luxury Resort', 'Private Beach,Infinity Pool,Spa,Fine Dining', 0.5),
('htl_manali_1', 'manali', 'The Grand Dragon Himalayan Resort', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80', 4.8, 9800, 'Mountain Resort', 'Heated Pool,Mountain View,Fireplace', 1.2),
('htl_shimla_1', 'shimla', 'Oberoi Cecil Heritage Hotel', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80', 4.9, 12000, 'Heritage', 'Valley View,Heated Pool,Colonial Bar', 0.8);

-- Insert Sample Booking
INSERT INTO bookings (id, user_id, destination_name, hotel_or_resort_name, type, booking_reference, invoice_number, check_in_date, check_out_date, number_of_nights, number_of_guests, total_amount_inr, payment_method, payment_status, status, qr_code_url, image_url)
VALUES ('b1', 'usr_sivashirish09', 'Goa, India', 'Taj Exotica Resort & Spa Goa', 'Resort', 'TAJ-GOA-8821', 'INV-2026-9041', 'Aug 15, 2026', 'Aug 18, 2026', 3, 2, 23240, 'Google Pay (UPI)', 'PAID', 'CONFIRMED', 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TAJ-GOA-8821', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80');
