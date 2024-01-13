export interface Image {
  id: number;
  webformatURL: string;
  largeImageURL: string;
}

export interface ImageGaleryProps {
  images: Image[];
}
