import React from 'react';

const ComicLayout = ({ comicData }) => {
  return (
    <div>
      <h2>Generated Images</h2>
      {comicData.map(({ panelNumber, imageUrl }, index) => (
        <div key={index}>
          <h4>Comic Panel {panelNumber}</h4>
          <img src={imageUrl} alt={`Panel ${panelNumber}`} style={{ width: '300px', height: '300px' }} />
        </div>
      ))}
    </div>
  );
};

export default ComicLayout;
