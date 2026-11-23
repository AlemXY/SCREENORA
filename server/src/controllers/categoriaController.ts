import type { RequestHandler } from "express";

import Categoria from "../models/Categoria";
import Producto from "../models/Producto";
import { verificarMongoDB } from "../utils/verificarMongoDB";

export const listarCategorias: RequestHandler = async (_req, res) => {
  if (!verificarMongoDB(res)) return;

  try {
    const categorias = await Categoria.find()
      .sort({
        nombre: 1,
      })
      .lean();

    const categoriasConTotal = await Promise.all(
      categorias.map(async (categoria) => ({
        ...categoria,
        total: await Producto.countDocuments({
          categoria: categoria._id,
        }),
      })),
    );

    res.status(200).json({
      success: true,
      data: categoriasConTotal,
    });
  } catch (error) {
    console.error("Error al obtener categorías:", error);

    res.status(500).json({
      success: false,
      error: "No se pudieron obtener las categorías",
    });
  }
};
