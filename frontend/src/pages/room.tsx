import OmegleChat from "@/components/chat";
import { Button } from "@/components/ui/button";
import { handleStart, handleStop, onMount } from "@/lib/webrtc";
import { useEffect, useRef } from "react";

export default function Room() {
  const myVideo = useRef<HTMLVideoElement | null>(null);
  const strangerVideo = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    onMount(myVideo);
  }, []);



  return <div className="flex h-screen">
    <div className="flex flex-col gap-1 h-full w-2/5 bg-green-50">
      <div className="h-1/2 bg-gray-50">
        <video className="w-[770px] h-[480px] object-cover" ref={strangerVideo} id="strangerVideo" autoPlay />
      </div>
      <div className="h-1/2 bg-zinc-400">
        <video ref={myVideo} id="myVideo" autoPlay />
      </div>
    </div>



    <div className="w-3/5 bg-red-50 h-screen ">
      <div className="flex gap-3 absolute bottom-0" >
        <Button onClick={() => { handleStart(myVideo, strangerVideo) }} variant="default">Start</Button>
        <Button onClick={handleStop} variant="secondary">Stop</Button>
      </div>
      <div className="h-full">
        <OmegleChat />
      </div>
    </div>
  </div>
}
