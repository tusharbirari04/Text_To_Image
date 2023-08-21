import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DropdownComponent = () => {
  const [modelPaths, setModelPaths] = useState([]);
  const [selectedPath, setSelectedPath] = useState('');
  const [textInput, setTextInput] = useState('');
  const [guidanceScale, setGuidanceScale] = useState(0);
  const [decodedImage, setDecodedImage] = useState('');

  const url= 'http://b15d-35-240-244-154.ngrok.io'
  useEffect(() => {
   
    const getModelVersion = async() => {
      try{
        const getUrl = `${url}/model_version`
        const response = await axios.get(getUrl);
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
  
     axios.post(`${url}/${modelId}/select`,requestBody)
      .then(response => {
        const base64Image = response.data.image;
        setDecodedImage(base64Image);
      })
  }

  return (
    <>
    <div className="flex justify-center">
    <h2 class="text-2xl ml-12 font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">Fashion Difffusion System</h2>
    </div>
    <div className="mt-20  flex justify-center">
      <div className="mr-20 flex-col">

      <label className=" font-bold">Select a Model :</label>
      <select class="bg-gray-50 border  mt-4 ml-6 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500  p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500" value={selectedPath} onChange={handleDropdownChange}>
        {modelPaths.map(x => 
        <option key={x.id}>{x.path}</option>
        )}
      </select>
      <br/><br/>
      <form className= "flex flex-col" onSubmit={handleFormSubmit}>  
          <div className= "flex flex-row">
            
        <label className='mt-2 font-bold'>
          Text Input : &nbsp; 
          </label> 
             <textarea class="h-full w-4/5 rounded-md mt-3  ml-5 border-0  text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"  type="text" value={textInput} onChange={handleTextInputChange}></textarea>
          </div>
        <br/>
        <br/>
        <label className=' font-bold'>
          Guidance Scale :  &nbsp;
          <input class="flex-1 ml-3 rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" placeholder="0.00"type="number" value={guidanceScale} onChange={handleGuideancesChange}></input>
        </label>
        <br/>
        <button className=" ml-8 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow" type="submit">Submit</button>
      </form>
        </div>
      <div className="ml-20 float-right">
        <div className="flex flex-col">

        <label className='font-bold'>Generated Image</label>
        <div className='mt-2 border-3'>
      {decodedImage && <img src={`data:image/png;base64,${decodedImage}`} alt="Decoded" />}
          </div>
      </div>
        </div>
    </div>
        </>
  );
};

export default DropdownComponent;
