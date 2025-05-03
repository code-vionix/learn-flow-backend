import express from "express"
import { createRoom, deleteRoom, getAllRooms, getSingleRoom, updateRoom } from "../controllers/roomController.js";

const roomRouter = express.Router();

roomRouter.get("/", getAllRooms) 
roomRouter.get("/:id", getSingleRoom) 

roomRouter.post("/", createRoom) 
roomRouter.patch("/:id", updateRoom) 
roomRouter.delete("/:id", deleteRoom)

export default roomRouter