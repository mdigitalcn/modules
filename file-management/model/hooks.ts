"use client";

import { useState, useCallback, useMemo } from "react";
import type { FileFilters, FileItem, BreadcrumbItem, UploadProgress } from "./types";

export function useFileFilters() {
  const [filters, setFilters] = useState<FileFilters>({ search: "", type: null, sortBy: "name", sortOrder: "asc", view: "grid" });
  const setSearch = useCallback((search: string) => setFilters((f) => ({ ...f, search })), []);
  const setType = useCallback((type: FileFilters["type"]) => setFilters((f) => ({ ...f, type })), []);
  const setSortBy = useCallback((sortBy: FileFilters["sortBy"]) => setFilters((f) => ({ ...f, sortBy })), []);
  const toggleSortOrder = useCallback(() => setFilters((f) => ({ ...f, sortOrder: f.sortOrder === "asc" ? "desc" : "asc" })), []);
  const setView = useCallback((view: FileFilters["view"]) => setFilters((f) => ({ ...f, view })), []);
  const reset = useCallback(() => setFilters({ search: "", type: null, sortBy: "name", sortOrder: "asc", view: "grid" }), []);
  return { filters, setSearch, setType, setSortBy, toggleSortOrder, setView, reset };
}

export function useFileSelection() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const toggle = useCallback((id: string) => setSelected((s) => { const next = new Set(s); next.has(id) ? next.delete(id) : next.add(id); return next; }), []);
  const selectAll = useCallback((ids: string[]) => setSelected(new Set(ids)), []);
  const clearSelection = useCallback(() => setSelected(new Set()), []);
  const isSelected = useCallback((id: string) => selected.has(id), [selected]);
  return { selected, selectedCount: selected.size, toggle, selectAll, clearSelection, isSelected, hasSelection: selected.size > 0 };
}

export function useBreadcrumbs() {
  const [crumbs, setCrumbs] = useState<BreadcrumbItem[]>([{ id: "root", name: "Files" }]);
  const push = useCallback((item: BreadcrumbItem) => setCrumbs((c) => [...c, item]), []);
  const navigateTo = useCallback((id: string) => setCrumbs((c) => c.slice(0, c.findIndex((i) => i.id === id) + 1)), []);
  const currentFolderId = crumbs[crumbs.length - 1]?.id === "root" ? undefined : crumbs[crumbs.length - 1]?.id;
  return { crumbs, push, navigateTo, currentFolderId };
}

export function useUploadQueue() {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const addUpload = useCallback((fileId: string, fileName: string) => setUploads((u) => [...u, { fileId, fileName, progress: 0, status: "pending" }]), []);
  const updateProgress = useCallback((fileId: string, progress: number) => setUploads((u) => u.map((up) => up.fileId === fileId ? { ...up, progress, status: "uploading" as const } : up)), []);
  const completeUpload = useCallback((fileId: string) => setUploads((u) => u.map((up) => up.fileId === fileId ? { ...up, progress: 100, status: "completed" as const } : up)), []);
  const failUpload = useCallback((fileId: string, error: string) => setUploads((u) => u.map((up) => up.fileId === fileId ? { ...up, status: "error" as const, error } : up)), []);
  const clearCompleted = useCallback(() => setUploads((u) => u.filter((up) => up.status !== "completed")), []);
  const activeCount = useMemo(() => uploads.filter((u) => u.status === "uploading").length, [uploads]);
  return { uploads, addUpload, updateProgress, completeUpload, failUpload, clearCompleted, activeCount };
}
