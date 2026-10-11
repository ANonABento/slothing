import { getProfile } from "@/lib/db";
import { ProfileEditor } from "@/components/profile-editor";

export const dynamic = "force-dynamic";

export default function ProfilePage() {
  return <ProfileEditor initial={getProfile()} />;
}
