const express = require("express");
const feedbackController = require("../controllers/feedbackController");

const router = express.Router();

// GET todos os feedbacks
router.get("/", feedbackController.getAllFeedback);

// POST novo feedback
router.post("/", feedbackController.createFeedback);

// DELETE feedback apenas pelo dono
router.delete("/:id", feedbackController.deleteFeedback);

module.exports = router;