'use client';

import { useEffect, useState } from 'react';
import { BusinessCard } from '@/components/BusinessCard';
import { getBusinesses } from '@/lib/api';
// Using emoji icons

const CATEGORIES = [
  { id: 'all', name: 'All Categories' },
  { id: 'restaurants', name: 'Restaurants & Food' },
  { id: 'retail', name: 'Retail & Shopping' },
  { id: 'health', name: 'Health & Wellness' },
  { id: 'hotels', name: 'Hotels & Hospitality' },
  { id: 'technology', name: 'Technology & IT' },
  { id: 'automotive', name: 'Automotive' },
  { id: 'education', name: 'Education & Training' },
  { id: 'finance', name: 'Finance & Banking' },
  { id: 'construction', name: 'Construction & Real Estate' },
  { id: 'beauty', name: 'Beauty & Personal Care' },
  { id: 'agriculture', name: 'Agriculture & Farming' },
  { id: 'transport', name: 'Transport & Logistics' },
];

const DEMO_BUSINESSES = [
  {
    id: '1',
    name: 'Prime Hospitality Group',
    category: 'hospitality',
    logo: '🏨',
    location: 'Metropolitan District',
    description: 'Full-service hospitality solutions for enterprises. Premium accommodations with world-class amenities and dedicated business services.',
    cover_image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800',
    rating: 4.8,
    review_count: 127,
    featured: true,
    starting_price: 500,
    maximum_price: 1200,
  },
  {
    id: '2',
    name: 'CloudTech Solutions',
    category: 'technology',
    logo: '💻',
    location: 'Technology Park',
    description: 'Enterprise software development and cloud infrastructure. Specializing in scalable solutions for Fortune 500 companies.',
    cover_image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
    rating: 4.9,
    review_count: 89,
    featured: true,
    starting_price: 2500,
    maximum_price: 50000,
  },
  {
    id: '3',
    name: 'Elite Healthcare Providers',
    category: 'healthcare',
    logo: '🏥',
    location: 'Medical District',
    description: 'Comprehensive healthcare services with state-of-the-art facilities. ISO certified with 24/7 emergency care.',
    cover_image: 'https://images.unsplash.com/photo-1576091160399-1112991f51d1?w=800',
    rating: 4.7,
    review_count: 156,
    featured: false,
    starting_price: 150,
    maximum_price: 5000,
  },
];

export default function ListingsPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const loadBusinesses = async () => {
      try {
        setLoading(true);
        const data = await getBusinesses();
        setBusinesses(data);
        setFilteredBusinesses(data);
        setIsDemoMode(false);
      } catch (err) {
        setBusinesses(DEMO_BUSINESSES);
        setFilteredBusinesses(DEMO_BUSINESSES);
        setIsDemoMode(true);
        console.log('Using demo data - Supabase not connected');
      } finally {
        setLoading(false);
      }
    };

    loadBusinesses();
  }, []);

  useEffect(() => {
    let filtered = businesses;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((b) => b.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (b) =>
          b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          b.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBusinesses(filtered);
  }, [selectedCategory, searchTerm, businesses]);

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-bold mb-3">Professional Services Marketplace</h1>
          <p className="text-lg text-blue-100">Discover verified service providers across all industries</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Advanced Search and Filter */}
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 mb-8">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, location, or service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 font-medium placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">Service Categories</label>
              <div className="flex items-center space-x-2 overflow-x-auto pb-3">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
                      selectedCategory === cat.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Demo Mode Notice */}
          {isDemoMode && !loading && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-amber-900 font-semibold mb-1">Demo Mode</p>
              <p className="text-sm text-amber-800">Showcasing sample professionals. Connect Supabase to display your verified service providers.</p>
            </div>
          )}

          {/* Results */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading businesses...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <p className="text-red-800">{error}</p>
            </div>
          ) : filteredBusinesses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No businesses found matching your criteria.</p>
            </div>
          ) : (
            <div>
              <p className="text-gray-600 mb-6">
                Showing {filteredBusinesses.length} business{filteredBusinesses.length !== 1 ? 'es' : ''}
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBusinesses.map((business) => (
                  <BusinessCard
                    key={business.id}
                    id={business.id}
                    name={business.name}
                    category={business.category_label || business.category}
                    logo={business.logo}
                    rating={business.rating}
                    reviews={business.review_count || 0}
                    location={business.location}
                    cover={business.cover_image || business.cover}
                    featured={business.featured}
                    startingPrice={business.starting_price}
                    maximumPrice={business.maximum_price}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
