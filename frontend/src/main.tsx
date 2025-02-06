import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: "#1a202c",
        color: "#e2e8f0",
      },
    },
  },
  colors: {
    gray: {
      700: "#2d3748",
      800: "#1a202c",
    },
    blue: {
      200: "#63b3ed",
      500: "#4299e1",
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "blue",
      },
      variants: {
        solid: {
          bg: "blue.500",
          color: "white",
          _hover: {
            bg: "blue.600",
          },
        },
        outline: {
          borderColor: "blue.500",
          color: "blue.200",
          _hover: {
            bg: "whiteAlpha.100",
          },
        },
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: "blue.500",
      },
    },
    Textarea: {
      defaultProps: {
        focusBorderColor: "blue.500",
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
