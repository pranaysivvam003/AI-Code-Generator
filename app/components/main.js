"use client"

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import Image from 'next/image';
import Sidebar from "./sidebar";
import PreviewScreen from "./preview";
import CodeViewer from './codeViewer';
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import styles from './main.module.css'

const Main = () => {
  const [code, setCode] = useState([]);
  const [displayCode, setDisplayCode] = useState(code[0]);
  const [showCode, setShowCode] = useState(false);
  const [prompt, setPrompt] = useState('');
  const navigate = useRouter();

  const MODEL_NAME = "gemini-1.0-pro";
  const API_KEY = "AIzaSyAHgoWvcNoYBX4rpGzy2590AJDFFb0ghVY";
  const toggleScreen = () => {
    setShowCode(!showCode);
  };

  const getCodes = (codes) => {
    setCode([...code, ...codes])
  }

  const disCode = (code) => {
    setDisplayCode(code)
  }

  async function addCodeToDb(code) {
    const authToken = Cookies.get('userToken');

    const details = {
      code,
      prompt
    };

    const options = {
      headers: {
        Authorization: authToken,
      },
      method: "POST",
      body: JSON.stringify(details),
    };

    try {
      const response = await fetch('/api/code', options);
      if (!response.ok) {
        throw new Error('Failed to add code: ' + response.statusText);
      }
    } catch (error) {
      console.error('Error adding code:', error);
    }
  }

  const generateCode = async (e) => {
    e.preventDefault();
    const aiToken = Cookies.get('userToken');
    if (!aiToken) {
      return navigate.push('/login');
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };

    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];

    const chat = model.startChat({
      generationConfig,
      safetySettings,
      history: [],
    });

    const result = await chat.sendMessage(prompt);
    const response = result.response?.candidates[0]?.content?.parts[0]?.text;

    function removeFirstLine(htmlString) {
      return htmlString.split('\n').slice(1).join('\n');
    }

    let generatedCode = null;

    if (response.startsWith("```") && response.endsWith("```")) {
      const fcode = response.slice(3, -3);
      generatedCode = removeFirstLine(fcode);
    } else {
      generatedCode = removeFirstLine(response);
    }

    setCode([generatedCode, ...code]);
    addCodeToDb(generatedCode);
    setDisplayCode(generatedCode);
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.sidebarContainer}>
        <aside>
          <Sidebar code={code} getCodes={getCodes} disCode={disCode} />
        </aside>
      </div>
      <div className={styles.previewContainer}>
        <div className=''>
          <div className='flex w-fit rounded-xl mt-4 mb-2 m-auto border justify-center items-center p-2'>
            <button type='button' className={showCode ? styles.showButton : styles.showButtonActive} onClick={toggleScreen}>
              Show Preview
            </button>
            <button type='button' className={!showCode ? styles.showButton : styles.showButtonActive} onClick={toggleScreen}>
              Show code
            </button>
          </div>

          <div>
            {showCode ?
              <div className='w-full h-100 mt-2 bg-gray-800 text-gray-600'>
                <div className='w-full flex justify-end'>
                  <button type='button' className='p-4 bg-white m-2' onClick={() => { navigator.clipboard.writeText(displayCode) }}>
                    <Image src='/copy.svg' alt='copy' height={20} width={20} />
                  </button>
                </div>
                <div className='w-50 h-50'>
                  <CodeViewer code={displayCode} />
                </div>
              </div>
              :
              <div className='min-h-500 w-50 m-auto'>
                <PreviewScreen className='min-h-100' html_code={displayCode} />
              </div>
            }
          </div>
        </div>
        <form className={styles.form} onSubmit={generateCode}>
          <input id='promptInput' className="w-full p-2" type="text" onChange={(e) => setPrompt(e.target.value)} placeholder="Enter your prompt" value={prompt} />
          <button id='generateBtn' className={styles.generateButton} type="submit">Generate</button>
        </form>
      </div>
    </div>
  );
};

export default Main;
