'use client';

interface BusinessSkeletonProps {
  count?: number;
}

export function BusinessSkeleton({ count = 6 }: BusinessSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm h-full flex flex-col animate-pulse"
        >
          {/* Media Header Placeholder */}
          <div className="w-full h-48 bg-gray-200" />

          {/* Content Placeholder */}
          <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              {/* Title & Category */}
              <div className="space-y-1.5">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-3.5 bg-gray-100 rounded w-1/3" />
              </div>

              {/* Stars & Reviews */}
              <div className="flex items-center space-x-2">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-3 bg-gray-100 rounded w-8" />
              </div>

              {/* Location */}
              <div className="h-3.5 bg-gray-100 rounded w-1/2" />
            </div>

            <div className="space-y-3 pt-2">
              {/* Pricing Line */}
              <div className="border-t border-gray-100 pt-3">
                <div className="h-3 bg-gray-100 rounded w-12 mb-1" />
                <div className="h-4 bg-gray-200 rounded w-28" />
              </div>

              {/* Action Button Placeholder */}
              <div className="w-full h-9 bg-gray-200 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
