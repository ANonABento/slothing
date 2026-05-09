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

function toSnapshot(profile: Profile | null): ProfileSnapshot {
  const name = profile?.contact?.name?.trim() ?? "";
  const firstName = name.split(/\s+/)[0] || "Your profile";

  return {
    name,
    firstName,
    avatarUrl: profile?.contact?.avatarUrl ?? "",
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
