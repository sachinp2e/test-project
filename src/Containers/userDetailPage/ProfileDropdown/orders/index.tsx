import React, { useEffect, useState } from 'react';
import CustomTable from '@/Components/Table';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import dayjs from 'dayjs';
import "./style.scss"
import CustomSelect from '@/Components/CustomSelect';
import { getAllMyOrders } from '@/Lib/users/users.action';
import { getAllUsersSelector } from '@/Lib/users/users.selector';
import { LinkButton } from '@/Assets/svg';
import { useRouter } from 'next/navigation';

const pageSizeArr: any[] = [
  { label: '10 per page', value: 10 },
  { label: '20 per page', value: 20 },
  { label: '30 per page', value: 30 },
]

const MyOrders: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    usersData: {
      userProfileOrders: { orders = [], totalCount, totalPages }, loading
    },
  } = useAppSelector(getAllUsersSelector);

  const [tableData, setTableData] = useState([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    setTableData(orders.slice((currentPage * pageSize) - pageSize, currentPage * pageSize));
  },[orders])

  const handleTableData = (requestedPage: number) => {
    if (!requestedPage || requestedPage > totalPages) {
      return;
    }
    setCurrentPage(requestedPage);
    const ordersRange = requestedPage * pageSize;
    const slicedOrdersData = orders.slice(ordersRange - pageSize, ordersRange);
    if (orders.length < totalCount && slicedOrdersData <= pageSize) {
      dispatch(
        getAllMyOrders({ pageSize: pageSize, latestPage: requestedPage, loadMore: true}),
      );
    } else setTableData(slicedOrdersData);
  }
    
  const handleSelectChange = (name: string, option: any) => {
    setCurrentPage(1);
    setPageSize(Number(option.value));
    dispatch(getAllMyOrders({ pageSize: Number(option.value), latestPage: 1 }));
  }

  const columns = [
    {
      id: '1',
      label: 'Asset',
      value: 'assetname',
      minWidth: '130px',
      className: 'th-right-border',
      renderCell: (row: any) => 
       <span onClick={() => window.open(`/asset-details/${row?.assetId}`, '_blank')}>
        {row.asset.name}
      </span>
    },
    {
      id: '2',
      label: 'Order ID',
      value: 'orderId',
      minWidth: '160px',
      className: 'th-right-border',
      renderCell: (row: any) => (
        <div className="credit-success">{row?.id || '-'}</div>
      ),
    },
    {
      id: '3',
      label: 'Payment ID',
      value: 'paymentId',
      minWidth: '160px',
      className: 'th-right-border',
      renderCell: (row: any) =>
        <div className={`${row?.transactionId ? '' : 'd-flex w-100 justify-content-center'}`}>
          {row?.transactionId || '-'}
        </div>,
    },
    // {
    //   id: '4',
    //   label: 'Payment Status',
    //   value: 'paymentStatus',
    //   className: 'th-right-border',
    // },
    {
      id: '5',
      label: 'Date/Time',
      value: 'dateTime',
      minWidth: '150px',
      renderCell: (row: any) => (
        <p>{dateModifierHandler(row?.created_at)}</p>
      ),
      className: 'th-right-border',
    },
    {
      id: '6',
      label: 'Order Status',
      value: 'orderStatus',
      minWidth: '140px',
      className: 'th-right-border',
      renderCell: (row: any) => (
        <span
        className={`${
          row.orderStatus === 'SUCCESS'
            ? '_success'
            : row.orderStatus === 'FAILED'
              ? '_failed'
              : row.orderStatus === 'HOLD'
                ? '_pending'
                : '_custom'
        }`}
        >
          {row?.orderStatus}
        </span>
      ),
    },
    {
      id: '7',
      label: 'View on Blockchain',
      value: 'blockChainUrl',
      minWidth: '160px',
      renderCell: (row: any) => (
        <div onClick={() => window.open(row?.blockChainTxnUrl, '_blank')}>
          <LinkButton />
        </div>
      ),
    },
  ];

  const dateModifierHandler = (originalDate:Date) =>{
    return dayjs(originalDate).format('DD MMM YYYY, HH:mm');
  }

  return (
    <>
    <div className="orderProfile">
      <CustomTable
        columns={columns}
        data={tableData}
        className="thead-wrapper"
        loading={loading}/>
    </div>
    {!!orders.length && totalCount > 10 && <div className="d-flex justify-content-between mt-4 px-2 orders-pagination">
      <CustomSelect
        className="table-pagination-select"
        onChange={handleSelectChange}
        options={pageSizeArr}
        value={pageSize}/>
      <div className="d-flex gap-2 align-items-center right-wrapper">
        <span
          className={`${currentPage === 1 ? 'light' : ''}`}
          onClick={()=>{handleTableData(Number(currentPage) - 1)}}>
          &lt;
        </span>
        <span>{currentPage}</span>
        <span
          className={`${currentPage === totalPages ? 'light' : ''}`}
          onClick={()=>{handleTableData(Number(currentPage) + 1)}}>
          &gt;
        </span>
        <span>of {totalPages}</span>
      </div>
    </div>}
    </>
  );
};

export default MyOrders;
