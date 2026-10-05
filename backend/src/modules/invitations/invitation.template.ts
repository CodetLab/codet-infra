type InvitationTemplateInput = {
    inviterName: string;
    resourceName: string;
    resourceType: string;
    acceptUrl: string;
};

export function buildInvitationTemplate(
    input: InvitationTemplateInput
) {
    return `
        <h2>Has sido invitado</h2>

        <p>
            ${input.inviterName}
            te invitó a un
            ${input.resourceType}.
        </p>

        <p>
            <strong>
                ${input.resourceName}
            </strong>
        </p>

        <a href="${input.acceptUrl}">
            Aceptar invitación
        </a>
    `;
}