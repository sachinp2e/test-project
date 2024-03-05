export const assetTypes = [
  { label: 'Digital Asset', value: 'digitalAsset' },
  // { label: 'Physical Asset', value: 'physicalAsset' },
];

export const getBorderStyle = (activeStep: number) => {
  if (activeStep !== 3) {
    return {
      backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23ADADADFF' stroke-width='7' stroke-dasharray='5%2c 20' stroke-dashoffset='32' stroke-linecap='square'/%3e%3c/svg%3e")`,
    };
  } else {
    return { border: '1px solid #999' };
  }
};

export const getBorderStyleOne = (activeStep: number) => {
  if (activeStep !== 2) {
    return { width: `0` };
  } else {
    return {
      width: `45%`,
      border: '1px solid #999',
    };
  }
};
