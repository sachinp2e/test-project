import Button from '@/Components/Button';
import CustomSelect from '@/Components/CustomSelect';
import SelectInput from '../../createAssets/selectInput';
import React, { useEffect, useMemo, useState } from 'react';
import { ButtonGroup, Col, Row } from 'react-bootstrap';
import './make-offer.scss';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { getAllCurrenciesSelector } from '@/Lib/currencies/currencies.selector';
import { AssetDetailSelector } from '@/Lib/assetDetail/assetDetail.selector';
import * as yup from 'yup';
import dayjs from 'dayjs';
import axiosInstance from '@/Lib/axios';
import { toastErrorMessage, toastSuccessMessage } from '@/utils/constants';
import { PayoutWalletModal } from '../Checkout';
import { getAssetDetails } from '@/Lib/assetDetail/assetDetail.action';

const numberSchema = yup
  .string()
  .test(
    'is-numeric',
    'Invalid Offer price entered!',
    (value: any) => !isNaN(value),
  )
  .test(
    'is-positive',
    'Price can not be less than 0',
    (value: any) => value > 0,
  )
  .required('Price is required');

const MakeOffer = ({
  availableCopies,
  individualOwnerId,
  handleModalClose,
}: any) => {
  const dispatch = useAppDispatch();
  const { AssetDetails } = useAppSelector(AssetDetailSelector);
  const { currencies } = useAppSelector(getAllCurrenciesSelector);
  const [selectedValue, setSelectedValue] = useState<string>('7');
  const [selectedCurrency, setSelectedCurrency] = useState<string>('');
  const [offerPrice, setOfferPrice] = useState<string>('');
  const [isPayModal, setIsPayModal] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [selectedCopies, setSelectedCopies] = useState<number>(1);

  useEffect(() => {
    if (currencies.length && !selectedCurrency) {
      setSelectedCurrency(currencies[0].id);
    }
  }, [currencies]);
  const handleCurrencyChange = (e: any) => {
    setSelectedCurrency(e.target.value);
  };
  const handleOnchange = (option: any) => {
    setSelectedValue(option.value);
  };
  const handleOfferPriceChange = (e: any) => {
    setOfferPrice(e.target.value);
    numberSchema
      .validate(e.target.value || null)
      .then(() => {
        setError('');
      })
      .catch((error: any) => {
        setError(error.errors[0]);
      });
  };
  const handleInitiatePayment = () => {
    setIsPayModal(true);
  };
  const handleSubmit = async () => {
    if (!offerPrice) {
      return;
    }
    try {
      const payload: any = {
        assetId: AssetDetails?.id,
        offerAmount: offerPrice,
        offerCurrencyId: selectedCurrency,
        offerExpiry: dayjs().add(Number(selectedValue), 'days'),
        ownerId: individualOwnerId
          ? individualOwnerId
          : AssetDetails?.owner?.id,
      };
      if (AssetDetails?.isMultiple) {
        payload.supply = selectedCopies;
      }
      const response = await axiosInstance.post(
        '/offer/placeOfferOnAsset',
        payload,
      );
      toastSuccessMessage('Offer successfully Placed');
      dispatch(getAssetDetails(AssetDetails?.id));
      handleModalClose();
    } catch (error: any) {
      toastErrorMessage('Something went wrong, Please try again!.');
    } finally {
      setIsPayModal(false);
    }
  };

  const handleAddSubtract = (e: any) => {
    if (e.target.name === 'add' && selectedCopies < availableCopies) {
      setSelectedCopies((prev) => prev + 1);
    } else if (e.target.name === 'subtract' && selectedCopies > 1) {
      setSelectedCopies((prev) => prev - 1);
    }
  };

  const currencyOptions = useMemo(() => {
    if (currencies.length) {
      return currencies.map((currency: any) => ({
        id: currency.id,
        value: currency.id,
        label: currency.isoCode,
      }));
    }
    return [];
  }, [currencies]);
  return (
    <>
      {isPayModal ? (
        <div>
          <PayoutWalletModal
            amount={offerPrice}
            initiatePayment={handleSubmit}
          />
        </div>
      ) : (
        <form>
          <div className="make-offer-container">
            <Row>
              <Col md={6}>
                {currencies?.length > 0 && (
                  <SelectInput
                    type="TEXT"
                    label="Offer Price"
                    labelTwo=""
                    name="offerPrice"
                    value={offerPrice}
                    handleChange={handleOfferPriceChange}
                    options={currencyOptions}
                    dropdownValue={currencies[0]?.id}
                    handleCurrencyChange={() => handleCurrencyChange}
                  />
                )}
                {error && <p className="error-message">{error}</p>}
              </Col>
              <Col md={6}>
                <div className="select-date-container">
                  <CustomSelect
                    placeholder="In 7 days"
                    onChange={(_, value) => handleOnchange(value)}
                    options={[
                      { id: 1, value: '7', label: 'In 7 days' },
                      { id: 2, value: '5', label: 'In 5 days' },
                      { id: 3, value: '3', label: 'In 3 days' },
                    ]}
                    label="Offer Expiration"
                    name="days"
                    value={selectedValue}
                    className="make-offer"
                  />
                </div>
              </Col>
            </Row>
            {AssetDetails?.isMultiple && (
              <div className="d-flex justify-content-between align-items-center mt-3">
                <p>Select Quantity</p>
                <ButtonGroup>
                  <Button
                    text="-"
                    onClick={handleAddSubtract}
                    name="subtract"
                  />
                  <Button text={selectedCopies.toString()} />
                  <Button text="+" onClick={handleAddSubtract} name="add" />
                </ButtonGroup>
              </div>
            )}
          </div>

          <div className="offer-asset-name">
            <h2>Asset Details</h2>
            <div className="horizontal-rule" />
          </div>
          <div className="offer-asset-details">
            <div className="offer-left-content">
              <span>Asset Name</span>
              {AssetDetails?.isMultiple && <span>Quantity</span>}
              <span>Total Price deductible</span>
            </div>
            <div className="offer-left-content" style={{ textAlign: 'right' }}>
              <span>
                <b>{AssetDetails?.name}</b>
              </span>
              {AssetDetails?.isMultiple && (
                <span>
                  <b>{selectedCopies}</b>
                </span>
              )}
              <span>
                <p>{offerPrice} USD</p>
              </span>
            </div>
          </div>
          {/* <span className="offer-note">Note: Additional platform fees will be added to your offer price. </span> */}
          <div className="proceed-button">
            <Button
              isFilled
              isGradient
              text="Proceed"
              className="mt-4"
              onClick={handleInitiatePayment}
              disabled={!offerPrice || !!error}
            />
          </div>
        </form>
      )}
    </>
  );
};

export default MakeOffer;
