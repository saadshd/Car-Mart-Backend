import { Request, Response } from "express";
import config from "../config";
import { sign } from "jsonwebtoken";
import { error } from "../utils/apiResponse";

interface User {
  id: string;
  username: string;
}

const { secret, expiresIn } = config.jwt;

/** 
 * @swagger
 * /login:
 *     post:
 *       tags:
 *         - authentication
 *       summary: login
 *       description: Using a sample user data for authentication. Add credentials to login
 *       operationId: login
 *       requestBody:
 *         required: true
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: saadshd
 *                 password:
 *                   type: string
 *                   example: saadshd
 *           application/x-www-form-urlencoded:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                   example: saadshd
 *                 password:
 *                   type: string
 *                   example: saadshd
 *       responses:
 *         '200':
 *           description: Successful login
 *           content:
 *             application/json:
 *               example:
 *                 message: Login Sccessfully
 *                 security: JWT
 *                 expiry: 1h
 *                 token: user_token_here
 *         '401':
 *           $ref: "#/components/responses/UnAuthorized"

 */

const login = (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (username === "saadshd" && password === "saadshd") {
    const payload: User = {
      id: "123",
      username: "saadshd",
    };

    const options = {
      expiresIn: expiresIn,
    };

    try {
      const token = sign(payload, secret, options);

      return res.status(200).json({
        message: "Login Successfull",
        security: "JWT",
        expiry: expiresIn,
        token: token,
      });
    } catch (err) {
      if (err instanceof Error) {
        res
          .status(500)
          .json(error(err.message || "Some error occured while Log In."));
      }
    }
  } else {
    res.status(401).json(error("Invalid credentials. Login failed."));
  }
};

export default { login };
