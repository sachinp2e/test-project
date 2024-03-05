import MyDraft from './draft';
import MyHistory from './history';
import MyOrders from './orders';

interface Iprops{
  dropDown: string;
}

const ProfileDropdownComponent:React.FC<Iprops> = ({dropDown}) => {

  const renderTable = () => {
    switch (dropDown) {
      case 'My Drafts':
        return <MyDraft />;
      case 'Orders':
        return <MyOrders />;
      case 'History':
        return <MyHistory />;
    }
  };

  return (
    <div className="ProfileDrop">
      {renderTable()}
    </div>
  );
};

export default ProfileDropdownComponent;
