import db from "@/lib/db/schema";
import { generateId } from "@/lib/utils";

export interface KnowledgeChunk {
  id: string;
  userId: string;
  documentId: string;
  sectionType: string;
  content: string;
  contentHash: string;
  embedding: Buffer | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

interface KnowledgeChunkRow {
  id: string;
  user_id: string;
  document_id: string;
  section_type: string;
  content: string;
  content_hash: string;
  embedding: Buffer | null;
  metadata_json: string;
  created_at: string;
}

// Ensure table exists
db.exec(`
  CREATE TABLE IF NOT EXISTS knowledge_chunks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL DEFAULT 'default',
    document_id TEXT NOT NULL,
    section_type TEXT NOT NULL,
    content TEXT NOT NULL,
    content_hash TEXT NOT NULL,
    embedding BLOB,
    metadata_json TEXT DEFAULT '{}',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_user ON knowledge_chunks(user_id);
  CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_document ON knowledge_chunks(document_id);
  CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_hash ON knowledge_chunks(content_hash);
  CREATE INDEX IF NOT EXISTS idx_knowledge_chunks_section ON knowledge_chunks(user_id, section_type);
`);

function rowToChunk(row: KnowledgeChunkRow): KnowledgeChunk {
  return {
    id: row.id,
    userId: row.user_id,
    documentId: row.document_id,
    sectionType: row.section_type,
    content: row.content,
    contentHash: row.content_hash,
    embedding: row.embedding,
    metadata: JSON.parse(row.metadata_json || "{}"),
    createdAt: row.created_at,
  };
}

export function insertChunks(chunks: Array<{
  userId?: string;
  documentId: string;
  sectionType: string;
  content: string;
  contentHash: string;
  embedding?: Buffer | null;
  metadata?: Record<string, unknown>;
}>): string[] {
  const stmt = db.prepare(`
    INSERT INTO knowledge_chunks (id, user_id, document_id, section_type, content, content_hash, embedding, metadata_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const ids: string[] = [];
  const insertAll = db.transaction(() => {
    for (const chunk of chunks) {
      const id = generateId();
      stmt.run(
        id,
        chunk.userId ?? "default",
        chunk.documentId,
        chunk.sectionType,
        chunk.content,
        chunk.contentHash,
        chunk.embedding ?? null,
        JSON.stringify(chunk.metadata ?? {})
      );
      ids.push(id);
    }
  });
  insertAll();
  return ids;
}

export function getChunksByHash(hashes: string[], userId: string = "default"): KnowledgeChunk[] {
  if (hashes.length === 0) return [];
  const placeholders = hashes.map(() => "?").join(",");
  const rows = db.prepare(`
    SELECT * FROM knowledge_chunks WHERE user_id = ? AND content_hash IN (${placeholders})
  `).all(userId, ...hashes) as KnowledgeChunkRow[];
  return rows.map(rowToChunk);
}

export function getChunksByDocument(documentId: string, userId: string = "default"): KnowledgeChunk[] {
  const rows = db.prepare(`
    SELECT * FROM knowledge_chunks WHERE user_id = ? AND document_id = ?
  `).all(userId, documentId) as KnowledgeChunkRow[];
  return rows.map(rowToChunk);
}

export function getAllChunksWithEmbeddings(userId: string = "default"): KnowledgeChunk[] {
  const rows = db.prepare(`
    SELECT * FROM knowledge_chunks WHERE user_id = ? AND embedding IS NOT NULL
  `).all(userId) as KnowledgeChunkRow[];
  return rows.map(rowToChunk);
}

export function deleteChunksByDocument(documentId: string, userId: string = "default"): number {
  const result = db.prepare(`
    DELETE FROM knowledge_chunks WHERE user_id = ? AND document_id = ?
  `).run(userId, documentId);
  return result.changes;
}
