import React, { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';

const apiUrl ='http://localhost:8000';

function App() {
  // State for HTML generation
  const [prompt, setPrompt] = useState('');
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  const [selectedModel, setSelectedModel] = useState('llama');
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('htmlGenerationHistory');
    return saved ? JSON.parse(saved) : [];
  });
  
 // Refs
const iframeRef = useRef(null);

// Save history to localStorage whenever it changes
useEffect(() => {
  localStorage.setItem('htmlGenerationHistory', JSON.stringify(history));
}, [history]);

// Update iframe preview when HTML changes - FIXED VERSION
useEffect(() => {
  if (iframeRef.current && generatedHtml) {
    // Using srcDoc instead of document.write for better reliability
    iframeRef.current.srcDoc = generatedHtml;
  }
}, [generatedHtml, activeTab]);

  // Handle HTML generation
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setGeneratedHtml('');
    
    try {
      const response = await fetch(`${apiUrl}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: prompt,
          model: selectedModel
        }),
      });
      
      const data = await response.json();
      const html = data.code || data.html || data.result || '<div class="error">No HTML generated</div>';
      setGeneratedHtml(html);
      
      // Save to history
      const newHistoryItem = {
        id: Date.now(),
        prompt: prompt,
        html: html,
        model: selectedModel,
        timestamp: new Date().toISOString()
      };
      setHistory(prev => [newHistoryItem, ...prev].slice(0, 20));
      
    } catch (error) {
      console.error('Generation error:', error);
      const errorHtml = `<div style="padding: 2rem; text-align: center; color: #dc2626;">
        <h2>Generation Failed</h2>
        <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>`;
      setGeneratedHtml(errorHtml);
    } finally {
      setIsGenerating(false);
    }
  };

  // Download HTML file
  const handleDownload = () => {
    if (!generatedHtml) return;
    
    const blob = new Blob([generatedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Copy to clipboard
  const handleCopy = async () => {
    if (!generatedHtml) return;
    try {
      await navigator.clipboard.writeText(generatedHtml);
      alert('HTML copied to clipboard!');
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  // Load history item
  const loadFromHistory = (item) => {
    setPrompt(item.prompt);
    setGeneratedHtml(item.html);
    setActiveTab('preview');
  };

  // Clear history
  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear all history?')) {
      setHistory([]);
      localStorage.removeItem('htmlGenerationHistory');
    }
  };

  // Delete single history item
  const deleteHistoryItem = (id, e) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  // Example prompts
  const examplePrompts = [
    "Create a modern login page with gradient background.",
    "Build a responsive pricing table with 3 tiers.",
    "Build a Calculator app."
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900 font-sans">
      {/* Navigation */}
      <nav className="relative z-10 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              CodeCraft AI<span className="text-indigo-600"> Turn ideas into applications</span>
            </span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight text-gray-900">
            Generate Beautiful
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent ml-3">
              HTML with AI
            </span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Describe what you want to build, and watch our AI bring your ideas to life with clean, modern web-application.
          </p>
        </div>

        <div className="flex gap-6">
          {/* Main Content Area */}
          <div className="flex-1">
            {/* Prompt Input Area */}
            <div className="mb-8">
              <div className="bg-white rounded-2xl border border-gray-200 p-1 shadow-lg">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                      e.preventDefault();
                      handleGenerate();
                    }
                  }}
                  placeholder="Describe your idea and our AI will turn it into a modern web page."
                  className="w-full bg-transparent rounded-xl px-5 py-4 text-gray-900 placeholder-gray-400 focus:outline-none resize-none text-base"
                  rows={3}
                />
                <div className="flex justify-between items-center px-4 pb-3">
                  <div className="flex gap-2 flex-wrap">
                    {examplePrompts.map((example, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPrompt(example)}
                        className="text-xs px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:text-indigo-600 hover:bg-gray-200 transition-all"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                  
                  {/* Model Selector and Generate Button */}
                  <div className="flex gap-3 items-center">
                    {/* Model Selector Dropdown */}
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-gray-100 border border-gray-300 text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <option value="llama">🦙 Llama</option>
                      <option value="mixtral">🌀 GPT</option>
                      <option value="gemma">✨ Qwen</option>
                    </select>
                    
                    <button
                      onClick={handleGenerate}
                      disabled={isGenerating || !prompt.trim()}
                      className="group relative px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {isGenerating ? (
                          <>
                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            Generate HTML
                          </>
                        )}
                      </span>
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-300">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-300">Enter</kbd> to generate
              </p>
            </div>

            {/* Output Area */}
            {generatedHtml && (
              <div className="animate-fadeInUp">
                {/* Tab Bar */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
                    <button
                      onClick={() => setActiveTab('preview')}
                      className={`px-5 py-2 rounded-lg font-medium transition-all ${activeTab === 'preview' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Preview
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveTab('code')}
                      className={`px-5 py-2 rounded-lg font-medium transition-all ${activeTab === 'code' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-600 hover:text-gray-900'}`}
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                        Code
                      </span>
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:text-indigo-600 hover:bg-gray-200 transition-colors"
                      title="Copy HTML"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                    <button
                      onClick={handleDownload}
                      className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:text-emerald-600 hover:bg-gray-200 transition-colors"
                      title="Download HTML"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Preview / Code Display */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
                  {activeTab === 'preview' ? (
                    <div className="h-[500px] bg-white rounded-2xl overflow-hidden">
                      <iframe
                          ref={iframeRef}
                          title="Preview"
                          className="w-full h-full border-0"
                          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-modals allow-downloads"
                          srcDoc={generatedHtml}
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <pre className="p-5 overflow-x-auto text-sm font-mono text-gray-800 max-h-[500px] custom-scrollbar bg-gray-50">
                        <code>{generatedHtml}</code>
                      </pre>
                    </div>
                  )}
                </div>

                {/* Regenerate Button */}
                <div className="flex justify-center mt-6">
                  <button
                    onClick={handleGenerate}
                    className="px-6 py-2.5 rounded-xl bg-gray-100 border border-gray-300 text-gray-700 hover:text-indigo-600 hover:border-indigo-300 transition-all flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* History Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg sticky top-24">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Generation History
                </h3>
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="text-xs text-red-600 hover:text-red-700 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
              <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                {history.length === 0 ? (
                  <div className="p-8 text-center">
                    <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="text-gray-500 text-sm">No history yet</p>
                    <p className="text-gray-400 text-xs mt-1">Generate some HTML to see it here</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => loadFromHistory(item)}
                        className="p-4 hover:bg-gray-50 cursor-pointer transition-colors group"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm font-medium text-gray-900 line-clamp-2 flex-1">
                            {item.prompt}
                          </p>
                          <button
                            onClick={(e) => deleteHistoryItem(item.id, e)}
                            className="ml-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(item.timestamp).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Custom CSS */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c7d2fe;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #818cf8;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default App;