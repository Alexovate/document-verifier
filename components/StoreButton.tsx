"use client";

import { useState } from "react";

interface StoreButtonProps {
  hash: string;
  onStored: (account: string, signature: string) => void;
}

export default function StoreButton({ hash, onStored }: StoreButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStore = async () => {
    if (!hash) {
      setError("No hash to store");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ hash }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to store hash");
      }

      onStored(data.account, data.signature);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to store hash");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={handleStore}
        disabled={loading}
        className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Storing on Solana...</span>
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span>Store on Solana</span>
          </>
        )}
      </button>
      {error && (
        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
