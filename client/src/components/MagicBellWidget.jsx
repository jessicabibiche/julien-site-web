import React, { useEffect, useState } from "react";
import MagicBell, {
  FloatingNotificationInbox,
} from "@magicbell/magicbell-react";

const stores = [
  { id: "default", defaultQueryParams: {} },
  { id: "unread", defaultQueryParams: { read: false } },
  { id: "billing", defaultQueryParams: { category: "billing" } },
];

const tabs = [
  { storeId: "default", label: "Dernières" },
  { storeId: "unread", label: "Non Lues" },
  { storeId: "billing", label: "Facturation" },
];

export default function MagicBellWidget({ user }) {
  const [userEmail, setUserEmail] = useState(null);
  const [userKey, setUserKey] = useState(null);

  useEffect(() => {
    if (user && user.email && user.id) {
      setUserEmail(user.email);
      setUserKey(user.id);
    } else {
      console.warn("Informations utilisateur manquantes pour MagicBell:", user);
    }
  }, [user]);

  if (!userEmail || !userKey) {
    return (
      <p className="text-white">
        Veuillez vous connecter pour voir vos notifications.
      </p>
    );
  }

  return (
    <MagicBell
      apiKey={import.meta.env.VITE_MAGICBELL_API_KEY} // Assurez-vous que cette clé est correcte
      userEmail={userEmail}
      userKey={userKey}
      stores={stores}
      defaultIsOpen={false}
    >
      {({ isOpen, toggle, launcherRef }) => (
        <>
          <button
            ref={launcherRef}
            onClick={toggle}
            className="text-yellow-500 text-2xl"
            style={{ cursor: "pointer" }}
          >
            🔔 {/* Icône de la cloche */}
          </button>
          <FloatingNotificationInbox
            isOpen={isOpen}
            toggle={toggle}
            tabs={tabs}
            height={450}
            width={300}
          />
        </>
      )}
    </MagicBell>
  );
}
