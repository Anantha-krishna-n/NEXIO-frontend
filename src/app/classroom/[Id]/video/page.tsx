"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import useSocketStore from "@/stores/socketStore";
import SimplePeer from "simple-peer";

export default function VideoCall() {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState(new Map<string, SimplePeer.Instance>());
  const [remoteStreams, setRemoteStreams] = useState(new Map<string, MediaStream>());

  const videoRef = useRef<HTMLVideoElement>(null);
  const { socket } = useSocketStore();
  const params = useParams();
  const classroomId = params.Id as string;

  useEffect(() => {
    const getMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(mediaStream);
        console.log("✅ Local stream obtained:", mediaStream);
      } catch (err) {
        console.error("❌ Error accessing media devices:", err);
      }
    };
    getMedia();
  }, []);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      console.log("🛑 Cleaning up local stream");
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  const toggleCamera = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !isCameraOn;
      });
      setIsCameraOn(prev => !prev);
    }
  };

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !isAudioOn;
      });
      setIsAudioOn(prev => !prev);
    }
  };

  const startCall = () => {
    if (!socket || !stream) return;
    setIsJoined(true);
    socket.emit("join-video-call", classroomId);

    socket.on("existing-users", (users: string[]) => {
      users.forEach((userId) => initiatePeer(userId, true));
    });

    socket.on("user-joined", ({ userId }: { userId: string }) => {
      if (!peers.has(userId)) initiatePeer(userId, false);
    });

    socket.on("webrtc-signal", ({ signal, from }) => {
      console.log(`📡 Received WebRTC signal from ${from}`);
      if (peers.has(from)) {
        peers.get(from)?.signal(signal);
      } else {
        initiatePeer(from, false);
      }
    });

    socket.on("user-left", ({ userId }) => {
      console.log(`🚪 User ${userId} left the call`);
      setPeers((prev) => {
        const newPeers = new Map(prev);
        if (newPeers.has(userId)) {
          newPeers.get(userId)?.destroy();
          newPeers.delete(userId);
        }
        return newPeers;
      });

      setRemoteStreams((prev) => {
        const newStreams = new Map(prev);
        if (newStreams.has(userId)) {
          newStreams.delete(userId);
        }
        return newStreams;
      });
    });
  };

  const initiatePeer = (userId: string, initiator: boolean) => {
    if (!stream || peers.has(userId)) return;

    console.log(`🔄 Initiating peer connection with ${userId}`);
    const newPeer = new SimplePeer({ initiator, trickle: false, stream });

    newPeer.on("signal", (data) => {
      console.log(`📡 Sending WebRTC signal to ${userId}`);
      socket?.emit("webrtc-signal", {
        classroomId,
        signal: data,
        from: socket.id,
        to: userId,
      });
    });

    newPeer.on("stream", (remoteStream) => {
      console.log(`✅ Received remote stream from ${userId}`, remoteStream);
      setRemoteStreams((prev) => new Map(prev).set(userId, remoteStream));
    });

    setPeers((prev) => new Map(prev).set(userId, newPeer));
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-white overflow-hidden">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardContent className="p-6 pb-2">
          <div className={`grid ${remoteStreams.size > 0 ? "grid-cols-2" : "grid-cols-1"} gap-4 bg-black p-2 rounded-lg`}>  
            {stream && (
                            <div className="h-[350px] overflow-hidden">

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted={!isAudioOn}
                className="w-full h-auto bg-black"
                style={{ backgroundColor: isCameraOn ? "transparent" : "black" }}
              />
              </div>
            )}
            {Array.from(remoteStreams.entries()).map(([userId, remoteStream]) => (
              <video
                key={userId}
                autoPlay
                playsInline
                className="w-full h-auto bg-black"
                ref={(el) => {
                  if (el && !el.srcObject) {
                    el.srcObject = remoteStream;
                  }
                }}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between bg-muted/50 p-4">
          <div className="flex space-x-4">
            <Button onClick={toggleCamera} variant={isCameraOn ? "default" : "destructive"}>
              {isCameraOn ? <Video /> : <VideoOff />}
            </Button>
            <Button onClick={toggleMic} variant={isAudioOn ? "default" : "destructive"}>
              {isAudioOn ? <Mic /> : <MicOff />}
            </Button>
          </div>
          {!isJoined ? (
            <Button onClick={startCall} className="bg-green-600 hover:bg-green-700">Join Meeting</Button>
          ) : (
            <Button variant="destructive" onClick={() => setIsJoined(false)}>Leave Meeting</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
