import React from "react";
import Button from "../Button/index";
import CustomModal from '@/Components/CustomModal';
import DeleteAnimationLogo from "@/Assets/_images/DeleteAnimation.gif";
import Image from 'next/image';
import './style.scss';


interface IDeleteModel {
  isOpen: boolean;
  setIsOpen: (value:boolean)=>void
  showSuccessMessage: boolean;
  confirmationDelete: () => void;
  successFullyDelete: () => void;
}

const DeleteModel: React.FC<IDeleteModel> = (props) => {
  const {isOpen, setIsOpen, showSuccessMessage, confirmationDelete, successFullyDelete} = props
  return (
    <>
      <CustomModal show={isOpen}>
        {showSuccessMessage ? (
          <div className="success_model delete_sucessful">
            <h3>Deleted Successfully</h3>
            <div className="success_model_btn delete_sucessful_btn">
              <Button
                isGradient
                isFilled
                onClick={successFullyDelete}
                text="OK"
              />
            </div>
          </div>
        ) : (
          <div className="success_model">
              <Image
                src={DeleteAnimationLogo}
                className="success-animation"
                width={100}
                alt="stamp"
                quality={100}
              />
            <h5>Are you sure you want to delete this draft?</h5>
            <div className="success_model_btn">
              <Button
                isGradient
                text="No"
                onClick={() => setIsOpen(false)}
              />
              <Button
                isGradient
                isFilled
                onClick={confirmationDelete}
                text="Yes"
              />
            </div>
          </div>
        )}
      </CustomModal>
    </>
  )
}

export default DeleteModel