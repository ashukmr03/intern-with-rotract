// Script to add products to database
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'indian_folks_art',
    waitForConnections: true,
    connectionLimit: 10
});

const products = [
    // Madhubani (category_id = 1)
    { category_id: 1, title: 'Radha Krishna Madhubani', artist: 'Sita Devi', price: 2800, desc: 'Traditional Madhubani painting depicting Radha and Krishna' },
    { category_id: 1, title: 'Peacock Madhubani Art', artist: 'Ganga Devi', price: 3200, desc: 'Vibrant peacock design in traditional Madhubani style' },
    { category_id: 1, title: 'Lakshmi Madhubani Painting', artist: 'Mahasundari Devi', price: 3500, desc: 'Goddess Lakshmi in intricate Madhubani patterns' },
    { category_id: 1, title: 'Tree of Life Madhubani', artist: 'Bharti Dayal', price: 4000, desc: 'Symbolic tree of life with geometric patterns' },
    { category_id: 1, title: 'Wedding Scene Madhubani', artist: 'Baua Devi', price: 3800, desc: 'Traditional wedding ceremony in Madhubani art' },
    
    // Warli (category_id = 2)
    { category_id: 2, title: 'Warli Harvest Festival', artist: 'Jivya Soma Mashe', price: 2000, desc: 'Warli village life depicting harvest celebration' },
    { category_id: 2, title: 'Warli Dance Scene', artist: 'Anil Vangad', price: 2500, desc: 'Traditional Warli dance with geometric patterns' },
    { category_id: 2, title: 'Warli Village Life', artist: 'Ramesh Hengadi', price: 2200, desc: 'Daily village activities in Warli style' },
    { category_id: 2, title: 'Warli Wedding Ceremony', artist: 'Savitri Mashe', price: 2800, desc: 'Wedding rituals in Warli tribal art' },
    { category_id: 2, title: 'Warli Nature Scene', artist: 'Yashodhara Mashe', price: 2400, desc: 'Nature and animals in Warli art form' },
    
    // Gond (category_id = 3)
    { category_id: 3, title: 'Gond Peacock Art', artist: 'Durga Bai', price: 3200, desc: 'Colorful Gond art featuring peacock' },
    { category_id: 3, title: 'Gond Tiger Painting', artist: 'Jangarh Singh Shyam', price: 4500, desc: 'Majestic tiger in vibrant Gond style' },
    { category_id: 3, title: 'Gond Tree of Life', artist: 'Bhajju Shyam', price: 3800, desc: 'Nature-inspired Gond painting' },
    { category_id: 3, title: 'Gond Elephant Art', artist: 'Subhash Vyam', price: 4200, desc: 'Elephant in traditional Gond patterns' },
    { category_id: 3, title: 'Gond Bird Collection', artist: 'Venkat Shyam', price: 3500, desc: 'Colorful birds in Gond tribal art' },
    
    // Tanjore (category_id = 4)
    { category_id: 4, title: 'Tanjore Ganesha', artist: 'Ramesh Iyer', price: 5500, desc: 'Gold foil Tanjore painting of Lord Ganesha' },
    { category_id: 4, title: 'Tanjore Lakshmi', artist: 'Krishna Iyer', price: 6000, desc: 'Goddess Lakshmi with gold foil work' },
    { category_id: 4, title: 'Tanjore Krishna', artist: 'Sundaram Iyer', price: 5800, desc: 'Lord Krishna in Tanjore style' },
    { category_id: 4, title: 'Tanjore Saraswati', artist: 'Venkatesh Iyer', price: 6200, desc: 'Goddess Saraswati with intricate gold details' },
    { category_id: 4, title: 'Tanjore Vishnu', artist: 'Narayanan Iyer', price: 6500, desc: 'Lord Vishnu in traditional Tanjore art' },
    
    // Pattachitra (category_id = 5)
    { category_id: 5, title: 'Pattachitra Krishna Leela', artist: 'Manoj Chitrakar', price: 2400, desc: 'Narrative cloth painting of Krishna stories' },
    { category_id: 5, title: 'Pattachitra Jagannath', artist: 'Apindra Swain', price: 2800, desc: 'Lord Jagannath in Pattachitra style' },
    { category_id: 5, title: 'Pattachitra Ramayana', artist: 'Bijay Parida', price: 3200, desc: 'Ramayana epic in Pattachitra scroll' },
    { category_id: 5, title: 'Pattachitra Durga', artist: 'Raghunath Mohapatra', price: 3000, desc: 'Goddess Durga in traditional Pattachitra' },
    { category_id: 5, title: 'Pattachitra Village Scene', artist: 'Khandu Chitrakar', price: 2600, desc: 'Rural life depicted in Pattachitra art' },
    
    // Handicrafts (category_id = 6)
    { category_id: 6, title: 'Wooden Elephant Craft', artist: 'Local Artisan', price: 1200, desc: 'Handcrafted wooden elephant' },
    { category_id: 6, title: 'Clay Pot Set', artist: 'Potter Community', price: 800, desc: 'Traditional terracotta clay pots' },
    { category_id: 6, title: 'Brass Lamp Set', artist: 'Metal Craftsman', price: 1500, desc: 'Handmade brass diya lamp set' },
    { category_id: 6, title: 'Bamboo Basket Collection', artist: 'Bamboo Artisan', price: 900, desc: 'Eco-friendly bamboo baskets' },
    { category_id: 6, title: 'Handwoven Textile', artist: 'Weaver Community', price: 1800, desc: 'Traditional handwoven fabric' },
    { category_id: 6, title: 'Stone Carving Art', artist: 'Stone Craftsman', price: 2500, desc: 'Hand-carved stone sculpture' },
    { category_id: 6, title: 'Leather Handbag', artist: 'Leather Artisan', price: 2200, desc: 'Handcrafted leather bag' }
];

async function addProducts() {
    try {
        console.log('Connecting to database...');
        
        // Clear existing products (optional - comment out if you want to keep existing)
        // await pool.query('DELETE FROM artworks');
        
        console.log('Adding products to database...');
        
        for (const product of products) {
            await pool.query(
                `INSERT IGNORE INTO artworks 
                (category_id, artwork_title, artist_name, price, availability, description) 
                VALUES (?, ?, ?, ?, 'Available', ?)`,
                [product.category_id, product.title, product.artist, product.price, product.desc]
            );
        }
        
        // Get count by category
        const [results] = await pool.query(`
            SELECT c.category_name, COUNT(a.artwork_id) as count
            FROM categories c
            LEFT JOIN artworks a ON c.category_id = a.category_id
            GROUP BY c.category_id, c.category_name
            ORDER BY c.category_id
        `);
        
        console.log('\n✅ Products added successfully!\n');
        console.log('Products by category:');
        results.forEach(row => {
            console.log(`  ${row.category_name}: ${row.count} products`);
        });
        
        const total = results.reduce((sum, row) => sum + parseInt(row.count), 0);
        console.log(`\nTotal products: ${total}`);
        
        await pool.end();
        process.exit(0);
    } catch (err) {
        console.error('Error adding products:', err);
        await pool.end();
        process.exit(1);
    }
}

addProducts();

