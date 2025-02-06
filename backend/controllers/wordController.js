import Word from "../models/Word.js";

export const getWords = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalWords = await Word.countDocuments();
    const totalPages = Math.ceil(totalWords / limit);

    const words = await Word.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      words,
      currentPage: page,
      totalPages,
      totalWords,
    });
  } catch (error) {
    console.error("Error fetching words:", error);
    res.status(500).json({ message: "Error fetching words" });
  }
};

export const searchWords = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const words = await Word.find({
      $or: [
        { japanese: { $regex: query, $options: "i" } },
        { kanji: { $regex: query, $options: "i" } },
        { reading: { $regex: query, $options: "i" } },
        { indonesian: { $regex: query, $options: "i" } },
        { "example.japanese": { $regex: query, $options: "i" } },
        { "example.indonesian": { $regex: query, $options: "i" } },
      ],
    }).limit(50);

    res.json(words);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Error searching words" });
  }
};

export const addWord = async (req, res) => {
  try {
    const wordData = req.body;

    if (
      !wordData.japanese ||
      !wordData.reading ||
      !wordData.indonesian ||
      !wordData.example?.japanese ||
      !wordData.example?.indonesian
    ) {
      return res.status(400).json({
        message:
          "Required fields missing: japanese, reading, indonesian, and example sentences",
      });
    }

    const word = new Word(wordData);
    await word.save();

    res.status(201).json(word);
  } catch (error) {
    console.error("Error adding word:", error);
    res.status(500).json({ message: "Error adding word" });
  }
};

export const saveTranslation = async (req, res) => {
  try {
    const translationData = req.body;

    // Check if word already exists
    const existingWord = await Word.findOne({
      japanese: translationData.japanese,
      indonesian: translationData.indonesian,
    });

    if (existingWord) {
      return res
        .status(409)
        .json({ message: "Word already exists", word: existingWord });
    }

    // Create new word
    const word = new Word(translationData);
    await word.save();

    res.status(201).json(word);
  } catch (error) {
    console.error("Error saving translation:", error);
    res.status(500).json({ message: "Error saving translation" });
  }
};

export const deleteWord = async (req, res) => {
  try {
    const { id } = req.params;
    await Word.findByIdAndDelete(id);
    res.json({ message: "Word deleted successfully" });
  } catch (error) {
    console.error("Error deleting word:", error);
    res.status(500).json({ message: "Error deleting word" });
  }
};
