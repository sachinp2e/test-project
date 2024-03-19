'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Col, Row } from 'react-bootstrap';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Button from '@/Components/Button';
import ToggleTab from '@/Components/ToggleTab';
import CustomSelect from '@/Components/CustomSelect';
import FilterSection from '@/Components/filterSection';
import ExploreDataSection from './ExploreDataSection/index';
import defaultCoverImg from '../../Assets/_images/image44.png';
import filterIcon from '../../Assets/_images/filter.svg';
import { SortByData, SortByDataCatalog } from './data';
import { getAllAssets } from '@/Lib/assets/assets.action';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { getAllAssetsSelector } from '@/Lib/assets/assets.selector';
import RenderSkeleton from '@/Containers/explore/renderSkeleton';
import { getAllCatalogs } from '@/Lib/catalogs/catalogs.action';
import { getAllCatalogsSelector } from '@/Lib/catalogs/catalogs.selector';
import { getAllUsersSelector } from '@/Lib/users/users.selector';
import { getAllUsers } from '@/Lib/users/users.action';
import { makeFilterApiCallSelector } from '@/Lib/globalSearchAndFilters/globalSearchAndFilters.selector';
import { clearAllGlobalFilters, toggleMakeApiCall } from '@/Lib/globalSearchAndFilters/globalSearchAndFilters.slice';
import { getAllCategorySelector } from '@/Lib/category/category.selector';
import { getAllCategories } from '@/Lib/category/category.action';
import './explore.scss';
import useEffectOnce from '@/Hooks/useEffectOnce';
import { resetExploreAssets } from '@/Lib/assets/assets.slice';

interface IExplore {}

const tabs = ['assets', 'catalogs', 'users'];

const Explore: React.FC<IExplore> = () => {
  const router = useRouter();
  const params: any = useParams();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';
  const selectedCategoryIdParam = searchParams.get('id') || '';
  const selectedCategoryNameParam = searchParams.get('category') || '';
  
  const { categories } = useAppSelector(getAllCategorySelector);
  const { assets, loading: assetsLoading } = useAppSelector(getAllAssetsSelector);
  const {
    catalogsData: { catalogs, allCatalogsLoading },
  } = useAppSelector(getAllCatalogsSelector);
  const {
    usersData: { users, loading: usersLoading },
  } = useAppSelector(getAllUsersSelector);
  const makeApiCall = useAppSelector(makeFilterApiCallSelector);
  
  const [firstRender, setFirstRender] = useState(true);
  const [selectedValue, setSelectedValue] = useState<any>({ category: `${selectedCategoryIdParam || ''}`, sortBy: '', orderBy: '' });
  const [coverImage, setCoverImage] = useState<string>('');
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);

  const fetchData = async () => {
    if (categories.length === 0) {
      await dispatch(getAllCategories({}));
    }
    if (params.type === 'assets') {
      await dispatch(getAllAssets({ filters: { ...selectedValue }, search }));
    } else if (params.type === 'catalogs') {
      await dispatch(getAllCatalogs({ filters: { ...selectedValue }, search }));
    } else if (params.type === 'users') {
      await dispatch(getAllUsers({ filters: { ...selectedValue }, search }));
    }
  };

  useEffectOnce(() => {
    dispatch(clearAllGlobalFilters());
    dispatch(resetExploreAssets());
  });

  useEffect(() => {
    if (!firstRender && selectedCategoryIdParam) {
      const filteredCategory = categories.filter(category => category.id === selectedCategoryIdParam);
      setCoverImage(filteredCategory[0]?.mediaUrl);
      setSelectedValue({ ...selectedValue, category: `${selectedCategoryIdParam}` })
    }
  }, [selectedCategoryIdParam])
  
  useEffect(() => {
    if (!firstRender) {
      fetchData();
    } else {
      setFirstRender(false);
    }
  }, [selectedValue, search, params.type]);

  useEffect(() => {
    if (makeApiCall) {
      fetchData();
      dispatch(toggleMakeApiCall());
    }
  }, [makeApiCall]);

  useEffect(() => {
    if (!!categories.length) {
    const filteredCategory = categories.filter(category => category.id === selectedCategoryIdParam);
    setCoverImage(filteredCategory[0]?.mediaUrl || '');
    }
  }, [categories]);
  
  const categoryOptions = useMemo(() => {
    const options: any[] = [];
    options.push({
      id: '',
      value: '',
      label: 'All Category',
    });
    (categories || []).forEach((category: any) => {
      options.push({
        id: category.id,
        value: category.id,
        label: category.name,
      });
    });
    return options;
  }, [categories]);

  const handleTabClick = (tab: string) => {
    if (params.type !== 'catalogs') setCoverImage('');
    if (params.type !== 'assets') dispatch(resetExploreAssets());
    router.push(`/explore/${tab}`);
  };
  const handleOnchange = (key: string, option: any) => {
    if (key === 'category' && option.label === 'All Category') {
      router.push('/explore/assets');
      setCoverImage('');
      setSelectedValue({ category: '', sortBy: '', orderBy: '' });
      return;
    }
    if (key === 'category') {
      router.push(`?category=${option.label}&id=${option.value}`);
    } else {
      setSelectedValue({
        ...selectedValue,
        [key]: option.value.split(' ')[0],
        orderBy: option.value.split(' ')[1],
      });
    }
    // dispatch(setGlobalSearchFilter({ [key]: option.value }));
  };

  const filterColSize = isFilterVisible && params.type !== 'users' ? 3 : 0;

  const handleToggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  return (
    <>
      <div className="container-fluid p-0">
        <div className="explore-container">
          <div className="explore-cover">
            <Image src={coverImage || defaultCoverImg} alt="explore-assets-cover-image" quality={100} width={2600} height={500}/>
            <div className="category-title">{selectedCategoryNameParam || 'explore'}</div>
          </div>
          <div className="tabs-dropdown">
            <ToggleTab
              tabs={tabs}
              activeToggle={params.type}
              handleTabClick={handleTabClick}
            />
            <div className="select-group">
              {params.type === 'assets' && (
                <div className="select-three">
                  <CustomSelect
                    name="category"
                    placeholder="All Category"
                    value={selectedCategoryIdParam}
                    options={categoryOptions}
                    onChange={handleOnchange}
                    fix
                  />
                </div>
              )}
              {params.type === 'assets' ? (
                <div className="sort-select">
                  <CustomSelect
                    name="sortBy"
                    placeholder="Recently Listed"
                    value={selectedValue.sortBy}
                    options={SortByData}
                    onChange={handleOnchange}
                  />
                </div>
              ) : (
                params.type !== 'users' && (
                  <div className="sort-select">
                    <CustomSelect
                      name="sortBy"
                      placeholder="Recently Listed"
                      value={selectedValue.sortBy}
                      options={SortByDataCatalog}
                      onChange={handleOnchange}
                    />
                  </div>
                )
              )}
            </div>
          </div>
          <div className="explore-cards">
            {!isFilterVisible &&
              params.type !== 'users' &&
              !isFilterVisible &&
              params.type !== 'catalogs' && (
                <Button
                  className="filter-button"
                  onClick={handleToggleFilter}
                  element={<Image src={filterIcon} alt="filter" />}
                />
              )}
            <div className="explore-filter-container">
              <Row>
                {isFilterVisible && params.type !== 'users' && (
                  <Col lg={filterColSize}>
                    <FilterSection
                      isFilterVisible={isFilterVisible}
                      handleToggleFilter={handleToggleFilter}
                    />
                  </Col>
                )}
                {params.type === 'assets' &&
                assets.length === 0 &&
                assetsLoading ? (
                  <Col lg={12 - filterColSize}>
                    <RenderSkeleton />
                  </Col>
                ) : params.type === 'catalogs' &&
                  catalogs.length === 0 &&
                  allCatalogsLoading ? (
                  <Col lg={12 - filterColSize}>
                    <RenderSkeleton />
                  </Col>
                ) : params.type === 'users' &&
                  users.length === 0 &&
                  usersLoading ? (
                  <Col lg={12 - filterColSize}>
                    <RenderSkeleton />
                  </Col>
                ) : (
                  <Col lg={12 - filterColSize}>
                    <ExploreDataSection
                      loading={assetsLoading || allCatalogsLoading}
                      showCategory={params.type}
                      selectedDropdown={selectedValue}
                    />
                  </Col>
                )}
              </Row>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Explore;
