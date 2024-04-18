import { Schema, model } from "mongoose";
import { CarInventoryType } from "../interfaces/carInventory";
import {
  CURRENT_YEAR,
  assembly,
  availableAssembly,
  availableDocument,
  availableFuelType,
  availableRegisteredIn,
  availableTaxHistory,
  availableTransmissionType,
  fuelType,
  registeredIn,
  taxHistory,
} from "../utils/constants";

const CarInventorySchema = new Schema<CarInventoryType>(
  {
    chasisNo: {
      type: String,
      required: [true, "Chasis No is required"],
      minlength: [2, "Chasis No must be at least 2 characters"],
      maxlength: [20, "Chasis No cannot exceed 20 characters"],
      unique: true,
      immutable: true,
      index: true,
      trim: true,
    },
    engineNo: {
      type: String,
      required: [true, "Engine No is required"],
      minlength: [2, "Engine No must be at least 2 characters"],
      maxlength: [20, "Engine No cannot exceed 20 characters"],
      index: true,
      trim: true,
    },
    make: {
      type: String,
      required: [true, "Make is required"],
      minlength: [2, "Make must be at least 2 characters"],
      maxlength: [20, "Make cannot exceed 20 characters"],
      index: true,
      trim: true,
    },
    modelName: {
      type: String,
      required: [true, "Model is required"],
      minlength: [2, "Model must be at least 2 characters"],
      maxlength: [20, "Model cannot exceed 20 characters"],
      index: true,
      trim: true,
    },
    variant: {
      type: String,
      required: [true, "Variant is required"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [50000, "Price must be at least 50,000"],
      max: [100000000, "Price cannot exceed 10 Crore"],
      validate: {
        validator: (value: number) =>
          typeof value === "number" && value > 0 && Number.isInteger(value),
        message: "Enter Valid Price, must be between 50,000 & 10 Crore",
      },
    },
    modelYear: {
      type: Number,
      required: [true, "Model Year is required"],
      min: [1923, "Model Year must be at least 1923"],
      max: [CURRENT_YEAR, `Model Year cannot exceed ${CURRENT_YEAR}`],
      validate: {
        validator: (value: number) =>
          typeof value === "number" && value > 0 && Number.isInteger(value),
        message: `Enter valid Model Year, must be between 1923 and ${CURRENT_YEAR}`,
      },
    },
    fuelType: {
      type: String,
      required: [true, "Please select Fuel Type"],
      enum: {
        values: availableFuelType,
        message: "Please provide valid Fuel Type",
      },
      default: fuelType.PETROL,
    },
    registeredIn: {
      type: String,
      required: [true, "Please select Registered In"],
      enum: {
        values: availableRegisteredIn,
        message: "Please provide valid Registered In",
      },
      default: registeredIn.PUNJAB,
    },
    registrationNo: {
      type: String,
      required: [
        function (this: CarInventoryType) {
          return (
            this.registeredIn !== "Un-Registered" &&
            this.registeredIn !== undefined
          );
        },
        "Registration No is required",
      ],
      index: true,
    },
    mileage: {
      type: Number,
      required: [true, "Mileage is required"],
      min: [100, "Milage must be at least 100"],
      max: [1000000, "Milage cannot exceed 1000000"],
      validate: {
        validator: (value: number) =>
          typeof value === "number" && value > 0 && Number.isInteger(value),
        message: "Enter valid Mileage, must be between 100 & 1000000",
      },
    },
    transmissionType: {
      type: String,
      required: [true, "Please select Transmission Type"],
      enum: {
        values: availableTransmissionType,
        message: "Please provide valid Transmission Type",
      },
    },
    taxHistory: {
      type: String,
      required: [true, "Please select Tax History"],
      enum: {
        values: availableTaxHistory,
        message: "Please provide valid Tax History",
      },
      default: taxHistory.TOKEN_PAID,
    },
    assembly: {
      type: String,
      required: [true, "Please select Assembly"],
      enum: {
        values: availableAssembly,
        message: "Please provide valid Assembly",
      },
      default: assembly.LOCAL,
    },
    document: {
      type: [String],
      required: [true, "Select at least one option"],
      enum: {
        values: availableDocument,
        message: "Please provide valid Document",
      },
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    isSold: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const CarInventoryModel = model<CarInventoryType>("Car", CarInventorySchema);

export default CarInventoryModel;
