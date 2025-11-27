export const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  // 유효하지 않은 날짜 데이터일 경우 원본 반환
  if (isNaN(date.getTime())) return dateString;

  // NOV 19, 2025 형식으로 변환
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formatted = date.toLocaleDateString("en-US", options);

  // 대문자 변환, 쉼표 제거
  return formatted.toUpperCase().replace(",", "");
};
