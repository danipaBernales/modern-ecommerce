import { useState } from 'react';
import { ShoppingCart, Trash2, ArrowLeft, Plus, Minus } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Cart() {
  const cartItems = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const checkout = async () => {
    // Check if user is logged in
    if (!user) {
      // Redirect to login page if not authenticated
      navigate('/auth', { state: { from: '/cart', message: 'Please sign in to complete your purchase' } });
      return;
    }

    setLoading(true);
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert('User not authenticated!');
        setLoading(false);
        return;
      }

      const totalPrice = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_price: totalPrice,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) {
        alert('Error creating order: ' + orderError.message);
        setLoading(false);
        return;
      }

      for (const item of cartItems) {
        const { error: orderItemError } = await supabase
          .from('order_items')
          .insert({
            order_id: order.id,
            product_id: item.id,
            quantity: item.quantity,
            price: item.price,
          });

        if (orderItemError) {
          alert('Error creating order item: ' + orderItemError.message);
          setLoading(false);
          return;
        }
      }

      clearCart();
      alert('Order placed successfully!');
    } catch (error: any) {
      alert('Checkout error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Your Cart
      </h1>
      {cartItems.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md text-center">
          <ShoppingCart className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">Your cart is empty.</p>
          <Link
            to="/products"
            className="inline-block px-6 py-2 bg-primary text-white rounded-md hover:bg-magenta-600 transition-colors btn-hover-scale btn-hover-shadow"
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border-l-4 border-primary"
              >
                <div className="flex items-center">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded-md mr-4"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {item.name}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      ${item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center mt-2">
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-1 bg-gray-100 dark:bg-gray-700 rounded-l-md hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        <Minus className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </button>
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-1 bg-gray-100 dark:bg-gray-700 rounded-r-md hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        <Plus className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="font-semibold text-gray-900 dark:text-white mb-2">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
            
            <div className="mt-6">
              <Link
                to="/products"
                className="inline-flex items-center text-primary hover:text-magenta-600 transition-colors link-hover"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-fit">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Order Summary
            </h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                <span>${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-300">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-primary">${cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
            <Link
              to="/products"
              className="w-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white px-6 py-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-center btn-hover-shadow mb-4"
            >
              Add more products
            </Link>
            <button
              onClick={checkout}
              disabled={loading}
              className="w-full flex items-center justify-center bg-primary text-white px-6 py-3 rounded-lg hover:bg-magenta-600 transition-colors disabled:bg-gray-400 btn-hover-scale"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {loading ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
