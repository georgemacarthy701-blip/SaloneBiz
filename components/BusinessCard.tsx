'use client';

import Link from 'next/link';
import { parseMedia } from '@/lib/api';
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
  const { productImage } = parseMedia(cover);

  return (
    <Link href={`/business/${id}`} className="block h-full">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
        {/* Product Image */}
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center p-2 relative overflow-hidden">
          {productImage && productImage !== 'undefined' ? (
            <img
              src={productImage}
              alt={name}
              className="max-w-full max-h-full object-contain"
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
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
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
          </div>

          <div>
            {/* Pricing */}
            {startingPrice ? (
              <div className="mb-3 pb-3 border-t border-gray-100 pt-3">
                <p className="text-xs text-gray-500 font-medium">Pricing</p>
                <p className="text-sm font-bold text-gray-900">
                  Starting at LE {startingPrice.toLocaleString()}
                </p>
              </div>
            ) : (
              <div className="mb-3 pb-3 border-t border-transparent pt-3">
                <p className="text-xs text-transparent select-none font-medium">Pricing Info</p>
                <p className="text-sm font-bold text-transparent select-none">No Price Range</p>
              </div>
            )}

            {/* Action Button */}
            <button className="w-full bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
