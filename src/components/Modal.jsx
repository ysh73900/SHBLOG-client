import { twMerge } from "tailwind-merge";
import ModalPortal from "../utils/modalPortal";

const Modal = ({ children, openModal, handleModalClose, className }) => {
  const open = "block";
  const defaultModalClass = twMerge(
    `w-[500px] h-[250px] fixed top-1/2 left-1/2 bg-white rounded-lg z-50 transform -translate-x-1/2 -translate-y-1/2 ${
      openModal ? open : ""
    }`,
    className
  );

  return (
    <ModalPortal>
      <div
        className="fixed left-0 top-0 z-50 h-full w-full bg-black-overlay"
        onClick={handleModalClose}
      >
        <div
          onClick={(event) => event.stopPropagation()}
          className={defaultModalClass}
        >
          {children}
        </div>
      </div>
    </ModalPortal>
  );
};

export default Modal;
