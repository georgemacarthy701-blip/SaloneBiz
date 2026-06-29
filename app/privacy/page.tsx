import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition"
          >
            <span>←</span> <span className="ml-1.5">Back to Home</span>
          </Link>
        </div>

        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-8 md:p-12 text-white shadow-xl mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="mt-4 text-blue-100 text-lg leading-relaxed max-w-2xl">
            We value your privacy. Learn how SaloneBiz collects, uses, protects, and handles your information on our professional services directory.
          </p>
          <div className="mt-6 inline-flex items-center space-x-2 text-xs text-blue-200 bg-blue-800/40 border border-blue-700/50 px-3 py-1 rounded-full">
            <span>Last Updated: June 17, 2026</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-8 md:p-12 shadow-sm space-y-10 text-gray-700">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              1. Introduction & Scope
            </h2>
            <p className="leading-relaxed">
              SaloneBiz ("we", "our", or "us") operates the SaloneBiz platform, a professional directory and marketplace. This Privacy Policy details how we handle the personal information of both service providers and directory visitors. By registering for an account or using our platform, you consent to the practices described in this policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              2. Information We Collect
            </h2>
            <p className="leading-relaxed">
              We collect information to build a trusted, verified network of services. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2.5">
              <li>
                <strong className="text-gray-900">Account Credentials:</strong> Email addresses and verification details provided during registrations secured by Supabase Authentication.
              </li>
              <li>
                <strong className="text-gray-900">Business Profiles:</strong> Business name, categorization, address/location, contact phone, contact email, and description.
              </li>
              <li>
                <strong className="text-gray-900">Media Files:</strong> Promotional images and showcase videos uploaded to Cloudinary for listing presentation.
              </li>
              <li>
                <strong className="text-gray-900">User Reviews:</strong> Feedback ratings, review descriptions, and verified author details.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              3. How We Use Your Information
            </h2>
            <p className="leading-relaxed">
              The primary purpose of collecting information is to run the professional business marketplace. Specifically, we use information to:
            </p>
            <ul className="list-disc pl-6 space-y-2.5">
              <li>Facilitate discovery of local service providers and coordinate contacts.</li>
              <li>Authenticate users and ensure secure dashboard management.</li>
              <li>Review and approve listings through our administrative portal to prevent fraud.</li>
              <li>Display verified feedback ratings and star-based reviews on listing pages.</li>
              <li>Analyze traffic patterns to optimize layout performance.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              4. Data Sharing & Publicity
            </h2>
            <p className="leading-relaxed">
              All profile listings, cover images, and service descriptions are public-facing for visitor access. However, secure backend data, including verification status logs and raw user ID tags, are protected. We do not sell or lease personal contact details to advertising networks.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              5. Data Protection & Security
            </h2>
            <p className="leading-relaxed">
              We implement industry-standard security protocols:
            </p>
            <ul className="list-disc pl-6 space-y-2.5">
              <li>All database operations are secured via Supabase Row-Level Security (RLS) policies.</li>
              <li>Media assets are managed via secure, authenticated Cloudinary protocols.</li>
              <li>SSL encryption is enforced across all dynamic API routes and page requests.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              6. Your Rights & Options
            </h2>
            <p className="leading-relaxed">
              Registered providers can log in at any time to:
            </p>
            <ul className="list-disc pl-6 space-y-2.5">
              <li>Update listing information, change categories, or edit description details.</li>
              <li>Upload or replace cover media assets.</li>
              <li>Request profile suspension or account deletion by contacting support at <a href="mailto:salonebiz9@gmail.com" className="text-blue-600 hover:underline">salonebiz9@gmail.com</a>.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3">
              7. Contact Us
            </h2>
            <p className="leading-relaxed">
              If you have any questions regarding this Privacy Policy, please contact our support team:
            </p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-2 w-fit">
              <p className="text-sm"><strong className="text-gray-900">Email:</strong> <a href="mailto:salonebiz9@gmail.com" className="text-blue-600 hover:underline">salonebiz9@gmail.com</a></p>
              <p className="text-sm"><strong className="text-gray-900">Phone:</strong> <a href="tel:+23280442328" className="text-blue-600 hover:underline">+23280442328</a></p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
