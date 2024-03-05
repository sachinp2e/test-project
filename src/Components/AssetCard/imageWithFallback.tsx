// This component replicates the functionality of the Image component from next/image, but with the added feature of a fallback image. This is useful when you want to display a placeholder image while the main image is loading, or if the main image fails to load. The Image component from next/image does not support a fallback image, so this component is a good alternative when you need this feature.

import React, { useState } from 'react';
import Image from 'next/image';
import { isValidFileType } from '@/utils/helperMethods';
import TrendingImage from '@/Assets/_images/trending-img-7.png';

interface IImageWithFallbackProps {
  src: any;
  alt: string;
  fallbackSrc?: string;
  assetDetails?: any;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  layout?: 'fixed' | 'intrinsic' | 'responsive';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

const ImageWithFallback: React.FC<IImageWithFallbackProps> = (props) => {
  const { src, alt, fallbackSrc, assetDetails, ...rest } = props;

  const [imageSrc, setImageSrc] = useState<any>(src);

  const handleError = () => {
    if (fallbackSrc) {
      setImageSrc(fallbackSrc);
      return;
    }
    if (assetDetails.assetThumbnail || assetDetails.assetThumbnailUrl) {
      setImageSrc(assetDetails.assetThumbnail || assetDetails.assetThumbnailUrl);
      return;
    }
    const isValid = isValidFileType((assetDetails.assetMediaUrl || '').toLowerCase(), 'image');
    if (isValid) {
      setImageSrc(assetDetails.assetMediaUrl);
      return;
    }
    setImageSrc(TrendingImage);
  };

  return (
    <Image
      src={imageSrc}
      alt={alt}
      onError={handleError}
      {...rest}
    />
  );
};

export default ImageWithFallback;
