  const generateCode = async (e) => {

    e.preventDefault()
    const apiKey = 'VBjAw7n8YLaEeEROqbArSe8xb6z3568w'
    const api = 'https://api.ai21.com/studio/v1/j2-ultra/complete'

    const response = await
      fetch(api, {
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "prompt": prompt,
          "numResults": 1,
          "epoch": 0,
          "maxTokens": 8111,
          "temperature": 0.4,
          "topKReturn": 0,
          "topP": 1,
          "presencePenalty": {
            "scale": 0,
            "applyToNumbers": true,
            "applyToPunctuations": true,
            "applyToStopwords": true,
            "applyToWhitespaces": true,
            "applyToEmojis": true
          },
          "countPenalty": {
            "scale": 0,
            "applyToNumbers": true,
            "applyToPunctuations": true,
            "applyToStopwords": true,
            "applyToWhitespaces": true,
            "applyToEmojis": true
          },
          "frequencyPenalty": {
            "scale": 0,
            "applyToNumbers": true,
            "applyToPunctuations": true,
            "applyToStopwords": true,
            "applyToWhitespaces": true,
            "applyToEmojis": true
          },
          "stopSequences": []
        }),
        method: "POST"
      });

    const data = await response.json()
    const generatedText = data.completions[0].data.text;
   setCode((prevState) => [...prevState, generatedText]);
//     const regex = /<html>(.*?)<\/html>/s;
// const extractedCode = generatedText.match(regex)[1]
//     console.log('generated code',extractedCode)
  }





  // node --version # Should be >= 18
// npm install @google/generative-ai

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const MODEL_NAME = "gemini-1.0-pro";
const API_KEY = "YOUR_API_KEY";

async function runChat() {
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
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];

  const chat = model.startChat({
    generationConfig,
    safetySettings,
    history: [
      {
        role: "user",
        parts: [{ text: "give navbar code"}],
      },
      {
        role: "model",
        parts: [{ text: "```html\n\n  Navbar\n  \n\n  \n    \n      \n        Home (current)\n      \n      \n        About\n      \n      \n        Services\n      \n      \n        Contact\n      \n    \n    \n  \n\n```"}],
      },
    ],
  });

  const result = await chat.sendMessage("YOUR_USER_INPUT");
  const response = result.response;
  console.log(response.text());
}

runChat();