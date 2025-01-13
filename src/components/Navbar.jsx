import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createAppKit, useAppKitAccount } from "@reown/appkit/react";
import { SolanaAdapter } from "@reown/appkit-adapter-solana/react";
import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  networks: [solana, solanaTestnet, solanaDevnet],
  projectId,
  features: {
    analytics: true,
    // email: true,
    // socials: ["google", "x", "github", "discord", "farcaster"],
    // emailShowWallets: true,
  },
  themeMode: "dark",
});

const Navbar = () => {
  //   const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isConnected, address } = useAppKitAccount();

  //   const [walletAddress, setWalletAddress] = useState("");

  //   useEffect(() => {
  //     const storedAddress = localStorage.getItem("walletAddress");
  //     if (storedAddress) {
  //       setWalletAddress(storedAddress);
  //       setIsLoggedIn(true);
  //     }
  //   }, []);

  //   const handleLoginWithWallet = async () => {
  //     try {
  //       console.log("Opening wallet modal...");
  //       const response = await modal.open();

  //       console.log("Modal Response:", response);
  //       if (response?.wallet?.address) {
  //         const address = response.wallet.address;
  //         console.log("Wallet Address:", address);
  //         setWalletAddress(address);
  //         localStorage.setItem("walletAddress", address);
  //         setIsLoggedIn(true);
  //         toast.success(`Wallet connected: ${address}`);
  //       } else {
  //         throw new Error("Wallet address not returned from response.");
  //       }
  //     } catch (error) {
  //       console.error("Wallet login failed:", error);
  //       toast.error(`Wallet login failed: ${error.message}`);
  //     }
  //   };

  //   const handleLogout = () => {
  //     localStorage.removeItem("walletAddress");
  //     setWalletAddress("");
  //     setIsLoggedIn(false);
  //     toast.success("Logged out successfully!");
  //   };

  return (
    <nav className="bg-dark-bg p-4">
      <ToastContainer />
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-lg">DQueue</div>
        <div className="space-x-2 flex items-center">
          {/* <button
            disabled={!isConnected}
            className={`text-white hover:text-gray-300 ${
              !isConnected && "cursor-not-allowed opacity-50"
            }`}
          >
            <Link to="/" className="text-white hover:text-gray-300">
              Home
            </Link>
          </button> */}
          {!isConnected ? (
            <appkit-button />
          ) : (
            <div className="flex flex-row gap-2">
              <div className="text-white">
                <span>{address}</span>
              </div>

              <button
                //onClick={handleLogout}
                className="text-white hover:text-gray-300"
              >
                Logout
              </button>
            </div>
          )}{" "}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
