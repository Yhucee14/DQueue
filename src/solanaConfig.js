import {
  PublicKey,
  Connection,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { Buffer } from "buffer";
import { Program } from "@coral-xyz/anchor";
import fs from "fs";

// The program ID of your deployed program
const programId = new PublicKey("Ga5uRjKiL7uiUCfwRgvnQkBgcX2vYG9Rnjs6DcFMkhHK");

// Function to get the derived public key for the queue_system account
export const getQueueSystemAddress = () => {
  const seeds = [Buffer.from("queue_system")]; // Seed used in the Rust program
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

// Read the IDL from the JSON file
const idl = JSON.parse(fs.readFileSync("./idl.json", "utf-8"));

// Fetch Queue Data
export const fetchQueueData = async (userAddress) => {
  try {
    const userPubkey = new PublicKey(userAddress);
    const queueSystemPubkey = getQueueSystemAddress();

    const accounts = {
      queueSystem: queueSystemPubkey,
      user: userPubkey,
      systemProgram: SystemProgram.programId,
    };

    const program = new Program(idl, programId, connection); // Use `null` for IDL if avoiding its import

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
export const joinQueue = async (userAddress) => {
  try {
    const userPubkey = new PublicKey(userAddress);
    const queueSystemPubkey = getQueueSystemAddress();

    const accounts = {
      queueSystem: queueSystemPubkey,
      user: userPubkey,
      systemProgram: SystemProgram.programId,
    };

    const transaction = new Transaction();
    const program = new Program(null, programId, connection);

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
export const upgradeToVIP = async (userAddress) => {
  try {
    const userPubkey = new PublicKey(userAddress);
    const queueSystemPubkey = getQueueSystemAddress();

    const accounts = {
      queueSystem: queueSystemPubkey,
      user: userPubkey,
      systemProgram: SystemProgram.programId,
    };

    const transaction = new Transaction();
    const program = new Program(null, programId, connection);

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
