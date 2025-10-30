import { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Your EmailJS credentials
  const serviceId = "service_dgi4qmd";
  const templateId = "template_tzznx69";
  const publicKey = "fZ_0NZJ_EbvPkNe2S";

  async function handleSignup(e) {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    // Send email verification message
    try {
      await emailjs.send(serviceId, templateId, {
        to_email: email,
        message: `Welcome to Yellow Solaris! Please verify your account using the link sent to your email.`,
      }, publicKey);

      setMessage("Signup successful! A verification email has been sent to your inbox.");
    } catch (err) {
      console.error("EmailJS error:", err);
      setMessage("Signup succeeded, but failed to send verification email.");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-900 to-yellow-700 text-white">
      <div className="bg-black bg-opacity-40 backdrop-blur-sm p-8 rounded-2xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6 text-yellow-300">Yellow Solaris</h1>
        <h2 className="text-lg mb-4">Create a new account</h2>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
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
          <input
            type="password"
            placeholder="Confirm password"
            className="px-4 py-2 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {message && <p className="text-yellow-300 text-sm">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-2 rounded-lg transition-colors"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-4">
          <p className="text-gray-300">Already have an account?</p>
          <button
            onClick={() => navigate("/")}
            className="mt-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold px-6 py-2 rounded-lg transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
