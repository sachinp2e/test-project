'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import {
  CreateAssetFormDataType,
  CreateAssetsProps,
} from '@/Containers/createAssets/types';
import StepOne from './stepOne';
import StepTwo from './setpTwo';
import StepThree from './stepThree';
import Stepper from '@/Containers/createAssets/createAssetStepper';
import GenericModal from '@/Components/modal';
import AssetSuccessfulModal from '@/Containers/createAssets/assetSuccessfulModal';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { getAllAssetsSelector } from '@/Lib/assets/assets.selector';
import {
  createAsset,
  draftAssetAction,
  getDraftAssetByIdAction,
  getAllAssets,
} from '@/Lib/assets/assets.action';
import { validFileExtensions } from '@/utils/constants';
import './create-assets.scss';
import ResultModal from '@/Components/ResultModal';
import { authSelector } from '@/Lib/auth/auth.selector';
import { Logo } from '@/Assets/svg';

const CreateAssets: React.FC<CreateAssetsProps> = () => {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();

  const initialFormData: CreateAssetFormDataType = useMemo(() => {
    return {
      name: '',
      description: '',
      isMultiple: params.id === 'multiple',
      catalogueId: '',
      categoryId: '',
      totalSupply: 0,
      onSaleSupply: 0,
      lazyMinting: false,
      putOnMarketplace: true,
      properties: '{}',
      orderType: 'fixed',
      currencyId: '',
      media: null,
      thumbnail: null,
      physicalAsset: false,
      physicalAssetDescription: '',
      bidStartDate: dayjs().format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
      bidEndDate: '',
    };
  }, [params]);

  const [activeStep, setActiveStep] = useState<number>(1);
  const [formData, setFormData] = useState<CreateAssetFormDataType>(initialFormData);
  const [successModal, toggleSuccessModal] = useState<boolean>(false);
  const [draftSuccessModal, toggleDraftSuccessModal] = useState<boolean>(false);
  const [createdAsset, setCreatedAsset] = useState<any>(null);
  const [globalError, setGlobalError] = useState<string>(''); // stores the error coming from backend and displays on the third step
  const [draftFromExternal,setDraftFromExternal] = useState<boolean>(false);
  const { assets } = useAppSelector(getAllAssetsSelector);
  const { id: userId } = useAppSelector(authSelector);

  useEffect(() => {
    if (params.draftDetails?.length) {
      fetchDraftData();

    }
  }, [params.draftDetails]);

  useEffect(() => {
    if (params.id === 'multiple' && !formData.isMultiple) {
      setFormData({ ...formData, isMultiple: true });
    } else if (params.id === 'single' && formData.isMultiple) {
      setFormData({ ...formData, isMultiple: false });
    }
  }, []);

  const fetchDraftData = async () => {
    try {
      const { payload }: any = await dispatch(getDraftAssetByIdAction(params.draftDetails[0]));
      setFormData({
        id: payload.id,
        name: payload.name,
        description: payload.description,
        isMultiple: payload.isMultiple,
        catalogueId: payload.catalogueId,
        categoryId: payload.categoryId,
        totalSupply: payload.totalSupply,
        onSaleSupply: payload.onSaleSupply,
        lazyMinting: false,
        putOnMarketplace: payload.putOnMarketplace,
        properties: payload.properties,
        orderType: payload.orderType,
        currencyId: payload.currencyTypeId || formData.currencyId,
        media: payload.assetMediaUrl,
        thumbnail: payload.assetThumbnail,
        physicalAsset: payload.physicalAsset,
        physicalAssetDescription: payload.physicalAssetDescription || formData.physicalAssetDescription,
        bidStartDate: payload.bidStartDate || formData.bidStartDate,
        bidEndDate: payload.bidEndDate || formData.bidEndDate,
        minBid: payload.minBid || formData.minBid,
        price: payload.price || formData.price,
        royalty: payload.royalty || formData.royalty,
      });
      if(payload?.certificateId && payload?.draftCreatedFromExternal){
        setDraftFromExternal(true);
      }
      if (payload.httpStatus === 400 && payload.customErrorNumber === 100652) {
        router.push('/404');
      }
      if (payload.isMultiple && params.id !== 'multiple') {
        router.push(`/create-asset/multiple/${payload.id}`);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const onNext = () => {
    setActiveStep((prevState) => prevState + 1);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const onPrevious = () => {
    if (activeStep !== 1) {
      setActiveStep((prevState) => prevState - 1);
    }
  };

  // function called when we need to partially update the form data
  const updateFormData = (newValues: Partial<CreateAssetFormDataType>) => {
    setFormData({ ...formData, ...newValues });
    setGlobalError('');
  };

  // function to create the asset
  const onFinish = async (values: Partial<CreateAssetFormDataType>) => {
    try {
      const payload = { ...formData, ...values };
      if (payload?.id && typeof payload.media === 'string') {
        delete payload.media;
      }
      setFormData(payload);
      onCreateAsset(payload);
    } catch (err: any) {
      console.error(err);
    }
  };

  const onCreateAsset = async (values: Partial<CreateAssetFormDataType>) => {
    try {
      const finalObj: Partial<CreateAssetFormDataType> & { draftId?: string } =
        values;
      const data = new FormData();
      delete finalObj.physicalAssetDescription; // deleting as the backend is not expecting this field
      if (!finalObj.putOnMarketplace) {
        delete finalObj.orderType;
      }

      if (finalObj.catalogueId?.toString() === '1') {
        delete finalObj.catalogueId;
        finalObj.isDefaultCatalogue = true;
      }

      if (finalObj.orderType === 'fixed') {
        delete finalObj.minBid;
        delete finalObj.bidEndDate;
        delete finalObj.bidStartDate;
      } else if (finalObj.orderType === 'timed') {
        delete finalObj.price;
      } else {
        delete finalObj.price;
        delete finalObj.minBid;
        delete finalObj.bidEndDate;
        delete finalObj.bidStartDate;
        delete finalObj.orderType;
      }

      // remove catalogueId if default is selected
      if (finalObj.catalogueId === 'default') {
        delete finalObj.catalogueId;
        finalObj.isDefaultCatalogue = true;
      }

      // @ts-ignore
      if (
        ![
          ...validFileExtensions.audio,
          ...validFileExtensions.video,
          ...validFileExtensions.others,
          ...validFileExtensions.threedimension,
        ].includes((finalObj.media?.type || '').split('/')?.[1] || '')
        &&
        !finalObj.media?.name?.toLowerCase().endsWith(".glb")
      
      ) {
        delete finalObj.thumbnail;
      }

      if (!finalObj.isMultiple) {
        delete finalObj.totalSupply;
        delete finalObj.onSaleSupply;
      }

      if (!finalObj.physicalAsset) {
        delete finalObj.physicalAssetDescription;
      }

      if (!finalObj.royalty) {
        finalObj.royalty = 0;
      }

      if (!finalObj.putOnMarketplace) {
        delete finalObj.orderType;
      }

      if (finalObj.id && params.draftDetails.length) {
        finalObj.draftId = finalObj.id;
        delete finalObj.id;
      } else {
        delete finalObj.id;
      }
      Object.entries({ ...finalObj }).forEach(([key, value]) => {
        // @ts-ignore TODO: fix Ts-Ignore error here
        data.append(key, value);
      });

      const response: any = await dispatch(createAsset(data))

      if (!assets.length) {
        await dispatch(getAllAssets({}));
      }

      if (response.payload.status === 200) {
        setCreatedAsset(response.payload.result);
        toggleSuccessModal(true);
      } else {
        toggleSuccessModal(false);
        setGlobalError(response.payload.message);
      }
    } catch (err: any) {
      console.error(err, err);
    }
  };

  const onDraftAsset = async (values: Partial<CreateAssetFormDataType>) => {
    try {
      const finalObj: Partial<CreateAssetFormDataType> = {
        ...formData,
        ...values,
      };
      const data = new FormData();
      delete finalObj.id;
      delete finalObj.physicalAssetDescription; // deleting as the backend is not expecting this field
      delete finalObj.lazyMinting; // deleting as the backend is not expecting this field

      if (finalObj.orderType === 'fixed') {
        delete finalObj.minBid;
        delete finalObj.bidEndDate;
        delete finalObj.bidStartDate;
      } else if (finalObj.orderType === 'timed') {
        delete finalObj.price;
      } else {
        delete finalObj.price;
        delete finalObj.minBid;
        delete finalObj.bidEndDate;
        delete finalObj.bidStartDate;
        delete finalObj.orderType;
        delete finalObj.currencyId;
      }

      // @ts-ignore
      if (
        ![
          ...validFileExtensions.audio,
          ...validFileExtensions.video,
          ...validFileExtensions.others,
          ...validFileExtensions.threedimension,
        ].includes((finalObj.media?.type || '').split('/')?.[1] || '') &&
        !finalObj.media?.name?.toLowerCase().endsWith('.glb')
      ) {
        delete finalObj.thumbnail;
      }

      if (!finalObj.isMultiple) {
        delete finalObj.totalSupply;
        delete finalObj.onSaleSupply;
      }

      if (!finalObj.physicalAsset) {
        delete finalObj.physicalAssetDescription;
      }

      if (!finalObj.royalty) {
        finalObj.royalty = 0;
      }

      if (!finalObj.putOnMarketplace) {
        delete finalObj.orderType;
      }

      if (typeof finalObj.media === 'string') {
        delete finalObj.media;
      }
      if (typeof finalObj.thumbnail === 'string') {
        delete finalObj.thumbnail;
      }

      if(finalObj.putOnMarketplace && !finalObj.orderType){
        finalObj.orderType = 'fixed';
      }
      Object.entries(finalObj).forEach(([key, value]) => {
        if (
          value === null ||
          value === undefined ||
          value === '' ||
          value === 0
        ) {
          return;
        }

        // @ts-ignore TODO: fix Ts-Ignore error here
        data.append(key, value);
      });

      const response: any = await dispatch(
        draftAssetAction({ data, id: formData.id || '' }),
      );
      if (response.payload.status === 200) {
        setCreatedAsset(response.payload.result);
        toggleDraftSuccessModal(true);
      } else {
        toggleDraftSuccessModal(false);
        setGlobalError(response.payload.message);
      }
    } catch (err: any) {
      console.error(err, err);
    }
  };

  const renderForm = () => {
    switch (activeStep) {
      case 1:
        return (
          <StepOne
            formData={formData}
            updateFormData={updateFormData}
            onNext={onNext}
            onDraftAsset={onDraftAsset}
            draftFromExternal={draftFromExternal}
          />
        );
      case 2:
        return (
          <StepTwo
            formData={formData}
            updateFormData={updateFormData}
            onNext={onNext}
            onPrevious={onPrevious}
            onDraftAsset={onDraftAsset}
          />
        );
      case 3:
        return (
          <StepThree
            formData={formData}
            updateFormData={updateFormData}
            onFinish={onFinish}
            onPrevious={onPrevious}
            globalError={globalError}
            onDraftAsset={onDraftAsset}
          />
        );
      default:
        return null;
    }
  };

  const navigateToDrafts = () => {
    router.push(`/user/${userId}?tab=My Drafts`);
  };

  const renderSuccessModal = () => {
    if (successModal) {
      return <AssetSuccessfulModal createdAsset={createdAsset || {}} />;
    }
    return null;
  };

  if (params?.draftDetails?.[0] && !formData.id && !createdAsset) {
    return (
      <div className="create-asset-loader-wrapper">
        <div className="logo-loader">
          <Logo />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="create-asset-container">
        <div className="asset-container">
          <div className="asset-header">
            <span className="creation-header">
              your {params.id} asset creation starts here
            </span>
          </div>
          <div className="wizard-form-container">
            <Stepper
              activeStep={activeStep}
              setActiveStep={setActiveStep}
              steps={['1', '2', '3']}
            />
          </div>
          <div className="wizard-form">{renderForm()}</div>
        </div>
      </div>
      {draftSuccessModal && (
        <ResultModal
          text="Your asset has been saved as a draft"
          onProceed={navigateToDrafts}
          type="SUCCESS"
        />
      )}
      {successModal && (
        <GenericModal
          className="modals-subscribe"
          show
          close={false}
          onHide={() => {}}
          title=""
          body={renderSuccessModal()}
        />
      )}
    </>
  );
};

export default CreateAssets;
