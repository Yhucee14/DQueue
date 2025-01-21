import { Transaction, TransactionInstruction } from "@solana/web3.js";
import { programId, queueAccount, connection } from "./solanaConfig";
import { Buffer } from "buffer";

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

    // Deserialize the account data (custom logic depending on your program's structure)
    const queueData = accountInfo.data; // This is where you would parse the real data (e.g., queue length, positions)

    // Example of deserializing and calculating queue position (this is placeholder logic)
    const queueLength = queueData.length; // Assume queueData contains an array of users (this is just an example)
    const userPosition = queueLength === 0 ? 1 : queueLength + 1; // If no users, position is 1, otherwise position is +1 from last

    setQueueData({
      position: userPosition,
      vipStatus: false, // Mock VIP status (implement your logic as needed)
    });
  } catch (error) {
    console.error("Error fetching queue data:", error);
  }
};

// Join the queue by sending a transaction to the Solana program
export const joinQueue = async (userPubkey) => {
  try {
    const transaction = new Transaction();
    const instruction = new TransactionInstruction({
      keys: [
        { pubkey: queueAccount, isSigner: false, isWritable: true },
        { pubkey: userPubkey, isSigner: true, isWritable: false },
      ],
      programId,
      data: Buffer.from(userPubkey.toBuffer()), // Pass user's public key as data
    });

    transaction.add(instruction);
    const signature = await connection.sendTransaction(transaction, [
      userPubkey,
    ]);
    console.log("Transaction sent with signature:", signature);
    return true; // Return true if the join was successful
  } catch (error) {
    console.error("Error joining the queue:", error);
    return false;
  }
};
