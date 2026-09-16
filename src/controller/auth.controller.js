import {
  createUser,
  findUserByEmail,
  findUserByEmailAndOtp,
  setVerificationOtp,
  updateRefreshToken,
  verifyUserEmail,
} from "../model/auth.service.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const COOKIE = {
  httpOnly: true,
  sameSite: "Strict",
  secure: process.env.NODE_ENV === "production",
};

const ACCESS_TOKEN_COOKIE = {
  ...COOKIE,
  maxAge: 24 * 60 * 60 * 1000, // 1 DAY
};

const REFRESH_TOKEN_COOKIE = {
  ...COOKIE,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 DAYS
};

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m" },
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d" },
  );

  return { accessToken, refreshToken };
};

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, ACCESS_TOKEN_COOKIE);
  res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE);
};

const clearAuthCookies = (res) => {
  res.clearCookie("accessToken", COOKIE);
  res.clearCookie("refreshToken", COOKIE);
};

export const registerUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, role, gender } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All information required",
      });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with that email already exists",
      });
    }
    console.log("Existing user result:", existingUser);
    console.log("Array length:", existingUser?.length);

    // if (existingUser.length === 0) {
    //   return res.status(409).json({
    //     success: false,
    //     message: "User email already exists",
    //   });
    // }

    //generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

    const user = await createUser({
      first_name,
      last_name,
      email,
      password,
      gender,
      role: role || "customer",
      otp_code: otp,
      otp_expires: otpExpires,
    });

    return res.status(201).json({
      success: true,
      message: "ACCOUNT CREATED SUCCESSFULLY, PLS VERIFY YOUR EMAIL WITH OTP ",

      data: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified,
      },
      // Remove on production
      dev_otp: otp,
    });
  } catch (error) {
    console.log("Register Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const user = await findUserByEmailAndOtp(email, otp);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    await verifyUserEmail(user.id);
    return res.status(200).json({
      success: true,
      message: "Email verified successfull",
    });
  } catch (error) {
    console.error("Verify Email Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }
};

export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with that email",
      });
    }

    if (user.is_verified) {
      return res.status(400).json({
        success: false,
        message: "This email address is already verified",
      });
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await setVerificationOtp(user.id, otp, expiresAt);

    return res.status(200).json({
      success: true,
      message: " A new OTP has beeen sent to your email",
      //Remove in production
      dev_otp: otp,
    });
  } catch (error) {
    console.error("Resend Vefication Error:", error);
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    //
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

    //Generate tokens

    const { accessToken, refreshToken } = generateTokens(user);
    await updateRefreshToken(user.id, refreshToken);

    setAuthCookies(res, accessToken, refreshToken);

    // const token = jwt.sign(
    //   {
    //     id: user.id,
    //     email: user.email,
    //   },
    //   process.env.JWT_SECRET,
    //   {
    //     expiresIn: "1d",
    //   },
    // );

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      accessToken,
      refreshToken,
      // token,
      user: {
        id: user.id,
        name: user.first_name,
        email: user.email,
        role: user.role,
        is_verified: user.is_verified,
      },
    });
  } catch (error) {
    console.log("Login Error", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const Logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (req.user) {
      await updateRefreshToken(req.user.id, null);
    } else if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        await updateRefreshToken(decoded.id, null);
      } catch (error) {}
    }

    clearAuthCookies(res);
    return res.status(200).json({
      success: true,
      message: "Logged Out Successfully",
    });
  } catch (error) {
    console.error("Logged out Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }
};
