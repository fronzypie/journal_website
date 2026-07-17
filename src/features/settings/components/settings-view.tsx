"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AppShell } from "@/components/layout/app-shell";
import { Reveal } from "@/features/journal/components/reveal";
import { motionEase } from "@/lib/motion";

type SettingsTheme = "dawn" | "dark" | "paper";

type NotificationSettings = {
  digest: boolean;
  email: boolean;
  reminders: boolean;
  streak: boolean;
};

type PrivacySettings = {
  analytics: boolean;
  discoverable: boolean;
  shareStats: boolean;
};

type SettingsViewProps = {
  accountCreatedAt: string;
  email: string;
  fullName: string;
  userId: string;
};

type ExportPayload = {
  account: {
    createdAt: string;
    email: string;
    fullName: string;
    userId: string;
  };
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  theme: SettingsTheme;
  exportedAt: string;
};

const themeOptions: Array<{
  accent: string;
  description: string;
  label: string;
  value: SettingsTheme;
}> = [
  {
    value: "dark",
    label: "Night",
    description: "Original low-light journal palette.",
    accent: "bg-ink",
  },
  {
    value: "dawn",
    label: "Dawn",
    description: "Warm, soft contrast for early writing.",
    accent: "bg-amber",
  },
  {
    value: "paper",
    label: "Paper",
    description: "A lighter reading surface with quiet warmth.",
    accent: "bg-blue",
  },
];

const defaultNotifications: NotificationSettings = {
  digest: true,
  email: true,
  reminders: false,
  streak: true,
};

const defaultPrivacy: PrivacySettings = {
  analytics: false,
  discoverable: false,
  shareStats: false,
};

function readJSON<T>(key: string, fallback: T) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function SettingsView({
  accountCreatedAt,
  email,
  fullName,
  userId,
}: SettingsViewProps) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const { loading, signOut, updatePassword, updateProfile } = useAuth();
  const [name, setName] = useState(fullName);
  const [password, setPassword] = useState("");
  const [theme, setTheme] = useState<SettingsTheme>("dark");
  const [notifications, setNotifications] = useState<NotificationSettings>(defaultNotifications);
  const [privacy, setPrivacy] = useState<PrivacySettings>(defaultPrivacy);
  const [message, setMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    const storedTheme = readJSON<SettingsTheme>("journal-theme", "dark");
    const storedNotifications = readJSON<NotificationSettings>(
      "journal-notifications",
      defaultNotifications,
    );
    const storedPrivacy = readJSON<PrivacySettings>("journal-privacy", defaultPrivacy);

    setTheme(storedTheme);
    setNotifications(storedNotifications);
    setPrivacy(storedPrivacy);
    setThemeLoaded(true);
  }, []);

  useEffect(() => {
    if (!themeLoaded) {
      return;
    }

    document.documentElement.dataset.theme = theme;
    writeJSON("journal-theme", theme);
  }, [theme, themeLoaded]);

  useEffect(() => {
    if (!themeLoaded) {
      return;
    }

    writeJSON("journal-notifications", notifications);
  }, [notifications, themeLoaded]);

  useEffect(() => {
    if (!themeLoaded) {
      return;
    }

    writeJSON("journal-privacy", privacy);
  }, [privacy, themeLoaded]);

  const accountInfo = useMemo(
    () => [
      ["User ID", userId],
      ["Email", email],
      ["Joined", new Date(accountCreatedAt).toLocaleDateString("en", { dateStyle: "long" })],
    ],
    [accountCreatedAt, email, userId],
  );

  function handleThemeChange(nextTheme: SettingsTheme) {
    setTheme(nextTheme);
    setMessage(`Theme switched to ${nextTheme}.`);
  }

  async function handleProfileSave() {
    setProfileMessage(null);
    const result = await updateProfile(name.trim());

    if (result.error) {
      setProfileMessage(result.error);
      return;
    }

    setProfileMessage("Profile updated.");
  }

  async function handlePasswordSave() {
    setPasswordMessage(null);
    const trimmed = password.trim();

    if (!trimmed) {
      setPasswordMessage("Enter a new password first.");
      return;
    }

    const result = await updatePassword(trimmed);
    if (result.error) {
      setPasswordMessage(result.error);
      return;
    }

    setPassword("");
    setPasswordMessage("Password updated.");
  }

  function handleExport() {
    const payload: ExportPayload = {
      account: {
        createdAt: accountCreatedAt,
        email,
        fullName: name,
        userId,
      },
      notifications,
      privacy,
      theme,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "aster-journal-settings.json";
    link.click();
    URL.revokeObjectURL(url);
    setMessage("Settings exported.");
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Delete your account? This will remove the Supabase user and clear local settings.",
    );

    if (!confirmed) {
      return;
    }

    setDeleteMessage(null);
    setDeletingAccount(true);

    const response = await fetch("/api/account/delete", {
      method: "DELETE",
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      setDeleteMessage(
        payload?.error ?? "We could not delete the account right now. Please try again.",
      );
      setDeletingAccount(false);
      return;
    }

    window.localStorage.removeItem("journal-theme");
    window.localStorage.removeItem("journal-notifications");
    window.localStorage.removeItem("journal-privacy");
    window.localStorage.removeItem(`journal-collections`);
    window.localStorage.removeItem(`journal-editor:${userId}`);

    await signOut();
    router.push("/");
    setDeletingAccount(false);
  }

  const sectionTransition = {
    duration: reducedMotion ? 0 : 0.35,
    ease: motionEase,
  };

  return (
    <AppShell>
      <section className="py-6">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-end">
            <div>
              <p className="ds-caption">Settings</p>
              <h1 className="mt-3 max-w-4xl text-5xl font-semibold leading-none text-porcelain sm:text-7xl lg:text-8xl">
                Shape the journal around how you like to live in it.
              </h1>
              <p className="ds-text-body mt-6 max-w-2xl text-lg sm:text-xl">
                Profile, password, theme, notifications, privacy, export, and account details all stay in one calm place.
              </p>
            </div>

            <Card className="p-5 sm:p-6" variant="elevated">
              <p className="ds-caption">Account information</p>
              <div className="mt-4 space-y-3">
                {accountInfo.map(([label, value]) => (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4" key={label}>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">{label}</p>
                    <p className="mt-2 break-all text-sm text-porcelain">{value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </Reveal>
      </section>

      <section className="grid gap-6 pb-16 pt-2 lg:grid-cols-[1.06fr_0.94fr]">
        <div className="space-y-5">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            transition={sectionTransition}
          >
            <Card className="p-5 sm:p-6" variant="quiet">
              <p className="ds-caption">Profile</p>
              <h2 className="mt-3 text-2xl font-semibold text-porcelain">Keep your name current.</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="ds-caption block">Display name</label>
                  <Input
                    className="mt-2"
                    onChange={(event) => setName(event.target.value)}
                    value={name}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="ds-caption block">Email</label>
                  <Input className="mt-2" disabled value={email} />
                </div>
              </div>
              {profileMessage ? (
                <p className="mt-4 text-sm text-muted-strong" role="status">
                  {profileMessage}
                </p>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-3">
                <Button onClick={() => void handleProfileSave()}>Save profile</Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            transition={{ ...sectionTransition, delay: 0.05 }}
          >
            <Card className="p-5 sm:p-6" variant="frosted">
              <p className="ds-caption">Password</p>
              <h2 className="mt-3 text-2xl font-semibold text-porcelain">Change your sign-in key.</h2>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="ds-caption block">New password</label>
                  <Input
                    className="mt-2"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter a new password"
                    type="password"
                    value={password}
                  />
                </div>
                {passwordMessage ? (
                  <p className="text-sm text-muted-strong" role="status">
                    {passwordMessage}
                  </p>
                ) : null}
                <div className="flex flex-wrap gap-3">
                  <Button onClick={() => void handlePasswordSave()}>Update password</Button>
                  <Button
                    onClick={() => setPassword("")}
                    variant="ghost"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            transition={{ ...sectionTransition, delay: 0.1 }}
          >
            <Card className="p-5 sm:p-6" variant="outline">
              <p className="ds-caption">Theme</p>
              <h2 className="mt-3 text-2xl font-semibold text-porcelain">Choose the atmosphere.</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {themeOptions.map((option) => (
                  <button
                    aria-pressed={theme === option.value}
                    className={`group rounded-[1.25rem] border p-4 text-left transition-transform duration-300 hover:-translate-y-0.5 ${theme === option.value ? "border-white/20 bg-white/[0.08]" : "border-white/10 bg-white/[0.03]"}`}
                    key={option.value}
                    onClick={() => handleThemeChange(option.value)}
                    type="button"
                  >
                    <div className={`h-10 w-10 rounded-full ${option.accent}`} />
                    <p className="mt-4 text-lg font-medium text-porcelain">{option.label}</p>
                    <p className="mt-2 text-sm leading-6 text-muted-strong">{option.description}</p>
                  </button>
                ))}
              </div>
              {message ? (
                <p className="mt-4 text-sm text-muted-strong" role="status">
                  {message}
                </p>
              ) : null}
            </Card>
          </motion.div>
        </div>

        <div className="space-y-5">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            transition={{ ...sectionTransition, delay: 0.12 }}
          >
            <Card className="p-5 sm:p-6" variant="elevated">
              <p className="ds-caption">Notifications</p>
              <h2 className="mt-3 text-2xl font-semibold text-porcelain">Control the quiet pings.</h2>
              <div className="mt-4 space-y-3">
                {[
                  ["Email digests", "digest"],
                  ["Reminder nudges", "reminders"],
                  ["Streak reminders", "streak"],
                  ["Security email alerts", "email"],
                ].map(([label, key]) => (
                  <button
                    aria-pressed={notifications[key as keyof NotificationSettings]}
                    className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 text-left"
                    key={key}
                    onClick={() =>
                      setNotifications((current) => ({
                        ...current,
                        [key]: !current[key as keyof NotificationSettings],
                      }))
                    }
                    type="button"
                  >
                    <span className="text-sm text-porcelain">{label}</span>
                    <span className={`h-5 w-9 rounded-full transition-colors ${notifications[key as keyof NotificationSettings] ? "bg-sage" : "bg-white/15"}`} />
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            transition={{ ...sectionTransition, delay: 0.16 }}
          >
            <Card className="p-5 sm:p-6" variant="quiet">
              <p className="ds-caption">Privacy</p>
              <h2 className="mt-3 text-2xl font-semibold text-porcelain">Control how much you keep visible.</h2>
              <div className="mt-4 space-y-3">
                {[
                  ["Usage analytics", "analytics"],
                  ["Public discovery", "discoverable"],
                  ["Share anonymized stats", "shareStats"],
                ].map(([label, key]) => (
                  <button
                    aria-pressed={privacy[key as keyof PrivacySettings]}
                    className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-left"
                    key={key}
                    onClick={() =>
                      setPrivacy((current) => ({
                        ...current,
                        [key]: !current[key as keyof PrivacySettings],
                      }))
                    }
                    type="button"
                  >
                    <span className="text-sm text-porcelain">{label}</span>
                    <span className={`h-5 w-9 rounded-full transition-colors ${privacy[key as keyof PrivacySettings] ? "bg-amber" : "bg-white/15"}`} />
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            transition={{ ...sectionTransition, delay: 0.2 }}
          >
            <Card className="p-5 sm:p-6" variant="outline">
              <p className="ds-caption">Export data</p>
              <h2 className="mt-3 text-2xl font-semibold text-porcelain">Take your settings with you.</h2>
              <p className="ds-text-body mt-3 text-sm">
                Download a JSON snapshot of your current account, theme, privacy, and notification preferences.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button onClick={handleExport}>Export data</Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            transition={{ ...sectionTransition, delay: 0.24 }}
          >
            <Card className="p-5 sm:p-6" variant="quiet">
              <p className="ds-caption">Delete account</p>
              <h2 className="mt-3 text-2xl font-semibold text-porcelain">Remove this journal space.</h2>
              <p className="ds-text-body mt-3 text-sm">
                This removes the authenticated user through Supabase, then clears local preferences and signs you out.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button disabled={loading || deletingAccount} onClick={() => void handleDeleteAccount()} variant="danger">
                  {deletingAccount ? "Deleting..." : "Delete account"}
                </Button>
              </div>
              {deleteMessage ? (
                <p className="mt-4 text-sm text-rose" role="alert">
                  {deleteMessage}
                </p>
              ) : null}
            </Card>
          </motion.div>
        </div>
      </section>
    </AppShell>
  );
}
