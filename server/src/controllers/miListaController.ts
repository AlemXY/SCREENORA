import type { RequestHandler, Response } from "express";
import mongoose from "mongoose";

import ItemLista from "../models/ItemLista";
import { verificarMongoDB } from "../utils/verificarMongoDB";

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

const esObjetoJSON = (valor: unknown): valor is Record<string, unknown> => {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
};

const obtenerUsuarioId = (res: Response): string => {
  const usuario = res.locals.usuario as { id: string };
  return usuario.id;
};

const manejarError = (error: unknown, res: Response, mensaje: string): void => {
  if (error instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      error: "Datos inválidos",
      detalles: Object.values(error.errors).map((detalle) => detalle.message),
    });
    return;
  }

  console.error(mensaje, error);

  res.status(500).json({
    error: mensaje,
  });
};

// ==========================================
// GET - LISTAR MIS CONTENIDOS
// ==========================================

export const listarMiLista: RequestHandler = async (_req, res) => {
  if (!verificarMongoDB(res)) return;

  const usuarioId = obtenerUsuarioId(res);

  try {
    const contenidos = await ItemLista.find({
      usuario: usuarioId,
    }).sort({ createdAt: -1 });

    res.status(200).json(contenidos);
  } catch (error) {
    manejarError(error, res, "No se pudo consultar tu lista");
  }
};

// ==========================================
// POST - AGREGAR A MI LISTA
// ==========================================

export const agregarMiLista: RequestHandler = async (req, res) => {
  if (!verificarMongoDB(res)) return;

  if (!esObjetoJSON(req.body)) {
    res.status(400).json({
      error: "Debes enviar un objeto JSON válido",
    });
    return;
  }

  const { titulo, tipo } = req.body;

  if (
    typeof titulo !== "string" ||
    titulo.trim().length < 2 ||
    titulo.trim().length > 150
  ) {
    res.status(400).json({
      error: "El título debe tener entre 2 y 150 caracteres",
    });
    return;
  }

  if (tipo !== "Película" && tipo !== "Serie") {
    res.status(400).json({
      error: "El tipo debe ser Película o Serie",
    });
    return;
  }

  try {
    const nuevoItem = await ItemLista.create({
      usuario: obtenerUsuarioId(res),
      titulo: titulo.trim(),
      tipo,
      estado: "Pendiente",
    });

    res.status(201).json({
      mensaje: "Contenido agregado a tu lista",
      contenido: nuevoItem,
    });
  } catch (error) {
    manejarError(error, res, "No se pudo agregar el contenido");
  }
};

// ==========================================
// PUT - ACTUALIZAR ESTADO
// ==========================================

export const actualizarMiLista: RequestHandler = async (req, res) => {
  if (!verificarMongoDB(res)) return;

  const { id } = req.params;

  if (!mongoose.isObjectIdOrHexString(id)) {
    res.status(400).json({
      error: "El ID proporcionado no es válido",
    });
    return;
  }

  if (!esObjetoJSON(req.body)) {
    res.status(400).json({
      error: "Debes enviar un objeto JSON válido",
    });
    return;
  }

  const { estado } = req.body;

  if (estado !== "Pendiente" && estado !== "Visto") {
    res.status(400).json({
      error: "El estado debe ser Pendiente o Visto",
    });
    return;
  }

  try {
    const contenido = await ItemLista.findOneAndUpdate(
      {
        _id: id,
        usuario: obtenerUsuarioId(res),
      },
      {
        $set: { estado },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!contenido) {
      res.status(404).json({
        error: "Contenido no encontrado en tu lista",
      });
      return;
    }

    res.status(200).json({
      mensaje: "Estado actualizado correctamente",
      contenido,
    });
  } catch (error) {
    manejarError(error, res, "No se pudo actualizar el contenido");
  }
};

// ==========================================
// DELETE - ELIMINAR DE MI LISTA
// ==========================================

export const eliminarMiLista: RequestHandler = async (req, res) => {
  if (!verificarMongoDB(res)) return;

  const { id } = req.params;

  if (!mongoose.isObjectIdOrHexString(id)) {
    res.status(400).json({
      error: "El ID proporcionado no es válido",
    });
    return;
  }

  try {
    const contenido = await ItemLista.findOneAndDelete({
      _id: id,
      usuario: obtenerUsuarioId(res),
    });

    if (!contenido) {
      res.status(404).json({
        error: "Contenido no encontrado en tu lista",
      });
      return;
    }

    res.status(200).json({
      mensaje: "Contenido eliminado de tu lista",
      contenido,
    });
  } catch (error) {
    manejarError(error, res, "No se pudo eliminar el contenido");
  }
};
