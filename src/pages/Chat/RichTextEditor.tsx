import Placeholder from "@tiptap/extension-placeholder";
import "./RichTextEditor.css";
import { Extension } from "@tiptap/core";
import {
  BubbleMenu,
  Editor,
  EditorContent,
  JSONContent,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const RichTextEditor = ({
  handleSubmit,
}: {
  handleSubmit: (data: Editor | null, chatId: string) => void;
}) => {
  const pathParams = useParams();
  const chatId = useRef<string>(pathParams.chatId || "");

  const CustomExtension = Extension.create({
    addKeyboardShortcuts() {
      return {
        "Enter": () => {          
          // Handle Cmd-Enter shortcut
          handleSubmit(editor, chatId.current || "");
          editor?.chain().clearContent().run();
          return true;
        },
        // "Ctrl-Enter": () => {
        //   // Handle Ctrl-Enter shortcut
        //   handleSubmit(editor, chatId.current || "");
        //   editor?.chain().clearContent().run();
        //   return true;
        // },
      };
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Message SentiSum GPT",
      }),
      CustomExtension,
    ],
  });

  useEffect(() => {
    if (editor) {
      chatId.current = pathParams.chatId || "";
    }
  }, [pathParams.chatId, editor]);

  return (
    <div className="w-full">
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="space-x-2 shadow-md border bg-gray-50 p-1 rounded-md">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded-md ${
                editor.isActive("bold")
                  ? "bg-gray-400 hover:bg-gray-500"
                  : "hover:bg-gray-200"
              }`}
            >
              Bold
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded-md ${
                editor.isActive("italic")
                  ? "bg-gray-400 hover:bg-gray-500"
                  : "hover:bg-gray-200"
              }`}
            >
              Italic
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-2 rounded-md ${
                editor.isActive("strike")
                  ? "bg-gray-400 hover:bg-gray-500"
                  : "hover:bg-gray-200"
              }`}
            >
              Strike
            </button>
          </div>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
