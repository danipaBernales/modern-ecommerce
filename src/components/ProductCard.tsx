import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types/supabase';
import { useState, useEffect } from 'react';
import { useCartStore } from '../store/cartStore';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const [isInCart, setIsInCart] = useState(false);
  
  useEffect(() => {
    // Check if product is in cart
    const cartItem = cartItems.find(item => item.id === product.id);
    setIsInCart(!!cartItem);
  }, [cartItems, product.id]);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the add to cart button
    e.stopPropagation(); // Stop event propagation
    
    // Check if product is already in cart
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      // If already in cart, increment quantity by 1
      const newQuantity = existingItem.quantity + 1;
      useCartStore.getState().updateQuantity(product.id, newQuantity);
    } else {
      // If not in cart, add it
      onAddToCart(product);
    }
  };
  
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 h-full flex flex-col">
      <div className="relative">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="absolute top-0 right-0 bg-secondary text-gray-800 px-2 py-1 m-2 rounded-md text-sm font-medium">
          ${product.price.toFixed(2)}
        </div>
        <button 
          onClick={handleWishlist}
          className="absolute top-0 left-0 m-2 p-1.5 bg-white dark:bg-gray-700 rounded-full shadow-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
        >
          <Heart 
            className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400 dark:text-gray-300'}`} 
          />
        </button>
        {product.stock <= 5 && product.stock > 0 && (
          <div className="absolute bottom-0 left-0 bg-red-500 text-white px-2 py-1 m-2 rounded-md text-xs font-medium">
            Only {product.stock} left!
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-bold">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {product.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mt-2 flex-grow">
          {product.description?.substring(0, 60)}
          {product.description && product.description.length > 60 ? '...' : ''}
        </p>
        <div className="mt-auto pt-4">
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full flex items-center justify-center space-x-2 py-2 rounded-md transition-colors btn-hover-scale ${
              product.stock > 0
                ? 'bg-primary text-white hover:bg-magenta-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>{product.stock > 0 ? (isInCart ? 'Update Cart' : 'Add to Cart') : 'Out of Stock'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}