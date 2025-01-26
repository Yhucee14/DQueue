import { useEffect, useState } from "react";
import { fetchQueueData, joinQueue, upgradeToVIP } from "../solanaConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const [queueData, setQueueData] = useState(null);
  const [userPosition, setUserPosition] = useState(0);

  console.log("Program ID:", `${import.meta.env.VITE_PROJECT_ID}`);
  // Fetch queue data when component mounts or when address changes
  useEffect(() => {
    fetchQueueData();
  }, []);

  console.log(fetchQueueData);

  // Fetch queue data every minute
  useEffect(() => {
    const interval = setInterval(fetchQueueData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchQueueData = async () => {
    try {
      const data = await fetchQueueData();
      setQueueData(data);
      setUserPosition(data.user.position);
    } catch (error) {
      console.error("Error fetching queue data:", error);
      toast.error("Failed to fetch queue data");
    }
  };

  const upgradeToVIP = async () => {
    if (!queueData || userPosition === 0) return;

    try {
      await upgradeToVIP(queueData.address);
      toast.success("Upgraded to VIP successfully!");
      // Refresh queue data after upgrading
      fetchQueueData();
    } catch (error) {
      console.error("Error upgrading to VIP:", error);
      toast.error("Failed to upgrade to VIP");
    }
  };

  if (!queueData) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <h2 className="text-3xl font-bold mb-6">Queue Information</h2>
      <p className="mb-4">Total Users: {queueData.totalUsers}</p>
      <p className="mb-4">Current Position: {userPosition}</p>
      <h3 className="text-xl font-semibold mb-4">Queue:</h3>
      <ul className="list-disc list-inside space-y-2 mb-8">
        {queueData.users.map((user, index) => (
          <li key={index} className={`flex items-center`}>
            User {index + 1}: {user.name} (Position: {user.position})
            {user.vip_status ? " (VIP)" : ""}
          </li>
        ))}
      </ul>
      <button
        onClick={upgradeToVIP}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Upgrade to VIP
      </button>
    </div>
  );
};

export default Dashboard;
