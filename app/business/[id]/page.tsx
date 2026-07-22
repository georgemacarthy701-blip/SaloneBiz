'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getBusiness, getReviews, createReview, parseMedia } from '@/lib/api';
import { createClient } from '@/lib/supabase';

export default function BusinessPage() {
  const params = useParams();
  const id = params?.id as string;
  const [business, setBusiness] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    const loadBusiness = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await getBusiness(id);
        setBusiness(data);

        const reviewsData = await getReviews(id);
        setReviews(reviewsData || []);
      } catch (err: any) {
        setError('Database not connected. Please configure Supabase in .env.local');
      } finally {
        setLoading(false);
      }
    };

    loadBusiness();
  }, [id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to leave a review');
      return;
    }

    try {
      setSubmitting(true);
      await createReview(id, user.id, rating, comment);
      setComment('');
      setRating(5);

      const updatedReviews = await getReviews(id);
      setReviews(updatedReviews || []);
    } catch (err: any) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">⌛ Loading...</div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center text-red-600">
          {error || 'Business not found'}
        </div>
      </div>
    );
  }

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  const whatsappNum = business.phone;

  const getWhatsAppLink = (num: string) => {
    if (!num) return '';
    // Format number: remove all non-digit characters
    let cleaned = num.replace(/[+\s\-()]/g, '');
    // Handle leading zero for Sierra Leone
    if (cleaned.startsWith('0')) {
      cleaned = '232' + cleaned.slice(1);
    }
    // Prepend 232 if it's 8 or 9 digits and doesn't start with 232
    if (cleaned.length === 8) {
      cleaned = '232' + cleaned;
    } else if (cleaned.length === 9 && !cleaned.startsWith('232')) {
      cleaned = '232' + cleaned;
    }
    return `https://wa.me/${cleaned}?text=Hi,%20I%20found%20your%20business%20on%20SaloneBiz!`;
  };

  const whatsappLink = whatsappNum ? getWhatsAppLink(whatsappNum) : '';

  const { productImage, videoUrl } = parseMedia(business.cover_image);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header with Product Image */}
      <div className="relative h-[300px] md:h-[500px] max-h-[500px] bg-gray-950 rounded-lg overflow-hidden mb-8">
        <img
          src={productImage || 'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=800'}
          alt={business.name}
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
          <div className="flex items-end space-x-4">
            <div className="text-7xl">{business.logo || '🏢'}</div>
            <div className="text-white">
              <h1 className="text-4xl font-bold">{business.name}</h1>
              <p className="text-blue-200">{business.category}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      {videoUrl && (
        <div className="mb-8">
          <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%' }}>
            <video
              src={videoUrl}
              controls
              className="absolute inset-0 w-full h-full object-contain"
              poster={productImage}
            />
          </div>
          <p className="text-center text-gray-600 text-sm mt-2 font-medium">Promotional service showcase</p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {/* Rating and Stats */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Client Reviews</h2>
                <p className="text-gray-500 mt-1">Real feedback from verified clients</p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold text-blue-600">{avgRating}</div>
                <div className="flex items-center justify-end space-x-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-2xl">
                      {i < Math.round(parseFloat(avgRating as string)) ? '⭐' : '☆'}
                    </span>
                  ))}
                </div>
                <p className="text-gray-600 text-sm mt-2">{reviews.length} verified {reviews.length === 1 ? 'review' : 'reviews'}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
            <p className="text-gray-700 leading-relaxed">{business.description}</p>
          </div>

          {/* Reviews */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

            {user ? (
              <form onSubmit={handleSubmitReview} className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Rating
                    </label>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="text-3xl focus:outline-none"
                        >
                          {star <= rating ? '⭐' : '☆'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Review
                    </label>
                    <textarea
                      id="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Share your experience..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
                  >
                    {submitting ? '⌛ Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-blue-900">
                  <a href="/login" className="font-bold hover:underline">
                    Log in
                  </a>{' '}
                  to leave a review
                </p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-gray-600">No reviews yet. Be the first to review!</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-gray-900">{review.users?.email || 'Anonymous'}</p>
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-lg">
                              {i < review.rating ? '⭐' : '☆'}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-gray-700">{review.comment || '(No comment)'}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-600 text-sm">📍 Location</p>
                <p className="font-semibold text-gray-900">{business.location}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">📬 Address</p>
                <p className="font-semibold text-gray-900">{business.address}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">📞 Phone</p>
                <a
                  href={`tel:${business.phone}`}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  {business.phone}
                </a>
              </div>
              <div>
                <p className="text-gray-600 text-sm">📧 Email</p>
                <a
                  href={`mailto:${business.email}`}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  {business.email}
                </a>
              </div>
              {business.website && (
                <div>
                  <p className="text-gray-600 text-sm">🌐 Website</p>
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Visit Website
                  </a>
                </div>
              )}
              {whatsappLink && (
                <div className="pt-4 border-t border-gray-100 mt-4">
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center space-x-2 bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      className="w-5 h-5 fill-current"
                    >
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                    </svg>
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Hours */}
          {business.hours && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-2">🕐 Hours</h3>
              <p className="text-gray-700">{business.hours}</p>
            </div>
          )}

          {/* Pricing */}
          {business.starting_price && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">💰 Pricing</h3>
              <p className="text-gray-700">
                Starting at <span className="font-bold">LE {business.starting_price.toLocaleString()}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
