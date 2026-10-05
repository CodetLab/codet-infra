import {
    eq,
    and,
    desc,
} from "drizzle-orm";

import { db } from "../../core/db";
import { invitations } from "../../core/db/schema";

export async function create(input: {
    appId: number;
    resourceId: string;
    resourceType: string;
    resourceAction: string;
    email: string;
    role: string;
    invitedBy: number;
    tokenHash: string;
    expiresAt: string;
}) {
    const [invitation] =
        await db
            .insert(invitations)
            .values({
                appId: input.appId,
                resourceId: input.resourceId,
                resourceType: input.resourceType,
                resourceAction: input.resourceAction,
                email: input.email,
                role: input.role,
                invitedBy: input.invitedBy,
                tokenHash: input.tokenHash,
                expiresAt: new Date(input.expiresAt),
            })
            .returning();

    return invitation;
}

export async function findById(
    id: string
) {
    const [invitation] =
        await db
            .select()
            .from(invitations)
            .where(
                eq(invitations.id, id)
            )
            .limit(1);

    return invitation ?? null;
}

export async function findByTokenHash(
    tokenHash: string
) {
    const [invitation] =
        await db
            .select()
            .from(invitations)
            .where(
                eq(
                    invitations.tokenHash,
                    tokenHash
                )
            )
            .limit(1);

    return invitation ?? null;
}

export async function findPending(
    appId: number,
    email: string,
    resourceType: string,
    resourceId: string
) {
    return db
        .select()
        .from(invitations)
        .where(
            and(
                eq(
                    invitations.appId,
                    appId
                ),
                eq(
                    invitations.email,
                    email
                ),
                eq(
                    invitations.resourceType,
                    resourceType
                ),
                eq(
                    invitations.resourceId,
                    resourceId
                ),
                eq(
                    invitations.status,
                    "pending"
                )
            )
        );
}
export async function findByEmail(
    email: string
) {
    return db
        .select()
        .from(invitations)
        .where(
            eq(
                invitations.email,
                email.trim().toLowerCase()
            )
        )
        .orderBy(
            desc(invitations.createdAt)
        );
}
export async function findByResource(
    appId: number,
    resourceType: string,
    resourceId: string
) {
    return db
        .select()
        .from(invitations)
        .where(
            and(
                eq(
                    invitations.appId,
                    appId
                ),
                eq(
                    invitations.resourceType,
                    resourceType
                ),
                eq(
                    invitations.resourceId,
                    resourceId
                )
            )
        )
        .orderBy(
            desc(invitations.createdAt)
        );
}


export async function updateStatus(
    id: string,
    status:
        | "pending"
        | "accepted"
        | "declined"
        | "revoked"
        | "expired"
) {
    const update: {
        status: string;
        updatedAt: Date;
        acceptedAt?: Date;
    } = {
        status,
        updatedAt: new Date(),
    };

    if (status === "accepted") {
        update.acceptedAt = new Date();
    }

    const [invitation] =
        await db
            .update(invitations)
            .set(update)
            .where(
                eq(invitations.id, id)
            )
            .returning();

    return invitation ?? null;
}

export async function setAcceptedBy(
    id: string,
    acceptedBy: number
) {
    const [invitation] =
        await db
            .update(invitations)
            .set({
                status: "accepted",
                acceptedBy,
                acceptedAt: new Date(),
                updatedAt: new Date(),
            })
            .where(
                eq(invitations.id, id)
            )
            .returning();

    return invitation ?? null;
}