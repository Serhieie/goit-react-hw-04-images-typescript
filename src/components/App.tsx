import React, { useState, useEffect, useCallback } from 'react';
import { Loader } from 'helpers/loader';
import { SearchBar } from './SearchBar/SearchBar';
import { ImageGalery } from './ImageGalery/ImageGalery';
import { LoadMoreButton } from './LoadMoreButton/LoadMoreButton';
import * as API from '../services/apiService';
import {
  succesToastCall,
  toastCallEmpty,
  toastCallOutOfRange,
} from '../helpers/toast';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GaleryItemProps } from './App.types';

const App: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [images, setImages] = useState<GaleryItemProps[]>([]);
  const [searchValue, setSearchValue] = useState<string>('');
  const [pagination, setPagination] = useState<number>(9);
  const [error, setError] = useState<boolean>(false);

  //featching images
  useEffect(() => {
    const loadImages = async () => {
      //stop fetching if its empty searchValue or ppage === 0
      if (!searchValue || !page) {
        return;
      }
      setIsLoading(true);
      try {
        const response = await API.getImgs(searchValue, page, pagination);

        //if we submit input but no images in response we will throw toast
        if (searchValue && !response.hits.length) {
          setPage(0);
          return toastCallEmpty();
        }
        //if its last images throw toast and write them to the array
        if (response.hits.length < pagination) {
          setPage(0);
          toastCallOutOfRange();
          setImages(prevState => [...prevState, ...response.hits]);
        } else {
          //just regular load more images
          setImages(prevState => [...prevState, ...response.hits]);
          succesToastCall();
        }
      } catch (error) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, [page, searchValue, pagination]);

  const handleSubmit = (value: string): void => {
    //if submit the same we will add +1 to the page
    if (value === searchValue) {
      return setPage(prevState => prevState + 1);
    }
    setImages(prevState => []);
    setSearchValue(value);
    setPage(1);
  };

  //pus one to the page by clicking load more btn
  const handleClick = () => {
    setPage(prevState => prevState + 1);
  };

  //resize logic withc better to rewrite to li height
  const handleWindowResize = useCallback(() => {
    const windowWidth = window.innerWidth;
    let newPagination = 9;
    if (windowWidth >= 1980) {
      newPagination = 16;
    } else if (windowWidth >= 1480) {
      newPagination = 12;
    } else if (windowWidth <= 768) {
      newPagination = 10;
    } else if (windowWidth >= 768) {
      newPagination = 12;
    }
    setPagination(newPagination);
  }, []);

  useEffect(() => {
    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [handleWindowResize]);

  return (
    <>
      <SearchBar onSearch={handleSubmit} />
      <SearchBar onSearch={handleSubmit} />
      <ToastContainer />
      <ImageGalery images={images} />

      {/* Show loader when downloading */}
      {isLoading ? (
        <div
          className="fixed top-0 left-0 w-full h-full bg-slate-900 
        bg-opacity-40 flex justify-center items-center z-30"
        >
          <Loader />
        </div>
      ) : (
        page > 0 &&
        !error && <LoadMoreButton onClick={handleClick} error={error} />
        !error && <LoadMoreButton onClick={handleClick} error={error} />
      )}
    </>
  );
};

export default App;
