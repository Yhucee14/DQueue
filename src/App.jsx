import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useAppKitAccount } from "@reown/appkit/react"; // Import the connection hook
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import "./index.css";
import Dashboard from "./pages/Dashboard";

const App = () => {
  const { isConnected } = useAppKitAccount(); // Check connection status

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="p-6">
          <Routes>
            <Route
              path="/"
              element={isConnected ? <Navigate to="/dashboard" /> : <Home />}
            />

            <Route
              path="/dashboard"
              element={isConnected ? <Dashboard /> : <Navigate to="/" />}
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
