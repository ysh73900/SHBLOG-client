import { useDispatch, useSelector } from "react-redux";
import { clearPosts, getPosts } from "../../features/postSlice";
import { useEffect, useRef } from "react";
import ArrowCard from "../../components/ArrowCard";
import { Link } from "react-router-dom";
import { cn } from "../../utils/utils";
import useDropdown from "../../hooks/useDropdown";
import Dropdown from "../../components/Dropdown";
import useDropdownClick from "../../hooks/useDropdownClick";

const BlogPage = () => {
  const dispatch = useDispatch();
  const { items, status, currentPage, totalElements } = useSelector(
    (state) => state.posts
  );
  const { isLoggedIn, role } = useSelector((state) => state.auth);

  // dropdown
  const dropdownRef = useRef(null);
  const { isOpenDropdown, setIsOpenDropdown, handleDropdownClose } =
    useDropdown();
  useDropdownClick(dropdownRef, handleDropdownClose);

  const isAdmin = isLoggedIn && role === "ROLE_ADMIN";

  // "더 보기" 버튼 클릭 핸들러
  const handleLoadMore = () => {
    dispatch(getPosts({ page: currentPage + 1, size: 5 }));
  };

  const canLoadMore = status !== "loading" && items.length < totalElements;

  useEffect(() => {
    dispatch(getPosts({ page: 0, size: 5 }));

    // 컴포넌트 언마운트 시(페이지 이탈 시)
    // posts 상태를 초기화하여, 다음에 돌아왔을 때 중복 로드를 방지
    return () => {
      dispatch(clearPosts());
    };
  }, [dispatch]);

  return (
    <>
      <div className="pt-36" />
      <div className="px-5 mb-5 text-2xl text-white">블로그</div>
      <div className="pb-5 border-t dark:border-white/20 flex animate-swoop-up">
        <div className="w-4/5 border-r border-black/15 dark:border-white/20 px-5">
          <div className="w-full h-full mx-auto max-w-screen-lg pt-5">
            <div className="flex justify-between">
              <div className="page-heading show mb-5">
                게시글 <span className="text-emerald-500">{totalElements}</span>
              </div>

              <div className="relative inline-block" ref={dropdownRef}>
                {isAdmin && (
                  <button
                    id="header-theme-button"
                    aria-label={`Toggle light and dark theme`}
                    className={cn(
                      "hidden md:flex",
                      "size-9 rounded-full p-2 items-center justify-center",
                      "bg-transparent hover:bg-black/5 dark:hover:bg-white/20",
                      "stroke-current hover:stroke-black hover:dark:stroke-white",
                      "transition-colors duration-300 ease-in-out"
                    )}
                    onClick={() => setIsOpenDropdown(!isOpenDropdown)}
                  >
                    <svg className="size-full">
                      <use href="/ui.svg#more-vertical-dots"></use>
                    </svg>
                  </button>
                )}

                <Dropdown
                  isOpenDropdown={isOpenDropdown}
                  handleDropdownClose={handleDropdownClose}
                >
                  <Link
                    to="/write"
                    className="text-white block px-4 py-2 text-sm hover:bg-zinc-900"
                    role="menuitem"
                    onClick={() => handleDropdownClose()}
                  >
                    글쓰기
                  </Link>
                  <a
                    href="#" // '삭제하기' 로직
                    className="text-white block px-4 py-2 text-sm hover:bg-zinc-900"
                    role="menuitem"
                    onClick={() => {
                      handleDropdownClose();
                    }}
                  >
                    삭제
                  </a>
                </Dropdown>
              </div>
            </div>

            <ul className="space-y-4">
              {items.map((post, index) => (
                <li key={post.slug}>
                  <ArrowCard entry={post} borderNeon delay={index * 0.5} />
                </li>
              ))}
            </ul>

            <div className="flex justify-center py-10">
              {canLoadMore && (
                <button
                  onClick={handleLoadMore}
                  className="w-full relative gap-3 rounded-lg border-2 border-black/15 p-2
                transition-colors duration-300 ease-in-out
              hover:bg-black/5 dark:border-white/20 hover:dark:bg-white/10"
                >
                  더 보기
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="w-1/5 text-white px-5 pt-5">df</div>
      </div>
    </>
  );
};

export default BlogPage;
