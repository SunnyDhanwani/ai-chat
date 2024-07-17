import { User } from "../types/enum";
import { ChatMessage } from "../types/types";
import { v4 as uuid } from "uuid";
import {
  Editor,
  generateHTML,
  generateJSON,
  generateText,
  JSONContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import CryptoJS from "crypto-js";
import { ENCRYPTION_KEY, IV } from "./contants";

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

export const messageTemplateFormatter = (json: JSONContent, sentBy: User) => {
  const message: ChatMessage = {
    id: uuid(),
    like: null,
    message: generateTextFromJSON(json),
    messageJSON: json,
    sentBy,
    timestamp: Date.now(),
  };

  return message;
};

export const round5 = (x: number) => {
  return Math.ceil(x / 5) * 5;
};

export function formatDate(timestamp: number) {
  const date = new Date(timestamp);

  const formattedDate = date.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  return formattedDate;
}

export function generateHTMLFromJSON(json: JSONContent | undefined): string {
  if (!json) return "";

  try {
    const html = generateHTML(json, [StarterKit]);

    return html;
  } catch (error) {
    console.error("Error generating HTML:", error);
    return "";
  }
}

export function generateJSONFromText(text: string): JSONContent {
  try {
    const json = generateJSON(text, [StarterKit]);
    return json;
  } catch (error) {
    console.error("Error generating HTML:", error);
    return {};
  }
}

export function generateTextFromJSON(json: JSONContent | undefined): string {
  const data = json;

  if (!json || !data) return "";

  try {
    const text = generateText(data, [StarterKit]);
    return text;
  } catch (error) {
    console.error("Error generating HTML:", error);
    return "";
  }
}

export const encryptText = (text:any):string => {
  const encrypted = CryptoJS.AES.encrypt(text, ENCRYPTION_KEY, { iv: IV });
  return encodeURIComponent(encrypted.toString());
};

export const decryptText = (ciphertext: string): any => {
  const decodedText = decodeURIComponent(ciphertext);
  const bytes = CryptoJS.AES.decrypt(decodedText, ENCRYPTION_KEY, { iv: IV });  
  const originalText = bytes.toString(CryptoJS.enc.Utf8);  
  return originalText
};
