import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/react";
import { commitSession, getSession } from "~/auth/session";
import { LoginPage } from "./login-page";

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();
  let { email, password } = Object.fromEntries(formData);

  if (email === "ryan@jk.com" && password === process.env.RYAN_PASSWORD) {
    let session = await getSession();
    session.set("isAdmin", true);

    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } else {
    let error;

    if (!email) {
      error = "Email is required";
    } else if (!password) {
      error = "Password is required";
    } else {
      error = "Invalid email or password";
    }

    return json({ error }, { status: 401 });
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  let session = await getSession(request.headers.get("Cookie"));
  return session.data;
}

export default LoginPage;
