import crypto from "node:crypto";

import * as repository from "./invitation.repository";

import {
    InvitationNotFoundError,
    InvitationAlreadyExistsError,
    InvitationExpiredError,
    InvitationNotPendingError,
} from "./invitation.errors";

export async function create(input: {
    appId: number;
    resourceId: string;
    resourceType: string;
    resourceAction: string;
    email: string;
    role: string;
    invitedBy: number;
}) {
    const email =
        input.email.trim().toLowerCase();

    const existing =
        await repository.findPending(
            input.appId,
            email,
            input.resourceType,
            input.resourceId
        );

    if (existing.length > 0) {
        throw new InvitationAlreadyExistsError();
    }

    const token =
        crypto.randomUUID();

    const tokenHash =
        crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

    const expiresAt =
        new Date(
            Date.now() +
            1000 * 60 * 60 * 24 * 7
        ).toISOString();

    const invitation =
        await repository.create({
            ...input,
            email,
            tokenHash,
            expiresAt,
        });

    return {
        invitation,
        token,
    };
}

export async function findByToken(
    token: string
) {
    const tokenHash =
        crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

    const invitation =
        await repository.findByTokenHash(
            tokenHash
        );

    if (!invitation) {
        throw new InvitationNotFoundError();
    }

    return invitation;
}

export async function validate(
    token: string
) {
    const invitation =
        await findByToken(token);

    if (invitation.status !== "pending") {
        throw new InvitationNotPendingError();
    }

    if (
        new Date(invitation.expiresAt) <
        new Date()
    ) {
        await repository.updateStatus(
            invitation.id,
            "expired"
        );

        throw new InvitationExpiredError();
    }

    return invitation;
}

export async function accept(
    id: string,
    acceptedBy: number,
    email: string
) {
    const invitation =
        await repository.findById(id);

    if (!invitation) {
        throw new InvitationNotFoundError();
    }

    if (
        invitation.email !==
        email.trim().toLowerCase()
    ) {
        throw new InvitationNotFoundError();
    }

    if (invitation.status !== "pending") {
        throw new InvitationNotPendingError();
    }

    if (
        new Date(invitation.expiresAt) <
        new Date()
    ) {
        await repository.updateStatus(
            id,
            "expired"
        );

        throw new InvitationExpiredError();
    }

    return repository.setAcceptedBy(
        id,
        acceptedBy
    );
}

export async function decline(
    id: string,
    email: string
) {
    const invitation =
        await repository.findById(id);

    if (!invitation) {
        throw new InvitationNotFoundError();
    }

    if (
        invitation.email !==
        email.trim().toLowerCase()
    ) {
        throw new InvitationNotFoundError();
    }

    if (invitation.status !== "pending") {
        throw new InvitationNotPendingError();
    }

    if (
        new Date(invitation.expiresAt) <
        new Date()
    ) {
        await repository.updateStatus(
            id,
            "expired"
        );

        throw new InvitationExpiredError();
    }

    return repository.updateStatus(
        id,
        "declined"
    );
}

export async function revoke(
    id: string
) {
    const invitation =
        await repository.findById(id);

    if (!invitation) {
        throw new InvitationNotFoundError();
    }

    return repository.updateStatus(
        id,
        "revoked"
    );
}

export async function expire(
    id: string
) {
    const invitation =
        await repository.findById(id);

    if (!invitation) {
        throw new InvitationNotFoundError();
    }

    return repository.updateStatus(
        id,
        "expired"
    );
}

export async function listByResource(
    appId: number,
    resourceType: string,
    resourceId: string
) {
    return repository.findByResource(
        appId,
        resourceType,
        resourceId
    );
}

export async function listMine(
    email: string
) {
    return repository.findByEmail(
        email.trim().toLowerCase()
    );
}