import {
  PublicKey,
  Connection,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import { Buffer } from "buffer";

// The program ID of your deployed program
const programId = new PublicKey(`${import.meta.env.VITE_PROGRAM_ID}`);
console.log("Program ID:", programId);

// Function to get the derived public key for the queue_system account
export const getQueueSystemAddress = () => {
  const seeds = [Buffer.from("queue_system")];
  const [queueSystemPubkey] = PublicKey.findProgramAddressSync(
    seeds,
    programId
  );
  return queueSystemPubkey;
};

// Initialize the Solana connection
export const connection = new Connection(
  "https://api.devnet.solana.com",
  "confirmed"
);
console.log("Connection:", connection);

const fetchIDL = async () => {
  const response = await fetch("/idl.json");
  return await response.json();
};

// Fetch Queue Data
export const fetchQueueData = async (address) => {
  try {
    if (!address || typeof address !== "string") {
      console.error("Invalid address:", address);
      throw new Error("Invalid address");
    }

    console.log("User Address (before PublicKey):", address);

    const idl = await fetchIDL();
    console.log("IDL:", idl);

    // Validate the address before creating PublicKey
    if (!PublicKey.isOnCurve(Buffer.from(address))) {
      throw new Error("Invalid public key format");
    }

    const userPubkey = new PublicKey(address);
    console.log("User PublicKey after conversion:", userPubkey.toString());

    const queueSystemPubkey = getQueueSystemAddress();
    console.log("Queue System PublicKey:", queueSystemPubkey.toString());

    const accounts = {
      queueSystem: queueSystemPubkey,
      user: userPubkey,
      systemProgram: SystemProgram.programId,
    };

    // Initialize the program
    const program = new Program(idl, programId, connection);

    // Check available methods
    console.log("Methods available in program:", Object.keys(program.methods));

    // Verify `getUserPosition` exists
    if (!program.methods.getUserPosition) {
      throw new Error("Method 'getUserPosition' not found in the program.");
    }

    // Fetch user position
    const position = await program.methods
      .getUserPosition()
      .accounts(accounts)
      .rpc();

    console.log("User Position:", position);
    return position;
  } catch (err) {
    console.error("Error fetching queue data:", err);
    throw err;
  }
};

// Join Queue
export const joinQueue = async (address) => {
  try {
    const userPubkey = new PublicKey(address);
    const queueSystemPubkey = getQueueSystemAddress();

    const accounts = {
      queueSystem: queueSystemPubkey,
      user: userPubkey,
      systemProgram: SystemProgram.programId,
    };

    const transaction = new Transaction();
    const idl = await fetchIDL();
    const program = new Program(idl, programId, connection);

    const instruction = await program.methods
      .joinQueue()
      .accounts(accounts)
      .instruction();

    transaction.add(instruction);

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = userPubkey;

    const signedTransaction = await window.solana.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(
      signedTransaction.serialize()
    );
    await connection.confirmTransaction(signature, "confirmed");

    console.log("Transaction Signature:", signature);
    return signature;
  } catch (err) {
    console.error("Error joining queue:", err);
    throw err;
  }
};

// Upgrade to VIP
export const upgradeToVIP = async (address) => {
  try {
    const userPubkey = new PublicKey(address);
    const queueSystemPubkey = getQueueSystemAddress();

    const accounts = {
      queueSystem: queueSystemPubkey,
      user: userPubkey,
      systemProgram: SystemProgram.programId,
    };

    const transaction = new Transaction();
    const idl = await fetchIDL();
    const program = new Program(idl, programId, connection);

    const instruction = await program.methods
      .upgradeToVip()
      .accounts(accounts)
      .instruction();

    transaction.add(instruction);

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = userPubkey;

    const signedTransaction = await window.solana.signTransaction(transaction);
    const signature = await connection.sendRawTransaction(
      signedTransaction.serialize()
    );
    await connection.confirmTransaction(signature, "confirmed");

    console.log("Transaction Signature:", signature);
    return signature;
  } catch (err) {
    console.error("Error upgrading to VIP:", err);
    throw err;
  }
};
