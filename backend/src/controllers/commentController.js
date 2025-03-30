import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createComment = async (req, res) => {
  const { user_id, review_id, comment, displayname, photoUrl } = req.body;
  try {
    const newComment = await prisma.comment.create({
      data: {
        user_id,
        review_id,
        comment,
        displayname,
        photoUrl,
      },
    });
    res.json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await prisma.comment.findMany();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.comment.delete({ where: { comment_id: parseInt(id) } });
    res.json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCommentsByReview = async (req, res) => {
  const { review_id } = req.params;
  try {
    const comments = await prisma.comment.findMany({
      where: { review_id: parseInt(review_id) },
    });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
