import axios from "axios";

export function extractErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    // try server-provided message, fallback to axios message
    return (err.response?.data?.message as string) ?? err.message ?? "Request failed";
  }
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}