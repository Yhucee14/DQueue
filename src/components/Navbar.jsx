import { Link } from "react-router-dom";
import { useEffect } from "react";
import {
  createAppKit,
  useAppKitAccount,
  useDisconnect,
} from "@reown/appkit/react";
import {
  SolanaAdapter,
  useAppKitConnection,
} from "@reown/appkit-adapter-solana/react";
import { solana, solanaTestnet, solanaDevnet } from "@reown/appkit/networks";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";

const projectId = `${import.meta.env.VITE_PROJECT_ID}`;
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
  const { isConnected, address } = useAppKitAccount();
  const { connection } = useAppKitConnection();
  const { disconnect } = useDisconnect();

  const {
    data: balance,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["balance", address],
    queryFn: async () => {
      if (!connection || !address) return 0;
      const wallet = new PublicKey(address);
      const balance = await connection.getBalance(wallet);
      return balance / LAMPORTS_PER_SOL; // Convert lamports to SOL
    },
    enabled: !!isConnected && !!address && !!connection, // Only fetch when connected
    refetchOnWindowFocus: true, // Refetch when window is focused
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  const handleLogout = async () => {
    try {
      await disconnect();
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(`Logout failed: ${error.message}`);
    }
  };

  useEffect(() => {
    if (isConnected) {
      toast.success(`Wallet connected successfully!`);
    }
  }, [isConnected, address]);

  return (
    <nav className="bg-dark-bg overflow-x-hidden p-4">
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
            <div className="flex flex-row gap-5">
              <div className="text-white">
                {isLoading ? (
                  <div className="text-white">Loading...</div>
                ) : isError ? (
                  <div className="text-red-500">Error fetching balance</div>
                ) : (
                  <div className=" flex flex-row justify-between gap-5 text-white">
                    <div>Balance: {balance} SOL</div>
                    <div>Address: {address}</div>
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
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
