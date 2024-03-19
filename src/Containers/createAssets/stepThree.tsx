'use client';
import React, { useMemo } from 'react';
import { Col, Form as Radio, Row } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import Button from '@/Components/Button';
import RadioGroup from '@/Components/RadioButton';
import { FixedPrice, TimedAuction } from '@/Assets/svg';
import InputField from '@/Components/Input/Input';
import SelectInput from './selectInput';
import CustomSelect, { IOption } from '@/Components/CustomSelect';
import { CreateAssetFormDataType } from '@/Containers/createAssets/types';
import { useAppSelector } from '@/Lib/hooks';
import { getAllCurrenciesSelector } from '@/Lib/currencies/currencies.selector';
import { getAllAssetsSelector } from '@/Lib/assets/assets.selector';

interface IStepThreeProps {
  formData: CreateAssetFormDataType;
  updateFormData: (newValues: Partial<CreateAssetFormDataType>) => void;
  onFinish: (values: Partial<CreateAssetFormDataType>) => void;
  onPrevious: () => void;
  globalError: string;
  onDraftAsset: (values: Partial<CreateAssetFormDataType>) => void;
}

export const assetValidationSchema = Yup.object().shape({
  putOnMarketplace: Yup.boolean().required('Put on Marketplace is required'),
  isMultiple: Yup.boolean(),
  orderType: Yup.string().when(['putOnMarketplace'], (values, field) => {
    if (values[0]) {
      return field.required('Asset Type is required');
    }
    return field;
  }),
  price: Yup.number()
    .optional()
    .typeError('price must be a number')
    .when(['putOnMarketplace', 'orderType'], (values, field) => {
      if (values[0] && values[1] === 'fixed') {
        return field.positive().required('Price is required');
      }
      return field;
    }),
  currencyId: Yup.string().when(['putOnMarketplace'], (values, field) => {
    if (values[0]) {
      return field.required('Please select currency');
    }
    return field;
  }),
  royalty: Yup.number()
    .optional()
    .typeError('Royalty must be a number')
    .min(0, 'royalty must be greater than or equal to 0')
    .max(10, 'royalty must be less than or equal to 10'),
  bidEndDate: Yup.string().when(
    ['putOnMarketplace', 'orderType'],
    (values, field) => {
      if (values[0] && values[1] === 'timed') {
        return field.required('Bid End Date is required');
      }
      return field;
    },
  ),
  onSaleSupply: Yup.number().when(
    ['putOnMarketplace', 'isMultiple'],
    (values, field) => {
      if (values[0] && values[1]) {
        return field
          .positive('number of asset must be a positive number')
          .required('Number of assets copy required');
      }
      return field.nullable();
    },
  ),
  minBid: Yup.number()
    .typeError('Minimum Bid must be a number')
    .when(['putOnMarketplace', 'orderType'], (values, field) => {
      if (values[0] && values[1] === 'timed') {
        return field.positive().required('Min Bid is required');
      }
      return field;
    }),
});

export const getBidExpirationDays = (bidEndDate?: string) => {
  if (!bidEndDate) return '';
  const daysDifference = dayjs(bidEndDate).diff(dayjs(), 'day') + 1;
  if (daysDifference === 7) return '7';
  if (daysDifference === 5) return '5';
  if (daysDifference === 3) return '3';
  return '';
};
const StepThree: React.FC<IStepThreeProps> = ({
  formData,
  updateFormData,
  onFinish,
  onPrevious,
  globalError,
  onDraftAsset,
}) => {
  const { currencies } = useAppSelector(getAllCurrenciesSelector);
  const { loading } = useAppSelector(getAllAssetsSelector);

  const onFormSubmit = (values: Partial<CreateAssetFormDataType>) => {
    const usdCurrency = currencies.find(
      (currency) => currency.isoCode === 'USD',
    );
    onFinish({ ...values, currencyId: usdCurrency.id || values.currencyId });
  };

  const initialValues = useMemo(() => {
    const initialValues: Partial<CreateAssetFormDataType> = {
      isMultiple: formData.isMultiple,
      putOnMarketplace: formData.putOnMarketplace,
      orderType: formData.orderType,
      price: formData.price,
      royalty: formData.royalty,
      minBid: formData.minBid,
      bidStartDate: formData.bidStartDate,
      bidEndDate: formData.bidEndDate,
      currencyId: formData.currencyId || currencies[0]?.id,
      onSaleSupply: formData.onSaleSupply,
    };
    return initialValues;
  }, [formData]);

  const {
    handleSubmit,
    setFieldValue,
    values,
    handleChange,
    errors,
    validateForm,
    touched,
  } = useFormik({
    initialValues,
    onSubmit: onFormSubmit,
    validationSchema: assetValidationSchema,
  });

  const handlePutOnSaleChange = (selectedOption: string) => {
    setFieldValue('putOnMarketplace', selectedOption === 'yes');
  };

  const handleMarketplaceTypeChange = async (selectedOption: string) => {
    setFieldValue('bidEndDate', '');
    setFieldValue('minBid', '');
    setFieldValue('price', '');
    setFieldValue('orderType', selectedOption);
    await validateForm();
  };

  const handleBidExpirationDateChange = (
    _: string,
    selectedOption: IOption,
  ) => {
    switch (selectedOption.value) {
      case '7':
        setFieldValue(
          'bidEndDate',
          dayjs().add(7, 'day').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        );
        break;
      case '5':
        setFieldValue(
          'bidEndDate',
          dayjs().add(5, 'day').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        );
        break;
      case '3':
        setFieldValue(
          'bidEndDate',
          dayjs().add(3, 'day').format('YYYY-MM-DDTHH:mm:ss.SSSZ'),
        );
        break;
      default:
        break;
    }
  };

  const handleCurrencyChange = (_: string, selectedOption: IOption) => {
    setFieldValue('currencyId', selectedOption.value);
  };

  const saveAsDraft = () => {
    onDraftAsset(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="step-two-container step-three">
        <Row>
          <div className="radio-group-button">
            <RadioGroup
              label="Put on Sale"
              name="assetType"
              options={[
                { id: 1, value: 'yes', label: 'Yes' },
                { id: 2, value: 'no', label: 'No' },
              ]}
              onChange={handlePutOnSaleChange}
              value={values.putOnMarketplace ? 'yes' : 'no'}
            />
          </div>
        </Row>

        <Row className="label-container">
          <Col>
            <label
              className={`LabelType ${
                values.putOnMarketplace && values.orderType === 'fixed'
                  ? 'active'
                  : ''
              }`}
              id="label-type"
            >
              <FixedPrice />
              {values.putOnMarketplace && (
                <Radio.Check
                  type="radio"
                  className="button-label"
                  name="label-type"
                  onChange={() => handleMarketplaceTypeChange('fixed')}
                  checked={values.orderType === 'fixed'}
                />
              )}
              <label htmlFor="">Fixed Price</label>
            </label>
          </Col>

          {!formData.isMultiple && (
            <Col>
              <label
                className={`LabelType ${
                  values.putOnMarketplace && values.orderType === 'timed'
                    ? 'active'
                    : ''
                }`}
                id="label-type"
              >
                <TimedAuction />
                {values.putOnMarketplace && (
                  <Radio.Check
                    type="radio"
                    className="button-label"
                    name="label-type"
                    checked={values.orderType === 'timed'}
                    onChange={() => handleMarketplaceTypeChange('timed')}
                  />
                )}
                <label htmlFor="">Timed Auction</label>
              </label>
            </Col>
          )}
        </Row>
        <Row className="input-container">
          {values.putOnMarketplace && (
            <Col md={6}>
              <SelectInput
                placeholder="Select"
                label={
                  values.orderType === 'timed' ? 'Minimum Bid *' : 'Price *'
                }
                name={values.orderType === 'timed' ? 'minBid' : 'price'}
                options={currencies.map((currency) => ({
                  id: currency.id,
                  value: currency.id,
                  label: currency.isoCode,
                }))}
                labelTwo="Service fee: 2.5%"
                dropdownValue={values.currencyId || ''}
                value={
                  values.orderType === 'timed' ? values.minBid : values.price
                }
                handleChange={handleChange}
                handleCurrencyChange={handleCurrencyChange}
              />
              {(touched.price || values.price) && errors.price && (
                <div className="error-message">{errors.price}</div>
              )}
              {(touched.minBid || values.minBid) && errors.minBid && (
                <div className="error-message">{errors.minBid}</div>
              )}
              {(touched.currencyId || values.currencyId) &&
                errors.currencyId && (
                  <div className="error-message">{errors.currencyId}</div>
                )}
            </Col>
          )}
          <Col md={6}>
            <InputField
              type="TEXT"
              name="royalty"
              label="Royalties (optional)"
              spanText="Maximum is 10%"
              placeholder="Enter Royalties (Eg. 10%)"
              className="royalties-input"
              value={values.royalty}
              onChange={handleChange}
            />
            {(touched.royalty || values.royalty) && errors.royalty && (
              <div className="error-message">{errors.royalty}</div>
            )}
          </Col>
        </Row>

        {values.putOnMarketplace && values.orderType === 'timed' && (
          <Row className="bid-expire">
            <Col>
              <CustomSelect
                label="Auction Expiration *"
                className="bid-expire-select"
                placeholder="Select Bid Expiration"
                onChange={handleBidExpirationDateChange}
                options={[
                  { id: 1, value: '7', label: 'In 7 days' },
                  { id: 2, value: '5', label: 'In 5 days' },
                  { id: 3, value: '3', label: 'In 3 days' },
                ]}
                name="bidEndDate"
                value={getBidExpirationDays(values.bidEndDate)}
              />
            </Col>
            <Col></Col>
          </Row>
        )}

        {formData.isMultiple && values.putOnMarketplace && (
          <Row className="input-container">
            <Col>
              <InputField
                type="TEXT"
                name="onSaleSupply"
                label="Number of Asset Copies on sale"
                placeholder="Enter Copies"
                className="number-of-asset-input"
                value={values.onSaleSupply}
                onChange={handleChange}
              />
            </Col>
            {errors.onSaleSupply && (
              <div className="error-message">{errors.onSaleSupply}</div>
            )}
          </Row>
        )}

        {globalError && <div className="global-error mt-3">{globalError}</div>}

        <div className={`button-group ${globalError ? 'mt-4' : ''}`}>
          <div className="group-button">
            <Button
              isGradient
              onClick={async () => {
                await updateFormData(values);
                onPrevious();
              }}
              text="Back"
            />
            <Button
              name="create-asset"
              isGradient
              isFilled
              disabled={
                Object.keys(errors).length > 0 && values.putOnMarketplace
              }
              text="Create Asset"
              isLoading={loading}
              type="submit"
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

export default StepThree;
