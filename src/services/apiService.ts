import axios, { AxiosResponse } from 'axios';
import { GaleryItemProps } from 'components/App.types';

const API_KEY: string = '39707189-cf35fc273df01ca9fa36884c9';
axios.defaults.baseURL = 'https://pixabay.com/api';

interface PixabayResponse {
  total: number;
  totalHits: number;
  hits: GaleryItemProps[];
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
