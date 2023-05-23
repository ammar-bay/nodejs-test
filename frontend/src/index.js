import React from "react";
import ReactDOM from "react-dom";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthProvider";
import { DataProvider } from "./context/DataProvider";
import "./index.css";

ReactDOM.render(
  // <React.StrictMode>
  <BrowserRouter>
    <AuthProvider>
      <DataProvider>
        <Toaster />
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </DataProvider>
    </AuthProvider>
  </BrowserRouter>,
  // </React.StrictMode>,
  document.getElementById("root")
);
