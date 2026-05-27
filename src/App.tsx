import type { ReactNode } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import LoginPage from "./pages/login/login";
import MainPage from "./pages/main/main";
import RegisterPage from "./pages/register/register";
import SelectParkingLotPage from "./pages/select/select";
import { getLoginPathWithRedirect } from "./services/api";

const RequireAuth = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const accessToken = sessionStorage.getItem("accessToken");

  if (!accessToken) {
    const redirectPath = `${location.pathname}${location.search}${location.hash}`;

    return (
      <Navigate to={getLoginPathWithRedirect(redirectPath)} replace />
    );
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <MainPage />
            </RequireAuth>
          }
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        <Route
          path="/select"
          element={
            <RequireAuth>
              <SelectParkingLotPage />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
