import { Schema, model } from "mongoose";
import { CustomerType } from "../interfaces/customer";
import { PurchaseHistory } from "../interfaces/customer";

const PurchaseHistorySchema = new Schema<PurchaseHistory>(
  {
    chasisNo: {
      type: String,
      minlength: [2, "Chasis No must be at least 2 characters"],
      maxlength: [20, "Chasis No cannot exceed 20 characters"],
      unique: true,
      sparse: true,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const CustomerSchema = new Schema<CustomerType>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [20, "Name cannot exceed 20 characters"],
      trim: true,
    },
    cnic: {
      type: Number,
      required: [true, "CNIC is required"],
      validate: {
        validator: function (value: number) {
          return /^\d{13}$/.test(value.toString());
        },
        message: "CNIC must be 13 digits",
      },
      index: true,
      unique: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    contact: {
      type: String,
      required: [true, "Contact is required"],
      minlength: [11, "Contact must 11 digits"],
      maxlength: [11, "Contact must be 11 digits"],
    },
    purchaseHistory: {
      type: [PurchaseHistorySchema],
      validate: {
        validator: function (array: PurchaseHistory[]) {
          const chasisNos = array.map((entry) => entry.chasisNo);
          const uniqueChasisNos = new Set(chasisNos);
          return uniqueChasisNos.size === chasisNos.length;
        },
        message: "Each Chasis No must be unique within the purchase history",
      },
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const CustomerModel = model<CustomerType>("Customer", CustomerSchema);

export default CustomerModel;
