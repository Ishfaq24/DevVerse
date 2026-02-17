import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [loading, setLoading] = useState(true);
	const showToast = useShowToast();

	useEffect(() => {
		const getFeedPosts = async () => {
			setLoading(true);
			setPosts([]);

			try {
				const res = await fetch("/api/posts/feed", {
					credentials: "include",
				});

				if (!res.ok) {
					const errorData = await res.json();
					showToast("Error", errorData.error || "Unauthorized", "error");
					setPosts([]);
					return;
				}

				const data = await res.json();

				if (Array.isArray(data)) {
					setPosts(data);
				} else if (Array.isArray(data.posts)) {
					setPosts(data.posts);
				} else {
					setPosts([]);
				}
			} catch (error) {
				showToast("Error", error.message, "error");
				setPosts([]);
			} finally {
				setLoading(false);
			}
		};

		getFeedPosts();
	}, [showToast, setPosts]);

	return (
		<>
			{/* Mobile: horizontal suggested users */}
			<Box display={{ base: "block", md: "none" }} mb={6}>
				<SuggestedUsers horizontal />
			</Box>

			<Flex gap="10" alignItems="flex-start">
				<Box flex={70}>
					{loading && (
						<Flex justify="center">
							<Spinner size="xl" color="brand.500" />
						</Flex>
					)}

					{!loading && Array.isArray(posts) && posts.length === 0 && (
						<Text color="gray.light" textAlign="center" mt={10}>
							Follow some users to see the feed
						</Text>
					)}

					{!loading &&
						Array.isArray(posts) &&
						posts.map((post) => (
							<Post key={post._id} post={post} postedBy={post.postedBy} />
						))}
				</Box>

				{/* Desktop: sidebar suggested users */}
				<Box flex={30} display={{ base: "none", md: "block" }}>
					<SuggestedUsers />
				</Box>
			</Flex>
		</>
	);
};

export default HomePage;
