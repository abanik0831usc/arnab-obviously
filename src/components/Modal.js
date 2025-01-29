"use client"

import { useRouter } from "next/navigation";
import { IoMdClose } from "react-icons/io";
import { useEffect } from "react";

export default function Modal({ children }) {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle overlay click
  const handleOverlayClick = (event) => {
    if (event.target === event.currentTarget) {
      handleClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button 
          onClick={handleClose}
          className="close-button"
          aria-label="Close modal"
        >
          <IoMdClose className="w-6 h-6" />
        </button>
        {children}
      </div>
    </div>
  );
}