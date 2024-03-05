import React, { useState } from 'react';
import Image from 'next/image';
import Modal from 'react-bootstrap/Modal';
import axiosInstance from '@/Lib/axios';
import Button from '@/Components/Button';
import CustomSelect, { IOption } from '@/Components/CustomSelect';
import MyIPRIcon from '../../../Assets/_images/myipr-alert-icon.png';
import { Info } from '@/Assets/svg';
import ResultModal from '@/Components/ResultModal';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { getAllCategorySelector } from '@/Lib/category/category.selector';
import useEffectOnce from '@/Hooks/useEffectOnce';
import { getAllCategories } from '@/Lib/category/category.action';
import { getMyiprUserCredits } from '@/Lib/auth/auth.action';
import { authSelector } from '@/Lib/auth/auth.selector';
import { updateAssetDetails } from '@/Lib/assetDetail/assetDetail.slice';
import { toastErrorMessage } from '@/utils/constants';

interface IVerifyAssetModal {
  assetId: string;
  onClose: () => void;
}

const VerifyAssetModal: React.FC<IVerifyAssetModal> = ({
  assetId,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showLinkAssetModal, toggleLinkAssetModal] = useState<boolean>(false);
  const [certificateCategories, setCertificateCategories] = useState<any[]>([]);

  const { categories } = useAppSelector(getAllCategorySelector);
  const { myiprCredits } = useAppSelector(authSelector);

  const getCertificateCategories = async () => {
    try {
      const response = await axiosInstance.get('/asset/certificate/categories');
      if (response.status !== 200) {
        console.log('Error fetching certificate categories');
      }
      setCertificateCategories(response.data?.result || []);
    } catch (err: any) {
      console.log(err);
      setError(
        err.response?.data?.message ||
          'Something went wrong while fetching certificate categories',
      );
    }
  };

  useEffectOnce(() => {
    dispatch(getMyiprUserCredits());
    if (!certificateCategories.length) {
      getCertificateCategories();
    }
    if (!Object.entries(categories).length) {
      dispatch(getAllCategories({}));
    }
  });

  const onCancel = () => {
    onClose();
  };

  const onProceed = async () => {
    try {
      const response = await axiosInstance.get(
        `/asset/verify-for-certificate/${assetId}`,
      );
      if (response.status !== 200) {
        console.log('Error verifying asset');
      }
      if (response.data?.result?.canCreate) {
        const payload = {
          assetId,
          certificateCategoryId: selectedCategory.toString(),
        };
        const canCreateResponse = await axiosInstance.post(
          '/asset/create-certificate',
          payload,
        );
        if (canCreateResponse.status !== 200) {
          console.log('Error creating certificate');
        }
        setResponse('Your Asset has been verified successfully');
        dispatch(updateAssetDetails({
          assetVerificationStatus: canCreateResponse.data?.result?.assetVerificationStatus,
          certificateId: canCreateResponse.data?.result?.certificateId,
          hash: canCreateResponse.data?.result?.hash,
        }));
      } else if (response.data?.result?.canLink) {
        toggleLinkAssetModal(true);
      }else if (!response.data?.result?.canCreate && !response.data?.result?.canLink){
        setError(response.data?.result?.errorMessage);
      }
    } catch (err: any) {
      console.log(err);
      setError(
        err.response?.data?.message &&
          'ASSET VERIFICATION FAILED! A certificate for this asset already exist in MyIPR recycle bin. Please restore the certificate to link it with this asset.',
      );
    }
  };

  const onLinkAsset = async () => {
    try {
      const response = await axiosInstance.post(
        `/asset/link-with-certificate/${assetId}`,
      );
      if (response.status !== 200) {
        console.log('Error linking asset');
      }
      setResponse('Your Asset has been linked successfully');
    } catch (err: any) {
      console.log(err);
      setError(
        err.response?.data?.message ||
          'Something went wrong while linking asset',
      );
    }
  };

  const onResultModalToggle = () => {
    setResponse(null);
    setError(null);
    onClose();
  };

  if (response || error) {
    return (
      <ResultModal
        onProceed={onResultModalToggle}
        text={response ? 'Congratulations!' : 'Failed to verify!'}
        type={response ? 'SUCCESS' : 'FAILURE'}
        description={response || error}
      />
    );
  }

  const onCategoryChange = (_: string, option: IOption) => {
    setSelectedCategory(option.value);
  };
  const handleAddCredits = async () => {
    try {
      const response = await axiosInstance.post(`/user/redirect_url/`, {
        addCredit: true,
      });
      if (response.data?.result?.url) {
        onClose()
        window.open(response.data.result.url, '_blank');
      }
    } catch (error) {
      toastErrorMessage('Something went wrong while redirecting, Please try after some time.')
      console.error('Error while fetching certificate url', error);
    }
  };

  if (showLinkAssetModal) {
    return (
      <LinkAssetModal
        onHide={() => toggleLinkAssetModal(false)}
        onSuccess={onLinkAsset}
      />
    );
  }

  return (
    <Modal
      show
      onHide={onClose}
      centered
      backdrop="static"
      className="verify-asset-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Available MyIPR Credits</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <>
          <div className="credit-section">
            <div className="available-credits">
              <Image src={MyIPRIcon} alt="" />
              <label>Credits: </label>
              <span>{myiprCredits}</span>
            </div>
            <Button
              isFilled
              isGradient
              text="Add Credits"
              onClick={handleAddCredits}
            />
          </div>
          <div className="verify-asset-details">
            <h4>Category selection for your certificate</h4>
            <div className="category">
              <label>Select Category</label>
              <CustomSelect
                name="category"
                placeholder="Category"
                value={selectedCategory}
                options={certificateCategories.map((category: any) => ({
                  id: category.id,
                  value: category.id,
                  label: category.name,
                }))}
                onChange={onCategoryChange}
              />
            </div>
          </div>
          <div className="verify-asset-footer">
            <Button
              isFilled
              isGradient
              text="Proceed"
              onClick={onProceed}
              disabled={!myiprCredits || !selectedCategory}
            />
            <Button isGradient text="Cancel" onClick={onCancel} />
          </div>
          <div className="info-section">
            <Info fill="#716A79" />
            <span>
              Asset Verification is powered by our own IPR Management Cloud -
              MyIPR
            </span>
          </div>
        </>
      </Modal.Body>
    </Modal>
  );
};

const LinkAssetModal: React.FC<any> = ({ onHide, onSuccess }) => {
  return (
    <Modal
      show
      centered
      backdrop="static"
      onHide={onHide}
      className="link-asset-modal"
    >
      <Modal.Header closeButton />
      <Modal.Body>
        <h2>Link Asset to Certificate?</h2>
        <p>
          You already have an existing certificate for this asset. Would you
          like to link this asset to the same certificate?
        </p>
        <Button isFilled isGradient text="Link Asset" onClick={onSuccess} />
      </Modal.Body>
    </Modal>
  );
};

export default VerifyAssetModal;
