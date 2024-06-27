export function getAuthHeaders() {
  const token = JSON.parse(localStorage.getItem("token"));
  return {
    Authorization: `Bearer ${token}`,
  };
}
