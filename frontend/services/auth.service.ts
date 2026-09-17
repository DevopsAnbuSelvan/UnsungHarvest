import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import api from "@/lib/axios";
import { firebaseAuth } from "@/lib/firebase";
import { EndPoints } from "@/constants/end_points";
import { mapAuthResponse, toRegisterBody } from "@/utils/auth";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  User,
} from "@/types/auth";

async function getIdTokenOrThrow(): Promise<string> {
  const current = firebaseAuth.currentUser;
  if (!current) {
    throw new Error("Not signed in to Firebase");
  }
  return current.getIdToken();
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const credential = await signInWithEmailAndPassword(
      firebaseAuth,
      payload.email,
      payload.password
    );
    const idToken = await credential.user.getIdToken();
    const { data } = await api.post<{ user: Parameters<typeof mapAuthResponse>[0]["user"]; accessToken: string }>(
      EndPoints.userLogin,
      {},
      { headers: { Authorization: `Bearer ${idToken}` } }
    );
    return mapAuthResponse({
      accessToken: idToken,
      user: data.user,
    });
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const credential = await createUserWithEmailAndPassword(
      firebaseAuth,
      payload.email,
      payload.password
    );

    const displayName = `${payload.firstName} ${payload.lastName}`.trim();
    await updateProfile(credential.user, { displayName });

    const idToken = await credential.user.getIdToken();
    try {
      const { data } = await api.post<{ user: Parameters<typeof mapAuthResponse>[0]["user"]; accessToken: string }>(
        EndPoints.userRegister,
        toRegisterBody(payload),
        { headers: { Authorization: `Bearer ${idToken}` } }
      );
      return mapAuthResponse({
        accessToken: idToken,
        user: data.user,
      });
    } catch (error) {
      await credential.user.delete().catch(() => undefined);
      throw error;
    }
  },

  getMe: async (): Promise<User> => {
    const { data } = await api.post(EndPoints.userMe);
    const { mapUser } = await import("@/utils/auth");
    return mapUser(data as Parameters<typeof mapUser>[0]);
  },

  logout: async (): Promise<void> => {
    const { performLogout } = await import("@/utils/logout");
    await performLogout();
  },

  getIdToken: getIdTokenOrThrow,
};
