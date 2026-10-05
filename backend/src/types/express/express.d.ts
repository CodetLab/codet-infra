import "express";

declare global {
  namespace Express {
    interface Request {
      context?: {
        userId?: number;
        appId?: number;
        email?: string;
        role?: string;
      };
    }
  }
}

export {};