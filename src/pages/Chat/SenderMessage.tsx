import { JSONContent } from "@tiptap/react";
import React from "react";
import { generateHTMLFromJSON } from "../../utils/helper";
import "./RichTextEditor.css";
interface SenderMessageProps {
  message: string;
  messageJSON: JSONContent;
}

const SenderMessage = ({ message, messageJSON }: SenderMessageProps) => {
  const __html = generateHTMLFromJSON(messageJSON);

  return (
    <div
      className="max-w-[80%] bg-gray-300 rounded-t-xl rounded-l-xl py-3 px-4 ml-auto tiptap"
      dangerouslySetInnerHTML={{ __html }}
    ></div>
  );
};

export default SenderMessage;
