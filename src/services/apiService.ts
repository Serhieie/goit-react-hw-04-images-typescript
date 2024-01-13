import axios, { AxiosResponse } from 'axios';


const API_KEY: string = '39707189-cf35fc273df01ca9fa36884c9';
axios.defaults.baseURL = 'https://pixabay.com/api';

export interface ImageGalleryItemProps {
  id:number;
  webformatURL: string;
  largeImageURL: string;
}

interface PixabayResponse {
  total: number;
  totalHits: number;
  hits: ImageGalleryItemProps;
}

export const getImgs = async (
  value: string,
  page: number,
  pagination: number
): Promise<PixabayResponse> => {
  const params = new URLSearchParams({
    key: `${API_KEY}`,
    q: `${value}`,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    per_page: pagination.toString(),
  });

  try {
    const response: AxiosResponse<PixabayResponse> =
      await axios.get<PixabayResponse>(`/?${params}&page=${page}`);

    return response.data;
  } catch (error) {
    console.error('Ошибка при получении изображений:', error);
    throw new Error('Не удалось получить изображения');
  }
};
