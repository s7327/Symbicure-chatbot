import React, { useState } from "react";
import axios from "axios";

const AIHealthAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file && !query) return alert("Please upload a file or enter a query");

    setLoading(true);
    const formData = new FormData();
    if (file) formData.append("file", file);
    if (query) formData.append("query", query);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      const res = await axios.post(`${backendUrl}/analyze`, formData);

      setResponse(res.data.response);
    } catch (error) {
      console.error(error);
      setResponse("An error occurred while processing your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-6 text-white">
          <h1 className="text-3xl font-bold flex items-center">
            <span className="mr-2">🩺</span> AI Health Analyzer
          </h1>
          <p className="mt-2 opacity-90">
            Upload medical images or documents for AI-powered health analysis
          </p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <p className="text-sm text-blue-800 mb-4">
                Upload a medical image (JPG/PNG) or PDF, or type a health query. 
                Your input will be analyzed using the Gemini API.
              </p>
              
              <div className="border-2 border-dashed border-blue-200 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <input 
                  type="file" 
                  id="file-upload" 
                  accept=".pdf,image/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-blue-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    {fileName ? (
                      <span className="text-blue-600 font-medium">{fileName}</span>
                    ) : (
                      <span className="text-gray-500">Drop file here or click to browse</span>
                    )}
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Health Query
              </label>
              <textarea
                rows="4"
                placeholder="Type your medical question here..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                "Analyze with AI"
              )}
            </button>
          </form>

          {response && (
            <div className="mt-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                <svg className="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                AI Analysis Results
              </h2>
              <div
                className="prose prose-blue max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: response }}
              />
            </div>
          )}
        </div>
      </div>
      
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>This tool is for informational purposes only. Always consult with healthcare professionals.</p>
      </footer>
    </div>
  );
};

export default AIHealthAnalyzer;