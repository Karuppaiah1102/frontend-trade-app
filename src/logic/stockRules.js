// ✅ SAMPLE DATABASE — add more real stocks later
const stockDatabase = [
  {
    symbol: "JWL",
    name: "Jupiter Wagons Ltd",
    expectedProfit: 12,
    risk: 4.5,
    timeToTarget: "5–7 days",
    type: "Swing Trade",
  },
  {
    symbol: "RVNL",
    name: "Rail Vikas Nigam",
    expectedProfit: 18,
    risk: 6,
    timeToTarget: "4–6 days",
    type: "Swing Trade",
  },
  {
    symbol: "BEL",
    name: "Bharat Electronics",
    expectedProfit: 10,
    risk: 3.5,
    timeToTarget: "7–10 days",
    type: "Swing Trade",
  },
  {
    symbol: "TATAPOWER",
    name: "Tata Power",
    expectedProfit: 15,
    risk: 5,
    timeToTarget: "5–8 days",
    type: "Swing Trade",
  },
  {
    symbol: "BSOFT",
    name: "Birlasoft",
    expectedProfit: 22,
    risk: 6,
    timeToTarget: "8–12 days",
    type: "Swing Trade",
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank",
    expectedProfit: 6,
    risk: 2.5,
    timeToTarget: "12–18 days",
    type: "Positional Trade",
  },
  {
    symbol: "LT",
    name: "Larsen & Toubro",
    expectedProfit: 5.2,
    risk: 1.8,
    timeToTarget: "1 day",
    type: "Intraday Trade",
  },
];

export function getRuleBasedSuggestions(input, tradeType = "Swing Trade") {
  console.log("🔍 INPUT RECEIVED FOR SUGGESTION:", input, tradeType);

  const capital = parseFloat(input.capital);
  const profit = parseFloat(input.profit || input.targetProfit);
  const stopLoss = parseFloat(input.stopLoss);
  const timeframe = parseFloat(input.timeframe);

  if (
    isNaN(capital) ||
    isNaN(profit) ||
    isNaN(stopLoss) ||
    isNaN(timeframe)
  ) {
    console.warn("⚠️ Missing or invalid input data", {
      capital,
      profit,
      stopLoss,
      timeframe,
    });
    return [];
  }

  const filtered = stockDatabase.filter((stock) => {
    return (
      stock.risk <= stopLoss &&
      stock.expectedProfit >= profit &&
      stock.type === tradeType
    );
  });

  const suggestions =
    filtered.length >= 5
      ? filtered.slice(0, 5)
      : [...filtered, ...stockDatabase]
          .sort((a, b) => b.expectedProfit - a.expectedProfit)
          .slice(0, 5);

  return suggestions;
}
