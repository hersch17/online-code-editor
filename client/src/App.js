import "./App.css";
import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import CodeEditor from "./Pages/Editor";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" />}
        />
        <Route
          path="/run"
          element={<CodeEditor />}
        />

        <Route
          path="/register"
          element={<Signup />}
        ></Route>
        <Route
          path="/login"
          element={<Login />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
