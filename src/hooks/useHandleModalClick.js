import { useEffect } from "react";

const useHandleModalClick = (modalRef, handleModalClose) => {
  useEffect(() => {
    // ESC keydown => Modal Close
    const handleKeyDownEsc = (event) => {
      if (event.key === "Escape") {
        handleModalClose();
      }
    };

    document.addEventListener("keydown", handleKeyDownEsc);

    return () => {
      document.removeEventListener("keydown", handleKeyDownEsc);
    };
  }, [modalRef, handleModalClose]);
};

export default useHandleModalClick;
