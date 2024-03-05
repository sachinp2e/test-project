import React from 'react';
import Button from '@/Components/Button';
import '../report.scss';

const SuccessReport = () => {
  return (
    <div className="success-report-container">
      <h2>Your report has been submitted successfully!</h2>
      <Button text="Close" className="footer-subscribe-btn close-button" />
    </div>
  );
};

export default SuccessReport;
