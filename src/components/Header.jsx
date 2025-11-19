import { Link, useLocation } from "react-router-dom";
import { LINKS, SITE } from "../consts";
import { cn } from "../utils/utils";
import Container from "./Container";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useModal from "../hooks/useModal";
import LoginModal from "./LoginModal";
import { logoutUser } from "../features/authSlice";
import SignupModal from "./SignupModal";

const Header = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const subpath = pathname.split("/").filter(Boolean);
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  const [theme, setTheme] = useState("dark");
  const [isScrolled, setIsScrolled] = useState(false);

  const {
    openModal: loginOpen,
    handleModalClose: handleLoginClose,
    handleModalOpen: handleLoginOpen,
  } = useModal();

  const {
    openModal: signupOpen,
    handleModalClose: handleSignupClose,
    handleModalOpen: handleSignupOpen,
  } = useModal();

  const handleLogin = () => {
    handleLoginOpen();
  };

  const handleLogout = () => {
    const refreshToken = localStorage.getItem("refreshToken");
    dispatch(logoutUser(refreshToken));
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  useEffect(() => {
    const root = document.documentElement; // <html> 태그
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header
      id="header"
      className={cn("fixed top-0 w-full h-16 z-50", { scrolled: isScrolled })}
    >
      <Container size="2xl">
        <div className="relative h-full w-full">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 flex gap-1 font-semibold">
            <Link
              to="/"
              className="flex flex-row gap-1 text-current hover:text-black dark:hover:text-white transition-colors duration-300 ease-in-out"
            >
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

          <div className="buttons absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {/* --- 1. 검색 버튼 --- */}
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
                <use href="/ui.svg#search"></use>
              </svg>
            </Link>
            {/* --- 2. 다크모드 버튼 --- */}
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
            {/* --- 3. 로그인/회원가입 버튼 --- */}
            {isLoggedIn ? (
              <ul className="flex items-center gap-1 text-sm ml-1">
                <button
                  className={cn(
                    "hidden md:flex",
                    "size-9 rounded-full p-2 items-center justify-center",
                    "bg-transparent hover:bg-black/5 dark:hover:bg-white/20",
                    "stroke-current hover:stroke-black hover:dark:stroke-white",
                    "border border-black/10 dark:border-white/25",
                    "transition-colors duration-300 ease-in-out"
                  )}
                  onClick={handleLogout}
                >
                  <svg className="size-full">
                    <use href="/ui.svg#log-out"></use>
                  </svg>
                </button>
              </ul>
            ) : (
              <div className="flex items-center gap-1 text-sm ml-1">
                <button
                  className={cn(
                    "hidden md:flex",
                    "size-9 rounded-full p-2 items-center justify-center",
                    "bg-transparent hover:bg-black/5 dark:hover:bg-white/20",
                    "stroke-current hover:stroke-black hover:dark:stroke-white",
                    "border border-black/10 dark:border-white/25",
                    "transition-colors duration-300 ease-in-out"
                  )}
                  onClick={handleLogin}
                >
                  <svg className="size-full">
                    <use href="/ui.svg#user"></use>
                  </svg>
                </button>
                {/* <button className="mr-1 cursor-pointer" onClick={handleLogin}>
                  <svg className="size-full">
                    <use href="/ui.svg#user"></use>
                  </svg>
                </button> */}
              </div>
            )}
            {/* --- 3. 모바일 햄버거 버튼 (맨 마지막) --- */}
            <button
              id="header-drawer-button"
              aria-label={`Toggle drawer open and closed`}
              className={cn(
                "flex md:hidden", // 모바일에서만 보이도록
                "size-9 rounded-full p-2 items-center justify-center",
                "bg-transparent hover:bg-black/5 dark:hover:bg-white/20",
                "stroke-current hover:stroke-black hover:dark:stroke-white",
                "border border-black/10 dark:border-white/25",
                "transition-colors duration-300 ease-in-out"
              )}
            >
              <svg id="drawer-open" className="size-full block">
                <use href="/ui.svg#menu"></use>
              </svg>
              <svg id="drawer-close" className="size-full hidden">
                <use href="/ui.svg#x"></use>
              </svg>
            </button>
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-y-1/2"></div>
        </div>
        <LoginModal
          openModal={loginOpen}
          handleModalClose={handleLoginClose}
          handleSignupOpen={handleSignupOpen}
        />
        <SignupModal
          openModal={signupOpen}
          handleModalClose={handleSignupClose}
        />
      </Container>
    </header>
  );
};

export default Header;
