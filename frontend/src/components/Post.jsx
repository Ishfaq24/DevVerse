import {
  Avatar,
  Image,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";

import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue } from "recoil";
import { DeleteIcon } from "@chakra-ui/icons";

import Actions from "./Actions";
import CodeBlock from "./CodeBlock";
import EditPost from "./EditPost";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";

const Post = ({ post, postedBy }) => {
  const [user, setUser] = useState(null);
  const showToast = useShowToast();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch("/api/users/profile/" + postedBy);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Error", error.message, "error");
        setUser(null);
      }
    };

    getUser();
  }, [postedBy, showToast]);

  const handleDeletePost = async (e) => {
    try {
      e.preventDefault();
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${post._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Post deleted", "success");
      setPosts(posts.filter((p) => p._id !== post._id));
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts(posts.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  if (!user) return null;
  return (
    <Link to={`/${user.username}/post/${post._id}`}>
      <Flex
        gap={3}
        mb={4}
        py={5}
        borderBottom="1px solid"
        borderColor="#30363d"
        _hover={{ bg: "rgba(22, 27, 34, 0.5)" }}
        transition="background 0.2s"
        px={2}
        borderRadius="md"
      >
        <Flex flexDirection="column" alignItems="center">
          <Avatar
            size="md"
            name={user.name}
            src={user?.profilePic}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${user.username}`);
            }}
          />
          <Box w="1px" h="full" bg="#30363d" my={2}></Box>
          <Box position="relative" w="full">
            {post.replies.length === 0 && <Text textAlign="center">🥱</Text>}
            {post.replies[0] && (
              <Avatar
                size="xs"
                name="reply"
                src={post.replies[0].userProfilePic}
                position="absolute"
                top="0px"
                left="15px"
                padding="2px"
              />
            )}
            {post.replies[1] && (
              <Avatar
                size="xs"
                name="reply"
                src={post.replies[1].userProfilePic}
                position="absolute"
                bottom="0px"
                right="-5px"
                padding="2px"
              />
            )}
            {post.replies[2] && (
              <Avatar
                size="xs"
                name="reply"
                src={post.replies[2].userProfilePic}
                position="absolute"
                bottom="0px"
                left="4px"
                padding="2px"
              />
            )}
          </Box>
        </Flex>
        <Flex flex={1} flexDirection="column" gap={2}>
          <Flex justifyContent="space-between" w="full">
            <Flex w="full" alignItems="center">
              <Text
                fontSize="sm"
                fontWeight="bold"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/${user.username}`);
                }}
              >
                {user?.username}
              </Text>
              <Image src="/verified.png" w={4} h={4} ml={1} />
            </Flex>
            <Flex gap={2} alignItems="center">
              <Text fontSize="xs" width={36} textAlign="right" color="gray.light">
                {formatDistanceToNow(new Date(post.createdAt))} ago
              </Text>
              {currentUser?._id === user._id && (
                <>
                  <EditPost post={post} onPostUpdated={handlePostUpdated} />
                  <DeleteIcon size={20} onClick={handleDeletePost} cursor="pointer" />
                </>
              )}
            </Flex>
          </Flex>

          <Text fontSize="sm">{post.text}</Text>

          {post.codeSnippet && (
            <CodeBlock code={post.codeSnippet} language={post.codeLanguage} />
          )}

          {post.img && (
            <Box borderRadius={6} overflow="hidden" border="1px solid" borderColor="#30363d">
              <Image src={post.img} w="full" />
            </Box>
          )}

          <Flex gap={3} my={1}>
            <Actions post={post} />
          </Flex>
        </Flex>
      </Flex>
    </Link>
  );
};

export default Post;
