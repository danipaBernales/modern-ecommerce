/*
  # Add more products

  1. New Data
    - Add 7 more products to the products table
    - Includes products across different categories
  2. Changes
    - No schema changes, only data insertion
*/

-- Insert additional products
INSERT INTO products (name, description, price, image_url, category, stock) VALUES
('Smart Watch Pro', 'Track your fitness and stay connected with this premium smartwatch featuring heart rate monitoring, GPS, and water resistance.', 199.99, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12', 'Electronics', 35),
('Ergonomic Office Chair', 'Comfortable ergonomic chair with lumbar support, adjustable height, and breathable mesh back for long work sessions.', 249.99, 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8', 'Home & Office', 20),
('Bluetooth Speaker', 'Portable waterproof speaker with 20-hour battery life and immersive 360° sound for indoor and outdoor use.', 89.99, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1', 'Electronics', 45),
('Minimalist Desk Organizer', 'Keep your workspace tidy with this sleek wooden desk organizer featuring compartments for stationery and devices.', 39.99, 'https://images.unsplash.com/photo-1544816155-12df9643f363', 'Home & Office', 60),
('Leather Laptop Sleeve', 'Premium handcrafted leather sleeve that protects your laptop in style with soft microfiber interior.', 59.99, 'https://images.unsplash.com/photo-1603899122634-f086ca5f5ddd', 'Accessories', 40),
('Wireless Charging Pad', 'Fast-charging wireless pad compatible with all Qi-enabled devices, featuring LED indicators and non-slip surface.', 34.99, 'https://images.unsplash.com/photo-1586953208448-b95a79798f07', 'Electronics', 55),
('Stainless Steel Water Bottle', 'Double-walled insulated bottle that keeps drinks cold for 24 hours or hot for 12 hours with leak-proof design.', 29.99, 'https://images.unsplash.com/photo-1602143407151-7111542de6e8', 'Accessories', 70);