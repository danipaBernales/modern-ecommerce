# ModernShop - E-commerce Platform

![ModernShop Banner](https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)

## Overview

ModernShop is a modern, feature-rich e-commerce platform built with React, TypeScript, and Supabase. It offers a seamless shopping experience with a clean, responsive design and robust functionality.

🚀 **Live Demo**: [ModernShop on Netlify](https://glittering-chimera-302e26.netlify.app)

## Features

- **User Authentication**: Secure sign-up and login with username customization
- **Product Browsing**: Browse products by category with filtering and sorting options
- **Product Details**: Detailed product pages with image galleries, specifications, and reviews
- **Shopping Cart**: Add, update, and remove items from your cart
- **User Profiles**: Manage your personal information and track orders
- **Responsive Design**: Fully responsive layout that works on all devices
- **Dark Mode**: Toggle between light and dark themes
- **Order Management**: Track your orders and view order history
- **Newsletter Subscription**: Stay updated with the latest products and offers

## Tech Stack

- **Frontend**:
  - React 18
  - TypeScript
  - React Router for navigation
  - Zustand for state management
  - Tailwind CSS for styling
  - Lucide React for icons

- **Backend**:
  - Supabase for authentication, database, and storage
  - PostgreSQL database with Row Level Security

- **Deployment**:
  - Netlify for hosting

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/danipabernales/modern-ecommerce.git
   cd modern-ecommerce
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.

## Project Structure

```
/src
  /components      # Reusable UI components
  /lib             # Utility functions and libraries
  /pages           # Page components
  /store           # Zustand store definitions
  /types           # TypeScript type definitions
  App.tsx          # Main application component
  main.tsx         # Application entry point
/supabase
  /migrations      # Database migrations
  /consolidated    # Consolidated migration for new environments
/docs
  DATABASE_SCHEMA.md  # Database schema documentation
  MIGRATION_GUIDE.md  # Guide for managing migrations
  MIGRATION_ISSUE.md  # Documentation of migration issues
/scripts
  check-migrations.js # Script to check for migration issues
  deploy.js           # Script to deploy to Netlify
```

## Database Schema

The application uses the following main tables:
- `profiles`: User profile information
- `products`: Product details
- `categories`: Product categories
- `product_images`: Product image galleries
- `reviews`: Product reviews
- `orders`: Order information
- `order_items`: Items within orders

For detailed schema information, see [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md).

## Migration Management

This project uses Supabase migrations to manage the database schema. For information on how to work with migrations, see [MIGRATION_GUIDE.md](docs/MIGRATION_GUIDE.md).

If you're setting up a new environment, you can use the consolidated migration in `supabase/migrations/consolidated/baseline.sql`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

For more details, see [CONTRIBUTING.md](.github/CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)
- [Supabase](https://supabase.io/)
- [Vite](https://vitejs.dev/)
- [Lucide Icons](https://lucide.dev/)
- [Unsplash](https://unsplash.com/) for the product imagess