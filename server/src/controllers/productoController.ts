import type { RequestHandler } from "express";
import mongoose from "mongoose";

import Producto from "../models/Producto";
import { verificarMongoDB } from "../utils/verificarMongoDB";

export const listarProductosPorCategoria: RequestHandler = async (req, res) => {
  if (!verificarMongoDB(res)) return;

  const categoria = req.query.categoria;

  if (
    typeof categoria !== "string" ||
    !mongoose.isObjectIdOrHexString(categoria)
  ) {
    res.status(400).json({
      success: false,
      error: "El parámetro categoria es obligatorio y debe ser válido",
    });
    return;
  }

  try {
    const productos = await Producto.find({
      categoria,
    })
      .sort({ titulo: 1 })
      .populate("categoria", "nombre")
      .lean();

    res.status(200).json({
      success: true,
      data: productos,
    });
  } catch (error) {
    console.error("Error al obtener productos:", error);

    res.status(500).json({
      success: false,
      error: "No se pudieron obtener los productos",
    });
  }
};
