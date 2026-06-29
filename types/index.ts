export type Category =
  | 'restaurants'
  | 'retail'
  | 'health'
  | 'hotels'
  | 'technology'
  | 'automotive'
  | 'education'
  | 'finance'
  | 'construction'
  | 'beauty'
  | 'agriculture'
  | 'transport';

export interface Business {
  id: string;
  name: string;
  category: Category;
  categoryLabel: string;
  logo: string;
  rating: number;
  reviews: number;
  location: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  shortDescription?: string;
  startingPrice?: number;
  maximumPrice?: number;
  priceRangeLabel?: string;
  priceRangeKey?: 'low' | 'medium' | 'high';
  featured: boolean;
  status: 'active' | 'inactive';
  hours: string;
  gallery: string[];
  cover: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  role: 'user' | 'business_owner' | 'admin';
  createdAt: string;
}

export interface Review {
  id: string;
  businessId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
