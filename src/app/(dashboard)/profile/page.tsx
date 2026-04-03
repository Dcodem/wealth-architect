import { getCurrentUser, getOrgId } from "@/lib/db/queries/helpers";
import { getOrganization } from "@/lib/db/queries/organizations";
import { ProfileClient } from "./profile-client";

export const metadata = { title: "Profile | The Wealth Architect" };

export default async function ProfilePage() {
  const orgId = await getOrgId();
  const [user, org] = await Promise.all([
    getCurrentUser(),
    getOrganization(orgId),
  ]);

  return (
    <ProfileClient
      user={{
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      }}
      orgName={org?.name ?? "Organization"}
    />
  );
}
