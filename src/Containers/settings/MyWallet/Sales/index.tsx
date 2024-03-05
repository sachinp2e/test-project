import React from 'react';
import CustomTable from '../../../../Components/Table';
import { useAppDispatch, useAppSelector } from '../../../../Lib/hooks';
import useEffectOnce from '../../../../Hooks/useEffectOnce';
import '../style.scss';
import { walletSelector } from '@/Lib/wallet/wallet.selector';
import { getWalletTransactions } from '@/Lib/wallet/wallet.action';
import dayjs from 'dayjs';

interface ISalesTable {}

const SalesTable: React.FC<ISalesTable> = () => {
  const dispatch = useAppDispatch();
  const { saleTransactions, isLoading } = useAppSelector(walletSelector);
  useEffectOnce(() => {
    dispatch(getWalletTransactions({ type: 'sale' }));
  });

  const filterSalesTransactions = () => {
    if (!!saleTransactions.length) {
      return saleTransactions.filter(transaction => transaction.assetID)
    } else return [];
  }
  
  const columns = [
    {
      id: '1',
      label: 'Asset Name',
      value: 'assetID',
      className: 'th-right-border',
      renderCell: (row: any) => (
        <span>
          {row?.assetID.length > 25 ? row?.assetID?.slice(0, 25) + '...' : row?.assetID }
        </span>
      ),
    },
    {
      id: '2',
      label: 'Sale Price',
      value: 'amount',
      className: 'th-right-border',
      renderCell: (row: any) => (
        <span>
          ${row?.amount}
        </span>
      ),
    },
    {
      id: '3',
      label: 'Updated Balance',
      value: 'walletBalance',
      className: 'th-right-border',
      renderCell: (row: any) => (
        <span>
          ${row?.walletBalance}
        </span>
      ),
    },
    {
      id: '4',
      label: 'Date/Time',
      value: 'dateTime',
      renderCell: (row: any) => (
        <p>{dayjs(row?.createdDate).format('DD MMM YYYY, HH:mm')}</p>
      ),
    },
  ];

  return (
    <>
      <CustomTable
        columns={columns}
        data={filterSalesTransactions()}
        loading={isLoading}
        className="thead-wrapper"
      />
    </>
  );
};

export default SalesTable;
