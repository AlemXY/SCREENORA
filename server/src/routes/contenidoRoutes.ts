import { Router } from "express";

import {
  listarContenidos,
  obtenerContenido,
  crearContenido,
  actualizarContenido,
  eliminarContenido,
} from "../controllers/contenidoController";

import { protegerAdministrador } from "../middlewares/protegerAdministrador";

const router = Router();

// Rutas públicas
router.get("/", listarContenidos);
router.get("/:id", obtenerContenido);

// Rutas protegidas con JWT
router.post("/", protegerAdministrador, crearContenido);

router.put("/:id", protegerAdministrador, actualizarContenido);

router.delete("/:id", protegerAdministrador, eliminarContenido);

export default router;
