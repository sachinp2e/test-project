import React from 'react';
import Link from 'next/link';
import CustomTable from '../../../../Components/Table';
import { useAppDispatch, useAppSelector } from '../../../../Lib/hooks';
import { settingsSelector } from '../../../../Lib/settings/settings.selector';
import useEffectOnce from '../../../../Hooks/useEffectOnce';
import { getWithdrawals } from '../../../../Lib/settings/settings.action';
import { Info } from '../../../../Assets/svg';
import '../style.scss';
import { getWalletTransactions } from '@/Lib/wallet/wallet.action';
import { walletSelector } from '@/Lib/wallet/wallet.selector';

interface IWithdrawalsTable {}

const Withdrawals: React.FC<IWithdrawalsTable> = () => {
  const dispatch = useAppDispatch();
  const { withdrawals, loading } = useAppSelector(settingsSelector);
  const { withdrawlTransactions } = useAppSelector(walletSelector);

  useEffectOnce(() => {
    dispatch(getWalletTransactions({ type: 'withdrawl' }));
  });

  const columns = [
    {
      id: '1',
      label: 'Withdrawal Request',
      value: 'withdrawalrequest',
      className: 'th-right-border',
      renderCell: (row: any) => (
        <Link href="" className="text-decoration-none">
          {row.withdrawalRequest}
        </Link>
      ),
    },
    {
      id: '2',
      label: 'Withdrawal Bank',
      value: 'withdrawalBank',
      className: 'th-right-border',
    },
    {
      id: '3',
      label: 'Date/Time',
      value: 'dateTime',
      className: 'th-right-border',
    },
    {
      id: '4',
      label: 'Closing Balance',
      value: 'closingBalance',
      className: 'th-right-border',
    },
    {
      id: '5',
      label: 'Status',
      value: 'status',
      renderCell: (row: any) => (
        <span
          className={`${
            row.status === 'Success'
              ? '_success'
              : row.status === 'Failed'
                ? '_failed'
                : row.status === 'In process'
                  ? '_inProcess'
                  : ''
          }`}
        >
          {row.status === 'Failed' ? (
            <span className="d-flex align-items-center gap-1">
              {row.status}
              <Info />
            </span>
          ) : (
            row.status
          )}
        </span>
      ),
    },
  ];

  return (
    <>
      <CustomTable
        columns={columns}
        data={withdrawals}
        loading={loading}
        className="thead-wrapper"
      />
    </>
  );
};
export default Withdrawals;
