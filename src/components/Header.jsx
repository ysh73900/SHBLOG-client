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
import ThemeToggle from "./ThemeToggle";

const Header = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const subpath = pathname.split("/").filter(Boolean);
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  const [theme, setTheme] = useState("dark");
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

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

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      await dispatch(logoutUser(refreshToken)).unwrap();
    } catch (error) {
      console.error("로그아웃 실패", error);
    } finally {
      window.location.reload();
    }
  };

  // useEffect(() => {
  //   const handleScroll = () => {
  //     if (window.scrollY > 0) {
  //       setIsScrolled(true);
  //     } else {
  //       setIsScrolled(false);
  //     }
  //   };
  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // });

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

  // 스크롤 진행률 계산 로직
  useEffect(() => {
    const calculateScrollProgress = () => {
      // 현재 스크롤 위치
      const scrollTop = window.scrollY;
      // 문서의 전체 높이
      const docHeight = document.documentElement.scrollHeight;
      // 화면 높이
      const winHeight = window.innerHeight;
      // 실제 스크롤 가능한 높이 (전체 높이 - 화면 높이)
      const scrollableHeight = docHeight - winHeight;

      // 스크롤이 시작되었는지 확인 (isScrolled 상태 업데이트)
      if (scrollTop > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // 스크롤 진행률 계산
      if (scrollableHeight > 0) {
        // 스크롤 위치 / 스크롤 가능한 높이 * 100
        const progress = (scrollTop / scrollableHeight) * 100;
        setScrollProgress(progress);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener("scroll", calculateScrollProgress);
    window.addEventListener("resize", calculateScrollProgress);

    // 컴포넌트 마운트 시 초기 값 설정
    calculateScrollProgress();

    return () => {
      window.removeEventListener("scroll", calculateScrollProgress);
      window.removeEventListener("resize", calculateScrollProgress);
    };
  }, []);

  return (
    <header
      id="header"
      className={cn(
        "fixed top-0 w-full h-16 z-50 transition-shadow duration-300",
        { "bg-white/90 dark:bg-black/90 shadow backdrop-blur-sm": isScrolled }
      )}
    >
      <div
        className="absolute bottom-0 left-0 h-[2px] bg-emerald-500 transition-opacity duration-300" // h-[2px]로 얇은 선 지정
        style={{
          width: `${scrollProgress}%`, // 스크롤 진행률에 따라 너비 설정
          opacity: isScrolled ? 1 : 0, // isScrolled가 true일 때만 보이도록 (0px 스크롤 시 숨김)
        }}
        aria-hidden="true"
      ></div>

      <Container size="2xl">
        <div className="relative h-full w-full">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 flex gap-1 font-semibold">
            <Link
              to="/"
              className="flex flex-row gap-1 text-current hover:text-black dark:hover:text-white"
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
            {/* --- 1. 다크모드 버튼 --- */}
            <div className="hidden md:flex items-center mr-3">
              <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>
            {/* --- 2. 검색 버튼 --- */}
            <Link
              to="/search"
              aria-label={`Search blog posts and projects on ${SITE.TITLE}`}
              className={cn(
                "hidden md:flex",
                "size-9 rounded-full p-2 items-center justify-center",
                "bg-transparent hover:bg-black/5 dark:hover:bg-white/20",
                "stroke-current hover:stroke-black hover:dark:stroke-white",
                "border border-black/10 dark:border-white/25",
                pathname === "/search" || "/" + subpath?.[0] === "/search"
                  ? "pointer-events-none bg-black dark:bg-white text-white dark:text-black"
                  : ""
              )}
            >
              <svg className="size-full">
                <use href="/ui.svg#search"></use>
              </svg>
            </Link>
            {/* --- 3. 로그인/회원가입 버튼 --- */}
            {isLoggedIn ? (
              <ul className="flex items-center gap-1 text-sm ml-1">
                <button
                  className={cn(
                    "hidden md:flex",
                    "size-9 rounded-full p-2 items-center justify-center",
                    "bg-transparent hover:bg-black/5 dark:hover:bg-white/20",
                    "stroke-current hover:stroke-black hover:dark:stroke-white",
                    "border border-black/10 dark:border-white/25"
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
                    "border border-black/10 dark:border-white/25"
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
            {/* --- 4. 모바일 햄버거 버튼 (맨 마지막) --- */}
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
