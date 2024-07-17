import { JSONContent } from "@tiptap/react";
import { Like, User } from "./enum";

export interface LoginUserResponse {
  _id: string;
  token: string;
  email: string;
  message?: string;
}

export interface ErrorMessage {
  message: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  messageJSON: JSONContent,
  timestamp: number;
  like: Like | null;
  sentBy: User;
  rating?: number;
}

export interface Chat {
  id: string;
  conversationEnded: boolean;
  feedback: string;
  rating: number;
  messages: ChatMessage[];
}
