import { Link, useLocation } from "react-router-dom";
import { LINKS, SITE } from "../consts";
import { cn } from "../utils/utils";
import Container from "./Container";
import { useEffect, useState } from "react";

const Header = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const subpath = pathname.split("/").filter(Boolean);

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const root = document.documentElement; // <html> 태그
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header id="header" className="fixed top-0 w-full h-16 z-50">
      <Container size="md">
        <div className="relative h-full w-full">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 flex gap-1 font-semibold">
            <Link
              to="/"
              className="flex flex-row gap-1 text-current hover:text-black dark:hover:text-white transition-colors duration-300 ease-in-out"
            >
              <div className="size-6 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden">
                <img
                  className="size-5"
                  src="/logo.png" // 이 파일은 public 폴더에 있어야 합니다.
                  width="24"
                  height="24"
                  alt="logo"
                />
              </div>
              <div>{SITE.TITLE}</div>
            </Link>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <nav className="hidden md:flex items-center justify-center text-sm gap-1">
              {LINKS.map((LINK) => (
                <Link
                  key={LINK.HREF}
                  to={LINK.HREF}
                  className={cn(
                    "h-8 rounded-full px-3 text-current",
                    "flex items-center justify-center",
                    "transition-colors- duration-300 ease-in-out",
                    pathname === LINK.HREF || "/" + subpath?.[0] === LINK.HREF
                      ? "bg-black dark:bg-white text-white dark:text-black"
                      : "hover:bg-black/5 dark:hover:bg-white/20 hover:text-black dark:hover:text-white"
                  )}
                >
                  {LINK.TEXT}
                </Link>
              ))}
            </nav>
          </div>

          <div className="buttons absolute right-0 top-1/2 -translate-y-1/2 flex gap-1">
            <Link
              to="/search"
              aria-label={`Search blog posts and projects on ${SITE.TITLE}`}
              className={cn(
                "hidden md:flex",
                "size-9 rounded-full p-2 items-center justify-center",
                "bg-transparent hover:bg-black/5 dark:hover:bg-white/20",
                "stroke-current hover:stroke-black hover:dark:stroke-white",
                "border border-black/10 dark:border-white/25",
                "transition-colors duration-300 ease-in-out",
                pathname === "/search" || "/" + subpath?.[0] === "/search"
                  ? "pointer-events-none bg-black dark:bg-white text-white dark:text-black"
                  : ""
              )}
            >
              <svg className="size-full">
                <use href="/ui.svg#search"></use>{" "}
                {/* public 폴더의 SVG 스프라이트 */}
              </svg>
            </Link>

            <a
              href="/rss.xml"
              target="_blank"
              aria-label={`Rss feed for ${SITE.TITLE}`}
              className={cn(
                "hidden md:flex",
                "size-9 rounded-full p-2 items-center justify-center",
                "bg-transparent hover:bg-black/5 dark:hover:bg-white/20",
                "stroke-current hover:stroke-black hover:dark:stroke-white",
                "border border-black/10 dark:border-white/25",
                "transition-colors duration-300 ease-in-out"
              )}
            >
              <svg className="size-full">
                <use href="/ui.svg#rss"></use>
              </svg>
            </a>

            {/* 3단계: 다크 모드 버튼 로직을 추가합니다. */}
            <button
              id="header-theme-button"
              aria-label={`Toggle light and dark theme`}
              className={cn(
                "hidden md:flex",
                "size-9 rounded-full p-2 items-center justify-center",
                "bg-transparent hover:bg-black/5 dark:hover:bg-white/20",
                "stroke-current hover:stroke-black hover:dark:stroke-white",
                "border border-black/10 dark:border-white/25",
                "transition-colors duration-300 ease-in-out"
              )}
              onClick={toggleTheme}
            >
              <svg className="size-full block dark:hidden">
                <use href="/ui.svg#sun"></use>
              </svg>
              <svg className="size-full hidden dark:block">
                <use href="/ui.svg#moon"></use>
              </svg>
            </button>

            {/* 4단계: Drawer(서랍) 메뉴 버튼 로직을 추가합니다. */}
            <button
              id="header-drawer-button"
              aria-label={`Toggle drawer open and closed`}
              className={cn(
                "flex md:hidden",
                "size-9 rounded-full p-2 items-center justify-center",
                "bg-transparent hover:bg-black/5 dark:hover:bg-white/20",
                "stroke-current hover:stroke-black hover:dark:stroke-white",
                "border border-black/10 dark:border-white/25",
                "transition-colors duration-300 ease-in-out"
              )}
            >
              <svg id="drawer-open" className="size-full block">
                {" "}
                {/* 기본값 block */}
                <use href="/ui.svg#menu"></use>
              </svg>
              <svg id="drawer-close" className="size-full hidden">
                {" "}
                {/* 기본값 hidden */}
                <use href="/ui.svg#x"></use>
              </svg>
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
