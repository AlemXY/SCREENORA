import type { RequestHandler } from "express";
import Director from "../models/Director";
import { verificarMongoDB } from "../utils/verificarMongoDB";

export const listarDirectores: RequestHandler = async (_req, res) => {
  if (!verificarMongoDB(res)) return;

  try {
    const directores = await Director.find().sort({
      nombre: 1,
    });

    res.status(200).json({
      success: true,
      data: directores,
    });
  } catch (error) {
    console.error("Error al obtener directores:", error);

    res.status(500).json({
      success: false,
      error: "No se pudieron obtener los directores",
    });
  }
};
