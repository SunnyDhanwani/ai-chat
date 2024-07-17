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
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { v4 as uuid } from "uuid";
import {
  generateTextFromJSON,
  messageTemplateFormatter,
} from "../../utils/helper";
import { User } from "../../types/enum";
import {
  addMessageToChatId,
  markEndOfConversation,
} from "../../components/features/chat/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../components/store/store";
import { Chat } from "../../types/types";
import { useGetAssistantResponseMutation } from "../../components/features/chat/chatApi";

const RichTextEditor = () => {
  const pathParams = useParams();
  const navigate = useNavigate();
  const chatId = useRef<string>(pathParams.chatId || "");
  const dispatch: AppDispatch = useDispatch();
  const { data } = useSelector((state: RootState) => state.chat);
  const [getAssistantResponse, { isLoading }] =
    useGetAssistantResponseMutation();

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

  const currentChat = data.find((el: Chat) => el.id === pathParams.chatId);

  const handleEndChat = () => {

    if (isLoading) return;

    const emptyJSON: JSONContent = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Session's over! Share your rating and feedback with us!",
            },
          ],
        },
      ],
    };
    const newMessage = messageTemplateFormatter(emptyJSON, User.AI, true);
    dispatch(
      addMessageToChatId({
        message: newMessage,
        chatId: chatId.current || "",
      })
    );

    dispatch(markEndOfConversation({ chatId: chatId.current }));
  };

  const handleSendEditorMessage = async () => {
    const userMessageJSON: JSONContent | undefined = editor?.getJSON();

    if (
      !userMessageJSON ||
      !userMessageJSON?.content ||
      !generateTextFromJSON(userMessageJSON) ||
      isLoading
    )
      return;

    editor?.chain().clearContent().run();

    const currentChatId = chatId.current || pathParams.chatId;

    if (!currentChatId) {
      const newChatId = uuid();
      const newMessage = messageTemplateFormatter(userMessageJSON, User.USER);
      dispatch(addMessageToChatId({ message: newMessage, chatId: newChatId }));
      const response = await getAssistantResponse({
        query: userMessageJSON,
      }).unwrap();
      dispatch(addMessageToChatId({ message: response, chatId: newChatId }));

      navigate(`/chat/${newChatId}`, {
        replace: true,
        preventScrollReset: true,
      });
    } else {
      const newMessage = messageTemplateFormatter(userMessageJSON, User.USER);
      dispatch(
        addMessageToChatId({ message: newMessage, chatId: currentChatId })
      );
      const response = await getAssistantResponse({
        query: userMessageJSON,
      }).unwrap();
      dispatch(
        addMessageToChatId({ message: response, chatId: currentChatId })
      );
    }
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

        <button
          type="submit"
          className="absolute bottom-1/2 translate-y-1/2 right-2"
        >
          <img
            className="rounded-md bg-gray-400 hover:bg-gray-500 cursor-pointer transition duration-200"
            src="/icons/send-arrow.svg"
            alt="Send message"
          />
        </button>
      </form>
      <button
        className={`w-max shrink-0 bg-gray-400 hover:bg-gray-500 p-3 rounded-md h-fit ${
          currentChat?.messages ? "" : "hidden"
        }`}
        onClick={() => handleEndChat()}
      >
        <strong>End chat</strong>
      </button>
    </>
  );
};

export default RichTextEditor;
