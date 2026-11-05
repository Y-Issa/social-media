// A display handle. There are no usernames in the API yet, so derive a
// stable one from the name ("Test User" -> "@testuser").
export function toHandle(user) {
  if (!user) return "";
  if (user.username) return `@${user.username}`;
  const slug = (user.name || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]/g, "");
  return slug ? `@${slug}` : "";
}

export function websiteHref(website) {
  if (!website) return null;
  return /^https?:\/\//i.test(website) ? website : `https://${website}`;
}

export function websiteLabel(website) {
  return website?.replace(/^https?:\/\//i, "").replace(/\/$/, "") ?? "";
}

export function plural(n, one, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}
