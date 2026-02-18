import { Box, Button, Flex, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FiCopy, FiCheck } from "react-icons/fi";

const CodeBlock = ({ code, language }) => {
	const [copied, setCopied] = useState(false);
	const toast = useToast();

	const handleCopy = async (e) => {
		e.preventDefault();
		e.stopPropagation();
		try {
			await navigator.clipboard.writeText(code);
			setCopied(true);
			toast({ title: "Copied to clipboard", status: "success", duration: 1500, isClosable: true });
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toast({ title: "Failed to copy", status: "error", duration: 1500 });
		}
	};

	return (
		<Box
			borderRadius="lg"
			overflow="hidden"
			my={2}
			border="1px solid"
			borderColor="#30363d"
			onClick={(e) => e.preventDefault()}
			maxW="100%"
			overflowX="auto"
		>
			<Flex
				justify="space-between"
				align="center"
				bg="#161b22"
				px={{ base: 2, md: 4 }}
				py={2}
				borderBottom="1px solid"
				borderColor="#30363d"
				flexWrap="wrap"
				gap={2}
			>
				<Text fontSize="xs" color="#8b949e" fontFamily="mono" fontWeight="600" textTransform="uppercase">
					{language || "code"}
				</Text>
				<Button
					size="xs"
					variant="ghost"
					color={copied ? "#10B981" : "#8b949e"}
					onClick={handleCopy}
					leftIcon={copied ? <FiCheck /> : <FiCopy />}
					_hover={{ color: "#e6edf3", bg: "#30363d" }}
					transition="all 0.2s"
				>
					{copied ? "Copied!" : "Copy"}
				</Button>
			</Flex>
			<Box 
				maxH="400px" 
				overflowY="auto"
				overflowX="auto"
				css={{
					'&::-webkit-scrollbar': { height: '6px', width: '6px' },
					'&::-webkit-scrollbar-track': { background: '#0d1117' },
					'&::-webkit-scrollbar-thumb': { background: '#30363d', borderRadius: '3px' },
				}}
			>
				<SyntaxHighlighter
					language={language || "text"}
					style={vscDarkPlus}
					customStyle={{
						margin: 0,
						borderRadius: 0,
						fontSize: "13px",
						background: "#0d1117",
						padding: "16px",
						minWidth: 'fit-content',
					}}
					showLineNumbers
					lineNumberStyle={{ color: "#484f58", fontSize: "12px", minWidth: '2.5em' }}
				>
					{code}
				</SyntaxHighlighter>
			</Box>
		</Box>
	);
};

export default CodeBlock;
