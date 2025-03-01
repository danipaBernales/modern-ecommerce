import { useState } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

// FAQ data
const faqCategories = [
  {
    id: 'orders',
    name: 'Orders & Shipping',
    faqs: [
      {
        question: 'How do I track my order?',
        answer: 'You can track your order by logging into your account and visiting the "Order History" section. Alternatively, you can use the Order Tracking page and enter your order number and email address.'
      },
      {
        question: 'How long will it take to receive my order?',
        answer: 'Standard shipping typically takes 3-5 business days within the continental US. Express shipping is 1-2 business days. International shipping can take 7-14 business days depending on the destination.'
      },
      {
        question: 'Can I change or cancel my order?',
        answer: 'Orders can be changed or canceled within 1 hour of placing them. After that, the order may have already been processed for shipping. Please contact customer service immediately if you need to make changes.'
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to over 100 countries worldwide. International shipping rates and delivery times vary by location. You can see the shipping options available during checkout.'
      }
    ]
  },
  {
    id: 'returns',
    name: 'Returns & Refunds',
    faqs: [
      {
        question: 'What is your return policy?',
        answer: 'We accept returns within 30 days of purchase for most items. Products must be in original condition with all packaging and tags intact. Some items like personalized products and digital downloads are not eligible for return.'
      },
      {
        question: 'How do I initiate a return?',
        answer: 'To initiate a return, log in to your account, go to "Order History," select the order containing the item(s) you wish to return, and click "Return Items." Follow the instructions to complete the process.'
      },
      {
        question: 'How long does it take to process a refund?',
        answer: 'Refunds are typically processed within 3-5 business days after we receive your return. It may take an additional 3-5 business days for the refund to appear on your credit card statement.'
      },
      {
        question: 'Do I have to pay for return shipping?',
        answer: 'Return shipping is free for defective items or if we sent the wrong product. For other returns, a flat fee of $5.99 will be deducted from your refund to cover return shipping costs.'
      }
    ]
  },
  {
    id: 'products',
    name: 'Products & Inventory',
    faqs: [
      {
        question: 'How do I know if a product is in stock?',
        answer: 'Product pages display current stock information. If an item is out of stock, you can sign up for email notifications to be alerted when it becomes available again.'
      },
      {
        question: 'Are your products authentic?',
        answer: 'Yes, all products sold on ModernShop are 100% authentic. We source directly from manufacturers or authorized distributors to ensure quality and authenticity.'
      },
      {
        question: 'Do you offer product warranties?',
        answer: 'Most products come with a manufacturer\'s warranty. The warranty information is listed on the product page. Additionally, we offer a 30-day satisfaction guarantee on all purchases.'
      },
      {
        question: 'Can I request a product that\'s not listed on your site?',
        answer: 'We welcome product suggestions! Please contact our customer service team with details about the item you\'re looking for, and we\'ll do our best to source it for you.'
      }
    ]
  },
  {
    id: 'account',
    name: 'Account & Payment',
    faqs: [
      {
        question: 'How do I create an account?',
        answer: 'Click on the user icon in the top right corner of the page and select "Sign Up." Fill in your email address and create a password. You can also sign up during the checkout process.'
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, and Google Pay. We also offer buy-now-pay-later options through Affirm and Klarna.'
      },
      {
        question: 'Is my payment information secure?',
        answer: 'Yes, we use industry-standard encryption and security protocols to protect your payment information. We are PCI DSS compliant and never store your full credit card details on our servers.'
      },
      {
        question: 'How do I reset my password?',
        answer: 'Click on the user icon, select "Sign In," and then click on "Forgot Password." Enter your email address, and we\'ll send you instructions to reset your password.'
      }
    ]
  }
];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('orders');
  const [openFaqs, setOpenFaqs] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const toggleFaq = (index: number) => {
    if (openFaqs.includes(index)) {
      setOpenFaqs(openFaqs.filter(i => i !== index));
    } else {
      setOpenFaqs([...openFaqs, index]);
    }
  };
  
  const filteredFaqs = searchQuery 
    ? faqCategories.flatMap(category => 
        category.faqs.filter(faq => 
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ).map(faq => ({ ...faq, category: category.name }))
      )
    : [];

  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Frequently Asked Questions
      </h1>
      
      {/* Search Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
      </div>
      
      {searchQuery ? (
        // Search Results
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Search Results ({filteredFaqs.length})
          </h2>
          
          {filteredFaqs.length > 0 ? (
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="flex justify-between items-center w-full text-left"
                  >
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {faq.question}
                    </h3>
                    {openFaqs.includes(index) ? (
                      <ChevronUp className="h-5 w-5 text-primary" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-primary" />
                    )}
                  </button>
                  
                  {openFaqs.includes(index) && (
                    <div className="mt-2">
                      <p className="text-gray-600 dark:text-gray-300">
                        {faq.answer}
                      </p>
                      <p className="text-sm text-primary mt-2">
                        Category: {faq.category}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">
              No results found for "{searchQuery}". Please try a different search term or browse our FAQ categories below.
            </p>
          )}
        </div>
      ) : (
        // FAQ Categories
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Category Navigation */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-fit">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Categories
            </h2>
            <nav className="space-y-2">
              {faqCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                    activeCategory === category.id
                      ? 'bg-primary text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </nav>
          </div>
          
          {/* FAQ Content */}
          <div className="md:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              {faqCategories.find(c => c.id === activeCategory)?.name}
            </h2>
            
            <div className="space-y-4">
              {faqCategories
                .find(c => c.id === activeCategory)
                ?.faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0 last:pb-0">
                    <button
                      onClick={() => toggleFaq(index)}
                      className="flex justify-between items-center w-full text-left"
                    >
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {faq.question}
                      </h3>
                      {openFaqs.includes(index) ? (
                        <ChevronUp className="h-5 w-5 text-primary" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-primary" />
                      )}
                    </button>
                    
                    {openFaqs.includes(index) && (
                      <div className="mt-2">
                        <p className="text-gray-600 dark:text-gray-300">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Contact Support */}
      <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 mt-8 text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Can't find what you're looking for?
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Our customer support team is here to help with any questions you may have.
        </p>
        <a
          href="/contact"
          className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-magenta-600 transition-colors"
        >
          Contact Support
        </a>
      </div>
    </section>
  );
}
