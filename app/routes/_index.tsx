import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Journal" },
    { name: "description", content: "Write it ... or it didn't happen" },
  ];
};

export default function Index() {
  return (
    <div className="p-10">
      <h1 className="text-5xl">Work Journal</h1>
      <p className="mt-2 text-lg text-gray-400">
        Learnings and doings. Updated weekly.
      </p>

      <div className="mt-6">
        <p className="font-bold">
          Week of April 20<sup>th</sup>
        </p>

        <div className="mt-3 space-y-4">
          <div>
            <p>Work</p>
            <ul className="ml-8 list-disc">
              <li>First Item</li>
              <li>Second Item</li>
            </ul>
          </div>
          <div>
            <p>Learnings</p>
            <ul className="ml-8 list-disc">
              <li>First Item</li>
              <li>Second Item</li>
            </ul>
          </div>
          <div>
            <p>Interesting things</p>
            <ul className="ml-8 list-disc">
              <li>First Item</li>
              <li>Second Item</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
