import ReactDOM from "react-dom";

const modalPortal = ({ children }) => {
  if (typeof window !== "undefined") {
    const modalContainer = document.getElementById("modal");

    if (modalContainer) {
      return ReactDOM.createPortal(children, modalContainer);
    }
  }
  return null;
};

export default modalPortal;
