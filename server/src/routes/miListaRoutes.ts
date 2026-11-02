import { Router } from "express";

import {
  listarMiLista,
  agregarMiLista,
  actualizarMiLista,
  eliminarMiLista,
} from "../controllers/miListaController";

import { protegerUsuario } from "../middlewares/protegerUsuario";

const router = Router();

// Todas las rutas requieren JWT de usuario
router.use(protegerUsuario);

router.get("/", listarMiLista);

router.post("/", agregarMiLista);

router.put("/:id", actualizarMiLista);

router.delete("/:id", eliminarMiLista);

export default router;
