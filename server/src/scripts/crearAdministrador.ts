import "dotenv/config";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import Administrador from "../models/Administrador";

const crearAdministrador = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  const correo = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  const password = process.env.ADMIN_PASSWORD;

  if (!uri) {
    throw new Error("No se encontró MONGODB_URI.");
  }

  if (!correo || !password) {
    throw new Error("Faltan ADMIN_EMAIL o ADMIN_PASSWORD.");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    throw new Error("El correo del administrador no es válido.");
  }

  if (password.length < 12) {
    throw new Error("La contraseña debe tener al menos 12 caracteres.");
  }

  const nombreBaseDatos = process.env.MONGODB_DB_NAME;

  if (nombreBaseDatos !== "screenora_pa3_desarrollo") {
    throw new Error(
      "Operación cancelada: debes seleccionar screenora_pa3_desarrollo.",
    );
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    dbName: nombreBaseDatos,
  });

  console.log("Conectado con MongoDB Atlas.");

  // Por ahora permitimos un solo administrador.
  const administradorExistente = await Administrador.exists({});

  if (administradorExistente) {
    console.log("Ya existe un administrador. No se creó otra cuenta.");
    return;
  }

  // Nunca guardamos la contraseña original.
  const passwordHash = await bcrypt.hash(password, 12);

  await Administrador.create({
    correo,
    passwordHash,
  });

  console.log("Administrador creado correctamente.");
};

const ejecutar = async (): Promise<void> => {
  try {
    await crearAdministrador();
  } catch (error) {
    console.error(
      "No se pudo crear el administrador:",
      error instanceof Error ? error.message : "Error desconocido",
    );

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

void ejecutar();
