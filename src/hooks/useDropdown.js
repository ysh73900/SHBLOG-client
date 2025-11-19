import { useState } from "react";

const useDropdown = () => {
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  const handleDropdownOpen = () => {
    setIsOpenDropdown(true);
  };

  const handleDropdownClose = () => {
    setIsOpenDropdown(false);
  };

  return {
    isOpenDropdown,
    setIsOpenDropdown,
    handleDropdownOpen,
    handleDropdownClose,
  };
};

export default useDropdown;
