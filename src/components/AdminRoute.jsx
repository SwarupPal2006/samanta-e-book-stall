
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../services/firebase";

export default function AdminRoute({ children }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const allowedUid = import.meta.env.VITE_ADMIN_UID;

      if (user && allowedUid && user.uid === allowedUid) {
        setStatus("allowed");
      } else {
        if (user) await signOut(auth);
        setStatus("denied");
      }
    });

    return unsubscribe;
  }, []);

  if (status === "loading") return <p>Checking access...</p>;
  if (status !== "allowed") {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
