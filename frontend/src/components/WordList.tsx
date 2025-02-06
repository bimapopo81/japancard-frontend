import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Text,
  Container,
  Input,
  Spinner,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { getWords, searchWords, generateWordFromRomaji } from "../services/api";
import type { TranslationResponse } from "../services/api";
import "../App.css";

type WordListItem = Required<Pick<TranslationResponse, "_id">> &
  TranslationResponse;

const NewWordForm = ({
  onAdd,
  onCancel,
}: {
  onAdd: () => void;
  onCancel: () => void;
}) => {
  const [romaji, setRomaji] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!romaji.trim()) return;

    setLoading(true);
    try {
      // AI will handle the word generation and saving
      await generateWordFromRomaji(romaji.trim());
      onAdd(); // Refresh the word list
      setRomaji("");
      onCancel(); // Close the form
    } catch (error) {
      console.error("Error generating word:", error);
      alert("Failed to generate word details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={6} className="card" borderRadius="lg" mb={6}>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel>Enter Word in Romaji</FormLabel>
          <Box display="flex" gap={4}>
            <Input
              className="input"
              value={romaji}
              onChange={(e) => setRomaji(e.target.value)}
              placeholder="e.g., konnichiwa, arigatou"
              required
            />
            <Button
              type="submit"
              colorScheme="blue"
              minW="150px"
              isLoading={loading}
              loadingText="Generating..."
            >
              Generate
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </Box>
        </FormControl>
      </form>
    </Box>
  );
};

const WordList = () => {
  const [words, setWords] = useState<WordListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showNewWordForm, setShowNewWordForm] = useState(false);

  const fetchWords = async () => {
    try {
      const response = await getWords(page);
      setWords(response.words as WordListItem[]);
      setTotalPages(response.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching words:", error);
      alert("Failed to fetch word list");
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchWords();
      return;
    }

    try {
      const results = await searchWords(searchQuery);
      setWords(results as WordListItem[]);
      setTotalPages(1);
    } catch (error) {
      console.error("Search error:", error);
      alert("Failed to search words");
    }
  };

  const handleAddWord = async () => {
    fetchWords();
  };

  useEffect(() => {
    fetchWords();
  }, [page]);

  if (loading) {
    return (
      <Box textAlign="center" p={8}>
        <Spinner size="xl" color="blue.400" />
      </Box>
    );
  }

  return (
    <Container maxW="container.xl" py={6}>
      <Box>
        <Box p={6} className="card" borderRadius="lg" mb={6}>
          <Box display="flex" gap={4}>
            <Input
              placeholder="Search words..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              flex={1}
              className="input"
              _placeholder={{ color: "gray.400" }}
            />
            <Button onClick={handleSearch} colorScheme="blue" px={8}>
              Search
            </Button>
            <Button
              onClick={() => setShowNewWordForm(true)}
              colorScheme="green"
              px={8}
            >
              Add New Word
            </Button>
          </Box>
        </Box>

        {showNewWordForm && (
          <NewWordForm
            onAdd={handleAddWord}
            onCancel={() => setShowNewWordForm(false)}
          />
        )}

        <Box className="card" borderRadius="lg" overflowX="auto">
          <Box as="table" width="full" style={{ borderCollapse: "collapse" }}>
            <Box as="thead" borderBottomWidth={1} borderColor="whiteAlpha.300">
              <Box as="tr">
                <Box as="th" p={4} textAlign="left" color="blue.200">
                  Japanese
                </Box>
                <Box as="th" p={4} textAlign="left" color="blue.200">
                  Kanji
                </Box>
                <Box as="th" p={4} textAlign="left" color="blue.200">
                  Reading
                </Box>
                <Box as="th" p={4} textAlign="left" color="blue.200">
                  Indonesian
                </Box>
                <Box as="th" p={4} textAlign="left" color="blue.200">
                  Example
                </Box>
              </Box>
            </Box>
            <Box as="tbody">
              {words.map((word) => (
                <Box
                  as="tr"
                  key={word._id}
                  borderTopWidth={1}
                  borderColor="whiteAlpha.200"
                  _hover={{ bg: "whiteAlpha.100" }}
                >
                  <Box as="td" p={4}>
                    {word.japanese}
                  </Box>
                  <Box as="td" p={4}>
                    {word.kanji}
                  </Box>
                  <Box as="td" p={4}>
                    {word.reading}
                  </Box>
                  <Box as="td" p={4}>
                    {word.indonesian}
                  </Box>
                  <Box as="td" p={4}>
                    <Text>{word.example.japanese}</Text>
                    <Text color="blue.200" fontSize="sm" mt={1}>
                      {word.example.reading}
                    </Text>
                    <Text color="gray.400" fontSize="sm" mt={1}>
                      {word.example.indonesian}
                    </Text>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {words.length === 0 ? (
          <Box
            textAlign="center"
            p={4}
            className="card"
            borderRadius="lg"
            mt={6}
          >
            <Text>No words found.</Text>
          </Box>
        ) : (
          <Box
            className="card"
            borderRadius="lg"
            mt={6}
            p={4}
            display="flex"
            gap={4}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              colorScheme="blue"
              variant="outline"
            >
              Previous
            </Button>
            <Text>
              Page {page} of {totalPages}
            </Text>
            <Button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              colorScheme="blue"
              variant="outline"
            >
              Next
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default WordList;
