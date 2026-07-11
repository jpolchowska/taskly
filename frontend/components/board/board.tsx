import { Column } from "./column";
import { QuoteCard } from "./quote-card";
import { Topbar } from "./topbar";

const COLUMNS = [
  {
    title: "To do",
    tasks: [
      { id: "1", title: "Study for algorithms quiz", category: "Study" },
      { id: "2", title: "Gym – leg day", category: "Health" },
      { id: "3", title: "Update portfolio site", category: "Work" },
      { id: "4", title: "Grocery shopping", category: "Home" },
    ],
  },
  {
    title: "In progress",
    tasks: [{ id: "5", title: "Research paper draft", category: "Study" }],
  },
  {
    title: "Done",
    tasks: [
      { id: "6", title: "Lecture notes", category: "Study" },
      { id: "7", title: "Project presentation", category: "Study" },
      { id: "8", title: "Walk my dog", category: "Personal" },
    ],
  },
];

const SAMPLE_QUOTE = {
  text: "The key is not to prioritize what's on your schedule, but to schedule your priorities.",
  author: "Stephen Covey",
};

export function Board() {
  return (
    <div className="min-h-screen bg-background px-14 py-10">
      <div className="mx-auto max-w-[1180px]">
        <Topbar />
        <QuoteCard text={SAMPLE_QUOTE.text} author={SAMPLE_QUOTE.author} />
        <div className="grid grid-cols-3 gap-6">
          {COLUMNS.map((column) => (
            <Column key={column.title} title={column.title} tasks={column.tasks} />
          ))}
        </div>
      </div>
    </div>
  );
}
