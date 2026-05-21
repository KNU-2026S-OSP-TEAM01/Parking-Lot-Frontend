import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/login/login";
import MainPage from "./pages/main/main";
import RegisterPage from "./pages/register/register";
import SelectParkingLotPage from "./pages/select/select";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route path="/select" element={<SelectParkingLotPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
