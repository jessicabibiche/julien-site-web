import React, { useEffect, useState } from "react";
import MagicBell, {
  FloatingNotificationInbox,
} from "@magicbell/magicbell-react";

const MagicBellWidget = ({ user }) => {
  if (!user || !user.email) {
    console.warn(
      "Utilisateur non authentifié ou email manquant pour MagicBell."
    );
    return null;
  }

  return (
    <MagicBell
      apiKey={import.meta.env.VITE_MAGICBELL_API_KEY}
      userEmail={user.email}
      userExternalId={user.id}
      theme={{
        header: {
          backgroundColor: "#000000",
          textColor: "#FFFFFF",
        },
      }}
    >
      {({ isOpen, toggle, launcherRef }) => (
        <FloatingNotificationInbox
          height={400}
          width={300}
          isOpen={isOpen}
          toggle={toggle}
          launcherRef={launcherRef}
        />
      )}
    </MagicBell>
  );
};

export default MagicBellWidget;
