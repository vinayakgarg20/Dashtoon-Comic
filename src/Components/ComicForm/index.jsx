import React, { useState, useEffect } from 'react';

const ComicForm = ({ panelNumber, onSubmitPanel, latestText, storedText }) => {
  const [panelText, setPanelText] = useState('');

  useEffect(() => {
    // Update the input box text when the latestText prop changes
    setPanelText(latestText);
  }, [latestText]);

  useEffect(() => {
    // Initialize the input box text when the storedText prop changes
    setPanelText(storedText || '');
  }, [storedText]);

  const handleInputChange = (e) => {
    setPanelText(e.target.value);
  };

  const handleSubmit = () => {
    // Call the parent function to handle API call and data storage
    onSubmitPanel(panelNumber, panelText);
  };

  return (
    <div>
      <h3>Comic Panel {panelNumber}</h3>
      <textarea
        value={panelText}
        onChange={handleInputChange}
        placeholder="Enter text for the comic panel"
      />
      <button onClick={handleSubmit}>Generate Image</button>
    </div>
  );
};

export default ComicForm;
