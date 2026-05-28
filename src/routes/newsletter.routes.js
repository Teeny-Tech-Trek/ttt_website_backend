const express = require("express");
const { subscribe, listSubscribers } = require("../controllers/newsletter.controller");

const router = express.Router();

router.post("/subscribe", subscribe);
router.get("/subscribers", listSubscribers);

module.exports = router;
