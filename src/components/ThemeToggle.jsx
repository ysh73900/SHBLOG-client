import { cn } from "../utils/utils";

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "relative w-12 h-7 rounded-full transition-colors duration-300 ease-in-out focus:outline-none",
        theme === "dark"
          ? "bg-zinc-700 border border-zinc-600"
          : "bg-zinc-200 border border-zinc-300"
      )}
      aria-label="Toggle Dark Mode"
    >
      <div
        className={cn(
          "absolute top-0.5 left-0.5 left0.5 w-6 h-6 rounded-full   bg-black shadow-md transform transition-transform duration-300 ease-in-out flex items-center justify-center",
          "stroke-current",
          // 다크모드면 오른쪽으로 이동, 아니면 왼쪽으로 이동
          theme === "dark" ? "translate-x-5 bg-black" : "translate-x-0 bg-white"
        )}
      >
        <svg className="size-4 block dark:hidden">
          <use href="/ui.svg#sun"></use>
        </svg>
        <svg className="size-4 hidden dark:block">
          <use href="/ui.svg#moon"></use>
        </svg>
      </div>
    </button>
  );
};

export default ThemeToggle;
{
  /* <svg className="size-full block dark:hidden">
                <use href="/ui.svg#sun"></use>
              </svg>
              <svg className="size-full hidden dark:block">
                <use href="/ui.svg#moon"></use>
              </svg> */
}
