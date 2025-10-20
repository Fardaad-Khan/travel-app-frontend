import React from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export const ErrorMessage = ({ message, onRetry, darkMode }) => {
  return (
    <div className={`mx-auto max-w-md p-6 rounded-xl text-center ${
      darkMode 
        ? "bg-red-900/20 border border-red-800" 
        : "bg-red-50 border border-red-200"
    }`}>
      <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <p className={`mb-4 ${
        darkMode ? "text-red-400" : "text-red-700"
      }`}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center space-x-2 px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <RefreshCcw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;