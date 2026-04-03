"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateProfileAction, resetPasswordAction, deactivateAccountAction } from "./actions";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface ProfileClientProps {
  user: {
    name: string;
    email: string;
    phone: string | null;
    role: string;
  };
  orgName: string;
}

export function ProfileClient({ user, orgName }: ProfileClientProps) {
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editPhone, setEditPhone] = useState(user.phone ?? "");
  const [saving, startSave] = useTransition();
  const [resetting, startReset] = useTransition();
  const [deactivating, startDeactivate] = useTransition();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [resetMsg, setResetMsg] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  function handleSave() {
    setSaveError(null);
    const fd = new FormData();
    fd.set("name", editName);
    fd.set("phone", editPhone);
    startSave(async () => {
      const result = await updateProfileAction(fd);
      if (result.error) {
        setSaveError(result.error);
      } else {
        setShowEditModal(false);
      }
    });
  }

  function handleResetPassword() {
    setResetMsg(null);
    startReset(async () => {
      const result = await resetPasswordAction();
      if (result.error) {
        setResetMsg(`Error: ${result.error}`);
      } else {
        setResetMsg("Password reset email sent. Check your inbox.");
      }
    });
  }

  function handleDeactivate() {
    startDeactivate(async () => {
      const result = await deactivateAccountAction();
      if (result.error) {
        setResetMsg(`Error: ${result.error}`);
      } else {
        router.push("/login");
      }
    });
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-7xl mx-auto p-8 lg:p-12">
        {/* Profile Header */}
        <section className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-16">
          <div className="flex items-start gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-xl overflow-hidden shadow-2xl bg-surface-container-high border-4 border-white">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-on-primary text-4xl font-extrabold">
                    {initials}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-primary p-2 rounded-lg text-on-primary shadow-lg">
                <span className="material-symbols-outlined text-sm">verified</span>
              </div>
              <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-xl">
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setProfilePhoto(URL.createObjectURL(file));
                }} />
                <span className="material-symbols-outlined text-white text-2xl">photo_camera</span>
              </label>
              {!profilePhoto && (
                <p className="text-[10px] text-on-surface-variant text-center mt-2 max-w-[130px]">Add a profile photo so your team can recognize you</p>
              )}
              {profilePhoto && (
                <button onClick={() => setProfilePhoto(null)} className="text-[10px] text-error font-medium text-center block mt-2 mx-auto hover:underline underline-offset-4 decoration-2">
                  Remove Photo
                </button>
              )}
            </div>
            <div className="pt-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold block mb-1">The Wealth Architect Manager</span>
              <h1 className="text-4xl font-extrabold tracking-tight text-on-surface leading-none mb-2">{user.name}</h1>
              <p className="text-on-surface-variant font-medium flex items-center gap-2">
                {user.role === "owner" ? "Account Owner" : user.role}
                <span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                <span className="text-on-surface-variant">{orgName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditName(user.name);
              setEditPhone(user.phone ?? "");
              setSaveError(null);
              setShowEditModal(true);
            }}
            className="bg-surface-container-high text-on-surface px-6 py-2.5 rounded-lg font-semibold text-sm hover:bg-surface-container-highest transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">edit</span>
            Edit Profile
          </button>
        </section>

        <div className="space-y-12">
          {/* Account Details */}
          <div className="bg-surface-container-lowest rounded-xl p-8">
            <h2 className="text-xl font-bold tracking-tight mb-8">Account Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Email Address</label>
                <div className="bg-surface-container-high p-4 rounded-lg text-on-surface font-medium border-l-2 border-transparent">
                  {user.email}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Phone Number</label>
                <div className="bg-surface-container-high p-4 rounded-lg text-on-surface font-medium border-l-2 border-transparent">
                  {user.phone ?? "Not set"}
                </div>
              </div>
              <div className="col-span-full space-y-4 pt-4">
                <label className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Notification Preferences</label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-on-surface-variant">mail</span>
                      <span className="text-sm font-medium">Critical Performance Alerts</span>
                    </div>
                    <div className="w-10 h-5 bg-primary rounded-full relative">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-on-surface-variant">sms</span>
                      <span className="text-sm font-medium">Tenant Communication Summaries</span>
                    </div>
                    <div className="w-10 h-5 bg-surface-container-highest rounded-full relative">
                      <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Access */}
          <div className="bg-surface-container-lowest rounded-xl shadow-[0px_20px_40px_rgba(25,28,30,0.06)] p-8 border-t-4 border-on-surface">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold tracking-tight">Security &amp; Access</h2>
              <div className="bg-surface-container-low px-4 py-2 rounded-lg flex items-center gap-3">
                <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant">Current Active Session</p>
                <span className="text-xs font-bold text-emerald-500">Active Session</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-center justify-between p-6 bg-surface-container-low rounded-xl border border-outline-variant/20">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-surface-container rounded-lg flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-2xl">lock</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Password Control</p>
                    <p className="text-xs text-on-surface-variant">Last changed 4 months ago</p>
                  </div>
                </div>
                <button
                  onClick={handleResetPassword}
                  disabled={resetting}
                  className="text-xs font-bold text-primary hover:bg-primary/5 px-4 py-2 rounded-lg border border-primary/20 transition-colors disabled:opacity-50"
                >
                  {resetting ? "Sending..." : "Reset Password"}
                </button>
              </div>
              <div className="flex items-center justify-between p-6 bg-emerald-50/30 rounded-xl border border-emerald-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold">Two-Factor Authentication</p>
                    <p className="text-xs text-emerald-600 font-medium">Enabled &amp; Secure</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 px-4 py-2 rounded-lg border border-emerald-200">Enabled</span>
              </div>
            </div>
            {resetMsg && (
              <div className={`mt-4 px-4 py-3 rounded-lg text-sm font-medium ${resetMsg.startsWith("Error") ? "bg-error-container text-on-error-container" : "bg-success-container text-on-success-container"}`}>
                {resetMsg}
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="max-w-3xl mx-auto pt-8">
            <div className="bg-error-container/10 rounded-xl p-10 border border-error/10 text-center">
              <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6 text-error">
                <span className="material-symbols-outlined text-3xl">warning</span>
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2">Account Finality</h3>
              <p className="text-on-surface-variant text-sm mb-8 max-w-md mx-auto">Deactivating your The Wealth Architect account will cease all autonomous operations and revoke access to historical performance logs.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => setShowDeactivateDialog(true)} className="w-full sm:w-auto px-8 py-3 bg-surface-container-lowest text-error border border-error/30 text-xs font-bold rounded-lg hover:bg-error/5 transition-colors uppercase tracking-widest">Deactivate The Wealth Architect</button>
                <button onClick={() => setShowCloseDialog(true)} className="w-full sm:w-auto px-8 py-3 text-on-surface-variant text-[10px] font-bold uppercase tracking-widest hover:text-error transition-colors">Close Agent Account</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deactivate Confirm Dialog */}
      <ConfirmDialog
        open={showDeactivateDialog}
        onClose={() => setShowDeactivateDialog(false)}
        onConfirm={handleDeactivate}
        title="Deactivate The Wealth Architect"
        description="This will deactivate your The Wealth Architect AI assistant and sign you out. All autonomous operations will cease. You can reactivate by signing in again."
        confirmLabel="Deactivate"
        loading={deactivating}
      />

      {/* Close Account Confirm Dialog */}
      <ConfirmDialog
        open={showCloseDialog}
        onClose={() => setShowCloseDialog(false)}
        onConfirm={handleDeactivate}
        title="Close Agent Account"
        description="This will permanently close your The Wealth Architect account and sign you out. All data and configuration will be lost. This action cannot be undone."
        confirmLabel="Close Account"
        loading={deactivating}
      />

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-on-surface/50" onClick={() => setShowEditModal(false)} />
          <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-on-surface">Edit Profile</h2>
              <button onClick={() => setShowEditModal(false)} className="text-outline hover:text-on-surface transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Full Name</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 text-on-surface transition-all"
                  type="text"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Email Address</label>
                <div className="w-full bg-surface-container-high p-3 rounded-lg text-outline text-sm">
                  {user.email}
                  <span className="text-xs ml-2">(managed by auth provider)</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-2">Phone Number</label>
                <input
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-surface-container-low border-0 border-l-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-3 text-on-surface transition-all"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            {saveError && (
              <div className="mt-4 bg-error-container text-on-error-container rounded-lg px-4 py-2 text-sm">
                {saveError}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-2.5 bg-surface-container-high text-on-surface rounded-lg font-semibold text-sm hover:bg-surface-container-highest transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !editName.trim()}
                className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-bold text-sm shadow-lg shadow-primary/10 hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
