import { NextRequest, NextResponse } from "next/server";
import { generateHash } from "@/lib/hash";
import { verifyHash } from "@/lib/solana";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const accountAddress = formData.get("accountAddress") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!accountAddress) {
      return NextResponse.json(
        { error: "Account address is required" },
        { status: 400 }
      );
    }

    // Convert file to buffer and generate hash
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const hash = generateHash(buffer);

    // Verify hash on-chain
    const isValid = await verifyHash(hash, accountAddress);

    return NextResponse.json({
      match: isValid,
      hash,
      accountAddress,
      message: isValid
        ? "✅ Document is authentic (hash matches)"
        : "❌ Document has been tampered with (hash mismatch)",
    });
  } catch (error) {
    console.error("Verify error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to verify document" },
      { status: 500 }
    );
  }
}

