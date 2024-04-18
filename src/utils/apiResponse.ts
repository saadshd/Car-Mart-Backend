import { ValidationError } from "express-validator";
import { VerifyErrors } from "jsonwebtoken";

export const success = (
  message: string,
  data?: object | String[],
  page?: number,
  limit?: number,
  totalPages?: number,
  totalItems?: number
) => {
  return {
    message,
    page,
    limit,
    totalPages,
    totalItems,
    data,
  };
};

export const error = (
  message: string,
  errors?: string | string[] | ValidationError[] | VerifyErrors
) => {
  return {
    message,
    errors,
  };
};
