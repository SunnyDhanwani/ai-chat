import React from "react";
import SenderMessage from "./SenderMessage";
import ReceiverMessage from "./ReceiverMessage";

const Chat = () => {
  return (
    <div className="p-4 pr-0 h-full max-w-full flex flex-col justify-between">
      <div className="max-h-full pr-4 mb-4 overflow-x-clip overflow-y-auto custom-scrollbar break-all text-black">
        <div className="max-w-[50vw] mx-auto flex flex-col gap-3">
          <ReceiverMessage rating={3} />
          <SenderMessage />
        </div>
      </div>
      <div className="max-w-[50vw] w-full mx-auto pr-4">
        <div className="flex gap-4">
          <form className="w-full relative">
            <input
              placeholder="Message AI"
              className="w-full py-2 px-4 rounded-md shadow-lg focus:shadow-xl outline-none focus:outline focus:outline-gray-200 border-none"
            />

            <img
              className="absolute top-1/2 -translate-y-1/2 right-2 rounded-md bg-gray-400 hover:bg-gray-500 cursor-pointer transition duration-200"
              src="/icons/send-arrow.svg"
              alt="Send message"
            />
          </form>
          <button className="w-max shrink-0 bg-gray-400 hover:bg-gray-500 px-3 rounded-md">
            <strong>End chat</strong>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
