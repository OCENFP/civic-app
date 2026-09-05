"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";
import { signInWithGoogle } from "../../../lib/auth";

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function signup(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else if (data.session) {
      router.push("/onboarding");
    } else {
      setMessage("Check your email to confirm your account.");
    }
  }

  return (
    <div>
      <h1>Sign Up</h1>

      <form onSubmit={signup}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (6+ characters)"
          minLength={6}
          required
        />

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <button onClick={signInWithGoogle}>Continue with Google</button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p>{message}</p>}

      <p>
        Already have an account? <Link href="/login">Log in</Link>
      </p>
    </div>
  );
}
