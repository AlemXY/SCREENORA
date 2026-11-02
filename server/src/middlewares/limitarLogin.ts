import { rateLimit } from "express-rate-limit";

export const limitarLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    error: "Demasiados intentos. Inténtalo nuevamente en 15 minutos.",
  },
});
