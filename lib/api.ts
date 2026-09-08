import { createClient } from '@/lib/supabase';
import type { Business, Review } from '@/types';

const supabase = createClient();

export interface GetBusinessesParams {
  category?: string;
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface GetBusinessesResponse {
  businesses: any[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasMore: boolean;
}

export function optimizeImageUrl(url: string, width: number = 400): string {
  if (!url || typeof url !== 'string') return url;

  // Cloudinary image transformation: inject dynamic compression and resizing
  if (url.includes('res.cloudinary.com')) {
    if (url.includes('/f_auto,q_auto')) return url;
    return url.replace(
      /\/image\/upload\/(?:v\d+\/)?/,
      (match) => match.replace('/image/upload/', `/image/upload/f_auto,q_auto,w_${width},c_limit/`)
    );
  }

  // Unsplash image optimization
  if (url.includes('images.unsplash.com')) {
    try {
      const parsedUrl = new URL(url);
      parsedUrl.searchParams.set('w', width.toString());
      parsedUrl.searchParams.set('q', '80');
      parsedUrl.searchParams.set('auto', 'format');
      return parsedUrl.toString();
    } catch {
      return url;
    }
  }

  return url;
}

// Businesses
export async function getBusinesses(
  paramsOrCategory?: string | GetBusinessesParams
): Promise<GetBusinessesResponse> {
  const params: GetBusinessesParams =
    typeof paramsOrCategory === 'string'
      ? { category: paramsOrCategory }
      : paramsOrCategory || {};

  const { category, page = 1, pageSize = 12, search } = params;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('businesses')
    .select(
      `
      id,
      name,
      category,
      logo,
      rating,
      review_count,
      location,
      cover_image,
      featured,
      starting_price,
      maximum_price
    `,
      { count: 'exact' }
    )
    .eq('status', 'active')
    .order('featured', { ascending: false })
    .order('created_at', { ascending: false });

  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  if (search && search.trim()) {
    query = query.or(
      `name.ilike.%${search.trim()}%,location.ilike.%${search.trim()}%,description.ilike.%${search.trim()}%`
    );
  }

  query = query.range(from, to);

  const { data, count, error } = await query;
  if (error) throw new Error(error.message);

  const totalCount = count ?? (data?.length || 0);
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return {
    businesses: data || [],
    totalCount,
    page,
    pageSize,
    totalPages,
    hasMore: page < totalPages,
  };
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

export async function deleteBusinessAsAdmin(businessId: string) {
  if (!businessId) throw new Error('Business ID is required');

  try {
    const sessionRes = await supabase.auth.getSession();
    const token = sessionRes?.data?.session?.access_token;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`/api/admin/businesses/${businessId}`, {
      method: 'DELETE',
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.error || `Failed to delete listing (${res.status})`);
    }

    return data;
  } catch (err: any) {
    // Direct client fallback
    const { error: sbError } = await supabase
      .from('businesses')
      .delete()
      .eq('id', businessId);

    if (sbError) {
      throw new Error(err?.message || sbError.message);
    }

    return { success: true, message: 'Deleted successfully' };
  }
}
