import React, { useState } from 'react';
import ComicForm from '../../Components/ComicForm';

const ComicPage = () => {
  const [currentPanel, setCurrentPanel] = useState(1);
  const [comicData, setComicData] = useState([]);
  const [latestText, setLatestText] = useState('');

  const enqueueApiCall = async (panelNumber, panelText) => {
    try {
      const response = await fetch('https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud', {
        method: 'POST',
        headers: {
          'Accept': 'image/png',
          'Authorization': 'Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: panelText }),
      });

      if (!response.ok) {
        throw new Error('Image generation failed');
      }

      const imageData = await response.blob();
      const imageUrl = URL.createObjectURL(imageData);

      // Update the existing data entry or add a new one
      const existingIndex = comicData.findIndex((data) => data.panelNumber === panelNumber);
      if (existingIndex !== -1) {
        setComicData((prevData) => [
          ...prevData.slice(0, existingIndex),
          { panelNumber, panelText, imageUrl },
          ...prevData.slice(existingIndex + 1),
        ]);
      } else {
        setComicData((prevData) => [
          ...prevData,
          { panelNumber, panelText, imageUrl },
        ]);
      }
    } catch (error) {
      console.error('Error:', error.message);
      // Handle error and provide feedback to the user
    }
  };

  const onSubmitPanel = async (panelNumber, panelText) => {
    try {
      // Move to the next panel immediately
      setCurrentPanel((prevPanel) => prevPanel + 1);
  
      // Enqueue the API call for the current panel
      const response = await fetch('https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud', {
        method: 'POST',
        headers: {
          'Accept': 'image/png',
          'Authorization': 'Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: panelText }),
      });
  
      if (!response.ok) {
        throw new Error('Image generation failed');
      }
  
      const imageData = await response.blob();
      const imageUrl = URL.createObjectURL(imageData);
  
      // Update the existing data entry or add a new one
      const existingIndex = comicData.findIndex((data) => data.panelNumber === panelNumber);
      if (existingIndex !== -1) {
        setComicData((prevData) => [
          ...prevData.slice(0, existingIndex),
          { panelNumber, panelText, imageUrl },
          ...prevData.slice(existingIndex + 1),
        ]);
      } else {
        setComicData((prevData) => [
          ...prevData,
          { panelNumber, panelText, imageUrl },
        ]);
      }
  
      // Update the latestText state for the input box of the next panel
      setLatestText(panelText);
    } catch (error) {
      console.error('Error:', error.message);
      // Handle error and provide feedback to the user
    }
  };
  

  const onBackButtonClick = () => {
    // Move back to the previous panel
    setCurrentPanel((prevPanel) => prevPanel - 1);

    // Set the latestText state to the text of the previous panel
    const previousPanelData = comicData.find((data) => data.panelNumber === currentPanel - 1);
    setLatestText(previousPanelData ? previousPanelData.panelText : '');
  };

  const onNextButtonClick = async () => {
    // Move to the next panel
    setCurrentPanel((prevPanel) => prevPanel + 1);

    // Enqueue the API call for the next panel
    await enqueueApiCall(currentPanel + 1, latestText);
  };

  return (
    <div>
      <h1>Comic Creator</h1>
      <p>Create your own comic by filling in the text for each panel!</p>

      {currentPanel <= 10 ? (
        <>
          <ComicForm
            key={currentPanel}
            panelNumber={currentPanel}
            onSubmitPanel={onSubmitPanel}
            latestText={latestText}
          />
          <button onClick={onNextButtonClick} disabled={!comicData.some(data => data.panelNumber === currentPanel)}>Next</button>
        </>
      ) : (
        <p>Comic creation completed!</p>
      )}

      {currentPanel > 1 && (
        <button onClick={onBackButtonClick}>Back to Panel {currentPanel - 1}</button>
      )}

      {/* Display the generated images and text */}
      <div>
        {comicData.map(({ panelNumber, panelText, imageUrl }, index) => (
          <div key={index}>
            <h4>Comic Panel {panelNumber}</h4>
            <img src={imageUrl} alt={`Panel ${panelNumber}`} />
            <p>{panelText}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComicPage;
