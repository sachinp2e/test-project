'use client';
import React from 'react';
import Image from 'next/image';
import CustomTable from '../../Components/Table';
import useEffectOnce from '@/Hooks/useEffectOnce';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { getLeaderboardTopCatalogs } from '@/Lib/leaderboard/leaderboard.action';
import { leaderboardSelector } from '@/Lib/leaderboard/leaderboard.selector';
import { LeftArrowIcon } from '@/Assets/svg';
import './leaderboard.scss';
import { getAllCatalogsSelector } from '@/Lib/catalogs/catalogs.selector';
import { getTopCatalogs } from '@/Lib/catalogs/catalogs.action';
import { useRouter } from 'next/navigation';

const Leaderboard = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    topCatalogsData: { catalogs, topCatalogsloading },
  } = useAppSelector(getAllCatalogsSelector);

  useEffectOnce(() => {
    if (!!!catalogs.length) dispatch(getTopCatalogs({ pageSize: 20 }));
  });

  const columns = [
    {
      id: '1',
      label: 'Rank',
      value: 'rank',
      className: 'rank-td',
      width: '80px',
    },
    {
      id: '2',
      label: 'Catalog',
      value: 'catalog',
      className: 'leaderboard-td',
      width: '150px',
      renderCell: (row: any) => (
        <div>
          <Image
            src={row?.catalogueImage_resized}
            alt="catalog-image"
            height={400}
            width={400}
            quality={100}
          />
        </div>
      ),
    },
    {
      id: '3',
      label: 'Name',
      value: 'name',
      className: 'leaderboard-td',
      renderCell: (row: any) => (
        <div className="text-center">{row?.catalogueName}</div>
      ),
    },
    {
      id: '3',
      label: 'Total Assets',
      value: 'items',
      className: 'leaderboard-td',
      isSort: true,
      renderCell: (row: any) => <div className="text-center">{row?.items}</div>,
    },
    {
      id: '4',
      label: 'Total Catalog Sale',
      value: 'totalEarnings',
      className: 'leaderboard-td',
      isSort: true,
      renderCell: (row: any) => (
        <div className="text-center">{row?.totalEarnings} USD</div>
      ),
    },
    {
      id: '5',
      label: 'Min. Asset Price',
      value: 'floorprice',
      className: 'leaderboard-td',
      isSort: true,
      width: '200px',
      renderCell: (row: any) => (
        <div className="d-flex w-100">{row?.floorprice || 0} USD</div>
      ),
    },
    {
      id: '6',
      value: 'viewCatalog',
      className: 'leaderboard-td',
      width: '50px',
      renderCell: (row: any) => (
        <div
          className="d-flex w-50 align-items-center justify-content-end"
          onClick={() => router.push(`/catalogs/${row?.catalogueId}`)}
        >
          <LeftArrowIcon />
        </div>
      ),
    },
  ];

  return (
    <div className="leaderboard-main-container">
      <div className="heading">Top Catalogs</div>
      <CustomTable
        data={catalogs}
        columns={columns}
        loading={topCatalogsloading}
        wantIndex
      />
    </div>
  );
};

export default Leaderboard;
