import React from "react";

export default function LoadingComp() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-blue-500 dark:bg-blue-300 rounded-full animate-bounce"></div>
        <div className="w-4 h-4 bg-green-500 dark:bg-green-300 rounded-full animate-bounce delay-150"></div>
        <div className="w-4 h-4 bg-red-500 dark:bg-red-300 rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  );
}
