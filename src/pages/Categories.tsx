import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface Category {
  name: string;
  count: number;
  image_url: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      
      // Get all products
      const { data, error } = await supabase
        .from('products')
        .select('category, image_url');
        
      if (error) {
        console.error(error);
      } else if (data) {
        // Group by category and count
        const categoryMap = new Map<string, { count: number; images: string[] }>();
        
        data.forEach(product => {
          if (!categoryMap.has(product.category)) {
            categoryMap.set(product.category, { count: 0, images: [] });
          }
          
          const category = categoryMap.get(product.category)!;
          category.count += 1;
          category.images.push(product.image_url);
        });
        
        // Convert to array and sort by count
        const categoriesArray = Array.from(categoryMap.entries()).map(([name, { count, images }]) => ({
          name,
          count,
          // Use the first image as the category image
          image_url: images[0]
        }));
        
        setCategories(categoriesArray);
      }
      
      setLoading(false);
    }
    
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="container py-10 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Product Categories
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <Link
            key={category.name}
            to={`/products?category=${category.name}`}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl will-change-transform"
            style={{
              animationDelay: `${index * 100}ms`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={category.image_url}
                alt={category.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-110"
              />
              {category.name === 'Electronics' && (
                <div className="absolute inset-0 bg-yellow-400/30 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:backdrop-blur-md">
                  <h2 className="text-2xl font-bold text-white transform transition-all duration-300 hover:scale-110">{category.name}</h2>
                </div>
              )}
              {category.name === 'Home & Office' && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:backdrop-blur-md">
                  <h2 className="text-2xl font-bold text-white transform transition-all duration-300 hover:scale-110">{category.name}</h2>
                </div>
              )}
              {category.name === 'Accessories' && (
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-primary/10 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:backdrop-blur-md">
                  <h2 className="text-2xl font-bold text-white transform transition-all duration-300 hover:scale-110">{category.name}</h2>
                </div>
              )}
              {!['Electronics', 'Home & Office', 'Accessories'].includes(category.name) && (
                <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:backdrop-blur-md">
                  <h2 className="text-2xl font-bold text-white transform transition-all duration-300 hover:scale-110">{category.name}</h2>
                </div>
              )}
            </div>
            <div className="p-4 transform transition-all duration-300 hover:translate-x-2">
              <p className="text-gray-600 dark:text-gray-300">
                {category.count} {category.count === 1 ? 'product' : 'products'}
              </p>
              <p className="mt-2 text-primary group-hover:underline transition-all duration-300 ease-in-out transform hover:translate-x-1">
                Browse Category →
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
