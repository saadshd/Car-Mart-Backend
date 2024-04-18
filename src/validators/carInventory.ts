import { body } from "express-validator";
import { CarInventoryType } from "../interfaces/carInventory";
import {
  CURRENT_YEAR,
  availableAssembly,
  availableDocument,
  availableFuelType,
  availableRegisteredIn,
  availableTaxHistory,
  availableTransmissionType,
} from "../utils/constants";

const carInventoryValidator = [
  body("chasisNo")
    .isString()
    .notEmpty()
    .withMessage("Chasis No is required")
    .isLength({ min: 2, max: 20 })
    .withMessage("Chasis No can be between 2 and 20 characters")
    .trim(),

  body("engineNo")
    .isString()
    .notEmpty()
    .withMessage("Engine No is required")
    .isLength({ min: 2, max: 20 })
    .withMessage("Engine No can be between 2 and 20 characters")
    .trim(),

  body("make")
    .isString()
    .notEmpty()
    .withMessage("Make is required")
    .isLength({ min: 2, max: 20 })
    .withMessage("Make can be between 2 and 20 characters")
    .trim(),

  body("modelName")
    .isString()
    .notEmpty()
    .withMessage("Model Name is required")
    .isLength({ min: 2, max: 20 })
    .withMessage("Model Name can be between 2 and 20 characters")
    .trim(),

  body("variant")
    .isString()
    .notEmpty()
    .withMessage("Variant is required")
    .trim(),

  body("price")
    .isInt({ min: 50000, max: 100000000 })
    .withMessage("Enter valid Price, must be between 50,000 and 10 Crore")
    .notEmpty()
    .withMessage("Price is required"),

  body("modelYear")
    .isInt({ min: 1923, max: CURRENT_YEAR })
    .withMessage(
      `Enter valid Model Year, must be between 1923 and ${CURRENT_YEAR}`
    )
    .notEmpty()
    .withMessage("Model Year is required"),
  body("fuelType")
    .isString()
    .notEmpty()
    .withMessage("Please select Fuel Type")
    .isIn(availableFuelType)
    .withMessage("Please provide valid Fuel Type"),

  body("registeredIn")
    .isString()
    .notEmpty()
    .withMessage("Please select Registered In")
    .isIn(availableRegisteredIn)
    .withMessage("Please provide valid Registered In"),

  body("registrationNo").custom((value, { req }) => {
    const { registeredIn, registrationNo }: CarInventoryType = req.body;

    if (registeredIn === "Un-Registered") {
      return true;
    }

    if (!registrationNo) {
      throw new Error("Registration No is required");
    }

    return true;
  }),

  body("mileage")
    .isInt({ min: 100, max: 1000000 })
    .withMessage("Enter valid Mileage, must be between 100 and 1000000")
    .notEmpty()
    .withMessage("Mileage is required"),

  body("transmissionType")
    .isString()
    .notEmpty()
    .withMessage("Please select Transmission Type")
    .isIn(availableTransmissionType)
    .withMessage("Please provide valid Transmission Type"),

  body("taxHistory")
    .isString()
    .notEmpty()
    .withMessage("Please select Tax History")
    .isIn(availableTaxHistory)
    .withMessage("Please provide valid Tax History"),

  body("assembly")
    .isString()
    .notEmpty()
    .withMessage("Please select Assembly")
    .isIn(availableAssembly)
    .withMessage("Please provide valid Assembly"),

  body("document")
    .isArray()
    .custom((value) => value.length > 0)
    .withMessage("Select at least one option")
    .isIn(availableDocument)
    .withMessage("Please provide valid Document"),
];

export default carInventoryValidator;
