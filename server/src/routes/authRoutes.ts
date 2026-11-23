import { Router } from "express";

import {
  iniciarSesion,
  verificarSesion,
  registrarUsuario,
  iniciarSesionUsuario,
  verificarSesionUsuario,
} from "../controllers/authController";

import { limitarLogin } from "../middlewares/limitarLogin";
import { protegerAdministrador } from "../middlewares/protegerAdministrador";
import { protegerUsuario } from "../middlewares/protegerUsuario";

const router = Router();

router.post("/register", limitarLogin, registrarUsuario);

router.post("/login", limitarLogin, iniciarSesion);

router.post("/login-usuario", limitarLogin, iniciarSesionUsuario);

router.get("/me", protegerAdministrador, verificarSesion);

router.get("/me-usuario", protegerUsuario, verificarSesionUsuario);

export default router;
