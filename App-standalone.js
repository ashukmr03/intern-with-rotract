// Standalone React App - All components in one file
// This file can be used with index-react.html

const { useState, useEffect, useRef } = React;

// Navbar Component
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let current = 'home';

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (window.pageYOffset >= sectionTop - 200) {
          current = section.getAttribute('id');
        }
      });

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMenuOpen(false);
    
    if (href === '#login') {
      const loginSection = document.getElementById('login');
      if (loginSection) loginSection.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-wrapper">
          <div className="logo">
            <i className="fas fa-palette"></i>
            <span>Indian Folk Art Marketplace</span>
          </div>
          <button 
            className="mobile-toggle" 
            aria-label="Toggle navigation"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span style={{ transform: isMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
            <span style={{ opacity: isMenuOpen ? 0 : 1 }}></span>
            <span style={{ transform: isMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none' }}></span>
          </button>
          <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
            <li>
              <a 
                href="#home" 
                className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, '#home')}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#categories" 
                className={`nav-link ${activeSection === 'categories' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, '#categories')}
              >
                Categories
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, '#contact')}
              >
                Contact
              </a>
            </li>
            <li>
              <a 
                href="#login" 
                className="nav-link login-btn"
                onClick={(e) => handleNavClick(e, '#login')}
              >
                Login
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

// Hero Component
const Hero = () => {
  const exploreCollections = () => {
    const categoriesSection = document.getElementById('categories');
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="hero">
      <div className="hero-background"></div>
      <div className="hero-overlay"></div>
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">Discover India's Traditional Art Forms</h1>
          <p className="hero-subtitle">Buy authentic handmade crafts directly from local artisans</p>
          <button className="cta-button" onClick={exploreCollections}>
            Explore Collections
          </button>
        </div>
      </div>
    </section>
  );
};

// Greeting Component
const Greeting = () => {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const currentHour = new Date().getHours();
    let message = '';

    if (currentHour >= 5 && currentHour < 12) {
      message = 'Good Morning! 🌅 Welcome to Indian Folk Art Marketplace';
    } else if (currentHour >= 12 && currentHour < 17) {
      message = 'Good Afternoon! ☀️ Discover authentic Indian folk art';
    } else if (currentHour >= 17 && currentHour < 21) {
      message = 'Good Evening! 🌆 Explore our handcrafted collections';
    } else {
      message = 'Good Night! 🌙 Thank you for visiting our marketplace';
    }

    setGreeting(message);
  }, []);

  return (
    <div className="greeting-message" style={{ opacity: 1 }}>
      {greeting}
    </div>
  );
};

// Categories Component
const Categories = ({ categories, loading, onCategoryClick, selectedCategory }) => {
  const gridRef = useRef(null);

  useEffect(() => {
    if (gridRef.current && categories.length > 0) {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, observerOptions);

      const cards = gridRef.current.querySelectorAll('.category-card');
      cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
      });

      return () => {
        cards.forEach(card => observer.unobserve(card));
      };
    }
  }, [categories]);

  const iconMap = {
    'madhubani': 'fa-paint-brush',
    'warli': 'fa-mountain',
    'gond': 'fa-tree',
    'tanjore': 'fa-gem',
    'pattachitra': 'fa-scroll',
    'handicrafts': 'fa-hammer'
  };

  return (
    <section id="categories" className="categories">
      <div className="container">
        <h2 className="section-title">Featured Categories</h2>
        <p className="section-subtitle">Explore the rich diversity of Indian folk art</p>
        <div ref={gridRef} className="categories-grid">
          {loading ? (
            <p className="section-subtitle">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="section-subtitle">Unable to load categories. Try again.</p>
          ) : (
            categories.map((category) => (
              <div
                key={category.id}
                className="category-card"
                data-category={category.id}
                onClick={() => onCategoryClick(category.id)}
                style={{
                  border: selectedCategory === category.id ? '3px solid var(--primary-color)' : 'none',
                  transform: selectedCategory === category.id ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: selectedCategory === category.id ? '0 12px 24px rgba(212, 175, 55, 0.3)' : 'var(--shadow)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transition = 'all 0.3s ease';
                }}
              >
                <div className="category-image" style={{
                  backgroundColor: selectedCategory === category.id 
                    ? 'var(--primary-color)' 
                    : 'linear-gradient(135deg, var(--primary-color), var(--accent-color))'
                }}>
                  <i className={`fas ${category.icon || iconMap[category.id] || 'fa-star'}`}></i>
                </div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                {selectedCategory === category.id && (
                  <div style={{
                    marginTop: '0.5rem',
                    fontSize: '0.85rem',
                    color: 'var(--primary-color)',
                    fontWeight: '600'
                  }}>
                    ✓ Selected
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

// Products Component
const Products = ({ products, loading, selectedCategory, categories, onViewProduct, onShowAll }) => {
  const gridRef = useRef(null);
  const selectedCategoryName = categories.find(cat => cat.id === selectedCategory)?.name || '';

  useEffect(() => {
    if (gridRef.current && products.length > 0) {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      }, observerOptions);

      const cards = gridRef.current.querySelectorAll('.product-card');
      cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
      });

      return () => {
        cards.forEach(card => observer.unobserve(card));
      };
    }
  }, [products]);

  return (
    <section className="products">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 className="section-title">
              {selectedCategory ? `${selectedCategoryName} Products` : 'All Products'}
            </h2>
            <p className="section-subtitle">
              {selectedCategory 
                ? `Showing ${products.length} ${products.length === 1 ? 'product' : 'products'} in ${selectedCategoryName}`
                : 'Handpicked treasures from skilled artisans'}
            </p>
          </div>
          {selectedCategory && (
            <button 
              onClick={onShowAll}
              style={{
                padding: '0.6rem 1.5rem',
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                border: 'none',
                borderRadius: '25px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease',
                fontSize: '0.95rem'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--secondary-color)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--primary-color)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Show All Products
            </button>
          )}
        </div>
        <div ref={gridRef} className="products-grid">
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
              <p className="section-subtitle">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
              <p className="section-subtitle">
                {selectedCategory ? `No products found in ${selectedCategoryName}` : 'Unable to load products. Try again.'}
              </p>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img 
                    src={product.image} 
                    alt={product.title}
                    onError={(e) => {
                      // Fallback image if main image fails to load
                      e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&q=80';
                    }}
                    loading="lazy"
                  />
                  {product.availability === 'Sold' && (
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      backgroundColor: 'rgba(255, 0, 0, 0.8)',
                      color: 'white',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '15px',
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      zIndex: 10
                    }}>
                      SOLD
                    </div>
                  )}
                </div>
                <div className="product-info">
                  <h3>{product.title}</h3>
                  <p className="product-price">₹{product.price.toLocaleString()}</p>
                  {product.description && (
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem', minHeight: '2.5rem' }}>
                      {product.description.length > 60 ? product.description.substring(0, 60) + '...' : product.description}
                    </p>
                  )}
                  <button 
                    className="view-details-btn"
                    onClick={() => onViewProduct(product.id)}
                    disabled={product.availability === 'Sold'}
                    style={{
                      opacity: product.availability === 'Sold' ? 0.6 : 1,
                      cursor: product.availability === 'Sold' ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {product.availability === 'Sold' ? 'Sold Out' : 'View Details'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

// Contact Component
const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');
  const API_BASE = '/api';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const response = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        setStatus(error.error || 'Failed to send message');
        return;
      }

      setStatus('Message sent! We will reply soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Contact form error', err);
      setStatus('Network error. Please try again.');
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="section-title">Contact & Feedback</h2>
        <p className="section-subtitle">Send us a note and we will reply within 24 hours</p>
        <form id="contactForm" className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              placeholder="Tell us what you need"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>
          <button type="submit" className="cta-button">Submit</button>
          <p id="contactStatus" className="contact-status" role="status">
            {status}
          </p>
        </form>
      </div>
    </section>
  );
};

// Login Component
const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('');
  const API_BASE = '/api';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Checking credentials...');

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) {
        setStatus(data.error || 'Login failed');
        return;
      }

      setStatus(`Welcome, ${data.user.name || data.user.email}! Token: ${data.token}`);
      setFormData({ email: '', password: '' });
    } catch (err) {
      console.error('Login error', err);
      setStatus('Network error. Please try again.');
    }
  };

  return (
    <section id="login" className="login">
      <div className="container">
        <h2 className="section-title">Member Login</h2>
        <p className="section-subtitle">Use the demo account or your own credentials</p>
        <form id="loginForm" className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="loginEmail">Email</label>
            <input
              id="loginEmail"
              name="email"
              type="email"
              placeholder="demo@folkart.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="loginPassword">Password</label>
            <input
              id="loginPassword"
              name="password"
              type="password"
              placeholder="password123"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="cta-button">Login</button>
          <p id="loginStatus" className="contact-status" role="status">
            {status}
          </p>
        </form>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  const handleFooterClick = (e, href) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Indian Folk Art Marketplace</h3>
            <p>Preserving and promoting India's rich cultural heritage through authentic handmade crafts.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#home" onClick={(e) => handleFooterClick(e, '#home')}>Home</a></li>
              <li><a href="#categories" onClick={(e) => handleFooterClick(e, '#categories')}>Categories</a></li>
              <li><a href="#contact" onClick={(e) => handleFooterClick(e, '#contact')}>Contact</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <ul>
              <li>Arghaneel Das</li>
              <li>Ashutosh Sharma</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Indian Folk Art Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
const App = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const API_BASE = '/api';

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadProducts(selectedCategory);
    }
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await fetch(`${API_BASE}/categories`);
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const loadProducts = async (categoryId = null) => {
    try {
      setLoadingProducts(true);
      const url = categoryId ? `${API_BASE}/products?category=${categoryId}` : `${API_BASE}/products`;
      const response = await fetch(url);
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    if (selectedCategory === categoryId) {
      // If same category clicked, show all products
      setSelectedCategory(null);
      loadProducts(null);
    } else {
      setSelectedCategory(categoryId);
    }
    const productsSection = document.querySelector('.products');
    if (productsSection) {
      setTimeout(() => {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleShowAll = () => {
    setSelectedCategory(null);
    loadProducts(null);
  };

  const handleViewProduct = (productId) => {
    alert(`Viewing details for: ${productId}\n\nIn a real application, this would navigate to the product detail page.`);
  };

  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Greeting />
      <Categories 
        categories={categories} 
        loading={loadingCategories}
        selectedCategory={selectedCategory}
        onCategoryClick={handleCategoryClick}
      />
      <Products 
        products={products} 
        loading={loadingProducts}
        selectedCategory={selectedCategory}
        categories={categories}
        onViewProduct={handleViewProduct}
        onShowAll={handleShowAll}
      />
      <Contact />
      <Login />
      <Footer />
    </div>
  );
};

// Render the App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

