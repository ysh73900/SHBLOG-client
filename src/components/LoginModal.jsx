import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { clearLoginError, loginUser } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";

const LoginModal = ({ openModal, handleModalClose, handleSignupOpen }) => {
  const dispatch = useDispatch();
  const { isLoggedIn, loginError, status } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const resultAction = await dispatch(loginUser({ email, password }));

    if (loginUser.fulfilled.match(resultAction)) {
      console.log("로그인 성공: ", resultAction.payload);
    } else {
      console.log("로그인 실패: ", resultAction.payload);
    }
  };

  const handleSignup = () => {
    handleModalClose();
    handleSignupOpen();
  };

  useEffect(() => {
    if (isLoggedIn) {
      handleModalClose();
    }

    if (!openModal) {
      setEmail("");
      setPassword("");
      dispatch(clearLoginError());
    }
  }, [isLoggedIn, navigate, handleModalClose, openModal, dispatch]);

  return (
    openModal && (
      <Modal
        openModal={openModal}
        handleModalClose={handleModalClose}
        className="w-full max-w-md h-[500px] px-8 py-6 mt-4 text-left bg-zinc-800 shadow-2xl rounded-lg border border-zinc-700"
      >
        <div className="flex flex-col h-full">
          <h3 className="text-2xl font-bold text-center text-white">로그인</h3>
          <form
            className="flex flex-col flex-grow justify-center h-full"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="mt-4">
              <div>
                <label className="block text-gray-300" htmlFor="email">
                  이메일
                </label>
                <input
                  type="email"
                  placeholder="이메일을 입력하세요"
                  className="w-full px-4 py-2 mt-2 bg-zinc-900 border border-gray-600 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-500"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-300" htmlFor="password">
                  비밀번호
                </label>
                <input
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  className="w-full px-4 py-2 mt-2 bg-zinc-900 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-500"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-baseline justify-between">
                <button
                  type="submit"
                  className="w-full px-6 py-2 mt-4 text-white bg-emerald-500 rounded-lg hover:hover:bg-emerald-600 transition-colors"
                  disabled={status === "loading"} // 로딩 중에는 버튼 비활성화
                >
                  {status === "loading" ? "로그인 중..." : "로그인"}
                </button>
              </div>
              {loginError && (
                <p className="text-red-500 text-sm mt-2">
                  {loginError.message || loginError}
                </p>
              )}
            </div>
          </form>

          <div className="flex justify-center gap-4 mt-4 text-sm text-gray-500">
            <button
              type="button"
              //  onClick={onClickFindPassword}
              className="hover:underline"
            >
              비밀번호 찾기
            </button>
            <span>|</span>
            <button
              type="button"
              className="hover:underline"
              onClick={handleSignup}
            >
              회원가입
            </button>
          </div>
        </div>
      </Modal>
    )
  );
};

export default LoginModal;
