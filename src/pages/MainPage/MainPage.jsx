import TrueFocus from "../../components/TrueFocus";
import { Link } from "react-router-dom";
import ArrowCard from "../../components/ArrowCard";
import FallingSnow from "../../components/FallingSnow";

const dummyPosts = [
  {
    slug: "test-post-4", // key와 href에 사용될 고유 값
    data: {
      title: "테스트 포스트 4: Tailwind CSS",
      description:
        "네 번째 포스트입니다. 날짜가 가장 최신이므로 맨 위에 보여야 합니다.",
      date: "2025-11-05", // 👈 YYYY-MM-DD (표준 형식)
      draft: false,
      tags: ["Tailwind", "CSS", "Test"], // 👈 tags 배열
    },
  },
  {
    slug: "test-post-1",
    data: {
      title: "테스트 포스트 1: React",
      description: "첫 번째 포스트입니다. React와 Test 태그를 가집니다.",
      date: "2025-11-02", // 👈 YYYY-MM-DD
      draft: false,
      tags: ["React", "Test"],
    },
  },
  {
    slug: "test-post-3-draft",
    data: {
      title: "테스트 포스트 3 (초안)",
      description:
        "이 포스트는 draft: true이므로 필터링되어 목록에 보이지 않습니다.",
      date: "2025-11-10", // (날짜가 가장 최신이지만 draft임)
      draft: true, // 👈 true라서 필터링됨
      tags: ["Draft", "Hidden"],
    },
  },
  {
    slug: "test-post-2",
    data: {
      title: "테스트 포스트 2: JavaScript",
      description: "두 번째 포스트입니다. 날짜가 가장 오래되었습니다.",
      date: "2025-11-01", // 👈 YYYY-MM-DD
      draft: false,
      tags: ["JavaScript", "Core"],
    },
  },
  {
    slug: "test-post-5",
    data: {
      title: "테스트 포스트 5: SpringBoot",
      description:
        "다섯 번째 포스트입니다. 최신 3개(slice(0, 3))에 포함되지 않아 잘려야 합니다.",
      date: "2025-10-30", // 👈 YYYY-MM-DD (가장 오래된 날짜)
      draft: false,
      tags: ["SpringBoot", "Sample"],
    },
  },
];

const MainPage = () => {
  const posts = dummyPosts
    .filter((post) => !post.data.draft) // 초안(draft: true) 거르기
    .sort(
      (a, b) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
    ) // 최신 날짜순 정렬
    .slice(0, 3); // 3개만 자르기

  return (
    <main>
      {/* 라이트 모드용 파티클 배경 */}
      {/* <div className="absolute inset-0 block dark:hidden">
        <div id="particles1" className="fixed inset-0"></div>
        <div id="particles2" className="fixed inset-0"></div>
        <div id="particles3" className="fixed inset-0"></div>
      </div> */}
      {/* 다크 모드용 별 배경 dark:hidden"*/}
      {/* <div className="absolute inset-0 hidden dark:block">
        <div id="stars1" className="fixed inset-0"></div>
        <div id="stars2" className="fixed inset-0"></div>
        <div id="stars3" className="fixed inset-0"></div>
      </div> */}
      <div id="snow" className="fixed inset-0">
        <FallingSnow />
      </div>

      <section className="relative h-screen w-full overflow-hidden z-20">
        <div className="animate-swoop-up absolute w-full h-full flex item-center justify-center z-20">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="p-5 text-center flex flex-col gap-4 items-center justify-center">
              <TrueFocus
                className="text-2xl md:text-3xl lg:text-4xl font-semibold bg-gradient-to-r from-gray-400 dark:from-gray-500 via-white-00 to-gray-600
                dark:to-gray-100 inline-block text-transparent bg-clip-text transform-gpu"
                sentence="Frontend Engineer"
                manualMode={false}
                blurAmount={5}
                borderColor="#9ca3af"
                animationDuration={2}
              />
              <span
                id="neon"
                data-neon="blue"
                className="text-2xl md:text-3xl lg:text-4xl font-bold"
              >
                LEE SEUNG HOON
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="relative bg-transparent">
        <div className="mx-auto max-w-screen-sm p-5 space-y-24 pb-16">
          <section className="animate-swoop-up">
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="font-semibold text-black dark:text-white">
                  최근 포스트
                </p>
                <Link
                  to="/blog"
                  className="w-fit col-span-3 group flex gap-1 items-center underline decoration-[.5px] decoration-black/25 
                  dark:decoration-white/50 hover:decoration-black dark:hover:decoration-white text-black dark:text-white
                  underline-offset-2 blend"
                >
                  <span className="text-black/75 dark:text-white/75 group-hover:text-black group-hover:dark:text-white blend text-sm">
                    전체보기
                  </span>
                </Link>
              </div>
              <ul className="space-y-4 z-20">
                {posts.map((post, index) => (
                  <li key={post.slug}>
                    <ArrowCard entry={post} borderNeon delay={index * 0.5} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default MainPage;
