import Placeholder from "@tiptap/extension-placeholder";
import "./RichTextEditor.css";
import { Extension } from "@tiptap/core";
import {
  BubbleMenu,
  EditorContent,
  JSONContent,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import {
  generateJSONFromText,
  generateTextFromJSON,
  messageTemplateFormatter,
} from "../../utils/helper";
import { User } from "../../types/enum";
import {
  addFeedback,
  addMessageToChatId,
} from "../../components/features/chat/chatSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../components/store/store";
import { FEEDBACK_REPLY_MESSAGES } from "../../utils/contants";
import { FaArrowUp } from "react-icons/fa";

const FeedbackEditor = () => {
  const pathParams = useParams();
  const chatId = useRef<string>(pathParams.chatId || "");
  const dispatch: AppDispatch = useDispatch();

  const CustomExtension = Extension.create({
    addKeyboardShortcuts() {
      return {
        Enter: () => {
          // Handle Cmd-Enter shortcut
          handleSendEditorMessage();
          return true;
        },
      };
    },
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Enter your feedback",
      }),
      CustomExtension,
    ],
  });

  useEffect(() => {
    if (editor) {
      chatId.current = pathParams.chatId || "";
    }
  }, [pathParams.chatId, editor]);

  const handleSendEditorMessage = async () => {
    const userMessageJSON: JSONContent | undefined = editor?.getJSON();
    const userMessageText: string = editor?.getText() || "";

    if (
      !userMessageJSON ||
      !userMessageJSON?.content ||
      !generateTextFromJSON(userMessageJSON)
    )
      return;

    editor?.chain().clearContent().run();

    const currentChatId = chatId.current || pathParams.chatId || "";

    const newMessage = messageTemplateFormatter(userMessageJSON, User.USER);
    dispatch(
      addMessageToChatId({ message: newMessage, chatId: currentChatId })
    );
    dispatch(addFeedback({ chatId: currentChatId, feedback: userMessageText }));

    // setTimeout(() => {
    const feedbackReplyJSON = generateJSONFromText(
      FEEDBACK_REPLY_MESSAGES[Math.floor(Math.random() * 10) + 1]
    );
    const feedbackReply = messageTemplateFormatter(feedbackReplyJSON, User.AI);
    dispatch(
      addMessageToChatId({ message: feedbackReply, chatId: currentChatId })
    );
    // }, 1000);
  };

  return (
    <>
      <form
        className="w-full relative"
        onSubmit={(e) => {
          e.preventDefault();
          handleSendEditorMessage();
        }}
      >
        <div className="w-full">
          {editor && (
            <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
              <div className="space-x-2 shadow-md border bg-gray-50 p-1 rounded-md">
                <button
                  type="button"
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
                  type="button"
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
                  type="button"
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

        <button
          type="submit"
          className="absolute bottom-1/2 translate-y-1/2 right-2 rounded-md bg-gray-400 hover:bg-gray-500 cursor-pointer transition duration-200 p-2"
        >
          <FaArrowUp />
        </button>
      </form>
    </>
  );
};

export default FeedbackEditor;
