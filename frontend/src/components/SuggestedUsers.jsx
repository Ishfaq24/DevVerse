import { Box, Flex, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SuggestedUser from "./SuggestedUser";
import useShowToast from "../hooks/useShowToast";

const SuggestedUsers = () => {
	const [loading, setLoading] = useState(true);
	const [suggestedUsers, setSuggestedUsers] = useState([]);
	const showToast = useShowToast();

	useEffect(() => {
		const getSuggestedUsers = async () => {
			setLoading(true);
			try {
				const res = await fetch("/api/users/suggested", {
					credentials: "include", // 🔥 IMPORTANT
				});

				// Handle 401 or any backend error properly
				if (!res.ok) {
					const errorData = await res.json();
					showToast(
						"Error",
						errorData.error || "Unauthorized",
						"error"
					);
					setSuggestedUsers([]); // Prevent crash
					return;
				}

				const data = await res.json();
				console.log("Suggested users response:", data);

				// Only set if it's an array
				if (Array.isArray(data)) {
					setSuggestedUsers(data);
				} else {
					setSuggestedUsers([]);
				}
			} catch (error) {
				showToast("Error", error.message, "error");
				setSuggestedUsers([]);
			} finally {
				setLoading(false);
			}
		};

		getSuggestedUsers();
	}, [showToast]);

	return (
		<>
			<Text mb={4} fontWeight={"bold"}>
				Suggested Users
			</Text>

			<Flex direction={"column"} gap={4}>
				{/* Render Users Safely */}
				{!loading &&
					Array.isArray(suggestedUsers) &&
					suggestedUsers.map((user) => (
						<SuggestedUser key={user._id} user={user} />
					))}

				{/* Skeleton Loading */}
				{loading &&
					[0, 1, 2, 3, 4].map((_, idx) => (
						<Flex
							key={idx}
							gap={2}
							alignItems={"center"}
							p={"1"}
							borderRadius={"md"}
						>
							<Box>
								<SkeletonCircle size={"10"} />
							</Box>
							<Flex
								w={"full"}
								flexDirection={"column"}
								gap={2}
							>
								<Skeleton h={"8px"} w={"80px"} />
								<Skeleton h={"8px"} w={"90px"} />
							</Flex>
							<Flex>
								<Skeleton h={"20px"} w={"60px"} />
							</Flex>
						</Flex>
					))}
			</Flex>
		</>
	);
};

export default SuggestedUsers;
