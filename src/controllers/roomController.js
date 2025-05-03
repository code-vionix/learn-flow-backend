import { roomService } from "../services/roomService.js";

// Get all rooms
export const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await roomService.getAllRooms();
    res.status(200).json(rooms);
  } catch (error) {
    next(error);
  }
};



// Get single room by ID
export const getSingleRoom = async (req, res, next) => {
  console.log("Fetching room ID:", req.params.id);
  try {
    const room = await roomService.getSingleRoom(req.params.id);
    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};

// Create a new room
export const createRoom = async (req, res, next) => {
  try {
    const { roomId, participants } = req.body;

    const newRoom = await roomService.createRoom({
      roomId,
      participants,
    });

    res.status(201).json(newRoom);
  } catch (error) {
    next(error);
  }
};

// Update a room
export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await roomService.updateRoom(req.params.id, req.body);
    res.status(200).json(updatedRoom);
  } catch (error) {
    next(error);
  }
};

// Soft delete a room
export const deleteRoom = async (req, res, next) => {
  try {
    const result = await roomService.deleteRoom(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
