const express = require("express");
const cors = require("cors");
const socketio = require("socket.io");
const Chat = require("./Routes/Chat");
const Lib = require("./Lib/index");

const helper = new Lib();

const app = express();
const port = 8000;

app.use(express());
app.use(cors());
app.use("/chat", Chat);

const webSocket = app.listen(port, () => {
  console.log(`Chat is running on http://localhost:${port}/`);
});

const io = socketio(webSocket);

io.on("connection", (socket) => {
  socket.on("join-room", (data) => {
    if (data.room === undefined || data.username == undefined) {
      socket.emit("join-room", {
        code: "3000",
        message: "Required field is not found",
      });
      return 0;
    }
    if (data.room === "" || data.username == "") {
      socket.emit("join-room", {
        code: "3001",
        message: "Required field is empty",
      });
      return 0;
    }

    const username = data.username;
    const room = data.room;
    socket.join(room);
    helper.joinUser(socket.id, username, room);

    //Send acknowledge message to the user
    io.to(socket.id).emit("join-room", {
      userId: socket.id,
      username: username,
      code: "2000",
      message: `${username} is added`,
    });

    //listen to chat event
    socket.on("chat", (data) => {
      //throw to all users in the room id
      let singleUser = helper.getSingleUser(socket.id);
      let senderUserName = singleUser.userName;
      let senderUserId = singleUser.userId;
      let senderUserMsg = data.msg;
      
      console.log(data);
      io.to(singleUser.roomId).emit("chat", {
        username: senderUserName,
        userId: senderUserId,
        code: "2000",
        message: senderUserMsg,
      });
    });
  });
});
