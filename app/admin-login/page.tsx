'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    console.log('Login attempt started for email:', email);
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();

      if (!supabase) {
        console.error('Supabase client failed to initialize');
        setError('Database configuration required. Please set up Supabase in .env.local');
        alert('Supabase client failed to initialize');
        setLoading(false);
        return;
      }

      // Sign in directly
      console.log('Calling supabase.auth.signInWithPassword directly...');
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('signInWithPassword finished. data:', authData, 'error:', signInError);

      if (signInError) {
        throw signInError;
      }

      if (!authData.user) {
        throw new Error('Sign in failed: No user returned');
      }

      // Check user role
      console.log('Fetching user profile role for user ID:', authData.user.id);
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      console.log('Fetched role data:', userData, 'error:', userError);

      if (userError) {
        throw userError;
      }

      console.log('User role read from db:', userData?.role);

      if (userData?.role !== 'admin') {
        console.error('Access denied. User role is not admin. Signing out auth session.');
        await supabase.auth.signOut();
        const errMessage = `Access denied. User is not an admin. Role: ${userData?.role || 'none'}`;
        setError(errMessage);
        alert(errMessage);
        setLoading(false);
        return;
      }

      console.log('Authentication and admin role verified! Redirecting to /admin-dashboard...');
      router.push('/admin-dashboard');
    } catch (err: any) {
      console.error('Caught error during admin login handler:', err);
      const errMessage = err.message || 'Authentication failed';
      setError(errMessage);
      alert('Login Error: ' + errMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Admin Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl font-bold">SA</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">SaloneBiz Admin</h1>
          <p className="text-slate-300">Management Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-2xl p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Access</h2>
            <p className="text-sm text-gray-600">Sign in to manage users and verify businesses</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-900 font-semibold text-sm mb-1">Access Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleAdminLogin(e); }} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                Admin Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 font-medium placeholder:text-gray-400"
                placeholder="admin@salonebiz.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 font-medium placeholder:text-gray-400"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-900 transition"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <span className="text-lg">👁️</span>
                  ) : (
                    <span className="text-lg">👁️‍🗨️</span>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
            >
              {loading ? 'Signing In...' : 'Sign In to Admin'}
            </button>
          </form>

          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-gray-600 text-center">
              Not an admin?{' '}
              <Link href="/login" className="text-purple-600 font-semibold hover:text-purple-700">
                Regular Login
              </Link>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 text-center text-xs text-slate-400">
          <p>SaloneBiz Admin Portal • Secure Access Only</p>
          <p className="mt-1">All activities are logged and monitored</p>
        </div>
      </div>
    </div>
  );
}
