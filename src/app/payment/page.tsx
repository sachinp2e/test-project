'use client';

import React, { useState } from 'react';
import Gateways from 'mai-payment-aggregator';
import { v4 as uuidv4 } from 'uuid';

type Props = {};

const Payment = (props: Props) => {
  const [transactionPayload, setTransactionPayload] = useState<any>(null);
  const userInfo = {
    name: 'sachin',
    email: 'sharma',
    phoneNumber: '7017284451',
    countryCode: 'IND',
    redirect_url: 'https://google.com',
  };

  const payload = {
    productId: uuidv4(),
    referenceNumber: uuidv4(),
    amount: 101,
    currencyCode: 'USD',
    paymentType: 'CARD',
    items: [
      {
        productName: 'PRODUCT_NAME',
        amount: 10,
      },
    ],
  };





  return (
    <div>
      
    </div>
  );
};

export default Payment;
