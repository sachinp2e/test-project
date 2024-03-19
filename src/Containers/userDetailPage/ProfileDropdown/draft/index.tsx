import Masonry from 'react-masonry-css';
import AssetCard from '@/Components/AssetCard';
import { useAppSelector } from '@/Lib/hooks';
import { getAllUsersSelector } from '@/Lib/users/users.selector';

const MyDraft = () => {
  const { usersData: { userProfileDrafts } } = useAppSelector(getAllUsersSelector);

  const breakpointColumnsObj = {
    default: 4,
    1440: 2,
    1024: 2,
    700: 1,
  };

  return (
    <div className="trending-main-card-wrapper">
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="my-masonry-grid"
        columnClassName="my-masonry-grid_column"
      >
        {(userProfileDrafts.assets || []).length > 0 ? (userProfileDrafts.assets || []).map((item: any,idx:number) => {
          return <AssetCard item={item} key={`asset_${idx}`}/>;
        }) : <></>}
      </Masonry>
    </div>
  );
};

export default MyDraft;
