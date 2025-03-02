import { useState, useEffect, memo } from 'react';
import { X, ShoppingCart, Star, Plus, Minus } from 'lucide-react';
import { Product } from '../types/supabase';
import { useCartStore } from '../store/cartStore';

interface QuickViewProps {
  product: Product;
  onClose: () => void;
}

const QuickView = memo(function QuickView({ product, onClose }: QuickViewProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    // Check if product is already in cart
    const cartItem = cartItems.find(item => item.id === product.id);
    if (cartItem) {
      setQuantity(cartItem.quantity);
      setIsInCart(true);
    } else {
      setQuantity(1);
      setIsInCart(false);
    }
  }, [product.id, cartItems]);

  const handleAddToCart = () => {
    if (isInCart) {
      // If already in cart, update quantity
      updateQuantity(product.id, quantity);
    } else {
      // If not in cart, add it
      addItem(product);
      
      // If quantity is more than 1, update the quantity
      if (quantity > 1) {
        updateQuantity(product.id, quantity);
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto transform-gpu animate-modal-enter">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain"
              loading="lazy"
              decoding="async"
            />
          </div>
          
          <div className="flex flex-col">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {product.name}
            </h2>
            
            <div className="flex items-center mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-5 w-5 text-yellow-400 fill-current"
                  />
                ))}
              </div>
              <span className="ml-2 text-gray-600 dark:text-gray-300">
                (24 reviews)
              </span>
            </div>
            
            <p className="text-xl font-bold text-primary mb-4">
              ${product.price.toFixed(2)}
            </p>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-4">
              {product.description}
            </p>
            
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <span className="font-semibold">Category:</span> {product.category}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <span className="font-semibold">Availability:</span>{' '}
                {product.stock > 0 ? (
                  <span className="text-green-600 dark:text-green-400">In Stock ({product.stock} available)</span>
                ) : (
                  <span className="text-red-600 dark:text-red-400">Out of Stock</span>
                )}
              </p>
            </div>
            
            <div className="flex items-center mb-6">
              <label htmlFor="quantity" className="mr-4 text-gray-700 dark:text-gray-300">
                Quantity:
              </label>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 py-1 text-gray-800 dark:text-gray-200">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={`w-full flex items-center justify-center space-x-2 py-3 rounded-md transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                  product.stock > 0
                    ? 'bg-primary hover:bg-magenta-600 text-white'
                    : 'bg-gray-300 cursor-not-allowed text-gray-500'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{product.stock > 0 ? (isInCart ? 'Update Cart' : 'Add to Cart') : 'Out of Stock'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default QuickView;
