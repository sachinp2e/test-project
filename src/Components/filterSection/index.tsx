'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import RangeSlider from 'react-range-slider-input';
import GenericAccordion from './Accordian';
import closeButton from '@/Assets/_images/close-button.svg';
import { BackButton, TuneDSVG } from '@/Assets/svg';
import {
  clearAllGlobalFilters,
  GlobalSearchType,
  setGlobalSearchFilter,
  removeGlobalSearchFilter,
} from '@/Lib/globalSearchAndFilters/globalSearchAndFilters.slice';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { getGlobalSearchDataSelector, getSelectedFiltersSelector } from '@/Lib/globalSearchAndFilters/globalSearchAndFilters.selector';
import "react-range-slider-input/dist/style.css";
import './filter-section.scss';
import FilterEllipse from "@/Assets/_images/filterEllipse.svg"


interface FilterSectionProps {
  isFilterVisible?: boolean;
  handleToggleFilter: () => void;
}

const accordionItems = [
  {
    title: 'Sale Type',
    eventKey: '0',
    radioLabels: [{
      id: 1,
      label: 'All',
      key: 'orderType' as keyof GlobalSearchType,
      value: 'all',
    }, {
      id: 2,
      label: 'Fixed Price',
      key: 'orderType' as keyof GlobalSearchType,
      value: 'fixed',
    }, {
      id: 3,
      label: 'Auction',
      key: 'orderType' as keyof GlobalSearchType,
      value: 'timed',
    }, {
      id: 4,
      label: 'Not for Sale',
      key: 'orderType' as keyof GlobalSearchType,
      value: 'none',
    }],
  },
  // commented out for single assets time being
  // {
  //   title: 'Copies',
  //   eventKey: '1',
  //   radioLabels: [{
  //     id: 1,
  //     label: 'All',
  //     key: 'editions' as keyof GlobalSearchType,
  //     value: 'all',
  //   }, {
  //     id: 2,
  //     label: 'Single',
  //     key: 'editions' as keyof GlobalSearchType,
  //     value: 'single',
  //   }, {
  //     id: 3,
  //     label: 'Multiple',
  //     key: 'editions' as keyof GlobalSearchType,
  //     value: 'multiple',
  //   }],
  // },
  {
    title: 'Extras',
    eventKey: '2',
    radioLabels: [{
      id: 1,
      label: 'All',
      key: 'extras' as keyof GlobalSearchType,
      value: 'all',
    }, {
      id: 2,
      label: 'Featured',
      key: 'featured' as keyof GlobalSearchType,
      value: 'featured',
    }, {
      id: 3,
      label: 'Expiring Soon',
      key: 'expiringSoon' as keyof GlobalSearchType,
      value: 'expiringSoon',
    }
    //  {
      // id: 4,
      // label: 'Upcoming',
      // key: 'upcoming' as keyof GlobalSearchType,
      // value: 'upcoming',
    // }],
  ]
  },
];

const FilterSection: React.FC<FilterSectionProps> = ({ handleToggleFilter, isFilterVisible }) => {
  const dispatch = useAppDispatch();
  const data = useAppSelector(getGlobalSearchDataSelector);

  const filtersAppliedArr = useAppSelector(getSelectedFiltersSelector);

  const [minValue, setMinValue] = useState<number>(data?.minPrice || 0);
  const [maxValue, setMaxValue] = useState<number>(data?.maxPrice || 10000);
  const [tempPriceStorage, setTempPriceStorage] = useState<{ minPrice?: number, maxPrice?: number }>({});

  const handleInput = (values: any[]) => {
    setMinValue(values[0]);
    setMaxValue(values[1]);
  };

  const onPriceChange = () => {
    dispatch(setGlobalSearchFilter({ minPrice: minValue, maxPrice: maxValue }));
    setTempPriceStorage({ minPrice: minValue, maxPrice: maxValue });
  };

  const removeAppliedFilter = (elem: any) => {
    dispatch(removeGlobalSearchFilter(elem.originalKey || elem.key));
  };



  const resetAllFilters = () => {
    dispatch(clearAllGlobalFilters());
    setMinValue(0);
    setMaxValue(10000);
    setTempPriceStorage({});
  };

  const onInputPriceChange = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const { name, value } = e.target;
    const regex = /^[\d\s]+$/;
    if(e.target.value.length > 0 && !regex.test(e.target.value)){
      return ;
    }
    if (name === 'minValue') {
      setTempPriceStorage({ ...tempPriceStorage, minPrice: Number(value) });
    } else {
      setTempPriceStorage({ ...tempPriceStorage, maxPrice: Number(value) });
    }
  };

  const setPriceValue = (e: any) => {
    if (e.keyCode !== 13) return;

    let maxPrice = tempPriceStorage.maxPrice || 10000;
    let minPrice = tempPriceStorage.minPrice || 0;
    if (e.target.name === 'minValue' && minPrice > maxPrice) {
      maxPrice = minPrice === 10000 ? minPrice : minPrice + 1;
    }
    if (e.target.name === 'maxValue' && maxPrice < minPrice) {
      minPrice = maxPrice === 0 ? maxPrice : maxPrice - 1;
    }
    dispatch(setGlobalSearchFilter({ minPrice, maxPrice }));
    setTempPriceStorage({ minPrice, maxPrice });
    setMinValue(minPrice || 0);
    setMaxValue(maxPrice || 0);
  };

  return (
    <div className={`filter-container ${isFilterVisible ? 'filter-open' : ''}`}>
      <div className="filter-wrapper">
        <div>
          <div className="filter-header">
            <div className="left-header">
              <TuneDSVG />
              <span>Filters</span>
              {filtersAppliedArr.length > 0 && (
                <Image
                  src={FilterEllipse}
                  alt="filter-show-image"
                />
              )}
            </div>
            <div onClick={handleToggleFilter} style={{ cursor: 'pointer' }}>
              <BackButton />
            </div>
          </div>
          <hr className="horizontal-rule" />
        </div>
        <div>
          <div className="applied-filters">
            <>
              <span>Applied Filters</span>
              <button
                className="reset-button"
                role="reset"
                onClick={resetAllFilters}
              >
                Reset all
              </button>
            </>
          </div>
          <div className="applied-filter-nav">
            {filtersAppliedArr.map((elem) => (
              <div className="filter-nav-pills" key={elem.key}>
                <span>{elem.displayValue}</span>
                <Image
                  src={closeButton}
                  alt="close-button"
                  className="close-button"
                  onClick={() => removeAppliedFilter(elem)}
                />
              </div>
            ))}
          </div>
          <hr className="horizontal-rule" />
        </div>

        <div className="range-filter">
          <p className="m-0">Pricing</p>
          <div className="filter-range">
            <span>${minValue}.00</span>
            <span>${maxValue}.00</span>
          </div>
          <div className="range-slider">
            <RangeSlider
              id="price-range"
              className="range-slider-custom"
              min={0}
              max={10000}
              step={5}
              value={[minValue, maxValue]}
              onInput={handleInput}
              onThumbDragEnd={onPriceChange}
            />
          </div>
          <div className="input-container">
            <input
              type="tel"
              placeholder="Min. Value"
              name="minValue"
              value={tempPriceStorage.minPrice || ''}
              onChange={onInputPriceChange}
              onKeyUp={setPriceValue}
            />
            <input
              type="tel"
              placeholder="Max. Value"
              name="maxValue"
              value={tempPriceStorage.maxPrice || ''}
              onChange={onInputPriceChange}
              onKeyUp={setPriceValue}
            />

            <div className="single-line"></div>
          </div>
        </div>
        <div className="accordian-container">
          <GenericAccordion items={accordionItems} />
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
