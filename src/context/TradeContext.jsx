import React, { createContext, useContext, useState } from "react";

const TradeContext = createContext();

export const TradeProvider = ({ children }) => {
  // ✅ Function to get or create a user ID (used for login-free mode)
  const getUserId = () => {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = "user_" + Date.now();
      localStorage.setItem("userId", userId);
    }
    return userId;
  };

  // ✅ Set up context states
  const [userId, setUserId] = useState(getUserId());
  const [tradeInput, setTradeInput] = useState({});
  const [tradeType, setTradeType] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedTrade, setSelectedTrade] = useState(null); // For viewing trade detail in Screen0 → Screen3

  return (
    <TradeContext.Provider
      value={{
        userId,
        setUserId,
        tradeInput,
        setTradeInput,
        tradeType,
        setTradeType,
        selectedStock,
        setSelectedStock,
        selectedTrade,
        setSelectedTrade,
      }}
    >
      {children}
    </TradeContext.Provider>
  );
};

// ✅ Custom hook to use the context in other files
export const useTrade = () => useContext(TradeContext);
