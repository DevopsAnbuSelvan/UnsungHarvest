import { signOut } from "firebase/auth";
import api from "@/lib/axios";
import { firebaseAuth } from "@/lib/firebase";
import { EndPoints } from "@/constants/end_points";
import { useAuthStore } from "@/store/auth.store";

/**
 * Full logout: backend (best-effort) → Firebase → clear store/cookie → go to login.
 */
export async function performLogout() {
  try {
    await api.post(EndPoints.userLogout);
  } catch {
    // ignore — still clear local session
  }

  await signOut(firebaseAuth).catch(() => undefined);
  useAuthStore.getState().logout();

  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}
