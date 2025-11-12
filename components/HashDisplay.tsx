"use client";

import { useState } from "react";

interface HashDisplayProps {
  hash: string;
}

export default function HashDisplay({ hash }: HashDisplayProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Document Hash (SHA-256)
      </label>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-50 border border-gray-300 rounded-lg p-4 font-mono text-base leading-relaxed tracking-wide break-all text-gray-900">
          {hash}
        </div>
        <button
          onClick={copyToClipboard}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

