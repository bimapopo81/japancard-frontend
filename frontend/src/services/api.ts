const API_URL = "https://japancard-frontend-1.onrender.com/api";

interface TranslationRequest {
  text: string;
  from: string;
  to: string;
}

export interface TranslationResponse {
  _id?: string;
  japanese: string;
  kanji?: string;
  reading: string;
  indonesian: string;
  example: {
    japanese: string;
    reading: string;
    indonesian: string;
  };
}

export interface WordListResponse {
  words: TranslationResponse[];
  currentPage: number;
  totalPages: number;
  totalWords: number;
}

// Translation API
export const translateText = async (
  data: TranslationRequest
): Promise<TranslationResponse> => {
  const response = await fetch(`${API_URL}/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Translation request failed");
  }

  return response.json();
};

// Generate word details from romaji
export const generateWordFromRomaji = async (
  romaji: string
): Promise<TranslationResponse> => {
  const response = await translateText({
    text: `Generate Japanese word details for romaji: ${romaji}`,
    from: "id",
    to: "ja",
  });

  return response;
};

// Word List API
export const getWords = async (
  page: number = 1,
  limit: number = 10
): Promise<WordListResponse> => {
  const response = await fetch(`${API_URL}/words?page=${page}&limit=${limit}`);

  if (!response.ok) {
    throw new Error("Failed to fetch words");
  }

  return response.json();
};

export const searchWords = async (
  query: string
): Promise<TranslationResponse[]> => {
  const response = await fetch(
    `${API_URL}/words/search?query=${encodeURIComponent(query)}`
  );

  if (!response.ok) {
    throw new Error("Search request failed");
  }

  return response.json();
};

export const getAllWords = async (): Promise<TranslationResponse[]> => {
  const response = await fetch(`${API_URL}/words?page=1&limit=1000`);

  if (!response.ok) {
    throw new Error("Failed to fetch all words");
  }

  const data = await response.json();
  return data.words;
};
