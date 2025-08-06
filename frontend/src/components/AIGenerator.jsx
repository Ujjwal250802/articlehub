import React, { useState } from 'react';
import { X } from 'lucide-react';
import Draggable from 'react-draggable';

const AIGenerator = ({ onClose, onInsertText }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateText = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'Quicklify',
          prompt: prompt,
          stream: false
        })
      });
      
      const data = await response.json();
      setGeneratedText(data.response);
    } catch (error) {
      console.error('Error generating text:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsert = () => {
    if (generatedText) {
      onInsertText(generatedText);
      onClose();
    }
  };

  return (
    
      <div className="fixed inset-0 bg-white bg-opacity-5 flex items-center justify-center z-[60]">
        <div className="bg-white rounded-lg p-6 w-[90%] max-w-4xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Use Quicklify 😎</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 h-[60vh]">
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 overflow-y-auto max-h-[40vh]"
                placeholder="Enter your prompt here..."
              />
              <button
                onClick={generateText}
                disabled={isLoading}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isLoading ? 'Generating...' : 'Generate'}
              </button>
            </div>

            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">Generated Text</label>
              <div className="flex-1 p-3 border rounded-lg overflow-y-auto bg-gray-50 max-h-[40vh]">
                {generatedText || 'Generated text will appear here...'}
              </div>
              <button
                onClick={handleInsert}
                disabled={!generatedText}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-green-300"
              >
                Insert Text
              </button>
            </div>
          </div>
        </div>
      </div>
  );
};

export default AIGenerator;
