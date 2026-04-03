"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    router.push("/cases");
  }

  return (
    <main className="w-full max-w-[480px]">
      <div className="bg-surface-container-lowest rounded-2xl card-shadow p-8 md:p-12 flex flex-col items-center">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary mb-4">
            <span
              className="material-symbols-outlined text-white text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              domain
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">
            The Wealth Architect
          </h1>
          <p className="text-on-surface-variant font-medium">
            Portfolio Management Excellence
          </p>
        </div>

        <form className="w-full space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="bg-error-container text-error text-sm font-medium px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-on-surface ml-1" htmlFor="email">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline text-xl group-focus-within:text-primary transition-colors">mail</span>
              </div>
              <input
                className="w-full pl-12 pr-4 py-4 bg-surface-container-high border-2 border-transparent focus:border-primary focus:ring-0 rounded-xl transition-all text-on-surface placeholder:text-outline/60"
                id="email"
                name="email"
                placeholder="agent@wealtharchitect.com"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="block text-sm font-semibold text-on-surface" htmlFor="password">
                Password
              </label>
              <a className="text-xs font-bold text-primary hover:text-primary/80 transition-colors" href="#">
                Forgot Password?
              </a>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-outline text-xl group-focus-within:text-primary transition-colors">lock</span>
              </div>
              <input
                className="w-full pl-12 pr-4 py-4 bg-surface-container-high border-2 border-transparent focus:border-primary focus:ring-0 rounded-xl transition-all text-on-surface placeholder:text-outline/60"
                id="password"
                name="password"
                placeholder="••••••••"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            className="w-full bg-primary text-on-primary py-4 rounded-full font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
            type="submit"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In to Dashboard"}
            {!loading && (
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
            )}
          </button>
        </form>

        <div className="mt-10 w-full">
          <div className="relative flex items-center justify-center mb-8">
            <div className="flex-grow border-t border-outline-variant/30" />
            <span className="flex-shrink mx-4 text-xs font-bold tracking-widest text-outline uppercase">
              Or Secure Access
            </span>
            <div className="flex-grow border-t border-outline-variant/30" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-surface-container-high rounded-xl border border-outline-variant/20 hover:bg-surface-container-highest transition-colors font-semibold text-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-xl">key</span>
              SSO
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-surface-container-high rounded-xl border border-outline-variant/20 hover:bg-surface-container-highest transition-colors font-semibold text-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-xl">qr_code_2</span>
              QR Code
            </button>
          </div>
        </div>

        <p className="mt-12 text-sm text-on-surface-variant">
          New to the platform?{" "}
          <a className="text-primary font-bold hover:underline decoration-2 underline-offset-4" href="/signup">
            Create an account
          </a>
        </p>
      </div>

      <div className="mt-8 flex items-center justify-center gap-6 opacity-60 text-on-surface-variant">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">verified_user</span>
          <span className="text-[10px] font-bold tracking-widest uppercase">256-bit AES</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">cloud_done</span>
          <span className="text-[10px] font-bold tracking-widest uppercase">Systems Online</span>
        </div>
      </div>
    </main>
  );
}
