const { Server, Socket } = require("socket.io");

let io;
const connect_socket = (server) => {
  try {
     io = new Server(server, {
        cors: {
          origin: "*",
        },
      });

    io.on("connection", async function (socket) {
      console.log("socket.id", socket.id);
      let token_value = socket.handshake.headers.authorization;
      socket.on("disconnect", function () {
        client--;
        console.log("A user disconnected");
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const emitTaskAssigned = (socketId, taskData) => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  io.to(socketId).emit("taskAssigned", taskData);
};

module.exports = { connect_socket, emitTaskAssigned };
