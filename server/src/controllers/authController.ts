import type { RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import mongoose from "mongoose";
import Usuario from "../models/Usuario";

import Administrador from "../models/Administrador";
import { verificarMongoDB } from "../utils/verificarMongoDB";

// Iniciar sesión como administrador
export const iniciarSesion: RequestHandler = async (req, res) => {
  if (!verificarMongoDB(res)) return;

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret || jwtSecret.length < 32) {
    res.status(503).json({
      error: "Autenticación no disponible",
    });
    return;
  }

  if (
    typeof req.body !== "object" ||
    req.body === null ||
    Array.isArray(req.body)
  ) {
    res.status(400).json({
      error: "Debes enviar correo y contraseña",
    });
    return;
  }

  const { correo, password } = req.body;

  if (
    typeof correo !== "string" ||
    typeof password !== "string" ||
    !correo.trim() ||
    !password
  ) {
    res.status(400).json({
      error: "Correo y contraseña son obligatorios",
    });
    return;
  }

  try {
    const administrador = await Administrador.findOne({
      correo: correo.trim().toLowerCase(),
    }).select("+passwordHash");

    if (!administrador) {
      res.status(401).json({
        error: "Correo o contraseña incorrectos",
      });
      return;
    }

    const contraseñaCorrecta = await bcrypt.compare(
      password,
      administrador.passwordHash,
    );

    if (!contraseñaCorrecta) {
      res.status(401).json({
        error: "Correo o contraseña incorrectos",
      });
      return;
    }

    const token = jwt.sign({ rol: "admin" }, jwtSecret, {
      subject: administrador._id.toString(),
      expiresIn: "2h",
      issuer: "screenora",
      audience: "screenora-admin",
      algorithm: "HS256",
    });

    res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      token,
      tipo: "Bearer",
      expiraEn: "2h",
      administrador: {
        correo: administrador.correo,
      },
    });
  } catch (error) {
    console.error("Error durante el login:", error);

    res.status(500).json({
      error: "No se pudo iniciar sesión",
    });
  }
};

// Verificar la sesión del administrador
export const verificarSesion: RequestHandler = (_req, res) => {
  res.status(200).json({
    autenticado: true,
    rol: "admin",
    mensaje: "Sesión de administrador válida",
  });
};

// ==========================================
// REGISTRO DE USUARIOS
// ==========================================

export const registrarUsuario: RequestHandler = async (req, res) => {
  if (!verificarMongoDB(res)) return;

  if (
    typeof req.body !== "object" ||
    req.body === null ||
    Array.isArray(req.body)
  ) {
    res.status(400).json({
      error: "Debes enviar los datos del usuario",
    });
    return;
  }

  const { nombre, correo, password } = req.body;

  if (
    typeof nombre !== "string" ||
    typeof correo !== "string" ||
    typeof password !== "string"
  ) {
    res.status(400).json({
      error: "Nombre, correo y contraseña son obligatorios",
    });
    return;
  }

  const nombreLimpio = nombre.trim();
  const correoLimpio = correo.trim().toLowerCase();

  if (nombreLimpio.length < 2 || nombreLimpio.length > 80) {
    res.status(400).json({
      error: "El nombre debe tener entre 2 y 80 caracteres",
    });
    return;
  }

  if (
    correoLimpio.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio)
  ) {
    res.status(400).json({
      error: "Ingresa un correo válido",
    });
    return;
  }

  if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
    res.status(400).json({
      error:
        "La contraseña debe tener al menos 8 caracteres y no superar 72 bytes",
    });
    return;
  }

  try {
    const usuarioExistente = await Usuario.exists({
      correo: correoLimpio,
    });

    const administradorExistente = await Administrador.exists({
      correo: correoLimpio,
    });

    if (usuarioExistente || administradorExistente) {
      res.status(409).json({
        error: "El correo ya está registrado",
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const nuevoUsuario = await Usuario.create({
      nombre: nombreLimpio,
      correo: correoLimpio,
      passwordHash,
    });

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: {
        id: nuevoUsuario._id.toString(),
        nombre: nuevoUsuario.nombre,
        correo: nuevoUsuario.correo,
      },
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      res.status(409).json({
        error: "El correo ya está registrado",
      });
      return;
    }

    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({
        error: "Datos de usuario inválidos",
        detalles: Object.values(error.errors).map((detalle) => detalle.message),
      });
      return;
    }

    console.error("Error durante el registro:", error);

    res.status(500).json({
      error: "No se pudo registrar el usuario",
    });
  }
};

// ==========================================
// INICIO DE SESIÓN DE USUARIOS
// ==========================================

export const iniciarSesionUsuario: RequestHandler = async (req, res) => {
  if (!verificarMongoDB(res)) return;

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret || jwtSecret.length < 32) {
    res.status(503).json({
      error: "Autenticación no disponible",
    });
    return;
  }

  if (
    typeof req.body !== "object" ||
    req.body === null ||
    Array.isArray(req.body)
  ) {
    res.status(400).json({
      error: "Debes enviar correo y contraseña",
    });
    return;
  }

  const { correo, password } = req.body;

  if (
    typeof correo !== "string" ||
    typeof password !== "string" ||
    !correo.trim() ||
    !password
  ) {
    res.status(400).json({
      error: "Correo y contraseña son obligatorios",
    });
    return;
  }

  try {
    const usuario = await Usuario.findOne({
      correo: correo.trim().toLowerCase(),
    }).select("+passwordHash");

    if (!usuario) {
      res.status(401).json({
        error: "Correo o contraseña incorrectos",
      });
      return;
    }

    const contraseñaCorrecta = await bcrypt.compare(
      password,
      usuario.passwordHash,
    );

    if (!contraseñaCorrecta) {
      res.status(401).json({
        error: "Correo o contraseña incorrectos",
      });
      return;
    }

    const token = jwt.sign({ rol: "usuario" }, jwtSecret, {
      subject: usuario._id.toString(),
      expiresIn: "2h",
      issuer: "screenora",
      audience: "screenora-user",
      algorithm: "HS256",
    });

    res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      token,
      tipo: "Bearer",
      expiraEn: "2h",
      usuario: {
        id: usuario._id.toString(),
        nombre: usuario.nombre,
        correo: usuario.correo,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión de usuario:", error);

    res.status(500).json({
      error: "No se pudo iniciar sesión",
    });
  }
};

// ==========================================
// VERIFICAR SESIÓN DE USUARIO
// ==========================================

export const verificarSesionUsuario: RequestHandler = (_req, res) => {
  res.status(200).json({
    autenticado: true,
    rol: "usuario",
    usuario: res.locals.usuario,
  });
};
