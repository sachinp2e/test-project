import React, { useCallback, useState } from 'react';
import Image from 'next/image';
import MediaUploadButton from '@/Components/Fileupload';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import InputField from '@/Components/Input/Input';
import GenericTextArea from '@/Components/textarea';
import Button from '@/Components/Button';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import ArrowCircleRightImg from '../../../Assets/_images/arrow-circle-right.svg';
import { addCatalog } from '@/Lib/catalogs/catalogs.action';
import './create-catalog.scss';
import { getAllCatalogsSelector } from '@/Lib/catalogs/catalogs.selector';
import { addNewCatalog } from '@/Lib/users/users.slice';
import { toastErrorMessage } from '@/utils/constants';

type CreateCatalogFormDataType = {
  name: string;
  symbol: string;
  description: string;
  shortUrl: string;
  media: File | null;
};

interface ICreateCatalogProps {
  toggleModal: () => void;
  setCatalogueId: (id: string) => void;
}

const initialValues: CreateCatalogFormDataType = {
  name: '',
  symbol: 'symbol',
  description: '',
  shortUrl: '',
  media: null,
};

const validationSchema = Yup.object().shape({
  name: Yup.string().trim()
  .max(30, "Name must not exceed 30 characters")
  .matches(/^[a-zA-Z].*/, 'Invalid name')
  .required('Name is required'),
  symbol: Yup.string().required('Symbol is required'),
  description: Yup.string().trim()
  .min(4, 'Description must be at least 4 characters')
  .max(160, 'description must not exceed 160 characters')
  .required('Description is required'),
  shortUrl: Yup.string()
    .matches(/^[a-z0-9_-]+$/,  'Invalid URL format. Only lowercase alphanumeric characters, hyphens, and underscores are allowed.')
    .notRequired(),
  media: Yup.mixed()
    .required('Media is required')
    .test(
      'is-valid-type',
      'Not a valid image type',
      (value: any) =>
        ['jpg', 'png', 'gif', 'webp'].indexOf(
          (value && value.name.toLowerCase()).split('.').pop() || '',
        ) > -1,
    )
    .test(
      'is-valid-size',
      'Max allowed size is 5MB',
      (value: any) => value && value.size <= 5 * 1024 * 1024,
    ),
});

const CreateCatalog: React.FC<ICreateCatalogProps> = ({
  toggleModal,
  setCatalogueId,
}) => {
  const dispatch = useAppDispatch();
  const {
    catalogsData: { addCatalogLoading },
  } = useAppSelector(getAllCatalogsSelector);

  const [commonError, setCommonError] = useState<string | null>(null);

  const {
    setFieldValue,
    values,
    isValid,
    touched,
    errors,
    handleChange,
    setFieldError,
    handleSubmit,
  } = useFormik<CreateCatalogFormDataType>({
    // validateOnMount: true,
    initialValues,
    onSubmit: async (values: CreateCatalogFormDataType) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('symbol', values.symbol);
      formData.append('description', values.description);
      if(values.shortUrl)formData.append('shortUrl', values.shortUrl);
      formData.append('media', values.media as Blob);
      await dispatch(
        addCatalog({
          payload: formData,
          cb: ({ status, result, error }) => {
            if (status === 200) {
              toggleModal();
              dispatch(addNewCatalog(result));
              setCatalogueId(result.id);
            } else if (error.customErrorNumber === 100302) {
              setCommonError(null)
              setFieldError('shortUrl', error.message);
            } else if (error.customErrorNumber === 1003015) {
              setCommonError(null)
              setFieldError('name', error.message);
            }else if (error.customErrorNumber === 1003014) {
              setCommonError(error.message)
            } else if (error.customErrorNumber === -2) {
              setCommonError(null)
              setFieldError(error.errorfields,error.message)
            }else if (error.success === false) {
              setCommonError(error.response);
            }
          },
        }),
      );
    },
    validationSchema,
  });

  const handleMediaSelect = useCallback((_: string, file: File) => {
    setFieldValue('media', file);
  }, []);

  return (
    <div className="create-catalog-container">
      <form onSubmit={handleSubmit}>
        <>
          <MediaUploadButton
            buttonLabel="Upload Photo"
            onFileSelect={handleMediaSelect}
            accept="image/*, .pdf, .doc, .docx"
            htmlFor="catalogMedia"
            value={values.media}
            isPreview={true}
          />
          <span className="upload-info">
            Supported formats - JPG, PNG, GIF. Max size 5mb
          </span>
          {(touched.media || values.media) && errors.media && (
            <div className="error-message">{errors.media}</div>
          )}
        </>

        <InputField
          label="Name Your Catalog*"
          name="name"
          className="margin-top-input"
          type="TEXT"
          placeholder="Enter Name"
          value={values.name}
          onChange={handleChange}
        />
        {(touched.name || values.name) && errors.name && (
          <div className="error-message">{errors.name}</div>
        )}

        <GenericTextArea
          className="margin-top-input"
          label="Description*"
          name="description"
          placeholder="Enter Description..."
          rows={4}
          value={values.description}
          onChange={handleChange}
        />
        {(touched.description || values.description) && errors.description && (
          <div className="error-message">{errors.description}</div>
        )}

        <InputField
          label="Short URL"
          name="shortUrl"
          className="margin-top-input"
          type="TEXT"
          placeholder="Enter Short URL"
          value={values.shortUrl}
          onChange={handleChange}
        />
        {(touched.shortUrl || values.shortUrl) && errors.shortUrl && (
          <div className="error-message">{errors.shortUrl}</div>
        )}

        {
          commonError && <div className="global-error mt-4">{commonError}</div>
        }

        <div className="gradient-button mt-4">
          <Button
            isGradient
            isFilled
            disabled={!isValid}
            isLoading={addCatalogLoading}
            element={
              <div className="d-flex align-items-center">
                <span className="me-2">Create Catalog</span>
                <Image src={ArrowCircleRightImg} alt="arrow" />
              </div>
            }
            type="submit"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateCatalog;
