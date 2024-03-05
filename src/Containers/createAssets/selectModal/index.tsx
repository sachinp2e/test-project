import React, { useState, useRef, useEffect} from 'react';
import { AddIcon, ArrowDown, DeleteIcon } from '@/Assets/svg';
import { Col, Row } from 'react-bootstrap';
import './select-modal.scss';

interface ISelectModalProps {
  inputFields: any[];
  setInputFields: React.Dispatch<React.SetStateAction<any[]>>;
}


const SelectModal:React.FC<ISelectModalProps> = ({inputFields,setInputFields}) => {
  const [isArrowRotated, setIsArrowRotated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const EndRef = useRef(null)
  //
  // const scrollToBottom = () => {
  //   EndRef.current?.scrollIntoView({ behavior: "smooth" })
  // }
  //
  // useEffect(() => {
  //   scrollToBottom()
  // }, [inputFields]);


  const handleChange = (id: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const index = inputFields.findIndex((field) => field.id === id);
    if (index !== -1) {
      setInputFields((prevFields) => (
        [
          ...prevFields.slice(0, index),
          { ...prevFields[index], [name]: value },
          ...prevFields.slice(index + 1)
        ]
      ));
    }
  };

  const handleAddField = () => {
    setInputFields((prevFields) => [...prevFields, { id: prevFields.length + 1, key: '', value: '' }]);
  };

  const handleRemoveField = (id: number) => {
    setInputFields((prevFields) => prevFields.filter((field) => field.id !== id));
  };

  const handleArrowClick = () => {
    setIsArrowRotated((prev) => !prev);
    setIsModalOpen((prev) => !prev);
  };

  return (
    <div className="select-modal-container">
      <label htmlFor="">Advanced Settings (optional)</label>
      <div className="dropdown-container" onClick={handleArrowClick}>
        <span>Properties</span>
        <div
          className={`arrow-handle ${isArrowRotated ? 'arrow-rotated' : ''}`}
        >
          <ArrowDown />
        </div>
      </div>
      {isModalOpen && (
        <div id="custom-modal">
          <Row className="">
            <Col className="">
              <span>Key</span>
            </Col>
            <Col className="">
              <span>Value</span>
            </Col>
          </Row>
          <div className="key-value-input">
            {inputFields.map((input) => {
              return (
                <Row className="" key={input.id}>
                  <Col className=" d-flex">
                    <input
                      onChange={handleChange(input.id)}
                      name="key"
                      value={input.key}
                      type="text"
                      placeholder="Enter Key"
                    />
                  </Col>
                  <Col className=" d-flex value-content">
                    <input
                      onChange={handleChange(input.id)}
                      name="value"
                      value={input.value}
                      type="text"
                      placeholder="Enter Value"
                    />
                    {inputFields.length > 1 &&
                      <div onClick={() => handleRemoveField(input.id)} className="key-value-icons">
                        <DeleteIcon />
                      </div>}
                  </Col>
                </Row>

              );
            })}

            {inputFields.length < 30 && <div onClick={handleAddField} className="add-new">
              <AddIcon/>
              Add New
            </div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectModal;
