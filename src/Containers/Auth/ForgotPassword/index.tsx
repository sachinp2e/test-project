'use client'
import React, { useState } from 'react';
import ForgotPassword from './ForgotPassword';

const ForgotPasswordScreens = () => {
  const [selectedStep, setSelectedStep] = useState<number>(1);

  const renderTab = () => {
    switch (selectedStep) {
      case 1:
        return <ForgotPassword />
      default:
        return
    }
  }

  return (
    <div>
      {renderTab()}
    </div>
  )
}
export default ForgotPasswordScreens