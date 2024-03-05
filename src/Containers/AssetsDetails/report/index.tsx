import React, { ChangeEvent, useState } from 'react';
import { Form, Formik } from 'formik';
import Button from '@/Components/Button';
import CustomSelect from '@/Components/CustomSelect';
import GenericTextArea from '@/Components/textarea';
import GenericModal from '@/Components/modal';
import SuccessReport from './successReport';
import './report.scss';

interface MyFormValues {
  reportDescription: string;
}

const Report = () => {
  const [selectedValue, setSelectedValue] = useState<string>('');
  const [text, setText] = useState('');
  const [reportModal, setReportModal] = useState(false);

  const handleReportModal = () => {
    setReportModal(false);
  };

  const handleOnchange = (option: any) => {
    setSelectedValue(option.value);
  };
  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setText(value);
  };
  const initialValues: MyFormValues = {
    reportDescription: '',
  };
  const handleSubmit = (values: MyFormValues) => {
    console.log('Form values:', values);
  };
  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ errors, touched }) => (
        <Form>
          <CustomSelect
            placeholder="Select a reason"
            onChange={(option) => handleOnchange(option)}
            options={[
              { id: 1, value: '7', label: 'In 7 days' },
              { id: 2, value: '5', label: 'In 5 days' },
              { id: 3, value: '3', label: 'In 3 days' },
            ]}
            label="I would like to say that this item is..."
            name="days"
            value={selectedValue}
            className="report"
          />

          <GenericTextArea
            className="margin-top-input"
            label="Description"
            name="catalogDesc"
            value={text}
            onChange={handleTextAreaChange}
            placeholder="Enter Description..."
            rows={4}
          />

          {touched.reportDescription && errors.reportDescription && (
            <div className="error-message">{errors.reportDescription}</div>
          )}
          <div className="report-button-group">
            <Button className="backButton" text="Cancel" />
            <Button
              className="footer-Subscribe-btn submit-button"
              text="Submit"
              onClick={() => setReportModal(true)}
            />
          </div>
          <GenericModal
            show={reportModal}
            onHide={handleReportModal}
            title=""
            body={<SuccessReport />}
            className=""
            close={true}
          />
        </Form>
      )}
    </Formik>
  );
};

export default Report;
