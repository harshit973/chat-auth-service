import { userModal } from "../db/models/UserSchema.js";
import { decodeJWTToken, generateJWTTokenAndSetCookie } from "../utill/Jwt.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.send(404, "User details not found");
  }
  const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());
  const dbRes = await userModal.findOne({ username });
  if (dbRes) {
    res.send(400, "User data already exists");
  } else {
    const userRes = await userModal.create({
      username: username,
      password: hashedPassword,
    });
    generateJWTTokenAndSetCookie(userRes?._id, res);
    res.send(200, "User registered successfully");
  }
};
export const signin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModal.findOne({ username });
    if (!user) return res.status(401).json({ error: "Auth failed" });
    const passwordMatch = await bcrypt.compare(password, user?.password || "");
    if (!passwordMatch) return res.status(401).json({ error: "Auth failed" });
    generateJWTTokenAndSetCookie(user?._id, res);
    res.status(200).json({
      _id: user._id,
      username: user.username,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Login failed" });
  }
};
export const decodeJwt = async (req, res) => {
  try {
    const token = req.cookies?.["x-access-token"];
    const decodedJwt = decodeJWTToken(token);
    const userId = decodedJwt?.userId;
    if (!userId) {
      res.status(400).send("Invalid payload");
    }
    const userData = await userModal.findById(userId, "username");
    res.status(200).json({
      decoded: userData?.username,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Login failed" });
  }
};
