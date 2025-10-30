import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-900 to-yellow-700 text-white">
      <div className="bg-black bg-opacity-40 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6 text-yellow-300">Yellow Solaris</h1>
        <h2 className="text-lg mb-4">Sign in to your account</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email address"
            className="px-4 py-2 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-2 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded-lg transition-colors"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mt-4">
          <p className="text-gray-300">Don't have an account?</p>
          <button
            onClick={() => navigate("/signup")}
            className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-6 py-2 rounded-lg transition-colors"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}
