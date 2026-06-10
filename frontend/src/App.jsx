import AppRoutes from "./app/routes";
import { UserProvider } from "./contexts/UserContext";
import { StockStoreProvider } from "./contexts/StockStoreContext";
import { ToastProvider } from "./components/ToastProvider";
import { NotificationProvider } from "./features/notifications/context/NotificationContext";
import "./App.css";

function App() {
  return (
    <UserProvider>
      <ToastProvider>
        <NotificationProvider>
          <StockStoreProvider>
            <AppRoutes />
          </StockStoreProvider>
        </NotificationProvider>
      </ToastProvider>
    </UserProvider>
  );
}

export default App;
