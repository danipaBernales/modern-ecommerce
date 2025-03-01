import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart, User, Moon, Sun, Search, LogOut } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const cartItems = useCartStore((state) => state.items);
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const { user, profile, signOut } = useAuthStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/products?search=${searchQuery}`);
    setSearchQuery('');
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsMenuOpen(false);
  };

  // Get display name
  const displayName = profile?.username || user?.email?.split('@')[0] || 'User';

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md border-b dark:border-gray-700">
      <div className="container flex items-center justify-between h-14">
        {/* Logo & Brand */}
        <Link
          to="/"
          className="flex items-center space-x-1 text-gray-900 dark:text-white"
        >
          <ShoppingBag className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <span className="font-bold text-xl">
            <span className="text-primary">Modern</span>
            <span className="text-secondary">Shop</span>
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700 dark:text-gray-300 p-1"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Search Bar - Hidden on mobile */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Navigation Links - Desktop */}
        <div className="hidden md:flex items-center">
          <div className="flex space-x-4 mr-4 text-sm">
            <Link
              to="/products"
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors link-hover px-2 py-1"
            >
              Products
            </Link>
            <Link
              to="/categories"
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors link-hover px-2 py-1"
            >
              Categories
            </Link>
            <Link
              to="/about"
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors link-hover px-2 py-1"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors link-hover px-2 py-1"
            >
              Contact
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2 border-l border-gray-200 dark:border-gray-700 pl-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="focus:outline-none p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? (
                <Sun className="h-4 w-4 text-secondary" />
              ) : (
                <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              )}
            </button>
            <Link to="/cart" className="relative p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
              <ShoppingCart className="h-4 w-4 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-semibold rounded-full h-3.5 w-3.5 flex items-center justify-center text-[10px]">
                  {itemCount}
                </span>
              )}
            </Link>
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline text-xs ml-1">{displayName}</span>
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10 border dark:border-gray-700">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/orders" 
                      className="block px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Orders
                    </Link>
                    <button 
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary"
                    >
                      <div className="flex items-center">
                        <LogOut className="h-3 w-3 mr-2" />
                        Sign Out
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/auth" 
                className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors flex items-center p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <User className="h-4 w-4" />
                <span className="hidden md:inline text-xs ml-1">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 py-2 px-4 border-t dark:border-gray-700">
          {/* Mobile Search Bar */}
          <form onSubmit={handleSearch} className="flex w-full mb-3">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-1.5 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>
          
          <div className="flex flex-col space-y-2">
            <Link
              to="/products"
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors py-1.5 text-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/categories"
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors py-1.5 text-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              to="/about"
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors py-1.5 text-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors py-1.5 text-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            
            {/* Mobile User Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="focus:outline-none p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {darkMode ? (
                    <Sun className="h-4 w-4 text-secondary" />
                  ) : (
                    <Moon className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                  )}
                </button>
                <Link to="/cart" className="relative p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                  <ShoppingCart className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-semibold rounded-full h-3.5 w-3.5 flex items-center justify-center text-[10px]">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </div>
              
              {user ? (
                <div className="flex items-center">
                  <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">{displayName}</span>
                  <button 
                    onClick={handleSignOut}
                    className="text-red-500 text-sm flex items-center"
                  >
                    <LogOut className="h-3 w-3 mr-1" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link 
                  to="/auth" 
                  className="text-primary text-sm flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <User className="h-4 w-4 mr-1" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
