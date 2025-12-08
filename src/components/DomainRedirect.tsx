import { useEffect } from 'react';

const DomainRedirect = () => {
  useEffect(() => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    const pathname = window.location.pathname;
    const search = window.location.search;
    const hash = window.location.hash;
    
    if (hostname === '1-day-hr.ru') {
      const newUrl = `${protocol}//www.1-day-hr.ru${pathname}${search}${hash}`;
      window.location.replace(newUrl);
    }
  }, []);

  return null;
};

export default DomainRedirect;
