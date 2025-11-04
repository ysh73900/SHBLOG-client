import { formatDate } from "date-fns";
import { Link } from "react-router-dom";

const ArrowCard = ({ entry, pill }) => {
  return (
    <Link
      className="group relative flex items-center gap-3 rounded-lg border-4 border-black/15 p-4 transition-colors duration-300 ease-in-out
      hover:bg-black/5 dark:border-white/20 hover:dark:bg-white/10"
      href={`/${entry.slug}`}
    >
      <div className="blend w-full group-hover:text-black group-hover:dark:text-white">
        <div className="flex flex-wrap items-center gap-2">
          {pill && (
            <div className="rounded-full border border-black/15 px-2 py-0.5 text-sm capitalize dark:border-white/25">
              post
            </div>
          )}
          <div className="font-departure text-sm uppercase">
            {formatDate(new Date(entry.data.date), "MM dd yyyy")}
          </div>
        </div>

        <div className="mt-3 font-semibold text-black dark:text-white">
          {entry.data.title}
        </div>

        <div className="line-clamp-2 text-sm">{entry.data.description}</div>

        <ul className="mt-2 flex flex-wrap gap-1">
          {entry.data.tags?.map((tag) => (
            <li
              key={tag}
              className="rounded bg-black/5 px-1 py-0.5 font-departure text-black/75 text-xs uppercase dark:bg-white/20 dark:text-white/75"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <svg
        className="stroke-current group-hover:stroke-black group-hover:dark:stroke-white"
        fill="none"
        height="20"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
        width="20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          className="translate-x-4 scale-x-0 transition-all duration-300 ease-in-out group-hover:translate-x-1 group-hover:scale-x-100"
          x1="5"
          x2="19"
          y1="12"
          y2="12"
        />
        <polyline
          className="translate-x-0 transition-all duration-300 ease-in-out group-hover:translate-x-1"
          points="12 5 19 12 12 19"
        />
      </svg>
    </Link>
  );
};
export default ArrowCard;
