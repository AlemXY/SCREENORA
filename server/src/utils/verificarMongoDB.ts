import mongoose from "mongoose";
import type { Response } from "express";

export const verificarMongoDB = (res: Response): boolean => {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  res.status(503).json({
    error: "MongoDB no está disponible",
  });

  return false;
};
