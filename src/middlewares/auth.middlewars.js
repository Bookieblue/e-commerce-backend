import jwt from "jsonwebtoken";

/*Authorization: Bearer <token> */

export const authenticate = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status;
    }
  } catch (error) {}
};
