import "dotenv/config";

import mongoose from "mongoose";
import Contenido from "../models/Contenido";

type TipoContenido = "Película" | "Serie";

type DatosContenido = {
  titulo: string;
  tipo: TipoContenido;
  genero: string;
  año: number;
  duracion_minutos: number;
  clasificacion: string;
  puntuacion: number;
};

const normalizarTipo = (valor: unknown): TipoContenido | null => {
  if (typeof valor !== "string") {
    return null;
  }

  const tipo = valor
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (tipo === "pelicula" || tipo === "peliculas") {
    return "Película";
  }

  if (tipo === "serie" || tipo === "series") {
    return "Serie";
  }

  return null;
};

const convertirContenido = (valor: unknown): DatosContenido | null => {
  if (typeof valor !== "object" || valor === null || Array.isArray(valor)) {
    return null;
  }

  const dato = valor as Record<string, unknown>;

  const titulo = String(dato.titulo ?? "").trim();
  const tipo = normalizarTipo(dato.tipo);
  const genero = String(dato.genero ?? "").trim();
  const año = Number(dato.año);

  const duracion_minutos = Number(dato.duracion_minutos);

  const clasificacion = String(dato.clasificacion ?? "").trim();

  const puntuacion = Number(String(dato.puntuacion ?? "").replace(",", "."));

  if (
    titulo.length < 2 ||
    !tipo ||
    !genero ||
    !clasificacion ||
    !Number.isInteger(año) ||
    año < 1888 ||
    año > 2100 ||
    !Number.isInteger(duracion_minutos) ||
    duracion_minutos < 1 ||
    !Number.isFinite(puntuacion) ||
    puntuacion < 0 ||
    puntuacion > 10
  ) {
    return null;
  }

  return {
    titulo,
    tipo,
    genero,
    año,
    duracion_minutos,
    clasificacion,
    puntuacion,
  };
};

const migrarContenidos = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("No se encontró MONGODB_URI en el archivo .env");
  }

  console.log("Consultando catálogo de MySQL...");

  const respuesta = await fetch("https://alem.alwaysdata.net/contenidos");

  if (!respuesta.ok) {
    throw new Error(`No se pudo consultar la API: ${respuesta.status}`);
  }

  const datos: unknown = await respuesta.json();

  if (!Array.isArray(datos)) {
    throw new Error("La API no devolvió un arreglo de contenidos");
  }

  console.log(`Contenidos encontrados: ${datos.length}`);

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log("Conectado con MongoDB Atlas");

  let creados = 0;
  let actualizados = 0;
  let omitidos = 0;

  for (const item of datos) {
    const contenido = convertirContenido(item);

    if (!contenido) {
      omitidos++;
      console.warn("Se omitió un registro con datos inválidos");
      continue;
    }

    try {
      const resultado = await Contenido.updateOne(
        {
          titulo: contenido.titulo,
          tipo: contenido.tipo,
        },
        {
          $set: contenido,
        },
        {
          upsert: true,
          runValidators: true,
        },
      );

      if (resultado.upsertedCount > 0) {
        creados++;
        console.log(`CREADO: ${contenido.titulo}`);
      } else {
        actualizados++;
        console.log(`ACTUALIZADO: ${contenido.titulo}`);
      }
    } catch (error) {
      omitidos++;
      console.error(`Error al migrar ${contenido.titulo}:`, error);
    }
  }

  console.log("\nMigración finalizada");
  console.log(`Creados: ${creados}`);
  console.log(`Actualizados: ${actualizados}`);
  console.log(`Omitidos: ${omitidos}`);
};

const ejecutar = async (): Promise<void> => {
  try {
    await migrarContenidos();
  } catch (error) {
    console.error("Error de migración:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

void ejecutar();
