import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, redirect, useLoaderData } from "@remix-run/react";
import { commitSession, getSession } from "~/auth/session";

export async function action({ request }: ActionFunctionArgs) {
  let formData = await request.formData();
  let { email, password } = Object.fromEntries(formData);

  if (email === "ryan@jk.com" && password === "asdasd") {
    let session = await getSession();
    session.set("isAdmin", true);

    return redirect("/", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } else {
    return null;
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  let session = await getSession(request.headers.get("Cookie"));
  return session.data;
}

export default function Login() {
  let data = useLoaderData<typeof loader>();

  return (
    <div className="mt-8">
      {data.isAdmin ? (
        <p>You are an admin</p>
      ) : (
        <Form method="post">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="text-gray-900"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="text-gray-900"
          />
          <button className="bg-blue-500 px-3 py-2 font-medium text-white">
            Log in
          </button>
        </Form>
      )}
    </div>
  );
}
