import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const CanonicalUrl = () => {
  const location = useLocation();

  useEffect(() => {
    const canonicalUrl = `https://www.1-day-hr.ru${location.pathname}${location.search}`;
    
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    
    link.href = canonicalUrl;
  }, [location]);

  return null;
};

export default CanonicalUrl;
