'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { parseMedia } from '@/lib/api';

interface Business {
  id: string;
  name: string;
  category: string;
  location: string;
  phone: string;
  email: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  owner_id: string;
  cover_image: string;
}

interface Stats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [stats, setStats] = useState<Stats>({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const checkAdminAccess = async () => {
      setLoading(true);
      const supabase = createClient();
      if (!supabase) {
        console.error('Supabase client failed to initialize in admin guard');
        router.push('/admin-login');
        return;
      }

      try {
        console.log('Admin guard: Checking auth session using getUser...');
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error('Admin guard: Auth verification failed', userError);
          router.push('/admin-login');
          return;
        }

        console.log('Admin guard: Authenticated user ID:', user.id);

        const { data: userData, error: dbError } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();

        console.log('Admin guard: Database profile role read:', userData?.role, 'error:', dbError);

        if (dbError || userData?.role !== 'admin') {
          console.error('Admin guard: Access denied. Role is not admin.');
          router.push('/admin-login');
          return;
        }

        setUser(user);
        setIsAdmin(true);
        loadBusinesses();
      } catch (err) {
        console.error('Admin guard: Exception during access check', err);
        router.push('/admin-login');
      }
    };

    checkAdminAccess();
  }, [router]);

  const loadBusinesses = async () => {
    const supabase = createClient();
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setBusinesses(data || []);

      const stats = {
        pending: (data || []).filter((b: Business) => b.verification_status === 'pending').length,
        approved: (data || []).filter((b: Business) => b.verification_status === 'approved').length,
        rejected: (data || []).filter((b: Business) => b.verification_status === 'rejected').length,
        total: data?.length || 0,
      };
      setStats(stats);
    } catch (error) {
      console.error('Failed to load businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (businessId: string) => {
    setActionLoading(true);
    const supabase = createClient();
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          verification_status: 'approved',
          verified_at: new Date().toISOString(),
          status: 'active',
        })
        .eq('id', businessId);

      if (error) throw error;

      setSelectedBusiness(null);
      loadBusinesses();
    } catch (error) {
      console.error('Failed to approve:', error);
      alert('Failed to approve business');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (businessId: string) => {
    if (!adminNotes.trim()) {
      alert('Please provide rejection notes');
      return;
    }

    setActionLoading(true);
    const supabase = createClient();
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('businesses')
        .update({
          verification_status: 'rejected',
          admin_notes: adminNotes,
          verified_at: new Date().toISOString(),
        })
        .eq('id', businessId);

      if (error) throw error;

      setSelectedBusiness(null);
      setAdminNotes('');
      loadBusinesses();
    } catch (error) {
      console.error('Failed to reject:', error);
      alert('Failed to reject business');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredBusinesses = businesses.filter(
    b => filter === 'all' || b.verification_status === filter
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium text-sm">Verifying administrator access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold">Admin Dashboard</h1>
              <p className="text-blue-100 mt-2">Manage and verify business listings</p>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-2 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Pending Review', value: stats.pending, color: 'from-amber-500 to-amber-600', icon: '⏳' },
            { label: 'Approved', value: stats.approved, color: 'from-green-500 to-green-600', icon: '✓' },
            { label: 'Rejected', value: stats.rejected, color: 'from-red-500 to-red-600', icon: '✕' },
            { label: 'Total Listings', value: stats.total, color: 'from-blue-500 to-blue-600', icon: '📊' },
          ].map((stat) => (
            <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-lg p-6 text-white shadow-lg`}>
              <p className="text-sm opacity-90 font-medium">{stat.label}</p>
              <p className="text-4xl font-bold mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-gray-300">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-3 font-semibold border-b-2 transition ${
                filter === tab
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-blue-600'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab !== 'all' && ` (${tab === 'pending' ? stats.pending : tab === 'approved' ? stats.approved : stats.rejected})`}
            </button>
          ))}
        </div>

        {/* Businesses Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">Loading...</p>
            </div>
          ) : filteredBusinesses.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">No businesses found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Business Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBusinesses.map((business, idx) => (
                    <tr
                      key={business.id}
                      className={`border-b ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition`}
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{business.name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {business.category.charAt(0).toUpperCase() + business.category.slice(1)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{business.location}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="text-gray-900">{business.phone}</div>
                        <div className="text-gray-500 text-xs">{business.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            business.verification_status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : business.verification_status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {business.verification_status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(business.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => setSelectedBusiness(business)}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-sm"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">{selectedBusiness.name}</h2>
              <button
                onClick={() => setSelectedBusiness(null)}
                className="text-xl font-bold hover:opacity-80"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Business Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Business Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-semibold text-gray-900">{selectedBusiness.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">{selectedBusiness.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-semibold text-gray-900">{selectedBusiness.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900 text-sm">{selectedBusiness.email}</p>
                  </div>
                </div>
              </div>

              {/* Media Section */}
              {(() => {
                const { productImage, videoUrl } = parseMedia(selectedBusiness.cover_image);
                return (
                  <div className="space-y-4">
                    {productImage && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Product Image</p>
                        <img
                          src={productImage}
                          alt={selectedBusiness.name}
                          className="w-full h-48 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22400%22 height=%22300%22/%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    )}

                    {videoUrl && (
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Promotional Video</p>
                        <div className="relative w-full bg-black rounded-lg overflow-hidden shadow-sm" style={{ paddingBottom: '56.25%' }}>
                          <video
                            src={videoUrl}
                            controls
                            className="absolute inset-0 w-full h-full object-contain"
                            poster={productImage}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Status */}
              <div>
                <p className="text-sm text-gray-600 mb-2">Verification Status</p>
                <span
                  className={`inline-block px-4 py-2 rounded-lg font-semibold ${
                    selectedBusiness.verification_status === 'pending'
                      ? 'bg-amber-100 text-amber-800'
                      : selectedBusiness.verification_status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {selectedBusiness.verification_status.toUpperCase()}
                </span>
              </div>

              {/* Admin Actions */}
              {selectedBusiness.verification_status === 'pending' && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Verification Action</h3>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Admin Notes (for rejection)
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Provide feedback for the business owner..."
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      rows={4}
                    />
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleApprove(selectedBusiness.id)}
                      disabled={actionLoading}
                      className="flex-1 bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                    >
                      {actionLoading ? '⌛ Processing...' : '✓ Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(selectedBusiness.id)}
                      disabled={actionLoading}
                      className="flex-1 bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
                    >
                      {actionLoading ? '⌛ Processing...' : '✕ Reject'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
