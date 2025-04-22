 import { AppError } from "../middleware/errorHandler.js";
import { prisma } from "../models/index.js";

// =========================
// EXPRESS: Save a chat message
// =========================
export const saveMsg = async (req, res, next) => {
  try {
    const { message, senderId, receiverId } = req.body;

    if (!message || !senderId || !receiverId) {
      return next(new AppError("Message, senderId, and receiverId are required", 400));
    }

    const newMsg = await prisma.chat.create({
      data: {
        message,
        sender: { connect: { id: senderId } },
        receiver: { connect: { id: receiverId } },
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    return res.status(201).json(newMsg);
  } catch (error) {
    next(error);
  }
};

// =========================
// SOCKET: Save a chat message
// =========================
export const saveMsgSocket = async (msg) => {
  const { message, senderId, receiverId } = msg;

  if (!message || !senderId || !receiverId) {
    throw new Error("Message, senderId, and receiverId are required");
  }

  const newMsg = await prisma.chat.create({
    data: {
      message,
      sender: { connect: { id: senderId } },
      receiver: { connect: { id: receiverId } },
    },
    include: {
      sender: true,
      receiver: true,
    },
  });

  return newMsg;
};

// =========================
// Get all messages related to a user
// =========================
export const getMsg = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) return next(new AppError("User ID is required", 400));

    const allMsg = await prisma.chat.findMany({
      where: {
        OR: [
          { senderId: id },
          { receiverId: id },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        sender: true,
        receiver: true,
      },
    });

    return res.status(200).json({
      msg: "Success",
      data: allMsg,
    });
  } catch (error) {
    next(error);
  }
};

// =========================
// Delete a single chat message
// =========================
export const deleteMsg = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) return next(new AppError("Chat message ID is required", 400));

    const deletedMessage = await prisma.chat.delete({
      where: { id },
    });

    return res.status(200).json({
      msg: "Success",
      data: deletedMessage,
    });
  } catch (error) {
    next(error);
  }
};


//  import { AppError } from "../middleware/errorHandler.js";
// import { prisma } from "../models/index.js";

// // @desc    Save a chat message
// // @route   POST /api/v1/chat
// // @access  Private
// // export const saveMsg = async (req, res, next) => {
// //   try {
// //     const { message, senderId, receiverId } = req.body;

// //     if (!message || !senderId || !receiverId) {
// //       return next(new AppError("Message, senderId, and receiverId are required", 400));
// //     }

// //     const newMsg = await prisma.chat.create({
// //       data: {
// //         message,
// //         sender: { connect: { id: senderId } },
// //         receiver: { connect: { id: receiverId } },
// //       },
// //     });

// //     return res.status(201).json(newMsg);
// //   } catch (error) {
// //     next(error);
// //   }
// // };

// // ✅ For Express route
// export const saveMsg = async (req, res, next) => {
//   try {
//     const { message, senderId, receiverId } = req.body;

//     if (!message || !senderId || !receiverId) {
//       return next(new AppError("Message, senderId, and receiverId are required", 400));
//     }

//     const newMsg = await prisma.chat.create({
//       data: {
//         message,
//         sender: { connect: { id: senderId } },
//         receiver: { connect: { id: receiverId } },
//       },
//     });

//     return res.status(201).json(newMsg);
//   } catch (error) {
//     next(error);
//   }
// };


// // ✅ For Socket.IO
// // Socket থেকে মেসেজ সেভ করার জন্য
// export const saveMsgSocket = async (msg) => {
//   const { message, senderId, receiverId } = msg;

//   if (!message || !senderId || !receiverId) {
//     throw new Error("Message, senderId, and receiverId are required");
//   }

//   const newMsg = await prisma.chat.create({
//     data: {
//       message,
//       sender: { connect: { id: senderId } },
//       receiver: { connect: { id: receiverId } },
//     },
//     include: {
//       sender: true,
//       receiver: true,
//     },
//   });

//   return newMsg;
// };


// // @desc    Get all messages related to a user
// // @route   GET /api/v1/chat/:id
// // @access  Private
// export const getMsg = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     if (!id) return next(new AppError("User ID is required", 400));

//     const allMsg = await prisma.chat.findMany({
//       where: {
//         OR: [
//           { senderId: id },
//           { receiverId: id },
//         ],
//       },
//       orderBy: {
//         createdAt: "asc",
//       },
//     });

//     return res.status(200).json({
//       msg: "Success",
//       data: allMsg,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// // @desc    Delete a single chat message
// // @route   DELETE /api/v1/chat/:id
// // @access  Private
// export const deleteMsg = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     if (!id) return next(new AppError("Chat message ID is required", 400));

//     const deletedMessage = await prisma.chat.delete({
//       where: { id },
//     });

//     return res.status(200).json({
//       msg: "Success",
//       data: deletedMessage,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
