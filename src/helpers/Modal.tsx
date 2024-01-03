import { useEffect, ReactNode, MouseEvent as ReactMouseEvent } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const modalRoot = document.querySelector('#modal__root');

export const Modal: React.FC<ModalProps> = ({
  isModalOpen,
  onClose,
  children,
}) => {
  const handleBackdropClick = (evt: ReactMouseEvent<HTMLDivElement>) => {
    if (evt.currentTarget === evt.target) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeydown = (evt: KeyboardEvent) => {
      if (evt.code === 'Escape') {
        onClose();
      }
    };

    if (isModalOpen) {
      window.addEventListener('keydown', handleKeydown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [isModalOpen, onClose]);

  return createPortal(
    <div
      className="fixed top-0 left-0 w-full h-full bg-slate-900 
      bg-opacity-80 flex justify-center items-center z-30"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-opacity-70 rounded max-w-[90%] md:max-w-[720px]
       p-2 overflow-auto"
      >
        {children}
      </div>
    </div>,
    modalRoot as Element
  );
};
