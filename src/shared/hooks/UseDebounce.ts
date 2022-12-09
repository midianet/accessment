import { useCallback, useRef } from 'react';

export const useDebounce = (delay = 300, notDelayInFistTime = true) => {

  const isFirstTime = useRef(notDelayInFistTime);
  const deboucing = useRef<NodeJS.Timeout>();

  const debounce = useCallback((func: () => void) =>{
    if(isFirstTime.current){
      isFirstTime.current = false;
      func();
    }else{
      if(deboucing.current){
        clearTimeout(deboucing.current);
      }
      deboucing.current = setTimeout(() =>  func(), delay);
    }
  },[]);

  return { debounce };
};