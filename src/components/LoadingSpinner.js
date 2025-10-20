import React from "react";
import { Loader2, Globe2 } from "lucide-react";

export const LoadingSpinner = ({ darkMode }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <Globe2 className="h-16 w-16 text-blue-500 opacity-20" />
        <Loader2 className="h-16 w-16 text-blue-500 animate-spin absolute top-0 left-0" />
      </div>
      <p className={`mt-4 text-lg ${
        darkMode ? "text-gray-400" : "text-gray-600"
      } animate-pulse`}>
        Loading amazing destinations...
      </p>
    </div>
  );
};

export default LoadingSpinner;