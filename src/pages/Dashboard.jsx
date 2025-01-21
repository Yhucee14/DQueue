import { useEffect, useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { fetchQueueData, joinQueue } from "../solanaUtils";

const Dashboard = () => {
  const { isConnected, address } = useAppKitAccount();
  const [queueData, setQueueData] = useState(null);
  const [isJoined, setIsJoined] = useState(false);

  // Fetch queue data when wallet is connected
  useEffect(() => {
    if (isConnected && address) {
      fetchQueueData(address, setQueueData);
    }
  }, [isConnected, address]);

  const handleJoinQueue = async () => {
    if (isConnected && address) {
      const success = await joinQueue(address);
      if (success) {
        setIsJoined(true);
        fetchQueueData(address, setQueueData); // Fetch updated queue data
      }
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-black">Queue Dashboard</h1>
      {isConnected ? (
        <div className="text-black mt-4">
          {queueData ? (
            <div>
              <p>Your current queue position: {queueData.position}</p>
              {isJoined ? (
                <p className="text-green-500">You are in the queue!</p>
              ) : (
                <button
                  onClick={handleJoinQueue}
                  className="bg-blue-500 text-black p-2 mt-4 rounded"
                >
                  Join Queue
                </button>
              )}
            </div>
          ) : (
            <p>Loading queue data...</p>
          )}
        </div>
      ) : (
        <p className="text-black">
          Please connect your wallet to see the queue.
        </p>
      )}
    </div>
  );
};

export default Dashboard;
