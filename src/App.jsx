// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Screen0 from "./screens/Screen0";
import Screen1 from "./screens/Screen1";
import Screen2 from "./screens/Screen2";
import Screen3 from "./screens/Screen3";
import Login from "./screens/Login";
import Register from "./screens/Register";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Screen0 />
            </PrivateRoute>
          }
        />
        <Route
          path="/screen0"
          element={
            <PrivateRoute>
              <Screen0 />
            </PrivateRoute>
          }
        />
        <Route
          path="/screen1"
          element={
            <PrivateRoute>
              <Screen1 />
            </PrivateRoute>
          }
        />
        <Route
          path="/screen2"
          element={
            <PrivateRoute>
              <Screen2 />
            </PrivateRoute>
          }
        />
        <Route
          path="/screen3"
          element={
            <PrivateRoute>
              <Screen3 />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
