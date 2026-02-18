import { Modal, ModalOverlay, ModalContent, ModalBody, Flex, Text, Avatar, Button, IconButton, useToast } from "@chakra-ui/react";
import { FaPhone, FaVideo, FaPhoneSlash, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { useSocket } from "../context/SocketContext";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import Peer from "simple-peer";

const CallModal = ({ isOpen, onClose, callData, isCallActive, setIsCallActive }) => {
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [callInfo, setCallInfo] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const { socket } = useSocket();
  const user = useRecoilValue(userAtom);
  const toast = useToast();
  
  const myVideoRef = useRef();
  const userVideoRef = useRef();
  const peerRef = useRef();

  // Initialize call when callData is received
  useEffect(() => {
    if (callData && !isCallActive) {
      setReceivingCall(true);
      setCallInfo(callData);
      setIsVideo(callData.isVideo);
    }
  }, [callData, isCallActive]);

  // Set up media stream when call is active
  useEffect(() => {
    if (isOpen && !stream) {
      navigator.mediaDevices.getUserMedia({ video: isVideo, audio: true })
        .then((currentStream) => {
          setStream(currentStream);
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = currentStream;
          }
        })
        .catch((err) => {
          console.log("Error accessing media devices:", err);
          toast({ title: "Camera/Mic access denied", status: "error", duration: 3000 });
        });
    }

    return () => {
      // Cleanup handled in handleEndCall
    };
  }, [isOpen, isVideo, toast, stream]);

  // Set up socket listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      if (peerRef.current) {
        peerRef.current.signal(signal);
      }
    });

    socket.on("callEnded", () => {
      handleEndCall();
    });

    socket.on("answerCall", ({ signal }) => {
      setCallAccepted(true);
      if (peerRef.current) {
        peerRef.current.signal(signal);
      }
    });

    return () => {
      socket.off("callAccepted");
      socket.off("callEnded");
      socket.off("answerCall");
    };
  }, [socket]);

  // Create peer when call is answered
  useEffect(() => {
    if (callAccepted && stream && callInfo) {
      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: stream,
      });

      peer.on("signal", (signal) => {
        socket.emit("answerCall", {
          to: callInfo.from,
          signal: signal,
        });
      });

      peer.on("stream", (remoteStream) => {
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = remoteStream;
        }
      });

      peerRef.current = peer;
    }
  }, [callAccepted, stream, callInfo, socket]);

  // Start call to user
  const handleCallUser = (userToCallId) => {
    setIsCallActive(true);
    setReceivingCall(false);

    navigator.mediaDevices.getUserMedia({ video: isVideo, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = currentStream;
        }

        const peer = new Peer({
          initiator: true,
          trickle: false,
          stream: currentStream,
        });

        peer.on("signal", (signal) => {
          socket.emit("callUser", {
            userToCall: userToCallId,
            signalData: signal,
            from: user._id,
            name: user.name,
            profilePic: user.profilePic,
            isVideo: isVideo,
          });
        });

        peer.on("stream", (remoteStream) => {
          if (userVideoRef.current) {
            userVideoRef.current.srcObject = remoteStream;
          }
        });

        peerRef.current = peer;
      });
  };

  const handleAnswerCall = () => {
    setCallAccepted(true);
    setReceivingCall(false);
    setIsCallActive(true);
  };

  const handleEndCall = () => {
    // Notify the other party
    if (callInfo) {
      const otherUserId = callInfo.isInitiator ? callInfo.from : callInfo.from;
      socket?.emit("endCall", { to: otherUserId });
    }
    
    setCallEnded(true);
    setIsCallActive(false);
    setReceivingCall(false);
    setCallAccepted(false);
    setCallInfo(null);
    setIsMuted(false);
    setIsVideoOff(false);
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    
    onClose();
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const toggleMic = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  // Auto-start call when button clicked
  useEffect(() => {
    if (isCallActive && !callAccepted && !receivingCall && callInfo) {
      handleCallUser(callInfo.from);
    }
  }, [isCallActive]);

  return (
    <Modal isOpen={isOpen} onClose={handleEndCall} isCentered size="xl">
      <ModalOverlay bg="blackAlpha.800" />
      <ModalContent bg="#161b22" border="1px solid" borderColor="#30363d" borderRadius="xl" overflow="hidden">
        <ModalBody p={0}>
          <Flex direction="column" alignItems="center" justifyContent="center" minH="400px" position="relative">
            {/* Remote User Video or Avatar */}
            {(callAccepted && !callEnded) ? (
              isVideo && !isVideoOff ? (
                <video 
                  ref={userVideoRef} 
                  autoPlay 
                  playsInline 
                  style={{ 
                    width: "100%", 
                    maxHeight: "400px", 
                    objectFit: "cover",
                    borderRadius: "8px"
                  }} 
                />
              ) : (
                <Flex direction="column" alignItems="center" gap={4} py={10}>
                  <Avatar size="2xl" src={callInfo?.profilePic} name={callInfo?.name} />
                  <Text color="white" fontSize="xl" fontWeight="bold">
                    {callInfo?.name}
                  </Text>
                </Flex>
              )
            ) : receivingCall ? (
              <Flex direction="column" alignItems="center" gap={4}>
                <Avatar size="2xl" src={callInfo?.profilePic} name={callInfo?.name} />
                <Text color="white" fontSize="xl" fontWeight="bold">
                  {callInfo?.name} is calling...
                </Text>
                <Text color="gray.400" fontSize="sm">
                  {callInfo?.isVideo ? "Video call" : "Voice call"}
                </Text>
                <Flex gap={4}>
                  <Button 
                    colorScheme="green" 
                    size="lg" 
                    leftIcon={<FaPhone />} 
                    onClick={handleAnswerCall}
                  >
                    Answer
                  </Button>
                  <Button 
                    colorScheme="red" 
                    size="lg" 
                    leftIcon={<FaPhoneSlash />} 
                    onClick={handleEndCall}
                  >
                    Decline
                  </Button>
                </Flex>
              </Flex>
            ) : (
              <Flex direction="column" alignItems="center" gap={4} py={10}>
                <Avatar size="2xl" src={user?.profilePic} name={user?.name} />
                <Text color="white" fontSize="xl">
                  {isCallActive ? "Connecting..." : "Ready to call"}
                </Text>
              </Flex>
            )}

            {/* My Video (Picture in Picture) */}
            {stream && (isCallActive || receivingCall) && !isVideoOff && (
              <Flex 
                position="absolute" 
                bottom="20px" 
                right="20px"
                w="120px" 
                h="90px"
                borderRadius="md"
                overflow="hidden"
                border="2px solid"
                borderColor="#30363d"
              >
                <video 
                  ref={myVideoRef} 
                  autoPlay 
                  muted 
                  playsInline 
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              </Flex>
            )}

            {/* Call Controls */}
            {callAccepted && !callEnded && (
              <Flex position="absolute" bottom="20px" gap={4}>
                <IconButton 
                  icon={isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />} 
                  onClick={toggleMic}
                  colorScheme={isMuted ? "red" : "gray"}
                  borderRadius="full"
                  size="lg"
                  aria-label="Toggle microphone"
                />
                <IconButton 
                  icon={isVideoOff ? <FaVideo style={{ transform: 'rotate(180deg)' }} /> : <FaVideo />} 
                  onClick={toggleVideo}
                  colorScheme={isVideoOff ? "red" : "gray"}
                  borderRadius="full"
                  size="lg"
                  aria-label="Toggle video"
                />
                <IconButton 
                  icon={<FaPhoneSlash />} 
                  onClick={handleEndCall}
                  colorScheme="red"
                  borderRadius="full"
                  size="lg"
                  aria-label="End call"
                />
              </Flex>
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CallModal;
