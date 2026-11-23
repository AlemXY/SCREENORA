import "dotenv/config";
import mongoose from "mongoose";

import Director from "../models/Director";

const directores = [
  {
    nombre: "Martin Scorsese",
    obraRelacionada: "Goodfellas",
    tipoProduccion: "Cine",
    imagen: "/imagenes/directores/martin-scorsese.jpg",
  },
  {
    nombre: "Damien Chazelle",
    obraRelacionada: "Whiplash",
    tipoProduccion: "Cine",
    imagen: "/imagenes/directores/damien-chazelle.jpg",
  },
  {
    nombre: "Baran bo Odar",
    obraRelacionada: "Dark",
    tipoProduccion: "Serie",
    imagen: "/imagenes/directores/baran-bo-odar.jpg",
  },
  {
    nombre: "Vince Gilligan",
    obraRelacionada: "Better Call Saul",
    tipoProduccion: "Serie",
    imagen: "/imagenes/directores/vince-gilligan.jpg",
  },
  {
    nombre: "Arnaud Delord",
    obraRelacionada: "Arcane",
    tipoProduccion: "Animación",
    imagen: "/imagenes/directores/arnaud-delord.jpg",
  },
  {
    nombre: "Philip Sgriccia",
    obraRelacionada: "The Boys",
    tipoProduccion: "Serie",
    imagen: "/imagenes/directores/philip-sgriccia.jpg",
  },
];

const inicializarDirectores = async (): Promise<void> => {
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

  for (const director of directores) {
    await Director.updateOne(
      { nombre: director.nombre },
      { $set: director },
      { upsert: true, runValidators: true },
    );
  }

  console.log(`${directores.length} directores registrados correctamente.`);
};

const ejecutar = async (): Promise<void> => {
  try {
    await inicializarDirectores();
  } catch (error) {
    console.error(
      "Error al inicializar directores:",
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
