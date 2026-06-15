import API from "./api";

/*
============================================================
TYPES — matching backend schema exactly
============================================================
*/

export interface CreateProfilePayload {
  full_name: string;
  gender?: string;
  date_of_birth?: string | null;  // ISO date string: "YYYY-MM-DD"
  blood_group?: string | null;
  relationship_type?: string;
}

export interface UpdateProfilePayload {
  full_name?: string;
  gender?: string;
  date_of_birth?: string | null;
  blood_group?: string | null;
  relationship_type?: string;
}

/*
============================================================
GET ALL PROFILES FOR CURRENT USER
============================================================
*/

export const getProfiles = async () => {
  const response = await API.get("/profiles");
  return response.data.data;
};

/*
============================================================
GET SINGLE PROFILE
============================================================
*/

export const getProfile = async (profileId: string) => {
  const response = await API.get(`/profiles/${profileId}`);
  return response.data.data;
};

/*
============================================================
CREATE PROFILE
POST /profiles
============================================================
*/

export const createProfile = async (payload: CreateProfilePayload) => {
  const response = await API.post("/profiles", payload);
  return response.data.data;
};

/*
============================================================
UPDATE PROFILE
PATCH /profiles/{id}
============================================================
*/

export const updateProfile = async (
  profileId: string,
  payload: UpdateProfilePayload
) => {
  const response = await API.patch(`/profiles/${profileId}`, payload);
  return response.data.data;
};

/*
============================================================
DELETE PROFILE
DELETE /profiles/{id}
============================================================
*/

export const deleteProfile = async (profileId: string) => {
  const response = await API.delete(`/profiles/${profileId}`);
  return response.data;
};