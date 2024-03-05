'use client';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { TuneDSVG } from '@/Assets/svg';
import ToggleTab from '../../../Components/ToggleTab/index';
import CustomSelect from '../../../Components/CustomSelect/index';
import { trendingDataSelector } from '@/Lib/landing/landing.selector';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { getTrendingAssets } from '@/Lib/landing/landing.action';
import useEffectOnce from '../../../Hooks/useEffectOnce';
import MasonryLayout from '../../../Components/MasonryLayout/index';
import AssetCard from '../../../Components/AssetCard/index';
import CatalogCard from '../../../Components/CatalogCard/index';
import { getAllCategorySelector } from '@/Lib/category/category.selector';
import './trending-section.scss';
import { getAllCatalogsSelector } from '@/Lib/catalogs/catalogs.selector';
import { getTrendingCatalogs } from '@/Lib/catalogs/catalogs.action';
import { ICatalogs } from '@/Lib/catalogs/catalogsInterface';

interface ITrendingSectionType {}

const tabs = ['Assets', 'Catalogs'];

const TrendingSection: React.FC<ITrendingSectionType> = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>('Assets');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('SEVEN_DAYS');
  const {
    catalogsData: { trendingCatalogs },
  } = useAppSelector(getAllCatalogsSelector);
  const { loading, trendingAssets } = useAppSelector(trendingDataSelector);

  const handleTabClick = (tab: string) => {
    setSelectedCategory(tab);
  };

  useEffect(() => {
    if (
      selectedCategory === 'Assets' &&
      selectedPeriod !== 'All' &&
      !!!trendingAssets[selectedPeriod]?.length
    ) {
      dispatch(getTrendingAssets({ period: selectedPeriod }));
    } else if (
      selectedCategory === 'Assets' &&
      !!!trendingAssets?.allTrendingCatalogs?.length
    ) {
      dispatch(getTrendingAssets({}));
    } else if (
      selectedCategory === 'Catalogs' &&
      selectedPeriod !== 'All' &&
      !!!trendingCatalogs[selectedPeriod]?.length
    ) {
      dispatch(getTrendingCatalogs({ period: selectedPeriod }));
    } else if (
      selectedCategory === 'Catalogs' &&
      !!!trendingCatalogs?.allTrendingCatalogs?.length
    ) {
      dispatch(getTrendingCatalogs({}));
    }
  }, [selectedCategory, selectedPeriod]);

  const handleOnchange = (name: string, option: any) => {
    setSelectedPeriod(option.value);
  };

  const onViewAll = () => {
    if (selectedCategory === 'Assets') {
      router.push('/explore/assets');
    } else if (selectedCategory === 'Catalogs') {
      router.push('/explore/catalogs');
    }
  };

  const renderCatalogs = (catalogs: ICatalogs[] = []) => {
    if (!catalogs || catalogs.length === 0) {
      return (
        <div className="mt-3 text-nowrap">
          <div style={{ fontSize: '48px', color: '#ddd' }}>
            No trending catalogs
          </div>
        </div>
      );
    }
    return catalogs.map((catalog) => (
      <CatalogCard cardData={catalog} key={catalog.id} />
    ));
  };

  return (
    <div className="main-trending-wrapper">
      <div className="container-fluid">
        <div className="trending-header">Trending right now</div>
        <div className="filter-section">
          <div className="filter-section-wrapper">
            <div className="d-flex">
              <ToggleTab
                tabs={tabs}
                activeToggle={selectedCategory}
                handleTabClick={handleTabClick}
              />
            </div>
            <div className="select-wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
              >
                <path
                  d="M13 25.75C12.5986 25.75 12.2622 25.6142 11.9906 25.3427C11.7191 25.0712 11.5833 24.7347 11.5833 24.3333V18.6667C11.5833 18.2653 11.7191 17.9288 11.9906 17.6573C12.2622 17.3858 12.5986 17.25 13 17.25C13.4014 17.25 13.7378 17.3858 14.0094 17.6573C14.2809 17.9288 14.4167 18.2653 14.4167 18.6667V20.0833H24.3333C24.7347 20.0833 25.0712 20.2191 25.3427 20.4906C25.6142 20.7622 25.75 21.0986 25.75 21.5C25.75 21.9014 25.6142 22.2378 25.3427 22.5094C25.0712 22.7809 24.7347 22.9167 24.3333 22.9167H14.4167V24.3333C14.4167 24.7347 14.2809 25.0712 14.0094 25.3427C13.7378 25.6142 13.4014 25.75 13 25.75ZM1.66667 22.9167C1.26528 22.9167 0.928819 22.7809 0.657292 22.5094C0.385764 22.2378 0.25 21.9014 0.25 21.5C0.25 21.0986 0.385764 20.7622 0.657292 20.4906C0.928819 20.2191 1.26528 20.0833 1.66667 20.0833H7.33333C7.73472 20.0833 8.07118 20.2191 8.34271 20.4906C8.61424 20.7622 8.75 21.0986 8.75 21.5C8.75 21.9014 8.61424 22.2378 8.34271 22.5094C8.07118 22.7809 7.73472 22.9167 7.33333 22.9167H1.66667ZM7.33333 17.25C6.93194 17.25 6.59549 17.1142 6.32396 16.8427C6.05243 16.5712 5.91667 16.2347 5.91667 15.8333V14.4167H1.66667C1.26528 14.4167 0.928819 14.2809 0.657292 14.0094C0.385764 13.7378 0.25 13.4014 0.25 13C0.25 12.5986 0.385764 12.2622 0.657292 11.9906C0.928819 11.7191 1.26528 11.5833 1.66667 11.5833H5.91667V10.1667C5.91667 9.76528 6.05243 9.42882 6.32396 9.15729C6.59549 8.88576 6.93194 8.75 7.33333 8.75C7.73472 8.75 8.07118 8.88576 8.34271 9.15729C8.61424 9.42882 8.75 9.76528 8.75 10.1667V15.8333C8.75 16.2347 8.61424 16.5712 8.34271 16.8427C8.07118 17.1142 7.73472 17.25 7.33333 17.25ZM13 14.4167C12.5986 14.4167 12.2622 14.2809 11.9906 14.0094C11.7191 13.7378 11.5833 13.4014 11.5833 13C11.5833 12.5986 11.7191 12.2622 11.9906 11.9906C12.2622 11.7191 12.5986 11.5833 13 11.5833H24.3333C24.7347 11.5833 25.0712 11.7191 25.3427 11.9906C25.6142 12.2622 25.75 12.5986 25.75 13C25.75 13.4014 25.6142 13.7378 25.3427 14.0094C25.0712 14.2809 24.7347 14.4167 24.3333 14.4167H13ZM18.6667 8.75C18.2653 8.75 17.9288 8.61424 17.6573 8.34271C17.3858 8.07118 17.25 7.73472 17.25 7.33333V1.66667C17.25 1.26528 17.3858 0.928819 17.6573 0.657292C17.9288 0.385764 18.2653 0.25 18.6667 0.25C19.0681 0.25 19.4045 0.385764 19.676 0.657292C19.9476 0.928819 20.0833 1.26528 20.0833 1.66667V3.08333H24.3333C24.7347 3.08333 25.0712 3.2191 25.3427 3.49063C25.6142 3.76215 25.75 4.09861 25.75 4.5C25.75 4.90139 25.6142 5.23785 25.3427 5.50938C25.0712 5.7809 24.7347 5.91667 24.3333 5.91667H20.0833V7.33333C20.0833 7.73472 19.9476 8.07118 19.676 8.34271C19.4045 8.61424 19.0681 8.75 18.6667 8.75ZM1.66667 5.91667C1.26528 5.91667 0.928819 5.7809 0.657292 5.50938C0.385764 5.23785 0.25 4.90139 0.25 4.5C0.25 4.09861 0.385764 3.76215 0.657292 3.49063C0.928819 3.2191 1.26528 3.08333 1.66667 3.08333H13C13.4014 3.08333 13.7378 3.2191 14.0094 3.49063C14.2809 3.76215 14.4167 4.09861 14.4167 4.5C14.4167 4.90139 14.2809 5.23785 14.0094 5.50938C13.7378 5.7809 13.4014 5.91667 13 5.91667H1.66667Z"
                  fill="#1C1B1F"
                />
              </svg>
              <div className="select-one">
                <CustomSelect
                  placeholder="7 Days"
                  onChange={handleOnchange}
                  options={[
                    { id: 'All', value: 'All', label: 'All' },
                    { id: '7 Days', value: 'SEVEN_DAYS', label: '7 Days' },
                    { id: '1 month', value: 'ONE_MONTH', label: '1 month' },
                    { id: '6 month', value: 'SIX_MONTH', label: '6 month' },
                  ]}
                  name="days"
                  value={selectedPeriod}
                />
              </div>
              <div className="select-three" />
            </div>
          </div>
          <div>
            <div className="view-all" onClick={onViewAll}>
              View All
            </div>
          </div>
        </div>
        {selectedCategory === 'Assets' ? (
          <MasonryLayout configObj={{ default: 3 }}>
            {(selectedPeriod === 'All'
              ? trendingAssets.allTrendingAssets
              : trendingAssets[selectedPeriod]
            )?.map((item: any) => {
              const updatedItemObj = Object.entries(item).reduce(
                (acc: any, [key, value]) => {
                  return {
                    ...acc,
                    [key.replace('assetmediaurl', 'assetMediaUrl')]: value,
                    [key.replace('assetthumbnail', 'assetThumbnail')]: value,
                    isFavourite: 'hide',
                  };
                },
                {},
              );
              return (
                <AssetCard
                  key={item.id}
                  loading={loading}
                  item={updatedItemObj}
                />
              );
            })}
          </MasonryLayout>
        ) : (
          <MasonryLayout configObj={{ default: 3 }}>
            {renderCatalogs(
              selectedPeriod === 'All'
                ? trendingCatalogs.allTrendingCatalogs
                : trendingCatalogs[selectedPeriod],
            )}
          </MasonryLayout>
        )}
      </div>
    </div>
  );
};

export default TrendingSection;
