import React from 'react';
import Image from 'next/image';
import TravaImg from '../../../Assets/_images/treva-img.svg';
import AvenImg from '../../../Assets/_images/aven-img.svg';
import ValocityImg from '../../../Assets/_images/valocity-img.svg';
import CircleImg from '../../../Assets/_images/circle-img.svg';
import HexaImg from '../../../Assets/_images/hexa-img.svg';
import AmaraImg from '../../../Assets/_images/amara-img.svg';
import IdeaaImg from '../../../Assets/_images/ideaa-img.svg';
import './trustedpartners.scss';

const data = [
  {
    id: 1,
    img: TravaImg,
    alt: 'treva image',
  },
  {
    id: 2,
    img: AvenImg,
    alt: 'aven image',
  },
  {
    id: 3,
    img: ValocityImg,
    alt: 'valocity image',
  },
  {
    id: 4,
    img: CircleImg,
    alt: 'circle image',
  },
  {
    id: 5,
    img: HexaImg,
    alt: 'hexa image',
  },
  {
    id: 6,
    img: AmaraImg,
    alt: 'amara image',
  },
  {
    id: 7,
    img: IdeaaImg,
    alt: 'ideaa image',
  },
];

const TrustedPartners = () => {
  return (
    <div className="trusted-partners-main-wrapper">
      <div className="sub-trusted-partners-main-wrapper">
        <div className="title-trusted-partners">
          <span>trusted partners</span>
        </div>
        <div className="card-trusted-partners">
          <div className="sub-card-trusted-partners">
            {data.map((item) => (
              <div key={item.id} className="final-card-trusted-partners">
                <Image
                  src={item.img}
                  className="Image-card-trusted-partners"
                  alt={item.alt}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustedPartners;
