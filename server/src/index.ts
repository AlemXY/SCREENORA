import "dotenv/config";

import express, { type Request, type Response } from "express";

import mongoose from "mongoose";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import contenidoRoutes from "./routes/contenidoRoutes";
import { listarContenidos } from "./controllers/contenidoController";
import miListaRoutes from "./routes/miListaRoutes";

const app = express();

if (process.env.RENDER === "true") {
  app.set("trust proxy", 1);
}

const port = Number(process.env.PORT) || 3000;
const host = process.env.HOST || "0.0.0.0";

const origenesPermitidos = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://screenora.netlify.app",
];

app.use(
  cors({
    origin: (origen, callback) => {
      if (!origen || origenesPermitidos.includes(origen)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },

    methods: ["GET", "POST", "PUT", "DELETE"],

    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "100kb" }));
app.use("/api/auth", authRoutes);

app.use("/api/contenidos", contenidoRoutes);

app.use("/api/mi-lista", miListaRoutes);

app.get("/contenidos", listarContenidos);

// ==========================================
// CONEXIÓN CON MONGODB ATLAS
// ==========================================

const conectarMongoDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn("No se encontró MONGODB_URI");
    return;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      family: 4,
      dbName: process.env.MONGODB_DB_NAME || undefined,
    });

    console.log("Conexión exitosa con MongoDB Atlas");
    console.log("Base de datos activa:", mongoose.connection.name);
  } catch (error) {
    console.error(
      "Error al conectar con MongoDB:",
      error instanceof Error ? error.message : "Error desconocido",
    );

    type DetalleErrorMongo = {
      reason?: {
        servers?: Map<
          string,
          {
            error?: Error & {
              code?: string;
              cause?: {
                code?: string;
              };
            };
          }
        >;
      };
    };

    const detalles = error as DetalleErrorMongo;

    if (detalles.reason?.servers) {
      for (const [servidor, informacion] of detalles.reason.servers) {
        const problema = informacion.error;

        if (problema) {
          console.error("Nodo MongoDB:", servidor);
          console.error("Tipo de error:", problema.name);
          console.error(
            "Código:",
            problema.code ?? problema.cause?.code ?? "No disponible",
          );
          console.error("Detalle:", problema.message);
        }
      }
    }
  }
};

// ==========================================
// ESTADO DE MONGODB
// ==========================================

app.get("/estado-mongodb", async (_req: Request, res: Response) => {
  const conectado = mongoose.connection.readyState === 1;

  res.status(conectado ? 200 : 503).json({
    mongodb: conectado ? "Conectado" : "Desconectado",
  });
});

// ==========================================
// INICIAR EL SERVIDOR
// ==========================================

app.listen(port, host, () => {
  console.log(`Servidor ejecutándose en ${host}:${port}`);
});

void conectarMongoDB();
