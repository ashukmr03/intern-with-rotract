import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Greeting from './components/Greeting';
import Categories from './components/Categories';
import Products from './components/Products';
import Contact from './components/Contact';
import Login from './components/Login';
import Footer from './components/Footer';
import './style.css';

const API_BASE = '/api';

function App() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

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
    setSelectedCategory(categoryId);
    const productsSection = document.querySelector('.products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
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
        onCategoryClick={handleCategoryClick}
      />
      <Products 
        products={products} 
        loading={loadingProducts}
        onViewProduct={handleViewProduct}
      />
      <Contact />
      <Login />
      <Footer />
    </div>
  );
}

export default App;

