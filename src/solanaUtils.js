import {
  PublicKey,
  TransactionInstruction,
  VersionedTransaction,
  Transaction,
} from "@solana/web3.js";
import { programId, queueAccount, connection } from "./solanaConfig";
import { Buffer } from "buffer";

// Deserialize the QueueSystem data
const deserializeQueueSystemData = (data) => {
  let offset = 0;

  // Check if buffer is long enough to contain the user count (4 bytes)
  if (data.length < offset + 4) {
    throw new Error("Buffer is too short to contain user count.");
  }

  const usersCount = data.readUInt32LE(offset);
  offset += 4;

  // Deserialize the users (check if enough data is available)
  const users = [];
  for (let i = 0; i < usersCount; i++) {
    // Check if there's enough data to read each user's info (8 bytes for queue_number, 1 byte for is_vip, and 8 bytes for vip_payment_time)
    if (data.length < offset + 8 + 1 + 8) {
      throw new Error("Buffer is too short to contain user data.");
    }

    const queue_number = data.readUInt64LE(offset);
    offset += 8;
    const is_vip = data.readUInt8(offset) === 1;
    offset += 1;
    const vip_payment_time = data.readUInt64LE(offset);
    offset += 8;

    users.push({ queue_number, is_vip, vip_payment_time });
  }

  // Deserialize the queue (check if enough data is available)
  const queue = [];
  if (data.length < offset + 4) {
    throw new Error("Buffer is too short to contain queue length.");
  }

  const queueLength = data.readUInt32LE(offset);
  offset += 4;

  for (let i = 0; i < queueLength; i++) {
    if (data.length < offset + 32) {
      throw new Error("Buffer is too short to contain a public key.");
    }

    const pubkeyBuffer = data.slice(offset, offset + 32);
    const pubkey = new PublicKey(pubkeyBuffer);
    queue.push(pubkey);
    offset += 32;
  }

  // Deserialize the owner and VIP cost (check if enough data is available)
  if (data.length < offset + 32 + 8) {
    throw new Error("Buffer is too short to contain owner or VIP cost.");
  }

  const ownerPubkey = new PublicKey(data.slice(offset, offset + 32));
  offset += 32;
  const vip_cost = data.readUInt64LE(offset);

  return { users, queue, owner: ownerPubkey, vip_cost };
};

// Fetch queue data from the Solana program
export const fetchQueueData = async (userPubkey, setQueueData) => {
  try {
    const accountInfo = await connection.getAccountInfo(queueAccount);
    if (!accountInfo) {
      console.log("Queue system account not found");
      setQueueData({
        position: 1, // No users in the queue, position is 1
        vipStatus: false, // VIP status (default false)
      });
      return;
    }

    const queueSystem = deserializeQueueSystemData(accountInfo.data);

    // Find the user's position and VIP status in the queue
    const userIndex = queueSystem.queue.findIndex(
      (pubkey) => pubkey.toString() === userPubkey.toString()
    );
    const position =
      userIndex === -1 ? queueSystem.queue.length + 1 : userIndex + 1;
    const vipStatus =
      userIndex === -1 ? false : queueSystem.users[userIndex].is_vip;

    setQueueData({
      position,
      vipStatus,
      vipCost: queueSystem.vip_cost,
    });
  } catch (error) {
    console.error("Error fetching queue data:", error);
  }
};

// Join the queue by sending a transaction to the Solana program
export const joinQueue = async (userPubkey) => {
  try {
    const transaction = new VersionedTransaction(new Transaction());
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: queueAccount, isSigner: false, isWritable: true },
        { pubkey: userPubkey, isSigner: true, isWritable: false },
      ],
      programId,
      data: Buffer.from(userPubkey.toBuffer()), // Pass user's public key as data
    });

    transaction.add(instruction);

    // Send the transaction using the versioned method
    const signature = await connection.sendTransaction(
      transaction,
      [userPubkey],
      {
        skipPreflight: false,
        preflightCommitment: "processed",
      }
    );

    console.log("Transaction sent with signature:", signature);
    return true; // Return true if the join was successful
  } catch (error) {
    console.error("Error joining the queue:", error);
    return false;
  }
};
