import {
	Flex,
	Box,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	Stack,
	Button,
	Heading,
	Text,
	useColorModeValue,
	Link,
	Divider,
	AbsoluteCenter,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useSetRecoilState } from "recoil";
import authScreenAtom from "../atoms/authAtom";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";

export default function LoginCard() {
	const [showPassword, setShowPassword] = useState(false);
	const setAuthScreen = useSetRecoilState(authScreenAtom);
	const setUser = useSetRecoilState(userAtom);
	const [loading, setLoading] = useState(false);

	const [inputs, setInputs] = useState({
		username: "",
		password: "",
	});
	const showToast = useShowToast();
	const handleLogin = async () => {
		setLoading(true);
		try {
			const res = await fetch("/api/users/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(inputs),
			});
			const data = await res.json();
			if (data.error) {
				showToast("Error", data.error, "error");
				return;
			}
			localStorage.setItem("user-devverse", JSON.stringify(data));
			setUser(data);
		} catch (error) {
			showToast("Error", error, "error");
		} finally {
			setLoading(false);
		}
	};
	return (
		<Flex align={"center"} justify={"center"}>
			<Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
				<Stack align={"center"}>
					<Heading fontSize={"4xl"} textAlign={"center"}>
						Login
					</Heading>
				</Stack>
				<Box
					rounded={"lg"}
					bg={useColorModeValue("white", "gray.dark")}
					boxShadow={"lg"}
					p={8}
					w={{
						base: "full",
						sm: "400px",
					}}
				>
					<Stack spacing={4}>
						<FormControl isRequired>
							<FormLabel>Username</FormLabel>
							<Input
								type='text'
								value={inputs.username}
								onChange={(e) => setInputs((inputs) => ({ ...inputs, username: e.target.value }))}
							/>
						</FormControl>
						<FormControl isRequired>
							<FormLabel>Password</FormLabel>
							<InputGroup>
								<Input
									type={showPassword ? "text" : "password"}
									value={inputs.password}
									onChange={(e) => setInputs((inputs) => ({ ...inputs, password: e.target.value }))}
								/>
								<InputRightElement h={"full"}>
									<Button
										variant={"ghost"}
										onClick={() => setShowPassword((showPassword) => !showPassword)}
									>
										{showPassword ? <ViewIcon /> : <ViewOffIcon />}
									</Button>
								</InputRightElement>
							</InputGroup>
						</FormControl>
						<Stack spacing={10} pt={2}>
							<Button
								loadingText="Logging in"
								size="lg"
								bg="#10B981"
								color="white"
								_hover={{ bg: "#059669" }}
								onClick={handleLogin}
								isLoading={loading}
							>
								Login
							</Button>
						</Stack>

						<Box position="relative" py={4}>
							<Divider borderColor={useColorModeValue("gray.300", "#30363d")} />
							<AbsoluteCenter bg={useColorModeValue("white", "gray.dark")} px={4}>
								<Text fontSize="sm" color="gray.light">or continue with</Text>
							</AbsoluteCenter>
						</Box>

						<Stack direction="row" spacing={4}>
							<Button
								w="full"
								variant="outline"
								borderColor={useColorModeValue("gray.300", "#30363d")}
								_hover={{ bg: useColorModeValue("gray.50", "#161b22"), borderColor: "#10B981" }}
								leftIcon={<FaGoogle />}
								onClick={() => { window.location.href = "/api/users/auth/google"; }}
							>
								Google
							</Button>
							<Button
								w="full"
								variant="outline"
								borderColor={useColorModeValue("gray.300", "#30363d")}
								_hover={{ bg: useColorModeValue("gray.50", "#161b22"), borderColor: "#10B981" }}
								leftIcon={<FaGithub />}
								onClick={() => { window.location.href = "/api/users/auth/github"; }}
							>
								GitHub
							</Button>
						</Stack>

						<Stack pt={4}>
							<Text align="center">
								Don&apos;t have an account?{" "}
								<Link color="#10B981" onClick={() => setAuthScreen("signup")}>
									Sign up
								</Link>
							</Text>
						</Stack>
					</Stack>
				</Box>
			</Stack>
		</Flex>
	);
}
