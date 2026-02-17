import { Avatar, Box, Button, Flex, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useFollowUnfollow from "../hooks/useFollowUnfollow";

const SuggestedUser = ({ user, compact = false }) => {
	const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);

	if (compact) {
		return (
			<Box
				minW="130px"
				p={3}
				borderRadius="lg"
				bg="gray.dark"
				border="1px solid"
				borderColor="#30363d"
				transition="all 0.2s"
				_hover={{ borderColor: "#10B981", transform: "translateY(-1px)" }}
			>
				<Flex direction="column" align="center" gap={2}>
					<Link to={`/${user.username}`}>
						<Avatar size="md" src={user.profilePic} name={user.username} />
					</Link>
					<Box textAlign="center">
						<Text fontSize="xs" fontWeight="bold" noOfLines={1}>
							{user.username}
						</Text>
						<Text color="gray.light" fontSize="xs" noOfLines={1}>
							{user.name}
						</Text>
					</Box>
					<Button
						size="xs"
						w="full"
						color={following ? "#e6edf3" : "white"}
						bg={following ? "transparent" : "#10B981"}
						border={following ? "1px solid" : "none"}
						borderColor="#30363d"
						onClick={handleFollowUnfollow}
						isLoading={updating}
						_hover={{ opacity: 0.8 }}
					>
						{following ? "Unfollow" : "Follow"}
					</Button>
				</Flex>
			</Box>
		);
	}

	return (
		<Flex gap={2} justifyContent="space-between" alignItems="center">
			<Flex gap={2} as={Link} to={`${user.username}`}>
				<Avatar src={user.profilePic} />
				<Box>
					<Text fontSize="sm" fontWeight="bold">
						{user.username}
					</Text>
					<Text color="gray.light" fontSize="sm">
						{user.name}
					</Text>
				</Box>
			</Flex>
			<Button
				size="sm"
				color={following ? "#e6edf3" : "white"}
				bg={following ? "transparent" : "#10B981"}
				border={following ? "1px solid" : "none"}
				borderColor="#30363d"
				onClick={handleFollowUnfollow}
				isLoading={updating}
				_hover={{ opacity: 0.8 }}
			>
				{following ? "Unfollow" : "Follow"}
			</Button>
		</Flex>
	);
};

export default SuggestedUser;
