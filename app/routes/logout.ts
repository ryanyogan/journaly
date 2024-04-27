import { redirectWithClearedCookie } from "~/auth/session";

export function action() {
  return redirectWithClearedCookie();
}
