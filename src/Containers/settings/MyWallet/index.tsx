import React, { useState } from 'react';
import { walletTabs } from './data';
import TransactionsTable from './Transactions';
import SalesTable from './Sales';
import Withdrawals from './Withdrawals';
import DepositsTable from './Deposits';
import RefundsTable from './Refunds';
import Button from '../../../Components/Button';
import { useAppSelector } from '@/Lib/hooks';
import { walletSelector } from '@/Lib/wallet/wallet.selector';
import AddFunds from './AddFunds';
import './style.scss';

const MyWallet = () => {
  const [selectedTab, setSelectedTab] = useState<number>(walletTabs[0].id);
  const { walletBalance } =
    useAppSelector(walletSelector);
  const onTabChange =
    (tab: any) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setSelectedTab(tab.id);
    };

  const renderTable = () => {
    switch (selectedTab) {
      case 1:
        return <TransactionsTable />;
      case 2:
        return <SalesTable />;
      // case 3:
      //   return <Withdrawals />;
      case 4:
        return  <DepositsTable />;
      case 5:
        return <RefundsTable />;
    }
  };

  return (
    <div className="my-wallet-page">
      <div className="heading">
        <h3>My Wallet</h3>
        <div className="divider" />
      </div>
      <div className="balance-details">
        <div className="balance-details__left">
          <p>
            Available Balance : <span>${walletBalance || 0}</span>
          </p>
        </div>

        <div className="balance-details__right">
          <AddFunds />
          {/* <Button
            className="explore-assets-btn delete-btn"
            element={
              <div className="d-flex align-items-center">
                <span className="me-2">Withdraw</span>
              </div>
            }
            isGradient
          /> */}
        </div>
      </div>
      <div className="transaction-tabs-wrapper">
        <div className="tabs">
          {walletTabs.map((tab, index) => (
            <div
              key={index}
              className={`tabs__tab ${
                selectedTab === tab.id ? 'selected' : ''
              }`}
              onClick={onTabChange(tab)}
            >
              <p>{tab.title}</p>
            </div>
          ))}
        </div>
      </div>
      {renderTable()}
    </div>
  );
};

export default MyWallet;
