import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Fashion Enthusiast',
    content: 'ModernShop has completely transformed my online shopping experience. The quality of products and the speed of delivery are unmatched!',
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/women/32.jpg'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Tech Reviewer',
    content: "I've purchased several electronics from ModernShop and have been impressed every time. Their customer service is exceptional.",
    rating: 5,
    avatar: 'https://randomuser.me/api/portraits/men/46.jpg'
  },
  {
    id: 3,
    name: 'Emma Rodriguez',
    role: 'Interior Designer',
    content: 'The home decor selection is curated perfectly. I always find unique pieces that my clients love. Highly recommended!',
    rating: 4,
    avatar: 'https://randomuser.me/api/portraits/women/65.jpg'
  }
];

export default function Testimonials() {
  return (
    <section className="py-12 mt-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          What our customers say
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border-t-4 border-primary"
            >
              <div className="flex items-center mb-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {testimonial.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 italic">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
