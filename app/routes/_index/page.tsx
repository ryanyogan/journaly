import { CloudIcon } from "@heroicons/react/20/solid";
import { useFetchers, useLoaderData } from "@remix-run/react";
import { format, parseISO, startOfWeek } from "date-fns";
import { FormField } from "~/components/form-field";
import { EntryList } from "./entry-list";
import type { loader } from "./route";
import { validate } from "./validate";

type Entry = Awaited<ReturnType<typeof loader>>["entries"][number];

export function IndexPage() {
  let fetchers = useFetchers();
  let { entries, userId } = useLoaderData<typeof loader>();

  let optomisticEntries = fetchers.reduce<Entry[]>((memo, f) => {
    if (f.formData) {
      let data = validate(Object.fromEntries(f.formData));
      if (!entries.map((e) => e.id).includes(data.id)) {
        memo.push({
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    }

    return memo;
  }, []);

  entries = [...entries, ...optomisticEntries];

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
    .sort((a, b) => b.localeCompare(a))
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

  return (
    <div>
      {userId && (
        <div className="my-8 border rounded-lg border-gray-700/30 bg-gray-800/50 p-4 lg:mb-20 lg:p-6">
          <div className="flex text-center justify-between">
            <p className="text-sm font-medium text-gray-500 lg:text-base">
              New entry
            </p>
            {optomisticEntries.length > 0 && (
              <CloudIcon className="w-4 h-4 text-gray-500" />
            )}
          </div>
          <FormField />
        </div>
      )}

      <div className="mt-12 space-y-12 border-l-2 border-sky-500/[.15] pl-5 lg:space-y-20 lg:pl-8">
        {weeks.map((week) => (
          <div key={week.dateString} className="relative">
            <div className="absolute left-[-34px] rounded-full bg-gray-900 p-2 lg:left-[-46px]">
              <div className="h-[10px] w-[10px] rounded-full border border-sky-500 bg-gray-900" />
            </div>

            <p className="pt-[5px] text-xs font-semibold uppercase tracking-wider text-sky-500 lg:pt-[3px] lg:text-sm">
              Week of {format(parseISO(week.dateString), "MMMM do")}
            </p>

            <div className="mt-6 space-y-8 lg:space-y-12">
              <EntryList userId={userId} entries={week.work} label="Work" />
              <EntryList
                userId={userId}
                entries={week.learnings}
                label="Learnings"
              />
              <EntryList
                userId={userId}
                entries={week.interestingThings}
                label="Interesting things"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
