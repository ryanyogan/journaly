import { db } from "~/db/drizzle.server";
import { entries } from "~/db/schema";

export async function createEntry({
  date,
  type,
  text,
  id,
}: {
  date: string;
  type: string;
  text: string;
  id: string;
}) {
  return db.insert(entries).values({
    date: new Date(date).toISOString(),
    type,
    text,
    id,
  });
}
