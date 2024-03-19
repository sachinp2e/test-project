import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Col, Row } from 'react-bootstrap';
import Button from '@/Components/Button';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/Lib/hooks';
import AssetImage from '@/Assets/_images/asset.png';
import AttestedStamp from '@/Assets/_images/attested-stamp.png'
import SuccessAnimation from '@/Assets/_images/sucess-animation.gif'
import { CopySymbol, FileIcon, ImageIconSvg, MusicSVG, ThreeDimensional, VerifiedSign, VideoSVG, } from '@/Assets/svg';
import useEffectOnce from '../../Hooks/useEffectOnce';
import { useAppDispatch } from '../../Lib/hooks';
import { getCataLogDetails } from '../../Lib/catalogs/catalogs.action';
import { getAllCatalogsSelector } from '../../Lib/catalogs/catalogs.selector';
import { validFileExtensions } from '@/utils/constants';
import AudioModel from '@/Components/AssetCard/AudioCard/audioModel';

interface IAssetVerificationModalProps {
  createdAsset: any;
}

const AssetVerificationModal: React.FC<IAssetVerificationModalProps> = ({ createdAsset }) => {
  const router = useRouter();
  const dispatch = useAppDispatch()
  const { catalogsData: { catalogDetails } } = useAppSelector(getAllCatalogsSelector);
  const [cardSelect, setCardSelect] = useState<string>('');

  useEffectOnce(() => {
    dispatch(getCataLogDetails({ id: `${createdAsset.catalogueId}` }));
  });

  const navigateToExplorePage = () => {
    router.push(`/asset-details/${createdAsset?.id}`);
  };

  useEffect(() => {
    const extension = (createdAsset?.assetMediaUrl || '').slice(
      (createdAsset?.assetMediaUrl || '').lastIndexOf('.') + 1,
    );
    if (validFileExtensions.image.includes(extension)) {
      setCardSelect('image');
    } else if (validFileExtensions.video.includes(extension)) {
      setCardSelect('video');
    } else if (validFileExtensions.threedimension.includes(extension)) {
      setCardSelect('threedimension');
    } else if (validFileExtensions.audio.includes(extension)) {
      setCardSelect('audio');
    } else {
      setCardSelect('pdf');
    }
    // setIsFavourite(AssetDetails?.isFavourite);
  }, [createdAsset, validFileExtensions]);

  return (
    <div className="congratulation-container">
      <Row>
        <Col>
          <div className="asset-content">

            {cardSelect === 'image' && (
              <>
                {/* <div className='copy-symbol'>
                  <ImageIconSvg />
                </div> */}
                <Image
                  src={createdAsset?.thumbnail ?? createdAsset?.assetThumbnail ?? createdAsset?.assetMediaUrl ?? AssetImage}
                  alt="thumbnail"
                  width={300}
                  height={300}
                  style={{ width: '100%', height: '100%' }}
                // quality={200}
                />
              </>
            )}
            {cardSelect === 'threedimension' && (
              <>
                <div className='copy-symbol'>
                  <ThreeDimensional />
                </div>
                <Image
                  src={createdAsset?.thumbnail ?? createdAsset?.assetThumbnail ?? createdAsset?.assetMediaUrl ?? AssetImage}
                  alt="thumbnail"
                  width={300}
                  height={300}
                  style={{ width: '100%', height: '100%' }}
                // quality={200}
                />
              </>
            )}

            {cardSelect === 'audio' && (
              <>
                <div className='copy-symbol'>
                  <MusicSVG />
                </div>
                <Image
                  src={createdAsset?.thumbnail ?? createdAsset?.assetThumbnail ?? createdAsset?.assetMediaUrl ?? AssetImage}
                  alt="thumbnail"
                  width={300}
                  height={300}
                  style={{ width: '100%', height: '100%' }}
                // quality={200}
                />
              </>
            )}
            {cardSelect === 'video' && (
              <>
                <div className='copy-symbol'>
                  <VideoSVG />
                </div>
                <Image
                  src={createdAsset?.thumbnail ?? createdAsset?.assetThumbnail ?? createdAsset?.assetMediaUrl ?? AssetImage}
                  alt="thumbnail"
                  width={300}
                  height={300}
                  style={{ width: '100%', height: '100%' }}
                // quality={200}
                />
              </>
            )}
            {cardSelect === 'pdf' && (
              <>
                <div className='copy-symbol'>
                  <FileIcon />
                </div>
                <Image
                  src={createdAsset?.thumbnail ?? createdAsset?.assetThumbnail ?? createdAsset?.assetMediaUrl ?? AssetImage}
                  alt="thumbnail"
                  width={300}
                  height={300}
                  style={{ width: '100%', height: '100%' }}
                // quality={200}
                />
              </>
            )}

            <div className="asset-details">
              <div className="details-text">
                <div className="catalog-name">
                  {catalogDetails.name}
                  {createdAsset.isLegallyVerified && <VerifiedSign width="24px" height="24px" />}{' '}
                </div>
                <div className="asset-name">{createdAsset.name}</div>
              </div>
            </div>
          </div>
        </Col>
        <Col>
          <div className="congratulations-text">
            <Image
              src={SuccessAnimation}
              alt="stamp"
              width={0}
              height={0}
              style={{ width: '120px', height: 'auto', padding: '10px' }}
            />
            <h5>Congratulations!</h5>
            <p>{createdAsset.isLegallyVerified ? "Your Asset has been created & verified succesfully" : "Your asset has been created successfully"}</p>
            <Button
              className="footer-Subscribe-btn verify-button"
              text="View my Asset"
              onClick={navigateToExplorePage}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AssetVerificationModal;
