import type { LoaderFunctionArgs } from "@remix-run/node";
import { createCookie, redirect } from "@remix-run/node";

let secret = process.env.COOKIE_SECRET || "default";
if (secret === "default") {
  console.warn(
    "You should set a unique COOKIE_SECRET in your .env file. Using the default value is not secure."
  );
  secret = "default-secret";
}

let cookie = createCookie("auth", {
  path: "/",
  httpOnly: true,
  sameSite: "lax",
  maxAge: 30 * 24 * 60 * 60, // 30 days
  secure: process.env.NODE_ENV === "production",
  secrets: [secret],
});

export async function getAuthFromRequest(request: Request) {
  let userId = await cookie.parse(request.headers.get("Cookie"));
  return userId ?? null;
}

export async function setAuthOnResponse(response: Response, userId: string) {
  let header = await cookie.serialize(userId);
  response.headers.append("Set-Cookie", header);
  return response;
}

export async function requireAuthenticatedUser(request: Request) {
  let userId = await getAuthFromRequest(request);
  if (!userId) {
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await cookie.serialize("", {
          maxAge: 0,
        }),
      },
    });
  }

  return userId;
}

export async function redirectIfLoggedInLoader({
  request,
}: LoaderFunctionArgs) {
  let userId = await getAuthFromRequest(request);
  if (userId) {
    return redirect("/");
  }

  return null;
}

export async function redirectWithClearedCookie(): Promise<Response> {
  return redirect("/", {
    headers: {
      "Set-Cookie": await cookie.serialize(null, {
        expires: new Date(0),
      }),
    },
  });
}
