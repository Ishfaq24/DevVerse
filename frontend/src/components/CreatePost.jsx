import { AddIcon } from "@chakra-ui/icons";
import {
	Button,
	CloseButton,
	Flex,
	FormControl,
	Image,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	Text,
	Textarea,
	useColorModeValue,
	useDisclosure,
	Box,
	IconButton,
	Tooltip,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill, BsCodeSlash } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";

const MAX_CHAR = 500;

const LANGUAGES = [
	"javascript", "typescript", "python", "java", "c", "cpp", "csharp",
	"go", "rust", "ruby", "php", "swift", "kotlin", "html", "css",
	"sql", "bash", "json", "yaml", "markdown", "jsx", "tsx", "dart",
	"scala", "r", "lua", "perl", "xml",
];

const CreatePost = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [postText, setPostText] = useState("");
	const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();
	const imageRef = useRef(null);
	const [remainingChar, setRemainingChar] = useState(MAX_CHAR);
	const user = useRecoilValue(userAtom);
	const showToast = useShowToast();
	const [loading, setLoading] = useState(false);
	const [posts, setPosts] = useRecoilState(postsAtom);
	const { username } = useParams();

	const [showCodeInput, setShowCodeInput] = useState(false);
	const [codeSnippet, setCodeSnippet] = useState("");
	const [codeLanguage, setCodeLanguage] = useState("javascript");

	const handleTextChange = (e) => {
		const inputText = e.target.value;
		if (inputText.length > MAX_CHAR) {
			const truncatedText = inputText.slice(0, MAX_CHAR);
			setPostText(truncatedText);
			setRemainingChar(0);
		} else {
			setPostText(inputText);
			setRemainingChar(MAX_CHAR - inputText.length);
		}
	};

	const handleCreatePost = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/posts/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					postedBy: user._id,
					text: postText,
					img: imgUrl,
					codeSnippet: showCodeInput ? codeSnippet : "",
					codeLanguage: showCodeInput ? codeLanguage : "",
				}),
			});

			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Post created successfully", "success");
			if (!username || username === user.username) {
				setPosts([data, ...posts]);
			}
			onClose();
			setPostText("");
			setImgUrl("");
			setCodeSnippet("");
			setCodeLanguage("javascript");
			setShowCodeInput(false);
		} catch (error) {
			showToast("Error", error, "error");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<Button
				position="fixed"
				bottom={10}
				right={5}
				bg={useColorModeValue("brand.500", "#10B981")}
				color="white"
				onClick={onOpen}
				size={{ base: "sm", sm: "md" }}
				_hover={{ bg: useColorModeValue("brand.600", "#059669"), transform: "scale(1.05)" }}
				transition="all 0.2s"
				boxShadow="0 0 20px rgba(16, 185, 129, 0.3)"
				borderRadius="full"
			>
				<AddIcon />
			</Button>

			<Modal isOpen={isOpen} onClose={onClose} size="lg">
				<ModalOverlay bg="blackAlpha.700" />

				<ModalContent bg={useColorModeValue("white", "#161b22")} border="1px solid" borderColor={useColorModeValue("gray.200", "#30363d")}>
					<ModalHeader color={useColorModeValue("gray.800", "#e6edf3")}>Create Post</ModalHeader>
					<ModalCloseButton />
					<ModalBody pb={6}>
						<FormControl>
							<Textarea
								placeholder="What's on your mind, developer?"
								onChange={handleTextChange}
								value={postText}
								borderColor={useColorModeValue("gray.300", "#30363d")}
								_focus={{ borderColor: "#10B981", boxShadow: "0 0 0 1px #10B981" }}
								_placeholder={{ color: "gray.light" }}
							/>
							<Text
								fontSize="xs"
								fontWeight="bold"
								textAlign="right"
								m={1}
								color={remainingChar < 50 ? "orange.400" : "gray.light"}
							>
								{remainingChar}/{MAX_CHAR}
							</Text>

							<Flex gap={2} mt={1}>
								<Input type="file" hidden ref={imageRef} onChange={handleImageChange} />
								<Tooltip label="Add image">
									<IconButton
										icon={<BsFillImageFill />}
										size="sm"
										variant="ghost"
										color="gray.light"
										_hover={{ color: "#10B981", bg: "#161b22" }}
										onClick={() => imageRef.current.click()}
										aria-label="Add image"
									/>
								</Tooltip>
								<Tooltip label={showCodeInput ? "Remove code" : "Add code snippet"}>
									<IconButton
										icon={<BsCodeSlash />}
										size="sm"
										variant={showCodeInput ? "solid" : "ghost"}
										color={showCodeInput ? "white" : "gray.light"}
										bg={showCodeInput ? "#10B981" : "transparent"}
										_hover={{ color: "white", bg: showCodeInput ? "#059669" : "#161b22" }}
										onClick={() => setShowCodeInput(!showCodeInput)}
										aria-label="Add code snippet"
									/>
								</Tooltip>
							</Flex>
						</FormControl>

						{showCodeInput && (
							<Box mt={4} p={4} borderRadius="lg" bg={useColorModeValue("gray.50", "#0d1117")} border="1px solid" borderColor={useColorModeValue("gray.200", "#30363d")}>
								<Flex justify="space-between" align="center" mb={3}>
									<Text fontSize="sm" fontWeight="bold" color={useColorModeValue("gray.700", "#e6edf3")}>
										💻 Code Snippet
									</Text>
									<Select
										size="sm"
										w="160px"
										value={codeLanguage}
										onChange={(e) => setCodeLanguage(e.target.value)}
										borderColor={useColorModeValue("gray.300", "#30363d")}
										_focus={{ borderColor: "#10B981" }}
										fontFamily="mono"
										fontSize="xs"
									>
										{LANGUAGES.map((lang) => (
											<option key={lang} value={lang}>
												{lang}
											</option>
										))}
									</Select>
								</Flex>
								<Textarea
									placeholder="Paste your code here..."
									value={codeSnippet}
									onChange={(e) => setCodeSnippet(e.target.value)}
									fontFamily="mono"
									fontSize="sm"
									minH="150px"
									bg={useColorModeValue("white", "#0d1117")}
									borderColor={useColorModeValue("gray.300", "#30363d")}
									_focus={{ borderColor: "#10B981", boxShadow: "0 0 0 1px #10B981" }}
									_placeholder={{ color: "#484f58" }}
									color={useColorModeValue("gray.800", "#e6edf3")}
								/>
							</Box>
						)}

						{imgUrl && (
							<Flex mt={5} w="full" position="relative">
								<Image src={imgUrl} alt="Selected img" borderRadius="md" />
								<CloseButton
									onClick={() => setImgUrl("")}
									bg="gray.800"
									position="absolute"
									top={2}
									right={2}
								/>
							</Flex>
						)}
					</ModalBody>

					<ModalFooter>
						<Button
							bg="#10B981"
							color="white"
							_hover={{ bg: "#059669" }}
							mr={3}
							onClick={handleCreatePost}
							isLoading={loading}
						>
							Post
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default CreatePost;
