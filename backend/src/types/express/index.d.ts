// src/types/express.d.ts
import * as express from "express";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}
export {};
