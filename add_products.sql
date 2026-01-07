-- Add more products to each category
USE indian_folks_art;

-- Madhubani products (category_id = 1)
INSERT INTO artworks (category_id, artwork_title, artist_name, price, availability, description) VALUES
(1, 'Radha Krishna Madhubani', 'Sita Devi', 2800, 'Available', 'Traditional Madhubani painting depicting Radha and Krishna'),
(1, 'Peacock Madhubani Art', 'Ganga Devi', 3200, 'Available', 'Vibrant peacock design in traditional Madhubani style'),
(1, 'Lakshmi Madhubani Painting', 'Mahasundari Devi', 3500, 'Available', 'Goddess Lakshmi in intricate Madhubani patterns'),
(1, 'Tree of Life Madhubani', 'Bharti Dayal', 4000, 'Available', 'Symbolic tree of life with geometric patterns'),
(1, 'Wedding Scene Madhubani', 'Baua Devi', 3800, 'Available', 'Traditional wedding ceremony in Madhubani art');

-- Warli products (category_id = 2)
INSERT INTO artworks (category_id, artwork_title, artist_name, price, availability, description) VALUES
(2, 'Warli Harvest Festival', 'Jivya Soma Mashe', 2000, 'Available', 'Warli village life depicting harvest celebration'),
(2, 'Warli Dance Scene', 'Anil Vangad', 2500, 'Available', 'Traditional Warli dance with geometric patterns'),
(2, 'Warli Village Life', 'Ramesh Hengadi', 2200, 'Available', 'Daily village activities in Warli style'),
(2, 'Warli Wedding Ceremony', 'Savitri Mashe', 2800, 'Available', 'Wedding rituals in Warli tribal art'),
(2, 'Warli Nature Scene', 'Yashodhara Mashe', 2400, 'Available', 'Nature and animals in Warli art form');

-- Gond products (category_id = 3)
INSERT INTO artworks (category_id, artwork_title, artist_name, price, availability, description) VALUES
(3, 'Gond Peacock Art', 'Durga Bai', 3200, 'Available', 'Colorful Gond art featuring peacock'),
(3, 'Gond Tiger Painting', 'Jangarh Singh Shyam', 4500, 'Available', 'Majestic tiger in vibrant Gond style'),
(3, 'Gond Tree of Life', 'Bhajju Shyam', 3800, 'Available', 'Nature-inspired Gond painting'),
(3, 'Gond Elephant Art', 'Subhash Vyam', 4200, 'Available', 'Elephant in traditional Gond patterns'),
(3, 'Gond Bird Collection', 'Venkat Shyam', 3500, 'Available', 'Colorful birds in Gond tribal art');

-- Tanjore products (category_id = 4)
INSERT INTO artworks (category_id, artwork_title, artist_name, price, availability, description) VALUES
(4, 'Tanjore Ganesha', 'Ramesh Iyer', 5500, 'Available', 'Gold foil Tanjore painting of Lord Ganesha'),
(4, 'Tanjore Lakshmi', 'Krishna Iyer', 6000, 'Available', 'Goddess Lakshmi with gold foil work'),
(4, 'Tanjore Krishna', 'Sundaram Iyer', 5800, 'Available', 'Lord Krishna in Tanjore style'),
(4, 'Tanjore Saraswati', 'Venkatesh Iyer', 6200, 'Available', 'Goddess Saraswati with intricate gold details'),
(4, 'Tanjore Vishnu', 'Narayanan Iyer', 6500, 'Available', 'Lord Vishnu in traditional Tanjore art');

-- Pattachitra products (category_id = 5)
INSERT INTO artworks (category_id, artwork_title, artist_name, price, availability, description) VALUES
(5, 'Pattachitra Krishna Leela', 'Manoj Chitrakar', 2400, 'Available', 'Narrative cloth painting of Krishna stories'),
(5, 'Pattachitra Jagannath', 'Apindra Swain', 2800, 'Available', 'Lord Jagannath in Pattachitra style'),
(5, 'Pattachitra Ramayana', 'Bijay Parida', 3200, 'Available', 'Ramayana epic in Pattachitra scroll'),
(5, 'Pattachitra Durga', 'Raghunath Mohapatra', 3000, 'Available', 'Goddess Durga in traditional Pattachitra'),
(5, 'Pattachitra Village Scene', 'Khandu Chitrakar', 2600, 'Available', 'Rural life depicted in Pattachitra art');

-- Handicrafts products (category_id = 6)
INSERT INTO artworks (category_id, artwork_title, artist_name, price, availability, description) VALUES
(6, 'Wooden Elephant Craft', 'Local Artisan', 1200, 'Available', 'Handcrafted wooden elephant'),
(6, 'Clay Pot Set', 'Potter Community', 800, 'Available', 'Traditional terracotta clay pots'),
(6, 'Brass Lamp Set', 'Metal Craftsman', 1500, 'Available', 'Handmade brass diya lamp set'),
(6, 'Bamboo Basket Collection', 'Bamboo Artisan', 900, 'Available', 'Eco-friendly bamboo baskets'),
(6, 'Handwoven Textile', 'Weaver Community', 1800, 'Available', 'Traditional handwoven fabric'),
(6, 'Stone Carving Art', 'Stone Craftsman', 2500, 'Available', 'Hand-carved stone sculpture'),
(6, 'Leather Handbag', 'Leather Artisan', 2200, 'Available', 'Handcrafted leather bag');

-- Show all products
SELECT c.category_name, a.artwork_title, a.artist_name, a.price, a.availability
FROM categories c
JOIN artworks a ON c.category_id = a.category_id
ORDER BY c.category_id, a.artwork_id;

