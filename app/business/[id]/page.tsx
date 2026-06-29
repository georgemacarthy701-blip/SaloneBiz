'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getBusiness, getReviews, createReview } from '@/lib/api';
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header with Cover Image */}
      <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden mb-8">
        <img
          src={business.cover_image || 'https://images.unsplash.com/photo-1495195134817-aeb325a55b65?w=800'}
          alt={business.name}
          className="w-full h-full object-cover"
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
      {business.video_url && (
        <div className="mb-8">
          <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%' }}>
            <video
              src={business.video_url}
              controls
              className="absolute inset-0 w-full h-full"
              poster={business.cover_image}
            />
          </div>
          <p className="text-center text-gray-600 text-sm mt-2">Professional service showcase</p>
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
          {(business.starting_price || business.maximum_price) && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">💰 Pricing</h3>
              <div className="space-y-2">
                {business.starting_price && (
                  <p className="text-gray-700">
                    Starting: <span className="font-bold">Le {business.starting_price.toLocaleString()}</span>
                  </p>
                )}
                {business.maximum_price && (
                  <p className="text-gray-700">
                    Up to: <span className="font-bold">Le {business.maximum_price.toLocaleString()}</span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
