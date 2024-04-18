export enum fuelType {
  PETROL = "Petrol",
  DIESEL = "Diesel",
  ELECTRIC = "Electric",
  HYBRID = "Hybrid",
  LPG = "LPG",
  CNG = "CNG",
}

export const availableFuelType = Object.values(fuelType);

export enum registeredIn {
  UN_REGISTERED = "Un-Registered",
  BALOCHISTAN = "Balochistan",
  ISLAMABAD = "Islamabad",
  KPK = "KPK",
  PUNJAB = "Punjab",
  SINDH = "Sindh",
}

export const availableRegisteredIn = Object.values(registeredIn);

export enum assembly {
  LOCAL = "Local",
  IMPORTED = "Imported",
}

export const availableAssembly = Object.values(assembly);

export enum taxHistory {
  TOKEN_PAID = "Token/Tax Paid",
  TOKEN_REMAINING = "Token Remaining",
  LIFETIME_TOKEN_PAID = "Lifetime Token Paid",
}

export const availableTaxHistory = Object.values(taxHistory);

export enum transmissionType {
  AUTOMATIC = "Automatic",
  MANUAL = "Manual",
}

export const availableTransmissionType = Object.values(transmissionType);

export enum document {
  ORIGINAL_BOOK = "Original Book",
  AUCTION_SHEET_AVAILABLE = "Auction Sheet Available",
  DUPLICATE_BOOK = "Duplicate Book",
  DUPLICATE_NUMBER_PLATE = "Duplicate Number Plate",
  FRESH_IMPORT = "Fresh Import",
  COMPLETE_ORIGINAL_FILE = "Complete Original File",
  DUPLICATE_FILE = "Duplicate File",
}

export const availableDocument = Object.values(document);

export const CURRENT_YEAR = new Date().getFullYear();
