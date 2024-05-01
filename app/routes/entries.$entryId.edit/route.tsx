import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/react";
import invariant from "tiny-invariant";
import { requireAuthenticatedUser } from "~/auth/session";
import { prisma } from "~/db/prisma";
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

  let entry = await prisma.entry.findUnique({
    where: {
      id: params.entryId,
    },
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
  await requireAuthenticatedUser(request);

  if (typeof params.entryId !== "string") {
    throw new Response("Not Found", { status: 404 });
  }

  let formData = await request.formData();
  let { date, type, text, intent } = Object.fromEntries(formData);
  invariant(typeof intent === "string", "intent is required");

  switch (intent) {
    case "delete": {
      await prisma.entry.delete({ where: { id: params.entryId } });

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

      await prisma.entry.update({
        where: { id: params.entryId },
        data: {
          date: new Date(date),
          type,
          text,
        },
      });

      return redirect("/");
    }
  }
}

export default EditPage;
