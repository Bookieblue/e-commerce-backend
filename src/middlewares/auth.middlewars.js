import jwt from "jsonwebtoken";
import { findUserById } from "../model/auth.service";

/*Authorization: Bearer <token> */

export const authenticate = async (req, res, next) => {
  try {
    let token;

    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    if (
      req.headers.authorization &&
      req.headers.authorization.startWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Access token missing",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // To check if user exist in the DB
    const user = await findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User no longer exist ",
      });
    }

    const { password, ...safeUser } = user;
    req.user = safeUser;

    next();
  } catch (error) {
    if (error.name === " TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Access token has expired",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid access token ",
    });
  }
};

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: role '${req.user?.role || "none"}' does not have access to this resource`,
      });
    }
    next();
  };
};
