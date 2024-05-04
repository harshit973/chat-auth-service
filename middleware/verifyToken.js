import {verifyToken as verifyAuthorization} from "../utill/Jwt.js"
const verifyToken = (req, res, next) => {
  const token = req.cookies?.["x-access-token"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }
  if (verifyAuthorization(token)) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default verifyToken;
