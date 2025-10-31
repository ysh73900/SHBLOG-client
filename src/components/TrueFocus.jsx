import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "../utils/utils";

const TrueFocus = ({
  className,
  sentence = "True Focus", // 표시할 문장
  manualMode = false, // 마우스 호버로 수동 조작할지 여부 (기본값: false, 자동)
  blurAmount = 5, // 포커스되지 않은 단어의 흐림(blur) 정도
  borderColor = "green", // 포커스 박스 테두리 색상
  glowColor = "rgba(0, 255, 0, 0.6)", // 포커스 박스 및 glow 색상
  animationDuration = 0.5, // 애니메이션 지속 시간 (초)
  pauseBetweenAnimations = 1, // 자동 모드일 때 단어 사이의 멈춤 시간 (초)
}) => {
  // 입력받은 문장을 공백 기준으로 쪼개서 배열로 만든다.
  const words = sentence.split(" ");
  // 현재 포커스된 단어의 인덱스(순번)을 저장하는 상태 (기본값: 0. 첫 번째 단어)
  const [currentIndex, setCurrentIndex] = useState(0);
  // 수동 모드에서, 마우스가 요소를 떠났을 때 마지막으로 활성화 했던 인덱스를 기억하기 위한 상태
  const [lastActiveIndex, setLastActiveIndex] = useState(null);
  // 단어들을 감싸는 부모 <div> 요소에 접근하기 위한 ref
  const containerRef = useRef(null);
  // 각 단어(<span>) 요소들에 접근하기 위한 ref (배열 형태로 저장)
  const wordRefs = useRef([]);
  // 에니메이션될 포커스 박스의 위치(x, y)와 크기(width, height)을 저장하는 상태
  const [focusRect, setFocusRect] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // 자동 모드 로직
  useEffect(() => {
    if (!manualMode) {
      // 일정 시간마다 코드를 반복 실행하는 타이머(interval)를 설정
      /* (prev + 1) % words.length
       * - 현재 인덱스(prev)에 1을 더한다.
       * - %를 사용해, 배열의 끝에 도달하면 (예: 2 % 2 = 0) 다시 0으로 돌아가게 만든다. (순환)
       */
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % words.length);
      }, (animationDuration + pauseBetweenAnimations) * 1000); // (에니메이션 시간 + 멈춤 시간)을 간격으로 설정

      // 컴포넌트가 사라지거나, 이 useEffect가 다시 실행되기 전에
      // 기존에 설정된 interval을 정리(제거)한다. (메모리 누수 방지)
      return () => clearInterval(interval);
    }
  }, [manualMode, animationDuration, pauseBetweenAnimations, words.length]);

  // 포커스 박스 위치 계산 로직
  useEffect(() => {
    // 현재 인덱스가 null이거나 -1이면 (유효하지 않으면) 함수 종료
    if (currentIndex === null || currentIndex === -1) {
      return;
    }

    // 현재 인덱스에 해당하는 단어(span)의 ref나 부모 컨테이너의 ref가 아직 준비되지 않았으면 함수 종료
    if (!(wordRefs.current[currentIndex] && containerRef.current)) {
      return;
    }

    // 부모 컨테이너(div)의 화면 상 위치와 크기 정보를 가져옴
    const parentRect = containerRef.current.getBoundingClientRect();
    // 현재 포커스된 단어(span)의 화면 상 위치와 크기 정보를 가져옴
    const activeRect = wordRefs.current[currentIndex].getBoundingClientRect();

    // 포커스 박스의 상태(focusRect)를 업데이트
    setFocusRect({
      // 부모 컨테이너 *안에서의* 상대적인 X 위치
      x: activeRect.left - parentRect.left,
      // 부모 컨테이너 *안에서의* 상대적인 Y 위치
      y: activeRect.top - parentRect.top,
      width: activeRect.width, // 단어의 너비
      height: activeRect.height, // 단어의 높이
    });
  }, [currentIndex, words.length]);

  // --- 수동 모드 이벤트 핸들러 ---

  // 마우스가 단어 위에 올라왔을 때
  const handleMouseEnter = (index) => {
    if (manualMode) {
      // 수동 모드일 때만 실행
      setLastActiveIndex(index); // '마지막 활성 인덱스'를 현재 마우스가 올라간 인덱스로 기록
      setCurrentIndex(index); // '현재 포커스'를 이 단어로 즉시 변경
    }
  };

  // 마우스가 단어에서 벗어났을 때
  const handleMouseLeave = () => {
    if (manualMode) {
      // 수동 모드일 때만 실행
      // 현재 포커스를 '마지막으로 활성화했던' 인덱스로 설정
      // (결과적으로, 마우스가 떠나도 마지막으로 호버했던 단어가 활성 상태로 유지됨)
      setCurrentIndex(lastActiveIndex);
    }
  };
  return (
    <div
      className="relative flex flex-wrap items-center justify-center gap-4"
      ref={containerRef}
    >
      {words.map((word, index) => {
        const isActive = index === currentIndex;
        return (
          <span
            className={cn(
              "relative cursor-pointer font-black text-[3rem]",
              className
            )}
            key={index}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            ref={(el) => {
              wordRefs.current[index] = el;
            }}
            style={{
              filter: manualMode
                ? isActive
                  ? "blur(0px)"
                  : `blur(${blurAmount}px)`
                : isActive
                ? "blur(0px)"
                : `blur(${blurAmount}px)`,
              transition: `filter ${animationDuration}s ease`,
            }}
          >
            {word}
          </span>
        );
      })}

      <motion.div
        // `focusRect` 상태가 변하면 'animate'에 지정된 값으로 애니메이션 실행
        animate={{
          x: focusRect.x,
          y: focusRect.y,
          width: focusRect.width,
          height: focusRect.height,
          opacity: currentIndex >= 0 ? 1 : 0,
        }}
        className="pointer-events-none absolute top-0 left-0 box-border border-0"
        style={{
          // CSS 변수(Custom Properties)를 설정
          // 이 변수들은 하위의 <span>(모서리) 태그에서 사용됨
          "--border-color": borderColor,
          "--glow-color": glowColor,
        }}
        transition={{
          duration: animationDuration,
        }}
      >
        {/* 포커스 박스의 네 모서리 (꺾쇠 모양) */}
        <span
          className="absolute top-[-10px] left-[-10px] h-4 w-4 rounded-[3px] border-[3px] border-r-0 border-b-0"
          style={{
            borderColor: "var(--border-color)",
            filter: "drop-shadow(0 0 4px var(--border-color))",
          }}
        />
        <span
          className="absolute top-[-10px] right-[-10px] h-4 w-4 rounded-[3px] border-[3px] border-b-0 border-l-0"
          style={{
            borderColor: "var(--border-color)",
            filter: "drop-shadow(0 0 4px var(--border-color))",
          }}
        />
        <span
          className="absolute bottom-[-10px] left-[-10px] h-4 w-4 rounded-[3px] border-[3px] border-t-0 border-r-0"
          style={{
            borderColor: "var(--border-color)",
            filter: "drop-shadow(0 0 4px var(--border-color))",
          }}
        />
        <span
          className="absolute bottom-[-10px] right-[-10px] h-4 w-4 rounded-[3px] border-[3px] border-t-0 border-l-0"
          style={{
            borderColor: "var(--border-color)",
            filter: "drop-shadow(0 0 4px var(--border-color))",
          }}
        />
      </motion.div>
    </div>
  );
};

export default TrueFocus;
