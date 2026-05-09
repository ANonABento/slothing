import fs from "fs";
import path from "path";
import { needsOCRFallback, extractTextWithOCR } from "./ocr";

function toAbsolutePath(filePath: string): string {
  return path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);
}

function decodeUtf16Be(buffer: Buffer): string {
  const start = buffer[0] === 0xfe && buffer[1] === 0xff ? 2 : 0;
  const chars: string[] = [];
  for (let i = start; i + 1 < buffer.length; i += 2) {
    const code = (buffer[i] << 8) | buffer[i + 1];
    if (code > 0) chars.push(String.fromCharCode(code));
  }
  return chars.join("");
}

function decodePdfLiteralString(value: string): string {
  const decoded = value
    .replace(/\\([()\\])/g, "$1")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\b/g, "\b")
    .replace(/\\f/g, "\f")
    .replace(/\\([0-7]{1,3})/g, (_, octal: string) =>
      String.fromCharCode(parseInt(octal, 8)),
    );

  const bytes = Buffer.from(
    Array.from(decoded, (char) => char.charCodeAt(0) & 0xff),
  );
  const hasUtf16Bom = bytes[0] === 0xfe && bytes[1] === 0xff;
  const nullByteCount = bytes.filter((byte) => byte === 0).length;
  if (hasUtf16Bom || nullByteCount > bytes.length / 4) {
    return decodeUtf16Be(bytes);
  }

  return decoded.replace(/\0/g, "");
}

function extractPdfTextFallback(dataBuffer: Buffer): string {
  const raw = dataBuffer.toString("latin1");
  const textRuns: string[] = [];
  const literalPattern = /\((?:\\.|[^\\)])*\)/g;
  const textRunPattern = /(\((?:\\.|[^\\)])*\)\s*Tj)/g;
  const textArrayPattern = /\[([\s\S]*?)\]\s*TJ/g;

  let match: RegExpExecArray | null;

  while ((match = textRunPattern.exec(raw)) !== null) {
    const literal = match[0].match(literalPattern)?.[0];
    if (literal) {
      textRuns.push(decodePdfLiteralString(literal.slice(1, -1)));
    }
  }

  while ((match = textArrayPattern.exec(raw)) !== null) {
    const chunk = match[1];
    for (const literal of chunk.match(literalPattern) ?? []) {
      textRuns.push(decodePdfLiteralString(literal.slice(1, -1)));
    }
  }

  return textRuns
    .map((text) => text.trim())
    .filter(Boolean)
    .join("\n");
}

function sanitizeExtractedPdfText(text: string): string {
  return text
    .replace(/þÿ/g, "")
    .replace(/\u0000/g, "")
    .replace(/(\d)Í(?=-[A-Za-z]{2,})/g, "$1")
    .replace(/[ \t]+\n/g, "\n");
}

export async function extractTextFromPDF(filePath: string): Promise<string> {
  const pdf = (await import("pdf-parse")).default;
  const dataBuffer = fs.readFileSync(toAbsolutePath(filePath));
  const fallbackText = extractPdfTextFallback(dataBuffer);

  try {
    const data = await pdf(dataBuffer);
    const parsedText = sanitizeExtractedPdfText(data.text);

    if (!needsOCRFallback(parsedText)) {
      return parsedText;
    }
  } catch {
    if (fallbackText) {
      return sanitizeExtractedPdfText(fallbackText);
    }

    return sanitizeExtractedPdfText(await extractTextWithOCR(dataBuffer));
  }

  if (fallbackText) {
    return sanitizeExtractedPdfText(fallbackText);
  }

  return sanitizeExtractedPdfText(await extractTextWithOCR(dataBuffer));
}

export async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  const mammoth = (await import("mammoth")).default;
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

export async function extractTextFromFile(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case ".pdf":
      return extractTextFromPDF(filePath);
    case ".txt":
      return fs.readFileSync(toAbsolutePath(filePath), "utf-8");
    case ".docx": {
      const buffer = fs.readFileSync(toAbsolutePath(filePath));
      return extractTextFromDocx(buffer);
    }
    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}
