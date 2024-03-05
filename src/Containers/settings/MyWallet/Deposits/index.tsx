import React, { useEffect } from 'react';
import CustomTable from '../../../../Components/Table';
import { useAppDispatch, useAppSelector } from '../../../../Lib/hooks';
import { settingsSelector } from '../../../../Lib/settings/settings.selector';
import '../style.scss';
import { getWalletTransactions } from '@/Lib/wallet/wallet.action';
import { walletSelector } from '@/Lib/wallet/wallet.selector';
import dayjs from 'dayjs';

interface IDepositsTable {}

const DepositsTable: React.FC<IDepositsTable> = () => {
  const dispatch = useAppDispatch();
  const { walletBalance, depositedTransactions, isLoading } = useAppSelector(walletSelector);
  
  useEffect(() => {
    dispatch(getWalletTransactions({ type: 'deposit' }));    
  }, [walletBalance])

  const columns = [
    {
      id: '1',
      label: 'Amount Added',
      value: 'amount',
      className: 'th-right-border',
      renderCell: (row: any) => <span>${row.amount}</span>,
    },
    {
      id: '2',
      label: 'Date/Time',
      value: 'dateTime',
      renderCell: (row: any) => (
        <span>{dayjs(row?.createdDate).format('DD MMM YYYY, HH:mm')}</span>
      ),
      className: 'th-right-border',
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
    // {
    //   id: '4',
    //   label: 'Status',
    //   value: 'status',
    //   renderCell: (row: any) => (
    //     <span
    //       className={`${
    //         row.status === 'SUCCESS'
    //           ? '_success'
    //           : row.status === 'FAILED'
    //             ? '_failed'
    //             : row.status === 'In process'
    //               ? '_inProcess'
    //               : ''
    //       }`}
    //     >
    //       {row.status === 'Failed' ? (
    //         <span className="d-flex align-items-center gap-1">
    //           {row.status}
    //           <Info />
    //         </span>
    //       ) : (
    //         row.status
    //       )}
    //     </span>
    //   ),
    // },
  ];

  return (
    <>
      <CustomTable
        columns={columns}
        data={depositedTransactions}
        loading={isLoading}
        className="thead-wrapper"
      />
    </>
  );
};

export default DepositsTable;
