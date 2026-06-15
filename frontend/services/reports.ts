import API from "./api";

/*
=========================================
TYPES
=========================================
*/

export interface Biomarker{

id:string;

name:string;

value:string;

unit:string;

severity?:string;

reference_range?:string;

category?:string;

}

export interface AIInsight{

id:string;

title:string;

description:string;

severity:string;

recommendation?:string;

}

export interface Report{

id:string;

report_name:string;

file_name:string;

created_at:string;

health_score:number;

status:string;

summary?:string;

biomarkers:Biomarker[];

ai_insights:AIInsight[];

}

/*
=========================================
GET REPORT DETAILS
GET /reports/{id}
=========================================
*/

export async function getReportDetails(

reportId:string

){

const response=

await API.get(

`/reports/${reportId}`

);

return response.data;

}

/*
=========================================
GET REPORT COMPARISON
GET /reports/{id}/comparison
=========================================
*/

export async function getReportComparison(

reportId:string

){

const response=

await API.get(

`/reports/${reportId}/comparison`

);

return response.data;

}

/*
=========================================
DELETE REPORT
DELETE /reports/{id}
=========================================
*/

export async function deleteReport(

reportId:string

){

const response=

await API.delete(

`/reports/${reportId}`

);

return response.data;

}

/*
=========================================
DOWNLOAD REPORT
GET /reports/{id}/download
=========================================
*/

export async function downloadReport(

reportId:string

){

const response=

await API.get(

`/reports/${reportId}/download`,

{

responseType:

"blob"

}

);

return response;

}

/*
=========================================
GET REPORTS FOR PROFILE
(useful later for reports page refresh)
=========================================
*/

export async function getReportsForProfile(

profileId:string

){

const response=

await API.get(

`/profiles/${profileId}/reports`

);

return response.data;

}