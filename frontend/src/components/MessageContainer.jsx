import { Avatar, Divider, Flex, IconButton, Image, Skeleton, SkeletonCircle, Text, useColorModeValue, useDisclosure } from "@chakra-ui/react";
import Message from "./Message";
import MessageInput from "./MessageInput";
import CallModal from "./CallModal";
import { useEffect, useRef, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import { conversationsAtom, selectedConversationAtom } from "../atoms/messagesAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useSocket } from "../context/SocketContext.jsx";
import { FaPhone, FaVideo } from "react-icons/fa";
import messageSound from "../assets/sounds/newMessage.mp3";
const MessageContainer = () => {
	const showToast = useShowToast();
	const selectedConversation = useRecoilValue(selectedConversationAtom);
	const [loadingMessages, setLoadingMessages] = useState(true);
	const [messages, setMessages] = useState([]);
	const currentUser = useRecoilValue(userAtom);
	const { socket } = useSocket();
	const setConversations = useSetRecoilState(conversationsAtom);
	const messageEndRef = useRef(null);
	
	const { isOpen: isCallOpen, onOpen: onCallOpen, onClose: onCallClose } = useDisclosure();
	const [isCallActive, setIsCallActive] = useState(false);
	const [callData, setCallData] = useState(null);
	const [isVideoCall, setIsVideoCall] = useState(false);

	useEffect(() => {
		socket?.on("callUser", ({ signal, from, name, profilePic, isVideo }) => {
			setCallData({ signal, from, name, profilePic, isVideo, isInitiator: false });
			onCallOpen();
		});

		socket?.on("callAccepted", (signal) => {
			// Call was accepted, update callData to reflect this
			setCallData(prev => prev ? { ...prev, signal, isAccepted: true } : null);
		});

		socket?.on("callEnded", () => {
			setIsCallActive(false);
			setCallData(null);
			onCallClose();
		});

		return () => {
			socket?.off("callUser");
			socket?.off("callAccepted");
			socket?.off("callEnded");
		};
	}, [socket, onCallOpen, onCallClose]);


	const handleVoiceCall = () => {
		const callInfo = {
			from: currentUser._id,
			name: currentUser.name,
			profilePic: currentUser.profilePic,
			isVideo: false,
			isInitiator: true,
			userToCall: selectedConversation.userId
		};
		setCallData(callInfo);
		setIsVideoCall(false);
		onCallOpen();
	};


	const handleVideoCall = () => {
		const callInfo = {
			from: currentUser._id,
			name: currentUser.name,
			profilePic: currentUser.profilePic,
			isVideo: true,
			isInitiator: true,
			userToCall: selectedConversation.userId
		};
		setCallData(callInfo);
		setIsVideoCall(true);
		onCallOpen();
	};

	useEffect(() => {
		socket.on("newMessage", (message) => {
			if (selectedConversation._id === message.conversationId) {
				setMessages((prev) => [...prev, message]);
			}

			// make a sound if the window is not focused
			if (!document.hasFocus()) {
				const sound = new Audio(messageSound);
				sound.play();
			}

			setConversations((prev) => {
				const updatedConversations = prev.map((conversation) => {
					if (conversation._id === message.conversationId) {
						return {
							...conversation,
							lastMessage: {
								text: message.text,
								sender: message.sender,
							},
						};
					}
					return conversation;
				});
				return updatedConversations;
			});
		});

		return () => socket.off("newMessage");
	}, [socket, selectedConversation, setConversations]);

	useEffect(() => {
		const lastMessageIsFromOtherUser = messages.length && messages[messages.length - 1].sender !== currentUser._id;
		if (lastMessageIsFromOtherUser) {
			socket.emit("markMessagesAsSeen", {
				conversationId: selectedConversation._id,
				userId: selectedConversation.userId,
			});
		}

		socket.on("messagesSeen", ({ conversationId }) => {
			if (selectedConversation._id === conversationId) {
				setMessages((prev) => {
					const updatedMessages = prev.map((message) => {
						if (!message.seen) {
							return {
								...message,
								seen: true,
							};
						}
						return message;
					});
					return updatedMessages;
				});
			}
		});
	}, [socket, currentUser._id, messages, selectedConversation]);

	useEffect(() => {
		messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	useEffect(() => {
		const getMessages = async () => {
			setLoadingMessages(true);
			setMessages([]);
			try {
				if (selectedConversation.mock) return;
				const res = await fetch(`/api/messages/${selectedConversation.userId}`);
				const data = await res.json();
				if (data.error) {
					showToast("Error", data.error, "error");
					return;
				}
				setMessages(data);
			} catch (error) {
				showToast("Error", error.message, "error");
			} finally {
				setLoadingMessages(false);
			}
		};

		getMessages();
	}, [showToast, selectedConversation.userId, selectedConversation.mock]);

	return (
		<Flex
			flex='70'
			bg={useColorModeValue("gray.200", "gray.dark")}
			borderRadius={"md"}
			p={2}
			flexDirection={"column"}
		>		{/* Message header */}
		<Flex w={"full"} h={12} alignItems={"center"} gap={2} justifyContent="space-between">
			<Flex alignItems={"center"} gap={2}>
				<Avatar src={selectedConversation.userProfilePic} size={"sm"} /> 
				<Text display={"flex"} alignItems={"center"}>
					{selectedConversation.username} <Image src='/verified.png' w={4} h={4} ml={1} />
				</Text>
			</Flex>
			<Flex gap={2}>
				<IconButton
					icon={<FaPhone />}
					size="sm"
					variant="ghost"
					color="gray.light"
					_hover={{ color: "#10B981", bg: "#161b22" }}
					onClick={handleVoiceCall}
					aria-label="Voice call"
				/>
				<IconButton
					icon={<FaVideo />}
					size="sm"
					variant="ghost"
					color="gray.light"
					_hover={{ color: "#10B981", bg: "#161b22" }}
					onClick={handleVideoCall}
					aria-label="Video call"
				/>
			</Flex>
		</Flex>

			<Divider />

			<Flex flexDir={"column"} gap={4} my={4} p={2} height={"400px"} overflowY={"auto"}>
				{loadingMessages &&
					[...Array(5)].map((_, i) => (
						<Flex
							key={i}
							gap={2}
							alignItems={"center"}
							p={1}
							borderRadius={"md"}
							alignSelf={i % 2 === 0 ? "flex-start" : "flex-end"}
						>
							{i % 2 === 0 && <SkeletonCircle size={7} />}
							<Flex flexDir={"column"} gap={2}>
								<Skeleton h='8px' w='250px' />
								<Skeleton h='8px' w='250px' />
								<Skeleton h='8px' w='250px' />
							</Flex>
							{i % 2 !== 0 && <SkeletonCircle size={7} />}
						</Flex>
					))}

				{!loadingMessages &&
					messages.map((message) => (
						<Flex
							key={message._id}
							direction={"column"}
							ref={messages.length - 1 === messages.indexOf(message) ? messageEndRef : null}
						>
							<Message message={message} ownMessage={currentUser._id === message.sender} />
						</Flex>
					))}
			</Flex>

		<MessageInput setMessages={setMessages} />

		<CallModal 
			isOpen={isCallOpen} 
			onClose={onCallClose} 
			callData={callData}
			isCallActive={isCallActive}
			setIsCallActive={setIsCallActive}
		/>
	</Flex>
);
};

export default MessageContainer;
