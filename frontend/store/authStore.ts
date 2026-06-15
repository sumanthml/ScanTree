import { create } from "zustand";

import AsyncStorage from
"@react-native-async-storage/async-storage";

import API from "@/services/api";

import {
useProfileStore,
}
from "@/store/profileStore";

/*
=====================================
TYPES
=====================================
*/

export interface AuthUser{

id:string;

name:string;

email:string;

}

interface AuthState{

accessToken:
string|null;

user:
AuthUser|null;

isAuthenticated:
boolean;

isLoading:
boolean;

login:(

token:string,

user:AuthUser

)=>Promise<void>;

logout:
()=>Promise<void>;

restoreSession:
()=>Promise<void>;

}

/*
=====================================
STORAGE KEYS
=====================================
*/

const TOKEN_KEY=
"access_token";

const USER_KEY=
"scantree_user";

const PROFILE_KEY=
"scantree_active_profile";

/*
=====================================
STORE
=====================================
*/

export const useAuthStore=

create<AuthState>(

(set)=>({

accessToken:null,

user:null,

isAuthenticated:false,

isLoading:true,

/*
=====================================
LOGIN
=====================================
*/

login:

async(

token,

user

)=>{

try{

/*
SAVE STORAGE
*/

await AsyncStorage.setItem(

TOKEN_KEY,

token

);

await AsyncStorage.setItem(

USER_KEY,

JSON.stringify(
user
)

);

/*
SET AUTH HEADER
*/

API.defaults
.headers
.common
.Authorization=

`Bearer ${token}`;

/*
UPDATE STORE
*/

set({

accessToken:
token,

user,

isAuthenticated:
true,

isLoading:
false,

});

}catch(error){

console.log(

"LOGIN ERROR:",

error

);

}

},

/*
=====================================
LOGOUT
=====================================
*/

logout:

async()=>{

try{

console.log(
"LOGOUT START"
);

/*
CLEAR PROFILE STORE
*/

await useProfileStore

.getState()

.clearProfiles();

/*
CLEAR STORAGE
*/

await AsyncStorage.multiRemove([

TOKEN_KEY,

USER_KEY,

PROFILE_KEY,

]);

/*
REMOVE AUTH HEADER
*/

delete API.defaults
.headers
.common
.Authorization;

/*
RESET AUTH STORE
*/

set({

accessToken:null,

user:null,

isAuthenticated:false,

isLoading:false,

});

console.log(
"LOGOUT COMPLETE"
);

}catch(error){

console.log(

"LOGOUT ERROR:",

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

async()=>{

try{

const [

token,

userString,

]=

await Promise.all([

AsyncStorage.getItem(
TOKEN_KEY
),

AsyncStorage.getItem(
USER_KEY
),

]);

/*
NO SESSION
*/

if(

!token ||

!userString

){

set({

accessToken:null,

user:null,

isAuthenticated:false,

isLoading:false,

});

return;

}

/*
RESTORE HEADER
*/

API.defaults
.headers
.common
.Authorization=

`Bearer ${token}`;

/*
RESTORE STORE
*/

set({

accessToken:
token,

user:

JSON.parse(
userString
),

isAuthenticated:
true,

isLoading:
false,

});

console.log(
"SESSION RESTORED"
);

}catch(error){

console.log(

"RESTORE ERROR:",

error

);

/*
FAIL SAFE RESET
*/

set({

accessToken:null,

user:null,

isAuthenticated:false,

isLoading:false,

});

}

},

})

);