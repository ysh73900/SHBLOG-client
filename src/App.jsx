import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import MainPage from "./pages/MainPage/MainPage";
import BlogPage from "./pages/BlogPage/BlogPage";
import PostDetailPage from "./pages/PostDetailPage/PostDetailPage";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { loadAuthStateFromLocalStorage } from "./features/authSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 컴포넌트가 처음 마운트될 때 (앱 시작 또는 새로고침 시)
    // localStorage에 저장된 인증 상태를 Redux 스토어로 불러온다.
    dispatch(loadAuthStateFromLocalStorage());
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* 2. 로그인이 필요 없는 공개 페이지 */}
          <Route index element={<MainPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<PostDetailPage />} />

          {/* 3. 로그인이 반드시 필요한 비공개 페이지 */}
          {/* <Route element={<PrivateRoute />}>
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Route> */}

          {/* 4. 일치하는 경로가 없을 때 보여줄 404 페이지 */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
