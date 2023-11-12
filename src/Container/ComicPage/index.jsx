import React, { useState } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import ComicForm from "../../Components/ComicForm";

const ComicPage = () => {
  const [currentPanel, setCurrentPanel] = useState(1);
  const [comicData, setComicData] = useState([]);
  const [latestText, setLatestText] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editableText, setEditableText] = useState("");
  const totalPanels = 10;

  const enqueueApiCall = async (panelNumber, panelText) => {
    const url =
      "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "image/png",
          Authorization:
            "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: panelText }),
      });

      if (!response.ok) {
        throw new Error("Image generation failed");
      }

      const imageData = await response.blob();
      const imageUrl = URL.createObjectURL(imageData);

      // Update the existing data entry or add a new one
      const existingIndex = comicData.findIndex(
        (data) => data.panelNumber === panelNumber
      );
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

      console.log(comicData);
    } catch (error) {
      console.error("Error:", error.message);
      // Handle error and provide feedback to the user
    }
  };

  const onSubmitPanel = async (panelNumber, panelText) => {
    // Move to the next panel immediately
    setCurrentPanel((prevPanel) => prevPanel + 1);
    // updateProgress();
    // Enqueue the API call for the current panel
    await enqueueApiCall(panelNumber, panelText);

    // Update the latestText state for the input box of the next panel
    setLatestText(panelText);

    // Reset editable text state
    setEditableText("");

    // Calculate progress based on the current panel number
  };

  const onBackButtonClick = () => {
    // Move back to the previous panel
    setCurrentPanel((prevPanel) => prevPanel - 1);

    // Set the latestText state to the text of the previous panel
    const previousPanelData = comicData.find(
      (data) => data.panelNumber === currentPanel - 1
    );
    setLatestText(previousPanelData ? previousPanelData.panelText : "");

    // Reset editable text state
    setEditableText("");
      updateProgress();
    
  };

  const onNextButtonClick = async () => {
    // Move to the next panel
    setCurrentPanel((prevPanel) => prevPanel + 1);
    updateProgress();
    // Enqueue the API call for the next panel
    await enqueueApiCall(currentPanel + 1, latestText);

    // Reset editable text state
    setEditableText("");
    
    // Calculate progress based on the current panel number
   
  };

  const onEditTextClick = (panelNumber, initialText) => {
    setEditMode(panelNumber);
    setEditableText(initialText);
  };

  const onEditSubmit = (panelNumber) => {
    // Update the text for the specified panel
    setComicData((prevData) => {
      const newData = [...prevData];
      const index = newData.findIndex(
        (data) => data.panelNumber === panelNumber
      );
      if (index !== -1) {
        newData[index].panelText = editableText;
      }
      return newData;
    });

    // Exit edit mode
    setEditMode(null);
  };
// updating progress bar
  const updateProgress = () => {
    // Calculate progress based on the current panel number
    const progress = (currentPanel / totalPanels) * 100;
    setProgress(progress);
  };

  const [progress, setProgress] = useState((currentPanel/totalPanels)*100);

  return (
    <div>
      <h1>Comic Creator</h1>
      <p>Create your own comic by filling in the text for each panel!</p>

      {/* Display the progress bar */}
      <ProgressBar
        completed={progress}
        bgColor="#6AC154"
        height="20px"
        isLabelVisible={true}
        labelColor="#1A1A1A"
      />

      {currentPanel <= totalPanels ? (
        <>
          <ComicForm
            key={currentPanel}
            panelNumber={currentPanel}
            onSubmitPanel={onSubmitPanel}
            updateProgress={updateProgress}
          />
          <button
            onClick={onNextButtonClick}
            disabled={
              !comicData.some((data) => data.panelNumber === currentPanel)
            }
          >
            Next
          </button>
        </>
      ) : (
        <p>Comic creation completed!</p>
      )}

      {currentPanel > 1 && <button onClick={onBackButtonClick}>Back</button>}

      {/* Display the generated images and text */}
      <div>
        {comicData.map(({ panelNumber, panelText, imageUrl }, index) => (
          <div
            key={index}
            style={{ position: "relative", display: "inline-block" }}
          >
            <h4>Comic Panel {panelNumber}</h4>
            <img
              src={imageUrl}
              alt={`Panel ${panelNumber}`}
              style={{ width: "300px", height: "300px" }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                padding: "8px",
                background: "rgba(255, 255, 255, 0.7)",
              }}
            >
              {editMode === panelNumber ? (
                <div>
                  <input
                    type="text"
                    value={editableText}
                    onChange={(e) => setEditableText(e.target.value)}
                  />
                  <button onClick={() => onEditSubmit(panelNumber)}>
                    Submit
                  </button>
                </div>
              ) : (
                <p>{panelText}</p>
              )}
              <button onClick={() => onEditTextClick(panelNumber, panelText)}>
                Edit Text
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComicPage;
