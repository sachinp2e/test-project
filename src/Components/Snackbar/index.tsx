import React, { useState, useEffect } from 'react';
import './style.scss';
import { CrossCircleIcon } from '@/Assets/svg';

interface ISnackbar{
    message: string;
    resetMessage: (message: string) => void;
}
const Snackbar: React.FC<ISnackbar> = ({ resetMessage, message }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      resetMessage("");
    }, 2500);
    return () => clearTimeout(timer);
  }, [message]);

    return message ? (
      <div className={`snackbar ${message ? 'snackbar-show' : 'snackbar-hide'}`}>
        <span>{message}</span>
        <span onClick={() => resetMessage('')}><CrossCircleIcon fill='#752c75'/></span>
      </div>
    ) : null;
};

export default Snackbar;
