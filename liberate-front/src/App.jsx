import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import ForgotPassword from "./pages/auth/forgot_password";
import StressTest from "./pages/stress/stress_test";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirige la raíz al login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Rutas de autenticación */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot_password" element={<ForgotPassword />} />
        <Route path="/stress_test" element={<StressTest />} />


        {/* TODO: agregar rutas protegidas del dashboard, test y citas */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;