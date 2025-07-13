import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTrade } from "../context/TradeContext";
import { getRuleBasedSuggestions } from "../logic/stockRules"; // ✅ Rule-based logic

const Screen2 = () => {
  const navigate = useNavigate();
  const { tradeInput, setSelectedStock, tradeType } = useTrade();

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!tradeInput.capital) {
      navigate("/screen1");
      return;
    }

    setLoading(true);
    try {
      const ruleBased = getRuleBasedSuggestions(tradeInput, tradeType);
      setSuggestions(ruleBased);
      setError("");
    } catch (err) {
      console.error("❌ Suggestion error:", err);
      setError("Failed to generate stock suggestions.");
    } finally {
      setLoading(false);
    }
  }, [tradeInput, tradeType, navigate]);

  const handleSelectStock = (stock) => {
    setSelectedStock(stock);
    navigate("/screen3");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">📈 Stock Suggestions</h2>

      {loading && <p>Loading suggestions...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && suggestions.length === 0 && !error && (
        <p className="text-gray-600">No suggestions found.</p>
      )}

      {suggestions.length > 0 && (
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2 text-left">Stock Name</th>
              <th className="border p-2 text-right">Expected Profit (%)</th>
              <th className="border p-2 text-right">Risk (%)</th>
              <th className="border p-2 text-right">Time to Target</th>
              <th className="border p-2 text-center">Trade Type</th>
            </tr>
          </thead>
          <tbody>
            {suggestions.map((stock) => (
              <tr
                key={stock.symbol}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => handleSelectStock(stock)}
              >
                <td className="border p-2">{stock.name}</td>
                <td className="border p-2 text-right">{stock.expectedProfit}</td>
                <td className="border p-2 text-right">{stock.risk}</td>
                <td className="border p-2 text-right">{stock.timeToTarget}</td>
                <td className="border p-2 text-center">{stock.tradeType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate("/screen1")}
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          ◀ Previous
        </button>
        <button
          onClick={() => suggestions.length > 0 && handleSelectStock(suggestions[0])}
          disabled={suggestions.length === 0}
          className={`px-4 py-2 rounded ${
            suggestions.length === 0
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-600 text-white"
          }`}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default Screen2;
