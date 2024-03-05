import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import { Col, Modal, Row, Form as Radio } from 'react-bootstrap';
import { getBidExpirationDays } from '@/Containers/createAssets/stepThree';
import {assetValidationSchema} from "../../createAssets/stepThree";
import { getAllCurrenciesSelector } from '@/Lib/currencies/currencies.selector';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { FixedPrice, TimedAuction } from '@/Assets/svg';
import SelectInput from '@/Containers/createAssets/selectInput';
import InputField from '@/Components/Input/Input';
import CustomSelect from '@/Components/CustomSelect';
import Button from '@/Components/Button';
import '@/Containers/createAssets/create-assets.scss';
import { AssetDetailSelector } from '@/Lib/assetDetail/assetDetail.selector';
import { putAssetOnSale } from '@/Lib/assetDetail/assetDetail.action';
import { toastErrorMessage, toastSuccessMessage } from '@/utils/constants';

type Props = {};

const PutOnSaleModal = (props: any) => {
  const { currencies }: any = useAppSelector(getAllCurrenciesSelector);
  const { loading, AssetDetails } = useAppSelector(AssetDetailSelector);
  const { showModal, toggleModal, isUnminTedCopiesAvailable, copiesAvailable } =
    props;
  const dispatch = useAppDispatch();
  const initialValues = {
    isMultiple: AssetDetails.isMultiple,
    putOnMarketplace: true,
    orderType: 'fixed',
    price: '',
    minBid: '',
    bidEndDate: '',
    currencyId: AssetDetails.currencyId,
    supply: '',
  };
  const {
    handleSubmit,
    setFieldValue,
    setFieldError,
    values,
    setValues,
    handleChange,
    errors,
    validateForm,
    isValid,
    touched,
  }: any = useFormik({
    validateOnMount: true,
    initialValues,
    validationSchema:assetValidationSchema,
    onSubmit: async (values: any) => {
      let payload = { ...values };
      if (isUnminTedCopiesAvailable) {
        const availableSupplyForCreator =
          AssetDetails?.availableSupply - AssetDetails?.onSaleSupply;
        if (availableSupplyForCreator < values.supply) {
          return toastErrorMessage('Count exceeded');
        }
      } else if (copiesAvailable && copiesAvailable < values.supply) {
        return toastErrorMessage('Count exceeded');
      }

      if (values?.orderType === 'timed') {
        payload = {
          ...payload,
          bidStartDate: dayjs().toISOString(),
          minBid: Number(values.minBid),
        };
      }
      dispatch(putAssetOnSale({ ...payload, id: AssetDetails?.id })).then(
        (res) => {
          if (res?.payload?.status === 200) {
            toastSuccessMessage(
              'Congratulations! Your Asset has been put on sale successfully',
            );
            handleClose();
          }
        },
      );
    },
  });

  useEffect(() => {
    if (currencies.length && !values.currencyId) {
      setFieldValue('currencyId', currencies[0].id);
    }
  }, [currencies]);

  const handleClose = () => {
    toggleModal(false);
    setValues(initialValues);
  };

  const handleMarketplaceTypeChange = async (selectedOption: string) => {
    if (selectedOption === 'fixed') {
      setFieldValue('bidEndDate', '');
      setFieldValue('minBid', '');
    } else if (selectedOption === 'timed') {
      setFieldValue('price', '');
      setFieldValue('minBid', '');
    }
    await setFieldValue('orderType', selectedOption);
    await validateForm();
  };

  const handleBidExpirationDateChange = (_: string, selectedOption: any) => {
    switch (selectedOption.value) {
      case '7':
        setFieldValue('bidEndDate', dayjs().add(7, 'day').toISOString());
        break;
      case '5':
        setFieldValue('bidEndDate', dayjs().add(5, 'day').toISOString());
        break;
      case '3':
        setFieldValue('bidEndDate', dayjs().add(3, 'day').toISOString());
        break;
      default:
        break;
    }
  };

  const handleCurrencyChange = (_: string, selectedOption: any) => {
    setFieldValue('currencyId', selectedOption.value);
  };

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      backdrop="static"
      className="sale-modal"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Put On Sale</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <div className="step-two-container step-three">
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

              {!AssetDetails.isMultiple && (
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

            {values.putOnMarketplace && (
              <Row className="input-container">
                <Col md={6}>
                  <SelectInput
                    label={
                      values.orderType === 'timed' ? 'Minimum Bid *' : 'Price *'
                    }
                    name={values.orderType === 'timed' ? 'minBid' : 'price'}
                    options={currencies.map((currency: any) => ({
                      id: currency.id,
                      value: currency.id,
                      label: currency.isoCode,
                    }))}
                    labelTwo="Platform fee: 2.5%"
                    dropdownValue={values.currencyId || currencies[0]?.id}
                    value={
                      values.orderType === 'timed'
                        ? values.minBid
                        : values.price
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
                  {(touched.currencyId || values.currencyId) && errors.currencyId && (
                    <div className="error-message">{errors.currencyId}</div>
                  )}
                </Col>
                {values.putOnMarketplace && values.orderType === 'timed' && (
                  <Col md={6} className="bid-expire">
                    <CustomSelect
                      label="Bid Expiration *"
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
                )}
              </Row>
            )}

            {AssetDetails.isMultiple && values.putOnMarketplace && (
              <Row className="input-container">
                <Col>
                  <InputField
                    type="TEXT"
                    name="supply"
                    label="Number of Asset Copies on sale"
                    placeholder="Enter Copies"
                    className="number-of-asset-input"
                    value={values.supply}
                    onChange={handleChange}
                  />
                </Col>
                {errors.supply && (
                  <div className="error-message">{errors.supply}</div>
                )}
              </Row>
            )}

            {/* {globalError && (
              <div className="global-error mt-3">{globalError}</div>
            )} */}
            <div className="d-flex justify-content-center submit-btn">
              <Button
                name="create-asset"
                isGradient
                isFilled
                text="Confirm"
                disabled={Object.keys(errors).length > 0 && values.putOnMarketplace}
                // isLoading={loading}
                type="submit"
              />
            </div>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default PutOnSaleModal;
