import { useEffect, useState } from "react";

const TwinklingStarsSvg = ({ id, style }) => {
  // SVG가 여러 개 렌더링될 때 <defs>의 ID가 충돌하는 것을 막기 위해
  // 각 별의 고유 ID를 그라데이션 ID에 console.error('포함시킨다',포함시킨다)
  const gradientId0 = `paint0_linear_${id}`;
  const gradientId1 = `paint1_linear_${id}`;

  return (
    <svg
      style={style} // { position, left, top, width, height }
      className="absolute animate-twinkle" // tailwind.config.js의 'animate-twinkle' 실행
      viewBox="0 0 149 149"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="74" cy="74" r="11" fill="white"></circle>
      <rect
        y="141.421"
        width="200"
        height="10"
        transform="rotate(-45 0 141.421)"
        fill={`url(#${gradientId0})`}
      ></rect>
      <rect
        x="7.07107"
        width="200"
        height="10"
        transform="rotate(45 7.07107 0)"
        fill={`url(#${gradientId1})`}
      ></rect>
      <defs>
        <linearGradient
          id={gradientId0}
          x1="0"
          y1="146.421"
          x2="200"
          y2="146.421"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1E1E1E"></stop>
          <stop offset="0.445" stopColor="white"></stop>
          <stop offset="0.58721" stopColor="white"></stop>
          <stop offset="1" stopColor="#1E1E1E"></stop>
        </linearGradient>
        <linearGradient
          id={gradientId1}
          x1="7.07107"
          y1="5"
          x2="207.071"
          y2="5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1E1E1E"></stop>
          <stop offset="0.42" stopColor="white"></stop>
          <stop offset="0.555" stopColor="white"></stop>
          <stop offset="1" stopColor="#1E1E1E"></stop>
        </linearGradient>
      </defs>
    </svg>
  );
};

// 반짝이는 별을 5초마다 생성하고 2,5초마다 제거하는 로직 컴포넌트
const TwinklingStars = () => {
  // 별 목록을 state로 관리
  const [stars, setStars] = useState([]);

  useEffect(() => {
    // 5초마다 새 별을 생성하는 인터벌
    const interval = setInterval(() => {
      const id = Math.random() + Date.now();

      // 랜덤 크기 로직
      // (모바일: 7.5~15px, 데스크톱: 15~30px)
      const widthPx =
        window.innerWidth < 768
          ? Math.floor(Math.random() * (15 - 7.5 + 1) + 7.5)
          : Math.floor(Math.random() * (30 - 14 + 1) + 15);

      const width = `${widthPx}px`;

      const newStar = {
        id: id,
        style: {
          position: "absolute",
          // 가로 위치: 화면 전체 (랜덤)
          left: Math.floor(Math.random() * window.innerWidth) + "px",
          // 세로 위치: 화면 상단 1/3 (랜덤)
          top: Math.floor(Math.random() * (window.innerHeight / 3)) + "px",
          width: width,
          height: width,
        },
      };

      // 별을 state 배열에 추가 (React가 <TwinklingStarSvg>를 렌더링함)
      setStars((prevStars) => [...prevStars, newStar]);

      setTimeout(() => {
        setStars((prevStars) => prevStars.filter((star) => star.id !== id));
      }, 2500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {stars.map((star) => (
        <TwinklingStarsSvg key={star.id} id={star.id} style={star.style} />
      ))}
    </>
  );
};

export default TwinklingStars;
