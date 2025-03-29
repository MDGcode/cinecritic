import express from "express";
import {
  createComment,
  getComments,
  deleteComment,
  getCommentsByReview,
} from "../controllers/commentController.js";

const router = express.Router();

router.post("/", createComment);
router.get("/", getComments);
router.delete("/:id", deleteComment);
router.get("/review/:review_id", getCommentsByReview);

export default router;
