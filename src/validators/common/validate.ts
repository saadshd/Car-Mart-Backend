import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { error } from "../../utils/apiResponse";

const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json(error("Validation Error", errors.array()));
  }

  next();
};

export default validate;
