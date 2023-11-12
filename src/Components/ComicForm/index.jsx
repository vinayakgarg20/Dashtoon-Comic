import React, { useState } from 'react';

const ComicForm = ({ panelNumber, onSubmitPanel, updateProgress }) => {
  const [panelText, setPanelText] = useState('');
  const handleInputChange = (e) => {
    setPanelText(e.target.value);
  };

  const handleSubmit = async () => {
    // Call the parent function to handle API call and data storage
    await onSubmitPanel(panelNumber, panelText);
    // Update progress in the parent component
    updateProgress();
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
