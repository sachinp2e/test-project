import React, { useEffect, useState } from 'react';
import { CopySvgTwo } from '../../Assets/svg';
import './copy-clipboard.scss';

interface ICopyToClipboardType {
  text: string;
  sliceNumber?: number;
  lastSliceNumber?: number;
  color?:string;
}

const CustomCopyToClipboard: React.FC<ICopyToClipboardType> = (props) => {
  const { text, sliceNumber = 3, lastSliceNumber = 3, color } = props
  const [copy, setCopy] = useState<boolean>(false);

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      if (copy === true) {
        setCopy(false);
      }
    }, 1000);

    return () => {
      clearTimeout(timeoutID);
    };
  }, [copy]);

  const handleOnClick = () => {
    navigator.clipboard.writeText(text);
    setCopy(true);
  };

  return (
    <div onClick={() => handleOnClick()} className="copied-container">
      <span className="copy-id">{text?.slice(0, sliceNumber) + "....." + text?.slice(lastSliceNumber)}</span>
      <CopySvgTwo/>
      <span className={`copied ${copy ? "animation" : ""}`}>copied!</span>
    </div>
  )
}
export default CustomCopyToClipboard
