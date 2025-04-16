import { Server } from 'socket.io';
import { saveMsg } from '../src/controllers/chatController.js';

const onlineUsers = new Map();

// const addUser = (user, socketId) => {
//     console.log("socket user",user);
//     const isExist = onlineUsers?.findIndex((u) => u._id === user._id);

//     if (isExist !== -1) {
//         onlineUsers.splice(isExist, 1);
//     }

//     user.socketId = socketId;
//     onlineUsers.push(user);
// }

const addUser = (user, socketId) => {
    console.log("socket user", user);
    onlineUsers.set(user._id, { ...user, socketId });
};

// const removeUser = (socketId) => {
//     const isExist = onlineUsers?.findIndex((u) => u.socketId === socketId);
//     if (isExist !== -1) {
//          onlineUsers.splice(isExist, 1);
//     }
// }
const removeUser = (socketId) => {
    for (let [key, value] of onlineUsers.entries()) {
        if (value.socketId === socketId) {
            onlineUsers.delete(key);
            break;
        }
    }
};

const socketInit = (server) => {
    console.log("test socket", server);
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        socket.on('ADD_USER', (user) => {
            addUser(user, socket.id);
            // io.emit('USERS_ADDED', onlineUsers);
           io.emit('USERS_ADDED', Array.from(onlineUsers.values()));
        });

        socket.on('SEND_MESSAGE', async(msg) => {
            console.log("send message", msg);
            const saved = await saveMsg(msg);
              const receiverSocketId = onlineUsers.get(msg.receiver?._id)?.socketId;
            const senderSocketId = onlineUsers.get(msg.sender?._id)?.socketId;

   if (receiverSocketId) {
                io.to(receiverSocketId).emit('RECEIVE_MESSAGE', saved);
            }

            if (senderSocketId && receiverSocketId !== senderSocketId) {
                io.to(senderSocketId).emit('RECEIVE_MESSAGE', saved);
            }

            // io.to(msg.receiver?.socketId)
            //     .to(msg.sender?.socketId)
            //     .emit('RECEIVE_MESSAGE', saved);
        });

        // socket.on('DELETED_MESSAGE', (msg) => {
        //     socket.to(msg.receiver?.socketId).emit('DELETED_MESSAGE', msg);
        // });

          socket.on('DELETED_MESSAGE', (msg) => {
            const receiverSocketId = onlineUsers.get(msg.receiver?._id)?.socketId;
            const senderSocketId = socket.id;

            if (receiverSocketId) {
                io.to(receiverSocketId).emit('DELETED_MESSAGE', msg);
            }

            if (receiverSocketId !== senderSocketId) {
                io.to(senderSocketId).emit('DELETED_MESSAGE', msg);
            }
        });


        // socket.on('disconnect', () => {
        //     removeUser(socket?.id);
        //      io.emit('USERS_ADDED', onlineUsers);
        // });
           socket.on('disconnect', () => {
            removeUser(socket.id);
            io.emit('USERS_ADDED', Array.from(onlineUsers.values()));
        });
    });
};

export default socketInit;
