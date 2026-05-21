import { Request } from "express";

export interface AppRequest extends Request {
  context: {
    appId: number;
    userId?: number;
    role?: string;
  };
}