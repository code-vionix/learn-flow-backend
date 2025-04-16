import { prisma } from '../models/index.js';

export const roomService = {
  getAllRooms: async () => {
    // Test this
return await prisma.room.findMany({
  select: {
    id: true,
    roomId: true,
    participants: true,
    createdAt: true,
    updatedAt: true,
    deletedAt: true,
  },
});

  },


  getSingleRoom: async (id) => {
    const room = await prisma.room.findUnique({
      where: { id },
      select: {
        id: true,
        roomId: true,
        participants: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
    return room;
  },

createRoom: async (roomData) => {
  const { roomId, participants } = roomData;

  const participantArray = Array.isArray(participants)
    ? participants
    : [participants]; // convert string to array if needed

  // Check if the room already exists
  const existingRoom = await prisma.room.findFirst({
    where: { roomId },
  });

  if (existingRoom) {
    // Merge participants (no duplicates)
    const newParticipants = Array.from(new Set([
      ...existingRoom.participants,
      ...participantArray,
    ]));

    // Update existing room
    return await prisma.room.update({
      where: { id: existingRoom.id },
      data: { participants: newParticipants },
      select: {
        id: true,
        roomId: true,
        participants: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });
  }

  // Otherwise, create a new room
  const newRoom = await prisma.room.create({
    data: {
      roomId,
      participants: participantArray,
    },
    select: {
      id: true,
      roomId: true,
      participants: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    },
  });

  return newRoom;
},

  // createRoom: async (roomData) => {
  //   const { roomId, participants } = roomData;

  //   const newRoom = await prisma.room.create({
  //     data: {
  //       roomId,
  //       participants,
  //     },
  //     select: {
  //       id: true,
  //       roomId: true,
  //       participants: true,
  //       createdAt: true,
  //       updatedAt: true,
  //       deletedAt: true,
  //     },
  //   });

  //   return newRoom;
  // },

  updateRoom: async (id, roomData) => {
    const { roomId, participants } = roomData;

    const updatedRoom = await prisma.room.update({
      where: { id },
      data: {
        roomId,
        participants,
      },
      select: {
        id: true,
        roomId: true,
        participants: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });

    return updatedRoom;
  },

  deleteRoom: async (id) => {
    await prisma.room.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });

    return {
      status: 'success',
      data: {
        id,
        deletedAt: new Date(),
        message: `Room with id ${id} deleted successfully`,
      },
    };
  },
};
