import { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import AuthGuard from '../components/AuthGuard';

export default function OrderTracking() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackingResult, setTrackingResult] = useState<null | {
    orderNumber: string;
    status: 'processing' | 'shipped' | 'delivered' | 'delayed';
    date: string;
    items: number;
    estimatedDelivery?: string;
    trackingNumber?: string;
    carrier?: string;
    steps: {
      title: string;
      description: string;
      date: string;
      completed: boolean;
    }[];
  }>(null);
  
  const { user } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsTracking(true);
    
    // Simulate API call
    setTimeout(() => {
      // Mock tracking result
      setTrackingResult({
        orderNumber: orderNumber || 'ORD-12345678',
        status: 'shipped',
        date: '2025-03-15',
        items: 3,
        estimatedDelivery: '2025-03-18',
        trackingNumber: 'TRK-987654321',
        carrier: 'FedEx',
        steps: [
          {
            title: 'Order Placed',
            description: 'Your order has been received and is being processed.',
            date: '2025-03-15 09:23 AM',
            completed: true
          },
          {
            title: 'Payment Confirmed',
            description: 'Your payment has been successfully processed.',
            date: '2025-03-15 09:25 AM',
            completed: true
          },
          {
            title: 'Order Processing',
            description: 'Your order is being prepared for shipping.',
            date: '2025-03-16 10:45 AM',
            completed: true
          },
          {
            title: 'Shipped',
            description: 'Your order has been shipped and is on its way.',
            date: '2025-03-17 08:30 AM',
            completed: true
          },
          {
            title: 'Out for Delivery',
            description: 'Your package is out for delivery today.',
            date: '2025-03-18',
            completed: false
          },
          {
            title: 'Delivered',
            description: 'Your package has been delivered.',
            date: 'Pending',
            completed: false
          }
        ]
      });
      setIsTracking(false);
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-6 w-6 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-6 w-6 text-primary" />;
      case 'delivered':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'delayed':
        return <AlertCircle className="h-6 w-6 text-yellow-500" />;
      default:
        return <Package className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <AuthGuard>
      <section className="container py-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Order Tracking
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Track Your Order
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Order Number
              </label>
              <input
                type="text"
                id="orderNumber"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g., ORD-12345678"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email || (user?.email || '')}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter the email used for your order"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <button
              type="submit"
              disabled={isTracking}
              className="w-full md:w-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-magenta-600 transition-colors disabled:bg-gray-400 btn-hover-scale"
            >
              {isTracking ? 'Tracking...' : 'Track Order'}
            </button>
          </form>
        </div>
        
        {trackingResult && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Order #{trackingResult.orderNumber}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Placed on {trackingResult.date} • {trackingResult.items} item{trackingResult.items !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center">
                {getStatusIcon(trackingResult.status)}
                <span className="ml-2 font-medium text-gray-900 dark:text-white capitalize">
                  {trackingResult.status}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Shipping Details
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Carrier:</span> {trackingResult.carrier}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Tracking Number:</span> {trackingResult.trackingNumber}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Estimated Delivery:</span> {trackingResult.estimatedDelivery}
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Need Help?
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-3">
                  If you have questions about your order, we're here to help.
                </p>
                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-magenta-600 transition-colors btn-hover-scale">
                  Contact Support
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Tracking Timeline
            </h3>
            
            <div className="relative">
              {trackingResult.steps.map((step, index) => (
                <div key={index} className="flex mb-6 last:mb-0">
                  <div className="flex flex-col items-center mr-4">
                    <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                      step.completed 
                        ? 'bg-secondary text-gray-800' 
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <Clock className="h-5 w-5" />
                      )}
                    </div>
                    {index < trackingResult.steps.length - 1 && (
                      <div className={`w-0.5 h-full ${
                        step.completed 
                          ? 'bg-secondary' 
                          : 'bg-gray-200 dark:bg-gray-600'
                      }`}></div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white">
                      {step.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {step.description}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                      {step.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </AuthGuard>
  );
}