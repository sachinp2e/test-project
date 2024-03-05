import React, {useEffect, useMemo, useState} from 'react';
import { Col, Row } from 'react-bootstrap';
import * as Yup from 'yup';
import Image from 'next/image';
import RadioGroup from '@/Components/RadioButton';
import { useFormik } from 'formik';
import SelectModal from './selectModal';
import GenericTextArea from '@/Components/textarea';
import Button from '@/Components/Button';
import ArrowCircleRightImg from '../../Assets/_images/arrow-circle-right.svg';
import { CreateAssetFormDataType } from '@/Containers/createAssets/types';
import { assetTypes } from '@/Containers/createAssets/utils';
import InputField from '@/Components/Input/Input';

interface IStepTwoProps {
  formData: CreateAssetFormDataType;
  updateFormData: (newValues: Partial<CreateAssetFormDataType>) => void;
  onNext: () => void;
  onPrevious: () => void;
  onDraftAsset: (values: Partial<CreateAssetFormDataType>) => void;
}

const validationSchema = Yup.object().shape({
  physicalAsset: Yup.boolean(),
  properties: Yup.string().optional(),
  physicalAssetDescription: Yup.string().when('physicalAsset',
    ([physicalAsset]: boolean[]) => {
      if (physicalAsset) return Yup.string().required('Description is required');
      return Yup.string();
    }
  ),
  totalSupply: Yup.number().when('isMultiple',
    ([isMultiple]: boolean[]) => {
      if (isMultiple) return Yup.number().required('No. of copies is required').typeError('No. of copies must be a number').min(2, 'No. of copies must be greater than 1').max(1000, 'No. of copies must be less than 1000');
      return Yup.number().typeError('No. of copies must be a number').nullable();
    }
  )
});

interface InputField {
  id: number;
  key: string;
  value: string;
}

const StepTwo: React.FC<IStepTwoProps> = (props) => {
  const { formData, updateFormData, onNext, onDraftAsset } = props;
  const [inputFields, setInputFields] = useState<InputField[]>([{ id: 1, key: '', value: '' }]);

  const initialValues = useMemo(() => {
    const initialValues: Partial<CreateAssetFormDataType> = {
      physicalAsset: formData.physicalAsset,
      physicalAssetDescription: formData.physicalAssetDescription || '',
      properties: formData.properties || '{}',
      isMultiple: formData.isMultiple,
      totalSupply: formData.totalSupply,
    };
    return initialValues;
  }, [formData]);

  const onFormSubmit = (values: Partial<CreateAssetFormDataType>) => {
    updateFormData({...values,...arrayToObject()});
    if (isValid) onNext();
  };

  const {
    handleSubmit,
    values,
    handleChange,
    setFieldValue,
    errors,
    validateForm,
    touched,
    isValid,
  } = useFormik({
    initialValues,
    onSubmit: onFormSubmit,
    validationSchema,
  });

  const arrayToObject = () => {
    const transformedObject = inputFields.reduce((acc:any, field) => {
      if (field.key !== undefined && field.value !== undefined) {
        acc[field.key] = field.value;
      }
      return acc;
    }, {});
    return { "properties": JSON.stringify(transformedObject) };
  };

  useEffect(() => {
    validateForm();
  }, []);

  const onRadioChange = (selectedOption: string) => {
    setFieldValue('physicalAsset', selectedOption === 'physicalAsset');
  };

  const saveAsDraft = () => {
    onDraftAsset(values);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="step-two-container">
        <Row>
          <Col>
            <div className="radio-group-button">
              <RadioGroup
                label="Asset Type *"
                options={assetTypes}
                name="assetType"
                value={values.physicalAsset ? 'physicalAsset' : 'digitalAsset'}
                onChange={onRadioChange}
              />
            </div>
          </Col>
          <Col>
            <SelectModal inputFields={inputFields} setInputFields={setInputFields} />
          </Col>
        </Row>

        {/* Hidden for now as we are not showing the physical asset */}
        {/* <Row>
          <GenericTextArea
            label={values.physicalAsset ? 'Description of physical asset *' : 'Description of physical asset'}
            className="genericTextArea"
            name="physicalAssetDescription"
            placeholder="Enter description of physical asset"
            onChange={handleChange}
            disabled={!values.physicalAsset}
            value={values.physicalAsset ? values.physicalAssetDescription: ''}
          />
          {touched.physicalAssetDescription && errors.physicalAssetDescription && (
            <div className="error-message">{errors.physicalAssetDescription}</div>
          )}
        </Row> */}
        {
          values.isMultiple && (
            <Row>
              <Col md={6} className="mt-4">
                <InputField
                  type="TEXT"
                  name="totalSupply"
                  label="Total no. of copies *"
                  placeholder="Enter Copies"
                  className="number-of-asset-input"
                  value={values.totalSupply}
                  onChange={handleChange}
                  spanText="Max 1000 copies allowed"
                />
                {touched.totalSupply && errors.totalSupply && (
                  <div className="error-message">{errors.totalSupply}</div>
                )}
              </Col>
            </Row>
          )
        }

        <div className="d-flex align-items-center justify-content-between">
          <div className="button-group">
            <Button
              isGradient
              onClick={props.onPrevious}
              text="Back"
            />
            <Button
              isGradient
              isFilled
              // disabled={Object.keys(errors).length > 0}
              text="Next"
              type="submit"
              element={(
                <div className="d-flex align-items-center">
                  <span className="me-2">Next</span>
                  <Image src={ArrowCircleRightImg} alt="arrow" />
                </div>
              )}
            />
          </div>
          <div className="save-draft-label" onClick={saveAsDraft}>
            Save as draft
          </div>
        </div>
      </div>
    </form>
  );
};

export default StepTwo;
