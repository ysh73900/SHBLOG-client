import { clsx } from "clsx";
import { differenceInMonths, differenceInYears, isValid } from "date-fns";
import { twMerge } from "tailwind-merge";

/**
 * `clsx`와 `tailwind-merge`를 사용하여 Tailwind 클래스 이름 문자열을 생성
 * 1. `clsx`를 사용해 조건부 클래스를 포함한 모든 입력을 하나의 문자열로 결합
 * 2. `tailwind-merge`를 사용해 충돌하는 Tailwind 클래스를 병합하여 정리
 * * @param {...any} inputs - `clsx`가 허용하는 모든 인수 (문자열, 객체, 배열 등)
 * @returns {string} 병합되고 정리된 최종 클래스 문자열
 */
export const cn = (...inputs) => {
  return twMerge(clsx(inputs));
};
