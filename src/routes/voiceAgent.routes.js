const express = require("express");
const router = express.Router();
const { bookConsultation } = require("../controllers/voiceAgent.controller");

router.post("/book", bookConsultation);

module.exports = router;
