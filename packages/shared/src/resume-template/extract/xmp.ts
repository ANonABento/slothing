import { PDFDocument, PDFName, PDFRawStream } from "pdf-lib";

import { resumeDocumentModelSchema, type ResumeDocumentModel } from "../rdm";

/**
 * Phase 2.5 — lossless self-re-import via XMP (Rezi RMS style, spec §10 / §5).
 *
 * On export we embed the RDM JSON into the PDF as a custom XMP metadata property
 * (`slothing:rdm`). On re-upload we detect that marker and restore the RDM DIRECTLY —
 * no pdf.js geometry, no LLM, no fingerprint, no parser-accuracy loss. The
 * fingerprint+LLM path (Phase 2) remains the fallback for FOREIGN PDFs only.
 *
 * Embedding writes a standards-shaped, UNCOMPRESSED XMP packet (via pdf-lib), so it
 * is both interoperable and trivially recoverable. Extraction is a library-free raw
 * byte scan for the marker — it does not depend on how a downstream tool re-serialized
 * the file, so the round-trip stays robust even after the PDF passes through other
 * software.
 */

export const XMP_NAMESPACE = "https://slothing.work/ns/1.0/";
export const RDM_XMP_VERSION = 1;

const OPEN_TAG = "<slothing:rdm>";
const CLOSE_TAG = "</slothing:rdm>";
const MARKER_RE = /<slothing:rdm>([A-Za-z0-9+/=\s]+)<\/slothing:rdm>/;

interface RdmEnvelope {
  v: number;
  rdm: ResumeDocumentModel;
}

// --- env-agnostic base64 (node + browser) -----------------------------------

// Reach Node's Buffer (when present) without a hard @types/node dependency, so the
// helpers stay env-agnostic (node + browser) and shared keeps its lean type surface.
interface BufferLike {
  from(
    input: Uint8Array | string,
    enc?: string,
  ): { toString(enc?: string): string };
}
const nodeBuffer = (globalThis as { Buffer?: BufferLike }).Buffer;

function bytesToBase64(bytes: Uint8Array): string {
  if (nodeBuffer) return nodeBuffer.from(bytes).toString("base64");
  let bin = "";
  for (let i = 0; i < bytes.length; i += 1)
    bin += String.fromCharCode(bytes[i]);
  return btoa(bin);
}

function base64ToString(b64: string): string {
  const clean = b64.replace(/\s+/g, "");
  if (nodeBuffer) return nodeBuffer.from(clean, "base64").toString("utf8");
  const bin = atob(clean);
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function encodeEnvelope(rdm: ResumeDocumentModel): string {
  const envelope: RdmEnvelope = { v: RDM_XMP_VERSION, rdm };
  return bytesToBase64(new TextEncoder().encode(JSON.stringify(envelope)));
}

function buildXmpPacket(rdm: ResumeDocumentModel): string {
  const payload = encodeEnvelope(rdm);
  // base64 is XML-safe, so no escaping is needed inside the element.
  return (
    `<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>` +
    `<x:xmpmeta xmlns:x="adobe:ns:meta/">` +
    `<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">` +
    `<rdf:Description rdf:about="" xmlns:slothing="${XMP_NAMESPACE}">` +
    `<slothing:rdmVersion>${RDM_XMP_VERSION}</slothing:rdmVersion>` +
    `${OPEN_TAG}${payload}${CLOSE_TAG}` +
    `</rdf:Description></rdf:RDF></x:xmpmeta>` +
    `<?xpacket end="w"?>`
  );
}

// --- public API --------------------------------------------------------------

/**
 * Embed an RDM into a PDF as an XMP `/Metadata` stream. Returns the new PDF bytes.
 * Call this on OUR exported PDFs (HTML-PDF and Typeset-PDF alike) so a later re-upload
 * round-trips losslessly.
 */
export async function embedRdmXmp(
  pdfBytes: Uint8Array,
  rdm: ResumeDocumentModel,
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes, { updateMetadata: false });
  const ctx = doc.context;
  const xmpBytes = new TextEncoder().encode(buildXmpPacket(rdm));
  const stream = PDFRawStream.of(
    ctx.obj({ Type: "Metadata", Subtype: "XML", Length: xmpBytes.length }),
    xmpBytes,
  );
  const ref = ctx.register(stream);
  doc.catalog.set(PDFName.of("Metadata"), ref);
  // Keep the metadata object as a standalone (uncompressed) object so the raw-byte
  // scan in extractRdmFromXmp finds the packet verbatim.
  return doc.save({ useObjectStreams: false });
}

function decodeBytes(pdfBytes: Uint8Array): string {
  // Latin1 view preserves byte positions of the (ASCII) XMP marker.
  let s = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < pdfBytes.length; i += CHUNK) {
    s += String.fromCharCode(...pdfBytes.subarray(i, i + CHUNK));
  }
  return s;
}

/** Cheap check: does this PDF carry our embedded RDM marker? */
export function hasRdmXmp(pdfBytes: Uint8Array): boolean {
  return MARKER_RE.test(decodeBytes(pdfBytes));
}

/**
 * Restore the embedded RDM from a PDF, or null if there is no (valid) marker — in
 * which case the caller falls back to the Phase 2 fingerprint+LLM extraction. The
 * recovered object is validated against the RDM schema, so a corrupted marker safely
 * degrades to the fallback rather than producing a malformed RDM.
 */
export function extractRdmFromXmp(
  pdfBytes: Uint8Array,
): ResumeDocumentModel | null {
  const match = MARKER_RE.exec(decodeBytes(pdfBytes));
  if (!match) return null;
  try {
    const json = base64ToString(match[1]);
    const parsed = JSON.parse(json) as RdmEnvelope | ResumeDocumentModel;
    const candidate =
      "rdm" in (parsed as RdmEnvelope)
        ? (parsed as RdmEnvelope).rdm
        : (parsed as ResumeDocumentModel);
    const result = resumeDocumentModelSchema.safeParse(candidate);
    return result.success ? (candidate as ResumeDocumentModel) : null;
  } catch {
    return null;
  }
}
