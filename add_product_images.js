// Script to add image URLs to products in database
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

// Product images mapping - using relevant Indian art images
const productImages = {
    // Madhubani products
    'Radha Krishna Madhubani': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=450&fit=crop&q=80',
    'Peacock Madhubani Art': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=450&fit=crop',
    'Lakshmi Madhubani Painting': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=450&fit=crop',
    'Tree of Life Madhubani': 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&h=450&fit=crop',
    'Wedding Scene Madhubani': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=450&fit=crop&q=80',
    
    // Warli products
    'Warli Harvest Festival': 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&h=450&fit=crop',
    'Warli Dance Scene': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=450&fit=crop',
    'Warli Village Life': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=450&fit=crop',
    'Warli Wedding Ceremony': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=450&fit=crop',
    'Warli Nature Scene': 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&h=450&fit=crop',
    
    // Gond products
    'Gond Peacock Art': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=450&fit=crop',
    'Gond Tiger Painting': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=450&fit=crop&q=80',
    'Gond Tree of Life': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=450&fit=crop',
    'Gond Elephant Art': 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&h=450&fit=crop',
    'Gond Bird Collection': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=450&fit=crop',
    
    // Tanjore products
    'Tanjore Ganesha': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=450&fit=crop',
    'Tanjore Lakshmi': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=450&fit=crop&q=80',
    'Tanjore Krishna': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=450&fit=crop',
    'Tanjore Saraswati': 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&h=450&fit=crop',
    'Tanjore Vishnu': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=450&fit=crop',
    
    // Pattachitra products
    'Pattachitra Krishna Leela': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=450&fit=crop&q=80',
    'Pattachitra Jagannath': 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&h=450&fit=crop',
    'Pattachitra Ramayana': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=450&fit=crop',
    'Pattachitra Durga': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=450&fit=crop',
    'Pattachitra Village Scene': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=450&fit=crop&q=80',
    
    // Handicrafts products
    'Wooden Elephant Craft': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=450&fit=crop&q=80',
    'Clay Pot Set': 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&h=450&fit=crop',
    'Brass Lamp Set': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=450&fit=crop',
    'Bamboo Basket Collection': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=450&fit=crop',
    'Handwoven Textile': 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=450&fit=crop&q=80',
    'Stone Carving Art': 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&h=450&fit=crop',
    'Leather Handbag': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=450&fit=crop'
};

async function addImages() {
    try {
        console.log('Adding image column to artworks table...');
        
        // Add image_url column if it doesn't exist
        await pool.query(`
            ALTER TABLE artworks 
            ADD COLUMN IF NOT EXISTS image_url VARCHAR(500) DEFAULT NULL
        `).catch(() => {
            // Column might already exist, that's okay
            console.log('Image column already exists or error adding it');
        });
        
        console.log('Updating products with images...');
        
        // Update each product with its specific image
        for (const [title, imageUrl] of Object.entries(productImages)) {
            await pool.query(
                `UPDATE artworks 
                SET image_url = ? 
                WHERE artwork_title = ?`,
                [imageUrl, title]
            );
            console.log(`✓ Updated: ${title}`);
        }
        
        // For products that don't have specific images, use category default
        const [categories] = await pool.query('SELECT category_id, category_name FROM categories');
        const categoryDefaults = {
            1: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=450&fit=crop&q=80', // Madhubani
            2: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=600&h=450&fit=crop', // Warli
            3: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=450&fit=crop', // Gond
            4: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=450&fit=crop', // Tanjore
            5: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=450&fit=crop&q=80', // Pattachitra
            6: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=450&fit=crop&q=80' // Handicrafts
        };
        
        for (const category of categories) {
            await pool.query(
                `UPDATE artworks 
                SET image_url = ? 
                WHERE category_id = ? AND (image_url IS NULL OR image_url = '')`,
                [categoryDefaults[category.category_id], category.category_id]
            );
        }
        
        // Verify updates
        const [results] = await pool.query(`
            SELECT artwork_title, image_url IS NOT NULL as has_image
            FROM artworks
            ORDER BY category_id, artwork_id
        `);
        
        console.log('\n✅ Images added successfully!\n');
        console.log('Products with images:');
        results.forEach(row => {
            console.log(`  ${row.artwork_title}: ${row.has_image ? '✓' : '✗'}`);
        });
        
        const withImages = results.filter(r => r.has_image).length;
        console.log(`\nTotal: ${withImages}/${results.length} products have images`);
        
        await pool.end();
        process.exit(0);
    } catch (err) {
        console.error('Error adding images:', err);
        await pool.end();
        process.exit(1);
    }
}

addImages();

