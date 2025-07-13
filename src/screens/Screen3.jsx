import { useTrade } from "../context/TradeContext";
import { useNavigate } from "react-router-dom";
import { saveExecutedTrade } from "../api";
import { useState, useEffect } from "react";

const Screen3 = () => {
  const navigate = useNavigate();
  const { selectedStock, tradeInput, userId: contextUserId } = useTrade();
  const [saving, setSaving] = useState(false);
  const [effectiveUserId, setEffectiveUserId] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("userId");
    setEffectiveUserId(contextUserId || stored);
  }, [contextUserId]);

  if (!selectedStock || !tradeInput.capital) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <p className="text-red-500">
          No stock selected or capital missing. Go back and try again.
        </p>
        <button
          onClick={() => navigate("/screen2")}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
        >
          ◀ Back to Suggestions
        </button>
      </div>
    );
  }

  const safe = (val, fallback) =>
    val !== undefined && val !== null && val !== "" ? val : fallback;

  const name = safe(selectedStock.name, "N/A");
  const symbol = safe(selectedStock.symbol, "N/A");

  // ✅ FIXED: Auto-detect trade type correctly
  const tradeType = selectedStock.tradeType || tradeInput.tradeType || "Swing Trade";

  const target = Number(safe(selectedStock.target, 493));
  const stopLoss = Number(safe(selectedStock.stopLoss, 439));
  const timeToTarget = safe(selectedStock.timeToTarget, "3–6 days");
  const buyZone = Array.isArray(selectedStock.buyZone)
    ? selectedStock.buyZone.map(Number)
    : [445, 450];
  const avgBuyPrice = Number(safe(selectedStock.avgBuyPrice, 448));
  const capital = Number(tradeInput.capital);

  const shares = Math.floor(capital / avgBuyPrice);
  const totalBuyValue = shares * avgBuyPrice;
  const totalRisk = (avgBuyPrice - stopLoss) * shares;
  const potentialProfit = (target - avgBuyPrice) * shares;
  const rrRatio = totalRisk > 0 ? (potentialProfit / totalRisk).toFixed(2) : "N/A";
  const isSafe = totalRisk <= 250 && parseFloat(rrRatio) >= 2;

  const fullMessage = `
📢 TODAY’S TRADE: ${name}

🧠 Trade Type: ${tradeType}
🗓️ ${new Date().toLocaleDateString("en-GB")}

🎯 Target: ₹${target}
🛡️ Stop Loss: ₹${stopLoss}
💰 Capital: ₹${capital}

Buy Zone: ₹${buyZone[0]}–₹${buyZone[1]}
Avg Buy Price: ₹${avgBuyPrice}
Shares to Buy: ${shares}
Total Risk: ₹${totalRisk.toFixed(2)}
Potential Profit: ₹${potentialProfit}
Reward-to-Risk: ${rrRatio}
Safe: ${isSafe ? "✅" : "⚠️"}
`.trim();

  const handleExecute = async () => {
    setSaving(true);

    if (!effectiveUserId) {
      alert("User not logged in. Please restart the app.");
      setSaving(false);
      return;
    }

    const trade = {
      name,
      symbol,
      tradeType,
      buyZone,
      target,
      stopLoss,
      timeToTarget,
      avgBuyPrice,
      capital,
      shares,
      totalBuyValue,
      totalRisk,
      potentialProfit,
      rrRatio,
      isSafe,
      fullMessage,
      executedAt: new Date().toISOString(),
    };

    try {
      const res = await saveExecutedTrade({ userId: effectiveUserId, trade });
      console.log("✅ Trade saved:", res.data);
      alert("✅ Trade marked as executed!");
      navigate("/screen0");
    } catch (err) {
      console.error("❌ Error saving trade:", err.response?.data || err.message || err);
      alert("❌ Failed to save trade.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">📢 TODAY’S TRADE: {name}</h2>

      <p className="mb-2">🧠 <strong>Trade Type:</strong> {tradeType}</p>
      <p className="mb-2">📍 <strong>Buy Zone:</strong> ₹{buyZone[0]}–₹{buyZone[1]}</p>
      <p className="mb-2">🎯 <strong>Target Price:</strong> ₹{target}</p>
      <p className="mb-2">🛡️ <strong>Stop Loss:</strong> ₹{stopLoss}</p>
      <p className="mb-4">⏳ <strong>Expected Time:</strong> {timeToTarget}</p>

      <hr className="my-4" />

      <h3 className="text-lg font-semibold mb-2">📊 Calculated Quantity & Risk:</h3>
      <p>Buy Price: ₹{avgBuyPrice}</p>
      <p>Shares to Buy: {shares}</p>
      <p>Total Buy Value: ₹{totalBuyValue}</p>
      <p>Total Risk: ₹{totalRisk.toFixed(2)}</p>
      <p>Potential Profit: ₹{potentialProfit}</p>
      <p>
        Reward-to-Risk Ratio: {rrRatio}{" "}
        {isSafe ? (
          <span className="text-green-600">✅ Safe</span>
        ) : (
          <span className="text-red-500">⚠️ Risky</span>
        )}
      </p>

      <hr className="my-4" />

      <p className="mt-4 text-gray-700">
        💡 <strong>Beginner Tip:</strong> Always look for trades with reward at least 2× risk. This trade is{" "}
        {isSafe ? "safe" : "risky"} based on your ₹{capital} capital.
      </p>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => navigate("/screen2")}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          ◀ Previous
        </button>
        <button
          onClick={handleExecute}
          disabled={saving}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          ✅ {saving ? "Saving..." : "Mark as Executed"}
        </button>
      </div>
    </div>
  );
};

export default Screen3;
