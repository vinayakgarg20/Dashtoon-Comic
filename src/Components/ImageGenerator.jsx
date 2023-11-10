import React, { useState } from 'react';
import axios from 'axios';

const ImageGenerator = () => {
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState(null);

  const handleInputChange = (event) => {
    setTextInput(event.target.value);
  };

  const generateImage = () => {
    setLoading(true);

    const data = JSON.stringify({
      "inputs": textInput,
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud',
      headers: { 
        'Accept': 'image/png', 
        'Authorization': 'Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM', 
        'Content-Type': 'application/json'
      },
      data:data,
      responseType: 'arraybuffer', // Added to handle binary data
    };

    axios.request(config)
      .then((response) => {
        const blob = new Blob([response.data], { type: 'image/png' });
        const imageUrl = URL.createObjectURL(blob);
        setImageData(imageUrl);
        console.log(imageData,' 🥺');
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <label>
        Enter Text:
        <input type="text" value={textInput} onChange={handleInputChange} />
      </label>
      <button onClick={generateImage} disabled={loading}>
        Generate Image
      </button>

      {loading && <p>Loading...</p>}

      {imageData && (
        <div>
          <img src={imageData} alt="Generated Image" />
        </div>
      )}
    </div>
  );
};

export default ImageGenerator;
