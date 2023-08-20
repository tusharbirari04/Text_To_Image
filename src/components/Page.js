import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DropdownComponent = () => {
  const [modelPaths, setModelPaths] = useState([]);
  const [selectedPath, setSelectedPath] = useState('');
  const [textInput, setTextInput] = useState('');
  const [guidanceScale, setGuidanceScale] = useState(0);
  const [decodedImage, setDecodedImage] = useState('');

  useEffect(() => {
   
    const getModelVersion = async() => {
      try{
        const url = 'http://ffce-34-143-135-119.ngrok.io/model_version'
        const response = await axios.get(url);
        const data=response.data
        console.log(data);
       // console.log(response);
       setModelPaths(data.modelPath);
      }catch(error){
        console.log(error);
      }
    }
    getModelVersion();
  }, []);

  const handleDropdownChange = event => {
    setSelectedPath(event.target.value);
  };
  const handleTextInputChange = event => {
    setTextInput(event.target.value);
  };
  const handleGuideancesChange = event => {
    setGuidanceScale(event.target.value)
  }

  const handleFormSubmit = event =>{
    event.preventDefault();
    let modelId=1;
    if(selectedPath === 'CompVis/stable-diffusion-v1-4'){
      modelId=1
    }
    else if(selectedPath === 'CompVis/stable-diffusion-v2-4'){
      modelId=2
    }else if(selectedPath === 'CompVis/stable-diffusion-v3-4'){
      modelId=3;
    }
    const requestBody= {
      prompt:textInput,
      guidance_scale:guidanceScale
    };
    
    const postUrl = 'http://ffce-34-143-135-119.ngrok.io'
     axios.post(`${postUrl}/${modelId}/select`,requestBody)
      .then(response => {
        const base64Image = response.data.image;
        setDecodedImage(base64Image);
      })
  }

  return (
    <div>
      <h2>Select a Model Path</h2>
      <select value={selectedPath} onChange={handleDropdownChange}>
        {modelPaths.map(x => 
        <option key={x.id}>{x.path}</option>
          )}
      </select>
      <br/><br/>
      <form onSubmit={handleFormSubmit}>  
        <label>
          Text Input: 
          <input type="text" value={textInput} onChange={handleTextInputChange}></input>
        </label> 
        <br/>
        <br/>
        <label>
          Guidance Scale: 
          <input type="number" value={guidanceScale} onChange={handleGuideancesChange}></input>
        </label>
        <br/>
        <button type="submit">Submit</button>
      </form>
      {decodedImage && <img src={`data:image/png;base64,${decodedImage}`} alt="Decoded" />}
    </div>
  );
};

export default DropdownComponent;
