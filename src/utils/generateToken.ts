import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants";

export const generateToken = async (id: string) => {
  if (JWT_SECRET == undefined) throw new Error("Invalid JWT SECRET ID");
  let token = await jwt.sign({ id }, JWT_SECRET, {
    expiresIn: "1d",
  });
  token = "Bearer " + token;

  return token;
};
