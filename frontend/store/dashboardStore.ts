import {

create

} from "zustand";

import {

getDashboard

}

from "@/services/dashboard";

interface DashboardState{

dashboard:any;

isLoading:boolean;

error:string|null;

fetchDashboard:(

profileId:string

)=>Promise<void>;

}

export const useDashboardStore=

create<DashboardState>(

(set)=>({

dashboard:null,

isLoading:false,

error:null,

fetchDashboard:

async(

profileId

)=>{

try{

set({

isLoading:true,

error:null

});

const data=

await getDashboard(

profileId

);

set({

dashboard:data,

isLoading:false

});

}catch{

set({

error:

"Dashboard failed",

isLoading:false

});

}

}

})

);