import { create } from "zustand";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

/*
=====================================
TYPES
=====================================
*/

export interface AuthUser {

  id: string;

  name: string;

  email: string;
}

interface AuthState {

  /*
  =====================================
  STATE
  =====================================
  */

  accessToken: string | null;

  user: AuthUser | null;

  isAuthenticated: boolean;

  isLoading: boolean;

  /*
  =====================================
  ACTIONS
  =====================================
  */

  login: (

    token: string,

    user: AuthUser

  ) => Promise<void>;

  logout: () => Promise<void>;

  restoreSession:
    () => Promise<void>;
}

/*
=====================================
STORAGE KEYS
=====================================
*/

const TOKEN_KEY =
  "scantree_access_token";

const USER_KEY =
  "scantree_user";

/*
=====================================
AUTH STORE
=====================================
*/

export const useAuthStore =
  create<AuthState>((set) => ({

    /*
    =====================================
    INITIAL STATE
    =====================================
    */

    accessToken: null,

    user: null,

    isAuthenticated: false,

    isLoading: true,

    /*
    =====================================
    LOGIN
    =====================================
    */

    login: async (

      token,

      user

    ) => {

      try {

        /*
        =========================
        SAVE STORAGE
        =========================
        */

        await AsyncStorage.setItem(

          TOKEN_KEY,

          token
        );

        await AsyncStorage.setItem(

          USER_KEY,

          JSON.stringify(user)
        );

        /*
        =========================
        UPDATE STORE
        =========================
        */

        set({

          accessToken:
            token,

          user,

          isAuthenticated:
            true,
        });

      } catch (error) {

        console.log(
          "AUTH LOGIN STORE ERROR:",
          error
        );
      }
    },

    /*
    =====================================
    LOGOUT
    =====================================
    */

    logout: async () => {

      try {

        /*
        =========================
        CLEAR STORAGE
        =========================
        */

        await AsyncStorage.removeItem(
          TOKEN_KEY
        );

        await AsyncStorage.removeItem(
          USER_KEY
        );

        /*
        =========================
        RESET STORE
        =========================
        */

        set({

          accessToken:
            null,

          user: null,

          isAuthenticated:
            false,
        });

      } catch (error) {

        console.log(
          "AUTH LOGOUT ERROR:",
          error
        );
      }
    },

    /*
    =====================================
    RESTORE SESSION
    =====================================
    */

    restoreSession:
      async () => {

        try {

          /*
          =========================
          LOAD STORAGE
          =========================
          */

          const token =
            await AsyncStorage.getItem(
              TOKEN_KEY
            );

          const userString =
            await AsyncStorage.getItem(
              USER_KEY
            );

          /*
          =========================
          SESSION EXISTS
          =========================
          */

          if (
            token &&
            userString
          ) {

            const user =
              JSON.parse(
                userString
              );

            set({

              accessToken:
                token,

              user,

              isAuthenticated:
                true,

              isLoading:
                false,
            });

            return;
          }

          /*
          =========================
          NO SESSION
          =========================
          */

          set({

            accessToken:
              null,

            user: null,

            isAuthenticated:
              false,

            isLoading:
              false,
          });

        } catch (error) {

          console.log(
            "RESTORE SESSION ERROR:",
            error
          );

          set({

            accessToken:
              null,

            user: null,

            isAuthenticated:
              false,

            isLoading:
              false,
          });
        }
      },
  }));