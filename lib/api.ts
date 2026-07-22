import { createClient } from '@/lib/supabase';
import type { Business, Review } from '@/types';

const supabase = createClient();

// Businesses
export async function getBusinesses(category?: string) {
  let query = supabase
    .from('businesses')
    .select(`
      *,
      business_gallery(image_url),
      reviews(id)
    `)
    .eq('status', 'active')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data as any[];
}

export async function getBusiness(id: string) {
  const { data, error } = await supabase
    .from('businesses')
    .select(`
      *,
      business_gallery(image_url),
      reviews(*, users(email))
    `)
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function createBusiness(business: Omit<Business, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data, error } = await supabase
    .from('businesses')
    .insert([
      {
        name: business.name,
        category: business.category,
        logo: business.logo,
        location: business.location,
        address: business.address,
        phone: business.phone,
        email: business.email,
        website: business.website || null,
        description: business.description,
        short_description: business.shortDescription || null,
        starting_price: business.startingPrice || null,
        maximum_price: business.maximumPrice || null,
        price_range_label: business.priceRangeLabel || null,
        price_range_key: business.priceRangeKey || null,
        featured: business.featured,
        status: business.status,
        hours: business.hours,
        cover_image: business.cover,
        owner_id: business.ownerId,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Reviews
export async function getReviews(businessId: string) {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      users(email)
    `)
    .eq('business_id', businessId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
}

export async function createReview(
  businessId: string,
  userId: string,
  rating: number,
  comment: string
) {
  const { data, error } = await supabase
    .from('reviews')
    .insert([
      {
        business_id: businessId,
        user_id: userId,
        rating,
        comment: comment || null,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// Categories
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) throw new Error(error.message);
  return data;
}

export function parseMedia(coverImage: string) {
  if (coverImage && coverImage.trim().startsWith('{')) {
    try {
      const parsed = JSON.parse(coverImage);
      return {
        productImage: parsed.productImage || '',
        videoUrl: parsed.videoUrl || ''
      };
    } catch (e) {
      // fallback
    }
  }
  return {
    productImage: coverImage || '',
    videoUrl: ''
  };
}
