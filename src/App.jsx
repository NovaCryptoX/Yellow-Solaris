import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import { supabase } from "./supabaseClient";
import Admin from "./pages/Admin";

function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    // Admin login
    if (email === "frankmorrison000000001@gmail.com" && password === "JOKER123") {
      setUser({ email, role: "admin" });
      localStorage.setItem("user", JSON.stringify({ email, role: "admin" }));
      return;
    }

    // Regular user login or signup
    const { data: existingUser, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") {
      setErrorMsg("Something went wrong!");
      return;
    }

    if (!existingUser) {
      // Create user with 0 balance
      const { error: insertError } = await supabase
        .from("users")
        .insert([{ email, balance: 0 }]);
      if (insertError) {
        setErrorMsg("Error creating account!");
        return;
      }
    }

    setUser({ email, role: "user" });
    localStorage.setItem("user", JSON.stringify({ email, role: "user" }));
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-4">NovaCryptoX Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            className="border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
        {errorMsg && <p className="text-red-600 mt-2 text-sm">{errorMsg}</p>}
      </div>
    </div>
  );
}

function Dashboard({ user, setUser }) {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    async function fetchBalance() {
      const { data } = await supabase
        .from("users")
        .select("balance")
        .eq("email", user.email)
        .single();
      if (data) setBalance(data.balance);
    }
    if (user?.role === "user") fetchBalance();
  }, [user]);

  function logout() {
    setUser(null);
    localStorage.removeItem("user");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.email}</h1>
        <p className="text-lg mb-2">
          <strong>Balance:</strong>{" "}
          <span className="text-green-600 font-semibold">
            P{Number(balance).toLocaleString("en-BW")}
          </span>
        </p>
        <button
          onClick={logout}
          className="bg-red-600 text-white mt-4 px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  return (
    <Router>
      <Routes>
        {!user ? (
          <Route path="*" element={<Login setUser={setUser} />} />
        ) : user.role === "admin" ? (
          <>
            <Route path="/" element={<Navigate to="/admin" />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<Dashboard user={user} setUser={setUser} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
