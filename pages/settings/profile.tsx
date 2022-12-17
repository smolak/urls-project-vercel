import { Page, SettingsLayout } from "../../lib/settings/ui/SettingsLayout";
import { useSession } from "next-auth/react";
import { UserProfileDataForm } from "../../lib/settings/profile/ui/UserProfileDataForm";

const SettingsProfile = () => {
  const { data: session, status } = useSession();

  return (
    status === "authenticated" && (
      <SettingsLayout title="Profile" user={session.user} page={Page.PROFILE}>
        <UserProfileDataForm userRole={session.user.role} />
      </SettingsLayout>
    )
  );
};

export default SettingsProfile;
