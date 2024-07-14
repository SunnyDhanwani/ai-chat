import React from "react";

interface SenderMessageProps {
  message: string;
}

const SenderMessage = ({ message }: SenderMessageProps) => {
  return (
    <div className="max-w-[80%] bg-gray-300 rounded-t-xl rounded-l-xl py-3 px-4 ml-auto">
      {message}
    </div>
  );
};

export default SenderMessage;
