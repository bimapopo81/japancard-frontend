import { useState } from "react";
import {
  Box,
  Button,
  Text,
  Heading,
  Textarea,
  Container,
} from "@chakra-ui/react";
import { translateText, TranslationResponse } from "../services/api";
import "../App.css";

const Translation = () => {
  const [text, setText] = useState("");
  const [direction, setDirection] = useState("id-ja");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TranslationResponse | null>(null);

  const handleTranslate = async () => {
    if (!text.trim()) {
      alert("Please enter text to translate");
      return;
    }

    setLoading(true);
    try {
      const [from, to] = direction.split("-");
      const response = await translateText({
        text: text.trim(),
        from,
        to,
      });
      setResult(response);
    } catch (error) {
      console.error("Translation error:", error);
      alert("Failed to get translation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="container.lg" py={6}>
      <Box>
        <Box p={6} className="card" borderRadius="lg" mb={6}>
          <Box mb={4}>
            <Text mb={2} fontWeight="medium">
              Translation Direction
            </Text>
            <select
              value={direction}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setDirection(e.target.value)
              }
              className="select"
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "6px",
              }}
            >
              <option value="id-ja">Indonesian → Japanese</option>
              <option value="ja-id">Japanese → Indonesian</option>
            </select>
          </Box>

          <Box mb={4}>
            <Text mb={2} fontWeight="medium">
              Text to Translate
            </Text>
            <Textarea
              value={text}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setText(e.target.value)
              }
              placeholder="Enter text to translate..."
              size="lg"
              rows={4}
              className="textarea"
              bg="transparent"
              _placeholder={{ color: "gray.400" }}
            />
          </Box>

          <Button
            colorScheme="blue"
            onClick={handleTranslate}
            disabled={loading}
            w="full"
            size="lg"
          >
            {loading ? "Translating..." : "Translate"}
          </Button>
        </Box>

        {result && (
          <Box p={6} className="card" borderRadius="lg">
            <Box mb={4}>
              <Heading size="sm" color="blue.200">
                {direction === "id-ja" ? "Japanese" : "Indonesian"}
              </Heading>
              <Text fontSize="xl" mt={2}>
                {direction === "id-ja" ? result.japanese : result.indonesian}
              </Text>
            </Box>

            {result.kanji && (
              <Box mb={4}>
                <Heading size="sm" color="blue.200">
                  Kanji
                </Heading>
                <Text fontSize="xl" mt={2}>
                  {result.kanji}
                </Text>
              </Box>
            )}

            <Box mb={4}>
              <Heading size="sm" color="blue.200">
                Reading
              </Heading>
              <Text fontSize="xl" mt={2}>
                {result.reading}
              </Text>
            </Box>

            <Box borderTopWidth={1} borderColor="whiteAlpha.300" pt={4}>
              <Heading size="sm" color="blue.200" mb={2}>
                Example
              </Heading>
              <Text fontStyle="italic">{result.example.japanese}</Text>
              <Text color="blue.200" fontSize="sm" mt={1}>
                {result.example.reading}
              </Text>
              <Text fontStyle="italic" mt={1} color="gray.300">
                {result.example.indonesian}
              </Text>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Translation;
