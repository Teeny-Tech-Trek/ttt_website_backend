const express = require("express");
const router = express.Router();
const consultationController = require("../controllers/consultation.controller");

router.post("/book", consultationController.bookMeeting);

module.exports = router;
