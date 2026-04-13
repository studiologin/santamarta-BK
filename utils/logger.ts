import { createClient } from "@/utils/supabase/client";

export type LogActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'PUBLISH' | 'HIDE' | 'VIEW';

interface LogOptions {
    userId?: string;
    email?: string;
    action: LogActionType | string;
    entityType?: string;
    entityName?: string;
    details?: any;
}

export async function logAction(options: LogOptions) {
    const supabase = createClient();

    // If no userId provided, try to get from current session
    let { userId, email, action, entityType, entityName, details } = options;

    if (!userId || !email) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            userId = userId || session.user.id;
            email = email || session.user.email;
        }
    }

    const { error } = await supabase
        .from("user_actions_log")
        .insert({
            user_id: userId,
            email: email,
            action,
            entity_type: entityType,
            entity_name: entityName,
            details,
            created_at: new Date()
        });

    if (error) {
        console.error("Error logging action:", error);
    }
}
