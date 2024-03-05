import React, {useEffect, useState} from 'react';
import Image from "next/image";
import HeartIcon1 from "../../Assets/_images/red-heart-1.png";
import HeartIcon6 from "../../Assets/_images/red-heart-6.png";
import HeartIcon3 from "../../Assets/_images/red-heart-3.png";
import HeartIcon4 from "../../Assets/_images/red-heart-4.png";
import HeartIcon5 from "../../Assets/_images/red-heart-5.png";

interface ICustomFavAndUnFav {
  favBtn:boolean;
}

const images = [
  HeartIcon1,
  HeartIcon6,
  HeartIcon3,
  HeartIcon4,
  HeartIcon5,
  HeartIcon6
];

const CustomFavAndUnFav: React.FC<ICustomFavAndUnFav> = (props) => {
  const {favBtn} = props
  const [currentImage, setCurrentImage] = useState(favBtn ? 5 : 0);

  useEffect(() => {
    if (favBtn && currentImage === 0) {
      images.forEach((image, index) => {
        setTimeout(() => {
          setCurrentImage(index);
        }, index * 200);
      });
    } else if (!favBtn && currentImage === 5){
      let intervalId: NodeJS.Timeout;
      let reversedIndex = images.length - 1;
      intervalId = setInterval(() => {
        setCurrentImage(reversedIndex);
        reversedIndex--;

        if (reversedIndex < 0) {
          clearInterval(intervalId);
        }
      }, 200);
    } else if(favBtn){
      setCurrentImage(5)
    } else {
      setCurrentImage(0)
    }
  }, [favBtn]);

  return (
    <>
      <Image
        src={images[currentImage]}
        alt={`Image ${currentImage + 1}`}
      />
    </>
  )
}
export default CustomFavAndUnFav
