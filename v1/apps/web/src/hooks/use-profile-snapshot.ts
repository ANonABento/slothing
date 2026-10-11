"use client";

import { useEffect, useState } from "react";
import { getProfileInitials } from "@/lib/profile-form";
import type { Profile } from "@/types";

export interface ProfileSnapshot {
  name: string;
  firstName: string;
  avatarUrl: string;
  initials: string;
}

const EMPTY_SNAPSHOT: ProfileSnapshot = {
  name: "",
  firstName: "Your profile",
  avatarUrl: "",
  initials: "P",
};

let cachedSnapshot: ProfileSnapshot | null = null;
let inFlight: Promise<ProfileSnapshot> | null = null;

/**
 * Treat obviously-placeholder URLs as empty so the avatar pills fall
 * back to initials without firing a network request that 404s and
 * fills the console with ERR_NAME_NOT_RESOLVED. Covers the dev seed
 * fixture (example.com/avatar.png) plus any future placeholder hosts.
 */
function sanitizeAvatarUrl(raw: string | undefined | null): string {
  const trimmed = raw?.trim() ?? "";
  if (!trimmed) return "";
  try {
    const url = new URL(trimmed);
    const placeholderHosts = new Set([
      "example.com",
      "www.example.com",
      "example.org",
      "placeholder.com",
    ]);
    if (placeholderHosts.has(url.hostname.toLowerCase())) return "";
  } catch {
    // Not a parseable URL — let it through; the <img onError> handler
    // hides the broken-image glyph if it fails to load anyway.
  }
  return trimmed;
}

function toSnapshot(profile: Profile | null): ProfileSnapshot {
  const name = profile?.contact?.name?.trim() ?? "";
  const firstName = name.split(/\s+/)[0] || "Your profile";

  return {
    name,
    firstName,
    avatarUrl: sanitizeAvatarUrl(profile?.contact?.avatarUrl),
    initials: getProfileInitials(name),
  };
}

async function fetchProfileSnapshot(): Promise<ProfileSnapshot> {
  inFlight ??= fetch("/api/profile")
    .then(async (response) => {
      if (!response.ok) throw new Error("Could not load profile");
      const data = (await response.json()) as { profile: Profile | null };
      cachedSnapshot = toSnapshot(data.profile);
      return cachedSnapshot;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

export function useProfileSnapshot(): ProfileSnapshot {
  const [snapshot, setSnapshot] = useState<ProfileSnapshot>(
    cachedSnapshot ?? EMPTY_SNAPSHOT,
  );

  useEffect(() => {
    let cancelled = false;

    function refresh() {
      void fetchProfileSnapshot()
        .then((next) => {
          if (!cancelled) setSnapshot(next);
        })
        .catch(() => {
          if (!cancelled) setSnapshot(cachedSnapshot ?? EMPTY_SNAPSHOT);
        });
    }

    refresh();
    window.addEventListener("taida:profile:updated", refresh);
    return () => {
      cancelled = true;
      window.removeEventListener("taida:profile:updated", refresh);
    };
  }, []);

  return snapshot;
}
