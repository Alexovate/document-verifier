import crypto from "crypto";

/**
 * Generate SHA-256 hash from file buffer
 * @param fileBuffer - The file buffer to hash
 * @returns Hexadecimal hash string
 */
export function generateHash(fileBuffer: Buffer): string {
  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
}

