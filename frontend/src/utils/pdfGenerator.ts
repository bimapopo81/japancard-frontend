import { jsPDF } from "jspdf";
import type { TranslationResponse } from "../services/api";

async function testFont(): Promise<boolean> {
  try {
    await document.fonts.load('20px "Noto Sans JP"');
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    ctx.font = '20px "Noto Sans JP"';
    ctx.fillText("漢字", 0, 20);
    return true;
  } catch (e) {
    console.error("Font test failed:", e);
    return false;
  }
}

function calculateKanjiFontSize(
  text: string,
  maxWidth: number,
  ctx: CanvasRenderingContext2D
): number {
  // Mulai dengan ukuran default
  let fontSize = 20;

  // Jika teks lebih dari 3 karakter, kurangi ukuran font
  if (text.length > 3) {
    // Untuk setiap karakter tambahan, kurangi ukuran font
    fontSize = Math.max(12, fontSize - (text.length - 3) * 2);
  }

  // Set font untuk mengukur
  ctx.font = `bold ${fontSize}px "Noto Sans JP"`;

  // Jika masih terlalu lebar, kurangi ukuran font sampai muat
  while (ctx.measureText(text).width > maxWidth && fontSize > 10) {
    fontSize--;
    ctx.font = `bold ${fontSize}px "Noto Sans JP"`;
  }

  return fontSize;
}

function drawCard(
  ctx: CanvasRenderingContext2D,
  word: TranslationResponse,
  x: number,
  y: number,
  width: number,
  height: number
) {
  // Card background and border
  ctx.fillStyle = "white";
  ctx.fillRect(x, y, width, height);
  ctx.strokeStyle = "#ccc";
  ctx.strokeRect(x, y, width, height);

  const centerX = x + width / 2;
  const contentMargin = width * 0.1; // 10% margin dari lebar kartu
  const topMargin = height * 0.25; // 25% margin atas
  const maxTextWidth = width - contentMargin * 2; // Lebar maksimum untuk teks

  // Kanji/Japanese text dengan ukuran dinamis
  const kanjiText = word.kanji || word.japanese;
  const kanjiFontSize = calculateKanjiFontSize(kanjiText, maxTextWidth, ctx);

  ctx.textAlign = "center";
  ctx.fillStyle = "black";
  ctx.font = `bold ${kanjiFontSize}px "Noto Sans JP"`;
  ctx.fillText(kanjiText, centerX, y + topMargin + height * 0.2);

  // Reading (romaji) - 6px
  ctx.font = '6px "Noto Sans JP"';
  ctx.fillStyle = "#666";
  ctx.fillText(word.reading, centerX, y + topMargin + height * 0.4);

  // Indonesian translation - 5px
  ctx.font = "5px Arial";
  ctx.fillStyle = "#444";

  // Handle long translations by wrapping text
  const maxWidth = width - contentMargin * 2;
  let indonesianY = y + topMargin + height * 0.6;
  const words = word.indonesian.split(" ");
  let line = "";

  ctx.textAlign = "center";
  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      ctx.fillText(line, centerX, indonesianY);
      line = words[i] + " ";
      indonesianY += 8;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, centerX, indonesianY);
}

export async function generateFlashcardsPDF(words: TranslationResponse[]) {
  // Test font first
  if (!(await testFont())) {
    throw new Error("Japanese font not available. Please refresh the page.");
  }

  // Create PDF with A4 size
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // A4 dimensions (210 x 297 mm)
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Create high-res canvas
  const canvas = document.createElement("canvas");
  canvas.width = pageWidth * 10; // Higher resolution
  canvas.height = pageHeight * 10;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(10, 10); // Scale for better quality

  // Layout settings (2x4 cards per page)
  const margin = 10;
  const cardsPerRow = 2;
  const cardsPerCol = 4;
  const cardWidth = (pageWidth - margin * (cardsPerRow + 1)) / cardsPerRow;
  const cardHeight = (pageHeight - margin * (cardsPerCol + 1)) / cardsPerCol;
  const cardsPerPage = cardsPerRow * cardsPerCol;

  let currentPage = 0;

  // Draw cards
  for (let i = 0; i < words.length; i++) {
    if (i % cardsPerPage === 0) {
      // New page
      if (i > 0) {
        pdf.addImage(
          canvas.toDataURL("image/jpeg", 1.0),
          "JPEG",
          0,
          0,
          pageWidth,
          pageHeight,
          undefined,
          "FAST"
        );
        pdf.addPage();
      }

      // Clear canvas
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      currentPage++;
    }

    // Calculate position
    const cardIndex = i % cardsPerPage;
    const row = Math.floor(cardIndex / cardsPerRow);
    const col = cardIndex % cardsPerRow;

    const x = margin + col * (cardWidth + margin);
    const y = margin + row * (cardHeight + margin);

    // Draw card
    drawCard(ctx, words[i], x, y, cardWidth, cardHeight);

    // Draw cut guides
    ctx.setLineDash([1, 1]);
    ctx.strokeStyle = "#ccc";
    ctx.beginPath();

    // Horizontal guides
    ctx.moveTo(x - margin / 2, y);
    ctx.lineTo(x + cardWidth + margin / 2, y);
    ctx.moveTo(x - margin / 2, y + cardHeight);
    ctx.lineTo(x + cardWidth + margin / 2, y + cardHeight);

    // Vertical guides
    ctx.moveTo(x, y - margin / 2);
    ctx.lineTo(x, y + cardHeight + margin / 2);
    ctx.moveTo(x + cardWidth, y - margin / 2);
    ctx.lineTo(x + cardWidth, y + cardHeight + margin / 2);

    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Add last page
  pdf.addImage(
    canvas.toDataURL("image/jpeg", 1.0),
    "JPEG",
    0,
    0,
    pageWidth,
    pageHeight,
    undefined,
    "FAST"
  );

  // Add instructions
  pdf.setPage(1);
  pdf.setFontSize(8);
  const instructions = [
    "Instruksi:",
    "1. Print pada kertas A4",
    "2. Potong mengikuti garis putus-putus",
    `3. Total: ${words.length} kartu (${Math.ceil(
      words.length / cardsPerPage
    )} halaman)`,
    "4. Setiap halaman berisi 8 kartu (2x4)",
  ].join("\n");

  pdf.text(instructions, margin, 5);

  // Save PDF
  pdf.save("kartu-jepang.pdf");
}
