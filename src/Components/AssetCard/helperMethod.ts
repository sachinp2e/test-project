export type CardType = 'SINGLE_SALE' | 'SINGLE_BID' | 'SINGLE_OFFER' | 'MULTIPLE_SALE' | 'MULTIPLE_BID' | 'MULTIPLE_OFFER';

export enum cardTypeEnum {
  SINGLE_SALE = 'SINGLE_SALE',
  SINGLE_BID = 'SINGLE_BID',
  SINGLE_OFFER = 'SINGLE_OFFER',
  MULTIPLE_SALE = 'MULTIPLE_SALE',
  MULTIPLE_BID = 'MULTIPLE_BID',
  MULTIPLE_OFFER = 'MULTIPLE_OFFER',
}

export const getCardType = (item: any): CardType => {
  if (item.putOnMarketplace && item.orderType === 'fixed' && !item.isMultiple) {
    return cardTypeEnum.SINGLE_SALE;
  }
  if (item.putOnMarketplace && item.orderType === 'timed' && !item.isMultiple) {
    return cardTypeEnum.SINGLE_BID;
  }
  if (!item.putOnMarketplace && item.orderType === 'none' && !item.isMultiple) {
    return cardTypeEnum.SINGLE_OFFER;
  }
  if (item.putOnMarketplace && item.orderType === 'fixed' && item.isMultiple) {
    return cardTypeEnum.MULTIPLE_SALE;
  }
  if (item.putOnMarketplace && item.orderType === 'timed' && item.isMultiple) {
    return cardTypeEnum.MULTIPLE_BID;
  }
  if (!item.putOnMarketplace && item.orderType === 'none' && item.isMultiple) {
    return cardTypeEnum.MULTIPLE_OFFER;
  }
  return cardTypeEnum.SINGLE_SALE;
};
