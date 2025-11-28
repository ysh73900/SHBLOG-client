import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";
import {
  createPost,
  getPostBySlug,
  updatePost,
} from "../../features/postSlice";

const PostWritePage = () => {
  const { slug } = useParams();
  const isEditMode = !!slug;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isDraft, setIsDraft] = useState(false);
  const [postId, setPostId] = useState(null);

  const [status, setStatus] = useState("idle");

  const { currentPost } = useSelector((state) => state.posts);

  // 수정 모드일 경우: 데이터 불러오기 및 폼 채우기
  useEffect(() => {
    if (isEditMode) {
      // Redux에 데이터가 없거나, 다른 글 데이터라면 서버에서 다시 가져옴
      if (!currentPost || currentPost.slug != slug) {
        dispatch(getPostBySlug(slug));
      } else {
        // 데이터가 있으면 폼(State)에 채우기
        setPostId(currentPost.id);
        setTitle(currentPost.title);
        setDescription(currentPost.description);
        setContent(currentPost.content);
        setIsDraft(currentPost.draft);
        setTags(currentPost.tags ? currentPost.tags.join(", ") : "");
      }
    }
  }, [dispatch, isEditMode, slug, currentPost]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status !== "idle") return; // 중복 제출 방지
    console.log("postId", postId);

    // tags 문자열을 배열로 변환 (공백 제거, 빈 값 필터링)
    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const postData = {
      title,
      description,
      content,
      draft: isDraft,
      tags: tagsArray,
    };

    console.log("postData -> ", postData);

    try {
      setStatus("loading");

      if (isEditMode) {
        await dispatch(updatePost({ postId: postId, postData })).unwrap();
        navigate(`/blog/${slug}`);
      } else {
        await dispatch(createPost(postData));
        navigate(`/blog`);
      }
      setStatus("succeeded");
    } catch (err) {
      console.error("Failed to save the post: ", err);
      setStatus("idle");
    }
  };

  return (
    <>
      <div className="pt-36" />
      <div className="pb-5 border-t dark:border-white/20 flex animate-swoop-up">
        <div className="w-full border-black/15 dark:border-white/20 px-5 ">
          <div className="w-full h-full mx-auto max-w-screen-lg pt-5">
            <div className="flex justify-between">
              <div className="page-heading show mb-5">새 게시글 작성</div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-gray-300">
                  제목
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 mt-2 bg-zinc-900 border border-gray-600 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-500"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="mt-4">
                <label htmlFor="description" className="block text-gray-300">
                  요약
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 mt-2 bg-zinc-900 border border-gray-600 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-500"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="mt-4">
                <label htmlFor="content" className="block text-gray-300">
                  본문
                </label>
                <textarea
                  name="content"
                  className="w-full px-4 py-2 mt-2 bg-zinc-900 border border-gray-600 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-500"
                  id="content"
                  rows={20}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
                <div className="prose dark:prose-invert border border-gray-300 dark:border-gray-700 rounded-md p-4 min-h-[400px]">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                  >
                    {content}
                  </ReactMarkdown>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="tags" className="block text-gray-300">
                  태그
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 mt-2 bg-zinc-900 border border-gray-600 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-500"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-end justify-end">
                <div className="flex items-center h-full">
                  <input
                    id="draft"
                    type="checkbox"
                    checked={isDraft}
                    onChange={(e) => setIsDraft(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="draft"
                    className="ml-2 block text-sm dark:text-gray-300"
                  >
                    초안으로 저장 (Draft)
                  </label>
                </div>
              </div>

              <div className="flex items-end justify-end">
                <button
                  type="submit"
                  className="px-6 py-2 text-white bg-emerald-500 rounded-lg hover:hover:bg-emerald-600 transition-colors"
                >
                  {isEditMode ? "글 수정하기" : "글 발행하기"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default PostWritePage;
