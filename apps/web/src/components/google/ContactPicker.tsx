"use client";

import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Loader2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useErrorToast } from "@/hooks/use-error-toast";

export interface GooglePickerContact {
  resourceName: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
}

interface ContactsResponse {
  contacts?: GooglePickerContact[];
  error?: string;
}

interface ContactPickerProps {
  onSelect: (contact: GooglePickerContact) => void;
  trigger?: React.ReactNode;
}

function contactSearchText(contact: GooglePickerContact): string {
  return [contact.name, contact.email, contact.company, contact.title]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function ContactPicker({ onSelect, trigger }: ContactPickerProps) {
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState<GooglePickerContact[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsConnection, setNeedsConnection] = useState(false);
  const showErrorToast = useErrorToast();

  const loadContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNeedsConnection(false);

    try {
      const response = await fetch("/api/google/contacts?limit=200");
      const data = (await response
        .json()
        .catch(() => ({}))) as ContactsResponse;

      if (!response.ok) {
        const message = data.error || "Failed to load contacts";
        setError(message);
        setNeedsConnection(message === "Google account not connected");
        return;
      }

      setContacts(data.contacts || []);
    } catch (err) {
      showErrorToast(err, {
        title: "Could not load Google contacts",
        fallbackDescription:
          "Please check your Google connection and try again.",
      });
      setError("Failed to load contacts from Google");
    } finally {
      setLoading(false);
    }
  }, [showErrorToast]);

  useEffect(() => {
    if (open) {
      void loadContacts();
    }
  }, [open, loadContacts]);

  const filteredContacts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return contacts;
    return contacts.filter((contact) =>
      contactSearchText(contact).includes(normalized),
    );
  }, [contacts, query]);

  function handleSelect(contact: GooglePickerContact) {
    onSelect(contact);
    setOpen(false);
    setQuery("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Users className="mr-2 h-4 w-4" />
            Add from Google
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Select Google Contact
          </DialogTitle>
          <DialogDescription>
            Choose a contact to attach to this opportunity.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search contacts"
              className="pl-9"
            />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">
                Loading contacts...
              </p>
            </div>
          ) : error ? (
            <div className="py-8 text-center">
              <p className="text-sm text-destructive">{error}</p>
              <div className="mt-4 flex justify-center gap-2">
                {needsConnection ? (
                  <Button asChild variant="outline" size="sm">
                    <a href="/settings">Open Settings</a>
                  </Button>
                ) : null}
                <Button variant="outline" size="sm" onClick={loadContacts}>
                  Try Again
                </Button>
              </div>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                {contacts.length === 0
                  ? "No contacts found. Reconnect Google in Settings if you connected before contacts support."
                  : "No contacts match your search."}
              </p>
            </div>
          ) : (
            <div className="max-h-[400px] space-y-1 overflow-y-auto">
              {filteredContacts.map((contact) => (
                <button
                  key={contact.resourceName}
                  type="button"
                  onClick={() => handleSelect(contact)}
                  className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                    {contact.name.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {contact.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {[contact.email, contact.company]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
