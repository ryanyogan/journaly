import { useFetcher } from "@remix-run/react";
import { format } from "date-fns";
import { useEffect, useRef } from "react";

export function FormField({
  entry,
}: {
  entry?: {
    text: string;
    date: string;
    type: string;
  };
}) {
  let fetcher = useFetcher();
  let textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (
      fetcher.state === "idle" &&
      fetcher.data === null &&
      textareaRef.current
    ) {
      textareaRef.current.value = "";
      textareaRef.current.focus();
    }
  }, [fetcher.state, fetcher.data]);

  return (
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
            {[
              { label: "Work", value: "work" },
              { label: "Learning", value: "learning" },
              { label: "Interesting thing", value: "interesting-thing" },
            ].map((option) => (
              <label key={option.value} className="inline-block">
                <input
                  required
                  type="radio"
                  name="type"
                  value="work"
                  defaultChecked={option.value === (entry?.type ?? "work")}
                  className="mr-1"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <textarea
            ref={textareaRef}
            placeholder="Type your entry..."
            name="text"
            className="w-full text-gray-700"
            required
            defaultValue={entry?.text}
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
  );
}
