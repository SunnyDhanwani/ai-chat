import { User } from "../types/enum";
import { ChatMessage } from "../types/types";
import { v4 as uuid } from "uuid";

export const getGlobalItem = (key: string) => {
  if (typeof window !== "undefined") {
    const value = localStorage.getItem(key);

    if (value) {
      return JSON.parse(value);
    } else {
      return null;
    }
  }

  return null;
};

export const setGlobalItem = (key: any, value: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const clearGlobalItem = () => {
  if (typeof window !== "undefined") {
    localStorage.clear();
  }
};

export const messageTemplateFormatter = (text: string, sentBy: User) => {
  const message: ChatMessage = {
    id: uuid(),
    like: null,
    message: text,
    sentBy,
    timestamp: Date.now().toString(),
  };

  return message;
};
  
export const round5 = (x: number) => {
  return Math.ceil(x / 5) * 5;
};

export function formatDate(timestamp: number) {
  const date = new Date(timestamp);

  const formattedDate = date.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  return formattedDate;
}

// Example usage
const timestamp = Date.now();
console.log(formatDate(timestamp));
