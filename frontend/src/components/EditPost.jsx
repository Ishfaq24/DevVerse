import {
	Button,
	Flex,
	FormControl,
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
import { useState } from "react";
import { BsCodeSlash } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import useShowToast from "../hooks/useShowToast";

const MAX_CHAR = 500;

const LANGUAGES = [
	"javascript", "typescript", "python", "java", "c", "cpp", "csharp",
	"go", "rust", "ruby", "php", "swift", "kotlin", "html", "css",
	"sql", "bash", "json", "yaml", "markdown", "jsx", "tsx", "dart",
	"scala", "r", "lua", "perl", "xml",
];

const EditPost = ({ post, onPostUpdated }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [postText, setPostText] = useState(post.text);
	const [remainingChar, setRemainingChar] = useState(MAX_CHAR - post.text.length);
	const [loading, setLoading] = useState(false);
	const showToast = useShowToast();

	const [showCodeInput, setShowCodeInput] = useState(!!post.codeSnippet);
	const [codeSnippet, setCodeSnippet] = useState(post.codeSnippet || "");
	const [codeLanguage, setCodeLanguage] = useState(post.codeLanguage || "javascript");

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

	const handleUpdatePost = async () => {
		setLoading(true);
		try {
			const res = await fetch(`/api/posts/${post._id}`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					text: postText,
					codeSnippet: showCodeInput ? codeSnippet : "",
					codeLanguage: showCodeInput ? codeLanguage : "",
				}),
			});

			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			showToast("Success", "Post updated successfully", "success");
			if (onPostUpdated) {
				onPostUpdated(data);
			}
			onClose();
		} catch (error) {
			showToast("Error", error, "error");
		} finally {
			setLoading(false);
		}
	};

	const openEditModal = () => {
		setPostText(post.text);
		setRemainingChar(MAX_CHAR - post.text.length);
		setShowCodeInput(!!post.codeSnippet);
		setCodeSnippet(post.codeSnippet || "");
		setCodeLanguage(post.codeLanguage || "javascript");
		onOpen();
	};

	return (
		<>
			<Tooltip label="Edit post">
				<IconButton
					icon={<FiEdit />}
					size="sm"
					variant="ghost"
					color="gray.light"
					_hover={{ color: "#10B981", bg: "#161b22" }}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						openEditModal();
					}}
					aria-label="Edit post"
				/>
			</Tooltip>

			<Modal isOpen={isOpen} onClose={onClose} size="lg">
				<ModalOverlay bg="blackAlpha.700" />

				<ModalContent bg={useColorModeValue("white", "#161b22")} border="1px solid" borderColor={useColorModeValue("gray.200", "#30363d")}>
					<ModalHeader color={useColorModeValue("gray.800", "#e6edf3")}>Edit Post</ModalHeader>
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
					</ModalBody>

					<ModalFooter>
						<Button
							bg="#10B981"
							color="white"
							_hover={{ bg: "#059669" }}
							mr={3}
							onClick={handleUpdatePost}
							isLoading={loading}
						>
							Update
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};



export default EditPost;
