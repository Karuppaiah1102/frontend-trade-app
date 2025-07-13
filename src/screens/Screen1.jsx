// src/screens/Screen1.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTrade } from "../context/TradeContext";

const Screen1 = () => {
  const navigate = useNavigate();
  const { setTradeInput, setTradeType } = useTrade();

  const [capital, setCapital] = useState("");
  const [profit, setProfit] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [unit, setUnit] = useState("day");
  const [error, setError] = useState("");

  const detectTradeType = () => {
    const days = unit === "month" ? timeframe * 30 : Number(timeframe);
    if (days <= 1) return "Intraday Trade";
    if (days <= 15) return "Swing Trade";
    return "Positional Trade";
  };

  const tradeType = detectTradeType();

  useEffect(() => {
    setTradeType(tradeType);
  }, [capital, profit, stopLoss, timeframe, unit, setTradeType]);

  const handleNext = () => {
    if (!capital || !profit || !stopLoss || !timeframe) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setTradeInput({ capital, profit, stopLoss, timeframe, unit });
    navigate("/screen2");
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">📋 Trade Setup</h2>

      <div className="space-y-4">
        <div>
          <label>Capital (₹)</label>
          <input
            type="number"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Target Profit (%)</label>
          <input
            type="number"
            value={profit}
            onChange={(e) => setProfit(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Stop Loss (%)</label>
          <input
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label>Timeframe</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="flex-1 border p-2 rounded"
            />
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="day">Days</option>
              <option value="month">Months</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-green-600 font-medium">
            🧠 Detected Trade Type: <strong>{tradeType}</strong>
          </p>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        <div className="flex justify-between mt-6">
          <button
            onClick={() => navigate("/screen0")}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            ◀ Previous
          </button>

          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Next ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default Screen1;
