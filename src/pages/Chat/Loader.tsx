import React from "react";

const Loader = () => {
  return (
    <div className="flex space-x-1">
      <div className="h-4 w-4 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-4 w-4 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-4 w-4 bg-blue-400 rounded-full animate-bounce"></div>
    </div>
  );
};

export default Loader;
