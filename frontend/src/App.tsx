import { Box } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Translation from "./components/Translation";
import WordList from "./components/WordList";
import Quiz from "./components/Quiz";
import "./App.css";

function App() {
  return (
    <Box minH="100vh" className="app-container">
      <Navbar />
      <Box as="main" py={8}>
        <Routes>
          <Route path="/" element={<Translation />} />
          <Route path="/words" element={<WordList />} />
          <Route path="/quiz" element={<Quiz />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
