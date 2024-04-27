import { useFetcher, useFetchers, useLoaderData } from "@remix-run/react";
import { format, parseISO, startOfWeek } from "date-fns";
import { nanoid } from "nanoid";
import { useEffect, useRef } from "react";
import { FormField } from "~/components/form-field";
import { EntryList } from "./entry-list";
import type { loader } from "./route";

export function IndexPage() {
  let fetcher = useFetcher();
  let textareaRef = useRef<HTMLTextAreaElement>(null);
  let { entries: serverEntries, userId } = useLoaderData<typeof loader>();

  let pendingEntries = usePendingEntries();
  type Entry = (typeof serverEntries)[number] | (typeof pendingEntries)[number];
  let entries = [...serverEntries, ...pendingEntries] as Entry[];

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

  useEffect(() => {
    if (fetcher.state === "idle" && textareaRef.current) {
      textareaRef.current.value = "";
      textareaRef.current.focus();
    }
  }, [fetcher.state]);

  return (
    <div>
      {userId && (
        <div className="my-8 border rounded-lg border-gray-700/30 bg-gray-800/50 p-4 lg:mb-20 lg:p-6">
          <p className="text-sm font-medium text-gray-500 lg:text-base">
            New entry
          </p>
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

function usePendingEntries() {
  type CreateEntryFetcher = ReturnType<typeof useFetchers>[number] & {
    formData: FormData;
  };

  return useFetchers()
    .filter((fetcher): fetcher is CreateEntryFetcher => {
      return fetcher.formData?.get("intent") === "createEntry";
    })
    .map((fetcher) => {
      let text = String(fetcher.formData.get("text"));
      let type = String(fetcher.formData.get("type"));
      let date = String(fetcher.formData.get("date"));
      return { text, type, date, id: nanoid() };
    });
}
