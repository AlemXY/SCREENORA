import "dotenv/config";
import mongoose from "mongoose";

import Categoria from "../models/Categoria";

const categorias = [
  {
    nombre: "Acción",
    descripcion: "Películas y series de acción, aventura y combate.",
    foto: "/imagenes/banner/the-boys.jpg",
  },
  {
    nombre: "Drama",
    descripcion: "Historias intensas sobre emociones y relaciones humanas.",
    foto: "/imagenes/banner/goodfellas.jpg",
  },
  {
    nombre: "Ciencia ficción",
    descripcion: "Historias de tecnología, futuro y mundos extraordinarios.",
    foto: "/imagenes/banner/dark.jpg",
  },
];

const inicializarCategorias = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;
  const nombreBaseDatos = process.env.MONGODB_DB_NAME;

  if (!uri) {
    throw new Error("No se encontró MONGODB_URI.");
  }

  if (nombreBaseDatos !== "screenora_pa3_desarrollo") {
    throw new Error("Base de datos incorrecta. Operación cancelada.");
  }

  await mongoose.connect(uri, {
    dbName: nombreBaseDatos,
  });

  console.log("Conectado con MongoDB Atlas.");

  for (const categoria of categorias) {
    await Categoria.updateOne(
      { nombre: categoria.nombre },
      { $set: categoria },
      { upsert: true, runValidators: true },
    );
  }

  console.log("3 categorías registradas correctamente.");
};

const ejecutar = async (): Promise<void> => {
  try {
    await inicializarCategorias();
  } catch (error) {
    console.error(
      "Error al inicializar categorías:",
      error instanceof Error ? error.message : "Error desconocido",
    );

    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
};

void ejecutar();
