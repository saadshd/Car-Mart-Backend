import { Secret } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

interface AppConfig {
  jwt: {
    secret: Secret;
    expiresIn: string;
  };
  port: number;
  apiPrefix: string;
  databaseUrl: string;
}

const config: AppConfig = {
  jwt: {
    secret: process.env.JWT_SECRET!,
    expiresIn: process.env.JWT_EXPIRE!,
  },
  port: parseInt(process.env.PORT || "5000", 10),
  apiPrefix: process.env.API_PREFIX || "api",
  databaseUrl: process.env.MONGODB_URL!,
};

export default config;
