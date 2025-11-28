import { useDispatch, useSelector } from "react-redux";
import { clearPosts, deletePost, getPosts } from "../../features/postSlice";
import { useEffect, useRef, useState } from "react";
import ArrowCard from "../../components/ArrowCard";
import { Link } from "react-router-dom";
import { cn } from "../../utils/utils";
import useDropdown from "../../hooks/useDropdown";
import Dropdown from "../../components/Dropdown";
import useDropdownClick from "../../hooks/useDropdownClick";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import useModal from "../../hooks/useModal";

const BlogPage = () => {
  const [deletePostId, setDeletePostId] = useState(null);

  const dispatch = useDispatch();
  const { items, status, currentPage, totalElements } = useSelector(
    (state) => state.posts
  );
  const { isLoggedIn, role } = useSelector((state) => state.auth);

  const {
    openModal: deleteConfirmModalOpen,
    handleModalClose: handleDeleteConfirmModalClose,
    handleModalOpen: handleDeleteConfirmModalOpen,
  } = useModal();

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

  // 삭제 버튼 클릭 핸들러
  const handleClickDeleteButton = (postId) => {
    setDeletePostId(postId);
    handleDeleteConfirmModalOpen();
  };

  // 삭제 핸들러
  const handleDelete = async () => {
    if (deletePostId) {
      await dispatch(deletePost(deletePostId));
      handleDeleteConfirmModalClose();
    }
  };

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
      <div className="pt-20" />
      <div className="flex animate-swoop-up">
        <div className="w-4/5 border-r border-black/15 dark:border-white/20 px-5">
          <div className="w-full h-full mx-auto max-w-screen-lg pt-5">
            <div className="font-departure mb-5 font-semibold text-2xl text-white">
              블로그
            </div>
            <div className="flex justify-between">
              <div className="page-heading show mb-5">
                게시글{" "}
                <span className="font-departure text-emerald-500">
                  {totalElements}
                </span>
              </div>

              {isAdmin && (
                <Link
                  to="/write"
                  className="page-heading show mb-5"
                  role="menuitem"
                  onClick={() => handleDropdownClose()}
                >
                  글쓰기
                </Link>
              )}
            </div>

            <ul className="space-y-4">
              {items.map((post, index) => (
                <li key={post.slug}>
                  <ArrowCard
                    entry={post}
                    borderNeon
                    delay={index * 0.5}
                    handleDelete={handleDelete}
                    isAdmin={isAdmin}
                    handleModalOpen={() => handleClickDeleteButton(post.id)}
                  />
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

      <DeleteConfirmModal
        openModal={deleteConfirmModalOpen}
        handleModalClose={handleDeleteConfirmModalClose}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default BlogPage;
