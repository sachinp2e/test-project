import dayjs from "dayjs";

export const  offersObjHandler = (inputObject: any) => {
  let transformedObject: any = {
    ...inputObject,
    putOnMarketplace: false,
    offerStart: dayjs().toISOString(),
    orderType: 'none'
  };
  const keyMapping = {
    id: 'assetId',
    offerId: 'id',
    offerAmount: 'offerAmount',
    offerPrice: 'offerAmount',
    price: 'offerAmount',
    name: 'name',
    assetMediaUrl: 'assetMediaUrl',
    assetMediaUrl_resized: 'assetMediaUrl_resized'
  };
  Object.entries(keyMapping).forEach(([key, value]) => {
    if (key === 'name' || key === 'assetMediaUrl' || key === 'assetMediaUrl_resized') {
      transformedObject[key] = inputObject.asset[value];
    } else {
      transformedObject[key] = inputObject[value];
    }
  });
  return transformedObject;
};

export const bidsObjHandler = (inputObject: any) => {
  let transformedObject: any = {
      ...inputObject,
      putOnMarketplace: true,
      orderType: 'timed',
    };
    const keyMapping = {
      id: 'assetId',
      owner: 'assetOwner',
      bidEndDate: 'bidExpiry',
      name: 'name',
      assetMediaUrl: 'assetMediaUrl'
    };
    Object.entries(keyMapping).forEach(([key, value]) => {
      if (key === 'name' || key === 'assetMediaUrl') {
        transformedObject[key] = inputObject.asset[value];
      } else {
        transformedObject[key] = inputObject[value];
      }
    });
    return transformedObject;
  };

export  const draftsObjHandler = (inputObject: any) => {
    let transformedObject: any = {};
    const keyMapping = {
      assetMediaUrl_resized : 'assetMedia_resized',
      assetMediaUrl: 'assetMedia'
    };
    Object.entries(keyMapping).forEach(([key, value]) => {
        transformedObject[key] = inputObject[value];
    });
    return transformedObject;
  }
