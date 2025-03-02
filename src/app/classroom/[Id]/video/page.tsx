"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, MicOff, Video, VideoOff, Users } from "lucide-react"

export default function VideoCall() {
  const [isCameraOn, setIsCameraOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isJoined, setIsJoined] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Get local media stream when component mounts
    const getMedia = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        setStream(mediaStream)

        // Connect stream to video element
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (err) {
        console.error("Error accessing media devices:", err)
      }
    }

    getMedia()

    // Cleanup function to stop all tracks when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, []) // Added stream to dependencies

  // Toggle camera on/off
  const toggleCamera = () => {
    if (stream) {
      stream.getVideoTracks().forEach((track) => {
        if (track.enabled) {
          track.stop(); 
        }
      });
  
      // Restart camera if turning it back on
      if (!isCameraOn) {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((newStream) => {
            const newVideoTrack = newStream.getVideoTracks()[0];
            setStream((prevStream) => {
              if (prevStream) {
                prevStream.removeTrack(prevStream.getVideoTracks()[0]);
                prevStream.addTrack(newVideoTrack);
              }
              return newStream;
            });
  
            if (videoRef.current) {
              videoRef.current.srcObject = newStream;
            }
          })
          .catch((err) => console.error("Error accessing camera:", err));
      }
    }
    setIsCameraOn(!isCameraOn);
  };
  

  // Toggle microphone on/off
  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled
      })
      setIsAudioOn(!isAudioOn)
    }
  }

  // Join meeting room
  const joinMeeting = () => {
    setIsJoined(true)
    // Here you would implement your WebRTC and socket connection logic
    console.log("Joining meeting room...")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#ffffff] ">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="bg-primary text-primary-foreground">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Live Classroom
            {isJoined && <span className="text-sm bg-red-500 px-2 py-0.5 rounded-full ml-2">LIVE</span>}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            {/* Local video stream */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${!isCameraOn ? "hidden" : ""}`}
            />

            {/* Placeholder when camera is off */}
            {!isCameraOn && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                <div className="text-white text-center">
                  <VideoOff className="h-16 w-16 mx-auto mb-2 opacity-50" />
                  <p>Camera is turned off</p>
                </div>
              </div>
            )}

            {/* Status indicators */}
            <div className="absolute bottom-4 left-4 flex gap-2">
              {!isAudioOn && (
                <div className="bg-red-500 p-1 rounded-full">
                  <MicOff className="h-4 w-4 text-white" />
                </div>
              )}
              {!isCameraOn && (
                <div className="bg-red-500 p-1 rounded-full">
                  <VideoOff className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          </div>

          {!isJoined && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-amber-800">
                Ready to join the live classroom? Click the Join button below to connect.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between bg-muted/50 p-4">
          <div className="flex gap-2">
            <Button variant={isAudioOn ? "default" : "destructive"} size="icon" onClick={toggleAudio}>
              {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
            </Button>
            <Button variant={isCameraOn ? "default" : "destructive"} size="icon" onClick={toggleCamera}>
              {isCameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
            </Button>
          </div>

          {!isJoined ? (
            <Button onClick={joinMeeting} className="bg-green-600 hover:bg-green-700">
              Join Meeting
            </Button>
          ) : (
            <Button variant="destructive" onClick={() => setIsJoined(false)}>
              Leave Meeting
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

