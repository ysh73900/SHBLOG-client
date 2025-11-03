import { useEffect, useState } from "react";

const showerClasses = ["ur", "dr", "dl", "ul"];

const MeteorShower = () => {
  const [meteors, setMeteors] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Math.random() + Date.now();

      const newMeteor = {
        id: id,
        left: Math.round(Math.random() * window.innerWidth) + "px",
        top: Math.round(Math.random() * window.innerHeight) + "px",
        // 4개 샤워 중 하나를 무작위로 선택 (인덱스)
        showerIndex: Math.floor(Math.random() * showerClasses.length),
      };

      // setMeteors를 사용해 새 유성을 상태 배열에 추가한다.
      // React가 이 상태 변경을 감지하고 UI를 다시 그린다.
      setMeteors((prevMeteors) => [...prevMeteors, newMeteor]);

      // 3.5초 뒤에 상태 배열에서 해당 유성을 제거한다.
      setTimeout(() => {
        setMeteors((prevMeteors) =>
          prevMeteors.filter((meteor) => meteor.id !== id)
        );
      }, 3500);
    }, 1500);

    // 컴포넌트가 사라질 때(unmount) 인터벌을 정리 (메모리 누수 방지)
    return () => clearInterval(interval);
  }, []);

  // 렌더링 최적화를 위해 유성들을 샤워 그룹별로 미리 분류
  // (예: [ [ur 유성들], [dr 유성들], [dl 유성들], [ul 유성들] ])
  const showers = showerClasses.map(() => []);
  meteors.forEach((meteor) => {
    // 해당 유성의 showerIndex에 맞는 배열에 push
    showers[meteor.showerIndex].push(meteor);
  });

  return (
    <div id="meteors">
      {showers.map((showerMeteors, index) => (
        // (예: <div key="ur" className="shower ur">)
        <div
          key={showerClasses[index]}
          className={`shower ${showerClasses[index]}`}
        >
          {/* 해당 샤워 그룹에 속한 유성들만 맵핑하여 렌더링 */}
          {showerMeteors.map((meteor) => (
            <div
              key={meteor.id}
              className="meteor"
              style={{ left: meteor.left, top: meteor.top }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default MeteorShower;
