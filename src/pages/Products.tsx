import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../store/cartStore';
import ProductCard from '../components/ProductCard';
import QuickView from '../components/QuickView';
import { Product } from '../types/supabase';
import { Filter, SlidersHorizontal, Eye } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<string>('');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';

  useEffect(() => {
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      
      // Build the query
      let query = supabase.from('products').select('*');
      
      // Apply category filter
      if (selectedCategory) {
        query = query.eq('category', selectedCategory);
      }
      
      // Apply price range filter
      query = query.gte('price', priceRange[0]).lte('price', priceRange[1]);
      
      // Apply search filter
      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }
      
      // Apply sorting
      if (sortBy === 'price-asc') {
        query = query.order('price', { ascending: true });
      } else if (sortBy === 'price-desc') {
        query = query.order('price', { ascending: false });
      } else if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error(error);
      } else {
        setProducts(data || []);
      }
      
      setLoading(false);
    }
    
    async function fetchCategories() {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .order('category');
        
      if (error) {
        console.error(error);
      } else {
        // Extract unique categories
        const uniqueCategories = [...new Set(data.map(item => item.category))];
        setCategories(uniqueCategories);
      }
    }
    
    async function fetchMaxPrice() {
      const { data, error } = await supabase
        .from('products')
        .select('price')
        .order('price', { ascending: false })
        .limit(1);
        
      if (error) {
        console.error(error);
      } else if (data && data.length > 0) {
        const maxPriceValue = Math.ceil(data[0].price);
        setMaxPrice(maxPriceValue);
        setPriceRange([0, maxPriceValue]);
      }
    }
    
    fetchCategories();
    fetchMaxPrice();
    fetchProducts();
  }, [selectedCategory, priceRange, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('');
    setPriceRange([0, maxPrice]);
    setSortBy('');
  };

  const handleQuickView = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory ? `${selectedCategory}` : 'All Products'}
        </h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg md:hidden"
        >
          <Filter className="h-5 w-5" />
          <span>Filters</span>
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className={`md:w-1/4 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Filters
              </h2>
              <button
                onClick={resetFilters}
                className="text-sm text-primary hover:underline"
              >
                Reset
              </button>
            </div>
            
            {/* Categories */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Categories
              </h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="all-categories"
                    name="category"
                    checked={selectedCategory === ''}
                    onChange={() => setSelectedCategory('')}
                    className="h-4 w-4 text-primary accent-primary"
                  />
                  <label
                    htmlFor="all-categories"
                    className="ml-2 text-gray-700 dark:text-gray-300"
                  >
                    All Categories
                  </label>
                </div>
                {categories.map((category) => (
                  <div key={category} className="flex items-center">
                    <input
                      type="radio"
                      id={category}
                      name="category"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                      className="h-4 w-4 text-primary accent-primary"
                    />
                    <label
                      htmlFor={category}
                      className="ml-2 text-gray-700 dark:text-gray-300"
                    >
                      {category}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price Range */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Price Range
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-700 dark:text-gray-300">
                    ${priceRange[0]}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    ${priceRange[1]}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full accent-primary"
                />
              </div>
            </div>
            
            {/* Sort By */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                Sort by
              </h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-primary focus:ring-primary"
              >
                <option value="">Trending</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="md:w-3/4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="relative group">
                  <Link to={`/products/${product.id}`} className="block h-full">
                    <ProductCard
                      product={product}
                      onAddToCart={addItem}
                    />
                  </Link>
                  <button
                    onClick={(e) => handleQuickView(e, product)}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 text-primary p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    aria-label="Quick view"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
              <SlidersHorizontal className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No products found
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Try adjusting your filters or search criteria.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-magenta-600 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Quick View Modal */}
      <QuickView 
        product={quickViewProduct} 
        isOpen={isQuickViewOpen} 
        onClose={() => setIsQuickViewOpen(false)} 
      />
    </div>
  );
}
