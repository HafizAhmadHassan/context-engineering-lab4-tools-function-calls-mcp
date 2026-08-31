"use client";

import * as React from "react";
import { X } from "lucide-react";
import { useLab } from "@/providers/lab-provider";
import type { ApiKeys } from "@/providers/lab-provider";

interface ApiKeysModalProps {
  open: boolean;
  onClose: () => void;
}

export function ApiKeysModal({ open, onClose }: ApiKeysModalProps) {
  if (!open) return null;
  return <ApiKeyForm key="api-form" onClose={onClose} />;
}

function ApiKeyForm({ onClose }: { onClose: () => void }) {
  const { apiKeys, setApiKeys } = useLab();
  const [gemini, setGemini] = React.useState(apiKeys.gemini ?? "");
  const [openai, setOpenai] = React.useState(apiKeys.openai ?? "");

  const save = () => {
    const next: ApiKeys = {
      gemini: gemini.trim() || undefined,
      openai: openai.trim() || undefined,
    };
    setApiKeys(next);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2 flex items-start justify-between">
          <h2 className="text-lg font-bold">API Keys</h2>
          <button
            type="button"
            onClick={onClose}
            title="Close"
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mb-4 text-sm text-foreground/70">
          Optional — Labs 1 &amp; 3 are enhanced with an API key. Lab 2 works
          without one.
        </p>

        <label className="mb-1 block text-sm font-medium">Gemini API Key</label>
        <div className="mb-2 text-xs text-muted-foreground">
          (free tier available)
        </div>
        <input
          type="password"
          placeholder="AIza..."
          value={gemini}
          onChange={(e) => setGemini(e.target.value)}
          className="mb-4 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
        />

        <label className="mb-1 block text-sm font-medium">OR OpenAI API Key</label>
        <input
          type="password"
          placeholder="sk-..."
          value={openai}
          onChange={(e) => setOpenai(e.target.value)}
          className="mb-6 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm transition-colors hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={save}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:brightness-110"
          >
            Save Keys
          </button>
        </div>
      </div>
    </div>
  );
}
