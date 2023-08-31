import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Auth() {
  const title = 'PRFlow 🏄‍♂️';
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      alert(error.error_description || error.message);
    } else {
      alert("Check your email for the login link!");
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 w-96 space-y-5">
        <h1 className="font-semibold text-xl text-center">{title}</h1>
        <hr />
        <div className="space-y-4">
          <p className="text-center text-gray-600">
            Sign in via magic link with your email below
          </p>
          <form className="flex flex-col items-center space-y-4" onSubmit={handleLogin}>
              <input
                className="rounded-md border-slate-400"
                type="email"
                placeholder="Your email"
                value={email}
                required={true}
                onChange={(e) => setEmail(e.target.value)}
              />
            <div>
              <button
                className="bg-green-500 p-2 rounded-md w-full text-white"
                disabled={loading}
              >
                {loading ? <span>Loading</span> : <span>Send magic link</span>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
