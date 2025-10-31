import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import MainPage from "./pages/MainPage/MainPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* 2. 로그인이 필요 없는 공개 페이지 */}
          <Route index element={<MainPage />} />

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
