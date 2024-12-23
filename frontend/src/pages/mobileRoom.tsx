import Spinner from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { handleRestart, handleStart, handleStop, onMount } from "@/lib/webrtc";
import { useEffect, useRef, useState } from "react";

export default function MobileRoom() {

  const [showFirst, setShowFirst] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const myVideo = useRef<HTMLVideoElement | null>(null);
  const strangerVideo = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    onMount(myVideo);
  }, []);

  return <div className="grid-rows-3 h-screen">
    <div className="h-2/5">
      {isConnected ?
        <video className="w-full h-full object-cover transform scale-x-[-1]" ref={strangerVideo} id="strangerVideo" autoPlay />
        : <Spinner />
      }
    </div>
    <div className="h-2/5 bg-black">
      <video className="w-full h-full transform scale-x-[-1]" ref={myVideo} id="myVideo" autoPlay />
    </div>
    <div className="h-1/5 ">
      <div className="flex justify-center gap-10 pt-3 pl-3">
        {
          showFirst ?
            <Button onClick={() => { setShowFirst(false); handleStart(strangerVideo, setIsConnected) }} className="h-20 w-20">Start</Button>
            :
            <Button onClick={() => { setShowFirst(false); handleRestart(strangerVideo, setIsConnected) }} className="h-20 w-20">Next</Button>
        }
        <Button onClick={() => { handleStop(strangerVideo, setIsConnected) }} className="h-20 w-20" variant="secondary">Stop</Button>
      </div>
    </div>
  </div>
}
