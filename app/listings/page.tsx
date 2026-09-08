'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { BusinessCard } from '@/components/BusinessCard';
import { BusinessSkeleton } from '@/components/BusinessSkeleton';
import { DeleteConfirmationModal } from '@/components/DeleteConfirmationModal';
import { getBusinesses, deleteBusinessAsAdmin } from '@/lib/api';
import { createClient } from '@/lib/supabase';

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
    category: 'hotels',
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
    category: 'health',
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

const PAGE_SIZE = 12;

interface CachedResult {
  businesses: any[];
  totalCount: number;
  totalPages: number;
}

export default function ListingsPage() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Admin authorization state
  const [isAdmin, setIsAdmin] = useState(false);

  // Delete modal & action states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [businessToDelete, setBusinessToDelete] = useState<{ id: string; name: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // In-memory client-side cache for instant 0ms category switching
  const cacheRef = useRef<Map<string, CachedResult>>(new Map());

  // Check user role on mount and auth changes
  useEffect(() => {
    const supabase = createClient();
    if (!supabase) return;

    const checkAdminRole = async (userId: string) => {
      try {
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', userId)
          .single();
        setIsAdmin(profile?.role === 'admin');
      } catch {
        setIsAdmin(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }: any) => {
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription?.unsubscribe();
  }, []);

  // Debounce search input to minimize queries
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Main data loader function with caching
  const fetchCategoryBusinesses = useCallback(
    async (category: string, page: number, search: string) => {
      const cacheKey = `${category}_${page}_${search.trim().toLowerCase()}`;

      // 1. Check instant in-memory cache
      if (cacheRef.current.has(cacheKey)) {
        const cached = cacheRef.current.get(cacheKey)!;
        setBusinesses(cached.businesses);
        setTotalCount(cached.totalCount);
        setTotalPages(cached.totalPages);
        setLoading(false);
        setError(null);
        return;
      }

      // 2. Fetch from backend API
      try {
        setLoading(true);
        setError(null);

        const response = await getBusinesses({
          category: category !== 'all' ? category : undefined,
          page,
          pageSize: PAGE_SIZE,
          search: search.trim() || undefined,
        });

        // Store result in client-side cache
        const result: CachedResult = {
          businesses: response.businesses,
          totalCount: response.totalCount,
          totalPages: response.totalPages,
        };
        cacheRef.current.set(cacheKey, result);

        setBusinesses(response.businesses);
        setTotalCount(response.totalCount);
        setTotalPages(response.totalPages);
        setIsDemoMode(false);
      } catch (err: any) {
        console.warn('Backend fetch fallback to demo records:', err?.message);
        let filtered = DEMO_BUSINESSES;
        if (category !== 'all') {
          filtered = filtered.filter((b) => b.category === category);
        }
        if (search.trim()) {
          const q = search.trim().toLowerCase();
          filtered = filtered.filter(
            (b) =>
              b.name.toLowerCase().includes(q) ||
              b.location.toLowerCase().includes(q) ||
              b.description.toLowerCase().includes(q)
          );
        }
        const demoTotal = filtered.length;
        const demoPages = Math.max(1, Math.ceil(demoTotal / PAGE_SIZE));
        const pagedDemo = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

        setBusinesses(pagedDemo);
        setTotalCount(demoTotal);
        setTotalPages(demoPages);
        setIsDemoMode(true);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Trigger fetch when category, page, or debounced search changes
  useEffect(() => {
    fetchCategoryBusinesses(selectedCategory, currentPage, debouncedSearch);
  }, [selectedCategory, currentPage, debouncedSearch, fetchCategoryBusinesses]);

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === selectedCategory) return;
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  // Open delete confirmation modal
  const handleOpenDelete = (id: string, name: string) => {
    setBusinessToDelete({ id, name });
    setDeleteModalOpen(true);
  };

  // Execute deletion with optimistic UI update and cache invalidation
  const handleConfirmDelete = async () => {
    if (!businessToDelete) return;
    const target = businessToDelete;
    setDeleteLoading(true);

    // Optimistic UI update: remove item immediately from current list
    const previousBusinesses = [...businesses];
    setBusinesses((prev) => prev.filter((b) => b.id !== target.id));
    setTotalCount((prev) => Math.max(0, prev - 1));

    // Clear in-memory cache so deleted business never reappears on category tabs
    cacheRef.current.clear();

    try {
      await deleteBusinessAsAdmin(target.id);
      setDeleteModalOpen(false);
      setBusinessToDelete(null);
      setToastMessage({
        text: `Listing "${target.name}" was permanently deleted.`,
        type: 'success',
      });
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      console.error('Delete failed:', err);
      // Revert optimistic update on failure
      setBusinesses(previousBusinesses);
      setTotalCount((prev) => prev + 1);
      setToastMessage({
        text: err?.message || 'Failed to delete listing. Please try again.',
        type: 'error',
      });
      setTimeout(() => setToastMessage(null), 5000);
    } finally {
      setDeleteLoading(false);
    }
  };

  const fromItem = totalCount > 0 ? (currentPage - 1) * PAGE_SIZE + 1 : 0;
  const toItem = Math.min(currentPage * PAGE_SIZE, totalCount);

  return (
    <div>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-semibold transition-all duration-300 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-900/20'
              : 'bg-red-600 text-white border-red-500 shadow-red-900/20'
          }`}
        >
          <span className="text-base">{toastMessage.type === 'success' ? '✓' : '⚠️'}</span>
          <span>{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-white/80 hover:text-white font-bold text-base leading-none"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-5xl font-bold mb-3">Professional Services Marketplace</h1>
              <p className="text-lg text-blue-100">Discover verified service providers across all industries</p>
            </div>
            {isAdmin && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-xl text-xs font-semibold text-blue-100 flex items-center space-x-2 self-start md:self-auto">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Admin Mode Active (Deletion Enabled)</span>
              </div>
            )}
          </div>
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

            {/* Category Filter Pills */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-900">Service Categories</label>
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => handleCategorySelect('all')}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition"
                  >
                    Reset Filter
                  </button>
                )}
              </div>
              <div className="flex items-center space-x-2 overflow-x-auto pb-3 scrollbar-thin">
                {CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-all duration-200 active:scale-95 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-400/40 font-semibold'
                          : 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300'
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Demo Mode Notice */}
          {isDemoMode && !loading && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-amber-900 font-semibold mb-1">Demo Mode</p>
              <p className="text-sm text-amber-800">
                Showcasing sample professionals. Connect Supabase to display your verified service providers.
              </p>
            </div>
          )}

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2">
            <p className="text-gray-600 text-sm font-medium">
              {loading ? (
                'Loading directory...'
              ) : totalCount > 0 ? (
                <>
                  Showing <span className="font-semibold text-gray-900">{fromItem}</span> –{' '}
                  <span className="font-semibold text-gray-900">{toItem}</span> of{' '}
                  <span className="font-semibold text-gray-900">{totalCount}</span> business{totalCount !== 1 ? 'es' : ''}
                </>
              ) : (
                'No businesses found'
              )}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-6">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Business Cards Grid or Skeleton Loader */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <BusinessSkeleton count={PAGE_SIZE} />
            ) : businesses.length === 0 ? (
              <div className="col-span-full text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <span className="text-4xl block mb-2">🔍</span>
                <p className="text-gray-700 font-semibold text-lg">No businesses found</p>
                <p className="text-gray-500 text-sm mt-1">
                  Try adjusting your search terms or selecting another category.
                </p>
                {selectedCategory !== 'all' && (
                  <button
                    onClick={() => handleCategorySelect('all')}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                  >
                    View All Categories
                  </button>
                )}
              </div>
            ) : (
              businesses.map((business) => (
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
                  isAdmin={isAdmin}
                  onDelete={handleOpenDelete}
                />
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {!loading && totalPages > 1 && (
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-200 pt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ← Previous
              </button>

              <div className="flex items-center space-x-1.5 overflow-x-auto">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                  const isCurrent = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition ${
                        isCurrent
                          ? 'bg-blue-600 text-white shadow'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        businessName={businessToDelete?.name || ''}
        loading={deleteLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!deleteLoading) {
            setDeleteModalOpen(false);
            setBusinessToDelete(null);
          }
        }}
      />
    </div>
  );
}
