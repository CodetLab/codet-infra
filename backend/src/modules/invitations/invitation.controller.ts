import { Request, Response } from "express";

import * as service from "./invitation.service";

type TokenParams = {
    token: string;
};

type IdParams = {
    id: string;
};

export async function create(
    req: Request,
    res: Response
) {
    const result = await service.create({
        appId: req.body.appId,
        resourceId: req.body.resourceId,
        resourceType: req.body.resourceType,
        resourceAction: req.body.resourceAction,
        email: req.body.email,
        role: req.body.role,
        invitedBy: req.context!.userId!,
    });

    res.status(201).json(result);
}

export async function listMine(
    req: Request,
    res: Response
) {
    const invitations = await service.listMine(
        req.context!.email!
    );

    res.json(invitations);
}

export async function findByToken(
    req: Request<TokenParams>,
    res: Response
) {
    const invitation = await service.findByToken(
        req.params.token
    );

    res.json(invitation);
}

export async function validate(
    req: Request<TokenParams>,
    res: Response
) {
    const invitation = await service.validate(
        req.params.token
    );

    res.json(invitation);
}

export async function accept(
    req: Request<IdParams>,
    res: Response
) {
    const invitation = await service.accept(
        req.params.id,
        req.context!.userId!,
        req.context!.email!
    );

    res.json(invitation);
}

export async function decline(
    req: Request<IdParams>,
    res: Response
) {
    const invitation = await service.decline(
        req.params.id,
        req.context!.email!
    );

    res.json(invitation);
}

export async function revoke(
    req: Request<IdParams>,
    res: Response
) {
    const invitation = await service.revoke(
        req.params.id
    );

    res.json(invitation);
}

export async function expire(
    req: Request<IdParams>,
    res: Response
) {
    const invitation = await service.expire(
        req.params.id
    );

    res.json(invitation);
}

export async function listByResource(
    req: Request,
    res: Response
) {
    const invitations =
        await service.listByResource(
            Number(req.query.appId),
            req.query.resourceType as string,
            req.query.resourceId as string
        );

    res.json(invitations);
}