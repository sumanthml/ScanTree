import API from "./api";

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

  email: string;

  otp_code: string;

  new_password: string;
}

/*
=====================================
REGISTER
=====================================
*/

export const registerUser = async (

  payload: RegisterPayload

) => {

  try {

    const response =
      await API.post(

        "/auth/register",

        payload
      );

    return response.data;

  } catch (error: any) {

    console.log(
      "REGISTER ERROR:",
      error?.response?.data
    );

    throw error;
  }
};

/*
=====================================
LOGIN
=====================================
*/

export const loginUser = async (

  payload: LoginPayload

) => {

  try {

    /*
    =====================================
    OAuth2PasswordRequestForm
    requires:
    application/x-www-form-urlencoded
    =====================================
    */

    const formData =
      new URLSearchParams();

    formData.append(
      "username",
      payload.email
    );

    formData.append(
      "password",
      payload.password
    );

    const response =
      await API.post(

        "/auth/login",

        formData.toString(),

        {
          headers: {

            "Content-Type":
              "application/x-www-form-urlencoded",
          },
        }
      );

    return response.data;

  } catch (error: any) {

    console.log(
      "LOGIN ERROR:",
      error?.response?.data
    );

    throw error;
  }
};

/*
=====================================
VERIFY EMAIL OTP
=====================================
*/

export const verifyEmailOTP =
  async (

    email: string,

    otp_code: string

  ) => {

    try {

      const response =
        await API.post(

          "/auth/verify-email",

          {
            email,
            otp_code,
          }
        );

      return response.data;

    } catch (error: any) {

      console.log(
        "VERIFY EMAIL OTP ERROR:",
        error?.response?.data
      );

      throw error;
    }
  };

/*
=====================================
RESEND VERIFICATION OTP
=====================================
*/

export const resendVerificationOTP =
  async (

    email: string

  ) => {

    try {

      const response =
        await API.post(

          "/auth/resend-verification-otp",

          null,

          {
            params: {
              email,
            },
          }
        );

      return response.data;

    } catch (error: any) {

      console.log(
        "RESEND OTP ERROR:",
        error?.response?.data
      );

      throw error;
    }
  };

/*
=====================================
FORGOT PASSWORD
=====================================
*/

export const forgotPassword =
  async (

    payload: ForgotPasswordPayload

  ) => {

    try {

      const response =
        await API.post(

          "/auth/forgot-password",

          payload
        );

      return response.data;

    } catch (error: any) {

      console.log(
        "FORGOT PASSWORD ERROR:",
        error?.response?.data
      );

      throw error;
    }
  };

/*
=====================================
RESET PASSWORD
=====================================
*/

export const resetPassword =
  async (

    payload: ResetPasswordPayload

  ) => {

    try {

      const response =
        await API.post(

          "/auth/reset-password",

          payload
        );

      return response.data;

    } catch (error: any) {

      console.log(
        "RESET PASSWORD ERROR:",
        error?.response?.data
      );

      throw error;
    }
  };