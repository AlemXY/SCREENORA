import { Router } from "express";
import { listarProductosPorCategoria } from "../controllers/productoController";

const router = Router();

router.get("/", listarProductosPorCategoria);

export default router;
