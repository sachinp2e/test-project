import React, { useState} from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { CardType, cardTypeEnum } from '@/Components/AssetCard/helperMethod';
import ArrowBtnImg from '@/Assets/_images/arrow-circle-right.svg';
import Button from '@/Components/Button';
import { useAppDispatch, useAppSelector } from '@/Lib/hooks';
import { authSelector } from '@/Lib/auth/auth.selector';
import { DeleteBinIcon, EditIcon } from '@/Assets/svg';
import axiosInstance from '@/Lib/axios';
import { deleteDraft } from '@/Lib/users/users.slice';
import DeleteModel from "./deleteModel";

interface ICardFooterProps {
  isDraft?: boolean;
  isBids?: boolean;
  item: any;
  onClick: (id: string) => void;
  cardType: CardType;
}

const CardFooter: React.FC<ICardFooterProps> = ({
  isDraft,
  isBids,
  item,
  onClick,
  cardType,
}) => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { id, ownerId } = item || {};
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);

  const { id: userId } = useAppSelector(authSelector);

  const onDraftEdit = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/create-asset/single/${id}`);
  };

  const onDeleteDraft = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true)
  };

  const confirmationDelete = async () =>{
    try {
      const response = await axiosInstance.delete(`/draft/deleteDraftById/${id}`);
      if (response.status === 200) {
        setShowSuccessMessage(true)
      }
    } catch (err: any) {
      console.error(err);
    }
  }

  const successFullyDelete = () => {
    dispatch(deleteDraft(id));
    setIsOpen(false)
  }

  if (isBids) {
    return (
      <div className="bids-footer">
        <span>Active</span>
      </div>
    )
  }

  if (isDraft) {
    return (
      <div className="draft-footer">
        <Button
          isGradient
          isFilled
          onClick={onDraftEdit}
          element={<EditIcon />}
        />
        <Button
          isGradient
          isFilled
          className="ms-2"
          onClick={onDeleteDraft}
          element={<DeleteBinIcon />}
        />
        {isOpen &&
        <DeleteModel
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          successFullyDelete={successFullyDelete}
          showSuccessMessage={showSuccessMessage}
          confirmationDelete={confirmationDelete}
        />}
      </div>
    );
  }

  return (
    <Button
      isGradient
      isFilled
      className="buy-now-btn"
      name="Buy Now"
      onClick={() => onClick(id)}
      element={
        <div className="d-flex align-items-center">
          <span className="me-2">
            View Asset
            {/* {
              ownerId === userId
                ? 'View Asset'
                : cardType === cardTypeEnum.SINGLE_BID || cardType === cardTypeEnum.MULTIPLE_BID
                  ? 'Bid Now'
                  : cardType === cardTypeEnum.SINGLE_SALE || cardType === cardTypeEnum.MULTIPLE_SALE
                    ? 'Buy Now'
                    : 'Make Offer'
            } */}
          </span>
          <Image src={ArrowBtnImg} alt="arrow" />
        </div>
      }
    />
  );
};

export default CardFooter;
