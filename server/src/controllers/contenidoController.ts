import type { RequestHandler, Response } from "express";
import mongoose from "mongoose";

import Contenido from "../models/Contenido";
import { verificarMongoDB } from "../utils/verificarMongoDB";

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

const esObjetoJSON = (valor: unknown): valor is Record<string, unknown> => {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
};

const camposContenido = [
  "titulo",
  "tipo",
  "genero",
  "año",
  "duracion_minutos",
  "clasificacion",
  "puntuacion",
] as const;

const obtenerDatosContenido = (datos: Record<string, unknown>) => ({
  titulo: datos.titulo,
  tipo: datos.tipo,
  genero: datos.genero,
  año: datos.año,
  duracion_minutos: datos.duracion_minutos,
  clasificacion: datos.clasificacion,
  puntuacion: datos.puntuacion,
});

const manejarErrorContenido = (
  error: unknown,
  res: Response,
  mensaje: string,
): void => {
  if (error instanceof mongoose.Error.ValidationError) {
    const detalles = Object.values(error.errors).map(
      (detalle) => detalle.message,
    );

    res.status(400).json({
      error: "Datos del contenido inválidos",
      detalles,
    });

    return;
  }

  console.error(mensaje, error);

  res.status(500).json({
    error: mensaje,
  });
};

// ==========================================
// GET - LISTAR TODOS
// ==========================================

export const listarContenidos: RequestHandler = async (_req, res) => {
  if (!verificarMongoDB(res)) return;

  try {
    const contenidos = await Contenido.find().sort({
      createdAt: -1,
    });

    res.status(200).json(contenidos);
  } catch (error) {
    manejarErrorContenido(error, res, "No se pudieron obtener los contenidos");
  }
};

// ==========================================
// GET - CONSULTAR POR ID
// ==========================================

export const obtenerContenido: RequestHandler = async (req, res) => {
  if (!verificarMongoDB(res)) return;

  const { id } = req.params;

  if (!mongoose.isObjectIdOrHexString(id)) {
    res.status(400).json({
      error: "El ID proporcionado no es válido",
    });
    return;
  }

  try {
    const contenido = await Contenido.findById(id);

    if (!contenido) {
      res.status(404).json({
        error: "Contenido no encontrado",
      });
      return;
    }

    res.status(200).json(contenido);
  } catch (error) {
    manejarErrorContenido(error, res, "No se pudo consultar el contenido");
  }
};

// ==========================================
// POST - CREAR CONTENIDO
// ==========================================

export const crearContenido: RequestHandler = async (req, res) => {
  if (!verificarMongoDB(res)) return;

  if (!esObjetoJSON(req.body)) {
    res.status(400).json({
      error: "Debes enviar un objeto JSON válido",
    });
    return;
  }

  try {
    const datos = obtenerDatosContenido(req.body);

    const nuevoContenido = new Contenido(datos);
    await nuevoContenido.save();

    res.status(201).json({
      mensaje: "Contenido registrado correctamente",
      contenido: nuevoContenido,
    });
  } catch (error) {
    manejarErrorContenido(error, res, "No se pudo registrar el contenido");
  }
};

// ==========================================
// PUT - ACTUALIZAR CONTENIDO
// ==========================================

export const actualizarContenido: RequestHandler = async (req, res) => {
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

  const camposFaltantes = camposContenido.filter(
    (campo) => !Object.prototype.hasOwnProperty.call(req.body, campo),
  );

  if (camposFaltantes.length > 0) {
    res.status(400).json({
      error: "Faltan campos obligatorios",
      camposFaltantes,
    });
    return;
  }

  try {
    const datos = obtenerDatosContenido(req.body);

    const contenidoActualizado = await Contenido.findByIdAndUpdate(
      id,
      { $set: datos },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!contenidoActualizado) {
      res.status(404).json({
        error: "Contenido no encontrado",
      });
      return;
    }

    res.status(200).json({
      mensaje: "Contenido actualizado correctamente",
      contenido: contenidoActualizado,
    });
  } catch (error) {
    manejarErrorContenido(error, res, "No se pudo actualizar el contenido");
  }
};

// ==========================================
// DELETE - ELIMINAR CONTENIDO
// ==========================================

export const eliminarContenido: RequestHandler = async (req, res) => {
  if (!verificarMongoDB(res)) return;

  const { id } = req.params;

  if (!mongoose.isObjectIdOrHexString(id)) {
    res.status(400).json({
      error: "El ID proporcionado no es válido",
    });
    return;
  }

  try {
    const contenidoEliminado = await Contenido.findByIdAndDelete(id);

    if (!contenidoEliminado) {
      res.status(404).json({
        error: "Contenido no encontrado",
      });
      return;
    }

    res.status(200).json({
      mensaje: "Contenido eliminado correctamente",
      contenido: contenidoEliminado,
    });
  } catch (error) {
    manejarErrorContenido(error, res, "No se pudo eliminar el contenido");
  }
};
