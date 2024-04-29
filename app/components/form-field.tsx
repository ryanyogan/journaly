import { Form, useFetcher, useSubmit } from "@remix-run/react";
import { format } from "date-fns";
import { useRef } from "react";
import { validate } from "~/routes/_index/validate";

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
  let submit = useSubmit();

  return (
    <Form
      method="post"
      className="mt-4"
      onSubmit={(e) => {
        e.preventDefault();

        let formData = new FormData(e.currentTarget);
        let data = validate(Object.fromEntries(formData));

        submit(
          { ...data, id: crypto.randomUUID(), intent: "createEntry" },
          {
            navigate: false,
            method: "post",
          }
        );

        if (textareaRef.current) {
          textareaRef.current.value = "";
          textareaRef.current.focus();
        }
      }}
    >
      <input type="hidden" name="intent" value="createEntry" />
      <fieldset>
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="lg:order-2">
            <input
              type="date"
              name="date"
              style={{ colorScheme: "dark" }}
              className="w-full rounded-sm border-gray-700 bg-gray-800 text-white focus:border-sky-600 focus:ring-sky-600"
              required
              defaultValue={entry?.date ?? format(new Date(), "yyyy-MM-dd")}
            />
          </div>

          <div className="mt-6 flex space-x-4 text-sm lg:mt-0 lg:space-x-6 lg:text-base">
            {[
              { label: "Work", value: "work" },
              { label: "Learning", value: "learning" },
              { label: "Interesting thing", value: "interesting-thing" },
            ].map((option) => (
              <label key={option.value} className="inline-block text-white">
                <input
                  required
                  type="radio"
                  name="type"
                  value={option.value}
                  defaultChecked={option.value === (entry?.type ?? "work")}
                  className="mr-2 border-gray-700 bg-gray-800 text-sky-600  focus:ring-sky-600 focus:ring-offset-gray-900"
                />
                {option.label}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <textarea
            ref={textareaRef}
            placeholder="Type your entry..."
            name="text"
            className="w-full rounded-md border-gray-700 bg-gray-800 text-white focus:border-sky-600 focus:ring-sky-600"
            required
            defaultValue={entry?.text}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.currentTarget.form?.dispatchEvent(
                  new Event("submit", { bubbles: true, cancelable: true })
                );
              }
            }}
          />
        </div>
        <div className="mt-6 text-right">
          <button
            type="submit"
            className="w-full rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-sky-600 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            {fetcher.state === "submitting" ? "Saving..." : "Save"}
          </button>
        </div>
      </fieldset>
    </Form>
  );
}
