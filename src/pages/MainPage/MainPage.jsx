import { useEffect } from "react";
import { initBG } from "../../utils/bg";
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
    </main>
  );
};

export default MainPage;
