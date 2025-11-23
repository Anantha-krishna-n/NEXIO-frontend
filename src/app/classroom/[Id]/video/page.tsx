"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Mic, MicOff, Video, VideoOff } from "lucide-react";
import useSocketStore from "@/stores/socketStore";
import { useUserStore } from "@/stores/authStore";

interface RemoteUser {
  stream: MediaStream;
  userName: string;
}

export default function VideoCall() {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState(new Map<string, RemoteUser>());
  const [isStreamReady, setIsStreamReady] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef(new Map<string, RTCPeerConnection>());
  
  const { socket, connect } = useSocketStore();
  const { user } = useUserStore();
  const params = useParams();
  const classroomId = params.Id as string;

  // Monitor socket connection status
  useEffect(() => {
    if (socket) {
      const handleConnect = () => {
        console.log("✅ Socket connected:", socket.id);
        setIsSocketConnected(true);
      };

      const handleDisconnect = () => {
        console.log("❌ Socket disconnected");
        setIsSocketConnected(false);
      };

      // Check if already connected
      if (socket.connected) {
        console.log("✅ Socket already connected:", socket.id);
        setIsSocketConnected(true);
      }

      socket.on("connect", handleConnect);
      socket.on("disconnect", handleDisconnect);

      return () => {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
      };
    } else {
      setIsSocketConnected(false);
    }
  }, [socket]);

  // Initialize socket connection
  useEffect(() => {
    console.log("🔌 Initializing socket connection...");
    connect();
  }, [connect]);

  // Get media stream
  useEffect(() => {
    const getMedia = async () => {
      try {
        console.log("📹 Requesting camera and microphone access...");
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        console.log("✅ Media stream obtained:", mediaStream);
        console.log("📊 Video tracks:", mediaStream.getVideoTracks().length);
        console.log("📊 Audio tracks:", mediaStream.getAudioTracks().length);
        
        streamRef.current = mediaStream;
        setIsStreamReady(true);
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("❌ Error accessing media devices:", err);
        alert("Failed to access camera/microphone. Please grant permissions and refresh the page.");
        setIsStreamReady(false);
      }
    };
    getMedia();

    return () => {
      // Cleanup on unmount
      streamRef.current?.getTracks().forEach(track => {
        track.stop();
        console.log("🛑 Stopped track:", track.kind);
      });
      peerConnectionsRef.current.forEach((pc, userId) => {
        pc.close();
        console.log("🔌 Closed peer connection for:", userId);
      });
    };
  }, []);

  const toggleCamera = () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !isCameraOn;
      });
      setIsCameraOn(prev => !prev);
    }
  };

  const toggleMic = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !isAudioOn;
      });
      setIsAudioOn(prev => !prev);
    }
  };

  const createPeerConnection = (userId: string, userName: string) => {
    console.log("🔗 Creating peer connection for:", userId, userName);
    
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        console.log("📡 Sending ICE candidate to:", userId);
        socket.emit("webrtc-candidate", {
          classroomId,
          candidate: event.candidate,
          from: socket.id,
          to: userId,
        });
      }
    };

    // Handle incoming tracks
    pc.ontrack = (event) => {
      console.log("📺 Received remote track from:", userId, userName);
      console.log("  Track kind:", event.track.kind);
      console.log("  Stream ID:", event.streams[0]?.id);
      console.log("  Track count:", event.streams[0]?.getTracks().length);
      
      setRemoteUsers(prev => {
        const newMap = new Map(prev);
        // If user already exists (e.g. from handleUserJoined), update stream
        // Otherwise create new entry
        const existingUser = newMap.get(userId);
        newMap.set(userId, { 
          stream: event.streams[0], 
          userName: existingUser?.userName || userName || "Unknown User" 
        });
        console.log(`✅ Updated remoteUsers for ${userId}, userName: ${existingUser?.userName || userName || "Unknown User"}`);
        return newMap;
      });
    };

    // Monitor connection state
    pc.onconnectionstatechange = () => {
      console.log(`🔌 Connection state with ${userId}:`, pc.connectionState);
      if (pc.connectionState === "failed" || pc.connectionState === "disconnected") {
        console.warn(`⚠️ Connection with ${userId} ${pc.connectionState}`);
      }
    };

    // Add local stream tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, streamRef.current!);
        console.log(`➕ Added ${track.kind} track for:`, userId);
      });
    }

    peerConnectionsRef.current.set(userId, pc);
    return pc;
  };

  // Setup socket listeners and handle WebRTC signaling
  useEffect(() => {
    if (!socket || !isJoined) return;

    console.log("🎯 Setting up socket listeners for classroom:", classroomId);

    // Handle existing users in the room
    const handleExistingUsers = async (users: { userId: string, userName: string }[]) => {
      console.log("👥 Existing users in room:", users);
      
      for (const existingUser of users) {
        if (existingUser.userId === socket.id) continue;
        
        // Don't create duplicate connections
        if (peerConnectionsRef.current.has(existingUser.userId)) {
          console.log("⏭️ Already connected to:", existingUser.userId);
          continue;
        }
        
        // Store user info even before track arrives
        setRemoteUsers(prev => {
          const newMap = new Map(prev);
          // We don't have a stream yet, but we know the name
          // We'll update the stream in ontrack
          // Note: We can't really put a null stream here if our type requires it.
          // But createPeerConnection will handle the ontrack event later.
          // For now, let's just create the PC.
          return newMap;
        });

        const pc = createPeerConnection(existingUser.userId, existingUser.userName);
        
        console.log(`🔍 PC signaling state before creating offer for ${existingUser.userId}:`, pc.signalingState);
        
        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          console.log(`✅ Created offer for ${existingUser.userId}, state now:`, pc.signalingState);
          console.log("📤 Sending offer to:", existingUser.userId);
          
          socket.emit("webrtc-offer", {
            classroomId,
            offer,
            from: socket.id,
            to: existingUser.userId,
            userName: user?.name || "Anonymous" // Send OUR name (logged-in user)
          });
        } catch (err) {
          console.error("❌ Error creating offer for", existingUser.userId, err);
        }
      }
    };

    // Handle new user joining
    const handleUserJoined = ({ userId, userName }: { userId: string, userName: string }) => {
      console.log("👤 New user joined:", userId, userName);
      
      if (userId === socket.id || peerConnectionsRef.current.has(userId)) {
        return;
      }
      
      // Just create the connection, they will send us an offer
      createPeerConnection(userId, userName);
    };

    // Handle incoming offer
    const handleWebRTCOffer = async ({ offer, from, userName }: any) => {
      console.log("📥 Received offer from:", from);
      
      let pc = peerConnectionsRef.current.get(from);
      
      if (!pc) {
        console.log("🆕 Creating new peer connection for:", from);
        pc = createPeerConnection(from, userName);
      } else {
        console.log("♻️ Reusing existing peer connection for:", from);
      }
      
      console.log(`🔍 PC signaling state before offer for ${from}:`, pc.signalingState);
      
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        console.log(`✅ Set remote offer for ${from}, state now:`, pc.signalingState);
        
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        console.log(`✅ Created and set local answer for ${from}, state now:`, pc.signalingState);
        
        console.log("📤 Sending answer to:", from);
        socket.emit("webrtc-answer", {
          classroomId,
          answer,
          from: socket.id,
          to: from,
        });
      } catch (err) {
        console.error("❌ Error handling offer from", from, err);
      }
    };

    // Handle incoming answer
    const handleWebRTCAnswer = async ({ answer, from }: any) => {
      console.log("📥 Received answer from:", from);
      
      const pc = peerConnectionsRef.current.get(from);
      if (pc) {
        // Check signaling state before setting remote answer
        console.log(`🔍 PC signaling state for ${from}:`, pc.signalingState);
        
        if (pc.signalingState !== "have-local-offer") {
          console.warn(`⚠️ Cannot set remote answer - PC is in ${pc.signalingState} state, expected have-local-offer`);
          return;
        }
        
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(answer));
          console.log("✅ Set remote description for:", from);
        } catch (err) {
          console.error("❌ Error setting remote description from", from, err);
        }
      } else {
        console.warn("⚠️ No peer connection found for:", from);
      }
    };

    // Handle ICE candidate
    const handleWebRTCCandidate = ({ candidate, from }: any) => {
      console.log("📥 Received ICE candidate from:", from);
      
      const pc = peerConnectionsRef.current.get(from);
      if (pc) {
        pc.addIceCandidate(new RTCIceCandidate(candidate))
          .then(() => console.log("✅ Added ICE candidate from:", from))
          .catch(err => console.error("❌ Error adding ICE candidate from", from, err));
      }
    };

    // Handle user leaving
    const handleUserLeft = ({ userId }: { userId: string }) => {
      console.log("👋 User left:", userId);
      
      const pc = peerConnectionsRef.current.get(userId);
      if (pc) {
        pc.close();
        peerConnectionsRef.current.delete(userId);
        
        setRemoteUsers(prev => {
          const newMap = new Map(prev);
          newMap.delete(userId);
          return newMap;
        });
      }
    };

    // Register all event listeners
    socket.on("existing-users", handleExistingUsers);
    socket.on("user-joined", handleUserJoined);
    socket.on("webrtc-offer", handleWebRTCOffer);
    socket.on("webrtc-answer", handleWebRTCAnswer);
    socket.on("webrtc-candidate", handleWebRTCCandidate);
    socket.on("user-left", handleUserLeft);

    // Cleanup function
    return () => {
      console.log("🧹 Cleaning up socket listeners");
      socket.off("existing-users", handleExistingUsers);
      socket.off("user-joined", handleUserJoined);
      socket.off("webrtc-offer", handleWebRTCOffer);
      socket.off("webrtc-answer", handleWebRTCAnswer);
      socket.off("webrtc-candidate", handleWebRTCCandidate);
      socket.off("user-left", handleUserLeft);
    };
  }, [socket, isJoined, classroomId]);

  const startCall = () => {
    console.log("🔍 DEBUG - Button clicked!");
    console.log("  Socket exists:", !!socket);
    console.log("  Socket connected:", socket?.connected);
    console.log("  Stream exists:", !!streamRef.current);
    console.log("  isStreamReady:", isStreamReady);
    console.log("  isSocketConnected:", isSocketConnected);
    console.log("  User:", user?.name);
    
    if (!socket) {
      alert("Socket not connected. Please refresh the page.");
      return;
    }
    
    if (!socket.connected) {
      alert("Socket is not connected to server. Please check if backend is running.");
      return;
    }
    
    if (!streamRef.current) {
      alert("Media stream not ready. Please allow camera/microphone access.");
      return;
    }
    
    console.log("🚀 Joining video call in classroom:", classroomId);
    setIsJoined(true);
    // Send as object to match backend signature
    socket.emit("join-video-call", { 
      classroomId, 
      userName: user?.name || "Anonymous" 
    });
  };

  const leaveCall = () => {
    console.log("👋 Leaving video call");
    setIsJoined(false);
    
    if (socket) {
      socket.emit("leave-video-call", classroomId);
    }
    
    // Close all peer connections
    peerConnectionsRef.current.forEach((pc, userId) => {
      pc.close();
      console.log("🔌 Closed connection with:", userId);
    });
    
    peerConnectionsRef.current.clear();
    setRemoteUsers(new Map());
  };

  // Debug: Log state changes
  useEffect(() => {
    console.log("🔍 State Update:");
    console.log("  isStreamReady:", isStreamReady);
    console.log("  isSocketConnected:", isSocketConnected);
    console.log("  Socket object exists:", !!socket);
    console.log("  Socket connected:", socket?.connected);
    console.log("  Button should be enabled:", isSocketConnected && isStreamReady);
  }, [isStreamReady, isSocketConnected, socket]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-4xl shadow-xl">
        <CardContent className="p-6 pb-2">
          <div className={`grid ${remoteUsers.size > 0 ? "grid-cols-2" : "grid-cols-1"} gap-4 bg-black p-2 rounded-lg`}>
            {/* Local video */}
            <div className="h-[350px] overflow-hidden relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded"
              />
              <span className="absolute bottom-2 left-2 text-white bg-black/50 px-2 py-1 rounded">
                {user?.name || "You"} {isJoined && "(Joined)"}
              </span>
              {!isCameraOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <VideoOff className="w-16 h-16 text-white" />
                </div>
              )}
            </div>
            
            {/* Remote videos */}
            {Array.from(remoteUsers.entries()).map(([userId, remoteUser]) => (
              <div key={userId} className="h-[350px] overflow-hidden relative">
                <video
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover rounded"
                  ref={(el) => {
                    if (el && el.srcObject !== remoteUser.stream) {
                      console.log(`🎬 Attaching stream to video element for ${userId}`, remoteUser.userName);
                      console.log(`   Stream has ${remoteUser.stream?.getTracks().length} tracks`);
                      el.srcObject = remoteUser.stream;
                      
                      // Log when video starts playing
                      el.onloadedmetadata = () => {
                        console.log(`✅ Video metadata loaded for ${userId}`);
                        el.play().catch(err => console.error(`❌ Error playing video for ${userId}:`, err));
                      };
                    }
                  }}
                />
                <span className="absolute bottom-2 left-2 text-white bg-black/50 px-2 py-1 rounded">
                  {remoteUser.userName}
                </span>
              </div>
            ))}
          </div>
          
          {/* Connection info */}
          <div className="mt-4 text-sm text-gray-600">
            <p>Participants: {remoteUsers.size + 1}</p>
            {socket && <p className="text-xs">Socket ID: {socket.id?.slice(0, 8)}</p>}
            <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
              <p className={isStreamReady ? "text-green-600" : "text-red-600"}>
                📹 Camera/Mic: {isStreamReady ? "Ready ✓" : "Not Ready ✗"}
              </p>
              <p className={isSocketConnected ? "text-green-600" : "text-red-600"}>
                🔌 Socket: {isSocketConnected ? "Connected ✓" : "Disconnected ✗"}
              </p>
              {!isStreamReady && <p className="text-orange-600 mt-1">⚠️ Please grant camera/mic permissions</p>}
              {!isSocketConnected && <p className="text-orange-600 mt-1">⚠️ Backend not connected</p>}
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between bg-gray-100 p-4">
          <div className="flex space-x-4">
            <Button 
              onClick={toggleCamera} 
              variant={isCameraOn ? "default" : "destructive"}
              disabled={!streamRef.current}
            >
              {isCameraOn ? <Video /> : <VideoOff />}
            </Button>
            <Button 
              onClick={toggleMic} 
              variant={isAudioOn ? "default" : "destructive"}
              disabled={!streamRef.current}
            >
              {isAudioOn ? <Mic /> : <MicOff />}
            </Button>
          </div>
          
          {!isJoined ? (
            <Button 
              onClick={startCall} 
              className="bg-green-600 hover:bg-green-700"
              disabled={!isSocketConnected || !isStreamReady}
            >
              Join Meeting
            </Button>
          ) : (
            <Button variant="destructive" onClick={leaveCall}>
              Leave Meeting
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
