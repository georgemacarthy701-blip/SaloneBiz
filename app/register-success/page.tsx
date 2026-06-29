'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RegisterSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Success Card */}
        <div className="bg-white rounded-xl shadow-lg border border-green-200 p-8 space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-2xl font-bold text-green-700">
              ✓
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to SaloneBiz!</h1>
            <p className="text-lg text-gray-600">Your account has been created successfully</p>
          </div>

          {/* Details */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
            <div className="flex items-start space-x-3">
              <span className="text-green-600 text-lg font-bold">✓</span>
              <div>
                <p className="font-semibold text-gray-900">Account Created</p>
                <p className="text-sm text-gray-600">You can now sign in to your account</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-600 text-lg font-bold">✓</span>
              <div>
                <p className="font-semibold text-gray-900">Ready to Add Services</p>
                <p className="text-sm text-gray-600">List your business and start reaching customers</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-green-600 text-lg font-bold">✓</span>
              <div>
                <p className="font-semibold text-gray-900">Professional Dashboard</p>
                <p className="text-sm text-gray-600">Manage all your listings and reviews in one place</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="block w-full bg-blue-600 text-white font-semibold py-3 rounded-lg text-center hover:bg-blue-700 transition shadow-md"
            >
              Go to Dashboard
            </Link>
            <Link
              href="/add-business"
              className="block w-full bg-green-600 text-white font-semibold py-3 rounded-lg text-center hover:bg-green-700 transition shadow-md"
            >
              Add Your First Service
            </Link>
            <Link
              href="/listings"
              className="block w-full bg-gray-100 text-gray-900 font-semibold py-3 rounded-lg text-center hover:bg-gray-200 transition"
            >
              Browse Services
            </Link>
          </div>

          {/* Footer Message */}
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Have questions?{' '}
              <a href="mailto:support@salonebiz.com" className="text-blue-600 font-semibold hover:text-blue-700">
                Contact us
              </a>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Your account is secure and verified with Supabase authentication
          </p>
        </div>
      </div>
    </div>
  );
}
