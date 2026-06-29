'use client';

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const categories = [
    { name: 'Technology', href: '/listings?category=technology' },
    { name: 'Hospitality', href: '/listings?category=hospitality' },
    { name: 'Healthcare', href: '/listings?category=healthcare' },
    { name: 'Finance', href: '/listings?category=finance' },
  ];

  const providers = [
    { name: 'Add Service', href: '/add-business' },
    { name: 'Dashboard', href: '/dashboard' },
  ];

  const platform = [
    { name: 'Browse Listings', href: '/listings' },
    { name: 'Admin Portal', href: '/admin-login' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-400 relative overflow-hidden">
      {/* Visual Accent Top Bar */}
      <div className="h-[4px] w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"></div>

      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center space-x-3 group w-fit">
              <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-indigo-300 transition duration-300">
                S
              </span>
              <span className="font-bold text-xl text-white group-hover:text-slate-100 transition duration-300">
                SaloneBiz
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The premier professional business directory and marketplace for verified service providers and trusted connections.
            </p>
            {/* Contact Info */}
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-center space-x-2.5">
                <span className="text-base">✉️</span>
                <a href="mailto:salonebiz9@gmail.com" className="hover:text-white transition duration-200">
                  salonebiz9@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <span className="text-base">📞</span>
                <a href="tel:+23280442328" className="hover:text-white transition duration-200">
                  +23280442328
                </a>
              </div>
            </div>

          </div>

          {/* Column 2: Discover */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
              Discover
            </h3>
            <ul className="space-y-4">
              {categories.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: For Providers */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
              For Providers
            </h3>
            <ul className="space-y-4">
              {providers.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Platform */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-6">
              Platform
            </h3>
            <ul className="space-y-4">
              {platform.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-400 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom Divider */}
        <div className="border-t border-slate-850 pt-8 flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <p className="text-xs text-slate-500 text-center">
              &copy; {currentYear} SaloneBiz. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <Link href="/privacy" className="text-xs text-slate-500 hover:text-slate-400 transition">
                Privacy Policy
              </Link>
              <span className="text-slate-800 text-xs">•</span>
              <Link href="/terms" className="text-xs text-slate-500 hover:text-slate-400 transition">
                Terms of Service
              </Link>
            </div>
          </div>

          {/* Built for Sierra Leone badge */}
          <div className="flex items-center space-x-2 bg-slate-900/60 border border-slate-800/80 px-4 py-1.5 rounded-full hover:border-slate-700 transition duration-300 shadow-inner group">
            <span className="text-xs text-slate-400 group-hover:text-slate-300 transition duration-300">
              Built for Sierra Leone
            </span>
            <span className="text-sm select-none animate-pulse">🇸🇱</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
