import { useState, useRef, useEffect } from "react";
import "./Animations.css";
import { useHistoryBlocker } from "./useHistoryBlocker";

const FloattingBubble = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const bubbleRef = useRef(null);
  const modalRef = useRef(null);
  const startPosition = useRef({ x: 0, y: 0 });
  const startOffset = useRef({ x: 0, y: 0 });

  useHistoryBlocker(isModalOpen, () => setIsModalOpen(false));

  const handleMouseDown = (event) => {
    setIsDragging(true);
    startPosition.current = { x: event.clientX, y: event.clientY };
    startOffset.current = {
      x: bubbleRef.current.offsetLeft,
      y: bubbleRef.current.offsetTop,
    };
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event) => {
    const newX = startOffset.current.x + event.clientX - startPosition.current.x;
    const newY = startOffset.current.y + event.clientY - startPosition.current.y;
    const maxX = window.innerWidth - bubbleRef.current.offsetWidth;
    const maxY = window.innerHeight - bubbleRef.current.offsetHeight;
    const boundedX = Math.min(Math.max(0, newX), maxX);
    const boundedY = Math.min(Math.max(0, newY), maxY);
    bubbleRef.current.style.transition = "none";
    bubbleRef.current.style.left = `${boundedX}px`;
    bubbleRef.current.style.top = `${boundedY}px`;
  };

  const handleMouseUp = (event) => {
    setIsDragging(false);
    const deltaX = event.clientX - startPosition.current.x;
    const deltaY = event.clientY - startPosition.current.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    bubbleRef.current.style.animation = "none";
    if (distance < 3) {
      setIsModalOpen(!isModalOpen);
    } else {
      autoMoveToEdgeWithAnimation();
    }
  };

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    setIsDragging(true);
    startPosition.current = { x: touch.clientX, y: touch.clientY };
    startOffset.current = {
      x: bubbleRef.current.offsetLeft,
      y: bubbleRef.current.offsetTop,
    };
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  const handleTouchMove = (event) => {
    const touch = event.touches[0];
    const newX = startOffset.current.x + touch.clientX - startPosition.current.x;
    const newY = startOffset.current.y + touch.clientY - startPosition.current.y;
    const maxX = window.innerWidth - bubbleRef.current.offsetWidth - 5;
    const maxY = window.innerHeight - bubbleRef.current.offsetHeight - 5;
    const boundedX = Math.min(Math.max(0, newX), maxX);
    const boundedY = Math.min(Math.max(0, newY), maxY);
    bubbleRef.current.style.transition = "none";
    bubbleRef.current.style.left = `${boundedX}px`;
    bubbleRef.current.style.top = `${boundedY}px`;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    autoMoveToEdgeWithAnimation();
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handleTouchEnd);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleRedirect = () => {
    window.location.href = "https://www.biblia.com";
  };

  const autoMoveToEdgeWithAnimation = () => {
    const bubble = bubbleRef.current;
    if (!bubble) return;
    const bubbleRect = bubble.getBoundingClientRect();
    const screenWidth = window.innerWidth;
    let newX = bubbleRect.left <= screenWidth / 2 ? 0 : screenWidth - bubbleRect.width;
    bubble.style.transition = "left 0.3s";
    bubble.style.left = `${newX}px`;
  };

  const handleClickOutsideModal = (event) => {
    if (!isDragging && modalRef.current && !modalRef.current.contains(event.target)) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideModal);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideModal);
    };
  }, [isDragging]);

  return (
    <div>
      <div
        ref={bubbleRef}
        style={{
          position: "fixed",
          top: "22%",
          right: -5,
          width: 60,
          height: 60,
          backgroundColor: "transparent",
          borderRadius: "50%",
          cursor: "pointer",
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          userSelect: "none",
          touchAction: "none",
          animation: "float 1s 2 linear",
        }}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="bg-transparent absolute size-[60px] rounded-full" />
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-chat" viewBox="0 0 16 16">
          <path d="M2 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm0 1h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />
        </svg>
      </div>

      {isModalOpen && (
        <div ref={modalRef} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h2 className="text-lg font-semibold">¿Quieres ir a la Biblia?</h2>
            <div className="mt-4 flex justify-end">
              <button onClick={handleRedirect} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                Sí
              </button>
              <button onClick={handleModalClose} className="bg-gray-300 text-black px-4 py-2 rounded">
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloattingBubble;
