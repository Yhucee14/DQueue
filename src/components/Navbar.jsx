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
import Modal from "./Modal";

const projectId = import.meta.env.VITE_PROJECT_ID;
if (!projectId) {
  throw new Error("Project Id is not defined.");
}

// Initialize the Solana Web3Js adapter with wallet support
const solanaWeb3JsAdapter = new SolanaAdapter({
  wallets: [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
});

// Modal configuration for AppKit
const modal = createAppKit({
  adapters: [solanaWeb3JsAdapter],
  projectId,
  networks: [solana, solanaTestnet, solanaDevnet],
  features: {
    analytics: true,
    email: true,
    socials: ["google", "x", "github", "discord", "farcaster"],
    emailShowWallets: true,
  },
  themeMode: "dark",
});

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [showAuthModal, setShowAuthModal] = useState(false); // modal visibility
  const [showPhoneModal, setShowPhoneModal] = useState(false); // Control phone number modal
  const [phoneNumber, setPhoneNumber] = useState(""); // Store phone number input

  // Mutation to handle login process
  const loginMutation = useMutation({
    mutationFn: async (choice) => {
      if (choice === "wallet") {
        return loginWithWallet();
      } else if (choice === "phone") {
        return loginWithPhone();
      } else {
        throw new Error("Invalid choice");
      }
    },
    onSuccess: () => {
      setIsLoggedIn(true); // Mark user as logged in
      setShowAuthModal(false); // Close modal on successful login
      setShowPhoneModal(false);
    },
    onError: (error) => {
      alert(`Login failed: ${error.message}`); // Handle error
    },
  });

  const handleLogin = () => {
    setShowAuthModal(true); // Open the custom modal
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const loginWithPhone = async () => {
    if (!phoneNumber) throw new Error("Phone number is required");

    // Replace with your OTP provider's API call (e.g., Firebase)
    alert(`OTP sent to ${phoneNumber}`);
    setPhoneNumber(""); // Clear phone number after login attempt
  };

  const loginWithWallet = async () => {
    modal.open(); // Open AppKit modal for wallet login
  };

  return (
    <nav className="bg-dark-bg p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-xl">Queue Management</div>
        <div className="space-x-4 flex items-center">
          <button
            disabled={!isLoggedIn}
            className={`text-white hover:text-gray-300 ${
              !isLoggedIn && "cursor-not-allowed opacity-50"
            }`}
          >
            <Link to="/" className="text-white hover:text-gray-300">
              Home
            </Link>
          </button>{" "}
          {/* Conditionally render Login/Logout button */}
          {!isLoggedIn ? (
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
          )}
        </div>
      </div>

      {/* Render custom modal */}
      {showAuthModal && (
        <Modal onClose={() => setShowAuthModal(false)}>
          <div className="p-4">
            <h2 className="text-lg text-white mb-4">Choose Login Method</h2>
            <div className="flex justify-around">
              <button
                onClick={() => loginMutation.mutate("wallet")}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Wallet
              </button>
              <button
                onClick={() => loginMutation.mutate("phone")}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Phone Number
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Render phone number login modal */}
      {showPhoneModal && (
        <Modal onClose={() => setShowPhoneModal(false)}>
          <div className="p-4">
            <h2 className="text-lg text-white mb-4">Phone Number Login</h2>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full p-2 mb-4 rounded bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-500"
            />
            <button
              onClick={() => loginMutation.mutate("phone")}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Submit
            </button>
          </div>
        </Modal>
      )}
    </nav>
  );
};

export default Navbar;
