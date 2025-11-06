import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { loginUser, registerUser } from "../api/authApi"; // ✅ added import

interface LoginProps {
  onLogin: (name: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleContinue = async () => {
  try {
    setLoading(true);
    setError("");

    let res;

    if (tab === "signup") {
      if (!email || !username || !password) {
        setError("Please fill all fields");
        setLoading(false);
        return;
      }
      res = await registerUser({ username, email, password });
    } else {
      if (!username || !password) {
        setError("Please enter username and password");
        setLoading(false);
        return;
      }
      res = await loginUser({ username, password });
    }

    // ✅ Store safely only if token exists
    const user = res.user?.username || username;
    if (res.tokens?.access) {
      localStorage.setItem("token", res.tokens.access);
    }
    localStorage.setItem("user", user);

    onLogin(user);
  } catch (err) {
    console.error(err);
    setError(tab === "signup" ? "Registration failed" : "Invalid credentials");
  } finally {
    setLoading(false);
  }
};

  const handleCancel = () => {
    setEmail("");
    setUsername("");
    setPassword("");
    setError("");
  };

  const handleSkip = () => {
    localStorage.setItem("user", "Guest");
    onLogin("Guest");
  };

  const handleGoogleLogin = () => {
    alert("Google Sign-In clicked — integrate Firebase or OAuth2 here");
    localStorage.setItem("user", "GoogleUser");
    onLogin("GoogleUser");
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Welcome to AI Chat Portal
        </h2>

        {/* Tabs */}
        <div className="flex mb-6 border-b">
          <button
            className={`flex-1 py-2 font-medium ${
              tab === "signin"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
            onClick={() => setTab("signin")}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-2 font-medium ${
              tab === "signup"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-blue-600"
            }`}
            onClick={() => setTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {tab === "signup" && (
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border w-full p-2 rounded"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              placeholder="Your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border w-full p-2 rounded text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border w-full p-2 rounded text-white"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleCancel}
            className="border border-gray-300 text-gray-600 px-4 py-2 rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleContinue}
            disabled={loading}
            className={`${
              loading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white px-4 py-2 rounded`}
          >
            {loading
              ? "Processing..."
              : tab === "signup"
              ? "Register"
              : "Continue"}
          </button>
        </div>

        {/* Google Login */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="text-gray-500 text-sm">or</div>
          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 border border-gray-300 rounded w-full py-2 hover:bg-gray-100"
          >
            <FcGoogle className="text-xl" />
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Skip / Guest */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <button onClick={handleSkip} className="text-blue-600 hover:underline">
            Skip login → Start as Guest
          </button>
        </div>
      </div>

      {/* Back button */}
      <button
        onClick={() => onLogin("Guest")}
        className="mt-4 text-gray-500 hover:text-blue-600 text-sm"
      >
        ← Back
      </button>
    </div>
  );
}
