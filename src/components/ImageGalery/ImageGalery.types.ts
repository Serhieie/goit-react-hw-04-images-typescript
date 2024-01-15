import { GaleryItemProps } from 'components/App.types';
export interface Image {
  id: number;
  webformatURL: string;
  largeImageURL: string;
}

export interface ImageGaleryProps {
  images: GaleryItemProps[];
}
