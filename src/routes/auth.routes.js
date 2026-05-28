const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

router.post("/signup", authController.signup);
router.post("/signin", authController.signin); // identifier = username or email
router.post("/google", authController.googleSignIn); // { idToken }

module.exports = router;
