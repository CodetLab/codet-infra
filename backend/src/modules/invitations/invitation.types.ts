export type InvitationStatus =
    | "pending"
    | "accepted"
    | "declined"
    | "revoked"
    | "expired";

export type InvitationResourceType =
    | "organization"
    | "team";

export type InvitationResourceAction =
    | "join";

export interface CreateInvitationInput {
    resourceId: string;
    resourceType: InvitationResourceType;
    resourceAction: InvitationResourceAction;
    email: string;
    role: string;
    invitedBy: number;
}