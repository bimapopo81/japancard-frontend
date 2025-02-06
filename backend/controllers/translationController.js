import OpenAI from "openai";
import Word from "../models/Word.js";

const openai = new OpenAI({
  apiKey: "glhf_ef882617166556f06dc68caa8cd36b75",
  baseURL: "https://glhf.chat/api/openai/v1",
});

export const translateText = async (req, res) => {
  try {
    const { text, from, to } = req.body;

    if (!text || !from || !to) {
      return res.status(400).json({
        message: "Text, source language, and target language are required",
      });
    }

    let prompt;
    if (text.startsWith("Generate Japanese word details for romaji:")) {
      // Handle word generation from romaji
      const romaji = text
        .replace("Generate Japanese word details for romaji:", "")
        .trim();
      prompt = `You are a Japanese language expert. Generate detailed information for the word with romaji "${romaji}".
      Return ONLY a valid JSON object in this exact format without any explanation or additional text:
      {
        "japanese": "Word in hiragana/katakana",
        "kanji": "Kanji representation (if applicable)",
        "reading": "${romaji}",
        "indonesian": "Indonesian translation",
        "example": {
          "japanese": "A natural example sentence in Japanese",
          "reading": "The example sentence in romaji",
          "indonesian": "The example sentence translated to Indonesian"
        }
      }

      Make sure the example.reading is an accurate romaji transcription of the Japanese example sentence.`;
    } else if (from === "id" && to === "ja") {
      prompt = `You are a Japanese-Indonesian translator. Translate the following Indonesian text to Japanese.
      Return ONLY a valid JSON object in this exact format without any explanation or additional text:
      {
        "japanese": "Japanese translation",
        "kanji": "Kanji if applicable",
        "reading": "Reading in romaji",
        "indonesian": "${text}",
        "example": {
          "japanese": "A simple example sentence in Japanese",
          "reading": "The example sentence in romaji",
          "indonesian": "The example sentence translated to Indonesian"
        }
      }

      Make sure the example.reading is an accurate romaji transcription of the Japanese example sentence.`;
    } else if (from === "ja" && to === "id") {
      prompt = `You are a Japanese-Indonesian translator. Translate the following Japanese text to Indonesian.
      Return ONLY a valid JSON object in this exact format without any explanation or additional text:
      {
        "japanese": "${text}",
        "kanji": "Kanji if applicable",
        "reading": "Reading in romaji",
        "indonesian": "Indonesian translation",
        "example": {
          "japanese": "A simple example sentence using this word/phrase",
          "reading": "The example sentence in romaji",
          "indonesian": "The example sentence translated to Indonesian"
        }
      }

      Make sure the example.reading is an accurate romaji transcription of the Japanese example sentence.`;
    } else {
      return res.status(400).json({ message: "Unsupported language pair" });
    }

    const completion = await openai.chat.completions.create({
      model: "hf:deepseek-ai/DeepSeek-V3",
      messages: [
        {
          role: "system",
          content:
            "You are a translator that ONLY returns valid JSON objects. Never include any explanation, thinking process, or additional text in your response. Only return the exact JSON format requested. For romaji transcriptions, use standard Hepburn romanization.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const response = completion.choices[0].message.content.trim();

    try {
      // Remove any non-JSON content
      const jsonStart = response.indexOf("{");
      const jsonEnd = response.lastIndexOf("}") + 1;
      const jsonStr = response.slice(jsonStart, jsonEnd);

      const parsedResponse = JSON.parse(jsonStr);

      // If this is a word generation request, save it to the database
      if (text.startsWith("Generate Japanese word details for romaji:")) {
        const word = new Word(parsedResponse);
        await word.save();
      }

      res.json(parsedResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response:", response);
      res.status(500).json({ message: "Failed to parse translation result" });
    }
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ message: "Translation service error" });
  }
};
