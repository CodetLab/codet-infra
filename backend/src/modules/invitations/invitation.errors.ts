export class InvitationNotFoundError extends Error {
    constructor() {
        super("Invitation not found.");
    }
}

export class InvitationAlreadyExistsError extends Error {
    constructor() {
        super("A pending invitation already exists.");
    }
}

export class InvitationExpiredError extends Error {
    constructor() {
        super("Invitation has expired.");
    }
}

export class InvitationNotPendingError extends Error {
    constructor() {
        super("Invitation is no longer pending.");
    }
}