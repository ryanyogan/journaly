import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/react";
import { redirectIfLoggedInLoader, setAuthOnResponse } from "~/auth/session";
import { LoginPage } from "./login-page";
import { login } from "./queries";
import { validate } from "./validate";

export const meta: MetaFunction = () => {
  return [
    { title: "Journal - Login" },
    { name: "description", content: "Write it ... or it didn't happen" },
  ];
};

export const loader = redirectIfLoggedInLoader;

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();
  let email = String(formData.get("email") || "");
  let password = String(formData.get("password") || "");

  let errors = validate(email, password);
  if (errors) {
    return json({ ok: false, errors }, 400);
  }

  let userId = await login(email, password);
  if (!userId) {
    return json(
      { ok: false, errors: { email: "Invalid email or password" } },
      400
    );
  }

  let response = redirect("/");
  return setAuthOnResponse(response, String(userId));
}

export default LoginPage;
