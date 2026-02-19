import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Container, Heading, Text, Button, Spinner, VStack, useToast } from "@chakra-ui/react";

const VerifyPage = () => {
	const { token } = useParams();
	const navigate = useNavigate();
	const toast = useToast();
	const [status, setStatus] = useState("verifying");
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		const verifyEmail = async () => {
			try {
				const res = await fetch(`/api/users/verify/${token}`);
				const data = await res.json();

				if (res.ok) {
					setStatus("success");
					toast({
						title: "Email verified!",
						description: "You can now log in to your account.",
						status: "success",
						duration: 5000,
						isClosable: true,
					});
				} else {
					setStatus("error");
					setErrorMessage(data.error || "Verification failed");
				}
			} catch (error) {
				setStatus("error");
				setErrorMessage("An unexpected error occurred");
			}
		};

		if (token) {
			verifyEmail();
		}
	}, [token, toast]);

	return (
		<Container maxW={"620px"} mt={10}>
			<VStack spacing={6}>
				{status === "verifying" && (
					<>
						<Spinner size="xl" />
						<Heading>Verifying your email...</Heading>
						<Text>Please wait while we verify your email address.</Text>
					</>
				)}

				{status === "success" && (
					<>
						<Heading color="green.500">Email Verified!</Heading>
						<Text textAlign="center">
							Your email has been successfully verified. You can now log in to your account.
						</Text>
						<Button colorScheme="blue" onClick={() => navigate("/auth")}>
							Go to Login
						</Button>
					</>
				)}

				{status === "error" && (
					<>
						<Heading color="red.500">Verification Failed</Heading>
						<Text textAlign="center">
							{errorMessage || "The verification link is invalid or has expired. Please try signing up again or contact support."}
						</Text>
						<Button colorScheme="blue" onClick={() => navigate("/auth")}>
							Go to Signup
						</Button>
					</>
				)}
			</VStack>
		</Container>
	);
};

export default VerifyPage;
