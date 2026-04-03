"use client";

import { useState, useRef, useEffect } from "react";
import type { MessageLog } from "@/lib/db/schema";

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const MOCK_CONTRACTOR_MESSAGES = [
  { id: "cm1", body: "Confirmed arrival for tomorrow 9:00 AM. Will bring standard toolkit.", direction: "inbound" as const, fromAddress: "Mike's Plumbing", createdAt: new Date(Date.now() - 3600000 * 3), messageType: "sms" },
  { id: "cm2", body: "Parts ordered from supplier — ETA 2 business days. Will update once they arrive.", direction: "inbound" as const, fromAddress: "Mike's Plumbing", createdAt: new Date(Date.now() - 3600000), messageType: "sms" },
  { id: "cm3", body: "Job completed. Replaced valve assembly and tested water pressure. Awaiting tenant inspection sign-off.", direction: "inbound" as const, fromAddress: "Mike's Plumbing", createdAt: new Date(Date.now() - 1800000), messageType: "sms" },
];

const EMOJIS = ["👍", "😊", "🔧", "🏠", "📋", "✅", "❌", "⚠️", "🔑", "💧", "🔌", "❄️", "🔥", "📞", "📧", "👷", "🏗️", "🧹", "💡", "🚿"];

export function CaseMessages({ messages }: { messages: MessageLog[] }) {
  const [activeThread, setActiveThread] = useState<"tenant" | "contractor">("tenant");
  const [aiActive, setAiActive] = useState(true);
  const [inputText, setInputText] = useState("");
  const [localMessages, setLocalMessages] = useState<Array<{
    id: string; body: string; direction: "inbound" | "outbound"; fromAddress: string; createdAt: Date; messageType: string;
  }>>([]);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sorted = [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const allTenantMessages = [...sorted, ...localMessages.filter((m) => m.messageType !== "contractor")].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const contractorMessages = [...MOCK_CONTRACTOR_MESSAGES, ...localMessages.filter((m) => m.messageType === "contractor")].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const displayMessages = activeThread === "tenant" ? allTenantMessages : contractorMessages;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages, activeThread]);

  function handleSend() {
    if (!inputText.trim() && !attachedFile) return;
    const body = attachedFile ? `${inputText.trim()} [Attached: ${attachedFile}]` : inputText.trim();
    setLocalMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        body,
        direction: "outbound",
        fromAddress: "Property Management",
        createdAt: new Date(),
        messageType: activeThread === "contractor" ? "contractor" : "pm_response",
      },
    ]);
    setInputText("");
    setAttachedFile(null);
    setShowEmoji(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <section className="bg-primary-fixed rounded-2xl p-10 flex flex-col h-[850px] shadow-sm border border-outline-variant/10">
      <div className="flex items-center justify-between mb-8 shrink-0">
        <div>
          <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">Communication Log</h2>
          <p className="text-sm text-on-surface-variant font-medium mt-1">Real-time collaboration with stakeholders</p>
        </div>
        <button
          onClick={() => setAiActive(!aiActive)}
          className={`border-2 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm ${
            aiActive
              ? "bg-surface-container-lowest/50 border-primary/20 text-primary hover:bg-primary hover:text-on-primary"
              : "bg-primary border-primary text-on-primary hover:opacity-90"
          }`}
        >
          <span className="material-symbols-outlined text-lg">
            {aiActive ? "support_agent" : "person"}
          </span>
          {aiActive ? "Take over from AI" : "Re-enable AI Agent"}
        </button>
      </div>

      {/* Thread Tabs */}
      <div className="flex bg-outline-variant/20 p-1.5 rounded-full mb-6 shrink-0 border border-outline-variant/10">
        <button
          onClick={() => setActiveThread("tenant")}
          className={`flex-1 py-3 px-6 rounded-full text-sm font-black transition-all flex items-center justify-center gap-2 ${
            activeThread === "tenant"
              ? "text-on-primary bg-primary shadow-lg"
              : "text-on-surface-variant hover:bg-primary-fixed"
          }`}
        >
          <span className="material-symbols-outlined text-xl">person</span>
          Tenant Thread
        </button>
        <button
          onClick={() => setActiveThread("contractor")}
          className={`flex-1 py-3 px-6 rounded-full text-sm font-black transition-all flex items-center justify-center gap-2 ${
            activeThread === "contractor"
              ? "text-on-primary bg-primary shadow-lg"
              : "text-on-surface-variant hover:bg-primary-fixed"
          }`}
        >
          <span className="material-symbols-outlined text-xl">engineering</span>
          Contractor Thread
          {activeThread !== "contractor" && (
            <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
          )}
        </button>
      </div>

      {/* AI takeover banner */}
      {!aiActive && (
        <div className="mb-4 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 shrink-0">
          <span className="material-symbols-outlined text-amber-600 text-lg">info</span>
          <p className="text-sm font-medium text-amber-800">You are now managing this conversation directly</p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-grow space-y-10 overflow-y-auto pr-4 custom-scrollbar">
        {displayMessages.map((msg) => {
          const isInbound = msg.direction === "inbound";
          const isSystem = msg.messageType === "system_notification";

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center">
                <div className="px-6 py-2 bg-outline-variant/10 rounded-full border border-outline-variant/20">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                    {msg.body} &bull; {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          }

          if (isInbound) {
            return (
              <div key={msg.id} className="flex justify-start">
                <div className="max-w-[75%] space-y-2">
                  <div className="flex items-center gap-3 mb-1 px-1">
                    <span className="text-sm font-bold text-on-surface">{msg.fromAddress}</span>
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                      {activeThread === "contractor" ? "Contractor" : "Tenant"} &bull; {formatTime(msg.createdAt)}
                    </span>
                  </div>
                  <div className="bg-surface-container-lowest text-on-surface p-7 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl rounded-tl-md shadow-sm border border-outline-variant/10">
                    <p className="text-base leading-relaxed">{msg.body}</p>
                  </div>
                </div>
              </div>
            );
          }

          const isAI = msg.messageType === "ai_response";
          return (
            <div key={msg.id} className="flex justify-end">
              <div className="max-w-[75%] space-y-2 text-right">
                <div className="flex items-center justify-end gap-3 mb-1 px-1">
                  <span className="flex items-center gap-1 text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                    {isAI && <span className="material-symbols-outlined text-xs">smart_toy</span>}
                    {isAI ? "The Wealth Architect AI" : "Property Management"} &bull; {formatTime(msg.createdAt)}
                  </span>
                  <span className={`text-sm font-extrabold ${isAI ? "text-primary" : "text-on-surface-variant"}`}>
                    {isAI ? "The Wealth Architect Support" : msg.fromAddress}
                  </span>
                </div>
                <div className={`p-7 rounded-tl-2xl rounded-bl-2xl rounded-br-2xl rounded-tr-md text-left ${
                  isAI ? "bg-primary text-on-primary shadow-lg" : "bg-outline-variant/20 text-on-surface shadow-sm border border-outline-variant/20"
                }`}>
                  <p className="text-base leading-relaxed">{msg.body}</p>
                </div>
              </div>
            </div>
          );
        })}

        {displayMessages.length === 0 && (
          <div className="flex justify-center items-center h-full">
            <p className="text-on-surface-variant text-sm font-medium">
              No messages yet in this thread.
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="mt-6 shrink-0">
        {/* Attached file pill */}
        {attachedFile && (
          <div className="mb-2 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">
              <span className="material-symbols-outlined text-sm">attach_file</span>
              {attachedFile}
              <button onClick={() => setAttachedFile(null)} className="hover:text-error transition-colors">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </span>
          </div>
        )}

        {/* Emoji picker */}
        {showEmoji && (
          <div className="mb-2 bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-3 shadow-lg flex flex-wrap gap-1">
            {EMOJIS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setInputText((prev) => prev + emoji);
                  inputRef.current?.focus();
                }}
                className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-primary-fixed text-lg transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className="bg-surface-container-lowest rounded-xl p-4 border-2 border-primary/20 focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition-all shadow-md">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Replying to {activeThread === "tenant" ? "Tenant" : "Contractor"} Thread
              </span>
              <div className="flex gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setAttachedFile(file.name);
                    e.target.value = "";
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1 text-on-surface-variant hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">attach_file</span>
                </button>
                <button
                  onClick={() => setShowEmoji(!showEmoji)}
                  className={`p-1 transition-colors ${showEmoji ? "text-primary" : "text-on-surface-variant hover:text-primary"}`}
                >
                  <span className="material-symbols-outlined text-lg">mood</span>
                </button>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <input
                ref={inputRef}
                className="flex-grow bg-transparent border-none focus:ring-0 text-base placeholder:text-on-surface-variant/40 px-4"
                placeholder={`Type your message as Property Management...`}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={handleSend}
                disabled={!inputText.trim() && !attachedFile}
                className="bg-primary text-on-primary px-8 py-3.5 rounded-full font-extrabold text-sm hover:opacity-90 active:scale-95 transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
              >
                <span>Send Message</span>
                <span className="material-symbols-outlined text-lg">send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
