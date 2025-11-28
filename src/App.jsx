import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import MainPage from "./pages/MainPage/MainPage";
import BlogPage from "./pages/BlogPage/BlogPage";
import PostDetailPage from "./pages/PostDetailPage/PostDetailPage";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { loadAuthStateFromLocalStorage } from "./features/authSlice";
import PostWritePage from "./pages/PostWritePage/PostWritePage";
import AdminRoute from "./routes/AdminRoute";

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
          <Route element={<AdminRoute />}>
            <Route path="/write" element={<PostWritePage />} />
            <Route path="/edit/:slug" element={<PostWritePage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
