const express = require("express");
const router = express.Router();
const feedbackRoutes = require("./feedback");
const authRoutes = require("./auth");

router.use("/feedbacks", feedbackRoutes);
router.use("/auth", authRoutes);

module.exports = router;
