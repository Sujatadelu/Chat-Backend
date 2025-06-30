import { User } from "./../models/user.model";
import { UserType } from "./../utils/types";
import { Request, Response } from "express";
import { generateToken } from "../utils/generateToken";
import { hashPassword, matchPassword } from "../utils/passwordUtil";
import {
  LoginRequestBodySchema,
  RegisterRequestBodySchema,
} from "../utils/zod-schema";

// Controller for resiter user
export const registerController = async (req: Request, res: Response) => {
  try {
    const body = await RegisterRequestBodySchema.parseAsync(req.body);

    const { name, email, profilePicture, password } = body;

    const existingUser: UserType | null = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      email,
      password: hashedPassword,
      profilePicture,
      name,
    });

    const newUser: UserType | null = await User.findOne({ email }).select(
      "-password"
    );

    res.status(200).json({ message: "User Registered", newUser });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Controller to Login
export const loginController = async (req: Request, res: Response) => {
  try {
    const body = await LoginRequestBodySchema.parseAsync(req.body);

    const { email, password } = body;

    const user: UserType | null = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isPasswordValid: boolean = await matchPassword(
      password,
      user.password
    );
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = await generateToken(user?._id);

    const responseUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePicture: user?.profilePicture,
    };

    res
      .status(200)
      .json({ message: "User Logged In", token, user: responseUser });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Controller to get allUsers
export const allUsers = async (req: Request, res: Response) => {
  // keyword to search
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: new RegExp(req.query.search as string, "i") } },
          { email: { $regex: new RegExp(req.query.search as string, "i") } },
        ],
      }
    : {};

  try {
    const users = await User.find(keyword).find({
      _id: { $ne: req?.user?._id },
    });

    res.status(200).json({ message: "Found", users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const toggleStatus = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) return res.status(404).json({ message: "Unauthorised Request" });
    // Toggle the user's availability
    user.status = user.status === "available" ? "busy" : "available";

    // Save the updated user document
    await user.save();

    return res
      .status(200)
      .json({ message: "User availability toggled successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
