import type { Meta, StoryObj } from "@storybook/react";
import { useFileFilters, useFileSelection, useBreadcrumbs, useUploadQueue } from "./model/hooks";
import { FILE_TYPE_ICONS, formatFileSize, getFileType } from "./model/constants";
import type { FileItem } from "./model/types";

const mockFiles: FileItem[] = [
  { id: "f1", name: "Documents", type: "other", mimeType: "", size: 0, url: "", path: "/Documents", isFolder: true, createdAt: "2025-01-15", updatedAt: "2025-12-20" },
  { id: "f2", name: "photo.jpg", type: "image", mimeType: "image/jpeg", size: 2400000, url: "", path: "/photo.jpg", isFolder: false, createdAt: "2025-12-01", updatedAt: "2025-12-01" },
  { id: "f3", name: "report.pdf", type: "document", mimeType: "application/pdf", size: 540000, url: "", path: "/report.pdf", isFolder: false, createdAt: "2025-11-20", updatedAt: "2025-11-20" },
  { id: "f4", name: "video.mp4", type: "video", mimeType: "video/mp4", size: 85000000, url: "", path: "/video.mp4", isFolder: false, createdAt: "2025-10-15", updatedAt: "2025-10-15" },
  { id: "f5", name: "music.mp3", type: "audio", mimeType: "audio/mpeg", size: 4200000, url: "", path: "/music.mp3", isFolder: false, createdAt: "2025-09-01", updatedAt: "2025-09-01" },
  { id: "f6", name: "archive.zip", type: "archive", mimeType: "application/zip", size: 15000000, url: "", path: "/archive.zip", isFolder: false, createdAt: "2025-08-01", updatedAt: "2025-08-01" },
  { id: "f7", name: "app.tsx", type: "code", mimeType: "text/typescript", size: 3200, url: "", path: "/app.tsx", isFolder: false, createdAt: "2025-12-15", updatedAt: "2025-12-15" },
];

function FileBrowserDemo() {
  const { filters, setSearch, setType, setSortBy, toggleSortOrder, setView } = useFileFilters();
  const { selected, selectedCount, toggle, selectAll, clearSelection, isSelected, hasSelection } = useFileSelection();
  const { crumbs, push, navigateTo, currentFolderId } = useBreadcrumbs();

  const filteredFiles = mockFiles
    .filter((f) => f.name.toLowerCase().includes(filters.search.toLowerCase()))
    .filter((f) => !filters.type || f.type === filters.type);

  return (
    <div style={{ fontFamily: "system-ui" }}>
      {/* Breadcrumbs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 12, fontSize: 14 }}>
        {crumbs.map((c, i) => (
          <span key={c.id}>
            {i > 0 && <span style={{ color: "#9ca3af", margin: "0 4px" }}>/</span>}
            <button onClick={() => navigateTo(c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: i === crumbs.length - 1 ? "#111" : "#3b82f6", fontWeight: i === crumbs.length - 1 ? 600 : 400 }}>{c.name}</button>
          </span>
        ))}
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <input value={filters.search} onChange={(e) => setSearch(e.target.value)} placeholder="Search..." style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6, flex: 1, minWidth: 150 }} />
        <select value={filters.type ?? ""} onChange={(e) => setType(e.target.value as any || null)} style={{ padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }}>
          <option value="">All types</option>
          {Object.keys(FILE_TYPE_ICONS).map((t) => <option key={t} value={t}>{FILE_TYPE_ICONS[t as keyof typeof FILE_TYPE_ICONS]} {t}</option>)}
        </select>
        <button onClick={() => setView(filters.view === "grid" ? "list" : "grid")} style={{ padding: "8px 12px", border: "1px solid #d1d5db", borderRadius: 6, background: "white", cursor: "pointer" }}>{filters.view === "grid" ? "📋 List" : "🔲 Grid"}</button>
        {hasSelection && <button onClick={clearSelection} style={{ padding: "8px 12px", background: "#ef4444", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>Clear ({selectedCount})</button>}
      </div>

      {/* File list */}
      {filters.view === "grid" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 12 }}>
          {filteredFiles.map((f) => (
            <div
              key={f.id}
              onClick={() => f.isFolder ? push({ id: f.id, name: f.name }) : toggle(f.id)}
              style={{ padding: 16, textAlign: "center", background: isSelected(f.id) ? "#eff6ff" : "#f9fafb", border: isSelected(f.id) ? "2px solid #3b82f6" : "2px solid transparent", borderRadius: 8, cursor: "pointer" }}
            >
              <div style={{ fontSize: 32 }}>{f.isFolder ? "📁" : FILE_TYPE_ICONS[f.type]}</div>
              <div style={{ fontSize: 12, marginTop: 8, wordBreak: "break-all" }}>{f.name}</div>
              {!f.isFolder && <div style={{ fontSize: 11, color: "#9ca3af" }}>{formatFileSize(f.size)}</div>}
            </div>
          ))}
        </div>
      ) : (
        <div>
          {filteredFiles.map((f) => (
            <div
              key={f.id}
              onClick={() => f.isFolder ? push({ id: f.id, name: f.name }) : toggle(f.id)}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderBottom: "1px solid #f3f4f6", cursor: "pointer", background: isSelected(f.id) ? "#eff6ff" : "transparent" }}
            >
              <span style={{ fontSize: 20 }}>{f.isFolder ? "📁" : FILE_TYPE_ICONS[f.type]}</span>
              <span style={{ flex: 1, fontWeight: 500, fontSize: 14 }}>{f.name}</span>
              <span style={{ fontSize: 12, color: "#9ca3af", width: 80 }}>{f.isFolder ? "—" : formatFileSize(f.size)}</span>
              <span style={{ fontSize: 12, color: "#9ca3af" }}>{new Date(f.updatedAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UploadDemo() {
  const { uploads, addUpload, updateProgress, completeUpload, failUpload, clearCompleted, activeCount } = useUploadQueue();

  const simulateUpload = () => {
    const id = `up-${Date.now()}`;
    const names = ["photo.jpg", "document.pdf", "video.mp4", "data.csv"];
    addUpload(id, names[Math.floor(Math.random() * names.length)]);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) { clearInterval(interval); completeUpload(id); return; }
      updateProgress(id, Math.min(progress, 99));
    }, 300);
  };

  return (
    <div style={{ fontFamily: "system-ui", maxWidth: 400 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button onClick={simulateUpload} style={{ padding: "8px 16px", background: "#3b82f6", color: "white", border: "none", borderRadius: 6, cursor: "pointer" }}>+ Simulate Upload</button>
        <button onClick={clearCompleted} style={{ padding: "8px 16px", border: "1px solid #d1d5db", borderRadius: 6, background: "white", cursor: "pointer" }}>Clear Completed</button>
      </div>
      {activeCount > 0 && <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>{activeCount} active upload(s)</div>}
      {uploads.map((u) => (
        <div key={u.fileId} style={{ padding: 12, borderBottom: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 4 }}>
            <span>{u.fileName}</span>
            <span style={{ color: u.status === "completed" ? "#22c55e" : u.status === "error" ? "#ef4444" : "#6b7280" }}>{u.status === "completed" ? "✓" : u.status === "error" ? "✕" : `${Math.round(u.progress)}%`}</span>
          </div>
          <div style={{ height: 4, background: "#e5e7eb", borderRadius: 2, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${u.progress}%`, background: u.status === "completed" ? "#22c55e" : u.status === "error" ? "#ef4444" : "#3b82f6", borderRadius: 2, transition: "width 0.3s" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

const meta: Meta = {
  title: "Modules/FileManagement",
  parameters: { layout: "padded" },
};
export default meta;

export const FileBrowser: StoryObj = {
  render: () => (
    <div>
      <h3 style={{ fontFamily: "system-ui", marginBottom: 16 }}>File Browser — Filters, Selection, Breadcrumbs</h3>
      <FileBrowserDemo />
    </div>
  ),
};

export const UploadQueue: StoryObj = {
  render: () => (
    <div>
      <h3 style={{ fontFamily: "system-ui", marginBottom: 16 }}>useUploadQueue() — Upload Progress</h3>
      <UploadDemo />
    </div>
  ),
};

export const FileTypeDetection: StoryObj = {
  render: () => (
    <div style={{ fontFamily: "system-ui" }}>
      <h3 style={{ marginBottom: 16 }}>File Type Detection</h3>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead><tr style={{ borderBottom: "2px solid #e5e7eb" }}><th style={{ padding: 8, textAlign: "left" }}>MIME Type</th><th style={{ padding: 8, textAlign: "left" }}>Type</th><th style={{ padding: 8, textAlign: "left" }}>Icon</th></tr></thead>
        <tbody>
          {["image/jpeg", "video/mp4", "audio/mpeg", "application/pdf", "application/zip", "text/typescript", "application/octet-stream"].map((mime) => {
            const type = getFileType(mime);
            return (
              <tr key={mime} style={{ borderBottom: "1px solid #f3f4f6" }}>
                <td style={{ padding: 8, fontFamily: "monospace", fontSize: 13 }}>{mime}</td>
                <td style={{ padding: 8 }}>{type}</td>
                <td style={{ padding: 8, fontSize: 20 }}>{FILE_TYPE_ICONS[type]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  ),
};

export const FileSizeFormatter: StoryObj = {
  render: () => (
    <div style={{ fontFamily: "system-ui" }}>
      <h3 style={{ marginBottom: 16 }}>formatFileSize()</h3>
      {[0, 500, 1024, 15360, 2400000, 540000000, 1073741824].map((bytes) => (
        <div key={bytes} style={{ display: "flex", gap: 16, padding: "6px 0", borderBottom: "1px solid #f3f4f6" }}>
          <span style={{ fontFamily: "monospace", width: 140, fontSize: 13 }}>{bytes.toLocaleString()} B</span>
          <span style={{ fontWeight: 600 }}>{formatFileSize(bytes)}</span>
        </div>
      ))}
    </div>
  ),
};
