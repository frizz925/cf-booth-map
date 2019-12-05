import * as CSS from 'csstype';
import React, { useEffect, useRef, useState } from 'react';
import { Ring } from 'react-awesome-spinners';

export interface LazyImageProps {
  src: string;
  width: number;
  height: number;
  alt?: string;
  className?: string;
  style?: CSS.Properties;
}

const LazyImage: React.FC<LazyImageProps> = props => {
  const { src, alt, className, style, width, height } = props;
  const [hasLoaded, setLoaded] = useState(false);
  const propsRef = useRef<LazyImageProps>();

  const loadImage = () => {
    const image = new Image();
    image.onload = () => setLoaded(true);
    image.src = src;
    if (image.complete) {
      image.onload(null);
    } else {
      setLoaded(false);
    }
  };

  useEffect(() => {
    const prevProps = propsRef.current;
    if (!prevProps || prevProps.src !== src) {
      loadImage();
    }
    propsRef.current = props;
  });

  const renderImage = () => (
    <img src={src} alt={alt} className={className} style={style} />
  );
  const renderLoader = () => (
    <div style={{ width, height }}>
      <Ring color='rgba(0, 0, 0, 0.7)' />
    </div>
  );

  return hasLoaded ? renderImage() : renderLoader();
};

export default LazyImage;
