"use client";

interface VerifyResultProps {
  match: boolean | null;
  message: string;
  hash?: string;
  accountAddress?: string;
  loading?: boolean;
}

export default function VerifyResult({
  match,
  message,
  hash,
  accountAddress,
  loading = false,
}: VerifyResultProps) {
  if (loading) {
    return (
      <div className="w-full p-6 bg-gray-50 border border-gray-300 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-700">Verifying document...</span>
        </div>
      </div>
    );
  }

  if (match === null) {
    return null;
  }

  return (
    <div
      className={`w-full p-6 rounded-lg border-2 ${
        match
          ? "bg-green-50 border-green-500"
          : "bg-red-50 border-red-500"
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        {match ? (
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : (
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        <h3
          className={`text-lg font-semibold ${
            match ? "text-green-800" : "text-red-800"
          }`}
        >
          {message}
        </h3>
      </div>
      {hash && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Hash:</p>
          <p className="font-mono text-base leading-relaxed tracking-wide bg-white p-3 rounded break-all text-gray-900">
            {hash}
          </p>
        </div>
      )}
      {accountAddress && (
        <div className="mt-2">
          <p className="text-sm font-medium text-gray-700 mb-1">
            Account Address:
          </p>
          <p className="font-mono text-base leading-relaxed tracking-wide bg-white p-3 rounded break-all text-gray-900">
            {accountAddress}
          </p>
        </div>
      )}
    </div>
  );
}

