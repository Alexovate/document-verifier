"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import VerifyResult from "@/components/VerifyResult";
import Link from "next/link";

export default function VerifyPage() {
  const [file, setFile] = useState<File | null>(null);
  const [accountAddress, setAccountAddress] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    match: boolean;
    message: string;
    hash?: string;
    accountAddress?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setResult(null);
    setError(null);
  };

  const handleVerify = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    if (!accountAddress.trim()) {
      setError("Please enter the account address");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("accountAddress", accountAddress.trim());

      const response = await fetch("/api/verify", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to verify document");
      }

      setResult({
        match: data.match,
        message: data.message,
        hash: data.hash,
        accountAddress: data.accountAddress,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Verify Document
          </h1>
          <p className="text-lg text-gray-600">
            Upload a document and verify it against the stored hash on Solana
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors"
          >
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Upload
          </Link>

          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Upload Document to Verify
          </h2>
          <p className="text-gray-600 mb-6">
            Upload the document you want to verify and provide the account address from when it was stored
          </p>
          
          <FileUpload onFileSelect={handleFileSelect} />

          {file && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
              <svg
                className="w-5 h-5 text-blue-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div className="flex-1">
                <p className="text-sm text-gray-800 font-medium">{file.name}</p>
                <p className="text-xs text-gray-600">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
          )}

          <div className="mt-6">
            <label
              htmlFor="account-address"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Account Address
            </label>
            <input
              type="text"
              id="account-address"
              value={accountAddress}
              onChange={(e) => setAccountAddress(e.target.value)}
              placeholder="Enter the Solana account address"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            />
            <p className="mt-2 text-sm text-gray-500">
              This is the account address you received when you stored the document's hash
            </p>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <button
            onClick={handleVerify}
            disabled={loading || !file || !accountAddress.trim()}
            className="mt-6 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Verifying...</span>
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
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0121 12a11.955 11.955 0 01-1.382 5.618m0 0A11.955 11.955 0 0112 21a11.955 11.955 0 01-7.618-2.382m15.236 0A11.955 11.955 0 0112 3a11.955 11.955 0 017.618 9.382M9 12l2 2 4-4"
                  />
                </svg>
                <span>Verify Document</span>
              </>
            )}
          </button>
        </div>

        {result && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <VerifyResult
              match={result.match}
              message={result.message}
              hash={result.hash}
              accountAddress={result.accountAddress}
            />
          </div>
        )}
      </div>
    </main>
  );
}

