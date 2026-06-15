import API from "./api";

export async function getConnectedMembers() {
  const response = await API.get("/access/members");
  return response.data;
}

export async function inviteMember(email: string, permissionLevel: string) {
  const response = await API.post("/access/invite", {
    email,
    permission_level: permissionLevel
  });
  return response.data;
}

export async function removeMember(memberId: string) {
  const response = await API.delete(`/access/members/${memberId}`);
  return response.data;
}

export async function getIncomingRequests() {
  const response = await API.get("/access/requests");
  return response.data;
}

export async function acceptRequest(requestId: string) {
  const response = await API.post(`/access/requests/${requestId}/accept`);
  return response.data;
}

export async function declineRequest(requestId: string) {
  const response = await API.post(`/access/requests/${requestId}/decline`);
  return response.data;
}
