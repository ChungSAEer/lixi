"use client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setItem(key: string, value: any): void {
  const stringValue = JSON.stringify(value);
  localStorage.setItem(key, stringValue);
}

export function getItem<T>(key: string): T | undefined {
  const stringValue = localStorage.getItem(key);
  if (stringValue) {
    try {
      return JSON.parse(stringValue) as T;
    } catch (e) {
      console.error(
        `Error parsing JSON from localStorage for key "${key}":`,
        e
      );
      return undefined;
    }
  }
  return undefined;
}

export function removeItem(key: string): void {
  localStorage.removeItem(key);
}

export function clear(): void {
  localStorage.clear();
}
