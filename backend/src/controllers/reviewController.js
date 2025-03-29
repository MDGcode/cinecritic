import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createReview = async (req, res) => {
  const { movie_id, user_id, rating, title, content } = req.body;
  try {
    const review = await prisma.review.create({
      data: { movie_id, user_id, rating, title, content },
    });
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const reviews = await prisma.review.findMany();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.comment.deleteMany({ where: { review_id: parseInt(id) } });
    await prisma.review.delete({ where: { review_id: parseInt(id) } });
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReviewsByUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const reviews = await prisma.review.findMany({ where: { user_id } });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
