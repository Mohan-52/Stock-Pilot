import AppRoutes from "./app/routes";
import { UserProvider } from "./contexts/UserContext";
import { StockStoreProvider } from "./contexts/StockStoreContext";
import { ToastProvider } from "./components/ToastProvider";
import "./App.css";

function App() {
  return (
    <UserProvider>
      <ToastProvider>
        <StockStoreProvider>
          <AppRoutes />
        </StockStoreProvider>
      </ToastProvider>
    </UserProvider>
  );
}

export default App;
