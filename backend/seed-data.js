import mongoose from "mongoose";
import Word from "./models/Word.js";

const sampleWords = [
  {
    japanese: "こんにちは",
    kanji: "今日は",
    reading: "konnichiwa",
    indonesian: "Halo (siang hari)",
    example: {
      japanese: "こんにちは、元気ですか？",
      indonesian: "Halo, apa kabar?",
    },
  },
  {
    japanese: "ありがとう",
    kanji: "有難う",
    reading: "arigatou",
    indonesian: "Terima kasih",
    example: {
      japanese: "ご親切にありがとうございます。",
      indonesian: "Terima kasih atas kebaikan Anda.",
    },
  },
  {
    japanese: "じてんしゃ",
    kanji: "自転車",
    reading: "jitensha",
    indonesian: "Sepeda",
    example: {
      japanese: "私は学校に自転車で行きます。",
      indonesian: "Saya pergi ke sekolah naik sepeda.",
    },
  },
  {
    japanese: "がんばって",
    kanji: "頑張って",
    reading: "ganbatte",
    indonesian: "Semangat",
    example: {
      japanese: "明日のテストにがんばってください！",
      indonesian: "Semangat untuk ujian besok!",
    },
  },
  {
    japanese: "おいしい",
    kanji: "美味しい",
    reading: "oishii",
    indonesian: "Enak",
    example: {
      japanese: "このラーメンはとても美味しいです。",
      indonesian: "Ramen ini sangat enak.",
    },
  },
];

mongoose
  .connect(
    "mongodb+srv://bimapopo81:Bima1234@sinau.q23pt.mongodb.net/japancard"
  )
  .then(async () => {
    console.log("Connected to MongoDB");

    // Clear existing data
    await Word.deleteMany({});
    console.log("Cleared existing words");

    // Insert sample words
    await Word.insertMany(sampleWords);
    console.log("Sample words inserted successfully");

    // Close connection
    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Database operation failed:", error);
    process.exit(1);
  });
