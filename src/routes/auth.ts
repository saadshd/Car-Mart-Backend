import { Router } from "express";
import auth from "../controllers/auth";
const router = Router();

router.route("/").post(auth.login);

export default router;
