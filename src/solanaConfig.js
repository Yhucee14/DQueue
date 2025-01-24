import { Connection, PublicKey } from "@solana/web3.js";

export const programId = new PublicKey(
  "6qKkhBD5TiJ7AydvkUvjekag52Wibbzqa823aKAMvxCH"
);

// Replace with your queue system account
export const queueAccount = new PublicKey(
  "9P64AzoX9mNitYTEgrXGgeryFNfSTFB6NCcxMyv5GjQb"
);

// Initialize connection
export const connection = new Connection(
  "https://api.devnet.solana.com",
  "confirmed"
);
