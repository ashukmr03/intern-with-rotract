// Use same-origin API base so the frontend works whether served by the Node
// server or a static host pointing to the same backend.
const API_BASE = '/api';

document.addEventListener('DOMContentLoaded', function() {
    initGreeting();
    initMobileNav();
    initCategoryCards();
    initSmoothScroll();
    loadCategories();
    loadProducts();
    initContactForm();
    initLoginForm();
});
function initGreeting() {
    const greetingElement = document.getElementById('greeting');
    const currentHour = new Date().getHours();
    let greeting = '';

    if (currentHour >= 5 && currentHour < 12) {
        greeting = 'Good Morning! 🌅 Welcome to Indian Folk Art Marketplace';
    } else if (currentHour >= 12 && currentHour < 17) {
        greeting = 'Good Afternoon! ☀️ Discover authentic Indian folk art';
    } else if (currentHour >= 17 && currentHour < 21) {
        greeting = 'Good Evening! 🌆 Explore our handcrafted collections';
    } else {
        greeting = 'Good Night! 🌙 Thank you for visiting our marketplace';
    }

    greetingElement.textContent = greeting;
    greetingElement.style.opacity = '0';
    greetingElement.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        greetingElement.style.opacity = '1';
    }, 100);
}
function initMobileNav() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        

        const spans = mobileToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

  
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            const spans = mobileToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu.contains(event.target);
        const isClickOnToggle = mobileToggle.contains(event.target);
        
        if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            const spans = mobileToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}


function initCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');

    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            console.log(`Category clicked: ${category}`);
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });

        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
}

function initSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            

            if (href === '#') {
                return;
            }

            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function exploreCollections() {
    console.log('Explore Collections button clicked');
    const categoriesSection = document.getElementById('categories');
    if (categoriesSection) {
        categoriesSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
 
}


function viewProduct(productId) {
    console.log(`Viewing product: ${productId}`);
    

    if (event && event.target) {
        event.target.style.transform = 'scale(0.95)';
        setTimeout(() => {
            event.target.style.transform = '';
        }, 200);
    }
    alert(`Viewing details for: ${productId}\n\nIn a real application, this would navigate to the product detail page.`);
}

window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);


    const animatedElements = document.querySelectorAll('.category-card, .product-card');
    
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
});

console.log('%c🎨 Welcome to Indian Folk Art Marketplace!', 'color: #d4af37; font-size: 20px; font-weight: bold;');
console.log('%cDiscover authentic handmade crafts from skilled artisans across India.', 'color: #8b4513; font-size: 14px;');

async function loadCategories() {
    const grid = document.getElementById('categoriesGrid');
    if (!grid) return;
    grid.innerHTML = '<p class="section-subtitle">Loading categories...</p>';

    try {
        const response = await fetch(`${API_BASE}/categories`);
        const data = await response.json();
        grid.innerHTML = '';
        data.forEach(category => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.setAttribute('data-category', category.id);
            card.innerHTML = `
                <div class="category-image">
                    <i class="fas ${category.icon}"></i>
                </div>
                <h3>${category.name}</h3>
                <p>${category.description}</p>
            `;
            card.addEventListener('click', () => viewCategory(category.id));
            grid.appendChild(card);
        });
        initCategoryCards();
        initScrollAnimations();
    } catch (err) {
        console.error('Failed to load categories', err);
        grid.innerHTML = '<p class="section-subtitle">Unable to load categories. Try again.</p>';
    }
}

async function loadProducts(categoryId) {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    grid.innerHTML = '<p class="section-subtitle">Loading products...</p>';

    try {
        const url = categoryId ? `${API_BASE}/products?category=${categoryId}` : `${API_BASE}/products`;
        const response = await fetch(url);
        const data = await response.json();
        grid.innerHTML = '';

        data.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="product-info">
                    <h3>${product.title}</h3>
                    <p class="product-price">₹${product.price.toLocaleString()}</p>
                    <button class="view-details-btn" data-product="${product.id}">View Details</button>
                </div>
            `;
            card.querySelector('.view-details-btn').addEventListener('click', () => viewProduct(product.id));
            grid.appendChild(card);
        });
        initScrollAnimations();
    } catch (err) {
        console.error('Failed to load products', err);
        grid.innerHTML = '<p class="section-subtitle">Unable to load products. Try again.</p>';
    }
}

function viewCategory(categoryId) {
    loadProducts(categoryId);
    const productsSection = document.querySelector('.products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function initContactForm() {
    const form = document.getElementById('contactForm');
    const status = document.getElementById('contactStatus');
    if (!form || !status) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        status.textContent = 'Sending...';
        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${API_BASE}/contact`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const error = await response.json();
                status.textContent = error.error || 'Failed to send message';
                return;
            }

            status.textContent = 'Message sent! We will reply soon.';
            form.reset();
        } catch (err) {
            console.error('Contact form error', err);
            status.textContent = 'Network error. Please try again.';
        }
    });
}

function initLoginForm() {
    const form = document.getElementById('loginForm');
    const status = document.getElementById('loginStatus');
    if (!form || !status) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        status.textContent = 'Checking credentials...';
        const formData = new FormData(form);
        const payload = Object.fromEntries(formData.entries());

        try {
            const response = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (!response.ok) {
                status.textContent = data.error || 'Login failed';
                return;
            }

            status.textContent = `Welcome, ${data.user.name || data.user.email}! Token: ${data.token}`;
            form.reset();
        } catch (err) {
            console.error('Login error', err);
            status.textContent = 'Network error. Please try again.';
        }
    });
}

