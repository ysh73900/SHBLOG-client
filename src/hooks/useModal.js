import { useState } from "react";

const useModal = () => {
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

  return { openModal, handleModalOpen, handleModalClose, message };
};

export default useModal;
