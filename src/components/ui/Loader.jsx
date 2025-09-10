import React from "react";

function Loader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <div
        className="w-12 h-12 border-4 border-red-300 dark:border-red-800 border-t-transparent rounded-full animate-spin"
        role="status"
        aria-label="Loading spinner"
      ></div>
      <p className="text-sm text-gray-600 dark:text-gray-300">{text}</p>
    </div>
  );
}

export default Loader;
