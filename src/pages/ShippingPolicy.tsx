import { Truck, Clock, Globe, DollarSign } from 'lucide-react';

export default function ShippingPolicy() {
  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Shipping Policy
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-6">
            <div className="flex items-start">
              <Truck className="h-8 w-8 text-primary mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Shipping Methods
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We offer various shipping methods to meet your needs:
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Standard Shipping (3-5 business days)</li>
                  <li>Express Shipping (1-2 business days)</li>
                  <li>Same-Day Delivery (select areas only)</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock className="h-8 w-8 text-primary mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Processing Time
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Orders are typically processed within 24 hours of being placed. During peak seasons or promotional periods, processing may take up to 48 hours.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-6">
            <div className="flex items-start">
              <Globe className="h-8 w-8 text-primary mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  International Shipping
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We ship to over 100 countries worldwide. International shipping typically takes 7-14 business days, depending on the destination and customs processing.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <DollarSign className="h-8 w-8 text-primary mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Shipping Costs
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Shipping costs are calculated based on weight, dimensions, and destination. Free shipping is available for orders over $50 within the continental US.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Shipping FAQ
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              How can I track my order?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Once your order ships, you'll receive a tracking number via email. You can also track your order in your account dashboard under "Order History."
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              What if my package is lost or damaged?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              If your package is lost or damaged during transit, please contact our customer service team within 48 hours of the delivery date. We'll work with the carrier to resolve the issue promptly.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Do you ship to P.O. boxes?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Yes, we ship to P.O. boxes for standard shipping only. Express and same-day delivery require a physical address.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Can I change my shipping address after placing an order?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Address changes can be made if the order hasn't been processed yet. Please contact customer service immediately if you need to change your shipping address.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
