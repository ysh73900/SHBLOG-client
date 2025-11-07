export const isTokenExpired = (accessToken) => {
  if (!accessToken) return true;

  try {
    const payloadBase64 = accessToken.split(".")[1];
    const decodePayload = JSON.parse(atob(payloadBase64));

    if (!decodePayload.exp) return true;

    const expirationTimeMs = decodePayload.exp * 1000; // Convert to milliseconds
    const currentTimeMs = Date.now();

    return currentTimeMs >= expirationTimeMs; // 현재 시간이 만료 시간보다 크거나 같으면 만료됨
  } catch (e) {
    console.error("JWT 토큰 파싱 실패 또는 유효하지 않은 토큰 형식: ", e);
    return true;
  }
};
