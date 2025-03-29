import express from "express";
import {
  createReview,
  getReviews,
  deleteReview,
  getReviewsByUser,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", createReview);
router.get("/", getReviews);
router.delete("/:id", deleteReview);
router.get("/user/:user_id", getReviewsByUser);

export default router;
