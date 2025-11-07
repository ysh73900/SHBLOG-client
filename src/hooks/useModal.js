import { useRef, useState } from "react";
import useHandleModalClick from "./useHandleModalClick";

const useModal = () => {
  const modalRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState("");

  const handleModalOpen = () => {
    setOpenModal(true);
    document.body.style.overflow = "hidden";
  };

  const handleModalClose = () => {
    setOpenModal(false);
    document.body.style.overflow = "";
  };

  useHandleModalClick(modalRef, handleModalClose);

  return { openModal, modalRef, handleModalOpen, handleModalClose, message };
};

export default useModal;
