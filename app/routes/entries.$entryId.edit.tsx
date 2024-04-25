import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect, useLoaderData } from "@remix-run/react";
import { FormField } from "~/components/form-field";
import { prisma } from "~/db/prisma";

export async function loader({ params }: LoaderFunctionArgs) {
  if (typeof params.entryId !== "string") {
    throw new Response("Not Found", { status: 404 });
  }

  let entry = await prisma.entry.findUnique({
    where: { id: Number(params.entryId) },
  });

  if (!entry) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({
    ...entry,
    date: entry.date.toISOString().substring(0, 10),
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  if (typeof params.entryId !== "string") {
    throw new Response("Not Found", { status: 404 });
  }

  let formData = await request.formData();
  let { date, type, text } = Object.fromEntries(formData);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (
    typeof date !== "string" ||
    typeof type !== "string" ||
    typeof text !== "string"
  ) {
    throw new Error("Bad Request");
  }

  await prisma.entry.update({
    where: { id: Number(params.entryId) },
    data: {
      date: new Date(date),
      type,
      text,
    },
  });

  return redirect("/");
}

export default function EditPage() {
  let entry = useLoaderData<typeof loader>();

  return (
    <div className="mt-4">
      <p>Editing entry {entry.id}</p>

      <div className="mt-8">
        <FormField entry={entry} />
      </div>
    </div>
  );
}
