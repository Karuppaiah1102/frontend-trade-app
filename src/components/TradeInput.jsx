import React, { useState } from "react";
import API from "../api"; // uses your configured base URL

function TradeInput({ onLoginSuccess }) {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const res = await API.post("/api/login", { userId });
      onLoginSuccess(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Login error:", err.message);
      setError("Login failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="p-5 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">🚀 Welcome to Trade App</h2>

      <input
        type="text"
        placeholder="Enter your User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        className="w-full p-3 mb-4 border rounded text-base"
      />

      <button
        onClick={handleLogin}
        disabled={loading}
        className="w-full bg-blue-600 text-white p-3 rounded disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login / Continue"}
      </button>

      {error && <p className="text-red-600 mt-3">{error}</p>}
    </div>
  );
}

export default TradeInput;
