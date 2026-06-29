'use client';

import Link from 'next/link';
// Using emoji icons

interface BusinessCardProps {
  id: string;
  name: string;
  category: string;
  logo: string;
  rating: number;
  reviews: number;
  location: string;
  cover: string;
  featured?: boolean;
  startingPrice?: number;
  maximumPrice?: number;
}

export function BusinessCard({
  id,
  name,
  category,
  logo,
  rating,
  reviews,
  location,
  cover,
  featured,
  startingPrice,
  maximumPrice,
}: BusinessCardProps) {
  return (
    <Link href={`/business/${id}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer h-full">
        {/* Cover Image */}
        <div className="relative h-40 bg-gray-200 overflow-hidden">
          {cover && cover !== 'undefined' ? (
            <img
              src={cover}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-3xl">
              {logo}
            </div>
          )}
          {featured && (
            <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
              Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-gray-900 text-lg line-clamp-2">{name}</h3>
              <p className="text-sm text-gray-500">{category}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className="text-sm text-yellow-400">
                  {i < Math.floor(rating) ? '★' : '☆'}
                </span>
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-900">{rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500">({reviews})</span>
          </div>

          {/* Location */}
          <div className="text-sm text-gray-600 mb-3">
            <p className="line-clamp-1">{location}</p>
          </div>

          {/* Pricing */}
          {(startingPrice || maximumPrice) && (
            <div className="mb-3 pb-3 border-t border-gray-100">
              <p className="text-xs text-gray-500 font-medium">Starting from</p>
              <p className="text-sm font-bold text-gray-900">
                {startingPrice && `Le ${startingPrice.toLocaleString()}`}
                {startingPrice && maximumPrice && ' – '}
                {maximumPrice && `Le ${maximumPrice.toLocaleString()}`}
              </p>
            </div>
          )}

          {/* Action Button */}
          <button className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
}
