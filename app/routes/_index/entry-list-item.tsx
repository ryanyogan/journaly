import { Link } from "@remix-run/react";

export function EntryListItem({
  entry,
  userId,
}: {
  entry: any;
  userId?: string | null;
}) {
  return (
    <li className="group leading-7 text-gray-300">
      {entry.text}

      {userId && (
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
