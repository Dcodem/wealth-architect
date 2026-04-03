"use client";

import AppLayout from "@/components/AppLayout";
import PageHeader from "@/components/PageHeader";
import AnimatedTabs from "@/components/AnimatedTabs";
import { useState } from "react";
import { usePathname } from "next/navigation";

type Role = "Admin" | "Manager" | "Accountant" | "Viewer";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  status: "Active" | "Invited" | "Disabled";
  lastActive: string;
  properties: string[];
}

const roleDescriptions: Record<Role, { description: string; icon: string; color: string }> = {
  Admin: {
    description: "Full access to all features, settings, and user management",
    icon: "admin_panel_settings",
    color: "bg-purple-100 text-purple-700",
  },
  Manager: {
    description: "Manage properties, transactions, and reports. Cannot manage users or billing.",
    icon: "manage_accounts",
    color: "bg-blue-100 text-blue-700",
  },
  Accountant: {
    description: "View all data and generate exports/statements. Cannot modify transactions.",
    icon: "account_balance",
    color: "bg-success-container text-on-success-container",
  },
  Viewer: {
    description: "Read-only access to dashboards and reports. Cannot export or modify data.",
    icon: "visibility",
    color: "bg-surface-container-high text-on-surface-variant",
  },
};

const initialMembers: TeamMember[] = [
  {
    id: 1,
    name: "Jonathan Sterling",
    email: "j.sterling@estatetrust.com",
    role: "Admin",
    avatar: "JS",
    status: "Active",
    lastActive: "Just now",
    properties: ["All Properties"],
  },
  {
    id: 2,
    name: "Rachel Kim",
    email: "r.kim@estatetrust.com",
    role: "Manager",
    avatar: "RK",
    status: "Active",
    lastActive: "2 hours ago",
    properties: ["Downtown Plaza", "Main St. Loft"],
  },
  {
    id: 3,
    name: "David Okonkwo",
    email: "d.okonkwo@estatetrust.com",
    role: "Accountant",
    avatar: "DO",
    status: "Active",
    lastActive: "1 day ago",
    properties: ["All Properties"],
  },
  {
    id: 4,
    name: "Sarah Chen",
    email: "s.chen@estatetrust.com",
    role: "Viewer",
    avatar: "SC",
    status: "Invited",
    lastActive: "Pending",
    properties: ["Oak Ridge Estate"],
  },
];

const roles: Role[] = ["Admin", "Manager", "Accountant", "Viewer"];

export default function UserManagementPage() {
  const pathname = usePathname();
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("Viewer");
  const [inviteSent, setInviteSent] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editRole, setEditRole] = useState<Role>("Viewer");

  const handleInvite = () => {
    if (!inviteEmail) return;
    const newMember: TeamMember = {
      id: Date.now(),
      name: inviteEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      email: inviteEmail,
      role: inviteRole,
      avatar: inviteEmail.slice(0, 2).toUpperCase(),
      status: "Invited",
      lastActive: "Pending",
      properties: inviteRole === "Admin" ? ["All Properties"] : [],
    };
    setMembers((prev) => [...prev, newMember]);
    setInviteSent(true);
    setTimeout(() => {
      setInviteSent(false);
      setShowInvite(false);
      setInviteEmail("");
      setInviteRole("Viewer");
    }, 1500);
  };

  const startEditRole = (member: TeamMember) => {
    setEditingId(member.id);
    setEditRole(member.role);
  };

  const saveRole = (memberId: number) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: editRole } : m))
    );
    setEditingId(null);
  };

  const removeMember = (memberId: number) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const resendInvite = (memberId: number) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, lastActive: "Resent just now" } : m))
    );
  };

  return (
    <AppLayout>
      <PageHeader
        title="Settings"
        subtitle="Manage your account and preferences"
      />
      <AnimatedTabs
        layoutId="settings-tabs"
        variant="underline"
        tabs={[
          { label: "Account", href: "/settings" },
          { label: "Categories", href: "/settings/categories" },
          { label: "Integrations", href: "/settings/integrations" },
          { label: "Notifications", href: "/settings/notifications" },
          { label: "Users", href: "/settings/users" },
        ]}
        activeValue={pathname}
      />

      <div className="max-w-4xl space-y-6">
        {/* Header Card */}
        <div className="bg-surface-container-lowest rounded-xl p-6 card-shadow flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-fixed-dim flex items-center justify-center">
              <span aria-hidden="true" className="material-symbols-outlined text-primary text-xl">
                group
              </span>
            </div>
            <div>
              <p className="text-lg font-bold text-on-surface">
                Team Members
              </p>
              <p className="text-xs text-on-surface-variant">
                {members.filter((m) => m.status === "Active").length} active &middot;{" "}
                {members.filter((m) => m.status === "Invited").length} pending
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-bold shadow-md shadow-primary/20 hover:opacity-90 transition-all"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
              person_add
            </span>
            Invite Member
          </button>
        </div>

        {/* Role Legend */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {roles.map((role) => {
            const info = roleDescriptions[role];
            return (
              <div
                key={role}
                className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${info.color}`}
                  >
                    {role}
                  </span>
                </div>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">
                  {info.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Members List */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                    Member
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                    Role
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                    Properties
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {members.map((member) => {
                  const roleInfo = roleDescriptions[member.role];
                  const isEditing = editingId === member.id;
                  const isCurrentUser = member.id === 1;

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-surface-container-low/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shrink-0">
                            {member.avatar}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface">
                              {member.name}
                              {isCurrentUser && (
                                <span className="ml-2 text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-on-surface-variant">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={editRole}
                              onChange={(e) => setEditRole(e.target.value as Role)}
                              className="bg-surface-container-high border-none rounded-lg px-3 py-1.5 text-xs font-bold focus:ring-1 focus:ring-primary/40 outline-none appearance-none cursor-pointer"
                            >
                              {roles.map((r) => (
                                <option key={r} value={r}>
                                  {r}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={() => saveRole(member.id)}
                              className="w-7 h-7 flex items-center justify-center rounded-full bg-success-container text-on-success-container hover:bg-success-container transition-all"
                            >
                              <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
                                check
                              </span>
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="w-7 h-7 flex items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant hover:bg-red-50 hover:text-red-600 transition-all"
                            >
                              <span aria-hidden="true" className="material-symbols-outlined text-[14px]">
                                close
                              </span>
                            </button>
                          </div>
                        ) : (
                          <span
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${roleInfo.color}`}
                          >
                            {member.role}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-xs text-on-surface-variant">
                          {member.properties.join(", ")}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              member.status === "Active"
                                ? "bg-success-container0"
                                : member.status === "Invited"
                                ? "bg-amber-500"
                                : "bg-outline-variant"
                            }`}
                          />
                          <span
                            className={`text-[11px] font-bold ${
                              member.status === "Active"
                                ? "text-on-success-container"
                                : member.status === "Invited"
                                ? "text-amber-600"
                                : "text-on-surface-variant"
                            }`}
                          >
                            {member.status}
                          </span>
                        </div>
                        <p className="text-[10px] text-on-surface-variant/60 mt-0.5">
                          {member.lastActive}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {!isCurrentUser && !isEditing && (
                            <>
                              <button
                                onClick={() => startEditRole(member)}
                                className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-all"
                                title="Change role"
                              >
                                <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                                  edit
                                </span>
                              </button>
                              {member.status === "Invited" && (
                                <button
                                  onClick={() => resendInvite(member.id)}
                                  className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-all"
                                  title="Resend invite"
                                >
                                  <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                                    send
                                  </span>
                                </button>
                              )}
                              <button
                                onClick={() => removeMember(member.id)}
                                className="w-8 h-8 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-red-50 hover:text-red-600 transition-all"
                                title="Remove member"
                              >
                                <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                                  person_remove
                                </span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Log */}
        <div className="bg-surface-container-lowest rounded-xl p-6 card-shadow">
          <div className="flex items-center gap-3 mb-5">
            <span aria-hidden="true" className="material-symbols-outlined text-primary">
              history
            </span>
            <h3 className="text-sm font-bold text-on-surface">
              Recent Activity
            </h3>
          </div>
          <div className="space-y-4">
            {[
              { icon: "person_add", text: "Jonathan Sterling invited Sarah Chen as Viewer", time: "2 hours ago", color: "bg-blue-100 text-blue-700" },
              { icon: "edit", text: "Jonathan Sterling changed David Okonkwo's role to Accountant", time: "3 days ago", color: "bg-amber-100 text-amber-700" },
              { icon: "check_circle", text: "Rachel Kim accepted invitation and joined as Manager", time: "1 week ago", color: "bg-success-container text-on-success-container" },
              { icon: "group_add", text: "Jonathan Sterling created the team workspace", time: "2 weeks ago", color: "bg-purple-100 text-purple-700" },
            ].map((event, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg ${event.color} flex items-center justify-center shrink-0 mt-0.5`}>
                  <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                    {event.icon}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-on-surface">{event.text}</p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">
                    {event.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInvite && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => !inviteSent && setShowInvite(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-surface-container-lowest rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowInvite(false)}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant hover:bg-error hover:text-white transition-all"
            >
              <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                close
              </span>
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span aria-hidden="true" className="material-symbols-outlined text-primary text-xl">
                  person_add
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface">
                  Invite Team Member
                </h3>
                <p className="text-sm text-on-surface-variant">
                  They&apos;ll receive an email invitation
                </p>
              </div>
            </div>
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 text-sm focus:bg-white focus:ring-1 focus:ring-primary/40 transition-all outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
                  Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as Role)}
                  className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 text-sm focus:bg-white focus:ring-1 focus:ring-primary/40 transition-all outline-none appearance-none cursor-pointer"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  {roleDescriptions[inviteRole].description}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-8">
              <button
                onClick={() => setShowInvite(false)}
                className="px-5 py-2.5 rounded-full text-on-surface-variant font-semibold text-sm hover:bg-surface-container-low transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleInvite}
                disabled={!inviteEmail}
                className={`px-6 py-2.5 rounded-full text-sm font-bold shadow-md transition-all flex items-center gap-2 ${
                  inviteSent
                    ? "bg-success-container0 text-white shadow-success/20"
                    : inviteEmail
                    ? "bg-primary text-white shadow-primary/20 hover:opacity-90"
                    : "bg-outline-variant/30 text-on-surface-variant cursor-not-allowed shadow-none"
                }`}
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
                  {inviteSent ? "check" : "send"}
                </span>
                {inviteSent ? "Invited!" : "Send Invitation"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
