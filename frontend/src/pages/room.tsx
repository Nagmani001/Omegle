import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client"

export default function Room() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const navigate = useNavigate();
  const myVideo = useRef<HTMLVideoElement | null>(null);
  const strangerVideo = useRef<HTMLVideoElement | null>(null);
  let type: any;
  let remoteSocketId: any;
  let peer: RTCPeerConnection;
  //let roomId: any;
  useEffect(() => {
    const socket = io("http://localhost:3000");
    setSocket(socket);
  }, []);
  function handleStart() {
    if (!socket) { return; }
    socket.emit("start", (person: any) => {
      type = person;
    });
    // socket.on("roomId", (id) => {
    //  roomId = id
    // })

    function start() {
      navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        .then(stream => {
          if (peer) {
            //@ts-ignore
            if (myVideo.current) {
              myVideo.current.srcObject = stream;
            }
            stream.getTracks().forEach(track => peer.addTrack(track, stream));
            peer.ontrack = e => {
              //@ts-ignore
              if (strangerVideo.current) {
                strangerVideo.current.srcObject = e.streams[0];
                strangerVideo.current.play();
              }
              //@ts-ignore
            }

          }
        })
        .catch(ex => {
          console.log(ex);
        });
    }

    socket.on("remote-socket", (id) => {
      remoteSocketId = id;
      peer = new RTCPeerConnection();
      peer.onnegotiationneeded = () => {
        webRTC();
      }
      peer.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("ice:send", { candidate: e.candidate, to: remoteSocketId })
        }
      }
      start();
    });
    socket.on("disconnected", () => {
      navigate("/disconnected");
    })
    async function webRTC() {
      if (type == "p1") {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        socket?.emit("sdp:send", { sdp: peer.localDescription });
      }
    }
    socket.on("sdp:reply", async ({ sdp }) => {
      await peer.setRemoteDescription(new RTCSessionDescription(sdp));
      if (type == "p2") {
        const ans = await peer.createAnswer();
        await peer.setLocalDescription(ans);
        socket.emit("sdp:send", { sdp: peer.localDescription });
      }
    });
    socket.on("ice:reply", async ({ candidate }) => {
      await peer.addIceCandidate(candidate);
    })
  }
  function handleStop() {
    if (strangerVideo.current) {
      strangerVideo.current.srcObject = null;
    }

  }
  return <div className="grid grid-cols-2 gap-4">
    <div className="bg-red-50 h-screen ">
      <div className="h-1/2">
        <video ref={strangerVideo} id="strangerVideo" autoPlay />
      </div>
      <div className="h-1/2">
        <video ref={myVideo} id="myVideo" autoPlay />
      </div>
    </div>
    <div className="bg-blue-50 relative">
      <div className="flex gap-3 absolute bottom-0" >
        <button onClick={handleStart} className="bg-blue-900 h-48 w-48">Start</button>
        <button onClick={handleStop} className="bg-red-900 h-48 w-48">stop</button>
      </div>
    </div>
  </div>
}
