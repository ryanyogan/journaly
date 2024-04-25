import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, useLoaderData } from "@remix-run/react";
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

export default function EditPage() {
  let entry = useLoaderData<typeof loader>();

  return (
    <div className="mt-4">
      <p>
        Editing entry {entry.id} - {entry.date}
      </p>
    </div>
  );
}
