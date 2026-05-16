import AppRoutes from "./app/routes";
import { UserProvider } from "./contexts/UserContext";
import "./App.css";

function App() {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
}

export default App;
