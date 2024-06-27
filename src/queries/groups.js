import { makeRequest } from "../axios";
import { getAuthHeaders } from "../getAuthHeaders";

export async function fetchJoinedGroups() {
  const res = await makeRequest.get("/groups/joined", {
    headers: getAuthHeaders(),
  });
  return res.data;
}

export async function fetchUnjoinedGroups() {
  const res = await makeRequest.get("/groups/unjoined", {
    headers: getAuthHeaders(),
  });
  return res.data;
}

export async function joinGroup(groupId) {
  await makeRequest.post(
    `/groups/${groupId}`,
    {},
    {
      headers: getAuthHeaders(),
    }
  );
}

export async function leaveGroup(groupId) {
  await makeRequest.delete(`/groups/${groupId}`, {
    headers: getAuthHeaders(),
  });
}
