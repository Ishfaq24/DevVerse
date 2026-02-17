import { Box, Flex, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import SuggestedUser from "./SuggestedUser";
import useShowToast from "../hooks/useShowToast";

const SuggestedUsers = ({ horizontal = false }) => {
	const [loading, setLoading] = useState(true);
	const [suggestedUsers, setSuggestedUsers] = useState([]);
	const showToast = useShowToast();

	useEffect(() => {
		const getSuggestedUsers = async () => {
			setLoading(true);
			try {
				const res = await fetch("/api/users/suggested", {
					credentials: "include",
				});

				if (!res.ok) {
					const errorData = await res.json();
					showToast("Error", errorData.error || "Unauthorized", "error");
					setSuggestedUsers([]);
					return;
				}

				const data = await res.json();
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

	if (horizontal) {
		return (
			<Box>
				<Text mb={3} fontWeight="bold" fontSize="sm" color="gray.light">
					Suggested Developers
				</Text>
				<Flex
					gap={3}
					overflowX="auto"
					pb={2}
					className="suggested-scroll"
					css={{ "&::-webkit-scrollbar": { height: "4px" } }}
				>
					{loading &&
						[0, 1, 2, 3].map((_, idx) => (
							<Box key={idx} minW="140px" p={3} borderRadius="lg" bg="gray.dark" border="1px solid" borderColor="#30363d">
								<Flex direction="column" align="center" gap={2}>
									<SkeletonCircle size="10" />
									<Skeleton h="8px" w="60px" />
									<Skeleton h="24px" w="70px" />
								</Flex>
							</Box>
						))}
					{!loading &&
						Array.isArray(suggestedUsers) &&
						suggestedUsers.map((user) => (
							<SuggestedUser key={user._id} user={user} compact />
						))}
				</Flex>
			</Box>
		);
	}

	return (
		<>
			<Text mb={4} fontWeight="bold" color="gray.light" fontSize="sm">
				Suggested Developers
			</Text>

			<Flex direction="column" gap={4}>
				{!loading &&
					Array.isArray(suggestedUsers) &&
					suggestedUsers.map((user) => (
						<SuggestedUser key={user._id} user={user} />
					))}

				{loading &&
					[0, 1, 2, 3, 4].map((_, idx) => (
						<Flex key={idx} gap={2} alignItems="center" p={"1"} borderRadius="md">
							<Box>
								<SkeletonCircle size="10" />
							</Box>
							<Flex w="full" flexDirection="column" gap={2}>
								<Skeleton h="8px" w="80px" />
								<Skeleton h="8px" w="90px" />
							</Flex>
							<Flex>
								<Skeleton h="20px" w="60px" />
							</Flex>
						</Flex>
					))}
			</Flex>
		</>
	);
};

export default SuggestedUsers;
