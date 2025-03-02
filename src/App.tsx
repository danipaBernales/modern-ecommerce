import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Auth from './pages/Auth';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import ScrollToTop from './components/ScrollToTop';
import { useAuthStore } from './store/authStore';
import ShippingPolicy from './pages/ShippingPolicy';
import Returns from './pages/Returns';
import OrderTracking from './pages/OrderTracking';
import About from './pages/About';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Sitemap from './pages/Sitemap';
import Categories from './pages/Categories';
import Profile from './pages/Profile';
import { supabase } from './lib/supabase';
import './styles/animations.css';

function App() {
  const { checkUser } = useAuthStore();

  useEffect(() => {
    // Initialize auth state when the app loads
    const initAuth = async () => {
      await checkUser();
    };
    
    initAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        checkUser();
      } else {
        checkUser();
      }
    });

    // Clean up subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [checkUser]);

  return (
    <div className="flex flex-col min-h-screen bg-background dark:bg-darkBackground transition-all duration-300">
      {/* Navbar */}
      <Navbar />

      {/* Soft transitions */}
      <main className="flex-grow container py-10 animate-fadeInUp">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/shipping" element={<ShippingPolicy />} />
          <Route path="/returns" element={<Returns />} />
          <Route path="/orders" element={<OrderTracking />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
      
      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
}

export default App;
