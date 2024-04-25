import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, json, useFetcher, useLoaderData } from "@remix-run/react";
import { format, parseISO, startOfWeek } from "date-fns";
import { useEffect, useRef } from "react";
import { prisma } from "~/db/prisma";

export const meta: MetaFunction = () => {
  return [
    { title: "Journal" },
    { name: "description", content: "Write it ... or it didn't happen" },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
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

  await new Promise((resolve) => setTimeout(resolve, 1000));

  return prisma.entry.create({
    data: {
      date: new Date(date),
      type,
      text,
    },
  });
}

export async function loader() {
  let entries = await prisma.entry.findMany({
    orderBy: { date: "desc" },
  });

  return json({
    entries: entries.map((entry) => ({
      ...entry,
      date: entry.date.toISOString().substring(0, 10),
    })),
  });
}

export default function Index() {
  let fetcher = useFetcher();
  let textareaRef = useRef<HTMLTextAreaElement>(null);
  let { entries } = useLoaderData<typeof loader>();

  let entriesByWeek = entries.reduce<Record<string, typeof entries>>(
    (sortedEntries, entry) => {
      let sunday = startOfWeek(parseISO(entry.date));
      let sundayString = format(sunday, "yyyy-MM-dd");

      sortedEntries[sundayString] ||= [];
      sortedEntries[sundayString].push(entry);

      return sortedEntries;
    },
    {}
  );

  let weeks = Object.keys(entriesByWeek)
    .sort((a, b) => a.localeCompare(b))
    .map((dateString) => ({
      dateString,
      work: entriesByWeek[dateString].filter((entry) => entry.type === "work"),
      learnings: entriesByWeek[dateString].filter(
        (entry) => entry.type === "learning"
      ),
      interestingThings: entriesByWeek[dateString].filter(
        (entry) => entry.type === "interesting-thing"
      ),
    }));

  useEffect(() => {
    if (fetcher.state === "idle" && textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.focus();
    }
  }, [fetcher.state]);

  return (
    <div>
      <div className="my-8 border p-3">
        <p className="italic">Create a new entry</p>

        <fetcher.Form method="post" className="mt-2">
          <fieldset
            className="disabled:opacity-70"
            disabled={fetcher.state === "submitting"}
          >
            <div>
              <div>
                <input
                  type="date"
                  name="date"
                  className="text-gray-900"
                  required
                  defaultValue={format(new Date(), "yyyy-MM-dd")}
                />
              </div>
              <div className="mt-4 space-x-4">
                <label className="inline-block">
                  <input
                    defaultChecked
                    type="radio"
                    name="type"
                    value="work"
                    className="mr-1"
                  />
                  Work
                </label>
                <label className="inline-block">
                  <input
                    required
                    type="radio"
                    name="type"
                    value="learning"
                    className="mr-1"
                  />
                  Learning
                </label>
                <label className="inline-block">
                  <input
                    type="radio"
                    name="type"
                    value="interesting-thing"
                    className="mr-1"
                  />
                  Interesting thing
                </label>
              </div>
            </div>

            <div className="mt-4">
              <textarea
                ref={textareaRef}
                placeholder="Type your entry..."
                name="text"
                className="w-full text-gray-700"
                required
              />
            </div>
            <div className="mt-2 text-right">
              <button
                type="submit"
                className="bg-blue-500 px-4 py-1 font-semibold text-white"
              >
                {fetcher.state === "submitting" ? "Saving..." : "Save"}
              </button>
            </div>
          </fieldset>
        </fetcher.Form>
      </div>

      <div className="mt-12 space-y-12">
        {weeks.map((week) => (
          <div key={week.dateString}>
            <p className="font-bold">
              Week of {format(parseISO(week.dateString), "MMMM do")}
            </p>
            <div className="mt-3 space-y-4">
              {week.work.length > 0 && (
                <div>
                  <p>Work</p>
                  <ul className="ml-8 list-disc">
                    {week.work.map((entry) => (
                      <EntryListItem key={entry.id} entry={entry} />
                    ))}
                  </ul>
                </div>
              )}
              {week.learnings.length > 0 && (
                <div>
                  <p>Learning</p>
                  <ul className="ml-8 list-disc">
                    {week.learnings.map((entry) => (
                      <EntryListItem key={entry.id} entry={entry} />
                    ))}
                  </ul>
                </div>
              )}
              {week.interestingThings.length > 0 && (
                <div>
                  <p>Intersting things</p>
                  <ul className="ml-8 list-disc">
                    {week.interestingThings.map((entry) => (
                      <EntryListItem key={entry.id} entry={entry} />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EntryListItem({ entry }: { entry: any }) {
  return (
    <li className="group">
      {entry.text}

      <Link
        to={`/entries/${entry.id}/edit`}
        className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100"
      >
        Edit
      </Link>
    </li>
  );
}
