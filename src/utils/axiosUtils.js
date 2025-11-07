import axios from "axios";

// 1. axios의 기본 설정을 가진 '인스턴스'를 생성
// 앞으로 모든 API 요청은 이 인스턴스를 통해 이루어진다.
const instance = axios.create({
  // 1-1. baseURL: 모든 요청의 기본이 되는 URL
  baseURL: "http://43.203.72.52:8081",
  // 1-2. headers: 모든 요청에 공통으로 들어가는 헤더 설정
  header: {
    Accept: "application/json",
  },
  // 1-3. withCredentials: 쿠키를 포함한 요청을 할지 여부 설정

  withCredentials: true,
});

// 2. 토큰 재발급 요청 중인지 여부를 추적하는 플래그
// 여러 API가 동시에 401 에러를 받았을 때, 갱신 요청을 한 번만 보내기 위함
let isRefreshing = false;

// 3. 토큰 갱신 중에 실패한(대기 중인) API 요청들을 저장하는 큐(배열)
// 토큰 갱신이 성공하면, 이 큐의 요청들을 새 토큰으로 재시도한다.
let failedQueue = [];

/**
 * 4. 큐에 쌓인 요청들을 처리하는 헬퍼 함수
 * @param {Error | null} error - 갱신 실패 시 애러 객체, 성공 시 null
 * @param {String | null} token - 갱신 성공 시 새로운 엑세스 토큰
 */
const processQueue = (error, token = null) => {
  // 큐에 쌓여있던 모든 요청(Promise)을 순회
  failedQueue.forEach((param) => {
    if (error) {
      // 4-1. 갱신 실패 시, 큐에 대기 줃이던 모든 요청을 에러로 거부(reject)
      param.reject(error);
    } else {
      // 4-2. 갱신 성공 시, 큐에 대기 중이던 모든 요청을 새 토큰과 함께 성공(resolve)
      param.resolve(token);
    }
  });
  // 4-3. 큐를 console.error('비운다',비운다)
  failedQueue = [];
};

// 5. 요청 인터셉터(Request Interceptor): 모든 요청에 accessToken 추가
// 'instance'를 통해 API 요청이 서버로 전송되기 직전에 가로채서 실행
instance.interceptors.request.use(
  /**
   * 6. 요청 성공 시 실행되는 함수
   * @param {object} config - Axios 요청 설정 객체 (URL, 헤더, 데이터 등)
   * @returns {object} - 수정된 설정 객체
   */
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      // 현재 요청(config)의 헤더(headers)에 'Authorization' 항목을 'Bearer [토큰]' 형식으로 추가
      config.headers["Authorization"] = "Bearer " + accessToken;
    }
    // 수정된 설정(config) 객체를 반환하여, 실제 요청이 이 설정으로 보내지도록 한다.
    return config;
  },
  /**
   * 7. 요청 설정 과정에서 에러가 발생했을 때 실행되는 함수
   * @param {object} error - 에러 객체
   */
  (error) => {
    console.log("interceptors request error -> ", error);
    return Promise.reject(error);
  }
);

/**
 * 8. setupInterceptors 함수
 * Redux 스토어(store)를 인자로 받아, 순환 참조 문제 없이 응답 인터셉터를 설정하기 위해 export 된다.
 * 이 함수는 React 앱의 진입점(예: src/store/index.js)에서 store 생성 "후"에 호출되어야 한다.
 * @param {object} store - Redux 스토어 인스턴스
 */
export const setupInterceptors = (store) => {
  // 9. 응답 인터셉터 (Response Interceptor)
  // API로부터 응답을 받은 직후, .then()이나 .catch()로 가기 전에 가로채서 실행된다.
  instance.interceptors.response.use(
    /**
     * 10. 응답이 성공적(HTTP 2xx)일 때 실행되는 함수
     * @param {object} response - Axios 응답 객체
     */
    (response) => {
      return response;
    },
    /**
     * 11. 응답이 에러(HTTP 4xx, 5xx)일 때 실행되는 함수 (async/await) 사용
     * @param {object} error - Axios 에러 객체
     * @returns
     */
    async (error) => {
      const originalRequest = error.config;

      const isLoginOrSignupRequest =
        originalRequest.url.includes("/api/auth/login") ||
        originalRequest.url.includes("/api/auth/signup");

      // - error.response가 존재하고 (네트워크 에러가 아님)
      // - error.response.status가 401 (Unauthorized)이며
      // - originalRequest._retry 플래그가 설정되지 않았는지 (토큰 갱신 실패 시 무한 재시도 방지)
      // - originalRequest.url이 갱신 요청 자체가 아닌지 (갱신 요청이 401이면 무한 루프 방지)
      if (
        error.response &&
        error.response.status == 401 &&
        !originalRequest._retry &&
        !originalRequest.url.includes("/api/auth/refresh") &&
        !isLoginOrSignupRequest
      ) {
        console.log(
          "401 Unauthorized. Access Token 만료 감지. 토큰 갱신 시도..."
        );
        originalRequest._retry = true; // 재시도 플래그 설정

        // 현재 재발급 요청 중이라면 큐에 추가하고 대기
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers["Authorization"] = "Bearer " + token;
              return instance(originalRequest); // 새 토큰으로 원래 요청 재시도
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        // 재발급 요청 시작
        isRefreshing = true;

        try {
          // 백엔드의 토큰 재발급 API 호출 (리프레시 토큰은 Http Only 쿠키에 있으므로 별도 전송 필요 없음)
          const refreshResult = await axios.post(
            `${instance.defaults.baseURL}/api/auth/refresh`,
            {},
            { withCredentials: true }
          );

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            refreshResult.data;

          // 새 엑세스 토큰을 로컬 스토리지에 저장
          localStorage.setItem("accessToken", newAccessToken);
          localStorage.setItem(
            "refreshToken",
            newRefreshToken || localStorage.getItem("refreshToken")
          ); // 새 RefreshToken이 없으면 기존 것 유지

          // Redux 스토어 업데이트 (옵션: 필요에 따라 authSLice에 action 추가)
          store.dispatch({
            type: "auth/setTokens",
            payload: {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            },
          });

          // 큐에 있던 요청들을 새 토큰으로 처리
          processQueue(null, newAccessToken);

          // 원래 요청에 새 토큰을 적용하고 재시도
          originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;
          return instance(originalRequest); // 원래 요청 재시도
        } catch (refreshError) {
          console.error("엑세스 토큰 재발급 실패: ", refreshError);
          store.dispatch({ type: "auth/clearAuthData" });
          processQueue(refreshError, null); // 큐에 있던 요청들도 실패 처리
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false; // 재발급 완료
        }
      }

      // refreshToken 갱신 시도 후 401이면 강제 로그아웃
      else if (
        error.response &&
        error.response.status === 401 &&
        originalRequest._retry
      ) {
        console.log(
          "인증 실패 (401). 재발급 실패 또는 로그인/회원가입 자격 증명 오류. 강제 로그아웃."
        );
        store.dispatch({ type: "auth/clearAuthData" });
      }

      // 5. 처리된 에러를 반환하여, loginUser.rejected 등이 이어서 처리할 수 있도록 함
      return Promise.reject(error);
    }
  );
};

export default instance;
