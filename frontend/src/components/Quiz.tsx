import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Text,
  Container,
  Select,
  Radio,
  RadioGroup,
  Stack,
  Progress,
  useToast,
  Heading,
  Card,
  CardBody,
  IconButton,
  Flex,
  Badge,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { getWords } from "../services/api";
import type { TranslationResponse } from "../services/api";
import "../App.css";

type WordListItem = Required<Pick<TranslationResponse, "_id">> &
  TranslationResponse;

const Quiz = () => {
  const [words, setWords] = useState<WordListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [wordLimit, setWordLimit] = useState(10);
  const [mode, setMode] = useState<"flashcard" | "quiz">("flashcard");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const toast = useToast();

  // Randomly shuffle words for quiz
  const shuffledWords = useMemo(() => {
    return [...words].sort(() => Math.random() - 0.5).slice(0, wordLimit);
  }, [words, wordLimit]);

  const currentWord = shuffledWords[currentIndex];
  const progress = ((currentIndex + 1) / shuffledWords.length) * 100;

  const fetchWords = async () => {
    try {
      const response = await getWords(1, 1000); // Get all words for quiz pool
      setWords(response.words as WordListItem[]);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching words:", error);
      toast({
        title: "Error",
        description: "Failed to fetch words",
        status: "error",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  useEffect(() => {
    // Reset state when mode changes
    setCurrentIndex(0);
    setShowAnswer(false);
    setQuizScore(0);
    setSelectedAnswer("");
  }, [mode]);

  const handleNext = () => {
    if (currentIndex < shuffledWords.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setShowAnswer(false);
      setSelectedAnswer("");
    } else if (mode === "quiz") {
      // Show final score for quiz mode
      toast({
        title: "Quiz Complete!",
        description: `Your score: ${quizScore}/${
          shuffledWords.length
        } (${Math.round((quizScore / shuffledWords.length) * 100)}%)`,
        status: "info",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setShowAnswer(false);
      setSelectedAnswer("");
    }
  };

  const generateQuizOptions = (correctWord: WordListItem) => {
    const options = [correctWord];
    const otherWords = words.filter((w) => w._id !== correctWord._id);

    // Add 3 random wrong answers
    while (options.length < 4 && otherWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * otherWords.length);
      options.push(otherWords[randomIndex]);
      otherWords.splice(randomIndex, 1);
    }

    return options.sort(() => Math.random() - 0.5);
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    if (answer === currentWord.reading) {
      setQuizScore((prev) => prev + 1);
      toast({
        title: "Correct! 🎉",
        status: "success",
        duration: 1000,
      });
    } else {
      toast({
        title: "Incorrect ❌",
        description: `Correct answer: ${currentWord.reading}`,
        status: "error",
        duration: 2000,
      });
    }
    setTimeout(handleNext, 1500);
  };

  if (loading) {
    return (
      <Container maxW="container.lg" py={6}>
        <Box className="card" p={6} borderRadius="lg" textAlign="center">
          <Text>Loading quiz...</Text>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={6}>
      <Box>
        <Box p={6} className="card" borderRadius="lg" mb={6}>
          <Stack spacing={4}>
            <Flex gap={4} mb={4}>
              <Select
                value={wordLimit}
                onChange={(e) => setWordLimit(Number(e.target.value))}
                className="select"
              >
                <option value={10}>10 Words</option>
                <option value={20}>20 Words</option>
                <option value={50}>50 Words</option>
                <option value={100}>100 Words</option>
              </Select>

              <Select
                value={mode}
                onChange={(e) =>
                  setMode(e.target.value as "flashcard" | "quiz")
                }
                className="select"
              >
                <option value="flashcard">Flashcards</option>
                <option value="quiz">Quiz Mode</option>
              </Select>
            </Flex>

            <Progress value={progress} colorScheme="blue" borderRadius="full" />

            <Flex justify="space-between" align="center">
              <Text>
                Word {currentIndex + 1} of {shuffledWords.length}
              </Text>
              {mode === "quiz" && (
                <Badge
                  colorScheme="green"
                  fontSize="md"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  Score: {quizScore}/{currentIndex + 1}
                </Badge>
              )}
            </Flex>
          </Stack>
        </Box>

        {currentWord && (
          <Card
            className="card"
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ transform: "scale(1.02)" }}
            onClick={() => mode === "flashcard" && setShowAnswer(!showAnswer)}
          >
            <CardBody>
              {mode === "flashcard" ? (
                <Box textAlign="center">
                  <Heading size="lg" mb={4}>
                    {showAnswer
                      ? currentWord.reading
                      : currentWord.kanji || currentWord.japanese}
                  </Heading>

                  {showAnswer && (
                    <Box mt={4}>
                      <Text fontSize="xl" mb={2}>
                        {currentWord.japanese}
                      </Text>
                      {currentWord.kanji && (
                        <Text color="blue.200" mb={2}>
                          {currentWord.kanji}
                        </Text>
                      )}
                      <Text color="gray.400">{currentWord.indonesian}</Text>
                      <Box
                        mt={4}
                        p={4}
                        borderTopWidth={1}
                        borderColor="whiteAlpha.200"
                      >
                        <Text fontStyle="italic">
                          {currentWord.example.japanese}
                        </Text>
                        <Text color="blue.200" fontSize="sm" mt={1}>
                          {currentWord.example.reading}
                        </Text>
                        <Text color="gray.400" fontSize="sm" mt={1}>
                          {currentWord.example.indonesian}
                        </Text>
                      </Box>
                    </Box>
                  )}

                  <Flex justify="center" gap={4} mt={6}>
                    <IconButton
                      aria-label="Previous word"
                      icon={<ChevronLeftIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevious();
                      }}
                      isDisabled={currentIndex === 0}
                      size="lg"
                    />
                    <IconButton
                      aria-label="Next word"
                      icon={<ChevronRightIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNext();
                      }}
                      isDisabled={currentIndex === shuffledWords.length - 1}
                      size="lg"
                    />
                  </Flex>
                </Box>
              ) : (
                <Box>
                  <Heading size="lg" mb={6} textAlign="center">
                    {currentWord.kanji || currentWord.japanese}
                  </Heading>

                  <RadioGroup onChange={handleAnswer} value={selectedAnswer}>
                    <Stack spacing={4}>
                      {generateQuizOptions(currentWord).map((option) => (
                        <Radio
                          key={option._id}
                          value={option.reading}
                          isDisabled={!!selectedAnswer}
                          size="lg"
                          colorScheme="blue"
                          p={4}
                          borderWidth={1}
                          borderColor="whiteAlpha.200"
                          borderRadius="md"
                          _hover={{
                            borderColor: "blue.400",
                            bg: "whiteAlpha.50",
                          }}
                        >
                          <Text fontSize="lg">{option.reading}</Text>
                        </Radio>
                      ))}
                    </Stack>
                  </RadioGroup>
                </Box>
              )}
            </CardBody>
          </Card>
        )}
      </Box>
    </Container>
  );
};

export default Quiz;
