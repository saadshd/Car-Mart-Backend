import { Router } from "express";
import carRouter from "../routes/carInventory";
import customerRouter from "../routes/customer";
import authRouter from "../routes/auth";
import { swaggerSpec } from "../utils/swagger";
import swaggerUi from "swagger-ui-express";
import { authMiddleware } from "../middleware/auth";

const routes = Router();

routes.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

routes.use("/login", authRouter);

routes.use("/car-inventory", authMiddleware, carRouter);
routes.use("/customer", authMiddleware, customerRouter);

export default routes;
