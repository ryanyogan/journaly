import { Form, useActionData } from "@remix-run/react";
import type { action } from "./route";

export function LoginPage() {
  let actionData = useActionData<typeof action>();

  return (
    <div className="mt-8 mx-auto max-w-xs lg:max-w-sm">
      <Form method="post">
        <div className="space-y-2">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-sky-600 focus:ring-sky-600"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-sky-600 focus:ring-sky-600"
          />
        </div>
        <div className="mt-8">
          <button className="w-full rounded-md bg-sky-600 px-3 py-2 font-medium text-white hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 focus:ring-offset-gray-900">
            Log in
          </button>
        </div>

        {actionData?.errors?.email && (
          <p className="mt-4 font-medium text-red-500">
            {actionData.errors.email}
          </p>
        )}
      </Form>
    </div>
  );
}
