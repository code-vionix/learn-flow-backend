import { prisma } from "../models/index.js"

export const roomService = {
  getAllRooms: async () => {
    return await prisma.room.findMany({
      select: {
        id: true,
        participants: true,
        createdAt: true,
      },
    })
  },

  getSingleRoom: async (id) => {
    const room = await prisma.room.findUnique({
      where: { id },
      select: {
        id: true,
        participants: true,
        createdAt: true,
      },
    })

    return room
  },

  createRoom: async (roomData) => {
    const { participants } = roomData

    const room = await prisma.room.create({
      data: {
        participants,
      },
      select: {
        id: true,
        participants: true,
        createdAt: true,
      },
    })

    return room
  },

  updateRoom: async (id, roomData) => {
    const { participants } = roomData

    const updatedRoom = await prisma.room.update({
      where: { id },
      data: {
        participants,
      },
      select: {
        id: true,
        participants: true,
        createdAt: true,
      },
    })

    return updatedRoom
  },

  deleteRoom: async (id) => {
    await prisma.room.delete({
      where: { id },
    })

    return {
      status: "success",
      data: {
        id,
        message: `Room with id ${id} deleted successfully`,
      },
    }
  },
}
