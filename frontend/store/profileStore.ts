import { create } from "zustand";

import AsyncStorage from
"@react-native-async-storage/async-storage";

import {
getProfiles
}
from "@/services/profile";

/*
=====================================
TYPES
=====================================
*/

export interface Profile{

id:string;

full_name:string;

gender?:string;

date_of_birth?:string;

blood_group?:string;

relationship_type?:string;

photo_path?:string;

created_at?:string;

is_shared?:boolean;

}

/*
=====================================
STORE TYPES
=====================================
*/

interface ProfileState{

profiles:Profile[];

activeProfile:
Profile|null;

activeProfileId:
string|null;

isLoading:boolean;

error:string|null;

fetchProfiles:
()=>Promise<void>;

setActiveProfile:
(
profile:Profile|null
)=>Promise<void>;

loadStoredProfile:
()=>Promise<void>;

clearProfiles:
()=>Promise<void>;

}

/*
=====================================
STORAGE
=====================================
*/

const PROFILE_KEY=
"scantree_active_profile";

/*
=====================================
STORE
=====================================
*/

export const useProfileStore=

create<ProfileState>(

(set,get)=>({

profiles:[],

activeProfile:null,

activeProfileId:null,

isLoading:false,

error:null,

/*
=====================================
LOAD STORED PROFILE
=====================================
*/

loadStoredProfile:

async()=>{

try{

const stored=

await AsyncStorage.getItem(

PROFILE_KEY

);

if(!stored){

return;

}

const profile:

Profile=

JSON.parse(

stored

);

set({

activeProfile:
profile,

activeProfileId:
profile.id

});

}catch(error){

console.log(

"LOAD PROFILE ERROR",

error

);

}

},

/*
=====================================
FETCH PROFILES
=====================================
*/

fetchProfiles:

async()=>{

try{

set({

isLoading:true,

error:null

});

const profiles=

await getProfiles();

const current=

get().activeProfile;

let selected=

current;

if(

current

){

selected=

profiles.find(

(p:Profile)=>

p.id===current.id

)

|| null;

}

if(

!selected &&

profiles.length>0

){

selected=

profiles[0];

await AsyncStorage.setItem(

PROFILE_KEY,

JSON.stringify(

selected

)

);

}

set({

profiles,

activeProfile:
selected,

activeProfileId:

selected?.id ||

null,

isLoading:false,

error:null

});

}catch(error){

console.log(

"PROFILE FETCH ERROR",

error

);

set({

isLoading:false,

error:
"Failed to load profiles"

});

}

},

/*
=====================================
SET ACTIVE PROFILE
=====================================
*/

setActiveProfile:

async(profile)=>{

try{

if(profile){

await AsyncStorage.setItem(

PROFILE_KEY,

JSON.stringify(
profile
)

);

}else{

await AsyncStorage.removeItem(

PROFILE_KEY

);

}

set({

activeProfile:
profile,

activeProfileId:

profile?.id ||

null

});

}catch(error){

console.log(

"SET PROFILE ERROR",

error

);

}

},

/*
=====================================
CLEAR PROFILE STORE
=====================================
*/

clearProfiles:

async()=>{

await AsyncStorage.removeItem(

PROFILE_KEY

);

set({

profiles:[],

activeProfile:null,

activeProfileId:null,

isLoading:false,

error:null

});

}

})

);