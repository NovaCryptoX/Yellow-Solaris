import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ user, setUser }) {
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUserBalance() {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("balance")
          .eq("email", user.email)
          .single();

        if (error) throw error;
        if (data) setBalance(data.balance);
      } catch (error) {
        console.error("Error fetching balance:", error.message);
      } finally {
        setLoading(false);
      }
    }

    if (user) fetchUserBalance();
  }, [user]);

  async function handleLogout() {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-900 to-yellow-600 flex flex-col items-center justify-center text-white">
      <div className="bg-black bg-opacity-40 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4 text-yellow-300">Yellow Solaris</h1>
        <h2 className="text-lg mb-4">Welcome, {user.email}</h2>

        {loading ? (
          <p className="text-gray-300">Loading balance...</p>
        ) : (
          <p className="text-2xl font-semibold mb-4">
            Balance: <span className="text-yellow-300">P{Number(balance).toLocaleString("en-BW")}</span>
          </p>
        )}

        <button
          onClick={handleLogout}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-6 py-2 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>

      <footer className="mt-6 text-sm text-gray-300">
        © {new Date().getFullYear()} Yellow Solaris. All rights reserved.
      </footer>
    </div>
  );
}
