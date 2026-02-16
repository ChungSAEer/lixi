"use client";

// Check if running in browser environment
const isBrowser = typeof window !== "undefined";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setItem(key: string, value: any): void {
  if (!isBrowser) return;
  try {
    const stringValue = JSON.stringify(value);
    localStorage.setItem(key, stringValue);
  } catch (e) {
    console.error(`Error setting localStorage for key "${key}":`, e);
  }
}

export function getItem<T>(key: string): T | undefined {
  if (!isBrowser) return undefined;
  try {
    const stringValue = localStorage.getItem(key);
    if (stringValue) {
      return JSON.parse(stringValue) as T;
    }
  } catch (e) {
    console.error(
      `Error parsing JSON from localStorage for key "${key}":`,
      e
    );
  }
  return undefined;
}

export function removeItem(key: string): void {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error(`Error removing localStorage for key "${key}":`, e);
  }
}

export function clear(): void {
  if (!isBrowser) return;
  try {
    localStorage.clear();
  } catch (e) {
    console.error("Error clearing localStorage:", e);
  }
}
