import express from "express";
import { translateText } from "../controllers/translationController.js";

const router = express.Router();

// POST translate text
router.post("/", translateText);

export default router;
