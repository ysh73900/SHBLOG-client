import { Link } from "react-router-dom";
import { cn } from "../utils/utils";
import { formatDate } from "../utils/dateUtils";

const ArrowCard = ({ entry, pill, handleDelete, isAdmin, handleModalOpen }) => {
  const onDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    handleModalOpen();
  };
  return (
    <Link
      className="group relative flex items-center gap-3 rounded-lg border-4 border-black/15 p-4 transition-colors duration-300 ease-in-out
      hover:bg-black/5 dark:border-white/20 hover:dark:bg-white/10"
      to={`/blog/${entry.slug}`}
    >
      <div className="blend w-full group-hover:text-black group-hover:dark:text-white">
        <div className="flex flex-wrap items-center gap-2">
          {pill && (
            <div className="rounded-full border border-black/15 px-2 py-0.5 text-sm capitalize dark:border-white/25">
              post
            </div>
          )}
          <div className="font-departure text-sm uppercase">
            {formatDate(entry.publishDate)}
          </div>
        </div>

        <div className="mt-3 font-semibold text-black dark:text-white">
          {entry.title}
        </div>

        <div className="line-clamp-2 text-sm">{entry.description}</div>

        <ul className="mt-2 flex flex-wrap gap-1">
          {entry.tags?.map((tag) => (
            <li
              key={tag}
              className="rounded bg-black/5 px-1 py-0.5 font-departure text-black/75 text-xs uppercase dark:bg-white/20 dark:text-white/75"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>

      {handleDelete && isAdmin && (
        <button
          id="header-theme-button"
          aria-label={`Toggle light and dark theme`}
          className={cn(
            "absolute top-0 right-0",
            "hidden md:flex",
            "size-9 rounded-full p-2 items-center justify-center",
            "bg-transparent hover:bg-black/5 dark:hover:bg-white/20",
            "stroke-current hover:stroke-black hover:dark:stroke-white",
            "transition-colors duration-300 ease-in-out"
          )}
          onClick={onDeleteClick}
        >
          <svg className="size-full">
            <use href="/ui.svg#x"></use>
          </svg>
        </button>
      )}

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
