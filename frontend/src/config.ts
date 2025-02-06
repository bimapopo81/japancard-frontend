const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  endpoints: {
    translate: "/translate",
    words: "/words",
    wordSearch: "/words/search",
  },
};

export default config;
