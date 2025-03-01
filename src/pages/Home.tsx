import { Link } from 'react-router-dom';
import FeaturedProducts from '../components/FeaturedProducts';
import Newsletter from '../components/Newsletter';

export default function Home() {
  return (
    <section className="container flex flex-col items-center text-center py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
        Welcome to <span className="text-primary">Modern</span><span className="text-secondary">Shop</span>
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl">
        Discover the latest trends in fashion, electronics, and home decor. Shop
        with confidence and enjoy a modern shopping experience.
      </p>
      <div className="flex space-x-4 mt-8">
        <Link
          to="/products"
          className="px-8 py-3 bg-primary text-white rounded-md hover:bg-magenta-600 transition-colors btn-hover-scale btn-hover-shadow"
        >
          Shop Now
        </Link>
        <Link
          to="/categories"
          className="px-8 py-3 bg-secondary text-gray-800 rounded-md hover:bg-yellow-500 transition-colors btn-hover-scale btn-hover-shadow"
        >
          Browse Categories
        </Link>
      </div>
      <div className="mt-12 w-full relative">
        <img
          src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
          alt="Shop Banner"
          className="w-full h-64 object-cover rounded-lg shadow-md"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-secondary/30 rounded-lg"></div>
      </div>
      
      {/* Featured Categories */}
      <div className="mt-16 w-full">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Featured Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/products?category=Home & Office" className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 btn-hover-shadow">
            <div className="h-40 bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Home & Office</span>
            </div>
            <div className="p-4">
              <p className="text-gray-600 dark:text-gray-300">
                Beautiful items for your living space and workspace
              </p>
            </div>
          </Link>
          <Link to="/products?category=Electronics" className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 btn-hover-shadow">
            <div className="h-40 bg-yellow-400/20 flex items-center justify-center">
              <span className="text-2xl font-bold text-yellow-600">Electronics</span>
            </div>
            <div className="p-4">
              <p className="text-gray-600 dark:text-gray-300">
                Latest gadgets and tech accessories
              </p>
            </div>
          </Link>
          <Link to="/products?category=Accessories" className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 btn-hover-shadow">
            <div className="h-40 bg-gradient-to-r from-secondary/10 to-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-secondary to-primary">Accessories</span>
            </div>
            <div className="p-4">
              <p className="text-gray-600 dark:text-gray-300">
                Stylish accessories to complete your look
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Featured Products Section */}
      <FeaturedProducts />
      
      {/* Newsletter Section */}
      <Newsletter />
    </section>
  );
}