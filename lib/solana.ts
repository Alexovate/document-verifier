import {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  PublicKey,
} from "@solana/web3.js";
import bs58 from "bs58";
import fs from "fs";
import path from "path";

// Connect to local Solana validator
const RPC_ENDPOINT = "http://localhost:8899";

let connection: Connection | null = null;
let payer: Keypair | null = null;

// File-based store for hash -> account mapping (for demo purposes)
// In production, this would be stored on-chain in account data
const HASH_STORE_PATH = path.join(process.cwd(), "hash-store.json");

function loadHashStore(): Map<string, string> {
  try {
    if (fs.existsSync(HASH_STORE_PATH)) {
      const data = fs.readFileSync(HASH_STORE_PATH, "utf-8");
      const obj = JSON.parse(data);
      return new Map(Object.entries(obj));
    }
  } catch (error) {
    console.error("Error loading hash store:", error);
  }
  return new Map();
}

function saveHashStore(store: Map<string, string>): void {
  try {
    const obj = Object.fromEntries(store);
    fs.writeFileSync(HASH_STORE_PATH, JSON.stringify(obj, null, 2), "utf-8");
  } catch (error) {
    console.error("Error saving hash store:", error);
  }
}

const hashStore = loadHashStore();

/**
 * Get or create Solana connection
 */
export function getConnection(): Connection {
  if (!connection) {
    connection = new Connection(RPC_ENDPOINT, "confirmed");
  }
  return connection;
}

/**
 * Get or create payer keypair
 * For demo: generates a new keypair each time (in production, use env var)
 */
export function getPayer(): Keypair {
  if (!payer) {
    // Option 1: Generate new keypair
    payer = Keypair.generate();

    // Option 2: Use existing from env (uncomment for consistency)
    // if (process.env.PAYER_SECRET_KEY) {
    //   payer = Keypair.fromSecretKey(bs58.decode(process.env.PAYER_SECRET_KEY));
    // } else {
    //   payer = Keypair.generate();
    // }
  }
  return payer;
}

/**
 * Ensure payer has SOL by requesting airdrop
 */
export async function ensureSol(): Promise<void> {
  const conn = getConnection();
  const keypair = getPayer();
  
  const balance = await conn.getBalance(keypair.publicKey);
  const minBalance = 1_000_000_000; // 1 SOL

  if (balance < minBalance) {
    console.log("Requesting airdrop...");
    const signature = await conn.requestAirdrop(
      keypair.publicKey,
      2 * 1_000_000_000 // 2 SOL
    );
    await conn.confirmTransaction(signature);
    console.log("Airdrop successful!");
  }
}

/**
 * Store hash on Solana blockchain
 * Creates a new account and stores the hash in its data
 * @param hash - The hash string (hex)
 * @returns Account public key and transaction signature
 */
export async function storeHash(
  hash: string
): Promise<{ account: string; signature: string }> {
  const conn = getConnection();
  const keypair = getPayer();

  // Ensure we have SOL
  await ensureSol();

  // Create new account to store hash
  const hashAccount = Keypair.generate();
  const hashBuffer = Buffer.from(hash, "hex");

  // Get minimum balance for rent exemption
  const rentExemption = await conn.getMinimumBalanceForRentExemption(32);

  // Get recent blockhash
  const { blockhash, lastValidBlockHeight } = await conn.getLatestBlockhash("confirmed");

  // Create account transaction
  const transaction = new Transaction({
    feePayer: keypair.publicKey,
    blockhash: blockhash,
    lastValidBlockHeight: lastValidBlockHeight,
  }).add(
    SystemProgram.createAccount({
      fromPubkey: keypair.publicKey,
      newAccountPubkey: hashAccount.publicKey,
      lamports: rentExemption,
      space: 32, // 32 bytes for hash
      programId: SystemProgram.programId,
    })
  );

  // Sign and send
  transaction.sign(keypair, hashAccount);
  const signature = await conn.sendTransaction(transaction, [
    keypair,
    hashAccount,
  ]);

  // Wait for confirmation
  await conn.confirmTransaction({
    signature,
    blockhash,
    lastValidBlockHeight,
  });

  // Store hash -> account mapping persistently (for demo)
  // In production, this would be stored in the account's data on-chain
  const accountAddress = hashAccount.publicKey.toString();
  hashStore.set(accountAddress, hash);
  saveHashStore(hashStore);

  return {
    account: accountAddress,
    signature,
  };
}

/**
 * Verify if a hash exists on-chain
 * Checks if account exists AND compares the stored hash with provided hash
 * @param hash - The hash to verify
 * @param accountAddress - The account address where hash was stored
 * @returns True if account exists AND hashes match
 */
export async function verifyHash(
  hash: string,
  accountAddress: string
): Promise<boolean> {
  const conn = getConnection();

  try {
    const accountPubkey = new PublicKey(accountAddress);
    const accountInfo = await conn.getAccountInfo(accountPubkey);

    if (!accountInfo) {
      return false;
    }

    // Reload the hash store from disk to ensure we have the latest data
    const currentStore = loadHashStore();
    
    // Get the stored hash for this account
    const storedHash = currentStore.get(accountAddress);

    if (!storedHash) {
      // Account exists but no hash stored (shouldn't happen, but handle gracefully)
      console.warn(`Account ${accountAddress} exists but no hash found in store`);
      return false;
    }

    // Compare the provided hash with the stored hash
    return storedHash === hash;
  } catch (error) {
    console.error("Error verifying hash:", error);
    return false;
  }
}

/**
 * Find account by hash (simplified: returns null for demo)
 * In production, you'd use a program with PDA derivation
 */
export async function findAccountByHash(hash: string): Promise<string | null> {
  // For demo, we'll need to track hash -> account mapping
  // This would typically be done via a Solana program with PDAs
  // For now, return null (caller should provide account address)
  return null;
}

