import { Box, Flex, Spinner } from "@chakra-ui/react";
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
					credentials: "include", // 🔥 IMPORTANT
				});

				// If not authorized or any error
				if (!res.ok) {
					const errorData = await res.json();
					showToast(
						"Error",
						errorData.error || "Unauthorized",
						"error"
					);
					setPosts([]);
					return;
				}

				const data = await res.json();
				console.log("Feed response:", data);

				// If backend returns array directly
				if (Array.isArray(data)) {
					setPosts(data);
				}
				// If backend returns { posts: [...] }
				else if (Array.isArray(data.posts)) {
					setPosts(data.posts);
				}
				// Fallback safety
				else {
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
		<Flex gap="10" alignItems="flex-start">
			<Box flex={70}>
				{/* Loading */}
				{loading && (
					<Flex justify="center">
						<Spinner size="xl" />
					</Flex>
				)}

				{/* Empty state */}
				{!loading && Array.isArray(posts) && posts.length === 0 && (
					<h1>Follow some users to see the feed</h1>
				)}

				{/* Posts */}
				{!loading &&
					Array.isArray(posts) &&
					posts.map((post) => (
						<Post
							key={post._id}
							post={post}
							postedBy={post.postedBy}
						/>
					))}
			</Box>

			<Box
				flex={30}
				display={{
					base: "none",
					md: "block",
				}}
			>
				<SuggestedUsers />
			</Box>
		</Flex>
	);
};

export default HomePage;
