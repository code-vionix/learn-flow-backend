import { prisma } from "../models/index.js";

export const paymentCard = async (req, res) => {
  try {
    const { userId, name, cardNumber, expiryDate, cvv } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const card = await prisma.paymentCard.create({
      data: {
        userId,
        name,
        cardNumber,
        expiryDate,
        cvv,
      },
    });
    res.status(201).json(card);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserCards = async (req, res) => {
  try {
    const { cardId } = req.params;

    const card = await prisma.paymentCard.findUnique({ where: { id: cardId } });

    if (!card || (card.deletedAt !== null && card.deletedAt !== undefined)) {
      return res.status(404).json({ error: "Card not found" });
    }

    res.json(card);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePaymentCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const { name, cardNumber, expiryDate, cvv } = req.body;

    const card = await prisma.paymentCard.findUnique({ where: { id: cardId } });

    if (!card || (card.deletedAt !== null && card.deletedAt !== undefined)) {
      return res.status(404).json({ error: "Card not found" });
    }

    const updatedCard = await prisma.paymentCard.update({
      where: { id: cardId },
      data: { name, cardNumber, expiryDate, cvv },
    });

    res.json(updatedCard);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deletePaymentCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    const card = await prisma.paymentCard.findUnique({ where: { id: cardId } });
    if (!card || (card.deletedAt !== null && card.deletedAt !== undefined)) {
      return res
        .status(404)
        .json({ error: "Card not found or already deleted" });
    }

    await prisma.paymentCard.update({
      where: { id: cardId },
      data: { deletedAt: new Date() },
    });

    res.json({ message: "Card deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
