import React, { useState, useEffect, useCallback } from 'react';
import { Loader } from 'helpers/loader';
import { SearchBar } from './SearchBar/SearchBar';
import { ImageGalery } from './ImageGalery/ImageGalery';
import { LoadMoreButton } from './LoadMoreButton/LoadMoreButton';
import * as API from '../services/apiService';
import {
  toastCallError,
  succesToastCall,
  toastCallOutOfRange,
  toastCallEmpty,
} from '../helpers/toast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const App: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [images, setImages] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [pagination, setPagination] = useState<number>(9);
  const [heightToMinus, setHeightToMinus] = useState<number>(120);
  const [error, setError] = useState<boolean>(false);

  // Just for practice checking window screen size for different fetch
  const handleWindowResize = () => {
    const windowWidth = window.innerWidth;
    if (windowWidth >= 1980) {
      setPagination(16);
    } else if (windowWidth >= 1480) {
      setPagination(12);
      setHeightToMinus(145);
    } else if (windowWidth <= 768) {
      setPagination(10);
      setHeightToMinus(640);
    } else if (windowWidth >= 768) {
      setPagination(12);
      setHeightToMinus(395);
    } else {
      setPagination(9);
      setHeightToMinus(120);
    }
  };

  // like componentDidMount lestener of the window width
  useEffect(() => {
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  //Function witch scrolling images straight to new rendered (just for my screen I think -_-)
  const scrollBottom = useCallback(() => {
    const windowWidth = window.innerWidth;
    if (windowWidth <= 520) {
      return;
    }
    const windowHeight = window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;
    const scrollableDistance = pageHeight - windowHeight - heightToMinus;

    if (scrollableDistance > 0) {
      window.scrollTo({
        top: scrollableDistance,
        behavior: 'smooth',
      });
    }
  }, [heightToMinus]);

  //scroll down by pressing button activation of scrollBottom func
  useEffect(() => {
    scrollBottom();
  }, [page, scrollBottom]);

  // Fetch by value function
  const fetchImages = async (value: string) => {
    setIsLoading(true);
    try {
      setError(false);
      setSearchValue(value);
      setImages([]);

      const fetchedImages = await API.getImgs(value, 1, pagination);
      const { hits: newHits } = fetchedImages;

      if (!newHits.length) {
        setIsLoading(false);
        setPage(0);
        return toastCallEmpty();
      }

      succesToastCall();
      setImages(newHits);
      setPage(1);
      setIsLoading(false);
    } catch (error) {
      setError(true);
      setIsLoading(false);
      toastCallError();
    } finally {
      setIsLoading(false);
    }
  };

  // "Load More" button for getting more images from API
  const loadMoreImages = async () => {
    setIsLoading(true);
    try {
      const fetchedImages = await API.getImgs(
        searchValue,
        page + 1,
        pagination
      );
      const { hits: newHits } = fetchedImages;
      const updatedImages = [...images, ...newHits];

      if (!newHits.length || newHits.length < pagination) {
        setImages(updatedImages);
        setPage(0);
        toastCallOutOfRange();
      } else {
        setImages(updatedImages);
        setPage(state => state + 1);
        succesToastCall();
      }
    } catch (error) {
      setError(true);
      toastCallEmpty();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SearchBar onSearch={fetchImages} />
      <ToastContainer />
      <ImageGalery images={images} />

      {/* Show loader when donwloading */}
      {isLoading ? (
        <div className="fixed top-0 left-0 w-full h-full bg-slate-900 bg-opacity-40 flex justify-center items-center z-30">
          <Loader />
        </div>
      ) : (
        page > 0 &&
        !error && <LoadMoreButton onClick={loadMoreImages} error={error} />
      )}
    </>
  );
};
