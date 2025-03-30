import express from "express";
import {
  createReview,
  getReviews,
  deleteReview,
  getReviewsByUser,
  getReviewsByMovie,
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", createReview);
router.get("/", getReviews);
router.delete("/:id", deleteReview);
router.get("/user/:user_id", getReviewsByUser);
router.get("/movie/:movie_id", getReviewsByMovie);

export default router;
