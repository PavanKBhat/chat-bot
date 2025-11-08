import { useState } from "react";
import Login from "./pages/login";
import ChatLayout from "./pages/chatLayout";

function App() {
  const [user, setUser] = useState<string | null>(localStorage.getItem("user"));

  const handleLogin = (name: string) => {
    setUser(name);
    localStorage.setItem("user", name);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleGoToLogin = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  if (!user || !localStorage.getItem('token')) return <Login onLogin={handleLogin} />;

  return <ChatLayout user={user} onLogout={handleLogout} onLogin={handleGoToLogin} />;
}

export default App;
