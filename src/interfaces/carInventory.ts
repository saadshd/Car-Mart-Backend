import { Document } from "mongoose";

export interface CarInventoryType extends Document {
  engineNo: string;
  chasisNo: string;
  make: string;
  modelName: string;
  variant: string;
  price: number;
  registeredIn: string;
  registrationNo?: string;
  modelYear: number;
  mileage: number;
  fuelType: string;
  transmissionType: string;
  taxHistory: string;
  assembly: string;
  document: string[];
  image: string;
  isSold: boolean;
}
