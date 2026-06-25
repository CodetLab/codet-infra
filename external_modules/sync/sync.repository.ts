import { supabase } from "../../db/supabase";

export async function upsertProfile(
    tenantUserId: number,
    name: string,
    email: string,
) {
    const { data: existing } = await supabase
        .from("profiles")
        .select("*")
        .eq("tenant_user_id", tenantUserId)
        .maybeSingle();

    if (existing) {
        return existing;
    }

    const { data, error } = await supabase
        .from("profiles")
        .insert({
            tenant_user_id: tenantUserId,
            name,
            email,
        })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data;
}