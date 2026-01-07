const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'indian_folks_art',
    waitForConnections: true,
    connectionLimit: 10
});

const iconBySlug = {
    madhubani: 'fa-paint-brush',
    warli: 'fa-mountain',
    gond: 'fa-tree',
    tanjore: 'fa-gem',
    pattachitra: 'fa-scroll',
    handicrafts: 'fa-hammer'
};

const imageBySlug = {
    madhubani: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80',
    warli: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&h=300&fit=crop',
    gond: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
    tanjore: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    pattachitra: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    handicrafts: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
};

// Array of images for variety (used when multiple products in same category)
const imagePool = {
    madhubani: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80',
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80'
    ],
    warli: [
        'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&h=300&fit=crop'
    ],
    gond: [
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop'
    ],
    tanjore: [
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop'
    ],
    pattachitra: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
    ],
    handicrafts: [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
    ]
};

const query = (sql, params = []) => pool.promise().query(sql, params);

const slugFromName = (name = '') => name.toLowerCase().replace(/\s+/g, '-');
const nameFromSlug = (slug = '') => {
    const mapping = {
        madhubani: 'Madhubani',
        warli: 'Warli',
        gond: 'Gond',
        tanjore: 'Tanjore',
        pattachitra: 'Pattachitra',
        handicrafts: 'Handicrafts'
    };
    return mapping[slug] || slug;
};

async function ensureUsersTable() {
    await query(
        `CREATE TABLE IF NOT EXISTS users (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100) NOT NULL,
            role VARCHAR(50) DEFAULT 'buyer',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    );
    await query(
        `INSERT IGNORE INTO users (name, email, password, role)
         VALUES ('Demo User', 'demo@folkart.com', 'password123', 'buyer')`
    );
}

app.get('/api/health', async (req, res) => {
    try {
        await query('SELECT 1');
        res.json({ status: 'ok', db: 'connected', environment: process.env.NODE_ENV || 'development', timestamp: new Date().toISOString() });
    } catch (err) {
        res.status(500).json({ status: 'error', db: 'disconnected', message: err.message });
    }
});

app.get('/api/categories', async (req, res) => {
    try {
        const [rows] = await query(
            `SELECT category_id AS id, category_name AS name, short_description AS description
             FROM categories
             ORDER BY category_id`
        );
        const payload = rows.map((row) => {
            const slug = slugFromName(row.name);
            return { id: slug, name: row.name, description: row.description, icon: iconBySlug[slug] || 'fa-star' };
        });
        res.json(payload);
    } catch (err) {
        console.error('Error fetching categories', err);
        res.status(500).json({ error: 'Failed to load categories' });
    }
});

app.get('/api/products', async (req, res) => {
    try {
        const { category } = req.query;
        const filters = [];
        const values = [];
        if (category) {
            filters.push('LOWER(c.category_name) = ?');
            values.push(nameFromSlug(category).toLowerCase());
        }
        const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
        const [rows] = await query(
            `SELECT a.artwork_id AS id,
                    a.artwork_title AS title,
                    a.price,
                    a.availability,
                    a.description,
                    a.image_url,
                    c.category_name AS category
             FROM artworks a
             JOIN categories c ON a.category_id = c.category_id
             ${where}
             ORDER BY a.artwork_id`,
            values
        );
        const payload = rows.map((row, index) => {
            const slug = slugFromName(row.category);
            // Use image_url from database if available, otherwise fallback to imagePool
            let imageUrl = row.image_url;
            if (!imageUrl || imageUrl.trim() === '') {
                const images = imagePool[slug] || [imageBySlug[slug] || imageBySlug.madhubani];
                const imageIndex = index % images.length;
                imageUrl = images[imageIndex];
            }
            return {
                id: slugFromName(`${row.title}-${row.id}`),
                title: row.title,
                price: Number(row.price),
                availability: row.availability,
                description: row.description,
                category: slug,
                image: imageUrl
            };
        });
        res.json(payload);
    } catch (err) {
        console.error('Error fetching products', err);
        res.status(500).json({ error: 'Failed to load products' });
    }
});

app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'name, email and message are required' });
    }
    if (!email.includes('@')) {
        return res.status(400).json({ error: 'Please provide a valid email' });
    }
    res.status(201).json({
        success: true,
        receivedAt: new Date().toISOString(),
        preview: message.slice(0, 120)
    });
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body || {};
    if (!email || !password) {
        return res.status(400).json({ error: 'email and password are required' });
    }
    try {
        const [rows] = await query(
            `SELECT user_id AS id, name, email, role
             FROM users
             WHERE email = ? AND password = ?
             LIMIT 1`,
            [email, password]
        );
        if (!rows.length) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const user = rows[0];
        res.json({ token: 'demo-token', user });
    } catch (err) {
        console.error('Login error', err);
        res.status(500).json({ error: 'Login failed' });
    }
});

app.use(express.static(path.join(__dirname)));

// Serve React app
app.get('/react', (req, res) => {
    res.sendFile(path.join(__dirname, 'index-react.html'));
});

app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

async function start() {
    try {
        await ensureUsersTable();
        console.log('Database connection successful');
    } catch (err) {
        console.warn('Database connection failed, but server will start anyway:', err.message);
        console.warn('API endpoints requiring database will not work until MySQL is running');
    }
    
    app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
        console.log(`React app available at: http://localhost:${PORT}/react`);
    });
}

start();

