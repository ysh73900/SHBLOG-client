import globals from "globals";
import js from "@eslint/js";

// 1. 플러그인 객체만 임포트
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
import refreshPlugin from "eslint-plugin-react-refresh";

// 2. 플러그인 설정 파일 경로를 직접 임포트 (Flat Config 표준)
import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import reactJsxRuntime from "eslint-plugin-react/configs/jsx-runtime.js";

export default [
  { ignores: ["dist"] },

  // 1. 기본 JS 규칙과 React/JSX 규칙을 배열로 추가
  js.configs.recommended,
  reactRecommended,
  reactJsxRuntime,

  // 2. 언어 환경, 플러그인 정의 및 사용자 규칙 설정
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: {
      // React 버전 자동 감지 설정
      react: { version: "detect" },
    },
    plugins: {
      // 사용할 모든 플러그인 객체를 명시
      react: reactPlugin,
      "react-hooks": hooksPlugin,
      "react-refresh": refreshPlugin,
    },
    rules: {
      // React Hooks의 핵심 규칙을 수동으로 추가
      "react-hooks/rules-of-hooks": "error", // Hooks 규칙 준수 검사
      "react-hooks/exhaustive-deps": "warn", // 의존성 배열 누락 경고

      // 사용자 정의 규칙
      "react/jsx-no-target-blank": "off",
      "react/prop-types": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
];
