import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/react";
import { getAuthFromRequest, requireAuthenticatedUser } from "~/auth/session";
import { prisma } from "~/db/prisma";
import { IndexPage } from "./page";
import { createEntry } from "./queries";

export const meta: MetaFunction = () => {
  return [
    { title: "Journal" },
    { name: "description", content: "Write it ... or it didn't happen" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  await requireAuthenticatedUser(request);

  let formData = await request.formData();
  let { date, type, text, id } = Object.fromEntries(formData);

  if (
    typeof date !== "string" ||
    typeof type !== "string" ||
    typeof text !== "string" ||
    typeof id !== "string" ||
    text.length === 0
  ) {
    throw new Error("Bad Request");
  }

  await createEntry({ date, type, text, id });

  return json({ message: "Entry created" }, { status: 201 });
}

export async function loader({ request }: LoaderFunctionArgs) {
  let userId = await getAuthFromRequest(request);

  let posts = await prisma.entry.findMany({
    orderBy: { date: "desc" },
  });

  return {
    userId,
    entries: posts.map((entry) => ({
      ...entry,
      date: entry.date.toISOString().substring(0, 10),
    })),
  };
}

export default IndexPage;
