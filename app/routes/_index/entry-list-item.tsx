import { Link, useLoaderData } from "@remix-run/react";
import { format, parseISO } from "date-fns";
import type { loader } from "./route";

export function EntryListItem({ entry }: { entry: any }) {
  let { session } = useLoaderData<typeof loader>();

  return (
    <li className="group leading-7">
      <p className="text-xs text-gray-500">
        {format(parseISO(entry.date), "MMMM dd, yyyy")}
      </p>
      {entry.text}

      {session.isAdmin && (
        <Link
          to={`/entries/${entry.id}/edit`}
          className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100"
        >
          Edit
        </Link>
      )}
    </li>
  );
}
