import { Document } from "mongoose";

export interface PurchaseHistory {
  chasisNo: string;
  purchaseDate: Date;
}

export interface CustomerType extends Document {
  name: string;
  cnic: number;
  address: string;
  contact: string;
  purchaseHistory?: PurchaseHistory[];
}
