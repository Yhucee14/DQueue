import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchQueueData, joinQueue, upgradeToVIP } from "../solanaConfig";
import { useAppKitAccount } from "@reown/appkit/react";
import { PublicKey } from "@solana/web3.js";

const Dashboard = () => {
  const { isConnected, address } = useAppKitAccount();

  const validateAddress = (address) => {
    try {
      const publicKey = new PublicKey(address);
      return PublicKey.isOnCurve(publicKey.toBytes());
    } catch (error) {
      console.error("Invalid public key:", error);
      return false;
    }
  };

  const {
    data: userPosition,
    isLoading: positionLoading,
    refetch,
    error: positionError,
  } = useQuery({
    queryKey: ["userPosition", address],
    queryFn: () => {
      console.log("Fetching user position...", address);
      if (!validateAddress(address)) {
        console.error("Invalid public key:", address);
        throw new Error("Invalid public key");
      }
      return fetchQueueData(address).catch((err) => {
        console.error("Error fetching queue data:", err);
        throw err;
      });
    },
    enabled: isConnected && Boolean(address),
    refetchOnWindowFocus: true,
  });

  // Handle joining the queue using useMutation
  const joinQueueMutation = useMutation({
    mutationFn: joinQueue,
    onSuccess: () => {
      console.log("Successfully joined queue");
      refetch();
    },
    onError: (error) => {
      console.error("Error joining queue:", error);
    },
  });

  // Handle upgrading to VIP using useMutation
  const upgradeToVIPMutation = useMutation({
    mutationFn: upgradeToVIP,
    onSuccess: () => {
      console.log("Successfully upgraded to VIP");
      refetch();
    },
    onError: (error) => {
      console.error("Error upgrading to VIP:", error);
    },
  });

  const handleUpgradeToVIP = () => {
    if (address) {
      upgradeToVIPMutation.mutate(address);
    }
  };

  const handleJoinQueue = () => {
    if (address) {
      joinQueueMutation.mutate(address);
    }
  };

  if (!isConnected) {
    return <div>Please connect your wallet</div>;
  }

  return (
    <div className="dashboard-container">
      <h2 className="text-black">Queue Dashboard</h2>
      {positionLoading ? (
        <div className="text-black">Loading...</div>
      ) : userPosition === null ? (
        <div className="text-black">
          <p>No queue position available.</p>
          <button
            onClick={handleJoinQueue}
            className="bg-green-500 text-black p-2 rounded mt-3"
            disabled={joinQueueMutation.isLoading}
          >
            {joinQueueMutation.isLoading ? "Joining..." : "Join Queue"}
          </button>
        </div>
      ) : (
        <div className="text-black">
          <div>Your position in the queue: {userPosition}</div>
          <div>
            <button
              onClick={handleUpgradeToVIP}
              className="bg-blue-500 text-white p-2 rounded mt-3"
              disabled={upgradeToVIPMutation.isLoading}
            >
              {upgradeToVIPMutation.isLoading
                ? "Upgrading..."
                : "Upgrade to VIP"}
            </button>
          </div>
        </div>
      )}
      {positionError && (
        <div className="text-red-500">{positionError.message}</div>
      )}
    </div>
  );
};

export default Dashboard;
