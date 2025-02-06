import mongoose from "mongoose";

const wordSchema = new mongoose.Schema(
  {
    japanese: {
      type: String,
      required: true,
    },
    kanji: {
      type: String,
      required: false,
    },
    reading: {
      type: String,
      required: true,
    },
    indonesian: {
      type: String,
      required: true,
    },
    example: {
      japanese: {
        type: String,
        required: true,
      },
      reading: {
        type: String,
        required: true,
      },
      indonesian: {
        type: String,
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Add text search indexes
wordSchema.index({
  japanese: "text",
  kanji: "text",
  reading: "text",
  indonesian: "text",
  "example.japanese": "text",
  "example.reading": "text",
  "example.indonesian": "text",
});

const Word = mongoose.model("Word", wordSchema);

export default Word;
