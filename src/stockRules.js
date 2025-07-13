// src/logic/stockRules.js

export const getRuleBasedSuggestions = (tradeInput, tradeType) => {
  const { capital, target, stopLoss, timeframe, timeframeUnit } = tradeInput;

  const allStocks = [
    {
      symbol: "JWL",
      name: "Jupiter Wagons Ltd",
      expectedProfit: 10,
      risk: 4,
      timeToTarget: "3–6 days",
    },
    {
      symbol: "TATA",
      name: "Tata Motors",
      expectedProfit: 12,
      risk: 5,
      timeToTarget: "4–7 days",
    },
    {
      symbol: "INFY",
      name: "Infosys",
      expectedProfit: 8,
      risk: 3,
      timeToTarget: "2–4 days",
    },
    {
      symbol: "LT",
      name: "Larsen & Toubro",
      expectedProfit: 9,
      risk: 4,
      timeToTarget: "5–9 days",
    },
    {
      symbol: "SBIN",
      name: "State Bank of India",
      expectedProfit: 11,
      risk: 5,
      timeToTarget: "4–8 days",
    },
  ];

  // Convert timeframe to days if months selected
  const userDays = timeframeUnit === "Months" ? timeframe * 30 : timeframe;

  // Apply simple rule logic
  const filtered = allStocks.filter((stock) => {
    return (
      stock.expectedProfit >= target &&
      stock.risk <= stopLoss &&
      estimateDays(stock.timeToTarget) <= userDays
    );
  });

  // Add tradeType to each stock
  const final = filtered.map((s) => ({
    ...s,
    tradeType: tradeType || "Swing Trade",
  }));

  return final;
};

// Helper to estimate days from a string like "3–6 days"
const estimateDays = (rangeStr) => {
  const match = rangeStr.match(/(\d+)[–-](\d+)/);
  if (!match) return 999;
  const avg = (parseInt(match[1]) + parseInt(match[2])) / 2;
  return avg;
};
