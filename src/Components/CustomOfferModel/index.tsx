import React from 'react';
import { Modal } from 'react-bootstrap';
import './customoffermodel.scss';
import { CloseModalIcon } from '../../Assets/svg';

interface ICustomOfferModel {
  show: boolean;
  icon?: any;
  title?: string;
  discription: string;
  text: string;
  navigatelogin?: boolean;
  image?: string;
  skip?: string;
  onHide: () => void;
  handleClick?: () => void;
}

const CustomOfferModel: React.FC<ICustomOfferModel> = (props) => {
  const { icon, title, discription, text, navigatelogin, image, skip, handleClick, ...rest } = props;

  const handleModal = () => {
    alert('hello');
  };

  return (
    <Modal
      {...rest}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="custom-modal-container"
    >
      <Modal.Body>
        <div className='offer-main-wrapper'>
          <div className='sub-offer-main-wrapper'>

            <div className='header-offer'>
              <div className='accept-offer'>
                {/*Accept Offer*/}

                Working Progess....
              </div>
              <div>
                <CloseModalIcon />
              </div>
            </div>

            <div className='horizontal-line'/>

          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};
export default CustomOfferModel;
