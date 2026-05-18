import AppRoutes from "./app/routes";
import { UserProvider } from "./contexts/UserContext";
import { ToastProvider } from "./components/ToastProvider";
import "./App.css";

function App() {
  return (
    <UserProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </UserProvider>
  );
}

export default App;
