import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/react";
import { eq } from "drizzle-orm";
import invariant from "tiny-invariant";
import { requireAuthenticatedUser } from "~/auth/session";
import { db } from "~/db/drizzle.server";
import { entries } from "~/db/schema";
import { EditPage } from "./edit-page";

export const meta: MetaFunction = () => {
  return [
    { title: "Journal - Edit Entry" },
    { name: "description", content: "Write it ... or it didn't happen" },
  ];
};

export async function loader({ params, request }: LoaderFunctionArgs) {
  await requireAuthenticatedUser(request);

  if (typeof params.entryId !== "string") {
    throw new Response("Not Found", { status: 404 });
  }

  let entry = await db.query.entries.findFirst({
    where: eq(entries.id, params.entryId),
  });

  if (!entry) {
    throw new Response("Not Found", { status: 404 });
  }

  return json({
    ...entry,
    date: entry.date.substring(0, 10),
  });
}

export async function action({ request, params }: ActionFunctionArgs) {
  await requireAuthenticatedUser(request);

  if (typeof params.entryId !== "string") {
    throw new Response("Not Found", { status: 404 });
  }

  let formData = await request.formData();
  let { date, type, text, intent } = Object.fromEntries(formData);
  invariant(typeof intent === "string", "intent is required");

  switch (intent) {
    case "delete": {
      await db.delete(entries).where(eq(entries.id, params.entryId));

      return redirect("/");
    }

    default: {
      if (
        typeof date !== "string" ||
        typeof type !== "string" ||
        typeof text !== "string"
      ) {
        throw new Error("Bad Request");
      }

      await db
        .update(entries)
        .set({
          date: new Date(date).toISOString(),
          type,
          text,
        })
        .where(eq(entries.id, params.entryId));

      return redirect("/");
    }
  }
}

export default EditPage;
