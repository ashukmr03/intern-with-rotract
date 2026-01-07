CREATE DATABASE indian_folks_art;
USE indian_folks_art;
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(50) UNIQUE NOT NULL,
    short_description VARCHAR(200),
    detailed_description TEXT,
    origin_state VARCHAR(50),
    art_type VARCHAR(50),
    historical_period VARCHAR(100),
    materials_used VARCHAR(200),
    themes VARCHAR(200),
    popularity_level ENUM('Low','Medium','High'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO categories 
(category_name, short_description, detailed_description, origin_state, art_type, historical_period, materials_used, themes, popularity_level)
VALUES
(
'Madhubani',
'Traditional paintings from Bihar',
'Madhubani art originated in the Mithila region of Bihar. It is known for intricate patterns, geometric designs, and vibrant natural colors.',
'Bihar',
'Folk Painting',
'Ancient – Ramayana era',
'Natural dyes, handmade brushes',
'Mythology, nature, rituals',
'High'
),
(
'Warli',
'Tribal art from Maharashtra',
'Warli art uses simple geometric forms to depict village life and rituals.',
'Maharashtra',
'Tribal Art',
'10th Century',
'White pigment, mud walls',
'Village life, farming',
'High'
),
(
'Gond',
'Vibrant art from Madhya Pradesh',
'Gond art features dotted patterns and bright colors inspired by nature.',
'Madhya Pradesh',
'Tribal Painting',
'Ancient tribal era',
'Acrylic and natural colors',
'Nature, folklore',
'Medium'
),
(
'Tanjore',
'Sacred paintings from Tamil Nadu',
'Tanjore paintings are famous for gold foil work and devotional themes.',
'Tamil Nadu',
'Classical Painting',
'16th Century',
'Gold foil, wooden board',
'Religion, devotion',
'High'
),
(
'Pattachitra',
'Cloth-based art from Odisha',
'Pattachitra paintings narrate mythological stories with bold outlines.',
'Odisha',
'Folk Painting',
'12th Century',
'Cloth canvas, natural pigments',
'Jagannath culture',
'Medium'
),
(
'Handicrafts',
'Clay, wood & textile crafts',
'Handmade crafts using traditional skills across India.',
'All India',
'Handcrafted Products',
'Ancient to Modern',
'Clay, wood, metal',
'Utility, decor',
'High'
);
CREATE TABLE artworks (
    artwork_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    artwork_title VARCHAR(100),
    artist_name VARCHAR(100),
    price DECIMAL(10,2),
    availability ENUM('Available','Sold'),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id)
);
INSERT INTO artworks
(category_id, artwork_title, artist_name, price, availability, description)
VALUES
(1, 'Radha Krishna Madhubani', 'Sita Devi', 2800, 'Available', 'Traditional Madhubani painting'),
(2, 'Warli Harvest Festival', 'Jivya Soma Mashe', 2000, 'Available', 'Warli village life'),
(3, 'Gond Peacock Art', 'Durga Bai', 3200, 'Sold', 'Colorful Gond art'),
(4, 'Tanjore Ganesha', 'Ramesh Iyer', 5500, 'Available', 'Gold foil painting'),
(5, 'Pattachitra Krishna Leela', 'Manoj Chitrakar', 2400, 'Available', 'Narrative cloth painting'),
(6, 'Wooden Elephant Craft', 'Local Artisan', 1200, 'Available', 'Handcrafted wooden elephant');
SELECT * FROM categories;
SELECT * FROM artworks;
SELECT c.category_name, a.artwork_title, a.price
FROM categories c
JOIN artworks a
ON c.category_id = a.category_id;
