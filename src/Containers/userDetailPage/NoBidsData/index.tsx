import React from 'react';
import NodataMsg from '../../../Assets/_images/EmptyState.png';
import Image from 'next/image';
import './style.scss';
interface Iprops {
  msg: string;
}
const NoBidsData: React.FC<Iprops> = ({ msg }) => {
  return (
    <div className='no-data'>
      <div className='container-div'>
        <Image
          src={NodataMsg}
          alt="avatar"
          quality={100}
          width={200}
          height={200}
        />
        {msg && <h2 className='text-capitalize'>{msg}</h2>}
      </div>
    </div>
  );
};

export default NoBidsData;
