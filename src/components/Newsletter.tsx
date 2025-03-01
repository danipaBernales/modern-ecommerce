import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuthStore();

  // Pre-fill email if user is logged in
  const userEmail = user?.email || '';
  const displayName = profile?.username || user?.email?.split('@')[0] || '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubscribed(true);
      setLoading(false);
    }, 1000);
  };

  return (
    <section className="bg-gray-100 dark:bg-gray-800 py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Subscribe to our Newsletter
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Stay updated with the latest products, exclusive offers, and shopping tips.
          </p>
          
          {subscribed ? (
            <div className="bg-green-100 dark:bg-green-800 p-4 rounded-lg">
              <p className="text-green-800 dark:text-green-200 font-medium">
                {displayName ? `Thank you ${displayName}!` : 'Thank you!'} Check your email for confirmation.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                value={email || userEmail}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-grow px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-magenta-600 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
