const SnowFlake = ({ style }) => {
  return (
    <p className="snow-flake" style={style}>
      {"\u2745"}
    </p>
  );
};

// 눈꽃송이가 위에서 아래로 바로 떨어지지 않고, 어떤 눈꽃송이는 바로 떨어지고, 어떤 눈송이는 n초 뒤에 떨어지기 시작하게 하는 함수
const makeSnowFlakes = () => {
  let animationDelay = "0s"; // 기본 값 0초
  let fontSize = "14px"; // 기본 값 14px
  const arr = Array.from("Merry Christmas"); // length가 15인 array가 생긴다.

  // arr의 length 만큼의 <SnowFlake />를 반환
  return arr.map((el, i) => {
    animationDelay = `${(Math.random() * 16).toFixed(2)}s`; // 0 ~ 16 사이에서 소수점 2번째 자리수까지의 랜덤 숫자
    fontSize = `${Math.floor(Math.random() * 10) + 10}px`; // // 10 ~ 20 사이의 정수
    let animationDuration = `${(Math.random() * 5 + 3).toFixed(2)}s`;
    const left = `${Math.random() * 100}%`;
    const style = {
      fontSize,
      animation: `fall ${animationDuration} linear ${animationDelay} infinite`,
      left,
    };

    return <SnowFlake key={i} style={style} />;
  });
};

const FallingSnow = () => {
  return <div className="snow-container">{makeSnowFlakes()}</div>;
};

export default FallingSnow;
