-- ========================================================
-- SEED DATA FOR TRAVELNEST (ALL INDIAN STATES & INTERNATIONAL)
-- ========================================================

-- Insert Sample User
INSERT INTO users (id, email, name, hashed_password, phone, preferred_budget, travel_style, traveler_level, reward_points)
VALUES ('usr_sivashirish09', 'sivashirish09@gmail.com', 'Siva Shirish', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '+91 98765 43210', 35000, 'Luxury', 'Gold Explorer', 1450)
ON CONFLICT (id) DO NOTHING;

-- Insert Comprehensive India & International Destinations
INSERT INTO destinations (id, name, country, state, description, image_url, best_season, weather_info, estimated_budget_inr, recommended_days, rating, review_count, category, is_international, nearest_airport, nearest_railway, latitude, longitude) VALUES
-- ANDHRA PRADESH
('vizag', 'Visakhapatnam', 'India', 'Andhra Pradesh', 'Port city with R K Beach, Submarine Museum, Kailasagiri hills, and coastal views.', 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?auto=format&fit=crop&w=600&q=80', 'Oct - Mar', '26°C Coastal Sun', 15000, 3, 4.6, 210, 'Beach', FALSE, 'Visakhapatnam Airport (VTZ)', 'Visakhapatnam Station', 17.6868, 83.2185),
('araku', 'Araku Valley', 'India', 'Andhra Pradesh', 'Serene hill station famous for coffee plantations, Borra Caves, and tribal heritage.', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', 'Sep - Feb', '18°C Cool Breeze', 12000, 2, 4.7, 180, 'Hill Station', FALSE, 'Visakhapatnam Airport (VTZ)', 'Araku Station', 18.3273, 82.8775),
('tirupati', 'Tirupati', 'India', 'Andhra Pradesh', 'Sacred pilgrimage destination home to Sri Venkateswara Swamy Temple atop Tirumala hills.', 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80', 'Year-round', '27°C Sunny', 10000, 2, 4.9, 850, 'Spiritual', FALSE, 'Tirupati Airport (TIR)', 'Tirupati Main Station', 13.6288, 79.4192),

-- ARUNACHAL PRADESH
('tawang', 'Tawang', 'India', 'Arunachal Pradesh', 'Breathtaking Himalayan valley featuring Tawang Monastery, Sela Pass, and lakes.', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80', 'Mar - Oct', '10°C Alpine Cold', 28000, 5, 4.8, 150, 'Adventure', FALSE, 'Tezpur Airport (TEZ)', 'Rangapara Station', 27.5860, 91.8594),

-- ASSAM
('kaziranga', 'Kaziranga National Park', 'India', 'Assam', 'UNESCO World Heritage site famous for the endangered Great Indian One-Horned Rhinoceros.', 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=600&q=80', 'Nov - Apr', '22°C Mild Pleasant', 20000, 3, 4.8, 310, 'Wildlife', FALSE, 'Guwahati Airport (GAU)', 'Furkating Station', 26.5775, 93.1711),

-- BIHAR
('bodhgaya', 'Bodh Gaya', 'India', 'Bihar', 'Sacred Buddhist site where Gautama Buddha attained enlightenment under the Mahabodhi Tree.', 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80', 'Oct - Mar', '20°C Mild Sky', 11000, 2, 4.8, 290, 'Spiritual', FALSE, 'Gaya Airport (GAY)', 'Gaya Junction', 24.6961, 84.9869),

-- GOA
('goa', 'Goa', 'India', 'Goa', 'Pristine golden beaches, Portuguese heritage architecture, vibrant nightlife, and spice plantations.', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80', 'Nov - Feb', '28°C Sunny & Breezy', 18000, 4, 4.8, 320, 'Beach', FALSE, 'Dabolim Airport (GOI)', 'Madgaon Junction', 15.2993, 74.1240),

-- GUJARAT
('kutch', 'Rann of Kutch', 'India', 'Gujarat', 'Vast white salt desert famous for Rann Utsav cultural festival and handicraft villages.', 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80', 'Nov - Feb', '21°C Desert Sky', 24000, 4, 4.8, 380, 'Heritage', FALSE, 'Bhuj Airport (BHJ)', 'Bhuj Station', 23.7337, 69.8597),
('statue_of_unity', 'Statue of Unity', 'India', 'Gujarat', 'Worlds tallest statue (182m) dedicated to Sardar Vallabhbhai Patel along Narmada river.', 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80', 'Oct - Mar', '25°C Pleasant', 14000, 2, 4.7, 420, 'Heritage', FALSE, 'Vadodara Airport (BDQ)', 'Ekta Nagar Station', 21.8380, 73.7191),

-- HIMACHAL PRADESH
('manali', 'Manali', 'India', 'Himachal Pradesh', 'High-altitude Himalayan resort town known for snow-capped peaks, Solang Valley, and Rohtang.', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80', 'Oct - Jun', '12°C Crisp Alpine Air', 22000, 5, 4.7, 280, 'Hill Station', FALSE, 'Kullu Manali Airport (KUU)', 'Chandigarh Station', 32.2432, 77.1892),
('shimla', 'Shimla', 'India', 'Himachal Pradesh', 'Colonial summer capital featuring Mall Road, Ridge, toy train, and pine forest views.', 'https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=600&q=80', 'Mar - Jun', '16°C Cool Mist', 16000, 3, 4.6, 210, 'Hill Station', FALSE, 'Shimla Airport (SLV)', 'Kalka Station', 31.1048, 77.1734),
('kasol', 'Kasol & Parvati Valley', 'India', 'Himachal Pradesh', 'Scenic village known as Little Greece of India, gateway to Kheerganga treks.', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80', 'Apr - Oct', '15°C Fresh Mountain', 13000, 3, 4.7, 310, 'Adventure', FALSE, 'Kullu Manali Airport (KUU)', 'Chandigarh Station', 32.0100, 77.3150),
('spiti', 'Spiti Valley', 'India', 'Himachal Pradesh', 'Cold desert mountain valley with Key Monastery, Chandratal Lake, and high passes.', 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80', 'May - Sep', '10°C Sunny Cold', 30000, 6, 4.9, 250, 'Adventure', FALSE, 'Bhuntar Airport (KUU)', 'Chandigarh Station', 32.2461, 78.0349),

-- JAMMU & KASHMIR & LADAKH
('srinagar', 'Srinagar & Dal Lake', 'India', 'Jammu and Kashmir', 'Paradise on Earth with luxury shikara rides on Dal Lake, Mughal Gardens, and houseboats.', 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80', 'Apr - Oct', '16°C Pleasant', 26000, 5, 4.9, 480, 'Hill Station', FALSE, 'Srinagar Airport (SXR)', 'Jammu Tawi Station', 34.0837, 74.7973),
('gulmarg', 'Gulmarg Ski Resort', 'India', 'Jammu and Kashmir', 'Premier winter skiing destination featuring world highest Gondola cable car.', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80', 'Dec - Mar', '4°C Snowy Peak', 32000, 4, 4.9, 390, 'Adventure', FALSE, 'Srinagar Airport (SXR)', 'Jammu Tawi Station', 34.0484, 74.3805),
('leh_ladakh', 'Leh Ladakh', 'India', 'Ladakh', 'High-desert mountain landscapes, Pangong Lake, Nubra Valley, and monasteries.', 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=600&q=80', 'May - Sep', '14°C Sunny Mountain Sky', 35000, 6, 4.9, 410, 'Adventure', FALSE, 'Kushok Bakula Rimpochee Airport', 'Jammu Tawi Station', 34.1526, 77.5771),

-- KARNATAKA
('coorg', 'Coorg (Kodagu)', 'India', 'Karnataka', 'Scotland of India famous for coffee estates, Abbey Falls, Raja Seat, and lush hills.', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', 'Oct - Mar', '20°C Misty Tea Breeze', 18000, 3, 4.8, 340, 'Hill Station', FALSE, 'Kannur Airport (CNN)', 'Mysore Station', 12.4244, 75.7382),
('hampi', 'Hampi', 'India', 'Karnataka', 'UNESCO World Heritage site featuring stone chariot, Vijayanagara ruins, and boulder hills.', 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80', 'Oct - Feb', '25°C Dry Warm', 14000, 3, 4.8, 410, 'Heritage', FALSE, 'Jindal Vijayanagar Airport (VDY)', 'Hosapete Junction', 15.3350, 76.4600),
('gokarna', 'Gokarna Beach', 'India', 'Karnataka', 'Peaceful coastal town with Om Beach, Kudle Beach, and serene Mahabaleshwar temple.', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80', 'Oct - Mar', '27°C Sunny Ocean Air', 13000, 3, 4.7, 270, 'Beach', FALSE, 'Goa Dabolim Airport (GOI)', 'Gokarna Road Station', 14.5479, 74.3188),

-- KERALA
('munnar', 'Munnar', 'India', 'Kerala', 'Rolling emerald tea plantations, foggy hills, Anamudi peak, and serene wildlife.', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', 'Sep - Mar', '19°C Pleasant Tea Breeze', 17000, 4, 4.8, 290, 'Hill Station', FALSE, 'Cochin International Airport (COK)', 'Aluva Station', 10.0889, 77.0595),
('alleppey', 'Alleppey Backwaters', 'India', 'Kerala', 'Venice of the East, famous for luxury houseboat cruises along calm backwaters.', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80', 'Nov - Feb', '27°C Humid Coastal', 19000, 3, 4.9, 380, 'Backwaters', FALSE, 'Cochin International Airport (COK)', 'Alleppey Station', 9.4981, 76.3388),
('varkala', 'Varkala Cliff Beach', 'India', 'Kerala', 'Unique red sandstone cliffs overlooking the Arabian Sea, mineral springs, and surf.', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80', 'Oct - Mar', '28°C Sunset Breeze', 16000, 3, 4.8, 310, 'Beach', FALSE, 'Trivandrum Airport (TRV)', 'Varkala Sivagiri Station', 8.7379, 76.7163),

-- MAHARASHTRA
('lonavala', 'Lonavala & Khandala', 'India', 'Maharashtra', 'Popular monsoon getaway known for Tiger Point, Bhushi Dam, chikki, and green valleys.', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', 'Jul - Feb', '22°C Rainy Green Air', 12000, 2, 4.6, 260, 'Hill Station', FALSE, 'Pune Airport (PNQ)', 'Lonavala Station', 18.7557, 73.4091),
('mahabaleshwar', 'Mahabaleshwar', 'India', 'Maharashtra', 'Scenic plateau hill station famous for strawberry farms, Venna Lake, and Arthur Seat.', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', 'Oct - Jun', '20°C Cool Forest Air', 15000, 3, 4.7, 290, 'Hill Station', FALSE, 'Pune Airport (PNQ)', 'Satara Station', 17.9252, 73.6586),

-- MEGHALAYA
('shillong', 'Shillong & Cherrapunji', 'India', 'Meghalaya', 'Scotland of the East with living root bridges, Dawki crystal river, and Nohkalikai falls.', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', 'Oct - May', '17°C Pleasant Mist', 25000, 5, 4.9, 360, 'Adventure', FALSE, 'Shillong Airport (SHL)', 'Guwahati Station', 25.5788, 91.8933),

-- RAJASTHAN
('jaipur', 'Jaipur', 'India', 'Rajasthan', 'Iconic Pink City featuring grand Amber Fort, Hawa Mahal, City Palace, and Royal heritage.', 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80', 'Oct - Mar', '24°C Pleasant Desert Sun', 15000, 3, 4.7, 340, 'Heritage', FALSE, 'Jaipur International Airport (JAI)', 'Jaipur Junction', 26.9124, 75.7873),
('udaipur', 'Udaipur City of Lakes', 'India', 'Rajasthan', 'Venice of the East with romantic Lake Palace, City Palace, and Lake Pichola boat rides.', 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80', 'Sep - Mar', '23°C Royal Sunset', 20000, 3, 4.9, 450, 'Heritage', FALSE, 'Maharana Pratap Airport (UDR)', 'Udaipur City Station', 24.5854, 73.7125),
('jaisalmer', 'Jaisalmer Golden Fort', 'India', 'Rajasthan', 'Golden City featuring Sonar Qila fort, Sam sand dunes, camel safaris, and desert camps.', 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80', 'Oct - Mar', '22°C Warm Desert Sky', 22000, 3, 4.8, 390, 'Heritage', FALSE, 'Jaisalmer Airport (JSA)', 'Jaisalmer Station', 26.9157, 70.9083),

-- SIKKIM
('gangtok', 'Gangtok & Nathula Pass', 'India', 'Sikkim', 'Capital of Sikkim offering views of Kanchenjunga, Rumtek Monastery, and Tsomgo Lake.', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80', 'Mar - May', '13°C Fresh Mountain', 24000, 4, 4.8, 310, 'Hill Station', FALSE, 'Pakyong Airport (PYG)', 'New Jalpaiguri Station', 27.3389, 88.6065),

-- TAMIL NADU
('ooty', 'Ooty (Udhagamandalam)', 'India', 'Tamil Nadu', 'Queen of Hill Stations with Nilgiri mountain railway, botanical gardens, and tea hills.', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', 'Oct - Jun', '16°C Cool Mountain Mist', 16000, 3, 4.7, 330, 'Hill Station', FALSE, 'Coimbatore Airport (CJB)', 'Mettupalayam Station', 11.4102, 76.6950),
('kodaikanal', 'Kodaikanal Princess of Hills', 'India', 'Tamil Nadu', 'Star-shaped Kodai Lake, Coaker Walk, Pillar Rocks, and misty pine forests.', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', 'Sep - May', '17°C Cool Breeze', 15000, 3, 4.7, 280, 'Hill Station', FALSE, 'Madurai Airport (IXM)', 'Kodai Road Station', 10.2381, 77.4892),

-- UTTAR PRADESH
('agra', 'Agra Taj Mahal', 'India', 'Uttar Pradesh', 'Home to the iconic Taj Mahal, Agra Fort, and Fatehpur Sikri Mughal architecture.', 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80', 'Oct - Mar', '22°C Mild Sun', 12000, 2, 4.9, 950, 'Heritage', FALSE, 'Agra Airport (AGR)', 'Agra Cantt Station', 27.1751, 78.0421),
('varanasi', 'Varanasi Sacred Ghats', 'India', 'Uttar Pradesh', 'Spiritual capital along sacred Ganges river, famous for evening Ganga Aarti.', 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80', 'Oct - Mar', '22°C Mild Pleasant', 12000, 3, 4.8, 450, 'Spiritual', FALSE, 'Varanasi Airport (VNS)', 'Varanasi Junction', 25.3176, 82.9739),

-- UTTARAKHAND
('rishikesh', 'Rishikesh & Haridwar', 'India', 'Uttarakhand', 'Yoga capital of the world with white-water rafting, Lakshman Jhula, and Ganga Aarti.', 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80', 'Sep - Jun', '21°C Fresh River Air', 14000, 3, 4.8, 420, 'Adventure', FALSE, 'Dehradun Airport (DED)', 'Rishikesh Station', 30.0869, 78.2676),
('mussoorie', 'Mussoorie Queen of Hills', 'India', 'Uttarakhand', 'Colonial hill town with Kempty Falls, Mall Road, and views of Doon Valley.', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80', 'Mar - Jun', '17°C Cool Alpine', 15000, 3, 4.6, 260, 'Hill Station', FALSE, 'Dehradun Airport (DED)', 'Dehradun Station', 30.4598, 78.0644),
('auli', 'Auli Ski Resort', 'India', 'Uttarakhand', 'Premier Himalayan ski destination with panoramic Nanda Devi mountain peak views.', 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80', 'Dec - Mar', '2°C Snow Peak', 28000, 4, 4.9, 210, 'Adventure', FALSE, 'Dehradun Airport (DED)', 'Haridwar Station', 30.5312, 79.5694),

-- ISLANDS (ANDAMAN & LAKSHADWEEP)
('andaman', 'Havelock Island (Swaraj Dweep)', 'India', 'Andaman and Nicobar', 'Radhanagar Beach (Asia best beach), Elephant Beach scuba diving, and coral reefs.', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80', 'Oct - May', '29°C Tropical Ocean', 42000, 5, 4.9, 390, 'Beach', FALSE, 'Veer Savarkar Airport (IXZ)', 'N/A (Ferry Only)', 11.9687, 92.9846),
('lakshadweep', 'Agatti & Bangaram Island', 'India', 'Lakshadweep', 'Pristine coral lagoons, turquoise water, kayaking, and secluded tropical island resorts.', 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80', 'Oct - May', '29°C Tropical Island', 55000, 5, 4.9, 210, 'Luxury', FALSE, 'Agatti Airport (AGX)', 'N/A (Boat Only)', 10.8533, 72.1944),

-- INTERNATIONAL DESTINATIONS
('maldives', 'Maldives Overwater Paradise', 'Maldives', 'Malé Atoll', 'Tropical paradise of overwater bungalows, turquoise lagoons, and private island resorts.', 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=600&q=80', 'Nov - Apr', '29°C Tropical Sunshine', 75000, 4, 4.9, 520, 'Luxury', TRUE, 'Velana International Airport (MLE)', N/A, 3.2028, 73.2207),
('dubai', 'Dubai Futuristic City', 'United Arab Emirates', 'Dubai Emirate', 'Metropolis featuring Burj Khalifa, desert dune safaris, luxury malls, and Palm Jumeirah.', 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80', 'Nov - Mar', '26°C Warm Desert Sky', 65000, 5, 4.8, 610, 'Luxury', TRUE, 'Dubai International Airport (DXB)', N/A, 25.2048, 55.2708),
('bali', 'Bali Island of Gods', 'Indonesia', 'Bali Province', 'Lush rice terraces, ancient sea temples, surf beaches, and holistic wellness retreats.', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80', 'Apr - Oct', '27°C Tropical Island Air', 48000, 5, 4.8, 490, 'Beach', TRUE, 'Ngurah Rai Airport (DPS)', N/A, -8.4095, 115.1889),
('singapore', 'Singapore Marina Bay', 'Singapore', 'Singapore City', 'Garden city featuring Marina Bay Sands, Gardens by the Bay, and Jewel Changi.', 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=600&q=80', 'Year-round', '28°C Tropical', 58000, 4, 4.9, 540, 'Luxury', TRUE, 'Changi Airport (SIN)', N/A, 1.3521, 103.8198),
('switzerland', 'Interlaken & Lucerne', 'Switzerland', 'Bernese Oberland', 'Alpine wonderland of snow peaks, mountain lakes, scenic trains, and chocolates.', 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80', 'May - Oct', '15°C Fresh Alpine', 135000, 6, 4.9, 820, 'Hill Station', TRUE, 'Zurich Airport (ZRH)', N/A, 46.6863, 7.8632),
('paris', 'Paris City of Light', 'France', 'Île-de-France', 'Renowned for Eiffel Tower, Louvre Museum, romantic Seine cruises, and pastries.', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80', 'Apr - Oct', '18°C Pleasant Air', 110000, 6, 4.9, 750, 'Heritage', TRUE, 'Charles de Gaulle Airport (CDG)', N/A, 48.8566, 2.3522)
ON CONFLICT (id) DO NOTHING;
