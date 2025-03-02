import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Star, ArrowLeft, Info, Package, Check, X, Truck, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../store/cartStore';
import { Product, Review, ProductImage } from '../types/supabase';
import { useAuthStore } from '../store/authStore';
import ProductGallery from '../components/ProductGallery';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const { user } = useAuthStore();

  useEffect(() => {
    async function fetchProductAndReviews() {
      setLoading(true);
      if (!id) return;

      // Fetch product details
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (productError) {
        console.error('Error fetching product:', productError);
      } else if (productData) {
        setProduct(productData);
        
        // Fetch product images
        const { data: imagesData, error: imagesError } = await supabase
          .from('product_images')
          .select('*')
          .eq('product_id', id)
          .order('is_primary', { ascending: false })
          .order('display_order', { ascending: true });
          
        if (imagesError) {
          console.error('Error fetching product images:', imagesError);
        } else {
          setProductImages(imagesData || []);
        }
        
        // Fetch reviews for this product
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select(`
            id,
            product_id,
            user_id,
            rating,
            comment,
            created_at
          `)
          .eq('product_id', id)
          .order('created_at', { ascending: false });

        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
        } else {
          setReviews(reviewsData || []);
        }
        
        // Fetch related products in the same category
        if (productData.category) {
          const { data: relatedData, error: relatedError } = await supabase
            .from('products')
            .select('*')
            .eq('category', productData.category)
            .neq('id', id)
            .limit(7); // Increased from 4 to 7 related products
            
          if (relatedError) {
            console.error('Error fetching related products:', relatedError);
          } else {
            setRelatedProducts(relatedData || []);
          }
        }
      }
      
      setLoading(false);
    }

    fetchProductAndReviews();
  }, [id]);

  // Check if the product is in the cart and update quantity accordingly
  useEffect(() => {
    if (product) {
      const cartItem = cartItems.find(item => item.id === product.id);
      if (cartItem) {
        setQuantity(cartItem.quantity);
        setAddedToCart(true);
      } else {
        setQuantity(1);
        setAddedToCart(false);
      }
    }
  }, [cartItems, product]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (addedToCart) {
      // If already in cart, update quantity directly
      updateQuantity(product.id, quantity);
    } else {
      // If not in cart, add it once and then update quantity if needed
      addItem(product);
      
      // If quantity is more than 1, update the quantity
      if (quantity > 1) {
        updateQuantity(product.id, quantity);
      }
    }
    setAddedToCart(true);
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  const submitReview = async () => {
    if (!user || !product || !reviewText) return;
    
    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          product_id: product.id,
          user_id: user.id,
          rating,
          comment: reviewText
        });
        
      if (error) {
        console.error('Error submitting review:', error);
        alert('Failed to submit review');
      } else {
        // Refresh reviews
        const { data, error: fetchError } = await supabase
          .from('reviews')
          .select(`
            id,
            product_id,
            user_id,
            rating,
            comment,
            created_at
          `)
          .eq('product_id', product.id)
          .order('created_at', { ascending: false });
          
        if (!fetchError) {
          setReviews(data || []);
          setReviewText('');
          setRating(5);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Generate mock specifications based on product category
  const getProductSpecifications = () => {
    if (!product) return [];
    
    const baseSpecs = [
      { name: 'Brand', value: 'ModernShop' },
      { name: 'Model', value: `MS-${product.id.substring(0, 6).toUpperCase()}` },
      { name: 'Warranty', value: '1 Year Limited Warranty' },
      { name: 'Country of Origin', value: 'United States' },
    ];
    
    const categorySpecs = {
      'Electronics': [
        { name: 'Power Source', value: 'Rechargeable Battery' },
        { name: 'Battery Life', value: 'Up to 12 hours' },
        { name: 'Connectivity', value: 'Bluetooth 5.0, Wi-Fi' },
        { name: 'Dimensions', value: '5.8 x 2.8 x 0.3 inches' },
        { name: 'Weight', value: '180g' },
        { name: 'Material', value: 'Aluminum, Glass' },
      ],
      'Home & Office': [
        { name: 'Material', value: 'Premium Wood, Metal' },
        { name: 'Dimensions', value: '24 x 18 x 30 inches' },
        { name: 'Weight', value: '5.2 kg' },
        { name: 'Assembly Required', value: 'Minimal assembly' },
        { name: 'Care Instructions', value: 'Wipe clean with damp cloth' },
      ],
      'Accessories': [
        { name: 'Material', value: 'Genuine Leather, Metal' },
        { name: 'Dimensions', value: '8.5 x 4.7 x 0.8 inches' },
        { name: 'Weight', value: '120g' },
        { name: 'Color Options', value: 'Black, Brown, Navy' },
        { name: 'Care Instructions', value: 'Clean with leather conditioner' },
      ]
    };
    
    return [...baseSpecs, ...(categorySpecs[product.category as keyof typeof categorySpecs] || [])];
  };

  if (loading) {
    return (
      <div className="container py-10 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-10">
        <p className="text-gray-600 dark:text-gray-300">Product not found.</p>
        <Link to="/products" className="text-primary hover:underline mt-4 inline-block">
          <ArrowLeft className="inline mr-2 h-4 w-4" />
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <Link to="/products" className="text-primary hover:underline mb-6 inline-block link-hover">
        <ArrowLeft className="inline mr-2 h-4 w-4" />
        Back to Products
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image Gallery */}
        <ProductGallery 
          productId={product.id} 
          mainImage={product.image_url} 
        />
        
        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {product.name}
          </h1>
          
          <div className="flex items-center mb-4">
            {/* Average Rating */}
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= (reviews.reduce((acc, review) => acc + review.rating, 0) / Math.max(reviews.length, 1))
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="ml-2 text-gray-600 dark:text-gray-300">
              ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>
          
          <p className="text-2xl font-bold text-primary mb-4">
            ${product.price.toFixed(2)}
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
          
          {/* Product Benefits */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Key Benefits</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Premium quality materials</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">1-year manufacturer warranty</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Free shipping on orders over $50</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">30-day money-back guarantee</span>
              </li>
            </ul>
          </div>
          
          {/* Quantity Selector */}
          <div className="flex items-center mb-6">
            <label htmlFor="quantity" className="mr-4 text-gray-700 dark:text-gray-300">
              Quantity:
            </label>
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md">
              <button
                onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
                className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                -
              </button>
              <span className="px-4 py-1 text-gray-800 dark:text-gray-200">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(Math.min(product.stock, quantity + 1))}
                className="px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                +
              </button>
            </div>
          </div>
          
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`w-full flex items-center justify-center space-x-2 py-3 rounded-md btn-hover-scale ${
              product.stock > 0
                ? 'bg-primary hover:bg-magenta-600 text-white'
                : 'bg-gray-300 cursor-not-allowed text-gray-500'
            } transition-colors`}
          >
            <ShoppingCart className="w-5 h-5" />
            <span>{product.stock > 0 ? (addedToCart ? 'Update Cart' : 'Add to Cart') : 'Out of Stock'}</span>
          </button>
          
          {/* Shipping & Returns Info */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="flex items-center">
              <Truck className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Free shipping over $50</span>
            </div>
            <div className="flex items-center">
              <Package className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Secure packaging</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-300">30-day returns</span>
            </div>
            <div className="flex items-center">
              <Info className="h-5 w-5 text-primary mr-2" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Satisfaction guaranteed</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Details Tabs */}
      <div className="mt-12">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'description'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('specifications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'specifications'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Specifications
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reviews'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </nav>
        </div>
        
        <div className="py-6">
          {/* Description Tab */}
          {activeTab === 'description' && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Product Description
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {product.description}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Experience the perfect blend of style, functionality, and durability with our {product.name}. 
                Designed with the modern consumer in mind, this {product.category.toLowerCase()} product 
                offers exceptional quality and value.
              </p>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Features
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>Premium quality materials ensure long-lasting durability</li>
                  <li>Sleek, modern design complements any environment</li>
                  <li>Versatile functionality for everyday use</li>
                  <li>Easy to maintain and clean</li>
                  <li>Compact and portable for convenience</li>
                </ul>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  What's Included
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
                  <li>1 x {product.name}</li>
                  <li>User manual with care instructions</li>
                  <li>Warranty card</li>
                  {product.category === 'Electronics' && <li>Charging cable and adapter</li>}
                  {product.category === 'Home & Office' && <li>Assembly tools and hardware</li>}
                  {product.category === 'Accessories' && <li>Protective storage pouch</li>}
                </ul>
              </div>
            </div>
          )}
          
          {/* Specifications Tab */}
          {activeTab === 'specifications' && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Product Specifications
              </h2>
              
              <div className="overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {getProductSpecifications().map((spec, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-700/50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white w-1/3">
                          {spec.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-primary" />
                  Additional Information
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Specifications may vary slightly from the actual product. Please refer to the 
                  manufacturer's website for the most up-to-date information.
                </p>
              </div>
            </div>
          )}
          
          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div>
              {/* Add Review Form */}
              {user ? (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Write a Review
                  </h3>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 dark:text-gray-300 mb-2">
                      Rating
                    </label>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-6 w-6 ${
                              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="review" className="block text-gray-700 dark:text-gray-300 mb-2">
                      Your Review
                    </label>
                    <textarea
                      id="review"
                      rows={4}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Share your experience with this product..."
                    ></textarea>
                  </div>
                  
                  <button
                    onClick={submitReview}
                    disabled={!reviewText}
                    className="bg-primary text-white px-6 py-2 rounded-md hover:bg-magenta-600 transition-colors disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed btn-hover-scale"
                  >
                    Submit Review
                  </button>
                </div>
              ) : (
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-8">
                  <p className="text-gray-700 dark:text-gray-300">
                    Please <Link to="/auth" className="text-primary hover:underline link-hover">sign in</Link> to leave a review.
                  </p>
                </div>
              )}
              
              {/* Reviews List */}
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                      <div className="flex justify-between mb-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-5 w-5 ${
                                star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 mb-2">{review.comment}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        By User {review.user_id.substring(0, 8)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-300">No reviews yet. Be the first to review this product!</p>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link 
                key={relatedProduct.id} 
                to={`/products/${relatedProduct.id}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 btn-hover-shadow"
              >
                <img
                  src={relatedProduct.image_url}
                  alt={relatedProduct.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-primary font-medium mt-2">
                    ${relatedProduct.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
