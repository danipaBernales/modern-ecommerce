import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductImage } from '../types/supabase';
import { supabase } from '../lib/supabase';

interface ProductGalleryProps {
  productId: string;
  mainImage: string;
}

export default function ProductGallery({ productId, mainImage }: ProductGalleryProps) {
  const [images, setImages] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState<string>(mainImage);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function fetchProductImages() {
      setLoading(true);
      
      // Fetch additional images for this product
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId)
        .order('is_primary', { ascending: false })
        .order('display_order', { ascending: true });
        
      if (error) {
        console.error('Error fetching product images:', error);
        // If there's an error, just use the main image
        setImages([mainImage]);
      } else if (data && data.length > 0) {
        // Extract image URLs from the data
        const imageUrls = data.map((img: ProductImage) => img.image_url);
        setImages(imageUrls);
        setCurrentImage(imageUrls[0]);
      } else {
        // If no additional images, just use the main image
        setImages([mainImage]);
      }
      
      setLoading(false);
    }
    
    if (productId) {
      fetchProductImages();
    } else {
      // If no productId, just use the main image
      setImages([mainImage]);
      setLoading(false);
    }
  }, [productId, mainImage]);

  const handlePrevious = () => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    setCurrentImage(images[newIndex]);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    setCurrentImage(images[newIndex]);
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
    setCurrentImage(images[index]);
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <div className="relative">
        <img
          src={currentImage}
          alt="Product"
          className="w-full h-96 object-contain"
        />
        
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </button>
          </>
        )}
      </div>
      
      {images.length > 1 && (
        <div className="flex justify-center mt-4 space-x-2 p-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`h-16 w-16 rounded-md overflow-hidden border-2 transition-all ${
                currentIndex === index 
                  ? 'border-primary scale-110' 
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
