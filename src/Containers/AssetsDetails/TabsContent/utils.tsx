export enum ActivityAction {
  createdCatalogue = 'createdCatalogue',
  createdAsset = 'createdAsset',
  mintAsset = 'mintAsset',
  burnAsset = 'burnAsset',
  offerAccepted = 'offerAccepted',
  offerPlaced = 'offerPlaced',
  bidPlaced = 'bidPlaced',
  bidAccepted = 'bidAccepted',
  favouritedAsset = 'favouritedAsset',
  unfavouritedAsset = 'unfavouritedAsset',
  favouritedCatalogue = 'favouritedCatalogue',
  unfavouritedCatalogue = 'unfavouritedCatalogue',
  fixedTransfer = 'fixedTransfer',
  offerTransfer = 'offerTransfer',
  bidTransfer = 'bidTransfer',
  putOnMarketPlace = 'putOnMarketPlace',
  bidUpdated = 'bidUpdated',
  assetTransfer = 'assetTransfer',
  unfollowed = 'unfollowed',
};

export const getActivityMessages = (data: any) => {
  switch (data.activityAction) {
    case ActivityAction.createdCatalogue:
      return <span>Created catalogue{' '} <b>{data?.asset?.name}</b></span>;
    case ActivityAction.createdAsset:
      return <span>Created asset{' '} <b>{data?.asset?.name}</b></span>;
    case ActivityAction.mintAsset:
      return <span>Minted{' '} <b>{data?.asset?.name}</b></span>;
    case ActivityAction.burnAsset:
      return <span>Burned{' '} <b>{data?.asset?.name}</b></span>;
    case ActivityAction.offerAccepted:
      return <span>Offer accepted{' '} <b>{data?.asset?.name}</b></span>;
    case ActivityAction.offerPlaced:
      return <span>Offer placed{' '} <b>{data?.asset?.name}</b></span>;
    case ActivityAction.bidPlaced:
      return <span>Bid placed{' '} <b>{data?.asset?.name}</b></span>;
    case ActivityAction.bidAccepted:
      return <span>Bid accepted{' '} <b>{data?.asset?.name}</b></span>;
    case ActivityAction.favouritedAsset:
      return <span>Asset favourited {' '} <b>{data?.asset?.name}</b></span>;
    case ActivityAction.unfavouritedAsset:
      return <span>Asset unfavourited {' '} <b>{data?.asset?.name}</b></span>;
    case ActivityAction.favouritedCatalogue:
      return <span>Catalogue favourited {' '} <b>{data?.asset?.name}</b></span>;
    case ActivityAction.unfavouritedCatalogue:
      return <span>Catalogue unfavourited {' '} <b>{data?.asset?.name}</b></span>;
    case ActivityAction.fixedTransfer:
      return <span>Fixed transfer{' '} <b>{data?.asset?.name}</b></span>;
    case ActivityAction.offerTransfer:
      return <span>Offer transfer{' '} <b>{data?.asset?.name}</b></span>;
    case ActivityAction.bidTransfer:
      return <span>Bid transfer{' '} <b>{data?.asset?.name}</b></span>;
    case ActivityAction.putOnMarketPlace:
      return <span>Put on marketplace{' '} <b>{data?.asset?.name}</b></span>;
    case ActivityAction.bidUpdated:
      return <span>Bid updated{' '} <b>{data?.asset?.name}</b></span>;
    case ActivityAction.assetTransfer:
      return <span>Asset transfer{' '} <b>{data?.asset?.name}</b></span>;
    case ActivityAction.unfollowed:
      return <span>Unfollowed{' '} <b>{data?.asset?.name}</b></span>;
    default:
      return '';
  }
};

