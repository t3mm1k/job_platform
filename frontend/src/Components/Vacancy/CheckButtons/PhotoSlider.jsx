import React, { useState, useEffect } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
function resolvePhotoUrl(photo) {
  if (!photo) return '';
  const p = String(photo);
  if (p.startsWith('http://') || p.startsWith('https://') || p.startsWith('data:')) {
    return p;
  }
  const base = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');
  return base ? `${base}/${p.replace(/^\//, '')}` : p;
}
function PhotoSlider({
  photos,
  onClose
}) {
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  useEffect(() => {
    if (!photos || photos.length === 0) return;
    let isMounted = true;
    const imagePromises = photos.map(photo => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = resolvePhotoUrl(photo);
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    });
    Promise.all(imagePromises).then(() => {
      if (isMounted) setAllImagesLoaded(true);
    }).catch(() => {
      if (isMounted) setLoadingError(true);
    });
    return () => {
      isMounted = false;
    };
  }, [photos]);
  if (!photos || photos.length === 0) {
    return <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg p-4 pt-[30px]">
                    <p>No photos available.</p>
                    <CloseButton onClose={onClose} />
                </div>
            </div>;
  }
  if (loadingError) {
    return <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg p-4 pt-[30px]">
                    <p>Error loading photos</p>
                    <CloseButton onClose={onClose} />
                </div>
            </div>;
  }
  return <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50" onClick={onClose}>
            <CloseButton onClose={onClose} />

            <div className="rounded-lg p-4 max-w-[95vw] max-h-[90vh] overflow-auto relative">
                {!allImagesLoaded ? <div className="flex items-center justify-center h-[268px]">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
                    </div> : <Splide aria-label="Job Photos" options={{
        perPage: 1,
        perMove: 1,
        autoplay: false,
        rewind: true,
        pagination: true,
        arrows: false,
        height: '268px'
      }}>
                        {photos.map((photo, index) => <SplideSlide key={index}>
                                <div className="w-full h-[300px] flex items-center justify-center overflow-hidden rounded-md">
                                    <img src={resolvePhotoUrl(photo)} alt={`Photo ${index}`} className="w-full h-full object-cover" />
                                </div>
                            </SplideSlide>)}
                    </Splide>}
            </div>
        </div>;
}
const CloseButton = ({
  onClose
}) => <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="fixed z-20 top-[30px] right-3 cursor-pointer" onClick={onClose}>
        <path d="M18 6.66663L6 18.6666" stroke="white" strokeWidth="2" />
        <path d="M6 6.66663L18 18.6666" stroke="white" strokeWidth="2" />
    </svg>;
export default PhotoSlider;
