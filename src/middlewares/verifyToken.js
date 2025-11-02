import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'

export const verifyToken = async (req, res, next) => {
  const secretKey = process.env.SECRET_KEY_JWT ?? "";

  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== "JWT" || !token) {
    return res.status(401).json({ message: "Invalid authorization format" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);

    const user = await userModel.findById(
      decoded.data.id,
      "_id name email role"
    );

    if (!user) {
      return res.status(401).json({ message: "Token expired or user not found" });
    }

    req.user = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};
