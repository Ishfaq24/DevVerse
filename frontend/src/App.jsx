import { Box, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "./atoms/userAtom";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import ChatPage from "./pages/ChatPage";
import { SettingsPage } from "./pages/SettingsPage";
import VerifyPage from "./pages/VerifyPage";
function App() {
	const user = useRecoilValue(userAtom);
	const setUser = useSetRecoilState(userAtom);
	const { pathname } = useLocation();
	const [searchParams, setSearchParams] = useSearchParams();

	useEffect(() => {
		const isOAuth = searchParams.get("oauth");
		if (isOAuth) {
			const fetchUser = async () => {
				try {
					const res = await fetch("/api/users/me", { credentials: "include" });
					const data = await res.json();
					if (!data.error) {
						localStorage.setItem("user-devverse", JSON.stringify(data));
						setUser(data);
					}
				} catch (err) {
					console.error("OAuth fetch error:", err);
				}
			};
			fetchUser();
			setSearchParams({});
		}
	}, [searchParams, setSearchParams, setUser]);
	return (
		<Box position={"relative"} w='full'>
			<Container maxW={pathname === "/" ? { base: "620px", md: "900px" } : "620px"}>
				<Header />
				<Routes>
					<Route path='/' element={user ? <><HomePage /><CreatePost /></> : <Navigate to='/auth' />} />
					<Route path='/auth' element={!user ? <AuthPage /> : <Navigate to='/' />} />
					<Route path='/update' element={user ? <UpdateProfilePage /> : <Navigate to='/auth' />} />

					<Route
						path='/:username'
						element={
							user ? (
								<>
									<UserPage />
									<CreatePost />
								</>
							) : (
								<UserPage />
							)
						}
					/>
					<Route path='/:username/post/:pid' element={<PostPage />} />
					<Route path='/chat' element={user ? <ChatPage /> : <Navigate to={"/auth"} />} />
					<Route path='/settings' element={user ? <SettingsPage /> : <Navigate to={"/auth"} />} />
					<Route path='/verify/:token' element={<VerifyPage />} />
				</Routes>
			</Container>
		</Box>
	);
}

export default App;
