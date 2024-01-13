import { Modal } from 'helpers/Modal';
import { useState } from 'react';

export interface ImageGalleryItemProps {
  id:number;
  webformatURL: string;
  largeImageURL: string;
}

export const ImageGalleryItem: React.FC<ImageGalleryItemProps> = ({
  webformatURL,
  largeImageURL,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);

  //toggle modal function with scroll blocking effect
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    scrollBlock();
  };

  //Imitation of zoom in open modal (Imitation beacuse scale method cutting image)
  const toggleZoom = (evt: React.MouseEvent<HTMLImageElement>): void => {
    setIsZoomed(!isZoomed);
    const target = evt.currentTarget;
    target.style.transition = 'all 300ms linear';
    if (isZoomed) {
      target.style.transform = 'scale(1)';
      target.style.cursor = 'zoom-in';
    } else {
      target.style.transform = 'scale(1.4)';
      target.style.cursor = 'zoom-out';
    }
  };

  //block scroll function if modal is open
  //Це не правильно. Як зробити що б скролл був на 100% ширини
  //та висоти фото?
  const scrollBlock = (): void => {
    if (!isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  return (
    <li className="rounded shadow-lg">
      <img
        className="w-full h-[260px] object-cover transition-transform 
        duration-300 sm:hover:scale-[1] hover:scale-[1.02] cursor-zoom-in"
        src={webformatURL}
        alt="galeryImage"
        onClick={toggleModal}
        loading="lazy"
      />
      {isModalOpen && (
        <Modal isModalOpen={isModalOpen} onClose={toggleModal}>
          <img
            onClick={event => toggleZoom(event)}
            className={`w-full object-cover transition-transform 
        duration-300  max-h-[720px] max-w-[1080px] cursor-zoom-in
        ${isZoomed ? 'cursor-zoom-out' : ''}`}
            src={largeImageURL}
            alt="galeryImage"
          />
        </Modal>
      )}
    </li>
  );
};
