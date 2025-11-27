import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  clearCurrentPost,
  deletePost,
  getPostBySlug,
} from "../../features/postSlice";
import { formatDate } from "../../utils/dateUtils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import useDropdown from "../../hooks/useDropdown";
import useDropdownClick from "../../hooks/useDropdownClick";
import Dropdown from "../../components/Dropdown";
import { cn } from "../../utils/utils";
import useModal from "../../hooks/useModal";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";

const PostDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [deletePostId, setDeletePostId] = useState(null);

  const { currentPost, detailStatus } = useSelector((state) => state.posts);
  const { isLoggedIn, role } = useSelector((state) => state.auth);

  const isAdmin = isLoggedIn && role === "ROLE_ADMIN";

  const {
    openModal: deleteConfirmModalOpen,
    handleModalClose: handleDeleteConfirmModalClose,
    handleModalOpen: handleDeleteConfirmModalOpen,
  } = useModal();

  // 드롭다운
  const dropdownRef = useRef(null);
  const { isOpenDropdown, setIsOpenDropdown, handleDropdownClose } =
    useDropdown();
  useDropdownClick(dropdownRef, handleDropdownClose);

  // 삭제 버튼 클릭 핸들러
  const handleClickDeleteButton = (postId) => {
    setDeletePostId(postId);
    handleDropdownClose();
    handleDeleteConfirmModalOpen();
  };

  // 삭제 핸들러
  const handleDelete = async () => {
    if (deletePostId) {
      await dispatch(deletePost(deletePostId));
      handleDeleteConfirmModalClose();
      navigate("/blog");
    }
  };

  // TODO: 수정하기 핸들러 만들기

  useEffect(() => {
    if (slug) {
      dispatch(getPostBySlug(slug));
    }
    return () => {
      dispatch(clearCurrentPost());
    };
  }, [dispatch, slug]);

  if (detailStatus === "loading") {
    return (
      <div className="pt-36 text-center text-white">
        <p>글을 불러오는 중입니다...</p>
      </div>
    );
  }

  if (!currentPost) {
    return null;
  }
  return (
    <>
      <div className="pt-36" />
      <div className="border-t dark:border-white/20 flex animate animate-swoop-up">
        <div className="w-4/5 h-screen">
          <div className="w-full h-full mx-auto max-w-screen-lg pt-5">
            {/* <div className="flex justify-between">
              <div className="page-heading show mb-5">상세페이지</div>
            </div> */}
            <div className="mb-8">
              {/* 날짜 */}
              <div className="flex justify-between h-[36px]">
                <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-departure">
                    {formatDate(currentPost.publishDate)}
                  </span>
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
                    <button
                      className="w-full text-white block px-4 py-2 text-sm hover:bg-zinc-900"
                      // onClick={() => handleClickDeleteButton(currentPost.id)}
                    >
                      수정하기
                    </button>
                    <button
                      className="w-full text-white block px-4 py-2 text-sm hover:bg-zinc-900"
                      onClick={() => handleClickDeleteButton(currentPost.id)}
                    >
                      삭제하기
                    </button>
                  </Dropdown>
                </div>
              </div>

              {/* 태그 목록 */}
              {currentPost.tags && currentPost.tags.length > 0 && (
                <ul className="flex flex-wrap gap-1 mb-4">
                  {currentPost.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded bg-black/5 px-1 py-0.5 font-departure text-black/75 text-xs uppercase dark:bg-white/20 dark:text-white/75"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}

              {/* 제목 */}
              <h1 className="font-departure text-4xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
                {currentPost.title}
              </h1>

              {/* 요약 설명 */}
              <div className="font-departure text-black/75 text-sm uppercase dark:text-white/75 mt-2">
                {currentPost.description}
              </div>

              {/* 본문 */}
              <div className="font-departure prose dark:prose-invert max-w-none pb-10 prose-headings:font-bold prose-a:text-emerald-500 hover:prose-a:text-emerald-400 mt-10">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {currentPost.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        openModal={deleteConfirmModalOpen}
        handleModalClose={handleDeleteConfirmModalClose}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default PostDetailPage;
