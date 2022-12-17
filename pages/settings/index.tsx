import { Page, SettingsLayout } from "../../lib/settings/ui/SettingsLayout";
import { useSession } from "next-auth/react";

const SettingsProfile = () => {
  const { data: session, status } = useSession();

  return (
    status === "authenticated" && (
      <SettingsLayout title="Settings" user={session.user} page={Page.SETTINGS}>
        To be added...
      </SettingsLayout>
    )
  );
};

export default SettingsProfile;
