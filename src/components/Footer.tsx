import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 pt-12 pb-6 border-t dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              <span className="text-primary font-semibold">Modern</span><span className="text-secondary font-semibold">Shop</span>
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Modern shopping experience with style. Quality products for your everyday needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-500 hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors link-hover">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors link-hover">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors link-hover">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors link-hover">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors link-hover">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shipping" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors link-hover">
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link to="/returns" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors link-hover">
                  Returns & Refunds
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors link-hover">
                  Order Tracking
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors link-hover">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 dark:text-gray-300 hover:text-primary transition-colors link-hover">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-2 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-300">
                  1234 Alameda St, Santiago, Chile
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2" />
                <span className="text-gray-600 dark:text-gray-300">
                  (+56) 9 4455 2084
                </span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2" />
                <span className="text-gray-600 dark:text-gray-300">
                  support@modernshop.com
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            © {new Date().getFullYear()} <span className="text-primary font-semibold">danipa</span><span className="text-secondary font-semibold">Bernales</span>. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              to="/privacy"
              className="text-gray-600 dark:text-gray-300 text-sm hover:text-primary link-hover"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-gray-600 dark:text-gray-300 text-sm hover:text-primary link-hover"
            >
              Terms of Use
            </Link>
            <Link
              to="/sitemap"
              className="text-gray-600 dark:text-gray-300 text-sm hover:text-primary link-hover"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
