import { NextRequest, NextResponse } from "next/server";
import { storeHash } from "@/lib/solana";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { hash } = body;

    if (!hash || typeof hash !== "string") {
      return NextResponse.json(
        { error: "Hash is required" },
        { status: 400 }
      );
    }

    // Validate hash format (should be 64 character hex string)
    if (!/^[a-f0-9]{64}$/i.test(hash)) {
      return NextResponse.json(
        { error: "Invalid hash format" },
        { status: 400 }
      );
    }

    // Store hash on Solana
    const result = await storeHash(hash);

    return NextResponse.json({
      success: true,
      account: result.account,
      signature: result.signature,
    });
  } catch (error) {
    console.error("Store error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to store hash" },
      { status: 500 }
    );
  }
}

