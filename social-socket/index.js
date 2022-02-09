const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};
io.on("connection", (socket) => {
  // connect
  console.log("New user connected");
  //   take suerId and soketId from user
  socket.on("addUser", (usersId) => {
    addUser(usersId, socket.id);
    io.emit("getUsers", users);
  });

  //   send & recieve message
  socket.on("sendMessage", ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit("recieveMessage", { senderId, receiverId, text });
  });
  // disconnect
  socket.on("disconnect", () => {
    console.log("user disconnect");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
