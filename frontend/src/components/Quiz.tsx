import { useState } from "react";
import {
  Box,
  Button,
  Text,
  Container,
  Select,
  Progress,
  Badge,
  Alert,
  AlertIcon,
  VStack,
} from "@chakra-ui/react";
import { getAllWords } from "../services/api";
import type { TranslationResponse } from "../services/api";
import "../App.css";

const Quiz = () => {
  const [loading, setLoading] = useState(false);
  const [words, setWords] = useState<TranslationResponse[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [questionType, setQuestionType] = useState<"jp-id" | "id-jp">("jp-id");
  const [wordLimit, setWordLimit] = useState("10");

  const startQuiz = async () => {
    setLoading(true);
    try {
      const fetchedWords = await getAllWords();
      let selectedWords = [...fetchedWords];

      // Jika bukan unlimited, batasi jumlah kata
      if (wordLimit !== "unlimited") {
        selectedWords = selectedWords.slice(0, parseInt(wordLimit));
      }

      // Shuffle words
      for (let i = selectedWords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [selectedWords[i], selectedWords[j]] = [
          selectedWords[j],
          selectedWords[i],
        ];
      }

      setWords(selectedWords);
      setCurrentWordIndex(0);
      setShowAnswer(false);
    } catch (error) {
      console.error("Error fetching words:", error);
      alert("Failed to fetch words for quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowAnswer(false);
    }
  };

  const progress = words.length
    ? ((currentWordIndex + 1) / words.length) * 100
    : 0;

  return (
    <Container maxW="container.lg" py={6}>
      <Box p={6} className="card" borderRadius="lg" mb={6}>
        <VStack spacing={4} align="stretch">
          <Box>
            <Text mb={2} fontWeight="medium">
              Question Type
            </Text>
            <Select
              value={questionType}
              onChange={(e) =>
                setQuestionType(e.target.value as "jp-id" | "id-jp")
              }
              className="select"
            >
              <option value="jp-id">Japanese → Indonesian</option>
              <option value="id-jp">Indonesian → Japanese</option>
            </Select>
          </Box>

          <Box>
            <Text mb={2} fontWeight="medium">
              Number of Words
            </Text>
            <Select
              value={wordLimit}
              onChange={(e) => setWordLimit(e.target.value)}
              className="select"
            >
              <option value="10">10 words</option>
              <option value="20">20 words</option>
              <option value="50">50 words</option>
              <option value="100">100 words</option>
              <option value="unlimited">Unlimited</option>
            </Select>
          </Box>

          <Button
            colorScheme="blue"
            onClick={startQuiz}
            w="full"
            size="lg"
            isLoading={loading}
          >
            Start Quiz
          </Button>
        </VStack>
      </Box>

      {words.length > 0 && (
        <Box>
          <Box p={6} className="card" borderRadius="lg" mb={4}>
            <Box mb={4}>
              <Text fontSize="sm" mb={2}>
                Progress: {currentWordIndex + 1} / {words.length}
              </Text>
              <Progress value={progress} size="sm" colorScheme="blue" />
            </Box>

            <Box textAlign="center" py={8}>
              {questionType === "jp-id" ? (
                <VStack spacing={4}>
                  <Text fontSize="3xl" fontWeight="bold">
                    {words[currentWordIndex].kanji ||
                      words[currentWordIndex].japanese}
                  </Text>
                  <Badge colorScheme="blue">
                    {words[currentWordIndex].reading}
                  </Badge>
                  {showAnswer && (
                    <Text fontSize="xl" color="green.400">
                      {words[currentWordIndex].indonesian}
                    </Text>
                  )}
                </VStack>
              ) : (
                <VStack spacing={4}>
                  <Text fontSize="2xl">
                    {words[currentWordIndex].indonesian}
                  </Text>
                  {showAnswer && (
                    <>
                      <Text fontSize="3xl" fontWeight="bold">
                        {words[currentWordIndex].kanji ||
                          words[currentWordIndex].japanese}
                      </Text>
                      <Badge colorScheme="blue">
                        {words[currentWordIndex].reading}
                      </Badge>
                    </>
                  )}
                </VStack>
              )}
            </Box>

            <Box display="flex" gap={4} justifyContent="center">
              {!showAnswer ? (
                <Button
                  colorScheme="green"
                  onClick={() => setShowAnswer(true)}
                  size="lg"
                  px={8}
                >
                  Show Answer
                </Button>
              ) : (
                <Button
                  colorScheme="blue"
                  onClick={handleNext}
                  size="lg"
                  px={8}
                  disabled={currentWordIndex === words.length - 1}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>

          {currentWordIndex === words.length - 1 && showAnswer && (
            <Alert status="success">
              <AlertIcon />
              Quiz completed! Click Start Quiz to try again.
            </Alert>
          )}
        </Box>
      )}
    </Container>
  );
};

export default Quiz;
