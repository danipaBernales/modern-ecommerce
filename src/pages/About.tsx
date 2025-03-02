import { Users, Award, ShieldCheck, Truck } from 'lucide-react';

export default function About() {
  return (
    <section className="container py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        About ModernShop
      </h1>
      
      {/* Hero Section */}
      <div className="relative mb-12">
        <img 
          src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
          alt="ModernShop Team" 
          className="w-full h-64 md:h-96 object-cover rounded-lg"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/60 to-secondary/60 rounded-lg"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white p-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Our Story</h2>
            <p className="text-lg md:text-xl max-w-2xl">
              Bringing quality products and exceptional shopping experiences since 2020.
            </p>
          </div>
        </div>
      </div>
      
      {/* Our Mission */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Our Mission
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          At ModernShop, our mission is to provide customers with high-quality products that enhance their everyday lives. We believe in creating a shopping experience that is seamless, enjoyable, and trustworthy.
        </p>
        <p className="text-gray-600 dark:text-gray-300">
          We're committed to sourcing products that meet our strict quality standards, offering exceptional customer service, and continuously improving our platform to meet the evolving needs of our customers.
        </p>
      </div>
      
      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <Users className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Customer First
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            We prioritize the needs of our customers and feedback in everything we do, ensuring their satisfaction is our top priority.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <Award className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Quality Excellence
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            We never compromise on quality, carefully selecting products that meet our high standards for durability and performance.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <ShieldCheck className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Trust & Transparency
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            We build trust through honest communication, transparent policies, and reliable service that customers can depend on.
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <Truck className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Reliable Service
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            We deliver on our promises with fast shipping, responsive customer support, and hassle-free returns.
          </p>
        </div>
      </div>
      
      {/* Our Team */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Our Team
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center">
            <img 
              src="https://randomuser.me/api/portraits/women/32.jpg" 
              alt="Sarah Johnson" 
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Clara Clark
            </h3>
            <p className="text-primary font-medium">Founder & CEO</p>
            <p className="text-gray-600 dark:text-gray-300 text-center mt-2">
              With over 15 years in retail, Sarah founded ModernShop with a vision to revolutionize online shopping.
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <img 
              src="https://randomuser.me/api/portraits/men/46.jpg" 
              alt="Michael Chen" 
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Michael Mann
            </h3>
            <p className="text-primary font-medium">CTO</p>
            <p className="text-gray-600 dark:text-gray-300 text-center mt-2">
              Michael leads our technology team, ensuring a seamless and secure shopping experience for all customers.
            </p>
          </div>
          
          <div className="flex flex-col items-center">
            <img 
              src="https://randomuser.me/api/portraits/women/65.jpg" 
              alt="Emma Rodriguez" 
              className="w-32 h-32 rounded-full object-cover mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Rara Rodriguez
            </h3>
            <p className="text-primary font-medium">Head of Customer Experience</p>
            <p className="text-gray-600 dark:text-gray-300 text-center mt-2">
              Emma ensures that every customer interaction with ModernShop exceeds expectations.
            </p>
          </div>
        </div>
      </div>
      
      {/* Our Journey */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Our Journey
        </h2>
        
        <div className="space-y-8">
          <div className="flex">
            <div className="flex-shrink-0 w-24 text-right pr-6">
              <span className="text-primary font-semibold">2020</span>
            </div>
            <div className="border-l-2 border-primary pl-6 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Founded
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                ModernShop was founded with a mission to provide quality products with exceptional service.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-24 text-right pr-6">
              <span className="text-primary font-semibold">2021</span>
            </div>
            <div className="border-l-2 border-primary pl-6 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Expansion
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Expanded our product catalog to include electronics, fashion, and home decor.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-24 text-right pr-6">
              <span className="text-primary font-semibold">2023</span>
            </div>
            <div className="border-l-2 border-primary pl-6 pb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                International Launch
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Began shipping to international customers, reaching over 50 countries worldwide.
              </p>
            </div>
          </div>
          
          <div className="flex">
            <div className="flex-shrink-0 w-24 text-right pr-6">
              <span className="text-primary font-semibold">2025</span>
            </div>
            <div className="border-l-2 border-primary pl-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Today
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Continuing to grow and innovate, with a focus on sustainability and customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
