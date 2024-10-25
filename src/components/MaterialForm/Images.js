import React from 'react';
import MaterialFormImageLoader from './MaterialFormImageLoader';

const Images = ({ image1, setImage1, image2, setImage2, image3, setImage3, image4, setImage4, image5, setImage5 }) => {
  return (
    <ul className="my-4 grid gap-6 grid-cols-2 mt-6">
      <div>
        <MaterialFormImageLoader inputId="imageDownloader1" image={image1} setImage={setImage1} />
      </div>
      <div>
        <MaterialFormImageLoader inputId="imageDownloader2" image={image2} setImage={setImage2} />
      </div>
      <div>
        <MaterialFormImageLoader inputId="imageDownloader3" image={image3} setImage={setImage3} />
      </div>
      <div>
        <MaterialFormImageLoader inputId="imageDownloader4" image={image4} setImage={setImage4} />
      </div>
      <div>
        <MaterialFormImageLoader inputId="imageDownloader5" image={image5} setImage={setImage5} />
      </div>
    </ul>
  );
};

export default Images;
