import React, { useState } from "react";
import emailjs from "@emailjs/browser";
import { supabase } from "../supabaseClient";

export default function Verify() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sentCode, setSentCode] = useState(null);
  const [status, setStatus] = useState("");

  // Generate a random 6-digit verification code
  const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

  // Send verification code via EmailJS
  const sendVerificationEmail = async (e) => {
    e.preventDefault();
    const verificationCode = generateCode();
    setSentCode(verificationCode);

    const templateParams = {
      to_email: email,
      to_name: email.split("@")[0],
      message: `Your NovaCryptoX verification code is: ${verificationCode}`,
    };

    try {
      await emailjs.send(
        "service_dgi4qmd", // ✅ your EmailJS Service ID
        "template_tzznx69", // ✅ your Template ID
        templateParams,
        "fZ_0NZJ_EbvPkNe2S" // ✅ your Public Key
      );
      setStatus("Verification code sent! Check your inbox.");
    } catch (error) {
      console.error("EmailJS error:", error);
      setStatus("Failed to send verification email.");
    }
  };

  // Verify the code and mark the email as verified in Supabase
  const verifyCode = async (e) => {
    e.preventDefault();
    if (code === sentCode) {
      try {
        await supabase.from("users").insert([{ email, verified: true }]);
        setStatus("✅ Email verified successfully!");
      } catch (error) {
        console.error("Supabase error:", error);
        setStatus("Error saving verification status.");
      }
    } else {
      setStatus("❌ Incorrect verification code. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center text-yellow-400">
          Verify Your Email
        </h1>

        <form onSubmit={sendVerificationEmail} className="space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-700 text-white focus:ring focus:ring-yellow-400"
          />
          <button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded"
          >
            Send Code
          </button>
        </form>

        {sentCode && (
          <form onSubmit={verifyCode} className="mt-4 space-y-3">
            <input
              type="text"
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="w-full p-2 rounded bg-gray-700 text-white focus:ring focus:ring-yellow-400"
            />
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-2 rounded"
            >
              Verify
            </button>
          </form>
        )}

        {status && <p className="text-center mt-3 text-sm">{status}</p>}
      </div>
    </div>
  );
}
