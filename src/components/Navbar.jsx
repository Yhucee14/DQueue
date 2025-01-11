import { useState } from "react";
import { Link } from "react-router-dom";
import { createAppKit } from "@reown/appkit";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { useMutation } from "@tanstack/react-query";

// const projectId = `${import.meta.env.REACT_APP_PROJECT_ID}`;
// if (!projectId) {
//   throw new Error("Project Id is not defined.");
// }

// // Initialize the Solana Web3Js adapter with wallet support
// const solanaWeb3JsAdapter = new SolanaAdapter({
//   wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
// });

// // Modal configuration for AppKit
// const modal = createAppKit({
//   adapters: [solanaWeb3JsAdapter],
//   projectId,
//   networks: [solana, solanaTestnet, solanaDevnet],
//   features: {
//     analytics: true,
//     email: true,
//     socials: ["google", "x", "github", "discord", "farcaster"],
//     emailShowWallets: true,
//   },
//   themeMode: "dark",
// });

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status

  // Mutation to handle login process
  //   const loginMutation = useMutation({
  //     mutationFn: async (choice) => {
  //       if (choice === "email") {
  //         return loginWithEmail();
  //       } else if (choice === "wallet") {
  //         return loginWithWallet();
  //       } else {
  //         throw new Error("Invalid choice");
  //       }
  //     },
  //     onSuccess: () => {
  //       setIsLoggedIn(true); // Mark user as logged in
  //     },
  //     onError: (error) => {
  //       alert(`Login failed: ${error.message}`); // Handle error
  //     },
  //   });

  //   const handleLogin = () => {
  //     const choice = window.prompt(
  //       'Do you want to sign up with your email/social account or wallet? Type "email" or "wallet"'
  //     );
  //     loginMutation.mutate(choice); // Trigger login based on user's choice
  //   };

  //   const handleLogout = () => {
  //     setIsLoggedIn(false);
  //   };

  //   const loginWithEmail = async () => {
  //     modal.open(); // Open AppKit modal for email login
  //   };

  //   const loginWithWallet = async () => {
  //     modal.open(); // Open AppKit modal for wallet login
  //   };

  return (
    <nav className="bg-blue-600 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-black text-xl">Queue Management</div>
        <div className="space-x-4 flex items-center">
          {/* <button
            disabled={!isLoggedIn}
            className={`text-white hover:text-gray-300 ${
              !isLoggedIn && "cursor-not-allowed opacity-50"
            }`}
          >
            <Link to="/" className="text-white hover:text-gray-300">
              Home
            </Link>
          </button> */}{" "}
          login
          {/* Conditionally render Login/Logout button */}
          {/* {!isLoggedIn ? (
            <button
              onClick={handleLogin}
              className="text-white hover:text-gray-300"
            >
              {loginMutation.isLoading ? "Logging in..." : "Login"}
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-300"
            >
              Logout
            </button>
          )} */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
