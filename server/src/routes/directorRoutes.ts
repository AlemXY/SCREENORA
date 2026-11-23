import { Router } from "express";
import { listarDirectores } from "../controllers/directorController";

const router = Router();

router.get("/", listarDirectores);

export default router;
