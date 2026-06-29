'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { useState, useEffect } from 'react';

interface MediaUploadProps {
  onUpload: (url: string, type: 'image' | 'video') => void;
  label: string;
  placeholder: string;
  acceptedTypes?: 'image' | 'video' | 'all';
  initialUrl?: string;
}

export function MediaUpload({
  onUpload,
  label,
  placeholder,
  acceptedTypes = 'image',
  initialUrl,
}: MediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>(initialUrl || '');

  useEffect(() => {
    if (initialUrl) {
      setPreviewUrl(initialUrl);
    }
  }, [initialUrl]);

  if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
    return (
      <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Cloudinary Configuration Required</strong><br />
          Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME to .env.local to enable media uploads
        </p>
      </div>
    );
  }

  const getResourceType = (url: string) => {
    if (url.includes('video')) return 'video';
    return 'image';
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-gray-900">{label}</label>

      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{ resourceType: acceptedTypes === 'all' ? 'auto' : acceptedTypes }}
        onSuccess={(result: any) => {
          const url = result.info.secure_url;
          const type = getResourceType(url);
          setPreviewUrl(url);
          onUpload(url, type as 'image' | 'video');
          setUploading(false);
        }}
        onUpload={() => setUploading(true)}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            disabled={uploading}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 hover:bg-blue-50 transition disabled:opacity-50"
          >
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-gray-900">
                  {uploading ? 'Uploading...' : 'Click to upload'}
                </p>
                <p className="text-sm text-gray-500">{placeholder}</p>
              </div>
            </div>
          </button>
        )}
      </CldUploadWidget>

      {previewUrl && (
        <div className="relative h-32 bg-gray-100 rounded-lg overflow-hidden">
          {previewUrl.includes('video') ? (
            <video src={previewUrl} className="w-full h-full object-cover" controls />
          ) : (
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          )}
        </div>
      )}
    </div>
  );
}
