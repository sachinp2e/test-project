import React from 'react';
import { SearchIcon } from '@/Assets/svg'; // Assuming your SVG file is named SearchIcon.svg
import './search-bar.scss';
import { debounce } from 'lodash';
interface ILocalSearchBarProps{
  handleSearch?: (search: string) => void;
}

const LocalSearchBar: React.FC<ILocalSearchBarProps> = ({ handleSearch }) => {
  
  const setPropSearch = debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch?.(e.target.value);
  }, 1000);
  
  return (
    <div className="input-group search-box-wrapper">
      <span className="input-group-text"><SearchIcon/></span>
      <input type="text" className="form-control" placeholder="Search..." onChange={setPropSearch}/>
    </div>
  );
};

export default LocalSearchBar;