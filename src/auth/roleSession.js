const ROLE_KEY = "nextstep_selected_role";

export function getSelectedRole() {
  const role = sessionStorage.getItem(ROLE_KEY);
  if (role === "student" || role === "teacher") return role;
  return "";
}

export function setSelectedRole(role) {
  if (role !== "student" && role !== "teacher") return;
  sessionStorage.setItem(ROLE_KEY, role);
}

export function clearSelectedRole() {
  sessionStorage.removeItem(ROLE_KEY);
}
