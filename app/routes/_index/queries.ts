import { prisma } from "~/db/prisma";

export async function createEntry({
  date,
  type,
  text,
  id,
}: {
  date: string;
  type: string;
  text: string;
  id?: string;
}) {
  return prisma.entry.create({
    data: {
      id,
      date: new Date(date),
      type,
      text,
    },
  });
}
