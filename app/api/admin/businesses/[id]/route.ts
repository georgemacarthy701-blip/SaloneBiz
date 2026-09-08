import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary for media cleanup
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  '';

function extractCloudinaryPublicId(url: string): string | null {
  if (!url || !url.includes('res.cloudinary.com')) return null;
  try {
    // Matches path after /upload/(v\d+/)? up to the file extension
    const match = url.match(/\/upload\/(?:v\d+\/)?([^\.]+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Server database configuration is missing' },
        { status: 500 }
      );
    }

    // 1. Authenticate caller from Authorization header or session token
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    let userId: string | null = null;

    if (token) {
      const { data: userData, error: userError } = await supabase.auth.getUser(token);
      if (!userError && userData?.user) {
        userId = userData.user.id;
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required' },
        { status: 401 }
      );
    }

    // 2. Check if user has admin role in public.users
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (profileError || userProfile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Only administrators can delete listings' },
        { status: 403 }
      );
    }

    // 3. Fetch business details to inspect cover_image for Cloudinary cleanup
    const { data: business } = await supabase
      .from('businesses')
      .select('id, name, cover_image')
      .eq('id', id)
      .single();

    if (!business) {
      return NextResponse.json(
        { error: 'Business listing not found' },
        { status: 404 }
      );
    }

    // 4. Delete business from Supabase (cascades to reviews and gallery)
    const { error: deleteError } = await supabase
      .from('businesses')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Database deletion error:', deleteError);
      return NextResponse.json(
        { error: deleteError.message || 'Failed to delete business listing' },
        { status: 500 }
      );
    }

    // 5. Asynchronously clean up Cloudinary assets if present
    if (business.cover_image) {
      try {
        let imageUrl = business.cover_image;
        if (imageUrl.startsWith('{')) {
          const parsed = JSON.parse(imageUrl);
          imageUrl = parsed.productImage || '';
        }
        const publicId = extractCloudinaryPublicId(imageUrl);
        if (publicId) {
          await cloudinary.uploader.destroy(publicId).catch((err) => {
            console.warn('Cloudinary cleanup notice:', err?.message);
          });
        }
      } catch (err) {
        console.warn('Cloudinary cleanup skipped:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Listing "${business.name}" deleted successfully`,
      deletedId: id,
    });
  } catch (error: any) {
    console.error('Admin business delete error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
