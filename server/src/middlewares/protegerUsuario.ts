import type { RequestHandler } from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import Usuario from "../models/Usuario";
import { verificarMongoDB } from "../utils/verificarMongoDB";

export const protegerUsuario: RequestHandler = async (req, res, next) => {
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
      error: "Debes iniciar sesión",
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
      audience: "screenora-user",
    });

    if (
      typeof datos === "string" ||
      datos.rol !== "usuario" ||
      typeof datos.sub !== "string" ||
      !mongoose.isObjectIdOrHexString(datos.sub)
    ) {
      res.status(403).json({
        error: "No tienes permisos para acceder",
      });
      return;
    }

    if (!verificarMongoDB(res)) return;

    const usuario = await Usuario.findById(datos.sub).select("nombre correo");

    if (!usuario) {
      res.status(401).json({
        error: "La sesión ya no es válida",
      });
      return;
    }

    res.locals.usuario = {
      id: usuario._id.toString(),
      nombre: usuario.nombre,
      correo: usuario.correo,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        error: "Sesión inválida o expirada",
      });
      return;
    }

    console.error("Error al verificar usuario:", error);

    res.status(500).json({
      error: "No se pudo verificar la sesión",
    });
  }
};
