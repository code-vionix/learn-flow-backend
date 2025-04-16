import express from 'express';
import { deleteMsg, getMsg } from '../controllers/chatController.js';

const messageRouter = express.Router();

messageRouter.get('/:id', getMsg);
messageRouter.delete('/:id', deleteMsg);

export default messageRouter;