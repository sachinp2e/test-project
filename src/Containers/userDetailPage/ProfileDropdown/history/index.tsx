import CustomSelect from "@/Components/CustomSelect";
import CustomTable from "@/Components/Table";
import { useAppDispatch, useAppSelector } from "@/Lib/hooks";
import { getUsersActivity } from "@/Lib/users/users.action";
import { getAllUsersSelector } from "@/Lib/users/users.selector";
import dayjs from "dayjs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const pageSizeArr: any[] = [
  { label: '10 per page', value: 10 },
  { label: '20 per page', value: 20 },
  { label: '30 per page', value: 30 },
]

const MyHistory: React.FC = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const {
    usersData: {
      userActivityHistory: { activities = [], totalCount, totalPages },
    },
  } = useAppSelector(getAllUsersSelector);

  const [tableData, setTableData] = useState([]);
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    setTableData(activities.slice((currentPage * pageSize) - pageSize, currentPage * pageSize));
  }, [activities])

  const handleTableData = (requestedPage: number) => {
    if (!requestedPage || requestedPage > totalPages) {
      return;
    }
    setCurrentPage(requestedPage);
    const range = requestedPage * pageSize;
    const slicedActivityData = activities.slice(range - pageSize, range);
    if (activities.length < totalCount && slicedActivityData <= pageSize) {
      dispatch(
        getUsersActivity({ userId: `${params?.userId}`, pageSize: pageSize, latestPage: requestedPage, loadMore: true }),
      );
    } else setTableData(slicedActivityData);
  }

  const handleSelectChange = (name: string, option: any) => {
    setCurrentPage(1);
    setPageSize(Number(option.value));
    dispatch(getUsersActivity({ userId: `${params?.userId}`, pageSize: Number(option.value), latestPage: 1 }));
  }

  const columns = [
    {
      id: '1',
      label: 'Transaction Details',
      value: 'activityMessage',
      className: 'th-right-border',
    },
    {
      id: '2',
      label: 'Date/Time',
      value: 'dateTime',
      className: 'th-left-border',
    },
  ]

  const dateModifierHandler = (originalDate:Date) =>{
    return dayjs(originalDate).format('DD MMM YYYY, HH:mm');
  }

  interface ActivityActionType {
    [key: string]: string;
  }

  const ActivityAction: ActivityActionType = {
    createdCatalogue: 'Catalogue creation successful.',
    createdAsset: 'Asset creation successful.',
    burnAsset: 'Asset burning completed.',
    offerAccepted: 'Offer acceptance confirmed.',
    offerPlaced: 'New offer has been made.',
    bidPlaced: 'Bid placement successful.',
    bidAccepted: 'Acceptance of your asset bid.',
    favouritedAsset: 'Asset added to favorites.',
    unfavouritedAsset: 'Asset removed from favorites.',
    favouritedCatalogue: 'Catalogue added to favorites.',
    unfavouritedCatalogue: 'Catalogue removed from favorites.',
    fixedTransfer: 'Fixed transfer initiated.',
    offerTransfer: 'Offer successfully transferred.',
    bidTransfer: 'Bid successfully transferred.',
    putOnMarketPlace: 'Your asset is listed for sale in the marketplace.',
    bidUpdated: 'Your bid has been updated.',
    followed:'Followed a user.'
  };

  const dataHandler = (data:any) =>{
    const data1 =  data?.length > 0 ? data?.map((item:any)=>({
      activityMessage: item?.activityAction !== null ? ActivityAction[item?.activityAction] : item?.activityType === 'followed' ? 'Followed a user.':'',
      dateTime: dateModifierHandler(item.created_at),
    })) : []
    return data1
  }

  return (
    <>
      <div className="my-wallet-page">
        <CustomTable
          columns={columns}
          data={ dataHandler(tableData) }
          className="thead-wrapper"
          loading={false} />
      </div>

      {!!activities.length && <div className="d-flex justify-content-between mt-4 px-2 orders-pagination">
        <CustomSelect
          className="table-pagination-select"
          onChange={handleSelectChange}
          options={pageSizeArr}
          value={pageSize} />
        <div className="d-flex gap-2 align-items-center right-wrapper">
          <span
            className={`${currentPage === 1 ? 'light' : ''}`}
            onClick={() => { handleTableData(Number(currentPage) - 1) }}>
            &lt;
          </span>
          <span>{currentPage}</span>
          <span
            className={`${currentPage === totalPages ? 'light' : ''}`}
            onClick={() => { handleTableData(Number(currentPage) + 1) }}>
            &gt;
          </span>
          <span>of {totalPages}</span>
        </div>
      </div>}
    </>
  );
};

export default MyHistory;
