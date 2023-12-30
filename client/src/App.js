import "./App.css";
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import CodeEditor from "./Pages/Editor";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
function App() {
  return (
    <BrowserRouter>
      <Routes>
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
