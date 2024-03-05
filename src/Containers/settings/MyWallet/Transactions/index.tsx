import React, { useEffect } from 'react';
import CustomTable from '../../../../Components/Table';
import { useAppDispatch, useAppSelector } from '../../../../Lib/hooks';
import '../style.scss';
import { walletSelector } from '@/Lib/wallet/wallet.selector';
import { getWalletTransactions } from '@/Lib/wallet/wallet.action';
import dayjs from 'dayjs';

interface ITransactionsTable {}

const TransactionsTable: React.FC<ITransactionsTable> = () => {
  const dispatch = useAppDispatch();
  const { walletTransactions, isLoading } = useAppSelector(walletSelector);
  const { walletBalance } = useAppSelector(walletSelector);
  
  useEffect(() => {
    dispatch(getWalletTransactions({ type: 'transaction' }));    
  }, [walletBalance])

  const columns = [
    {
      id: '1',
      label: 'Asset Name',
      value: 'assetname',
      className: 'th-right-border',
      renderCell: (row: any) => (
        <span>
          {(row?.assetID.length > 15 ? row?.assetID?.slice(0, 15) + '...' : row?.assetID) || "-" }
        </span>
      ),
    },
    {
      id: '2',
      label: 'Credit/Debit',
      value: 'credit',
      className: 'th-right-border',
      renderCell: (row: any) => (
        <div className={row?.transactionType}>${row?.amount}</div>
      ),
    },
    // {
    //   id: '3',
    //   label: 'Type',
    //   value: 'type',
    //   className: 'th-right-border',
    //   renderCell: (row: any) => <div>{row?.orderType || '-'}</div>,
    // },
    {
      id: '4',
      label: 'Updated Balance',
      value: `walletBalance`,
      className: 'th-right-border',
      renderCell: (row: any) => (
        <span>${row?.walletBalance}</span>
      ),
    },
    {
      id: '5',
      label: 'Date/Time',
      value: 'dateTime',
      minWidth: '152px',
      renderCell: (row: any) => (
        <p>{dayjs(row?.createdDate).format('DD MMM YYYY, HH:mm')}</p>
      ),
      className: 'th-right-border',
    },
    {
      id: '6',
      label: 'Transaction ID',
      value: 'transactionNumber',
      className: 'th-right-border',
      renderCell: (row: any) => (
        <span>
          {row.transactionNumber.slice(0, 7) +
            '...' +
            row.transactionNumber.slice(-7)}
        </span>
      ),
    },
    {
      id: '7',
      label: <div>Status</div>,
      value: 'status',
      renderCell: (row: any) => (
        <span
          className={`${
            row.status === 'SUCCESS'
              ? '_success'
              : row.status === 'FAILED'
                ? '_failed px-4'
                : row.status === 'PENDING'
                  ? '_pending px-3'
                  : ''
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <>
      <CustomTable
        columns={columns}
        data={walletTransactions}
        className="thead-wrapper"
        loading={isLoading}
      />
    </>
  );
};

export default TransactionsTable;
