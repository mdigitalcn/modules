import type { FileItem } from "./types";

export function createFileApi(config: { baseUrl: string; headers?: () => Record<string, string> }) {
  async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${config.baseUrl}${path}`, { ...options, headers: { ...config.headers?.(), ...options?.headers } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }

  return {
    getFiles: (folderId?: string) => request<{ items: FileItem[] }>(`/files${folderId ? `?folderId=${folderId}` : ""}`),
    getFile: (id: string) => request<FileItem>(`/files/${id}`),
    createFolder: (name: string, parentId?: string) => request<FileItem>("/files/folder", { method: "POST", body: JSON.stringify({ name, parentId }), headers: { "Content-Type": "application/json" } }),
    deleteFile: (id: string) => request<void>(`/files/${id}`, { method: "DELETE" }),
    moveFile: (id: string, targetFolderId: string) => request<FileItem>(`/files/${id}/move`, { method: "POST", body: JSON.stringify({ targetFolderId }), headers: { "Content-Type": "application/json" } }),
    renameFile: (id: string, name: string) => request<FileItem>(`/files/${id}`, { method: "PATCH", body: JSON.stringify({ name }), headers: { "Content-Type": "application/json" } }),

    uploadFile: async (file: File, folderId?: string, onProgress?: (progress: number) => void): Promise<FileItem> => {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append("file", file);
        if (folderId) formData.append("folderId", folderId);

        xhr.upload.addEventListener("progress", (e) => { if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100)); });
        xhr.addEventListener("load", () => { if (xhr.status >= 200 && xhr.status < 300) resolve(JSON.parse(xhr.responseText)); else reject(new Error(`Upload failed: ${xhr.status}`)); });
        xhr.addEventListener("error", () => reject(new Error("Upload failed")));

        xhr.open("POST", `${config.baseUrl}/files/upload`);
        const hdrs = config.headers?.();
        if (hdrs) Object.entries(hdrs).forEach(([k, v]) => { if (k.toLowerCase() !== "content-type") xhr.setRequestHeader(k, v); });
        xhr.send(formData);
      });
    },
  };
}

export type FileApi = ReturnType<typeof createFileApi>;
