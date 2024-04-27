import { EntryListItem } from "./entry-list-item";

export function EntryList({
  entries,
  label,
  userId,
}: {
  entries: any[];
  label: string;
  userId?: string | null;
}) {
  return entries.length > 0 ? (
    <div>
      <p className="font-semibold text-gray-100">{label}</p>

      <ul className="mt-4 space-y-6">
        {entries.map((entry) => (
          <EntryListItem userId={userId} key={entry.id} entry={entry} />
        ))}
      </ul>
    </div>
  ) : null;
}
