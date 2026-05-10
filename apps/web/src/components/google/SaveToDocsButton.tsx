"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useErrorToast } from "@/hooks/use-error-toast";

interface SaveToDocsButtonProps {
  title: string;
  content: string;
  onSuccess?: (result: { documentId: string; documentUrl: string }) => void;
}

export function SaveToDocsButton({
  title,
  content,
  onSuccess,
}: SaveToDocsButtonProps) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean | null>(null);
  const showErrorToast = useErrorToast();

  useEffect(() => {
    checkConnection();
  }, []);

  async function checkConnection() {
    try {
      const res = await fetch("/api/google/auth");
      const data = await res.json();
      setConnected(data.connected);
    } catch {
      setConnected(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/google/docs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      const data = await res.json();

      if (data.success) {
        setSaved(true);
        onSuccess?.({
          documentId: data.documentId,
          documentUrl: data.documentUrl,
        });
      } else {
        setError(data.error || "Failed to create document");
      }
    } catch (err) {
      showErrorToast(err, {
        title: "Could not save to Docs",
        fallbackDescription: "Please check your Google connection and try again.",
      });
      setError("Failed to save to Google Docs");
    } finally {
      setSaving(false);
    }
  }

  if (connected === false) {
    return null;
  }

  if (connected === null) {
    return (
      <Button variant="outline" disabled>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Checking...
      </Button>
    );
  }

  if (saved) {
    return (
      <Button variant="outline" className="text-success" disabled>
        <CheckCircle className="h-4 w-4 mr-2" />
        Saved to Docs
      </Button>
    );
  }

  if (error) {
    return (
      <Button variant="outline" onClick={handleSave} disabled={saving}>
        <AlertCircle className="h-4 w-4 mr-2" />
        Retry
      </Button>
    );
  }

  return (
    <Button variant="outline" onClick={handleSave} disabled={saving}>
      {saving ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <FileText className="h-4 w-4 mr-2" />
      )}
      {saving ? "Saving..." : "Save to Docs"}
    </Button>
  );
}
