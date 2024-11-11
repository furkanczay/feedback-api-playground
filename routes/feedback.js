const express = require("express");
const router = express.Router();
const {
	getAllFeedbacks,
	createFeedback,
	getFeedback,
	getFeedbackComments,
	updateFeedback,
	deleteFeedback,
	createComment,
} = require("../controllers/feedback.controller");
const checkAuthorization = require("../utils/check.authorization");

router.get("/", getAllFeedbacks);
router.post("/", checkAuthorization, createFeedback);
router.get("/:slug", getFeedback);
router.get("/:slug/comments", getFeedbackComments);
router.post("/:slug/comments", checkAuthorization, createComment);
router.put("/:slug", checkAuthorization, updateFeedback);
router.delete("/:slug", checkAuthorization, deleteFeedback);

module.exports = router;
