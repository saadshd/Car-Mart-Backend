import { Router } from "express";
import customer from "../controllers/customer";
const router = Router();

router.route("/").get(customer.getAllCustomer).post(customer.createCustomer);

router
  .route("/:id")
  .get(customer.getCustomerById)
  .put(customer.updateCustomer)
  .delete(customer.deleteCustomer);

export default router;
