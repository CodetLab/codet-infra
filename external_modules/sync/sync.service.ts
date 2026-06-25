import { upsertProfile } from "./sync.repository";

export async function syncUser(
    tenantUserId: number,
    name: string,
    email: string,
) {
    return await upsertProfile(
        tenantUserId,
        name,
        email
    );
}