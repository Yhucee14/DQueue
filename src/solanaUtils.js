// import { PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
// import { getQueueSystemAddress, program, connection } from "./solanaConfig";

// // Get the Queue System Address
// const queueSystemAddress = getQueueSystemAddress(); // Directly calls the function

// // Fetch Queue Data
// export const fetchQueueData = async (userAddress) => {
//   try {
//     const publicKey = new PublicKey(userAddress);

//     const accounts = {
//       queueSystem: queueSystemAddress, // No need to derive it again
//       user: publicKey,
//       systemProgram: SystemProgram.programId,
//     };

//     const result = await program.methods
//       .getUserPosition()
//       .accounts(accounts)
//       .rpc();
//     return result;
//   } catch (err) {
//     console.error("Error fetching queue data:", err);
//     throw err;
//   }
// };

// // Join Queue
// export const joinQueue = async (userAddress) => {
//   try {
//     const publicKey = new PublicKey(userAddress);

//     const accounts = {
//       queueSystem: queueSystemAddress, // Use the derived address directly
//       user: publicKey,
//       systemProgram: SystemProgram.programId,
//     };

//     const transaction = new Transaction();
//     const instruction = await program.methods
//       .joinQueue()
//       .accounts(accounts)
//       .instruction();
//     transaction.add(instruction);

//     const { blockhash } = await connection.getLatestBlockhash();
//     transaction.recentBlockhash = blockhash;
//     transaction.feePayer = publicKey;

//     // Sign and send the transaction
//     const signedTransaction = await window.solana.signTransaction(transaction);
//     const signature = await connection.sendRawTransaction(
//       signedTransaction.serialize()
//     );
//     await connection.confirmTransaction(signature, "confirmed");

//     return signature;
//   } catch (err) {
//     console.error("Error joining queue:", err);
//     throw err;
//   }
// };

// // Upgrade to VIP
// export const upgradeToVIP = async (userAddress) => {
//   try {
//     const publicKey = new PublicKey(userAddress);

//     const accounts = {
//       queueSystem: queueSystemAddress, // Use the derived address directly
//       user: publicKey,
//       systemProgram: SystemProgram.programId,
//     };

//     const transaction = new Transaction();
//     const instruction = await program.methods
//       .upgradeToVip()
//       .accounts(accounts)
//       .instruction();
//     transaction.add(instruction);

//     const { blockhash } = await connection.getLatestBlockhash();
//     transaction.recentBlockhash = blockhash;
//     transaction.feePayer = publicKey;

//     // Sign and send the transaction
//     const signedTransaction = await window.solana.signTransaction(transaction);
//     const signature = await connection.sendRawTransaction(
//       signedTransaction.serialize()
//     );
//     await connection.confirmTransaction(signature, "confirmed");

//     return signature;
//   } catch (err) {
//     console.error("Error upgrading to VIP:", err);
//     throw err;
//   }
// };
