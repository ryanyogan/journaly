import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/react";
import { desc } from "drizzle-orm";
import { getSession } from "~/auth/session";
import { db } from "~/db/drizzle.server";
import { entries } from "~/db/schema";
import { IndexPage } from "./page";

export const meta: MetaFunction = () => {
  return [
    { title: "Journal" },
    { name: "description", content: "Write it ... or it didn't happen" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  let session = await getSession(request.headers.get("cookie"));
  if (!session.data.isAdmin) {
    throw new Response("Not authenticated", { status: 401 });
  }

  let formData = await request.formData();
  let { date, type, text } = Object.fromEntries(formData);
  if (
    typeof date !== "string" ||
    typeof type !== "string" ||
    typeof text !== "string" ||
    text.length === 0
  ) {
    throw new Error("Bad Request");
  }

  return db.insert(entries).values({
    date: new Date(date).toISOString(),
    type,
    text,
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  let session = await getSession(request.headers.get("Cookie"));

  let posts = await db.select().from(entries).orderBy(desc(entries.date));

  return json({
    session: session.data,
    entries: posts.map((entry) => ({
      ...entry,
      date: entry.date.substring(0, 10),
    })),
  });
}

export default IndexPage;
