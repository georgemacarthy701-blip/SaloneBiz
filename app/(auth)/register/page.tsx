import Link from 'next/link';
import { AuthForm } from '@/components/AuthForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link href="/" className="flex items-center justify-center space-x-3 mb-8 hover:opacity-80 transition">
            <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">S</span>
            <span className="text-2xl font-bold text-gray-900">SaloneBiz</span>
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Get Started</h1>
            <p className="mt-3 text-lg text-gray-600">Join the professional services marketplace</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
          <AuthForm mode="register" />
        </div>

        {/* Footer */}
        <div className="text-center space-y-4">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-700 transition">
              Sign in here
            </Link>
          </p>
          <p className="text-xs text-gray-500">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
