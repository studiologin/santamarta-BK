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
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
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
            return NextResponse.json({ error: "Forbidden: Only admins can delete users" }, { status: 403 });
        }

        // 3. Get target user ID from request body
        const { userId, targetRole } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "Target user ID is required" }, { status: 400 });
        }

        // Prevent self-deletion if needed (optional safety check)
        if (userId === user.id) {
            return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
        }

        // Prevent deleting other admins if the requester is not a superadmin
        // For now we allow admins to delete anyone, but we can restrict it
        if (targetRole === "admin") {
            // Optional: add logic so only a specific superadmin email can delete other admins
        }

        // 4. Initialize Supabase Admin Client with SERVICE_ROLE_KEY
        // This is REQUIRED to bypass RLS and delete from auth.users
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

        // 5a. Update any logs where this user is the actor to set user_id to NULL
        // This preserves the history (identifiable by email) even after user deletion.
        const { error: logsError } = await supabaseAdmin
            .from("user_actions_log")
            .update({ user_id: null })
            .eq("user_id", userId);

        if (logsError) {
            console.warn("Could not nullify associated user logs (if any):", logsError.message);
        }

        const { error: auditLogsError } = await supabaseAdmin
            .from("auth_audit_log")
            .delete()
            .eq("user_id", userId);

        if (auditLogsError) {
            console.warn("Could not delete associated auth audit logs (if any):", auditLogsError.message);
        }

        // 5b. Delete from public.profiles explicitly
        // This is safe to do first; if it fails due to FKs from logs, we might need a CASCADE.
        // It prevents the auth.admin deletion from failing if profiles -> auth.users lacks ON DELETE CASCADE.
        const { error: profileDeleteError } = await supabaseAdmin
            .from("profiles")
            .delete()
            .eq("id", userId);

        if (profileDeleteError) {
            console.error("Error deleting profile:", profileDeleteError);
            // We'll still try to delete the auth user below, but log this warn
        }

        // 6. Delete from auth.users
        // Note: If you have foreign keys set up with `ON DELETE CASCADE` in your profiles table 
        // linking to auth.users, deleting the auth user will automatically delete the profile.
        // If not, we should delete the profile first, then the auth user.

        const { data, error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (deleteError) {
            console.error("Error deleting auth user:", deleteError);
            return NextResponse.json({ error: deleteError.message }, { status: 400 });
        }

        return NextResponse.json({ success: true, message: "User deleted successfully from Auth and Profiles." });

    } catch (error: any) {
        console.error("Unexpected error in delete user API:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
