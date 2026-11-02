import "dotenv/config";

import mongoose from "mongoose";
import Contenido from "../models/Contenido";

const BASE_ORIGEN = "screenora";
const BASE_DESTINO = "screenora_pa3_desarrollo";

const copiarContenidos = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("No se encontró MONGODB_URI");
  }

  // Verificación de seguridad
  if (process.env.MONGODB_DB_NAME !== BASE_DESTINO) {
    throw new Error("La base de desarrollo no está configurada correctamente.");
  }

  // Dos conexiones independientes
  const origen = mongoose.createConnection(uri, {
    dbName: BASE_ORIGEN,
    serverSelectionTimeoutMS: 10000,
    family: 4,
  });

  const destino = mongoose.createConnection(uri, {
    dbName: BASE_DESTINO,
    serverSelectionTimeoutMS: 10000,
    family: 4,
  });

  try {
    await origen.asPromise();
    await destino.asPromise();

    const dbOrigen = origen.db;

    if (
      !dbOrigen ||
      origen.name !== BASE_ORIGEN ||
      destino.name !== BASE_DESTINO
    ) {
      throw new Error("No se pudieron verificar las bases de datos.");
    }

    console.log("Origen:", origen.name);
    console.log("Destino:", destino.name);

    // Leer los contenidos originales
    const contenidos = await dbOrigen
      .collection("contenidos")
      .find({})
      .toArray();

    console.log("Contenidos encontrados:", contenidos.length);

    if (contenidos.length === 0) {
      console.log("No hay contenidos para copiar.");
      return;
    }

    // Modelo asociado exclusivamente a la base destino
    const ContenidoDestino = destino.model(
      "ContenidoDesarrollo",
      Contenido.schema,
      "contenidos",
    );

    let creados = 0;
    let actualizados = 0;

    for (const item of contenidos) {
      const datos = {
        titulo: item.titulo,
        tipo: item.tipo,
        genero: item.genero,
        año: item.año,
        duracion_minutos: item.duracion_minutos,
        clasificacion: item.clasificacion,
        puntuacion: item.puntuacion,
      };

      const resultado = await ContenidoDestino.updateOne(
        {
          titulo: datos.titulo,
          tipo: datos.tipo,
        },
        {
          $set: datos,
        },
        {
          upsert: true,
          runValidators: true,
        },
      );

      if (resultado.upsertedCount > 0) {
        creados++;
      } else {
        actualizados++;
      }
    }

    console.log("Copia finalizada correctamente.");
    console.log("Creados:", creados);
    console.log("Actualizados:", actualizados);
  } finally {
    await Promise.allSettled([origen.close(), destino.close()]);
  }
};

copiarContenidos().catch((error: unknown) => {
  console.error("Error al copiar contenidos:", error);
  process.exitCode = 1;
});
