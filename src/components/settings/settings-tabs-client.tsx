"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";

const TABS = [
  { id: "ai", label: "AI Settings", icon: "smart_toy" },
  { id: "stages", label: "Stages", icon: "reorder" },
  { id: "labels", label: "Labels", icon: "label" },
  { id: "admin", label: "Admin", icon: "admin_panel_settings" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const STAGES = [
  { name: "Open", color: "bg-blue-500", enabled: true },
  { name: "In Progress", color: "bg-amber-500", enabled: true },
  { name: "Waiting on Vendor", color: "bg-orange-500", enabled: true },
  { name: "Waiting on Tenant", color: "bg-purple-500", enabled: true },
  { name: "Resolved", color: "bg-green-500", enabled: true },
  { name: "Closed", color: "bg-gray-500", enabled: true },
];

const LABELS = [
  { name: "Plumbing", color: "bg-blue-500", count: 24 },
  { name: "Electrical", color: "bg-amber-500", count: 18 },
  { name: "HVAC", color: "bg-red-500", count: 12 },
  { name: "Appliance", color: "bg-emerald-500", count: 9 },
  { name: "Structural", color: "bg-orange-500", count: 6 },
  { name: "Pest Control", color: "bg-purple-500", count: 3 },
  { name: "General", color: "bg-slate-500", count: 15 },
  { name: "Other", color: "bg-gray-400", count: 7 },
];

const TEAM = [
  {
    name: "Sarah Chen",
    role: "Property Manager",
    email: "sarah@wealtharchitect.io",
    status: "Active",
    lastActive: "2 min ago",
  },
  {
    name: "Mike Rodriguez",
    role: "Maintenance Coordinator",
    email: "mike@wealtharchitect.io",
    status: "Active",
    lastActive: "15 min ago",
  },
  {
    name: "Jamie Park",
    role: "Front Desk",
    email: "jamie@wealtharchitect.io",
    status: "Invited",
    lastActive: "—",
  },
];

export function SettingsTabsClient({
  aiSettingsContent,
}: {
  aiSettingsContent: ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("ai");
  const [stages, setStages] = useState(STAGES);
  const [labels, setLabels] = useState(LABELS);
  const [team, setTeam] = useState(TEAM);

  // Modal states
  const [showAddStage, setShowAddStage] = useState(false);
  const [showCreateLabel, setShowCreateLabel] = useState(false);
  const [showAiLabels, setShowAiLabels] = useState(false);
  const [aiLabelSuggestions, setAiLabelSuggestions] = useState<{ name: string; color: string; reason: string }[]>([]);
  const [showInviteUser, setShowInviteUser] = useState(false);

  // Three-dot menu & edit states
  const [openMenuEmail, setOpenMenuEmail] = useState<string | null>(null);
  const [editingRoleEmail, setEditingRoleEmail] = useState<string | null>(null);
  const [editingRoleValue, setEditingRoleValue] = useState("");
  const [editingLabel, setEditingLabel] = useState<{ originalName: string; name: string; color: string } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click-outside to close dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuEmail(null);
      }
    }
    if (openMenuEmail) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [openMenuEmail]);

  // Form states
  const [newStageName, setNewStageName] = useState("");
  const [newStageColor, setNewStageColor] = useState("bg-blue-500");
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("bg-blue-500");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Front Desk");

  const COLOR_OPTIONS = [
    { value: "bg-blue-500", label: "Blue" },
    { value: "bg-amber-500", label: "Amber" },
    { value: "bg-red-500", label: "Red" },
    { value: "bg-emerald-500", label: "Green" },
    { value: "bg-purple-500", label: "Purple" },
    { value: "bg-orange-500", label: "Orange" },
    { value: "bg-slate-500", label: "Slate" },
    { value: "bg-pink-500", label: "Pink" },
  ];

  function toggleStage(index: number) {
    setStages((prev) =>
      prev.map((s, i) =>
        i === index ? { ...s, enabled: !s.enabled } : s
      )
    );
  }

  function handleAddStage() {
    if (!newStageName.trim()) return;
    setStages((prev) => [...prev, { name: newStageName.trim(), color: newStageColor, enabled: true }]);
    setNewStageName("");
    setNewStageColor("bg-blue-500");
    setShowAddStage(false);
  }

  function handleCreateLabel() {
    if (!newLabelName.trim()) return;
    setLabels((prev) => [...prev, { name: newLabelName.trim(), color: newLabelColor, count: 0 }]);
    setNewLabelName("");
    setNewLabelColor("bg-blue-500");
    setShowCreateLabel(false);
  }

  function handleInviteUser() {
    if (!inviteEmail.trim()) return;
    const name = inviteEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    setTeam((prev) => [...prev, { name, role: inviteRole, email: inviteEmail.trim(), status: "Invited", lastActive: "—" }]);
    setInviteEmail("");
    setInviteRole("Front Desk");
    setShowInviteUser(false);
  }

  function handleChangeRole() {
    if (!editingRoleEmail || !editingRoleValue) return;
    setTeam((prev) => prev.map((m) => m.email === editingRoleEmail ? { ...m, role: editingRoleValue } : m));
    setEditingRoleEmail(null);
    setEditingRoleValue("");
  }

  function handleRemoveUser(email: string) {
    setTeam((prev) => prev.filter((m) => m.email !== email));
    setOpenMenuEmail(null);
  }

  function handleEditLabel() {
    if (!editingLabel || !editingLabel.name.trim()) return;
    setLabels((prev) => prev.map((l) => l.name === editingLabel.originalName ? { ...l, name: editingLabel.name.trim(), color: editingLabel.color } : l));
    setEditingLabel(null);
  }

  return (
    <div>
      {/* Tab Bar */}
      <div className="flex gap-2 mb-10 bg-surface-container-low p-1.5 rounded-xl">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === tab.id
                ? "bg-primary text-on-primary shadow-md"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "ai" && (
        <div className="space-y-10">{aiSettingsContent}</div>
      )}

      {activeTab === "stages" && (
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-on-surface">
                Workflow Stages
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Configure the stages a case moves through from creation to
                resolution.
              </p>
            </div>
            <button onClick={() => setShowAddStage(true)} className="px-5 py-2.5 bg-primary text-on-primary rounded-lg font-bold text-sm shadow-md hover:opacity-90 transition-opacity flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">add</span>
              Add Stage
            </button>
          </div>
          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden">
            {stages.map((stage, i) => (
              <div
                key={stage.name}
                className={`flex items-center gap-4 px-6 py-5 ${
                  i < stages.length - 1
                    ? "border-b border-outline-variant/10"
                    : ""
                } ${!stage.enabled ? "opacity-50" : ""}`}
              >
                <span className="material-symbols-outlined text-on-surface-variant cursor-grab">
                  drag_indicator
                </span>
                <span className={`w-3 h-3 rounded-full ${stage.color}`} />
                <span className="text-sm font-bold text-on-surface flex-1">
                  {stage.name}
                </span>
                <span className="text-xs text-on-surface-variant font-medium uppercase tracking-wider mr-4">
                  Step {i + 1}
                </span>
                <button
                  onClick={() => toggleStage(i)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    stage.enabled ? "bg-primary" : "bg-outline-variant"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      stage.enabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-on-surface-variant">
            Drag to reorder stages. Disabling a stage will prevent cases from
            being moved to it.
          </p>
        </div>
      )}

      {activeTab === "labels" && (
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-on-surface">
                Case Categories
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Manage the labels used to categorize maintenance cases.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setAiLabelSuggestions([
                    { name: "Water Damage", color: "bg-blue-500", reason: "3 recent cases mention water/flooding but aren't categorized" },
                    { name: "Parking", color: "bg-slate-500", reason: "Detected 2 cases about parking disputes with no matching label" },
                    { name: "Landscaping", color: "bg-emerald-500", reason: "Vendor ClearView Landscaping assigned but no label exists" },
                    { name: "Security", color: "bg-red-500", reason: "Lockout and access cases could benefit from a dedicated label" },
                  ]);
                  setShowAiLabels(true);
                }}
                className="px-5 py-2.5 bg-surface-container-high text-on-surface rounded-lg font-bold text-sm hover:bg-surface-container-highest transition-colors flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">auto_awesome</span>
                AI Smart Labels
              </button>
              <button onClick={() => setShowCreateLabel(true)} className="px-5 py-2.5 bg-primary text-on-primary rounded-lg font-bold text-sm shadow-md hover:opacity-90 transition-opacity flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">add</span>
                Create Label
              </button>
            </div>
          </div>

          {/* AI Label Suggestions */}
          {showAiLabels && aiLabelSuggestions.length > 0 && (
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">auto_awesome</span>
                  <h3 className="text-sm font-bold text-on-surface">AI-Suggested Labels</h3>
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase">
                    Based on your cases
                  </span>
                </div>
                <button onClick={() => setShowAiLabels(false)} className="text-on-surface-variant hover:text-on-surface transition-colors">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {aiLabelSuggestions.map((suggestion) => (
                  <div key={suggestion.name} className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-3 h-3 rounded-full ${suggestion.color}`} />
                        <span className="text-sm font-bold text-on-surface">{suggestion.name}</span>
                      </div>
                      <p className="text-xs text-on-surface-variant">{suggestion.reason}</p>
                    </div>
                    <button
                      onClick={() => {
                        setLabels((prev) => [...prev, { name: suggestion.name, color: suggestion.color, count: 0 }]);
                        setAiLabelSuggestions((prev) => prev.filter((s) => s.name !== suggestion.name));
                      }}
                      className="shrink-0 px-3 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {labels.map((label) => (
              <div
                key={label.name}
                className="bg-surface-container-lowest p-5 rounded-xl hover:shadow-md transition-all group cursor-pointer border border-transparent hover:border-primary/20"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-3 h-3 rounded-full ${label.color}`}
                    />
                    <span className="text-sm font-bold text-on-surface">
                      {label.name}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingLabel({ originalName: label.name, name: label.name, color: label.color });
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-on-surface-variant hover:text-primary"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                  </button>
                </div>
                <p className="text-2xl font-extrabold text-on-surface">
                  {label.count}
                </p>
                <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">
                  Cases
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "admin" && (
        <div className="space-y-6">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-on-surface">
                Team Management
              </h2>
              <p className="text-sm text-on-surface-variant mt-1">
                Manage user access and roles for your organization.
              </p>
            </div>
            <button onClick={() => setShowInviteUser(true)} className="px-5 py-2.5 bg-primary text-on-primary rounded-lg font-bold text-sm shadow-md hover:opacity-90 transition-opacity flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">
                person_add
              </span>
              Invite User
            </button>
          </div>
          {/* Role Description Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-surface-container-lowest p-5 rounded-xl border-l-4 border-primary">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-primary text-lg">admin_panel_settings</span>
                <h4 className="text-sm font-bold text-on-surface">Property Manager</h4>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Full access to all features. Can manage properties, tenants, vendors, cases, billing, and team members. Can configure AI settings and automation rules.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-5 rounded-xl border-l-4 border-amber-500">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-amber-600 text-lg">engineering</span>
                <h4 className="text-sm font-bold text-on-surface">Maintenance Coordinator</h4>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Can manage cases and dispatch vendors. Can view properties and tenants. Cannot modify billing, team members, or AI settings.
              </p>
            </div>
            <div className="bg-surface-container-lowest p-5 rounded-xl border-l-4 border-emerald-500">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-emerald-600 text-lg">support_agent</span>
                <h4 className="text-sm font-bold text-on-surface">Front Desk</h4>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Can view and create cases. Can view tenant and property info. Cannot manage vendors, billing, team members, or settings.
              </p>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Active</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {team.map((member) => (
                  <tr
                    key={member.email}
                    className="hover:bg-surface-container-low/50 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                          {member.name
                            .split(" ")
                            .map((w) => w[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-on-surface">
                            {member.name}
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-on-surface">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                          member.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            member.status === "Active"
                              ? "bg-green-500"
                              : "bg-amber-500"
                          }`}
                        />
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm text-on-surface-variant">
                      {member.lastActive}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="relative inline-block" ref={openMenuEmail === member.email ? menuRef : undefined}>
                        <button
                          onClick={() => setOpenMenuEmail(openMenuEmail === member.email ? null : member.email)}
                          className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-lg hover:bg-surface-container-high"
                        >
                          <span className="material-symbols-outlined text-xl">
                            more_horiz
                          </span>
                        </button>
                        {openMenuEmail === member.email && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/20 overflow-hidden z-50">
                            <button
                              onClick={() => {
                                setEditingRoleEmail(member.email);
                                setEditingRoleValue(member.role);
                                setOpenMenuEmail(null);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-on-surface hover:bg-surface-container-low transition-colors"
                            >
                              <span className="material-symbols-outlined text-lg text-on-surface-variant">manage_accounts</span>
                              Edit Role
                            </button>
                            <button
                              onClick={() => handleRemoveUser(member.email)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                            >
                              <span className="material-symbols-outlined text-lg">person_remove</span>
                              Remove User
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Stage Modal */}
      {showAddStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/50" onClick={() => setShowAddStage(false)} />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-on-surface">Add Stage</h2>
              <button onClick={() => setShowAddStage(false)} className="text-outline hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Stage Name</label>
                <input
                  type="text"
                  value={newStageName}
                  onChange={(e) => setNewStageName(e.target.value)}
                  placeholder="e.g. Under Review"
                  className="w-full px-4 py-3 bg-surface-container-low rounded-lg border-0 text-sm font-medium focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Color</label>
                <div className="flex gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setNewStageColor(c.value)}
                      className={`w-8 h-8 rounded-full ${c.value} ${newStageColor === c.value ? "ring-2 ring-primary ring-offset-2" : ""} transition-all`}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setShowAddStage(false)} className="px-5 py-2.5 bg-surface-container-high text-on-surface rounded-lg font-bold text-sm hover:bg-surface-container-highest transition-colors">
                Cancel
              </button>
              <button onClick={handleAddStage} disabled={!newStageName.trim()} className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-bold text-sm shadow-md hover:opacity-90 transition-all disabled:opacity-50">
                Add Stage
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Label Modal */}
      {showCreateLabel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/50" onClick={() => setShowCreateLabel(false)} />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-on-surface">Create Label</h2>
              <button onClick={() => setShowCreateLabel(false)} className="text-outline hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Label Name</label>
                <input
                  type="text"
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  placeholder="e.g. Landscaping"
                  className="w-full px-4 py-3 bg-surface-container-low rounded-lg border-0 text-sm font-medium focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Color</label>
                <div className="flex gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setNewLabelColor(c.value)}
                      className={`w-8 h-8 rounded-full ${c.value} ${newLabelColor === c.value ? "ring-2 ring-primary ring-offset-2" : ""} transition-all`}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setShowCreateLabel(false)} className="px-5 py-2.5 bg-surface-container-high text-on-surface rounded-lg font-bold text-sm hover:bg-surface-container-highest transition-colors">
                Cancel
              </button>
              <button onClick={handleCreateLabel} disabled={!newLabelName.trim()} className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-bold text-sm shadow-md hover:opacity-90 transition-all disabled:opacity-50">
                Create Label
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite User Modal */}
      {showInviteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/50" onClick={() => setShowInviteUser(false)} />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-on-surface">Invite User</h2>
              <button onClick={() => setShowInviteUser(false)} className="text-outline hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full px-4 py-3 bg-surface-container-low rounded-lg border-0 text-sm font-medium focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low rounded-lg border-0 text-sm font-medium focus:ring-2 focus:ring-primary"
                >
                  <option value="Property Manager">Property Manager</option>
                  <option value="Maintenance Coordinator">Maintenance Coordinator</option>
                  <option value="Front Desk">Front Desk</option>
                </select>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setShowInviteUser(false)} className="px-5 py-2.5 bg-surface-container-high text-on-surface rounded-lg font-bold text-sm hover:bg-surface-container-highest transition-colors">
                Cancel
              </button>
              <button onClick={handleInviteUser} disabled={!inviteEmail.trim()} className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-bold text-sm shadow-md hover:opacity-90 transition-all disabled:opacity-50">
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingRoleEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/50" onClick={() => setEditingRoleEmail(null)} />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-on-surface">Edit Role</h2>
              <button onClick={() => setEditingRoleEmail(null)} className="text-outline hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-2">User</label>
                <p className="text-sm font-medium text-on-surface">{team.find((m) => m.email === editingRoleEmail)?.name} ({editingRoleEmail})</p>
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Role</label>
                <select
                  value={editingRoleValue}
                  onChange={(e) => setEditingRoleValue(e.target.value)}
                  className="w-full px-4 py-3 bg-surface-container-low rounded-lg border-0 text-sm font-medium focus:ring-2 focus:ring-primary"
                >
                  <option value="Property Manager">Property Manager</option>
                  <option value="Maintenance Coordinator">Maintenance Coordinator</option>
                  <option value="Front Desk">Front Desk</option>
                </select>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setEditingRoleEmail(null)} className="px-5 py-2.5 bg-surface-container-high text-on-surface rounded-lg font-bold text-sm hover:bg-surface-container-highest transition-colors">
                Cancel
              </button>
              <button onClick={handleChangeRole} className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-bold text-sm shadow-md hover:opacity-90 transition-all">
                Save Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Label Modal */}
      {editingLabel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-on-surface/50" onClick={() => setEditingLabel(null)} />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-on-surface">Edit Label</h2>
              <button onClick={() => setEditingLabel(null)} className="text-outline hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Label Name</label>
                <input
                  type="text"
                  value={editingLabel.name}
                  onChange={(e) => setEditingLabel({ ...editingLabel, name: e.target.value })}
                  className="w-full px-4 py-3 bg-surface-container-low rounded-lg border-0 text-sm font-medium focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest block mb-2">Color</label>
                <div className="flex gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => setEditingLabel({ ...editingLabel, color: c.value })}
                      className={`w-8 h-8 rounded-full ${c.value} ${editingLabel.color === c.value ? "ring-2 ring-primary ring-offset-2" : ""} transition-all`}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button onClick={() => setEditingLabel(null)} className="px-5 py-2.5 bg-surface-container-high text-on-surface rounded-lg font-bold text-sm hover:bg-surface-container-highest transition-colors">
                Cancel
              </button>
              <button onClick={handleEditLabel} disabled={!editingLabel.name.trim()} className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-bold text-sm shadow-md hover:opacity-90 transition-all disabled:opacity-50">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
