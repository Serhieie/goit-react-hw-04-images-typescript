import { FC } from 'react';
import { LoadMoreButtonProps } from './LoadMoreButton.type';

export const LoadMoreButton: FC<LoadMoreButtonProps> = ({ onClick, error }) => {
  return (
    //if error I decided to hide the button
    error ? null : (
      <button
        className="py-2 px-4 rounded bg-blue-600 transition-all duration-300
       text-center block text-white border-0 cursor-pointer  font-extralight text-base
        leading-6  min-w-[180px] mx-auto  hover:bg-hoverColor 
        my-5 fixed bottom-0  left-[50%] -translate-x-2/4"
        onClick={onClick}
        type="button"
      >
        Load More
      </button>
    )
  );
};
