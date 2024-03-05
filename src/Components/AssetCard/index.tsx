// TODO: add Three dimensional card condition to render it

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/Lib/hooks';
import { validFileExtensions } from '@/utils/constants';
import { getAllAssetsSelector } from '@/Lib/assets/assets.selector';
import ImageCardSection from './ImageCard';
import VideoCardSection from './VideoCard';
import AudioCardSection from './AudioCard';
import ThreeDimensionalSection from './ThreeDimensionalCard';
import './style.scss';
import FileCardSection from '@/Components/AssetCard/FileCard';

interface ISelectCards {
  item?: any;
  loading?: boolean;
  offerCard?: boolean;
  isDraft?: boolean;
  isBids?: boolean;
}

const AssetCard: React.FC<ISelectCards> = ({ item, loading = false, isDraft = false, offerCard = false, isBids = false }) => {
  const router = useRouter();

  const handleViewAssets = async (id: string) => {
    router.push(`/asset-details/${id}`);
  };

  const onCardClick = () => {
    router.push(`/asset-details/${item.id}`);
  }

  const renderCard = (item: any) => {
    const extension = (item.assetMediaUrl || []).slice(
      (item.assetMediaUrl || []).lastIndexOf('.') + 1,
    );

    if (validFileExtensions.image.includes(extension)) {
      return (
        <ImageCardSection
          item={item}
          loading={loading}
          handleViewAssets={handleViewAssets}
          offerCard={offerCard}
          isDraft={isDraft}
          isBids={isBids}
        />
      );
    } else if (validFileExtensions.video.includes(extension)) {
      return (
        <VideoCardSection
          item={item}
          loading={loading}
          handleViewAssets={handleViewAssets}
          offerCard={offerCard}
          isDraft={isDraft}
          isBids={isBids}
        />
      );
    } else if (validFileExtensions.audio.includes(extension)) {
      return (
        <AudioCardSection
          item={item}
          loading={loading}
          handleViewAssets={handleViewAssets}
          offerCard={offerCard}
          isDraft={isDraft}
          isBids={isBids}
        />
      );
    } else if (validFileExtensions.threedimension.includes(extension)) {
      return (
        <ThreeDimensionalSection
          item={item}
          loading={loading}
          handleViewAssets={handleViewAssets}
          offerCard={offerCard}
          isDraft={isDraft}
          isBids={isBids}
        />
      );
    } else if (validFileExtensions.others.includes(extension)) {
      return (
        <FileCardSection
          item={item}
          loading={loading}
          handleViewAssets={handleViewAssets}
          offerCard={offerCard}
          isDraft={isDraft}
          isBids={isBids}
        />
      )
    }else if(item?.certificateId && !item.assetMediaUrl || !item.assetThumbnail){
      return (
        <ImageCardSection
          item={item}
          loading={loading}
          handleViewAssets={handleViewAssets}
          offerCard={offerCard}
          isDraft={isDraft}
          isBids={isBids}
        />
      )
    }
  };

  return <div className="asset-card">{renderCard(item)}</div>;
};
export default AssetCard;
