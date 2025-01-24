import { PublicKey } from "@solana/web3.js";
import { Buffer } from "buffer";

// const programId = `${import.meta.env.VITE_PROGRAM_ID}`;

export const getQueueSystemAddress = (programId) => {
  const seeds = [Buffer.from("queue_system")];

  return PublicKey.findProgramAddressSync(seeds, programId);
};
