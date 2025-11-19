const Dropdown = ({ children, isOpenDropdown }) => {
  if (!isOpenDropdown) return null;

  return (
    <>
      {isOpenDropdown && (
        <div
          onClick={(event) => event.stopPropagation()}
          className="absolute w-20 rounded-md shadow-lg bg-zinc-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10 overflow-hidden"
        >
          {children}
        </div>
      )}
    </>
  );
};

export default Dropdown;
