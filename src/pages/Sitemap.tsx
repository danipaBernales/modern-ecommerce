import { Link } from 'react-router-dom';
import { 
  Home, 
  ShoppingBag, 
  User, 
  ShoppingCart, 
  Info, 
  HelpCircle, 
  Mail, 
  FileText, 
  Truck, 
  RefreshCw, 
  Package
} from 'lucide-react';

export default function Sitemap() {
  const sitemapSections = [
    {
      title: 'Main Pages',
      icon: <Home className="h-5 w-5 text-primary" />,
      links: [
        { name: 'Home', path: '/' },
        { name: 'Products', path: '/products' },
        { name: 'Categories', path: '/categories' },
        { name: 'About Us', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'FAQ', path: '/faq' }
      ]
    },
    {
      title: 'Shop',
      icon: <ShoppingBag className="h-5 w-5 text-primary" />,
      links: [
        { name: 'All Products', path: '/products' },
        { name: 'Electronics', path: '/products?category=Electronics' },
        { name: 'Home & Office', path: '/products?category=Home & Office' },
        { name: 'Accessories', path: '/products?category=Accessories' },
        { name: 'New Arrivals', path: '/products?sort=newest' },
        { name: 'Sale Items', path: '/products?sale=true' }
      ]
    },
    {
      title: 'Customer Account',
      icon: <User className="h-5 w-5 text-primary" />,
      links: [
        { name: 'Sign In / Register', path: '/auth' },
        { name: 'My Account', path: '/profile' },
        { name: 'Order History', path: '/orders' },
        { name: 'Wishlist', path: '/wishlist' },
        { name: 'Shopping Cart', path: '/cart' },
        { name: 'Checkout', path: '/checkout' }
      ]
    },
    {
      title: 'Customer Service',
      icon: <HelpCircle className="h-5 w-5 text-primary" />,
      links: [
        { name: 'Contact Us', path: '/contact' },
        { name: 'FAQ', path: '/faq' },
        { name: 'Shipping Policy', path: '/shipping' },
        { name: 'Returns & Refunds', path: '/returns' },
        { name: 'Order Tracking', path: '/orders' },
        { name: 'Size Guide', path: '/size-guide' }
      ]
    },
    {
      title: 'Company Information',
      icon: <Info className="h-5 w-5 text-primary" />,
      links: [
        { name: 'About Us', path: '/about' },
        { name: 'Careers', path: '/careers' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Blog', path: '/blog' },
        { name: 'Press', path: '/press' }
      ]
    }
  ];

  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Sitemap
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Welcome to our sitemap. Use this page to navigate to any section of our website.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {sitemapSections.map((section, index) => (
            <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-4">
                {section.icon}
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white ml-2">
                  {section.title}
                </h2>
              </div>
              
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.path}
                      className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors flex items-center"
                    >
                      <span className="w-1 h-1 bg-gray-400 dark:bg-gray-500 rounded-full mr-2"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <ShoppingCart className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Shopping
            </h2>
          </div>
          <ul className="space-y-2">
            <li>
              <Link to="/products" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                Browse All Products
              </Link>
            </li>
            <li>
              <Link to="/categories" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                Product Categories
              </Link>
            </li>
            <li>
              <Link to="/cart" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                Shopping Cart
              </Link>
            </li>
            <li>
              <Link to="/checkout" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                Checkout
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Truck className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Shipping & Returns
            </h2>
          </div>
          <ul className="space-y-2">
            <li>
              <Link to="/shipping" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link to="/returns" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                Returns & Refunds
              </Link>
            </li>
            <li>
              <Link to="/orders" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                Order Tracking
              </Link>
            </li>
            <li>
              <Link to="/faq" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                Shipping FAQ
              </Link>
            </li>
          </ul>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <FileText className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Legal
            </h2>
          </div>
          <ul className="space-y-2">
            <li>
              <Link to="/terms" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/cookies" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                Cookie Policy
              </Link>
            </li>
            <li>
              <Link to="/accessibility" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                Accessibility
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
