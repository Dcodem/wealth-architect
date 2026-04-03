"use client";
import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import { useState } from "react";
import { useRouter } from "next/navigation";

const banks = [
  { name: "Chase", icon: "account_balance", color: "bg-blue-50 text-blue-700", accent: "bg-blue-600" },
  { name: "Wells Fargo", icon: "account_balance", color: "bg-red-50 text-red-700", accent: "bg-red-600" },
  { name: "Bank of America", icon: "account_balance", color: "bg-red-50 text-red-800", accent: "bg-red-700" },
  { name: "Citibank", icon: "account_balance", color: "bg-sky-50 text-sky-700", accent: "bg-sky-600" },
  { name: "Capital One", icon: "credit_card", color: "bg-orange-50 text-orange-700", accent: "bg-orange-600" },
  { name: "US Bank", icon: "account_balance", color: "bg-purple-50 text-purple-700", accent: "bg-purple-600" },
];

type Step = "select" | "credentials" | "accounts" | "connected";

export default function AddBankPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [step, setStep] = useState<Step>("select");
  const [selectedBank, setSelectedBank] = useState<typeof banks[0] | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

  const filtered = banks.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  const mockAccounts = selectedBank ? [
    { id: "chk-1", type: "Checking", name: `${selectedBank.name} Business Checking`, last4: "4521", balance: "$24,582.30" },
    { id: "sav-1", type: "Savings", name: `${selectedBank.name} Premium Savings`, last4: "7832", balance: "$128,450.00" },
    { id: "cc-1", type: "Credit Card", name: `${selectedBank.name} Business Rewards`, last4: "3190", balance: "-$2,340.55" },
  ] : [];

  const handleBankSelect = (bank: typeof banks[0]) => {
    setSelectedBank(bank);
    setStep("credentials");
  };

  const handleLogin = () => {
    setAuthLoading(true);
    setTimeout(() => {
      setAuthLoading(false);
      setStep("accounts");
      setSelectedAccounts([mockAccounts[0]?.id]);
    }, 2000);
  };

  const handleConnect = () => {
    setStep("connected");
  };

  const toggleAccount = (id: string) => {
    setSelectedAccounts((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  // Plaid-style modal overlay for steps after bank selection
  if (step !== "select") {
    return (
      <AppLayout>
        <PageHeader
          title="Add Bank Account"
          subtitle="Securely connect your financial institution"
          breadcrumb={{ label: "Integrations", href: "/settings/integrations" }}
        />

        <div className="max-w-md mx-auto">
          {/* Plaid-style card */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl border border-outline-variant/10 overflow-hidden">
            {/* Header bar */}
            <div className={`${selectedBank?.accent || "bg-primary"} px-6 py-4 flex items-center justify-between`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <span aria-hidden="true" className="material-symbols-outlined text-white text-[20px]">{selectedBank?.icon}</span>
                </div>
                <span className="text-white font-bold text-sm">{selectedBank?.name}</span>
              </div>
              {step !== "connected" && (
                <button
                  onClick={() => { setStep("select"); setSelectedBank(null); setUsername(""); setPassword(""); }}
                  className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
                >
                  <span aria-hidden="true" className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
            </div>

            <div className="p-6">
              {/* Step: Credentials */}
              {step === "credentials" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <span aria-hidden="true" className="material-symbols-outlined text-primary text-[18px]">lock</span>
                    <p className="text-xs text-on-surface-variant font-medium">Secured by Plaid</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-on-surface mb-1">Sign in to {selectedBank?.name}</h3>
                    <p className="text-xs text-on-surface-variant">Enter your online banking credentials. Your login info is never stored.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Username</label>
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">Password</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleLogin}
                    disabled={authLoading || !username || !password}
                    className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
                      authLoading
                        ? "bg-primary/70 text-white cursor-wait"
                        : !username || !password
                        ? "bg-surface-container-high text-on-surface-variant cursor-not-allowed"
                        : "bg-primary text-white hover:shadow-md"
                    }`}
                  >
                    {authLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span aria-hidden="true" className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                        Verifying...
                      </span>
                    ) : "Continue"}
                  </button>
                </div>
              )}

              {/* Step: Select Accounts */}
              {step === "accounts" && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-on-surface mb-1">Select Accounts</h3>
                    <p className="text-xs text-on-surface-variant">Choose which accounts to connect to The Wealth Architect.</p>
                  </div>

                  <div className="space-y-3">
                    {mockAccounts.map((acc) => {
                      const isSelected = selectedAccounts.includes(acc.id);
                      return (
                        <button
                          key={acc.id}
                          onClick={() => toggleAccount(acc.id)}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-outline-variant/20 hover:border-primary/30"
                          }`}
                        >
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            acc.type === "Checking" ? "bg-blue-50" : acc.type === "Savings" ? "bg-emerald-50" : "bg-amber-50"
                          }`}>
                            <span aria-hidden="true" className={`material-symbols-outlined text-[20px] ${
                              acc.type === "Checking" ? "text-blue-600" : acc.type === "Savings" ? "text-emerald-600" : "text-amber-600"
                            }`}>
                              {acc.type === "Credit Card" ? "credit_card" : "account_balance"}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-on-surface">{acc.name}</p>
                            <p className="text-xs text-on-surface-variant">{acc.type} ····{acc.last4}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-on-surface">{acc.balance}</p>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ml-auto ${
                              isSelected ? "border-primary bg-primary" : "border-outline-variant"
                            }`}>
                              {isSelected && <span aria-hidden="true" className="material-symbols-outlined text-white text-[14px]">check</span>}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={handleConnect}
                    disabled={selectedAccounts.length === 0}
                    className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
                      selectedAccounts.length === 0
                        ? "bg-surface-container-high text-on-surface-variant cursor-not-allowed"
                        : "bg-primary text-white hover:shadow-md"
                    }`}
                  >
                    Connect {selectedAccounts.length} Account{selectedAccounts.length !== 1 ? "s" : ""}
                  </button>
                </div>
              )}

              {/* Step: Connected */}
              {step === "connected" && (
                <div className="text-center py-6 space-y-6">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                    <span aria-hidden="true" className="material-symbols-outlined text-emerald-600 text-[40px]">check_circle</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-on-surface mb-1">Successfully Connected!</h3>
                    <p className="text-sm text-on-surface-variant">
                      {selectedAccounts.length} account{selectedAccounts.length !== 1 ? "s" : ""} from {selectedBank?.name} {selectedAccounts.length !== 1 ? "have" : "has"} been linked.
                    </p>
                  </div>
                  <div className="bg-surface-container-low rounded-xl p-4 text-left space-y-3">
                    {mockAccounts.filter((a) => selectedAccounts.includes(a.id)).map((acc) => (
                      <div key={acc.id} className="flex items-center gap-3">
                        <span aria-hidden="true" className="material-symbols-outlined text-emerald-600 text-[18px]">check</span>
                        <span className="text-sm font-medium text-on-surface">{acc.name} ····{acc.last4}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => router.push("/settings/integrations")}
                    className="w-full py-3 bg-primary text-white rounded-xl text-sm font-bold hover:shadow-md transition-all"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {step !== "connected" && (
              <div className="px-6 py-4 bg-surface-container-low/50 border-t border-outline-variant/10">
                <div className="flex items-center gap-2 justify-center">
                  <span aria-hidden="true" className="material-symbols-outlined text-[14px] text-on-surface-variant">lock</span>
                  <p className="text-[11px] text-on-surface-variant">
                    Your credentials are encrypted end-to-end and never stored on our servers.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </AppLayout>
    );
  }

  // Step: Select Bank
  return (
    <AppLayout>
      <PageHeader
        title="Add Bank Account"
        subtitle="Securely connect your financial institution"
        breadcrumb={{ label: "Integrations", href: "/settings/integrations" }}
      />

      {/* Search */}
      <div className="max-w-4xl mb-8">
        <div className="relative">
          <span aria-hidden="true" className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">
            search
          </span>
          <input
            type="text"
            placeholder="Search for your bank or financial institution..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-outline-variant/40 bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
          />
        </div>
      </div>

      {/* Popular Banks Grid */}
      <section className="max-w-4xl space-y-4">
        <h3 className="text-[20px] font-semibold text-on-surface">
          Popular Banks
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((bank) => (
            <button
              key={bank.name}
              onClick={() => handleBankSelect(bank)}
              className="bg-surface-container-lowest rounded-xl card-shadow p-6 flex flex-col items-center gap-4 group hover:ring-2 hover:ring-primary/20 transition-all text-center"
            >
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-xl ${bank.color}`}
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[30px]">
                  {bank.icon}
                </span>
              </div>
              <span className="text-base font-semibold text-on-surface">
                {bank.name}
              </span>
              <span className="w-full mt-auto px-4 py-2.5 text-sm font-semibold rounded-lg text-white bg-primary hover:bg-primary/90 transition-colors">
                Connect
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="bg-surface-container-lowest rounded-xl card-shadow p-10 text-center">
            <span aria-hidden="true" className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-2">
              search_off
            </span>
            <p className="text-sm text-on-surface-variant">
              No banks found matching &ldquo;{search}&rdquo;. Try a different
              search term.
            </p>
          </div>
        )}
      </section>

      {/* Security Notice */}
      <div className="max-w-4xl mt-10 mb-4">
        <div className="flex items-start gap-4 bg-surface-container-lowest rounded-xl card-shadow p-6 border border-outline-variant/20">
          <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-primary-fixed-dim text-primary">
            <span aria-hidden="true" className="material-symbols-outlined text-xl">lock</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface mb-1">
              Bank-level security
            </p>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              256-bit encryption. We use Plaid to securely connect to your
              financial institution. Your credentials are never stored on our
              servers and all data is encrypted in transit and at rest.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
