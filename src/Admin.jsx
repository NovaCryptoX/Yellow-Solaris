import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch all users and balances
  async function fetchUsers() {
    setLoading(true);
    const { data, error } = await supabase.from("users").select("*").order("id");
    if (error) console.error(error);
    else setUsers(data);
    setLoading(false);
  }

  // Update a user’s balance
  async function updateBalance(userId, newBalance) {
    const { error } = await supabase
      .from("users")
      .update({ balance: newBalance })
      .eq("id", userId);
    if (error) {
      console.error(error);
      setMessage("⚠️ Failed to update balance.");
    } else {
      setMessage("✅ Balance updated successfully!");
      fetchUsers();
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Admin Dashboard – Yellow Solaris
        </h1>

        {loading ? (
          <p className="text-center text-gray-600">Loading users...</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-3 border">User ID</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Balance (BWP)</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-3 border">{user.id}</td>
                  <td className="p-3 border">{user.email}</td>
                  <td className="p-3 border text-green-700 font-semibold">
                    P{Number(user.balance || 0).toLocaleString("en-BW")}
                  </td>
                  <td className="p-3 border">
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          updateBalance(user.id, Number(user.balance) + 100)
                        }
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        +100
                      </button>
                      <button
                        onClick={() =>
                          updateBalance(user.id, Math.max(0, Number(user.balance) - 100))
                        }
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        -100
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {message && (
          <p className="mt-4 text-center text-sm text-blue-700">{message}</p>
        )}
      </div>
    </div>
  );
} 
