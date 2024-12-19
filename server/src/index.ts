import { Server } from "socket.io";
import { room } from "./types";
import { checkSocket, handleStart, handleStop } from "./lib";
const io = new Server({ cors: { origin: "*" } });



let roomArr: Array<room> = [];

io.on("connection", (socket) => {
  console.log("client connected");
  socket.on("start", cb => {
    handleStart(socket, cb, io, roomArr);
    console.log("roomAssigned to client");
  })
  socket.on("disconnect", () => {
    handleStop(socket, io, roomArr);
  })
  // socket.on("restart", cb => {
  //    handleRestart();
  // });


  socket.on("sdp:send", ({ sdp }) => {
    if (sdp) {
      let res = checkSocket(socket, roomArr);
      if (res) {
        if (res.type == "p1") {
          res.p2Id && io.to(res.p2Id).emit("sdp:reply", { sdp, from: socket.id })
          console.log("sdp sent to p2");
        } else if (res.type == "p2") {
          res.p1Id && io.to(res.p1Id).emit("sdp:reply", { sdp, from: socket.id })
          console.log("sdp sent to p1");
        }
      }
    }
  });

  socket.on("ice:send", ({ candidate }) => {
    if (candidate) {
      let res = checkSocket(socket, roomArr);
      if (res) {
        if (res.type == "p1") {
          res.p2Id && io.to(res.p2Id).emit("ice:reply", { candidate, from: socket.id })
          console.log("ice sent to p2");
        } else if (res.type == "p2") {
          res.p1Id && io.to(res.p1Id).emit("ice:reply", { candidate, from: socket.id })
          console.log("ice sent to p1");
        }
      }
    }
  });

  //  socket.on("message-send", ({ input, type, roomId }) => {

  // });
});



io.listen(3000);
