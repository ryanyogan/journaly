import { EntryListItem } from "./entry-list-item";

export function EntryList({
  entries,
  label,
}: {
  entries: any[];
  label: string;
}) {
  return entries.length > 0 ? (
    <div>
      <p className="font-semibold text-white">{label}</p>

      <ul className="mt-4 space-y-6">
        {entries.map((entry) => (
          <EntryListItem key={entry.id} entry={entry} />
        ))}
      </ul>
    </div>
  ) : null;
}
