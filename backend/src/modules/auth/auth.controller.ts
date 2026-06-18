import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";
import { AppRequest } from "../../core/types/app-request";

export const register = async (
  req: AppRequest,
  res: Response
) => {
  try {

    console.log("REGISTER CONTEXT", req.context);

    const { email, password } = req.body;

    const user = await registerUser(
      email,
      password,
      req.context?.appId!
    );

    res.json(user);

  } catch (err: any) {
    res.status(400).json({
      error: err.message,
    });
  }
};

export const login = async (req: AppRequest, res: Response) => {
  try {
    const { email, password} = req.body;

    const data = await loginUser(email, password, req.context?.appId!);

    res.json(data);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};