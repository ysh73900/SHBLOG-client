import { useEffect, useRef } from "react";

const useDropdownClick = (dropdownRef, handleDropdownClose) => {
  const isClickOutsideRef = useRef(false);

  useEffect(() => {
    const handleKeyDownEsc = (event) => {
      if (event.key === "Escape") {
        handleDropdownClose();
      }
    };

    // 마우스를 눌렀을 때 (mouseDown)
    const handleMouseDown = (event) => {
      // modalRef.current가 존재하고,
      // 클릭한 대상(event.target)이 모달(modalRef.current)의 내부에 포함되지 않을 때
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        isClickOutsideRef.current = true;
      } else {
        isClickOutsideRef.current = false;
      }
    };

    // 마우스를 뗐을 때 (mouseUp)
    const handleMouseUp = (event) => {
      if (
        isClickOutsideRef.current &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        handleDropdownClose();
      }

      isClickOutsideRef.current = false;
    };

    document.addEventListener("keydown", handleKeyDownEsc);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDownEsc);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dropdownRef, handleDropdownClose]);
};

export default useDropdownClick;
