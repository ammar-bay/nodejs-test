import { Route, Routes } from "react-router-dom";
import PersistLogin from "./components/authentication/PersistLogin";
import RequireAuth from "./components/authentication/RequireAuth";
import Login from "./pages/Login";
import Missing from "./pages/Missing";
import Register from "./pages/Register";
import Stock from "./pages/Stock";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<PersistLogin />}>
        <Route element={<RequireAuth />}>
          <Route path="/" element={<Stock />} />
        </Route>
      </Route>
      {/* Catch all */}
      <Route path="*" element={<Missing />} />
    </Routes>
  );
}

export default App;
