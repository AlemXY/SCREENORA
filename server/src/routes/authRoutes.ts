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

// Registro de usuarios normales
router.post("/register", limitarLogin, registrarUsuario);

// Inicio de sesión del administrador
router.post("/login", limitarLogin, iniciarSesion);

// Inicio de sesión de usuarios normales
router.post("/login-usuario", limitarLogin, iniciarSesionUsuario);

// Verificar sesión administrativa
router.get("/me", protegerAdministrador, verificarSesion);

// Verificar sesión de usuario normal
router.get("/me-usuario", protegerUsuario, verificarSesionUsuario);

export default router;
