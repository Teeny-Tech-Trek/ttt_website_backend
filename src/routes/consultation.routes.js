const express = require("express");
const router = express.Router();
const consultationController = require("../controllers/consultation.controller");

router.post("/book", consultationController.bookMeeting);
router.get("/all", consultationController.listBookings);

module.exports = router;
