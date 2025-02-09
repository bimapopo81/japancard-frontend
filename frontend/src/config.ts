const config = {
  API_BASE_URL: import.meta.env.PROD
    ? "https://japancard-frontend-1.onrender.com"
    : "http://localhost:5000",
  endpoints: {
    translate: "/api/translate",
    words: "/api/words",
    wordSearch: "/api/words/search",
  },
};

export default config;
