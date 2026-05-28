const userService = require("../services/user.service");
const bcrypt = require("bcryptjs");
const { signToken } = require("../utils/jwt");
const { OAuth2Client } = require("google-auth-library");

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClient = googleClientId ? new OAuth2Client(googleClientId) : null;

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    // basic checks
    const existingEmail = await userService.findByEmail(email);
    if (existingEmail) return res.status(400).json({ success: false, message: "Email already in use" });

    const existingUser = await userService.findByUsername(username);
    if (existingUser) return res.status(400).json({ success: false, message: "Username already taken" });

    const user = await userService.createLocalUser({ username, email, password });
    const token = signToken({ id: user._id, email: user.email });

    res.status(201).json({
      success: true,
      data: {
        user: { id: user._id, username: user.username, email: user.email, provider: user.provider },
        token,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const signin = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    // identifier can be username or email
    if (!identifier || !password) return res.status(400).json({ success: false, message: "Missing fields" });

    let user = null;
    if (identifier.includes("@")) user = await userService.findByEmail(identifier);
    else user = await userService.findByUsername(identifier);

    if (!user) return res.status(400).json({ success: false, message: "Invalid credentials" });
    if (!user.password) return res.status(400).json({ success: false, message: "Account uses OAuth. Use Google Sign-In." });

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) return res.status(400).json({ success: false, message: "Invalid credentials" });

    const token = signToken({ id: user._id, email: user.email });
   res.json({
  success: true,
  data: {
    user: { 
      id: user._id, 
      username: user.username, 
      email: user.email, 
      provider: user.provider,
      role: user.role   // <-- add this
    },
    token,
  },
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * Google Sign-in endpoint.
 * Expects { idToken } from frontend (Google Identity Toolkit / Google Sign-In)
 * The backend verifies the idToken with Google's library.
 */
const googleSignIn = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ success: false, message: "idToken is required" });
    }
    if (!googleClient) {
      return res.status(500).json({ success: false, message: "GOOGLE_CLIENT_ID not configured" });
    }

    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken,
        audience: googleClientId,
      });
      if (!ticket) {
        return res.status(401).json({ success: false, message: "Invalid Google token" });
      }
    } catch (err) {
      console.error("Google verifyIdToken failed:", err);
      return res.status(401).json({
        success: false,
        message: "Google token verification failed",
        details: err.message,
      });
    }

    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;

    const baseUsername = (payload.name || email.split("@")[0] || "googleuser")
      .replace(/\s+/g, "")
      .toLowerCase();

    let username = baseUsername;
    let i = 0;
    while (await userService.findByUsername(username)) {
      i += 1;
      username = `${baseUsername}${i}`;
    }

    const user = await userService.findOrCreateGoogleUser({ googleId, email, username });
    const token = signToken({ id: user._id, email: user.email });

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          provider: user.provider,
          role: user.role,
        },
        token,
      },
    });
  } catch (err) {
    console.error("Google sign-in error:", err);
    res.status(500).json({
      success: false,
      message: "Google login failed",
      details: err.message,
    });
  }
};



module.exports = { signup, signin, googleSignIn };
