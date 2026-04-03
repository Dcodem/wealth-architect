"use client";

import { useState } from "react";
import Image from "next/image";

type Message = {
  id: string;
  body: string;
  direction: "inbound" | "outbound";
  fromAddress: string;
  messageType: string;
  createdAt: string;
};

// Mock images that a tenant might attach to a maintenance report
const MOCK_ATTACHMENTS: Record<string, { url: string; alt: string }[]> = {
  plumbing: [
    { url: "/properties/142-oak-street.jpg", alt: "Photo of leak under kitchen sink" },
  ],
  electrical: [
    { url: "/properties/88-commerce-blvd.jpg", alt: "Photo of damaged outlet" },
  ],
  hvac: [
    { url: "/properties/7-maple-lane.jpg", alt: "Photo of AC unit" },
  ],
};

function formatMessageTime(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

// Generate a detailed AI summary based on the case context
function generateDetailedSummary(rawMessage: string, category: string | null, status: string): string {
  const cat = category?.toLowerCase() ?? "general";
  const statusLabel: Record<string, string> = {
    open: "New — awaiting triage",
    in_progress: "In progress — vendor dispatched",
    waiting_on_vendor: "Waiting for vendor response",
    waiting_on_tenant: "Waiting for tenant response",
    resolved: "Resolved",
    closed: "Closed",
  };
  const currentStatus = statusLabel[status] || status;

  const summaries: Record<string, string> = {
    maintenance: rawMessage.toLowerCase().includes("sink") || rawMessage.toLowerCase().includes("leak")
      ? `Tenant reported a kitchen sink leak with water pooling under the cabinet. A plumber has been contacted. The tenant was advised to place towels and turn off the water valve if accessible.`
      : rawMessage.toLowerCase().includes("ac") || rawMessage.toLowerCase().includes("hvac")
      ? `Tenant reported their AC unit is blowing warm air despite thermostat and filter checks. An HVAC technician has been dispatched. High temperatures forecasted — prioritized for same-day service.`
      : rawMessage.toLowerCase().includes("dishwasher")
      ? `Tenant reported dishwasher stopped mid-cycle with a grinding noise and standing water in the basin. Appliance repair has been scheduled. Tenant advised not to run the unit until inspection.`
      : rawMessage.toLowerCase().includes("ant") || rawMessage.toLowerCase().includes("pest")
      ? `Tenant reported recurring ant trails in the kitchen near the baseboard and sink area. Store-bought treatments have been ineffective. Professional pest control has been scheduled for the unit and common areas.`
      : `Maintenance issue reported by tenant. The property management team is coordinating a resolution.`,
    emergency: rawMessage.toLowerCase().includes("electrical") || rawMessage.toLowerCase().includes("burning")
      ? `URGENT: Tenant reported a burning smell from an electrical outlet in the living room. All devices have been unplugged but the smell persists. An electrician has been emergency-dispatched. Tenant was advised to avoid the outlet and evacuate if smoke appears.`
      : rawMessage.toLowerCase().includes("lock")
      ? `Tenant is locked out of their unit with the spare key inside. An emergency locksmith has been dispatched with an estimated arrival of 30 minutes.`
      : `Emergency case reported. Immediate response initiated.`,
    lease_question: `Tenant inquired about lease renewal options ahead of their upcoming expiration. The property manager has been notified to prepare renewal terms and follow up with available options.`,
    noise_complaint: rawMessage.toLowerCase().includes("construction")
      ? `Tenant reported early-morning construction noise starting at 6:30 AM, which violates the lease quiet hours policy (until 8 AM). Building management has contacted the construction site manager to negotiate a later start time.`
      : `Tenant filed a noise complaint about repeated late-night disturbances from a neighboring unit. This is a recurring issue. The property manager has spoken with the offending tenant to resolve the situation.`,
    payment: `Tenant reported their rent payment was rejected by their bank. The property management team confirmed the returned payment and has waived late fees provided the payment is retried within 5 business days.`,
    general: `Case reported by tenant. The property management team is reviewing and will respond with next steps.`,
  };

  return `${summaries[cat] || summaries.general}\n\n**Current Status:** ${currentStatus}`;
}

export function CaseIssueDescription({
  rawMessage,
  category,
  messages,
  tenantName,
  status,
}: {
  rawMessage: string;
  category: string | null;
  messages: Message[];
  tenantName: string;
  status?: string;
}) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showAllUpdates, setShowAllUpdates] = useState(false);

  // Get mock attachments based on category
  const categoryKey = category?.toLowerCase() ?? "plumbing";
  const attachments = MOCK_ATTACHMENTS[categoryKey] ?? MOCK_ATTACHMENTS.plumbing;

  // Build conversation context from messages (exclude system notifications)
  const conversationMessages = messages
    .filter((m) => m.messageType !== "system_notification")
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const visibleUpdates = showAllUpdates
    ? conversationMessages
    : conversationMessages.slice(0, 3);

  return (
    <section className="bg-surface-container-lowest rounded-2xl p-10 shadow-sm border border-outline-variant/10">
      {/* AI Summary */}
      <div className="flex items-start gap-6 mb-8">
        <div className="w-14 h-14 rounded-xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
          <span
            className="material-symbols-outlined text-3xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            smart_toy
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-2xl font-extrabold text-on-surface tracking-tight">
              Issue Summary
            </h2>
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
              AI Generated
            </span>
          </div>
          {generateDetailedSummary(rawMessage, category, status ?? "open").split("\n\n").map((para, i) => (
            <p key={i} className={`text-base leading-relaxed ${
              para.startsWith("**Current Status:")
                ? "mt-4 text-sm font-bold text-on-surface"
                : "text-on-surface-variant"
            }`}>
              {para.startsWith("**Current Status:**")
                ? <>
                    <span className="text-on-surface-variant font-normal">Current Status: </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {para.replace("**Current Status:** ", "")}
                    </span>
                  </>
                : para}
            </p>
          ))}
        </div>
      </div>

      {/* Original Message */}
      <div className="bg-surface-container-low rounded-xl p-6 mb-8">
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">
          Original Report
        </p>
        <p className="text-sm text-on-surface-variant leading-relaxed italic">
          &ldquo;{rawMessage}&rdquo;
        </p>
      </div>

      {/* Attached Images */}
      {attachments.length > 0 && (
        <div className="mb-8">
          <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3 px-1">
            Attached Photos
          </p>
          <div className="flex gap-3">
            {attachments.map((att) => (
              <button
                key={att.url}
                onClick={() => setPreviewImage(att.url)}
                className="relative w-32 h-24 rounded-xl overflow-hidden border-2 border-outline-variant/20 hover:border-primary/40 transition-all group"
              >
                <Image
                  src={att.url}
                  alt={att.alt}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  sizes="128px"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg">
                    zoom_in
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Conversation Context */}
      {conversationMessages.length > 0 && (
        <div className="border-t border-outline-variant/10 pt-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-1 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">forum</span>
              Conversation Updates
            </p>
            <span className="text-xs text-on-surface-variant font-medium">
              {conversationMessages.length} message{conversationMessages.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="space-y-3">
            {visibleUpdates.map((msg) => {
              const isInbound = msg.direction === "inbound";
              const isAI = msg.messageType === "ai_response";
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isInbound ? "" : "flex-row-reverse"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      isInbound
                        ? "bg-primary/10 text-primary"
                        : isAI
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    {isInbound ? (
                      tenantName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
                    ) : isAI ? (
                      <span className="material-symbols-outlined text-sm">smart_toy</span>
                    ) : (
                      "PM"
                    )}
                  </div>
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-xl text-sm ${
                      isInbound
                        ? "bg-surface-container-low text-on-surface"
                        : isAI
                        ? "bg-primary/10 text-on-surface"
                        : "bg-outline-variant/10 text-on-surface"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-xs">
                        {isInbound ? msg.fromAddress : isAI ? "The Wealth Architect AI" : "Property Management"}
                      </span>
                      <span className="text-[10px] text-on-surface-variant">
                        {formatMessageTime(msg.createdAt)}
                      </span>
                    </div>
                    <p className="leading-relaxed">{msg.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {conversationMessages.length > 3 && (
            <button
              onClick={() => setShowAllUpdates(!showAllUpdates)}
              className="group mt-4 text-sm font-bold text-primary flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">
                {showAllUpdates ? "expand_less" : "expand_more"}
              </span>
              <span className="group-hover:underline underline-offset-4 decoration-2">
                {showAllUpdates
                  ? "Show less"
                  : `Show ${conversationMessages.length - 3} more updates`}
              </span>
            </button>
          )}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-on-surface/60"
            onClick={() => setPreviewImage(null)}
          />
          <div className="relative max-w-3xl w-full aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src={previewImage}
              alt="Attachment preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
