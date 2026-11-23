import "dotenv/config";
import mongoose from "mongoose";

import Categoria from "../models/Categoria";

const cambios = [
  {
    anterior: "Acción",
    datos: {
      nombre: "Acción y aventura",
      descripcion: "Películas y series llenas de acción y aventura.",
      foto: "/imagenes/banner/the-boys.jpg",
    },
  },
  {
    anterior: "Ciencia ficción",
    datos: {
      nombre: "Misterio y suspenso",
      descripcion: "Historias de misterio, investigación y suspenso.",
      foto: "/imagenes/banner/dark.jpg",
    },
  },
];

const actualizarCategorias = async (): Promise<void> => {
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

  for (const cambio of cambios) {
    const resultado = await Categoria.updateOne(
      { nombre: cambio.anterior },
      { $set: cambio.datos },
      { runValidators: true },
    );

    if (resultado.matchedCount !== 1) {
      throw new Error(`No se encontró la categoría ${cambio.anterior}.`);
    }
  }

  console.log("Categorías actualizadas correctamente.");
};

const ejecutar = async (): Promise<void> => {
  try {
    await actualizarCategorias();
  } catch (error) {
    console.error(
      "Error al actualizar categorías:",
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
