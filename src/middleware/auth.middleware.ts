import { User, UserDocument } from "../models/user.model";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      if (JWT_SECRET == undefined) throw new Error("Invalid JWT");
      token = req.headers.authorization.split(" ")[1];

      const decoded: any = jwt.verify(token, JWT_SECRET);

      if (typeof decoded === "string") {
        throw new Error("Invalid JWT");
      }

      const user = await User.findById(decoded?.id).select("-password");

      if (!user) {
        throw new Error("User not found");
      }

      req.user = user as UserDocument & { _id: string };

      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: "Unauthorized Access" });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized Access" });
  }
};
