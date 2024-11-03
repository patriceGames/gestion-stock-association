import React from 'react';
import MaterialFormImageLoader from './MaterialFormImageLoader';

const Images = ({ formData, handleChange }) => {
  return (
    <ul className="my-4 grid gap-6 grid-cols-2 mt-6">
      <div>
        <MaterialFormImageLoader inputId="imageDownloader1" image={formData.image1} name="image1" handleChange={handleChange} />
      </div>
      <div>
        <MaterialFormImageLoader inputId="imageDownloader2" image={formData.image2} name="image2" handleChange={handleChange} />
      </div>
      <div>
        <MaterialFormImageLoader inputId="imageDownloader3" image={formData.image3} name="image3" handleChange={handleChange} />
      </div>
      <div>
        <MaterialFormImageLoader inputId="imageDownloader4" image={formData.image4} name="image4" handleChange={handleChange} />
      </div>
      <div>
        <MaterialFormImageLoader inputId="imageDownloader5" image={formData.image5} name="image5" handleChange={handleChange} />
      </div>
    </ul>
  );
};

export default Images;
