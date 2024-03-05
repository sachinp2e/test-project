import React from 'react';
import CustomTable from '../../../../Components/Table';
import { useAppDispatch, useAppSelector } from '../../../../Lib/hooks';
import useEffectOnce from '../../../../Hooks/useEffectOnce';
import { Info } from '../../../../Assets/svg';
import '../style.scss';
import { walletSelector } from '@/Lib/wallet/wallet.selector';
import { getWalletTransactions } from '@/Lib/wallet/wallet.action';
import dayjs from 'dayjs';

interface IRefundsTable{
}

const RefundsTable: React.FC<IRefundsTable> = () => {
  const dispatch = useAppDispatch();
  const {refundTransactions, isLoading} = useAppSelector(walletSelector);
  useEffectOnce(() => {
    dispatch(getWalletTransactions({type:'refund'}));
  });

  const columns = [
    {
      id: '1',
      label: <div>Asset Name</div>,
      value: 'assetname',
      className: 'th-right-border',
      renderCell: (row: any) => (
        <span>
          {row?.assetID.length > 15 ? row?.assetID?.slice(0, 15) + '...' : row?.assetID }
        </span>
      ),
    },
    {
      id: '2',
      label: 'Amount',
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
      label: 'Type',
      value: 'transactionCode',
      className: 'th-right-border',
    },
    {
      id: '4',
      label: 'Date/Time',
      value: 'dateTime',
      className: 'th-right-border',
      renderCell: (row: any) => (
        <p>{dayjs(row?.createdDate).format('DD MMM YYYY, HH:mm')}</p>
      ),
    },
    {
      id: '5',
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
      id: '6',
      label: 'Order Status',
      value: 'status',
      renderCell: (row: any) => (
        <span
          className={`${row.status === 'SUCCESS' ? '_success' : row.status === 'FAILED' ? '_failed' : row.status === 'In process' ? '_inProcess ' : ''}`}>
            {row.status === 'Failed' ? (
              <span className='d-flex align-items-center gap-1'>
                {row.status}<Info />
              </span>
            ) : row.status}
        </span>
      )
    },
  ]
  return (
    <>
      <CustomTable
        columns={columns}
        data={refundTransactions}
        loading={isLoading}
        className="thead-wrapper"
      />
    </>
  )
}

export default RefundsTable
