import React from 'react';
import Image from 'next/image';
import Button from '../Button';
import StarIcon from '../../Assets/_images/star-icone.svg';
import CatalogAvatar from '../../Assets/_images/top-catalog-avatar.jpg';
import ArrowBtnImg from '../../Assets/_images/arrow-circle-right.svg';
import './style.scss';
import { useRouter } from 'next/navigation';
import { ICatalogs } from '@/Lib/catalogs/catalogsInterface';
import { isValidFileType } from '@/utils/helperMethods';


interface ICatalogCard {
  cardData: ICatalogs;
}

const CatalogCard: React.FC<ICatalogCard> = ({ cardData }) => {
  const router = useRouter();

  const recentAssets = React.useMemo(() => {
    return cardData?.recentAssets?.filter((item) => {
      if (isValidFileType(item, 'image')) {
        return item;
      }
      return false;
    });
  }, [cardData]);

  const abbreviateNumber = (count: number | string) => {
    const countNumber = typeof count === 'string' ? parseFloat(count) : count;
  
    if (countNumber < 1000) {
      return countNumber;
    } else if (countNumber > 999 && countNumber < 10000) {
      return (countNumber / 1000).toFixed(2) + "K";
    } else if (countNumber > 9999 && countNumber < 1000000) {
      return Math.floor(countNumber / 1000) + "K";
    } else if (countNumber > 999999 && countNumber < 1000000000) {
      return (countNumber / 1000000).toFixed(2) + "M";
    } else {
      return (countNumber / 1000000000).toFixed(2) + "B";
    }
  }
  

  return (
    <div className="explore-catalog-img-main-wrapper">
      {!recentAssets?.length && (
        <div className="img-explore-catalog-cover">
          <Image
            src={cardData?.image}
            alt="catalog-img"
            width={400}
            height={400}
            quality={100}
          />
        </div>
      )}
      {!!recentAssets?.length && (
        <div
          className={`img-explore-catalog-${cardData?.recentAssets?.length}`}
        >
          {recentAssets[0] && (
            <Image
              src={recentAssets[0]}
              width={400}
              height={400}
              quality={100}
              alt="first-asset"
            />
          )}
          {recentAssets.length === 2 && (
            <Image
              src={recentAssets[1]}
              className="sub-right-img-explore-catalog"
              height={400}
              width={400}
              quality={100}
              alt="second-asset"
            />
          )}
          {recentAssets.length === 3 && (
            <div>
              <Image
                src={recentAssets[1]}
                className="sub-right-img-explore-catalog"
                height={400}
                width={400}
                quality={100}
                alt="second-asset"
              />
              <Image
                src={recentAssets[2]}
                width={400}
                height={400}
                quality={100}
                className="sub-right-img-explore-catalog"
                alt="third-asset"
              />
            </div>
          )}
        </div>
      )}
      <div className="text-explore-catalog">
        <span>{cardData?.name}</span>
        <div className="sub-text-explore-catalog">
          {cardData?.creator?.profileImage ?(
          <Image
            src={cardData?.creator?.profileImage  }
            alt="avatar"
            quality={100}
            width={200}
            height={200}
          />
          ): (
            <div className="name-initials">
              {cardData?.creator?.firstName && cardData?.creator?.firstName[0].toUpperCase()}
              {cardData?.creator?.lastName && cardData?.creator?.lastName[0].toUpperCase()}
              
            </div>
          )}
          <span>Created By:</span>
          <span>{cardData?.creator?.userName || cardData?.creator_userName}</span>
          <Image src={StarIcon} alt="star icon" />
        </div>
      </div>
      <div className="explore-catalog-img-overlay">
        <div className="text-explore-catalog-img-overlay">
          <div className="avatar-text-explore-catalog">
            {cardData?.creator?.profileImage ? (
            <Image
              src={cardData?.creator?.profileImage}
              alt="avatar"
              quality={100}
              width={200}
              height={200}
            />): (
              <div className="name-initials">
                {cardData?.creator?.firstName && cardData?.creator?.firstName[0].toUpperCase()}
                {cardData?.creator?.lastName && cardData?.creator?.lastName[0].toUpperCase()}
              </div>
            )}
          </div>
          <div className="header-text-explore-catalog">
            <span>{cardData?.name}</span>
            <div className="sub-header-text-explore-catalog">
              <p>
                Created By: <span>{cardData?.creator?.userName || cardData?.creator_userName}</span>
              </p>
              {<Image src={StarIcon} alt="" />}
            </div>
          </div>
          <div className="values-text-explore-catalog">
            <span>Total Items:</span>
            <span>{cardData?.assetCount}</span>
          </div>
          <div className="footer-text-explore-catalog">
            <div>
              <div>Total Catalog Sale</div>
              <div className="sub-price-overlay-explore-catalog"><label htmlFor="">{abbreviateNumber(cardData?.volume || 0)}</label>  </div>
            </div>
            <div className="vertical-line-explore-catalog" />
            <div>
              <div className="total-catalog-label">Min Asset price</div>
              <div className="sub-price-overlay-explore-catalog">
                {cardData?.floorPrice}
              </div>
            </div>
          </div>
          <div className="btn-overlay-explore-catalog">
            <Button
              className="explore-assets-btn"
              element={
                <div className="d-flex align-items-center">
                  <span className="me-2">View Catalog</span>
                  <Image src={ArrowBtnImg} alt="arrow" />
                </div>
              }
              onClick={() => router.push(`/catalogs/${cardData?.id}`)}
              isFilled
              isGradient
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default CatalogCard;
