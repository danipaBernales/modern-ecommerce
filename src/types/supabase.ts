export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  stock: number;
  created_at: string;
  category_id?: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export type User = {
  id: string;
  email: string;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at?: string;
};

export type Review = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  total_price: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
};

export type ProductImage = {
  id: string;
  product_id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
};

export type ProductDetails = Product & {
  category_name: string;
  category_description?: string;
  category_image_url?: string;
  images?: ProductImage[];
};
