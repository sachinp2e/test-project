import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Button from '@/Components/Button';
import CustomSelect, { IOption } from '@/Components/CustomSelect';
import MediaUploadButton from '@/Components/Fileupload';
import InputField from '@/Components/Input/Input';
import GenericModal from '@/Components/modal';
import GenericTextArea from '@/Components/textarea';
import { useFormik } from 'formik';
import { Col, Row } from 'react-bootstrap';
import CreateCatalog from './createCatalog';
import ArrowCircleRightImg from '../../Assets/_images/arrow-circle-right.svg';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { getAllCategorySelector } from '@/Lib/category/category.selector';
import { CreateAssetFormDataType } from '@/Containers/createAssets/types';
import { validFileExtensions } from '@/utils/constants';
import { isValidFileType } from '@/utils/helperMethods';
import { ICatalogs } from '@/Lib/catalogs/catalogsInterface';
import useEffectOnce from '@/Hooks/useEffectOnce';
import { PlusIcon } from '@/Assets/svg';
import { getAllUserCatalogs } from '@/Lib/users/users.action';
import { getAllUsersSelector } from '@/Lib/users/users.selector';
import { authSelector } from '@/Lib/auth/auth.selector';

interface IStepOneProps {
  formData: CreateAssetFormDataType;
  updateFormData: (newValues: Partial<CreateAssetFormDataType>) => void;
  onNext: () => void;
  onDraftAsset: (values: Partial<CreateAssetFormDataType>) => void;
  draftFromExternal: boolean;
}

const validationSchema = Yup.object().shape({
  media: Yup.mixed()
    .test('is-valid-size', 'Max allowed size is 100MB', (value: any) => {
      if (typeof value === 'string') {
        return true;
      }
      return value && value.size <= 100 * 1024 * 1000;
    })
    .required('Media is required')
    .test('is-valid-type', 'Not a valid file type', (value: any) => {
      if (typeof value === 'string') {
        return isValidFileType(value, 'image', value);
      }
      return isValidFileType(
        value && (value.name || '').toLowerCase(),
        'image',
        value,
      );
    }),
  // .when(['id'], (values, field) => {
  //   if (
  //     !values[0] &&
  //     [...validFileExtensions.image, ...validFileExtensions.video].includes(
  //       (values[0]?.type || '').split('/')?.[1] || '',
  //     )
  //   ) {
  //     return field
  //       .required('Media is required')
  //       .test('is-valid-type', 'Not a valid file type', (value: any) =>
  //         isValidFileType(value && (value.name || '').toLowerCase(), 'image'),
  //       );
  //   }
  //   return field;
  // }),
  thumbnail: Yup.mixed().when(['media'], (values, field) => {
    if (
      values[0] &&
      [
        ...validFileExtensions.audio,
        ...validFileExtensions.video,
        ...validFileExtensions.threedimension,
      ].includes((values[0]?.type || '').split('/')?.[1] || '')
    ) {
      return field
        .required('Thumbnail is required')
        .test('is-valid-type', 'Not a valid image type', (value: any) =>
          isValidFileType(value && (value.name || '').toLowerCase(), 'image'),
        )
        .test('is-valid-size', 'Max allowed size is 30MB', (value: any) => {
          if (typeof value === 'string') {
            return true;
          }
          return value && value.size <= 30 * 1024 * 1000;
        });
    }
    return field.nullable();
  }),
  categoryId: Yup.string().required('Category is required'),
  name: Yup.string()
    .required('Name is required')
    .min(4, 'Name must be at least 4 character')
    .max(30, 'Name must not exceed 30 characters'),
  catalogueId: Yup.string().required('Catalog is required'),
  description: Yup.string()
    .required('Description is required')
    .min(4, 'Description must be at least 4 character')
    .max(160, 'Description must not exceed 160 characters'),
});

const StepOne: React.FC<IStepOneProps> = ({
  formData,
  updateFormData,
  onNext,
  onDraftAsset,
  draftFromExternal,
}) => {
  const dispatch = useAppDispatch();

  const {
    usersData: { userCatalogs },
  } = useAppSelector(getAllUsersSelector);
  const { id: userId }: any = useAppSelector(authSelector);

  const { categories } = useAppSelector(getAllCategorySelector);

  const [showCatalogModal, toggleCatalogModal] = useState<boolean>(false);
  const [sizeError, setSizeError] = useState<boolean>(false);
  const [errorThumbnail, setErrorThumbnail] = useState<boolean>(false);
  const [fileNameForExternal, setFileNameForExternal] = useState<string>('');
  useEffectOnce(() => {
    dispatch(getAllUserCatalogs({ userId: userId }));
  });

  // function called when we open the creation catalog modal
  const toggleModal = () => {
    toggleCatalogModal(!showCatalogModal);
  };

  const initialValues = useMemo(() => {
    const initialValues: Partial<CreateAssetFormDataType> = {
      id: formData.id,
      media: formData.media || null,
      thumbnail: formData.thumbnail || null,
      categoryId: formData.categoryId || '',
      name: formData.name || '',
      catalogueId: formData.catalogueId || '',
      description: formData.description || '',
    };
    return initialValues;
  }, []);

  const {
    setFieldValue,
    values,
    touched,
    errors,
    handleChange,
    handleSubmit,
    isValid,
    setFieldError,
    setTouched,
  }: any = useFormik({
    validateOnMount: true,
    initialValues,
    onSubmit: (values, e) => {
      updateFormData(values);
      onNext();
    },
    validationSchema,
  });

  const handleMediaSelect = (name: string, file: File) => {
    if (!isValidThumbnail(file)) {
      setFieldValue('thumbnail', null);
    }
    if (name === 'thumbnail' && file?.size / (1024 * 1024) >= 2) {
      setSizeError(true);
    } else {
      setSizeError(false);
    }
    if (name === 'thumbnail' && !isValidThumbnail(file)) {
      setErrorThumbnail(true);
    } else {
      setErrorThumbnail(false);
    }
    setFieldValue(name, file);
  };
  const isValidThumbnail = (file: File) => {
    return file.type.startsWith('image/');
  };
  const handleSelectChange = (name: string, option: any) => {
    setFieldValue(name, option.id);
  };

  // this function sets the created catalog id as the selected catalog id
  const setCatalogueId = (id: string) => {
    setFieldValue('catalogueId', id);
  };

  const showThumbnail = () => {
    if (values?.id) {
      // @ts-ignore
      let media = values?.media || values?.thumbnail;
      let mediaUrlSplit, mediaExtension;

      //if media is url, then split by '.' to get the extension if media is object then split by '/' to get the extension
      if (media && (typeof media === 'string' || media instanceof String)) {
        mediaUrlSplit = media.split('.');
      } else if (
        typeof media === 'object' &&
        !Array.isArray(media) &&
        media !== null
      ) {
        mediaUrlSplit = media?.type.split('/');
      } else if (!mediaExtension) {
        return false;
      }

      // getting the extension from the splitted array
      mediaExtension = mediaUrlSplit[mediaUrlSplit.length - 1];
      return ![...validFileExtensions.image].includes(mediaExtension);
    }

    if (values.media) {
      // @ts-ignore
      const media = values.media;

      if (isValidFileType(media && (media.name || ''), 'image', media)) {
        return ![...validFileExtensions.image].includes(
          (values.media?.type || '').split('/')?.[1] || '',
        );
      }
    }
    return false;
  };

  const saveAsDraft = () => {
    if (!values.name) {
      setFieldError('name', 'Name is required');
      setTouched({ ...touched, name: true });
    } else {
      onDraftAsset(values);
    }
  };

  const catalogueOptions = useMemo(() => {
    const options: IOption[] = [];
    options.push({
      id: 'default',
      value: 'default',
      label: 'NiftiQ Catalog (Default)',
    });
    (userCatalogs?.catalogs || []).forEach((catalogs: ICatalogs) => {
      options.push({
        id: catalogs.id,
        value: catalogs.id,
        label: catalogs.name,
      });
    });
    return options;
  }, [userCatalogs.catalogs]);

  const isMediaPreview = useMemo(() => {
    if (!draftFromExternal && typeof values.media !== 'string') {
      return true;
    }
    if (typeof values?.media === 'string') {
      const extension = values.media.split('.').pop();
      return validFileExtensions.image.includes(extension) ? true : false;
    }
  }, [values.media]);

  const mediaUrlToBeShown = useMemo(() => {
    if (!draftFromExternal && typeof values.media !== 'string') {
      return values.media;
    }
    if (typeof values?.media === 'string') {
      const extension = values.media.split('.').pop();
      const fileName = values.media.split('.com/').pop();
      return validFileExtensions.image.includes(extension) ? values.media : fileName;
    }
  }, [values?.media]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-uploader">
        <div>
          <div className="media-withformat">
            <MediaUploadButton
              buttonLabel="Upload Media"
              buttonClassName="mt-3"
              onFileSelect={handleMediaSelect}
              accept="image/*, .pdf, .doc, .docx, .mp3, .mp4, .wav, .ogg, .glb, .webm"
              htmlFor="media"
              value={mediaUrlToBeShown}
              isPreview={isMediaPreview}
              isDisabled = {draftFromExternal}
            />
            <div className="supported-formats">
              <p>
                Supported formats - JPG, PNG, GIF, SVG, MP4, WEBM, MP3, WAV,
                OGG, .PDF, .DOCX, .GLB
              </p>
              <p>Max size: 100 MB</p>
            </div>
          </div>
          {(touched.media || values.media) && errors.media && (
            <div className="error-message">{errors.media}</div>
          )}
        </div>
        {
          // check if the media is selected and it is video or audio. If yes, then show the thumbnail upload UI
          // @ts-ignore
          showThumbnail() && (
            <div className="thumbnail-wrapper">
              <div className="upload-thumbnail">
                <MediaUploadButton
                  buttonLabel="Upload Thumbnail"
                  buttonClassName="mt-3"
                  onFileSelect={handleMediaSelect}
                  accept=".jpeg, .jpg, .webp, .png, .gif"
                  htmlFor="thumbnail"
                  isPreview={true}
                  value={values.thumbnail}
                />
              </div>
              {sizeError && (
                <div className="error-message">Max allowed size is 2MB</div>
              )}
              {errorThumbnail && (
                <div className="error-message">
                  Supported formats - JPG, PNG, GIF, WEBP
                </div>
              )}
            </div>
          )
        }
      </div>

      <div className="d-flex justify-content-evenly gap-5 mt-4 create-asset-select-category">
        <div className="flex-1">
          <CustomSelect
            label="Select Category*"
            className="wizard-form-select"
            placeholder="Select Category"
            onChange={handleSelectChange}
            options={categories.map((category: any) => ({
              id: category.id,
              value: category.id,
              label: category.name,
            }))}
            value={values.categoryId}
            name="categoryId"
          />
          {touched.categoryId && errors.categoryId && (
            <div className="error-message">{errors.categoryId}</div>
          )}
        </div>
        <div className="flex-1 ">
          <InputField
            label="Name Your Creation*"
            name="name"
            type="TEXT"
            placeholder="Enter Name"
            onChange={handleChange}
            value={values.name}
            className="flex-1-creation"
          />
          {(touched.name || values.name) && errors.name && (
            <div className="error-message">{errors.name}</div>
          )}
        </div>
      </div>
      <div
        className={`d-flex align-items-end justify-content-evenly gap-3 mt-4 create-asset-select-catalog${
          touched.catalogueId && errors.catalogueId ? 'align-items-center' : ''
        }`}
      >
        <div className="flex-1">
          <CustomSelect
            label="Choose Catalog*"
            className="wizard-form-select"
            placeholder="Select Catalog"
            onChange={handleSelectChange}
            options={catalogueOptions}
            name="catalogueId"
            value={values.catalogueId}
          />
          {touched.catalogueId && errors.catalogueId && (
            <div className="error-message">{errors.catalogueId}</div>
          )}
        </div>
        <p className="or-text">OR</p>
        <div className="flex-1">
          <div className="catalog-container">
            <Button
              isGradient
              className="custom-class"
              type="button"
              onClick={toggleModal}
              element={
                <div className="d-flex align-items-center gap-2">
                  <PlusIcon className="hover-plus-icon" />
                  <span>Create new catalog</span>
                </div>
              }
            />
            <GenericModal
              show={showCatalogModal}
              onHide={toggleModal}
              title="Create a New Catalog"
              body={
                <CreateCatalog
                  toggleModal={toggleModal}
                  setCatalogueId={setCatalogueId}
                />
              }
              className="create-new-catalog"
              close={true}
              backdrop="static"
            />
          </div>
        </div>
      </div>
      <div style={{ marginTop: '16px' }}>
        <GenericTextArea
          label="Description*"
          name="description"
          value={values.description}
          onChange={handleChange}
          placeholder="Enter Description..."
          rows={4}
        />
        {(touched.description || values.description) && errors.description && (
          <div className="error-message">{errors.description}</div>
        )}
      </div>
      <Row style={{ marginTop: '35px' }}>
        <Col>
          <div className="gradient-button">
            <Button
              isFilled
              type="submit"
              disabled={!isValid || sizeError || errorThumbnail}
              isGradient={isValid}
              className={`${isValid ? '' : 'disabled-btn'}`}
              element={
                <div className="d-flex align-items-center">
                  <span className={`${!isValid && 'text-white'}`}>Next</span>
                  <Image src={ArrowCircleRightImg} alt="" className="ms-2" />
                </div>
              }
            />
            <div className="save-draft-label" onClick={saveAsDraft}>
              Save as draft
            </div>
          </div>
        </Col>
      </Row>
    </form>
  );
};

export default StepOne;
