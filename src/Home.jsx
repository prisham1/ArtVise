'use client'
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, ImageIcon, Palette, Zap, BarChart } from 'lucide-react';
import image1 from './images/image1.png';

export default function Home() {
  // Intialize states for setting images for analysis
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [colors, setColors] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [segmentationImage, setSegmentationImage] = useState(null);
  const [styleImage, setStyleImage] = useState(null);

  // const onDropMain = useCallback((acceptedFiles) => {setMainImage(acceptedFiles[0]);}, [])
  const onDropSegmentation = (acceptedFiles) => setSegmentationImage(acceptedFiles[0]);
  const onDropStyle = (acceptedFiles) => setStyleImage(acceptedFiles[0]);

  const onDropMain = useCallback((acceptedFiles) => {
    console.log("Running with file %s", acceptedFiles[0]);
    setMainImage(acceptedFiles[0]);

    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);

    axios.post('http://localhost:3001/upload', formData)
      .then(response => {
        console.log('Colors received:', response.data.colors);
        setColors(response.data.colors); // Update state with colors
      })
      .catch(error => {
        console.error('Error uploading file:', error);
      });
  }, []);

  const onDrop = (acceptedFiles) => {
    console.log("Running with file %s", acceptedFiles[0]);
    setImage(acceptedFiles[0]);

    const formData = new FormData();
    formData.append('file', acceptedFiles[0]);

    axios.post('http://localhost:3001/upload', formData)
        .then(response => {
            console.log('Colors received:', response.data.colors);
            setColors(response.data.colors); // Update state with colors
        })
        .catch(error => {
            console.error('Error uploading file:', error);
        });
};

const { getRootProps: getMainRootProps, getInputProps: getMainInputProps } = useDropzone({ onDrop: onDropMain });
const { getRootProps: getSegmentationRootProps, getInputProps: getSegmentationInputProps } = useDropzone({ onDrop: onDropSegmentation });
const { getRootProps: getStyleRootProps, getInputProps: getStyleInputProps } = useDropzone({ onDrop: onDropStyle });

const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // Fetch user name from the backend
  useEffect(() => {
    axios.get('http://localhost:3001/user')
      .then(result => {
        console.log(result.data); // Debug logging to check the response
        setName(result.data.name); // Ensure this matches the structure of your JSON response
      })
      .catch(err => {
        console.error('Error fetching user name:', err); // Log the error
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      <div className="container mx-auto px-4 py-8">
        {/* ArtVise Logo */}
        <div className="flex justify-center mb-8">
        </div>

        {/* Animated Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.0 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Welcome to ArtVise - Your AI-Powered Art Analysis Tool
          </h2>
          <div>
            <img src={image1} alt="ArtVise Image"/>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar with Main Upload Dropbox */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Upload Main Image</h3>
              <div
                {...getMainRootProps()}
                className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
              >
                <input {...getMainInputProps()} />
                <Upload className="mx-auto text-blue-500 mb-2" size={24} />
                <p className="text-sm text-gray-600">
                  Drag & drop an image here, or click to select one
                </p>
              </div>
              
              {mainImage && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600">Selected: {mainImage.name}</p>
                </div>
              )}
            </div>

{/* Color Palette */}
<div className="mt-6 bg-gray-200 rounded-lg shadow-lg p-6">
  <h3 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center justify-center">
    <Palette className="mr-2 text-pink-500" size={24} />
    Color Palette
  </h3>
  <div className="flex flex-wrap gap-2 justify-center">
    {console.log('These are all the colors', colors)} {/* Debugging */}
    {colors.map((color, index) => (
      <div
        key={index}
        className="w-32 h-32 rounded-lg flex flex-col items-center justify-center"
        style={{ backgroundColor: color.hex }}
        title={`${color.name} (${color.hex})`}
      >
        <span className="text-white font-bold">{color.name}</span>
        <span className="text-white font-bold">{color.hex}</span>
      </div>
    ))}
  </div>

  {colors.length === 0 && (
    <p className="mt-2 text-sm text-gray-600 text-center">
      No colors extracted yet. Upload an image to see its color palette.
    </p>
  )}
</div>

           

            {/* Quick Analysis Feature */}
            <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <Zap className="mr-2 text-yellow-500" size={24} />
                Quick Analysis
              </h3>
              <button className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors">
                Analyze Image
              </button>
              <p className="mt-2 text-sm text-gray-600">
                Get instant insights about your image's composition and style.
              </p>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full md:w-3/4 space-y-8">

            {/* Image Segmentation Box */}
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
                <ImageIcon className="mr-2" size={24} />
                Image Segmentation
              </h3>
              <p className="text-white mb-4">
                Upload an image to perform AI-powered segmentation and analysis.
              </p>
             
              <iframe
                src="https://awacke1-image-to-line-drawings.hf.space"
	            frameborder="0"
	            width="850"
	            height="450"
            ></iframe>

          
              {segmentationImage && (
                <div className="mt-4">
                  <p className="text-sm text-white">Selected: {segmentationImage.name}</p>
                </div>
              )}
            </div>

            {/* Style Analysis Box */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
                <Palette className="mr-2" size={24} />
                Style Analysis
              </h3>
              <p className="text-white mb-4">
                Discover the artistic style and influences in your uploaded image.
              </p>
              {/*<div
                {...getStyleRootProps()}
                className="border-2 border-dashed border-white rounded-lg p-6 text-center cursor-pointer hover:bg-pink-400 transition-colors"
              >
                <input {...getStyleInputProps()} />
                <Upload className="mx-auto text-white mb-2" size={24} />
                <p className="text-sm text-white">
                  Drag & drop an image for style analysis, or click to select one
                </p>
              </div>*/}
              {/*Custom hugging face model*/}
              <iframe
                src="https://prisham123-imagestyleclassifier.hf.space"
                frameborder="0"
                width="850"
                height="450"
              ></iframe>

              {styleImage && (
                <div className="mt-4">
                  <p className="text-sm text-white">Selected: {styleImage.name}</p>
                </div>
              )}
            </div>

            

            {/* Comparative Analysis */}
            <div className="bg-gradient-to-r from-green-300 to-teal-600 rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-white flex items-center">
                <BarChart className="mr-2" size={24} />
                Comparative Analysis
              </h3>
              <p className="text-white mb-4">
                Compare multiple images to identify similarities and differences in style and composition.
              </p>
              <button className="bg-white text-green-600 py-2 px-4 rounded-lg hover:bg-green-100 transition-colors">
                Start Comparison
                </button>
                {/* Add the iframe at the bottom-right corner */}
                <div style={{ position: 'absolute', bottom: 370, left: 1100, width: '300px', height: '300px', resize: 'both', overflow: 'auto', border: '1px solid #ccc' }}>
    <iframe
      src="https://aichatbot.sendbird.com/playground/index.html?app_id=50D3CF7F-59DF-4E9B-90BB-D74A76572BE0&bot_id=M-l7FQT6FiBLCs0NUbVRj&region=us-3"
      width="100%"
      height="100%"
      frameBorder="0"
      style={{ border: 'none' }}
    ></iframe>
  </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
}

