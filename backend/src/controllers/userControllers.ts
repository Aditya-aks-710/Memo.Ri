import { Request, Response } from "express";
import { UserModel } from "../db";
import { signupSchema, signinSchema } from "../validators/uservalidation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "cloudinary";
import { z } from "zod";

// Get Cloudinary Signature
export const getCloudinarySignature = (req: Request, res: Response) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  try {
    const signature = cloudinary.v2.utils.api_sign_request(
      { timestamp },
      process.env.CLOUDINARY_API_SECRET!
    );
    res.json({ timestamp, signature });
  } catch (error) {
    console.error("Signature Generation Error:", error);
    res.status(500).json({ message: "Failed to generate signature" });
  }
};

// User Signup
export const signup = async (req: Request, res: Response) => {
  try {
    // ensure TS knows the parsed shape
    const parsed = signupSchema.parse(req.body) as {
      name: string;
      email: string;
      password: string;
      profilePictureUrl?: string;
    };
    const { name, email, password, profilePictureUrl } = parsed;

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email already exists." });
    }

    // use rounds (number) instead of an unknown salt variable
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      profilePictureUrl: profilePictureUrl || ""
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    return res.status(201).json({
      message: "Signed Up Successfully",
      token,
      user: { id: newUser._id, name: newUser.name, email: newUser.email, profilePictureUrl: newUser.profilePictureUrl }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input data", errors: error.issues });
    }
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// User Signin
export const signin = async (req: Request, res: Response) => {
  try {
    const parsed = signinSchema.parse(req.body) as { email: string; password: string };
    const { email, password } = parsed;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(403).json({ message: "Invalid email or password" });
    }

    const storedPassword = (user.password as unknown) as string;
    const isMatch = await bcrypt.compare(password, storedPassword);
    if (!isMatch) {
      return res.status(403).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });

    res.status(200).json({
      message: "Signin Successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, profilePictureUrl: user.profilePictureUrl }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: "Invalid input data", errors: error.issues });
    }
    console.error("Signin Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyProfile = async (req: any, res: Response) => {
  try {
    const user = await UserModel.findById(req.userId).select('name email profilePictureUrl');

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ user });

  } catch (error) {
    console.error("Get Profile Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
