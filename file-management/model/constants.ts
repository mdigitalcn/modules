import type { FileType } from "./types";

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const MAX_CONCURRENT_UPLOADS = 3;

export const FILE_TYPE_MAP: Record<string, FileType> = {
  "image/jpeg": "image", "image/png": "image", "image/gif": "image", "image/webp": "image", "image/svg+xml": "image",
  "video/mp4": "video", "video/webm": "video", "video/quicktime": "video",
  "audio/mpeg": "audio", "audio/wav": "audio", "audio/ogg": "audio",
  "application/pdf": "document", "application/msword": "document", "text/plain": "document",
  "application/zip": "archive", "application/x-rar-compressed": "archive", "application/gzip": "archive",
  "text/javascript": "code", "text/typescript": "code", "text/html": "code", "text/css": "code", "application/json": "code",
};

export const FILE_TYPE_ICONS: Record<FileType, string> = {
  image: "🖼️", video: "🎬", audio: "🎵", document: "📄", archive: "📦", code: "💻", other: "📁",
};

export function getFileType(mimeType: string): FileType {
  return FILE_TYPE_MAP[mimeType] ?? "other";
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}
