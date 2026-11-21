import { createHash, timingSafeEqual } from "node:crypto";

export function canManageCms(headers: Pick<Headers, "get">) {
  const password = process.env.B_PLATFORM_ADMIN_PASSWORD;
  if (!password) {
    return process.env.NODE_ENV === "development"
      && /^(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(headers.get("host") ?? "");
  }

  const authorization = headers.get("authorization");
  if (!authorization?.startsWith("Basic ")) return false;
  const supplied = Buffer.from(authorization.slice(6), "base64");
  const expected = Buffer.from("admin:" + password);
  return timingSafeEqual(
    createHash("sha256").update(supplied).digest(),
    createHash("sha256").update(expected).digest(),
  );
}
