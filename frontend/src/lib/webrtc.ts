import { io } from "socket.io-client";

let socket: any;
let stream: null | MediaStream;
let type: any;
let remoteSocketId: any;
let peer: RTCPeerConnection;
let roomId: any;

export const onMount = async (myVideo: any) => {
  const connSocket = io("http://localhost:3000");
  const connStream = await navigator.mediaDevices.getUserMedia({
    audio: true, video: {
      width: { ideal: 770 },
      height: { ideal: 480 }
    }
  });
  socket = connSocket;
  stream = connStream;
  if (myVideo.current) {
    myVideo.current.srcObject = stream;
  }
}

export function handleStart(myVideo: any, strangerVideo: any) {
  if (!socket) { return; }
  socket.emit("start", (person: any) => {
    type = person;
  });

  socket.on("roomId", (id: any) => {
    roomId = id
  })
  socket.on("remote-socket", (id: number) => {
    remoteSocketId = id;
    peer = new RTCPeerConnection();
    peer.onnegotiationneeded = () => {
      webRTC(type, peer);
    }
    peer.onicecandidate = (e: any) => {
      if (e.candidate) {
        socket?.emit("ice:send", { candidate: e.candidate, to: remoteSocketId })
      }
    }
    start(peer, myVideo, strangerVideo);
  });

  socket.on("sdp:reply", async ({ sdp }: { sdp: any }) => {
    await peer.setRemoteDescription(new RTCSessionDescription(sdp));
    if (type == "p2") {
      const ans = await peer.createAnswer();
      await peer.setLocalDescription(ans);
      socket?.emit("sdp:send", { sdp: peer.localDescription });
    }
  });
  socket.on("ice:reply", async ({ candidate }: { candidate: any }) => {
    await peer.addIceCandidate(candidate);
  });

  socket.on("disconnected", () => {
  })
}

async function webRTC(type: any, peer: any) {
  if (type == "p1") {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    socket?.emit("sdp:send", { sdp: peer.localDescription });
  }
}

async function start(peer: any, myVideo: any, strangerVideo: any) {
  try {
    if (peer) {
      if (myVideo.current) {
        myVideo.current.srcObject = stream;
      }
      if (!stream) { return; }
      stream.getTracks().forEach(track => peer.addTrack(track, stream));

      peer.ontrack = (e: any) => {
        if (strangerVideo.current) {

          strangerVideo.current.srcObject = e.streams[0];
          strangerVideo.current.play();
        }
      }
    }
  } catch (ex) {
    console.log(ex);
  }
}

export function handleStop() {
  socket?.emit("stop");
}

export function handleSendMessage(input: any, setMessages: any) {
  setMessages((prevMessages: any) => [...prevMessages, { sender: "You", content: input }])
  socket.emit("message-send", { input, type, roomId });
}

export function handleReplyMessage(setMessages: any) {
  socket?.on("message-reply", (reply: any) => {
    setMessages((prevMessages: any) => [...prevMessages, { sender: "Stranger", content: reply }])
  })
}

export function offSocket() {
  socket?.off("message-reply")
}
export function checkStatus(setConnected: any) {
  if (peer) {
    setConnected(true);
  }
}