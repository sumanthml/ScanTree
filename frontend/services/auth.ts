import axios from "axios";
import API from "./api";

const FIREBASE_API_KEY = "AIzaSyB-JQ3Bt2fXDUvvq984qtsmtkrNtxJBa6E";

/*
=====================================
TYPES
=====================================
*/

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  oobCode: string;
  new_password: string;
}

/*
=====================================
REGISTER
Sign up via Firebase → Sync with backend
=====================================
*/

export const registerUser = async (payload: RegisterPayload) => {
  try {

    // 1. Register via backend (server-side Firebase Admin SDK — no browser DNS issues)
    const regResponse = await API.post("/auth/register", {
      name: payload.name.trim(),
      email: payload.email.trim(),
      password: payload.password,
    });

    const { custom_token, user_id, name, email } = regResponse.data;

    // 2. Exchange custom token for a proper ID token via Firebase REST API
    const exchangeUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${FIREBASE_API_KEY}`;
    let idToken: string;
    try {
      const tokenResponse = await axios.post(exchangeUrl, {
        token: custom_token,
        returnSecureToken: true,
      });
      idToken = tokenResponse.data.idToken;
    } catch {
      // If token exchange fails (DNS etc.), fall back to login
      const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
      const loginResponse = await axios.post(signInUrl, {
        email: payload.email.trim(),
        password: payload.password,
        returnSecureToken: true,
      });
      idToken = loginResponse.data.idToken;
    }

    return {
      access_token: idToken,
      user: {
        id: user_id,
        name: name || payload.name.trim(),
        email: email || payload.email.trim(),
      },
    };

  } catch (error: any) {
    console.log("REGISTER ERROR:", error?.response?.data || error?.message);
    throw error;
  }
};

/*
=====================================
LOGIN
Sign in via Firebase → Sync with backend
=====================================
*/

export const loginUser = async (payload: LoginPayload) => {
  try {

    // 1. Authenticate user via Firebase Auth REST API
    const signInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
    const firebaseResponse = await axios.post(signInUrl, {
      email: payload.email.trim(),
      password: payload.password,
      returnSecureToken: true,
    });

    const idToken = firebaseResponse.data.idToken;

    // 2. Synchronize with our FastAPI backend database
    const syncResponse = await API.post(
      "/auth/sync",
      {},
      {
        headers: { Authorization: `Bearer ${idToken}` },
      }
    );

    return {
      access_token: idToken,
      user: {
        id: syncResponse.data.user_id,
        name: syncResponse.data.name || payload.email.split("@")[0],
        email: payload.email.trim(),
      },
    };

  } catch (error: any) {
    console.log("LOGIN ERROR:", error?.response?.data || error?.message);
    throw error;
  }
};

/*
=====================================
FORGOT PASSWORD
Sends a Firebase password-reset email.
The email contains a link the user clicks
to reset their password — not an OTP code.
=====================================
*/

export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  try {
    const response = await API.post("/auth/forgot-password", {
      email: payload.email.trim(),
    });
    return response.data;
  } catch (error: any) {
    console.log("FORGOT PASSWORD ERROR:", error?.response?.data || error?.message);
    throw error;
  }
};

/*
=====================================
RESET PASSWORD (via oobCode from email link)
oobCode is extracted from the reset URL params
=====================================
*/

export const resetPassword = async (payload: ResetPasswordPayload) => {
  try {
    const confirmResetUrl = `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${FIREBASE_API_KEY}`;
    const response = await axios.post(confirmResetUrl, {
      oobCode: payload.oobCode.trim(),
      newPassword: payload.new_password,
    });
    return response.data;
  } catch (error: any) {
    console.log("RESET PASSWORD ERROR:", error?.response?.data || error?.message);
    throw error;
  }
};

/*
=====================================
LEGACY/UNUSED VERIFICATION STUBS
=====================================
*/
export const verifyEmailOTP = async (email: string, otpCode: string): Promise<any> => {
  return {};
};

export const resendVerificationOTP = async (email: string): Promise<any> => {
  return {};
};