import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

// export const DB_NAME: string = "chatHire";
export const DB_NAME: string = "chattest";
export const LIMIT: string = "16kb";
export const JWT_SECRET: string | undefined = process.env.JWT_SECRET;
