import express from "express";

import {paymentCard, getUserCards, updatePaymentCard} from "../controllers/paymentCardController.js"

const cardRouter = express.Router();

cardRouter.post('/card', paymentCard)
cardRouter.get('/card/:cardId', getUserCards)
cardRouter.patch('/card/:cardId', updatePaymentCard)

export default cardRouter