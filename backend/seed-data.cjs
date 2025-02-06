const mongoose = require("mongoose");

const wordSchema = new mongoose.Schema({
  japanese: { type: String, required: true },
  kanji: { type: String },
  reading: { type: String, required: true },
  indonesian: { type: String, required: true },
  example: {
    japanese: { type: String, required: true },
    reading: { type: String, required: true },
    indonesian: { type: String, required: true },
  },
});

const Word = mongoose.model("Word", wordSchema);

const sampleWords = [
  {
    japanese: "こんにちは",
    kanji: "今日は",
    reading: "konnichiwa",
    indonesian: "Halo (siang hari)",
    example: {
      japanese: "こんにちは、元気ですか？",
      reading: "konnichiwa, genki desu ka?",
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
      reading: "go shinsetsu ni arigatou gozaimasu.",
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
      reading: "watashi wa gakkou ni jitensha de ikimasu.",
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
      reading: "ashita no tesuto ni ganbatte kudasai!",
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
      reading: "kono raamen wa totemo oishii desu.",
      indonesian: "Ramen ini sangat enak.",
    },
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(
      "mongodb+srv://bimapopo81:Bima1234@sinau.q23pt.mongodb.net/japancard"
    );
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
  } catch (error) {
    console.error("Database operation failed:", error);
    process.exit(1);
  }
}

seedDatabase();
