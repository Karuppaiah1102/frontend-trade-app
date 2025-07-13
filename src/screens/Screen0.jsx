import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const Screen0 = () => {
  const navigate = useNavigate();
  const userId = "user_1751770330952";
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIndex, setOpenIndex] = useState({ plan: null, today: null, alert: null });
  const [todayUpdates, setTodayUpdates] = useState({});
  const [entryPriceInputs, setEntryPriceInputs] = useState({});
  const [exitPriceInputs, setExitPriceInputs] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      trades.forEach((trade, index) => {
        const update = generateTodayUpdate(trade);
        setTodayUpdates((prev) => ({ ...prev, [index]: update }));
      });
    }, 4 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [trades]);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const response = await API.get(`/trades/executed/${userId}`);
        const allTrades = response.data.trades || [];
        setTrades(allTrades.reverse());
      } catch (error) {
        console.error("❌ Error fetching trades:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrades();
  }, [userId]);

  const handleAddNew = () => navigate("/screen1");

  const handleDeleteTrade = async (index) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this plan?");
    if (!confirmDelete) return;
    try {
      const updatedTrades = [...trades];
      updatedTrades.splice(index, 1);
      await API.post("/trades/update", { userId, trades: updatedTrades });
      setTrades(updatedTrades);
      alert("✅ Trade deleted successfully.");
    } catch {
      alert("❌ Failed to delete. Try again.");
    }
  };

  const generateTodayUpdate = (trade) => {
    const base = trade.entryPrice || trade.avgBuyPrice || 450;
    const currentPrice = parseFloat((base + Math.random() * 15).toFixed(2));
    let recommendation = "Hold";

    if (!trade.entryPrice) {
      if (currentPrice >= trade.buyZone[0] && currentPrice <= trade.buyZone[1]) {
        recommendation = "✅ Buy Now — within Buy Zone";
      } else if (currentPrice > trade.buyZone[1]) {
        recommendation = "⚠️ Wait — price too high";
      } else if (currentPrice < trade.stopLoss) {
        recommendation = "⛔ Avoid — below Stop Loss";
      } else {
        recommendation = "👀 Watch — not ideal entry";
      }
    }

    return {
      currentPrice,
      rsi: Math.floor(Math.random() * 20 + 45),
      macdSignal: "Bullish",
      volumeStatus: "Stable",
      recommendation,
      updatedAt: new Date().toLocaleTimeString(),
    };
  };

  const getImmediateAlerts = (trade) => {
    const alerts = [];
    const entry = trade.entryPrice || trade.avgBuyPrice;
    const simulatedCurrent = entry - Math.random() * 10;
    if (simulatedCurrent <= trade.stopLoss + 1) {
      alerts.push({
        level: "🔴 Risk Alert",
        message: `Current price ₹${simulatedCurrent.toFixed(2)} near Stop Loss ₹${trade.stopLoss}`,
      });
    }
    return alerts;
  };

  const handleEntryPriceUpdate = async (index) => {
    const entryPrice = parseFloat(entryPriceInputs[index]);
    if (isNaN(entryPrice)) return alert("Enter a valid entry price");
    const updatedTrades = [...trades];
    updatedTrades[index].entryPrice = entryPrice;
    try {
      await API.post("/trades/update", { userId, trades: updatedTrades });
      setTrades(updatedTrades);
      alert("✅ Entry price saved.");
    } catch {
      alert("❌ Failed to save entry price.");
    }
  };

  const handleExitPriceUpdate = async (index) => {
    const exitPrice = parseFloat(exitPriceInputs[index]);
    if (isNaN(exitPrice)) return alert("Enter a valid exit price");
    const updatedTrades = [...trades];
    updatedTrades[index].exitPrice = exitPrice;
    try {
      await API.post("/trades/update", { userId, trades: updatedTrades });
      setTrades(updatedTrades);
      alert("✅ Exit price saved.");
    } catch {
      alert("❌ Failed to save exit price.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <button onClick={handleAddNew} className="bg-blue-600 text-white px-4 py-2 rounded">
          ➕ Add New Trade
        </button>
      </div>
      <h2 className="text-2xl font-bold mb-4">📁 Executed Trades</h2>

      {loading ? (
        <p>Loading executed trades...</p>
      ) : trades.length === 0 ? (
        <p>No trades executed yet.</p>
      ) : (
        <div className="space-y-4">
          {trades.map((trade, index) => {
            const { name = "N/A", symbol = "N/A", tradeType = "N/A", target, stopLoss, executedAt, entryPrice, exitPrice } = trade;
            const date = executedAt ? new Date(executedAt).toLocaleDateString("en-GB") : "N/A";
            const today = todayUpdates[index] || generateTodayUpdate(trade);
            const alerts = getImmediateAlerts(trade);

            const capitalInvested = trade.avgBuyPrice * trade.shares;
            const profit = exitPrice && entryPrice ? ((exitPrice - entryPrice) * trade.shares).toFixed(2) : null;

            return (
              <div key={index} className="border rounded p-4 shadow bg-white">
                <p className="text-lg font-semibold">📈 {name} ({symbol})</p>
                <p className="text-sm text-gray-600">🧠 {tradeType}</p>
                <p className="mt-1">🎯 Target: ₹{target ?? "N/A"} | 🛡️ Stop Loss: ₹{stopLoss ?? "N/A"}</p>
                <p className="text-sm text-gray-500">📅 Executed: {date}</p>

                <div className="flex gap-3 mt-3 flex-wrap">
                  <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={() => setOpenIndex({ plan: openIndex.plan === index ? null : index, today: null, alert: null })}>📄 Executed Plan</button>
                  <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={() => setOpenIndex({ today: openIndex.today === index ? null : index, plan: null, alert: null })} disabled={!!exitPrice}>📊 Today Updates</button>
                  <button className={`${alerts.length > 0 && !exitPrice ? "bg-red-500" : "bg-gray-400"} text-white px-3 py-1 rounded`} onClick={() => setOpenIndex({ alert: openIndex.alert === index ? null : index, plan: null, today: null })} disabled={alerts.length === 0 || !!exitPrice}>⚠️ Immediate Alerts</button>
                  <button className="bg-gray-700 text-white px-3 py-1 rounded" onClick={() => handleDeleteTrade(index)}>🗑️ Delete Plan</button>
                </div>

                {openIndex.plan === index && (
                  <div className="mt-4 bg-gray-100 p-4 rounded border text-sm">
                    <p><strong>📈 {name}</strong> ({symbol})</p>
                    <p>🧠 Trade Type: {tradeType}</p>
                    <p>📍 Buy Zone: ₹{trade.buyZone?.[0]}–₹{trade.buyZone?.[1]}</p>
                    <p>🎯 Target Price: ₹{target}</p>
                    <p>🛡️ Stop Loss: ₹{stopLoss}</p>
                    <p>⏳ Expected Time: {trade.expectedTime}</p>
                    <p>💰 Capital: ₹{trade.capital}</p>
                    <p>📉 Avg Buy Price: ₹{trade.avgBuyPrice}</p>
                    <p>🔢 Shares: {trade.shares}</p>
                    <p>🧾 Total Buy: ₹{trade.totalBuyValue}</p>
                    <p>📉 Risk: ₹{trade.totalRisk}</p>
                    <p>📈 Profit: ₹{trade.potentialProfit}</p>
                    <p>📊 Reward/Risk: {trade.rrRatio} {trade.isSafe ? "✅ Safe" : "⚠️ Risky"}</p>
                    <hr className="my-2" />
                    <p>✍️ Entry Price: {entryPrice ? `₹${entryPrice}` : "Not Set"}</p>
                    {!entryPrice && (
                      <div className="flex gap-2 items-center mt-2">
                        <input
                          type="number"
                          placeholder="Enter entry price"
                          value={entryPriceInputs[index] || ""}
                          onChange={(e) => setEntryPriceInputs({ ...entryPriceInputs, [index]: e.target.value })}
                          className="px-2 py-1 border rounded"
                        />
                        <button onClick={() => handleEntryPriceUpdate(index)} className="bg-indigo-600 text-white px-2 py-1 rounded">Save</button>
                      </div>
                    )}
                    {entryPrice && !exitPrice && (
                      <div className="mt-2">
                        <p>🏁 Exit Price: Not Set</p>
                        <div className="flex gap-2 mt-2 items-center">
                          <input
                            type="number"
                            placeholder="Enter exit price"
                            value={exitPriceInputs[index] || ""}
                            onChange={(e) => setExitPriceInputs({ ...exitPriceInputs, [index]: e.target.value })}
                            className="px-2 py-1 border rounded"
                          />
                          <button onClick={() => handleExitPriceUpdate(index)} className="bg-red-600 text-white px-2 py-1 rounded">Close Trade</button>
                        </div>
                      </div>
                    )}
                    {exitPrice && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-400 rounded text-sm">
                        <p className="font-semibold text-green-700">✅ Trade Closed</p>
                        <p>Entry: ₹{entryPrice} → Exit: ₹{exitPrice}</p>
                        <p>Invested Capital: ₹{capitalInvested.toFixed(2)}</p>
                        <p>Profit: ₹{profit}</p>
                      </div>
                    )}
                  </div>
                )}

                {openIndex.today === index && !exitPrice && (
                  <div className="mt-4 bg-blue-50 p-4 rounded border text-sm">
                    <h4 className="font-semibold">📊 Today’s Update</h4>
                    <p>🔎 Current Price: ₹{today.currentPrice}</p>
                    <p>📈 RSI: {today.rsi}</p>
                    <p>📉 MACD: {today.macdSignal}</p>
                    <p>📊 Volume: {today.volumeStatus}</p>
                    <p>✅ Advice: <strong>{today.recommendation}</strong></p>
                    <p className="text-xs text-gray-400">Last updated at: {today.updatedAt}</p>
                  </div>
                )}

                {openIndex.alert === index && alerts.length > 0 && !exitPrice && (
                  <div className="mt-4 bg-red-50 border border-red-300 rounded p-3 text-sm space-y-2">
                    {alerts.map((alert, i) => (
                      <div key={i}>
                        <p className="font-semibold text-red-700">{alert.level}</p>
                        <p className="text-red-600">{alert.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Screen0;
