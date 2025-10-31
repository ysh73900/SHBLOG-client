import { useEffect } from "react";
import { initBG } from "../../utils/bg";
import TrueFocus from "../../components/TrueFocus";
const MainPage = () => {
  useEffect(() => {
    initBG();
  }, []);
  return (
    <main>
      {/* 라이트 모드용 파티클 배경 */}
      <div className="absolute inset-0 block dark:hidden">
        <div id="particles1" className="fixed inset-0"></div>
        <div id="particles2" className="fixed inset-0"></div>
        <div id="particles3" className="fixed inset-0"></div>
      </div>
      {/* 다크 모드용 별 배경 dark:hidden"*/}
      <div className="absolute inset-0 hidden dark:block">
        <div id="stars1" className="fixed inset-0"></div>
        <div id="stars2" className="fixed inset-0"></div>
        <div id="stars3" className="fixed inset-0"></div>
      </div>
      <div id="galaxy" className="fixed inset-0">
        <div className="hidden dark:block">
          {/* <TwinklingStars /> */} {/* 3단계에서 추가 */}
          {/* <MeteorShower /> */} {/* 3단계에서 추가 */}
        </div>
      </div>

      <section className="relative h-screen w-full overflow-hidden">
        {/* <div
          id="planetcont"
          className="animate absolute inset-0 top-1/4 overflow-hidden"
        >
          <div
            id="crescent"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[250vw] min-h-[100vh] aspect-square rounded-full p-[1px] bg-gradient-to-b from-black/25 dark:from-white/75 from-0% to-transparent to-5%"
          >
            <div
              id="planet"
              className="w-full h-full bg-gradient-to-b from-white dark:from-black from-[30%] to-transparent rounded-full p-[1px] overflow-hidden flex justify-center"
            >
              <div
                id="blur"
                className="w-full h-20 rounded-full bg-neutral-900/25 dark:bg-white/25 blur-3xl"
              ></div>
            </div>
          </div>
        </div> */}

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
                className="animated text-2xl md:text-3xl lg:text-4xl font-bold uppercase bg-gradient-to-r from-blue-600 
                dark:from-blue-500 via-gray-400 to-gray-600 dark:to-white inline-block text-transparent bg-clip-text transform-gpu"
              >
                이승훈입니다.
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MainPage;
