"use client";

import { useState } from "react";
import FileUpload from "@/components/FileUpload";
import HashDisplay from "@/components/HashDisplay";
import StoreButton from "@/components/StoreButton";
import Link from "next/link";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [hash, setHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storedAccount, setStoredAccount] = useState<string | null>(null);
  const [storedSignature, setStoredSignature] = useState<string | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setHash(null);
    setError(null);
    setStoredAccount(null);
    setStoredSignature(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate hash");
      }

      setHash(data.hash);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process file");
    } finally {
      setLoading(false);
    }
  };

  const handleStored = (account: string, signature: string) => {
    setStoredAccount(account);
    setStoredSignature(signature);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Document Hash Verifier
          </h1>
          <p className="text-lg text-gray-600">
            Upload a document, generate a hash, and store it on Solana
            blockchain
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Upload & Store Document
          </h2>
          <p className="text-gray-600 mb-6">
            Upload your document to generate a cryptographic hash and store it
            on Solana blockchain
          </p>

          <FileUpload onFileSelect={handleFileSelect} />

          {loading && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Generating hash...</span>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {hash && (
            <div className="mt-6 space-y-6">
              <HashDisplay hash={hash} />
              <StoreButton hash={hash} onStored={handleStored} />
            </div>
          )}

          {storedAccount && storedSignature && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-6 h-6 text-green-600"
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
                <h3 className="text-lg font-semibold text-green-800">
                  Hash stored successfully!
                </h3>
              </div>
              <div className="mt-3 space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Account Address:
                  </p>
                  <p className="font-mono text-base leading-relaxed tracking-wide bg-white p-3 rounded break-all text-gray-900">
                    {storedAccount}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Transaction Signature:
                  </p>
                  <p className="font-mono text-base leading-relaxed tracking-wide bg-white p-3 rounded break-all text-gray-900">
                    {storedSignature}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
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
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Verify Document
              </h2>
              <p className="text-gray-600 mb-4">
                Already stored a document? Verify its authenticity against the
                blockchain record.
              </p>
              <Link
                href="/verify"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <span>Verify a Document</span>
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
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
