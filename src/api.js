import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5003/api",
});

// 🔑 Create/Login user
export const loginUser = (userId) =>
  API.post("/login", { userId });

// 📈 Stock suggestions based on inputs
export const getSuggestions = (payload) =>
  API.post("/stocks/suggestions", payload);

// ✅ Save executed trade (with debug log)
export const saveExecutedTrade = (payload) => {
  console.log("📤 Sending payload to backend:", JSON.stringify(payload, null, 2));
  return API.post("/trades/execute", payload);
};

// ✅ Fetch all executed trades
export const fetchExecutedTrades = (userId) =>
  API.get(`/trades/executed/${userId}`); // ✅ FIXED endpoint

// 🔁 Get live market updates
export const getMarketAnalysis = (userId) =>
  API.get(`/market-analysis/${userId}`);

// ⚠️ Get urgent alerts
export const getImmediateAlerts = (userId) =>
  API.get(`/immediate-alerts/${userId}`);

export default API;
