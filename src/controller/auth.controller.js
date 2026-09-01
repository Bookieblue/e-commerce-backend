import { createUser, findUserByEmail } from "../model/auth.service.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, role, gender } = req.body;

    const existingUser = await findUserByEmail(email);
    console.log("Existing user result:", existingUser);
    console.log("Array length:", existingUser?.length);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User email already exists",
      });
    }
    const user = await createUser({
      first_name,
      last_name,
      email,
      password,
      gender,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error creating user",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required ",
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );
    return res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user.id,
        name: user.first_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("An error occurred", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const Logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
};
