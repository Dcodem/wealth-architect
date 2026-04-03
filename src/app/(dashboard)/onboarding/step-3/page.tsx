"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type TaskStatus = "complete" | "in-progress" | "pending";

interface Task {
  label: string;
  status: TaskStatus;
}

const INITIAL_TASKS: Task[] = [
  { label: "Categorizing Transactions", status: "complete" },
  { label: "Detecting Properties", status: "in-progress" },
  { label: "Flagging Anomalies", status: "pending" },
];

export default function OnboardingStep3() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [showContinue, setShowContinue] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => {
      setTasks((prev) =>
        prev.map((t, i) =>
          i === 1 ? { ...t, status: "complete" } : i === 2 ? { ...t, status: "in-progress" } : t
        )
      );
    }, 2500);

    const t2 = setTimeout(() => {
      setTasks((prev) => prev.map((t) => ({ ...t, status: "complete" })));
    }, 4500);

    const t3 = setTimeout(() => {
      setShowContinue(true);
    }, 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  const allDone = tasks.every((t) => t.status === "complete");

  const statusIcon = (status: TaskStatus) => {
    switch (status) {
      case "complete":
        return (
          <span
            aria-hidden="true"
            className="material-symbols-outlined text-on-success-container"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
        );
      case "in-progress":
        return (
          <span aria-hidden="true" className="material-symbols-outlined text-primary animate-spin">
            progress_activity
          </span>
        );
      case "pending":
        return (
          <span aria-hidden="true" className="material-symbols-outlined text-on-surface-variant">
            schedule
          </span>
        );
    }
  };

  const statusLabel = (status: TaskStatus) => {
    switch (status) {
      case "complete":
        return <span className="text-xs font-semibold uppercase tracking-wider text-on-success-container">Complete</span>;
      case "in-progress":
        return <span className="text-xs font-semibold uppercase tracking-wider text-primary">In Progress</span>;
      case "pending":
        return <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Pending</span>;
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="bg-surface-container-lowest rounded-xl shadow-[0_12px_32px_rgba(20,27,43,0.04)] overflow-hidden relative border border-outline-variant/10">
          {/* Atmospheric Background */}
          <div
            className="absolute top-0 right-0 w-64 h-64 -mr-32 -mt-32 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(15, 118, 110, 0.15) 0%, rgba(15, 118, 110, 0) 70%)",
            }}
          />

          <div className="p-10 md:p-14 flex flex-col items-center text-center relative z-10">
            {/* Step Indicator */}
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-primary text-white">1</div>
              <div className="w-10 h-1 rounded-full bg-primary/40" />
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-primary text-white">2</div>
              <div className="w-10 h-1 rounded-full bg-primary/40" />
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-primary/40 text-primary">3</div>
              <div className="w-10 h-1 rounded-full bg-outline-variant/40" />
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-surface-container-high text-on-surface-variant">4</div>
            </div>

            {/* Back + Logo */}
            <div className="w-full flex items-center justify-between mb-8">
              <Link
                href="/onboarding/step-2"
                className="flex items-center gap-1 text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                Back
              </Link>
              <span className="text-lg font-extrabold tracking-tight text-primary">
                The Wealth Architect
              </span>
              <div className="w-14" />
            </div>

            {/* Processing Visualization */}
            <div className="mb-10 relative">
              {allDone ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-24 h-24 rounded-full bg-success-container flex items-center justify-center"
                >
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-on-success-container text-4xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                </motion.div>
              ) : (
                <>
                  <div className="w-24 h-24 rounded-full border-4 border-surface-container-high border-t-primary animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span aria-hidden="true" className="material-symbols-outlined text-primary text-3xl">
                      cognition
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Header */}
            <div className="space-y-3 mb-12">
              <h1 className="font-bold text-3xl md:text-4xl text-on-surface tracking-tight">
                {allDone ? "Analysis Complete" : "AI is Processing Your Data"}
              </h1>
              <p className="text-on-surface-variant text-lg">
                {allDone
                  ? "Your portfolio has been analyzed and is ready to explore"
                  : "Analyzing your records for properties and trends"}
              </p>
            </div>

            {/* Status Rows */}
            <div className="w-full max-w-sm space-y-4 mb-10">
              {tasks.map((task) => (
                <motion.div
                  key={task.label}
                  layout
                  className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                    task.status === "in-progress"
                      ? "bg-surface-container-lowest border border-primary/20 shadow-sm"
                      : task.status === "complete"
                      ? "bg-surface-container-low"
                      : "bg-surface-container-low opacity-60"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {statusIcon(task.status)}
                    <span className="font-medium text-on-surface">{task.label}</span>
                  </div>
                  {statusLabel(task.status)}
                </motion.div>
              ))}
            </div>

            {/* Continue / Skip */}
            <AnimatePresence>
              {showContinue ? (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <Link
                    href="/onboarding/step-4"
                    className="px-8 py-3.5 bg-gradient-to-br from-primary to-primary-container text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all text-sm"
                  >
                    Continue to Dashboard Setup
                  </Link>
                  <div className="flex items-center gap-2 text-on-surface-variant/70 bg-surface-container-high/40 px-5 py-2 rounded-full">
                    <span aria-hidden="true" className="material-symbols-outlined text-sm text-on-success-container">cloud_done</span>
                    <p className="text-xs font-medium">Any remaining analysis will continue in the background</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="flex items-center space-x-2 text-on-surface-variant/80 bg-surface-container-high/40 px-6 py-2 rounded-full">
                    <span aria-hidden="true" className="material-symbols-outlined text-sm">timer</span>
                    <p className="text-sm font-medium">Estimated time: ~2 minutes</p>
                  </div>
                  <Link
                    href="/onboarding/step-4?empty=1"
                    className="mt-2 text-xs font-semibold text-primary/70 hover:text-primary transition-colors underline underline-offset-2"
                  >
                    Skip — I&apos;ll let this run in the background
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-1 w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>
      </div>

      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[5%] w-[30rem] h-[30rem] bg-secondary/5 blur-[120px] rounded-full" />
      </div>
    </div>
  );
}
