import type { RequestHandler } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import Administrador from "../models/Administrador";
import { verificarMongoDB } from "../utils/verificarMongoDB";

export const protegerAdministrador: RequestHandler = async (req, res, next) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret || jwtSecret.length < 32) {
    res.status(503).json({
      error: "Autenticación no disponible",
    });
    return;
  }

  const autorizacion = req.headers.authorization;

  if (!autorizacion) {
    res.status(401).json({
      error: "Debes iniciar sesión como administrador",
    });
    return;
  }

  const coincidencia = autorizacion.match(/^Bearer\s+(\S+)$/i);

  if (!coincidencia) {
    res.status(401).json({
      error: "Formato de autorización inválido",
    });
    return;
  }

  const token = coincidencia[1];

  try {
    const datos = jwt.verify(token, jwtSecret, {
      algorithms: ["HS256"],
      issuer: "screenora",
      audience: "screenora-admin",
    });

    if (
      typeof datos === "string" ||
      datos.rol !== "admin" ||
      typeof datos.sub !== "string" ||
      !mongoose.isObjectIdOrHexString(datos.sub)
    ) {
      res.status(403).json({
        error: "No tienes permisos de administrador",
      });
      return;
    }

    if (!verificarMongoDB(res)) return;

    const administrador = await Administrador.exists({
      _id: datos.sub,
    });

    if (!administrador) {
      res.status(401).json({
        error: "La sesión ya no es válida",
      });
      return;
    }

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        error: "Sesión inválida o expirada",
      });
      return;
    }

    console.error("Error al verificar administrador:", error);

    res.status(500).json({
      error: "No se pudo verificar la sesión",
    });
  }
};
