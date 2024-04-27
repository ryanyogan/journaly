import { db } from "~/db/drizzle.server";
import { entries } from "~/db/schema";

export async function createEntry({
  date,
  type,
  text,
}: {
  date: string;
  type: string;
  text: string;
}) {
  return db.insert(entries).values({
    date: new Date(date).toISOString(),
    type,
    text,
  });
}
