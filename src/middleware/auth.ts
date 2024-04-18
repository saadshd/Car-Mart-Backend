import { Request, Response, NextFunction } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import config from "../config";
import { error } from "../utils/apiResponse";

export interface IRequest extends Request {
  token: string | JwtPayload;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json(error("Access Denied. No token provided"));
  }

  verify(token!, config.jwt.secret, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json(
          error("Authentication failed. Please provide a valid token", err)
        );
    }

    (req as IRequest).token = decoded!;
    next();
  });
};
