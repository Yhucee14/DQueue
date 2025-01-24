import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { web3, Program } from "@coral-xyz/anchor";
import { getQueueSystemAddress } from "./solanaConfig";
import idl from "./idl.json";

const program = new Program(idl, `${import.meta.env.VITE_PROGRAM_ID}`);
const connection = new Connection("https://api.devnet.solana.com");

export const fetchQueueData = async (address) => {
  const publicKey = new PublicKey(address);

  const accounts = {
    queueSystem: new PublicKey(getQueueSystemAddress(program.programId)),
    user: publicKey,
    systemProgram: web3.SystemProgram.programId,
    rent: web3.SYSVAR_RENT_PUBKEY,
  };

  const result = await program.rpc.getUserPosition(accounts);
  return result;
};

export const joinQueue = async (address) => {
  const publicKey = new PublicKey(address);

  const accounts = {
    queueSystem: new PublicKey(getQueueSystemAddress(program.programId)),
    user: publicKey,
    systemProgram: web3.SystemProgram.programId,
    rent: web3.SYSVAR_RENT_PUBKEY,
  };

  const transaction = new Transaction();
  transaction.add(program.methods.joinQueue, accounts);

  const signature = await connection.sendTransaction(transaction, []);
  await connection.confirmTransaction(signature);

  return signature;
};

export const upgradeToVIP = async (address) => {
  const publicKey = new PublicKey(address);

  const accounts = {
    queueSystem: new PublicKey(getQueueSystemAddress(program.programId)),
    user: publicKey,
    systemProgram: web3.SystemProgram.programId,
    rent: web3.SYSVAR_RENT_PUBKEY,
  };

  const transaction = new Transaction();
  transaction.add(program.methods.upgradeToVip, accounts);

  const signature = await connection.sendTransaction(transaction, []);
  await connection.confirmTransaction(signature);

  return signature;
};
