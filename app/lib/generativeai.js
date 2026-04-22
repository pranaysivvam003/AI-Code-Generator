import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const CodeGeneration = () => {
  const [prompt, setPrompt] = useState('');
  const apiKey = process.env.GENERATIVE_AI_API_KEY; 

  const generateCode = async () => {
    if (!apiKey || !prompt) {
      return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'CODEY' });

    try {
      const request = {
        prompt,
      };
      const response = await model.generateCode(request);
      return response
    } catch (error) {
      console.error(error);
    }
  };

};

export default CodeGeneration;
