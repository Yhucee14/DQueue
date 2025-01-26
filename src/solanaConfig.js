import { PublicKey } from "@solana/web3.js";
import { Buffer } from "buffer";

// The program ID of your deployed program
export const programId = new PublicKey(
  "Ga5uRjKiL7uiUCfwRgvnQkBgcX2vYG9Rnjs6DcFMkhHK"
);

// Function to get the derived public key for the queue_system account
export const getQueueSystemAddress = () => {
  const seeds = [Buffer.from("queue_system")]; // Seed used in the Rust program
  const [queueSystemPubkey] = PublicKey.findProgramAddressSync(
    seeds,
    programId
  );
  return queueSystemPubkey;
};

// Example usage
// const queueSystemAddress = getQueueSystemAddress();
// console.log("Queue System Address:", queueSystemAddress.toBase58());
