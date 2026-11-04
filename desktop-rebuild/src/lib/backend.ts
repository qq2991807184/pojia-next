import { invoke } from "@tauri-apps/api/core";

export type TargetRow = { label: string; state: string; detail?: string };
export type Target = { key: string; label: string; detected: boolean; rows: TargetRow[]; state: string };
export type BackendState = {
  targets: Target[];
  busy: boolean;
  busy_label: string;
  core_ready: boolean;
  core_file?: string;
  persona_len?: number;
};

export async function apiGet<T>(path: string): Promise<T> {
  return invoke<T>("backend_request", { method: "GET", path, body: null });
}
export async function apiPost<T>(path: string, body: unknown = {}): Promise<T> {
  return invoke<T>("backend_request", { method: "POST", path, body });
}
