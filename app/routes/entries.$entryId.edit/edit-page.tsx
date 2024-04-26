import { Form, useLoaderData } from "@remix-run/react";
import { FormField } from "~/components/form-field";
import type { loader } from "./route";

export function EditPage() {
  let entry = useLoaderData<typeof loader>();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!confirm("Are you sure?")) {
      e.preventDefault();
    }
  }

  return (
    <div className="mt-4">
      <div className="my-8 border rounded-lg border-gray-700/30 bg-gray-800/50 p-4 lg:mb-20 lg:p-6">
        <p className="text-sm font-medium text-gray-500 lg:text-base">
          New entry
        </p>
        <FormField entry={entry} />
      </div>

      <div className="mt-8">
        <Form method="post" onSubmit={handleSubmit}>
          <button
            name="intent"
            value="delete"
            className="text-gray-600 underline text-sm"
          >
            Delete this entry...
          </button>
        </Form>
      </div>
    </div>
  );
}
