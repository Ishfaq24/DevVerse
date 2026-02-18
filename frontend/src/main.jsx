import "./utils/polyfills";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import {
	ChakraProvider,
	extendTheme,
	ColorModeScript,
} from "@chakra-ui/react";

import { mode } from "@chakra-ui/theme-tools";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { SocketContextProvider } from "./context/SocketContext.jsx";

const styles = {
	global: (props) => ({
		body: {
			color: mode("gray.800", "#e6edf3")(props),
			bg: mode("#f6f8fa", "#0d1117")(props),
			fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
		},
	}),
};

const config = {
	initialColorMode: "dark",
	useSystemColorMode: false,
};

const colors = {
	gray: {
		light: "#8b949e",
		dark: "#161b22",
	},
	brand: {
		50: "#ecfdf5",
		100: "#d1fae5",
		200: "#a7f3d0",
		300: "#6ee7b7",
		400: "#34d399",
		500: "#10B981",
		600: "#059669",
		700: "#047857",
		800: "#065f46",
		900: "#064e3b",
	},
};

const components = {
	Button: {
		variants: {
			solid: (props) => ({
				...(props.colorScheme === "green" && {
					bg: mode("brand.500", "brand.500")(props),
					color: "white",
					_hover: { bg: mode("brand.600", "brand.400")(props) },
				}),
			}),
		},
	},
	Modal: {
		baseStyle: (props) => ({
			dialog: {
				bg: mode("white", "#161b22")(props),
				borderColor: mode("gray.200", "#30363d")(props),
				border: "1px solid",
			},
		}),
	},
};

const fonts = {
	mono: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', monospace",
};

const theme = extendTheme({ config, styles, colors, components, fonts });

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<RecoilRoot>
			<BrowserRouter>
				<ChakraProvider theme={theme}>
					<ColorModeScript initialColorMode={theme.config.initialColorMode} />
					<SocketContextProvider>
						<App />
					</SocketContextProvider>
				</ChakraProvider>
			</BrowserRouter>
		</RecoilRoot>
	</React.StrictMode>
);
