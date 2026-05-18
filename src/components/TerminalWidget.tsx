"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const PROMPT = "kartikey@aws:~$";
const TYPE_SPEED = 55;
const OUTPUT_LINE_DELAY = 120;
const PAUSE_AFTER_OUTPUT = 2200;
const PAUSE_BEFORE_NEXT = 600;

const COMMANDS: { cmd: string; output: { text: string; color?: string }[] }[] =
  [
    {
      cmd: "whoami",
      output: [
        { text: "kartikey-tripathi", color: "text-amber-400" },
        { text: "Cloud & DevOps Engineer @ AWS", color: "text-blue-300" },
        { text: "6.5+ yrs · EKS · Kubernetes · Terraform · AWS", color: "text-gray-400" },
      ],
    },
    {
      cmd: "kubectl get nodes",
      output: [
        { text: "NAME                           STATUS   ROLES    AGE   VERSION", color: "text-blue-300" },
        { text: "ip-10-0-1-42.ec2.internal      Ready    <none>   18d   v1.31.2", color: "text-emerald-400" },
        { text: "ip-10-0-2-87.ec2.internal      Ready    <none>   18d   v1.31.2", color: "text-emerald-400" },
        { text: "ip-10-0-3-15.ec2.internal      Ready    <none>   18d   v1.31.2", color: "text-emerald-400" },
      ],
    },
    {
      cmd: "kubectl get pods -n production",
      output: [
        { text: "NAME                           READY   STATUS    RESTARTS   AGE", color: "text-blue-300" },
        { text: "api-server-7d6f9b8c4-xk2pq    1/1     Running   0          2d", color: "text-emerald-400" },
        { text: "worker-6c8b9d7f5-mn4rs         1/1     Running   0          2d", color: "text-emerald-400" },
        { text: "redis-0                        1/1     Running   0          5d", color: "text-emerald-400" },
      ],
    },
    {
      cmd: "terraform plan",
      output: [
        { text: "Refreshing state...", color: "text-gray-400" },
        { text: "─────────────────────────────────────────────", color: "text-gray-600" },
        { text: "Plan: 3 to add, 1 to change, 0 to destroy.", color: "text-amber-400" },
        { text: "Apply complete! Resources: 3 added, 1 changed.", color: "text-emerald-400" },
      ],
    },
    {
      cmd: "aws eks describe-cluster --name prod-cluster",
      output: [
        { text: "{", color: "text-gray-300" },
        { text: '  "name":    "prod-cluster",', color: "text-blue-300" },
        { text: '  "status":  "ACTIVE",', color: "text-emerald-400" },
        { text: '  "version": "1.31"', color: "text-amber-400" },
        { text: "}", color: "text-gray-300" },
      ],
    },
  ];

type HistoryEntry = {
  cmd: string;
  output: { text: string; color?: string }[];
};

export function TerminalWidget() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [typedCmd, setTypedCmd] = useState("");
  const [visibleOutputLines, setVisibleOutputLines] = useState(0);
  const [phase, setPhase] = useState<"typing" | "output" | "pause">("typing");
  const [cmdIndex, setCmdIndex] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever content changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, typedCmd, visibleOutputLines]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    const currentCmd = COMMANDS[cmdIndex];

    if (phase === "typing") {
      if (typedCmd.length < currentCmd.cmd.length) {
        timeout = setTimeout(() => {
          setTypedCmd(currentCmd.cmd.slice(0, typedCmd.length + 1));
        }, TYPE_SPEED);
      } else {
        timeout = setTimeout(() => {
          setPhase("output");
          setVisibleOutputLines(0);
        }, 400);
      }
    } else if (phase === "output") {
      if (visibleOutputLines < currentCmd.output.length) {
        timeout = setTimeout(() => {
          setVisibleOutputLines((n) => n + 1);
        }, OUTPUT_LINE_DELAY);
      } else {
        timeout = setTimeout(() => {
          setPhase("pause");
        }, PAUSE_AFTER_OUTPUT);
      }
    } else if (phase === "pause") {
      const nextIndex = (cmdIndex + 1) % COMMANDS.length;
      // If we've looped, clear history to avoid growing forever
      if (nextIndex === 0) {
        timeout = setTimeout(() => {
          setHistory([]);
          setTypedCmd("");
          setCmdIndex(0);
          setPhase("typing");
        }, PAUSE_BEFORE_NEXT);
      } else {
        timeout = setTimeout(() => {
          setHistory((prev) => [
            ...prev,
            { cmd: currentCmd.cmd, output: currentCmd.output },
          ]);
          setCmdIndex(nextIndex);
          setTypedCmd("");
          setPhase("typing");
        }, PAUSE_BEFORE_NEXT);
      }
    }

    return () => clearTimeout(timeout);
  }, [phase, typedCmd, visibleOutputLines, cmdIndex]);

  const currentCmd = COMMANDS[cmdIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="mb-16 w-full md:w-[90%] lg:w-[80%] xl:w-[78%] mx-auto"
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-800/80 rounded-t-xl border border-blue-500/30 border-b-gray-700/50">
        <span className="w-3 h-3 rounded-full bg-red-500/80" />
        <span className="w-3 h-3 rounded-full bg-amber-400/80" />
        <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
        <span className="ml-3 text-xs text-gray-400 font-mono select-none">
          kartikey@aws — zsh
        </span>
      </div>

      {/* Terminal body */}
      <div className="bg-gray-950/90 border border-blue-500/30 border-t-0 rounded-b-xl p-4 font-mono text-sm leading-relaxed min-h-[220px] max-h-[320px] overflow-y-auto scrollbar-none">
        {/* Completed history */}
        {history.map((entry, i) => (
          <div key={i} className="mb-3">
            <div className="flex gap-2">
              <span className="text-emerald-400 shrink-0">{PROMPT}</span>
              <span className="text-gray-100">{entry.cmd}</span>
            </div>
            {entry.output.map((line, j) => (
              <div key={j} className={`pl-0 ${line.color ?? "text-gray-300"}`}>
                {line.text}
              </div>
            ))}
          </div>
        ))}

        {/* Active command line */}
        <div className="flex gap-2">
          <span className="text-emerald-400 shrink-0">{PROMPT}</span>
          <span className="text-gray-100">{typedCmd}</span>
          {phase === "typing" && (
            <span className="animate-pulse text-amber-400">▋</span>
          )}
        </div>

        {/* Active output lines */}
        {phase !== "typing" &&
          currentCmd.output.slice(0, visibleOutputLines).map((line, i) => (
            <div key={i} className={line.color ?? "text-gray-300"}>
              {line.text}
            </div>
          ))}

        {/* Idle cursor after output */}
        {phase === "pause" && (
          <div className="flex gap-2 mt-3">
            <span className="text-emerald-400 shrink-0">{PROMPT}</span>
            <span className="animate-pulse text-amber-400">▋</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </motion.div>
  );
}
