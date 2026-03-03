export type FileType = "image" | "video" | "audio" | "document" | "archive" | "code" | "other";

export interface FileItem {
  id: string;
  name: string;
  type: FileType;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  path: string;
  parentId?: string;
  isFolder: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  metadata?: Record<string, unknown>;
}

export interface UploadProgress {
  fileId: string;
  fileName: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
}

export interface FileFilters {
  search: string;
  type: FileType | null;
  sortBy: "name" | "date" | "size" | "type";
  sortOrder: "asc" | "desc";
  view: "grid" | "list";
}

export interface BreadcrumbItem {
  id: string;
  name: string;
}

export interface FileManagerConfig {
  baseUrl: string;
  maxFileSize?: number;
  allowedTypes?: string[];
  maxConcurrentUploads?: number;
}
