import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function POST(req: NextRequest) {
    try {
        // 1. Authenticate the requester using SSR cookies
        const cookieStore = await cookies();

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ioytminosynrorvzqxwt.supabase.co';
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlveXRtaW5vc3lucm9ydnpxeHd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3Mzg1MTYsImV4cCI6MjA4ODMxNDUxNn0.NggeLY0ju9XOZBpgGwqUwnbQgSgrZQZj7xONOY0cSvI';

        const supabase = createServerClient(supabaseUrl, supabaseKey, {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                    }
                },
            },
        });

        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Verify requester is an admin
        const { data: profile } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .single();

        if (profile?.role !== "admin") {
            return NextResponse.json({ error: "Forbidden: Only admins can create users" }, { status: 403 });
        }

        // 3. Get new user data from request body
        const { email, password, full_name, phone, role } = await req.json();

        if (!email || !password || !full_name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 4. Initialize Supabase Admin Client with SERVICE_ROLE_KEY
        // This is REQUIRED to bypass RLS and create/update auth users securely
        const adminSupabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ioytminosynrorvzqxwt.supabase.co';
        const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!adminSupabaseUrl || !supabaseServiceRoleKey) {
            console.error("Missing Supabase URL or Service Role Key");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        const supabaseAdmin = createClient(adminSupabaseUrl, supabaseServiceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        // 5. Create user in auth.users
        const { data: newUserData, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true,
            user_metadata: {
                full_name,
                phone,
                role
            }
        });

        if (createError) {
            console.error("Error creating auth user:", createError);
            return NextResponse.json({ error: createError.message }, { status: 400 });
        }

        if (!newUserData.user) {
            return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
        }

        // 6. Explicitly create/update the profile using service role to bypass any RLS limitations
        const { error: profileError } = await supabaseAdmin
            .from("profiles")
            .upsert({
                id: newUserData.user.id,
                email: email,
                full_name: full_name,
                phone: phone,
                role: role
            });

        if (profileError) {
            console.error("Error creating profile:", profileError);
            // It's possible a trigger already created the profile but missing fields. Upsert handles it.
            // If it fails, we still return success but maybe warn.
        }

        return NextResponse.json({
            success: true,
            message: "User created successfully",
            user: newUserData.user
        });

    } catch (error: any) {
        console.error("Unexpected error in create user API:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
