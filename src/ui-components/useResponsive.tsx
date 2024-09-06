import { useMediaQuery } from 'react-responsive';

const useResponsive = () => {
  const mobile = useMediaQuery({ query: '(max-width: 480px)' });
  const tablet = useMediaQuery({ query: '(min-width: 480px) and (max-width: 1024px)' });
  const laptop = useMediaQuery({ query: '(min-width: 1025px)' });

  return { isMobile: mobile, isTablet: tablet, isLaptop: laptop };
};

export default useResponsive;