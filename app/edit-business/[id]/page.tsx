'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { MediaUpload } from '@/components/MediaUpload';
import Link from 'next/link';
import { parseMedia } from '@/lib/api';

const CATEGORIES = [
  'restaurants',
  'retail',
  'health',
  'hotels',
  'technology',
  'automotive',
  'education',
  'finance',
  'construction',
  'beauty',
  'agriculture',
  'transport',
];

export default function EditBusinessPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'restaurants',
    logo: '🏢',
    location: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    shortDescription: '',
    hours: '',
    cover: 'https://res.cloudinary.com/dmtx1pah1/image/upload/v1/placeholder',
    videoUrl: '',
    startingPrice: '',
  });

  useEffect(() => {
    const supabase = createClient();

    const checkAuthAndLoadBusiness = async () => {
      if (!supabase) {
        setError('Database not connected. Please configure Supabase in .env.local');
        setPageLoading(false);
        return;
      }

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push('/login');
          return;
        }

        setUser(session.user);

        if (!id) return;

        // Load business details
        const { data: business, error: loadError } = await supabase
          .from('businesses')
          .select('*')
          .eq('id', id)
          .single();

        if (loadError || !business) {
          setError('Business listing not found.');
          setPageLoading(false);
          return;
        }

        // Verify ownership (allow owner or admin)
        // Get user role if we want to allow admins, but simple owner_id check is safe
        if (business.owner_id !== session.user.id) {
          setError('You do not have permission to edit this business listing.');
          setPageLoading(false);
          return;
        }

        // Parse media config
        const { productImage, videoUrl } = parseMedia(business.cover_image);

        // Populate formData
        setFormData({
          name: business.name || '',
          category: business.category || 'restaurants',
          logo: business.logo || '🏢',
          location: business.location || '',
          address: business.address || '',
          phone: business.phone || '',
          email: business.email || '',
          website: business.website || '',
          description: business.description || '',
          shortDescription: business.short_description || '',
          hours: business.hours || '',
          cover: productImage || 'https://res.cloudinary.com/dmtx1pah1/image/upload/v1/placeholder',
          videoUrl: videoUrl || '',
          startingPrice: business.starting_price !== null && business.starting_price !== undefined ? String(business.starting_price) : '',
        });

        setPageLoading(false);
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading the listing');
        setPageLoading(false);
      }
    };

    checkAuthAndLoadBusiness();
  }, [router, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!user) {
        setError('Not authenticated');
        return;
      }

      // Validate prices
      const startPrice = formData.startingPrice ? parseFloat(formData.startingPrice) : null;

      const supabase = createClient();

      if (!supabase) {
        setError('Database not connected. Please configure Supabase in .env.local');
        return;
      }

      const { error: updateError } = await supabase
        .from('businesses')
        .update({
          name: formData.name,
          category: formData.category,
          logo: formData.logo,
          location: formData.location,
          address: formData.address,
          phone: formData.phone,
          email: formData.email,
          website: formData.website || null,
          description: formData.description,
          short_description: formData.shortDescription || null,
          hours: formData.hours,
          cover_image: JSON.stringify({
            productImage: formData.cover,
            videoUrl: formData.videoUrl,
          }),
          starting_price: startPrice,
          maximum_price: null,
          verification_status: 'pending', // Re-verify updated listings
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (updateError) throw updateError;

      alert('Business listing updated successfully! ✓\n\nYour changes are pending admin approval. Our team will review them within 24-48 hours.');
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to update business');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Service Profile</h1>
          <p className="text-gray-600">Update your professional presence on SaloneBiz</p>
        </div>
        <Link href="/dashboard" className="text-blue-600 hover:underline font-semibold flex items-center space-x-1">
          <span>←</span> <span>Back to Dashboard</span>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800 font-semibold mb-1">Error</p>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Only show form if no authorization/loading errors */}
      {!error && (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          {/* Service Information */}
          <div className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-bold text-gray-900">Service Information</h2>
              <p className="text-sm text-gray-500 mt-1">Tell us about your professional services</p>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                Service Provider Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium placeholder:text-gray-400"
                placeholder="e.g., Premium Consulting Group"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium placeholder:text-gray-400 resize-none"
                placeholder="Describe your business..."
              />
            </div>

            <div>
              <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Short Description
              </label>
              <input
                id="shortDescription"
                name="shortDescription"
                type="text"
                value={formData.shortDescription}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium placeholder:text-gray-400"
                placeholder="One-line summary"
              />
            </div>
          </div>

          {/* Contact & Location */}
          <div className="space-y-6 border-t pt-6">
            <div className="border-b pb-4">
              <h2 className="text-xl font-bold text-gray-900">Contact & Location</h2>
              <p className="text-sm text-gray-500 mt-1">How clients can reach you</p>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location / City *
              </label>
              <input
                id="location"
                name="location"
                type="text"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium placeholder:text-gray-400"
                placeholder="e.g., Freetown"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Full Address *
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium placeholder:text-gray-400"
                placeholder="Street address"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium placeholder:text-gray-400"
                  placeholder="+232 76 123 456"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium placeholder:text-gray-400"
                  placeholder="info@business.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                Website (Optional)
              </label>
              <input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium placeholder:text-gray-400"
                placeholder="www.example.com"
              />
            </div>

            <div>
              <label htmlFor="hours" className="block text-sm font-medium text-gray-700 mb-1">
                Business Hours *
              </label>
              <select
                id="hours"
                name="hours"
                required
                value={formData.hours}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium"
              >
                <option value="">Select business hours</option>
                <option value="Mon-Fri: 9:00 AM - 5:00 PM">Mon-Fri: 9:00 AM - 5:00 PM</option>
                <option value="Mon-Fri: 8:00 AM - 6:00 PM">Mon-Fri: 8:00 AM - 6:00 PM</option>
                <option value="Mon-Fri: 10:00 AM - 6:00 PM">Mon-Fri: 10:00 AM - 6:00 PM</option>
                <option value="Mon-Sun: 9:00 AM - 5:00 PM">Mon-Sun: 9:00 AM - 5:00 PM</option>
                <option value="Mon-Sun: 8:00 AM - 8:00 PM">Mon-Sun: 8:00 AM - 8:00 PM</option>
                <option value="Mon-Sun: 24/7">Mon-Sun: 24/7</option>
                <option value="Mon-Sat: 9:00 AM - 5:00 PM">Mon-Sat: 9:00 AM - 5:00 PM</option>
                <option value="Tue-Sun: 9:00 AM - 5:00 PM (Closed Mondays)">Tue-Sun: 9:00 AM - 5:00 PM (Closed Mondays)</option>
              </select>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-bold text-gray-900">Pricing (Optional)</h2>

            <div>
              <label htmlFor="startingPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Starting Price (Optional)
              </label>
              <input
                id="startingPrice"
                name="startingPrice"
                type="number"
                value={formData.startingPrice}
                onChange={handleChange}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium placeholder:text-gray-400"
                placeholder="e.g., 5000"
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank if pricing varies or is negotiated directly.</p>
            </div>
          </div>

          {/* Media */}
          <div className="space-y-8 border-t pt-6">
            <div>
              <div className="border-b pb-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900">Media Gallery</h2>
                <p className="text-sm text-gray-500 mt-1">Upload one product image and an optional promotional video</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <MediaUpload
                  label="Product Image"
                  placeholder="Product or service photo (JPG, PNG)"
                  acceptedTypes="image"
                  onUpload={(url) => setFormData({ ...formData, cover: url })}
                  initialUrl={formData.cover}
                />
                <MediaUpload
                  label="Promotional Video (Optional)"
                  placeholder="Service showcase or testimonial (MP4, WebM)"
                  acceptedTypes="video"
                  onUpload={(url) => setFormData({ ...formData, videoUrl: url })}
                  initialUrl={formData.videoUrl}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 border-t pt-6">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
            <Link
              href="/dashboard"
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
