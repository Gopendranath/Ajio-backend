import axios from "axios";
import User from "../models/user.model.js";
import dotenv from "dotenv";
import { generateToken } from "../utils/generateToken.util.js";
dotenv.config();

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const FRONTEND_URL = process.env.FRONTEND_URL;

export const googleOAuthCallback = async (req, res) => {
  const { code } = req.query;

  try {
    // 1. Exchange code for access token
    const tokenRes = await axios.post("https://oauth2.googleapis.com/token", {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: "http://localhost:3000/api/auth/google/callback",
      grant_type: "authorization_code",
    });

    const { access_token, id_token } = tokenRes.data;

    // 2. Get user info from Google
    const userInfo = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const { sub, email, name, picture } = userInfo.data;

    // 3. Find or create user
    let user = await User.findOne({ email });

    if (user && user.provider === "email"){
        user = await User.findOneAndUpdate({ email }, { provider: "emailwithgoogle", providerId: sub, profilePicture: picture }, { new: true });
    }

    if (!user) {
      user = await User.create({
        providerId: sub,
        email,
        name,
        profilePicture: picture,
        provider: "google",
      });
    }

    // 4. Create JWT token
    const token = generateToken(user);

    // 5. Set cookie or return token
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false, // true in production (HTTPS)
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .redirect(FRONTEND_URL);
  } catch (err) {
    console.error("OAuth error:", err);
    res.status(500).json({ error: "OAuth failed" });
  }
};
