import { useDispatch, useSelector } from "react-redux";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import { clearSignupError, signupUser } from "../features/authSlice";

const SignupModal = ({ openModal, handleModalClose }) => {
  const dispatch = useDispatch();
  const { signupError } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // form validation
  const validateForm = () => {
    let isValid = true;
    setUsernameError("");
    setEmailError("");
    setPasswordError("");

    // 사용자명 유효성 검사 (예: 3~20자)
    if (username.length < 3 || username.length > 20) {
      setUsernameError("사용자명은 3자에서 20자 사이어야 합니다.");
      isValid = false;
    } else if (username.length === 0) {
      setUsernameError("사용자명을 입력하세요.");
    }

    // 이메일 유효성 검사 (간단한 정규식 또는 라이브러리 사용)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("유효한 이메일 주소를 입력하세요.");
      isValid = false;
    }

    // 비밀번호 유효성 검사 (6~40자)
    if (password.length < 6 || password.length > 40) {
      setPasswordError("비밀번호는 6자에서 40자 사이여야 합니다.");
      isValid = false;
    } else if (password.length === 0) {
      setPasswordError("비밀번호를 입력하세요.");
    }

    // 비밀번호 확인 유효성 검사
    if (confirmPassword.length === 0) {
      setConfirmPasswordError("비밀번호 확인을 입력하세요.");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 폼 제출 전 클라이언트 측 유효성 검사
    if (!validateForm()) {
      return; // 유효성 검사 실패 시 백엔드 요청을 보내지 않음
    }

    const resultAction = await dispatch(
      signupUser({ username, email, password })
    );

    if (signupUser.fulfilled.match(resultAction)) {
      console.log("회원가입 성공 -> ", resultAction.payload);
      handleModalClose();
    } else {
      console.log("회원가입 실패 -> ", resultAction.payload);
    }
  };

  useEffect(() => {
    if (!openModal) {
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUsernameError("");
      setEmailError("");
      setPasswordError("");
      setConfirmPasswordError("");
      dispatch(clearSignupError());
    }
  }, [openModal, dispatch]);

  return (
    openModal && (
      <Modal
        openModal={openModal}
        handleModalClose={handleModalClose}
        className="w-full max-w-md max-h-[90vh] overflow-y-auto px-8 py-6 mt-4 text-left bg-zinc-800 shadow-2xl rounded-lg border border-zinc-700"
      >
        <div className="flex flex-col h-full">
          <h3 className="text-2xl font-bold text-center text-white">
            회원가입
          </h3>
          <form
            className="flex flex-col flex-grow justify-center h-full"
            onSubmit={handleSubmit}
            noValidate
          >
            <div className="mt-4">
              <div>
                <label className="block text-gray-300" htmlFor="email">
                  사용자명
                </label>
                <input
                  type="text"
                  placeholder="사용자명을 입력하세요"
                  className="w-full px-4 py-2 mt-2 bg-zinc-900 border border-gray-600 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-500"
                  id="username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setUsernameError("");
                  }}
                  required
                />
                {usernameError && (
                  <p className="text-red-500 text-sm mt-1">{usernameError}</p>
                )}
              </div>
              <div className="mt-4">
                <label className="block text-gray-300" htmlFor="email">
                  이메일
                </label>
                <input
                  type="email"
                  placeholder="이메일을 입력하세요"
                  className="w-full px-4 py-2 mt-2 bg-zinc-900 border border-gray-600 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-500"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  required
                />
                {emailError && (
                  <p className="text-red-500 text-sm mt-1">{emailError}</p>
                )}
                {signupError && (
                  <p className="text-red-500 text-sm mt-2">
                    {signupError.message || signupError}
                  </p>
                )}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError("");
                  }}
                  required
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </div>
              <div className="mt-4">
                <label className="block text-gray-300" htmlFor="password">
                  비밀번호 확인
                </label>
                <input
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  className="w-full px-4 py-2 mt-2 bg-zinc-900 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-1 focus:ring-emerald-500 placeholder:text-gray-500"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setConfirmPasswordError(""); // 입력 시 에러 초기화
                  }}
                  required
                />
                {confirmPasswordError && (
                  <p className="text-red-500 text-sm mt-1">
                    {confirmPasswordError}
                  </p>
                )}
              </div>
              <div className="flex items-baseline justify-between">
                <button
                  type="submit"
                  className="w-full px-6 py-2 mt-4 text-white bg-emerald-500 rounded-lg hover:hover:bg-emerald-600 transition-colors"
                >
                  회원가입
                </button>
              </div>
              {signupError && (
                <p className="text-red-500 text-sm mt-2">
                  {signupError.message || signupError}
                </p>
              )}
            </div>
          </form>
        </div>
      </Modal>
    )
  );
};

export default SignupModal;
