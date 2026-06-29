'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  role: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  is_verified: boolean;
  created_at: string;
}

interface Stats {
  total_users: number;
  pending_approval: number;
  approved_users: number;
  admin_count: number;
}

type TabType = 'users' | 'businesses';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats>({ total_users: 0, pending_approval: 0, approved_users: 0, admin_count: 0 });
  const [activeTab, setActiveTab] = useState<TabType>('users');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    const checkAdminAccess = async () => {
      const supabase = createClient();
      if (!supabase) {
        router.push('/admin-login');
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/admin-login');
        return;
      }

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (userData?.role !== 'admin') {
        router.push('/admin-login');
        return;
      }

      setUser(session.user);
      setIsAdmin(true);
      loadData();
    };

    checkAdminAccess();
  }, [router]);

  const loadData = async () => {
    const supabase = createClient();
    if (!supabase) return;

    try {
      // Load all users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (usersError) throw usersError;

      setUsers(usersData || []);

      // Calculate stats
      const stats = {
        total_users: usersData?.length || 0,
        pending_approval: (usersData || []).filter((u: User) => u.verification_status === 'pending').length,
        approved_users: (usersData || []).filter((u: User) => u.verification_status === 'approved').length,
        admin_count: (usersData || []).filter((u: User) => u.role === 'admin').length,
      };
      setStats(stats);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveUser = async (userId: string) => {
    setActionLoading(true);
    const supabase = createClient();
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({
          verification_status: 'approved',
          is_verified: true,
          verified_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;

      setSelectedUser(null);
      loadData();
    } catch (error) {
      console.error('Failed to approve user:', error);
      alert('Failed to approve user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectUser = async (userId: string) => {
    if (!adminNotes.trim()) {
      alert('Please provide rejection notes');
      return;
    }

    setActionLoading(true);
    const supabase = createClient();
    if (!supabase) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({
          verification_status: 'rejected',
          is_verified: false,
          verified_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;

      setSelectedUser(null);
      setAdminNotes('');
      loadData();
    } catch (error) {
      console.error('Failed to reject user:', error);
      alert('Failed to reject user');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push('/admin-login');
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-blue-100 mt-2">Manage and verify user accounts</p>
            </div>
            <Link
              href="/admin"
              className="px-6 py-2 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Pending Review', value: stats.pending_approval, color: 'from-orange-500 to-orange-600' },
            { label: 'Approved Users', value: stats.approved_users, color: 'from-green-500 to-green-600' },
            { label: 'Total Users', value: stats.total_users, color: 'from-blue-500 to-blue-600' },
            { label: 'Admin Accounts', value: stats.admin_count, color: 'from-purple-500 to-purple-600' },
          ].map((stat) => (
            <div key={stat.label} className={`bg-gradient-to-br ${stat.color} rounded-lg p-6 text-white shadow-lg`}>
              <p className="text-sm font-semibold opacity-90">{stat.label}</p>
              <p className="text-4xl font-bold mt-4">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-8 mb-8 border-b border-gray-200">
          {[
            { id: 'users', label: 'User Management' },
            { id: 'businesses', label: 'Business Verification' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-1 py-3 font-medium border-b-2 transition ${
                activeTab === tab.id
                  ? 'text-gray-900 border-gray-900'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-8 text-center">
                <p className="text-gray-600">Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Role</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Joined</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr
                        key={u.id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 font-semibold text-gray-900">{u.email}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            u.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {u.role === 'admin' ? 'Administrator' : 'User'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            u.verification_status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : u.verification_status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {u.verification_status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => setSelectedUser(u)}
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
        )}

        {/* Businesses Tab */}
        {activeTab === 'businesses' && (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600 text-sm mb-4">Business verification is managed separately</p>
            <Link
              href="/admin"
              className="inline-block px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition"
            >
              Go to Business Management
            </Link>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900">User Review</h2>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                ✕
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              {/* User Details */}
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
                  <p className="text-sm text-gray-900 mt-1">{selectedUser.email}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Role</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {selectedUser.role === 'admin' ? 'Administrator' : 'User'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Joined</p>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(selectedUser.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</p>
                  <div className="mt-1">
                    <span className={`inline-block px-3 py-1 rounded text-xs font-semibold ${
                      selectedUser.verification_status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : selectedUser.verification_status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedUser.verification_status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Admin Actions */}
              {selectedUser.verification_status === 'pending' && selectedUser.role !== 'admin' && (
                <>
                  <div className="border-t border-gray-200 pt-4">
                    <label className="block text-xs font-medium text-gray-900 uppercase tracking-wide mb-2">
                      Notes
                    </label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Optional feedback..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => handleApproveUser(selectedUser.id)}
                      disabled={actionLoading}
                      className="flex-1 bg-green-600 text-white font-semibold py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                    >
                      {actionLoading ? 'Processing...' : 'Approve User'}
                    </button>
                    <button
                      onClick={() => handleRejectUser(selectedUser.id)}
                      disabled={actionLoading}
                      className="flex-1 bg-red-600 text-white font-semibold py-2.5 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
                    >
                      {actionLoading ? 'Processing...' : 'Reject User'}
                    </button>
                  </div>
                </>
              )}

              {selectedUser.verification_status !== 'pending' && (
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-sm text-gray-600">
                    Already <span className="font-medium text-gray-900">{selectedUser.verification_status}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
