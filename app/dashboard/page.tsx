'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';
// Using emoji icons

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const checkAuth = async () => {
      if (!supabase) {
        setLoading(false);
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

        // Load user's businesses
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('owner_id', session.user.id)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setBusinesses(data);
        }

        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this business?')) return;

    const supabase = createClient();
    await supabase.from('businesses').delete().eq('id', id);
    setBusinesses(businesses.filter((b) => b.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Demo Mode Notice */}
      {!user && (
        <div className="bg-blue-50 border border-blue-300 rounded-lg p-6 mb-8">
          <p className="text-blue-900 flex items-start space-x-3">
            <span className="text-lg">🔐</span>
            <span>
              <strong className="block mb-1">Secure Access Required</strong>
              <span className="text-sm">Sign in to your SaloneBiz account to manage your professional profile and services. <Link href="/login" className="underline font-semibold hover:text-blue-800">Sign in here</Link></span>
            </span>
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Professional Dashboard</h1>
          <p className="text-gray-600 mt-3">{user?.email ? `Account: ${user.email}` : 'Manage your services and professional profile'}</p>
        </div>
        {user && (
          <Link
            href="/add-business"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            <span>➕</span>
            <span>Add Business</span>
          </Link>
        )}
      </div>

      {/* Services List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {businesses.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <p className="text-gray-700 text-lg font-medium mb-2">No Services Listed Yet</p>
            <p className="text-gray-500 mb-6">Start building your professional presence on SaloneBiz</p>
            <Link
              href="/add-business"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Create Your First Service Profile
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Business Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {businesses.map((business) => (
                  <tr key={business.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link
                        href={`/business/${business.id}`}
                        className="font-medium text-gray-900 hover:text-blue-600 transition"
                      >
                        {business.name}
                      </Link>
                      <div className="text-sm text-gray-500">{business.location}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{business.category}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          business.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {business.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {business.rating.toFixed(1)} ⭐
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/business/${business.id}`}
                        className="inline-flex items-center space-x-1 text-green-600 hover:text-green-700"
                        title="View Listing"
                      >
                        <span>👁️</span>
                      </Link>
                      <Link
                        href={`/edit-business/${business.id}`}
                        className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                        title="Edit Listing"
                      >
                        <span>✏️</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(business.id)}
                        className="inline-flex items-center space-x-1 text-red-600 hover:text-red-700 cursor-pointer"
                        title="Delete Listing"
                      >
                        <span>🗑️</span>
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
  );
}
