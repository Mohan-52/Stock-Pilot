import AppRoutes from "./app/routes";

import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import RegisterPage from "./features/auth/pages/RegisterPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
