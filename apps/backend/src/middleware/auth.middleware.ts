import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("VERIFYING WITH:", process.env.JWT_SECRET?.length);

    console.log(`this is headerrrrrrrrrrrrrrrrrrr ${authHeader}`);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    console.log(`THIS IS TOKENNNNNNNNN${token}`);

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }
    console.log(`ITS JWT SECRET ${process.env.JWT_SECRET}`);

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as {
      userId: string;
    };

    req.user = { userId: decoded.userId };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
