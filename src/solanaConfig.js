import { Connection, PublicKey } from "@solana/web3.js";

export const programId = new PublicKey(
  "J2HdB3pPKoKKmmH1V6WCjtcLZ76MyHL9dsQroSbMqV19"
);

// Replace with your queue system account
export const queueAccount = new PublicKey("QueueSystemAccountPublicKey");

// Initialize connection
export const connection = new Connection(
  "https://api.devnet.solana.com",
  "confirmed"
);
