import "dotenv/config";
import mongoose from "mongoose";

import Categoria from "../models/Categoria";
import Producto from "../models/Producto";

const productos = [
  {
    titulo: "The Boys",
    tipo: "Serie",
    año: 2019,
    descripcion:
      "Un grupo de vigilantes intenta detener a superhéroes corruptos que abusan de sus poderes.",
    imagen: "/imagenes/estrenos/the-boys.jpg",
    categoria: "Acción y aventura",
  },
  {
    titulo: "Arcane",
    tipo: "Serie",
    año: 2021,
    descripcion:
      "Dos hermanas quedan enfrentadas en medio del conflicto entre las ciudades de Piltover y Zaun.",
    imagen: "/imagenes/estrenos/arcane.jpg",
    categoria: "Acción y aventura",
  },
  {
    titulo: "Mad Max: Fury Road",
    tipo: "Película",
    año: 2015,
    descripcion:
      "En un mundo desértico, Max se une a Furiosa en una peligrosa persecución por la supervivencia.",
    imagen: "/imagenes/productos/mad-max-fury-road.jpg",
    categoria: "Acción y aventura",
  },
  {
    titulo: "Dune: Part Two",
    tipo: "Película",
    año: 2024,
    descripcion:
      "Paul Atreides se une a los Fremen y afronta su destino en el planeta Arrakis.",
    imagen: "/imagenes/productos/dune-part-two.jpg",
    categoria: "Acción y aventura",
  },
  {
    titulo: "Goodfellas",
    tipo: "Película",
    año: 1990,
    descripcion:
      "La historia de Henry Hill y su ascenso dentro del mundo del crimen organizado.",
    imagen: "/imagenes/estrenos/goodfellas.jpg",
    categoria: "Drama",
  },
  {
    titulo: "Whiplash",
    tipo: "Película",
    año: 2014,
    descripcion:
      "Un joven baterista busca alcanzar la excelencia bajo la exigente dirección de su instructor.",
    imagen: "/imagenes/estrenos/whiplash.jpg",
    categoria: "Drama",
  },
  {
    titulo: "Better Call Saul",
    tipo: "Serie",
    año: 2015,
    descripcion:
      "Jimmy McGill atraviesa una transformación que lo acerca al mundo del abogado Saul Goodman.",
    imagen: "/imagenes/estrenos/better-call-saul.jpg",
    categoria: "Drama",
  },
  {
    titulo: "Interstellar",
    tipo: "Película",
    año: 2014,
    descripcion:
      "Un grupo de astronautas viaja más allá de la Tierra en busca de un futuro para la humanidad.",
    imagen: "/imagenes/productos/interstellar.jpg",
    categoria: "Drama",
  },
  {
    titulo: "Dark",
    tipo: "Serie",
    año: 2017,
    descripcion:
      "La desaparición de un niño revela secretos familiares y conexiones entre distintas épocas.",
    imagen: "/imagenes/estrenos/dark.jpg",
    categoria: "Misterio y suspenso",
  },
  {
    titulo: "Inception",
    tipo: "Película",
    año: 2010,
    descripcion:
      "Un especialista en extraer secretos de los sueños recibe una misión aparentemente imposible.",
    imagen: "/imagenes/productos/inception.jpg",
    categoria: "Misterio y suspenso",
  },
  {
    titulo: "Obsession",
    tipo: "Película",
    año: 2026,
    descripcion:
      "Un deseo obsesivo desencadena acontecimientos sobrenaturales y aterradores.",
    imagen: "/imagenes/estrenos/obsession.jpg",
    categoria: "Misterio y suspenso",
  },
  {
    titulo: "Las ovejas detectives",
    tipo: "Película",
    año: 2026,
    descripcion:
      "Un rebaño de ovejas decide investigar la misteriosa muerte de su pastor.",
    imagen: "/imagenes/estrenos/ovejas-detectives.jpg",
    categoria: "Misterio y suspenso",
  },
];

const inicializarProductos = async (): Promise<void> => {
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

  const categorias = await Categoria.find();

  const categoriaPorNombre = new Map(
    categorias.map(({ nombre, _id }) => [nombre, _id]),
  );

  for (const producto of productos) {
    const categoriaId = categoriaPorNombre.get(producto.categoria);

    if (!categoriaId) {
      throw new Error(`No se encontró la categoría: ${producto.categoria}`);
    }

    const { categoria, ...datos } = producto;

    await Producto.updateOne(
      { titulo: producto.titulo },
      {
        $set: {
          ...datos,
          categoria: categoriaId,
        },
      },
      {
        upsert: true,
        runValidators: true,
      },
    );
  }

  console.log(`${productos.length} productos registrados correctamente.`);

  for (const categoria of categorias) {
    const total = await Producto.countDocuments({
      categoria: categoria._id,
    });

    console.log(`${categoria.nombre}: ${total} productos`);
  }
};

const ejecutar = async (): Promise<void> => {
  try {
    await inicializarProductos();
  } catch (error) {
    console.error(
      "Error al inicializar productos:",
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
