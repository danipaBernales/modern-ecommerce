import { RefreshCw, Clock, CreditCard, HelpCircle } from 'lucide-react';

export default function Returns() {
  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Returns & Refunds
      </h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-6">
            <div className="flex items-start">
              <RefreshCw className="h-8 w-8 text-primary mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Return Policy
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We accept returns within 30 days of purchase for most items. Products must be in original condition with all packaging and tags intact.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Some items are not eligible for return, including:
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Personalized or custom-made products</li>
                  <li>Digital downloads</li>
                  <li>Gift cards</li>
                  <li>Personal care items that have been opened</li>
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
                  Return processing typically takes 3-5 business days from the time we receive your item. Refunds are usually processed within 7-10 business days, depending on your payment method.
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-6">
            <div className="flex items-start">
              <CreditCard className="h-8 w-8 text-primary mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Refund Methods
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Refunds will be issued to the original payment method used for the purchase. For credit card payments, it may take an additional 3-5 business days for the refund to appear on your statement.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  You may also choose to receive store credit, which will be issued immediately upon approval of your return.
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <HelpCircle className="h-8 w-8 text-primary mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Return Instructions
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  To initiate a return:
                </p>
                <ol className="list-decimal list-inside mt-2 text-gray-600 dark:text-gray-300 space-y-1">
                  <li>Log in to your account and go to "Order History"</li>
                  <li>Select the order containing the item(s) you wish to return</li>
                  <li>Click "Return Items" and follow the instructions</li>
                  <li>Print the prepaid return shipping label</li>
                  <li>Package the item(s) securely and attach the label</li>
                  <li>Drop off the package at any authorized shipping location</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Returns FAQ
        </h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              What if I received a defective item?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              If you receive a defective item, please contact our customer service team within 48 hours of delivery. We'll arrange for a replacement or refund at no additional cost to you.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Do I have to pay for return shipping?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Return shipping is free for defective items or if we sent the wrong product. For other returns, a flat fee of $5.99 will be deducted from your refund to cover return shipping costs.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Can I exchange an item instead of returning it?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Yes, you can request an exchange for a different size, color, or similar item of equal value. Simply select "Exchange" instead of "Return" when initiating the process in your account.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              What if my return is outside the 30-day window?
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Returns after 30 days are evaluated on a case-by-case basis. Please contact our customer service team to discuss your situation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
