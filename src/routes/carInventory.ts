import { Router } from "express";
import carInventory from "../controllers/carInventory";
import carInventoryValidator from "../validators/carInventory";
import validate from "../validators/common/validate";
import upload from "../middleware/upload";
const router = Router();

router
  .route("/")
  .get(carInventory.getAllCar)
  .post(upload, carInventoryValidator, validate, carInventory.createCar);

router
  .route("/:id")
  .get(carInventory.getCarById)
  .put(upload, carInventoryValidator, validate, carInventory.updateCar)
  .delete(carInventory.deleteCar);

export default router;
