import express from "express";
import {
  getWords,
  searchWords,
  addWord,
  saveTranslation,
  deleteWord,
} from "../controllers/wordController.js";

const router = express.Router();

// Get all words with pagination
router.get("/", getWords);

// Search words
router.get("/search", searchWords);

// Add new word
router.post("/", addWord);

// Save translation as word
router.post("/save-translation", saveTranslation);

// Delete word
router.delete("/:id", deleteWord);

export default router;
