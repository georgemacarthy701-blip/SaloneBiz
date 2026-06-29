import Link from 'next/link';

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-7xl font-bold tracking-tight">
                SaloneBiz
              </h1>
              <p className="text-2xl font-light text-blue-100">
                Your Professional Business Marketplace
              </p>
            </div>
            <p className="text-lg text-blue-50 max-w-2xl mx-auto leading-relaxed">
              Connect with verified service providers. Grow your business. Build lasting professional relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link
                href="/listings"
                className="bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition shadow-lg"
              >
                Explore Marketplace
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition border border-blue-500"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Leading Businesses Trust SaloneBiz</h2>
            <p className="text-xl text-gray-600">Industry-leading platform for professional service discovery</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-3">Intelligent Discovery</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Advanced search and filtering to find exactly what you need from our curated network of professionals
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-3">Verified Ratings</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Transparent, authenticated reviews from real clients to guide your decisions with confidence
              </p>
            </div>
            <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition">
              <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6 mx-auto">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-3">Secure Platform</h3>
              <p className="text-gray-600 text-center leading-relaxed">
                Enterprise-grade security and privacy standards to protect your professional information
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Explore Service Categories</h2>
            <p className="text-xl text-gray-600">Connect with professionals across all industries</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Hospitality', emoji: '🏨' },
              { name: 'Healthcare', emoji: '🏥' },
              { name: 'Technology', emoji: '💻' },
              { name: 'Finance', emoji: '🏦' },
              { name: 'Retail', emoji: '🛍️' },
              { name: 'Education', emoji: '📚' },
              { name: 'Transportation', emoji: '🚗' },
              { name: 'Food & Beverage', emoji: '🍽️' },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={`/listings?category=${cat.name.toLowerCase()}`}
                className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl text-center hover:shadow-lg hover:from-blue-50 hover:to-blue-100 transition space-y-3 cursor-pointer border border-gray-200 hover:border-blue-300"
              >
                <div className="text-4xl">{cat.emoji}</div>
                <p className="font-semibold text-gray-900">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Growing Professional Network</h2>
            <p className="text-xl text-gray-600">Trusted by thousands of service providers and clients</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
              <div className="text-5xl font-bold text-blue-600 mb-3">2,500+</div>
              <p className="text-gray-700 font-medium">Service Providers</p>
              <p className="text-gray-500 text-sm mt-2">Verified professionals</p>
            </div>
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
              <div className="text-5xl font-bold text-blue-600 mb-3">15,000+</div>
              <p className="text-gray-700 font-medium">Active Users</p>
              <p className="text-gray-500 text-sm mt-2">Clients finding services</p>
            </div>
            <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-200">
              <div className="text-5xl font-bold text-blue-600 mb-3">4.8★</div>
              <p className="text-gray-700 font-medium">Average Rating</p>
              <p className="text-gray-500 text-sm mt-2">Based on verified reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Client Success Stories</h2>
            <p className="text-xl text-gray-600">Real feedback from verified users</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border border-gray-200">
              <div className="flex items-center mb-4">
                <span className="text-2xl">⭐⭐⭐⭐⭐</span>
              </div>
              <p className="text-gray-700 italic mb-4">
                "SaloneBiz connected me with reliable service providers. The platform is intuitive and secure."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center font-bold text-blue-700">
                  AK
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Amara Koroma</p>
                  <p className="text-sm text-gray-600">Business Owner</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border border-gray-200">
              <div className="flex items-center mb-4">
                <span className="text-2xl">⭐⭐⭐⭐⭐</span>
              </div>
              <p className="text-gray-700 italic mb-4">
                "Professional platform that made it easy to showcase my services and reach new clients."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center font-bold text-green-700">
                  JM
                </div>
                <div>
                  <p className="font-semibold text-gray-900">John Mansaray</p>
                  <p className="text-sm text-gray-600">IT Consultant</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border border-gray-200">
              <div className="flex items-center mb-4">
                <span className="text-2xl">⭐⭐⭐⭐⭐</span>
              </div>
              <p className="text-gray-700 italic mb-4">
                "Excellent service marketplace. Found quality providers and built lasting business relationships."
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center font-bold text-purple-700">
                  FB
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Fatima Bangura</p>
                  <p className="text-sm text-gray-600">Event Manager</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold">Join the SaloneBiz Network</h2>
            <p className="text-xl text-blue-100 leading-relaxed">
              Grow your professional presence. Connect with qualified clients. Build your reputation.
            </p>
          </div>
          <Link
            href="/register"
            className="inline-block bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition shadow-lg"
          >
            Create Your Profile
          </Link>
        </div>
      </section>
    </div>
  );
}
