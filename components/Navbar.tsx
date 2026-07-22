'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
// Using emoji icons instead of lucide-react for compatibility

export function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event: any, session: any) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });

      supabase.auth.getSession().then(async ({ data: { session } }: any) => {
        setUser(session?.user ?? null);

        if (session?.user) {
          const { data: userData } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();
          setUserRole(userData?.role ?? null);
        }
        setLoading(false);
      });

      return () => {
        subscription?.unsubscribe();
      };
    } catch (error) {
      setLoading(false);
    }
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    if (!supabase) {
      setUser(null);
      router.push('/');
      return;
    }
    try {
      await supabase.auth.signOut();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">S</span>
            <span className="font-bold text-lg text-gray-900">SaloneBiz</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/listings" className="text-gray-700 hover:text-gray-900 font-medium transition">
              Businesses
            </Link>
            {user && (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 font-medium transition">
                  Dashboard
                </Link>
                <Link href="/add-business" className="text-gray-700 hover:text-gray-900 font-medium transition">
                  Add Service
                </Link>
                {userRole === 'admin' && (
                  <Link href="/admin" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 transition shadow-md">
                    Admin
                  </Link>
                )}
              </>
            )}
            {!loading && !user ? (
              <div className="flex space-x-4 items-center">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              user && (
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                >
                  Sign Out
                </button>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700 text-xl font-semibold"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? 'Close' : 'Menu'}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/listings"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Businesses
            </Link>
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Dashboard
                </Link>
                <Link
                  href="/add-business"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Add Service
                </Link>
                {userRole === 'admin' && (
                  <Link
                    href="/admin"
                    className="block px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg font-semibold"
                  >
                    Admin Panel
                  </Link>
                )}
              </>
            )}
            {!loading && !user ? (
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 bg-blue-600 text-white rounded-lg text-center font-medium"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              user && (
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center space-x-2"
                >
                  <span>🚪</span>
                  <span>Sign Out</span>
                </button>
              )
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
