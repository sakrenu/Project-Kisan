import { useState } from 'react';
import { Search, MapPin, MessageCircle, Languages, FileText } from 'lucide-react';
import styles from '@/styles/components/SchemeNavigator.module.css';

const SchemeNavigator = () => {
  const [activeTab, setActiveTab] = useState('search');
  const [chatMessages, setChatMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [stateResults, setStateResults] = useState([]);
  const [kannadaMode, setKannadaMode] = useState(false);

  // Indian states for dropdown
  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
    'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
    'West Bengal'
  ];

  // Handle RAG chat
  const handleChatSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!currentMessage.trim()) return;

    setIsLoading(true);
    const userMessage = { role: 'user', content: currentMessage };
    setChatMessages(prev => [...prev, userMessage]);

    try {
      const endpoint = kannadaMode ? '/rag/kannada/chat' : '/rag/chat';
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentMessage,
          session_id: 'web_user'
        })
      });

      const data = await response.json();
      
      if (kannadaMode) {
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          content: data.kannada || data.english,
          english: data.english,
          schemes: data.schemes_found || []
        }]);
      } else {
        setChatMessages(prev => [...prev, {
          role: 'assistant',
          content: data.answer,
          schemes: data.schemes_found || []
        }]);
      }
    } catch (error) {
      setChatMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        error: true
      }]);
    }
    
    setCurrentMessage('');
    setIsLoading(false);
  };

  // Handle state search
  const handleStateSearch = async () => {
    if (!selectedState) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/rag/search-by-state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          state: selectedState,
          limit: 10
        })
      });

      const data = await response.json();
      setStateResults(data.schemes || []);
    } catch (error) {
      console.error('Error searching by state:', error);
    }
    setIsLoading(false);
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSubmit();
    }
  };

  // Example questions
  const exampleQuestions = [
    "What schemes are available for farmers in Bihar?",
    "Tell me about natural farming initiatives",
    "What financial assistance is available for marginal farmers?",
    "Show me schemes for sustainable agriculture",
    "What is the Mukhyamantri Kisan Sahayata Yojana?"
  ];

  return (
    <div className={styles.container || "min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4"}>
      <div className={styles.maxWidthContainer || "max-w-6xl mx-auto"}>
        {/* Header */}
        <div className={styles.header || "bg-white rounded-lg shadow-lg p-6 mb-6"}>
          <div className={styles.headerContent || "flex items-center justify-between"}>
            <div className={styles.headerLeft || "flex items-center space-x-3"}>
              <FileText className={styles.icon || "w-8 h-8 text-green-600"} />
              <div>
                <h1 className={styles.title || "text-2xl font-bold text-gray-800"}>Government Scheme Navigator</h1>
                <p className={styles.subtitle || "text-gray-600"}>Find and explore government schemes for farmers</p>
              </div>
            </div>
            <button
              onClick={() => setKannadaMode(!kannadaMode)}
              className={`${styles.languageButton || "flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors"} ${
                kannadaMode 
                  ? (styles.languageButtonActive || "bg-orange-500 text-white")
                  : (styles.languageButtonInactive || "bg-gray-200 text-gray-700 hover:bg-gray-300")
              }`}
            >
              <Languages className={styles.languageIcon || "w-4 h-4"} />
              <span>{kannadaMode ? 'ಕನ್ನಡ' : 'English'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className={styles.tabContainer || "bg-white rounded-lg shadow-lg mb-6"}>
          <div className={styles.tabHeader || "flex border-b"}>
            <button
              onClick={() => setActiveTab('search')}
              className={`${styles.tabButton || "flex items-center space-x-2 px-6 py-4 font-medium transition-colors"} ${
                activeTab === 'search'
                  ? (styles.tabButtonActive || "border-b-2 border-green-500 text-green-600")
                  : (styles.tabButtonInactive || "text-gray-600 hover:text-gray-800")
              }`}
            >
              <MessageCircle className={styles.tabIcon || "w-5 h-5"} />
              <span>Ask Questions</span>
            </button>
            <button
              onClick={() => setActiveTab('state')}
              className={`${styles.tabButton || "flex items-center space-x-2 px-6 py-4 font-medium transition-colors"} ${
                activeTab === 'state'
                  ? (styles.tabButtonActive || "border-b-2 border-green-500 text-green-600")
                  : (styles.tabButtonInactive || "text-gray-600 hover:text-gray-800")
              }`}
            >
              <MapPin className={styles.tabIcon || "w-5 h-5"} />
              <span>Search by State</span>
            </button>
          </div>

          {/* Chat Interface */}
          {activeTab === 'search' && (
            <div className={styles.tabContent || "p-6"}>
              {/* Example Questions */}
              {chatMessages.length === 0 && (
                <div className={styles.exampleSection || "mb-6"}>
                  <h3 className={styles.exampleTitle || "text-lg font-semibold mb-3 text-gray-800"}>Try asking:</h3>
                  <div className={styles.exampleGrid || "grid gap-2"}>
                    {exampleQuestions.map((question, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentMessage(question)}
                        className={styles.exampleButton || "text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm text-gray-700"}
                      >
                        "{question}"
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              <div className={styles.chatMessages || "space-y-4 mb-6 max-h-96 overflow-y-auto"}>
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`${styles.messageContainer || "flex"} ${
                      message.role === 'user' 
                        ? (styles.messageContainerUser || "justify-end")
                        : (styles.messageContainerAssistant || "justify-start")
                    }`}
                  >
                    <div
                      className={`${styles.message || "max-w-3xl p-4 rounded-lg"} ${
                        message.role === 'user'
                          ? (styles.messageUser || "bg-green-500 text-white")
                          : message.error
                          ? (styles.messageError || "bg-red-100 text-red-700")
                          : (styles.messageAssistant || "bg-gray-100 text-gray-800")
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      
                      {/* Show English version for Kannada responses */}
                      {kannadaMode && message.english && (
                        <details className={styles.englishDetails || "mt-2 text-sm opacity-75"}>
                          <summary className={styles.englishSummary || "cursor-pointer"}>Show English</summary>
                          <p className={styles.englishContent || "mt-1"}>{message.english}</p>
                        </details>
                      )}

                      {/* Show related schemes */}
                      {message.schemes && message.schemes.length > 0 && (
                        <div className={styles.schemesSection || "mt-3 pt-3 border-t border-gray-300"}>
                          <h4 className={styles.schemesTitle || "font-semibold mb-2"}>Related Schemes:</h4>
                          <div className={styles.schemesList || "space-y-2"}>
                            {message.schemes.map((scheme, idx) => (
                              <div key={idx} className={styles.schemeItem || "bg-white bg-opacity-50 p-2 rounded text-sm"}>
                                <div className={styles.schemeName || "font-medium"}>{scheme.scheme_name}</div>
                                <div className={styles.schemeState || "text-xs opacity-75"}>{scheme.state}</div>
                                {scheme.target_beneficiaries && (
                                  <div className={styles.schemeFor || "text-xs"}>For: {scheme.target_beneficiaries}</div>
                                )}
                                {scheme.link && (
                                  <a 
                                    href={scheme.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className={styles.schemeLink || "text-blue-600 hover:text-blue-800 text-xs underline"}
                                  >
                                    Official Link
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className={styles.chatInputContainer || "flex space-x-3"}>
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={kannadaMode ? "ಪ್ರಶ್ನೆ ಕೇಳಿ..." : "Ask about government schemes..."}
                  className={styles.chatInput || "flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"}
                  disabled={isLoading}
                />
                <button
                  onClick={handleChatSubmit}
                  disabled={isLoading || !currentMessage.trim()}
                  className={styles.submitButton || "px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"}
                >
                  {isLoading ? (
                    <div className={styles.spinner || "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"} />
                  ) : (
                    <Search className={styles.submitIcon || "w-5 h-5"} />
                  )}
                  <span>{isLoading ? 'Searching...' : 'Ask'}</span>
                </button>
              </div>
            </div>
          )}

          {/* State Search Interface */}
          {activeTab === 'state' && (
            <div className={styles.tabContent || "p-6"}>
              <div className={styles.stateSection || "mb-6"}>
                <label className={styles.stateLabel || "block text-sm font-medium text-gray-700 mb-2"}>
                  Select State
                </label>
                <div className={styles.stateInputContainer || "flex space-x-3"}>
                  <select
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    className={styles.stateSelect || "flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"}
                  >
                    <option value="">Choose a state...</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  <button
                    onClick={handleStateSearch}
                    disabled={isLoading || !selectedState}
                    className={styles.submitButton || "px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"}
                  >
                    {isLoading ? (
                      <div className={styles.spinner || "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"} />
                    ) : (
                      <Search className={styles.submitIcon || "w-5 h-5"} />
                    )}
                    <span>Search</span>
                  </button>
                </div>
              </div>

              {/* State Results */}
              {stateResults.length > 0 && (
                <div className={styles.stateResults}>
                  <h3 className={styles.stateResultsTitle || "text-lg font-semibold mb-4 text-gray-800"}>
                    Schemes in {selectedState} ({stateResults.length} found)
                  </h3>
                  <div className={styles.stateResultsGrid || "grid gap-4"}>
                    {stateResults.map((result, index) => (
                      <div key={index} className={styles.stateResultItem || "bg-gray-50 p-4 rounded-lg"}>
                        <div className={styles.stateResultContent || "whitespace-pre-wrap text-sm text-gray-700"}>
                          {result.content}
                        </div>
                        {result.metadata?.link && (
                          <a
                            href={result.metadata.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.stateResultLink || "inline-block mt-2 text-blue-600 hover:text-blue-800 text-sm underline"}
                          >
                            Visit Official Website
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No results message */}
              {selectedState && stateResults.length === 0 && !isLoading && (
                <div className={styles.noResults || "text-center py-8 text-gray-500"}>
                  <MapPin className={styles.noResultsIcon || "w-12 h-12 mx-auto mb-3 opacity-50"} />
                  <p className={styles.noResultsText || "mb-2"}>No schemes found for {selectedState}</p>
                  <p className={styles.noResultsSubtext || "text-sm"}>Try selecting a different state or use the chat feature</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className={styles.statsGrid || "grid grid-cols-1 md:grid-cols-3 gap-4"}>
          <div className={styles.statCard || "bg-white rounded-lg shadow p-4 text-center"}>
            <div className={`${styles.statNumber || "text-2xl font-bold"} ${styles.statNumberGreen || "text-green-600"}`}>92+</div>
            <div className={styles.statLabel || "text-sm text-gray-600"}>Government Schemes</div>
          </div>
          <div className={styles.statCard || "bg-white rounded-lg shadow p-4 text-center"}>
            <div className={`${styles.statNumber || "text-2xl font-bold"} ${styles.statNumberBlue || "text-blue-600"}`}>28</div>
            <div className={styles.statLabel || "text-sm text-gray-600"}>States Covered</div>
          </div>
          <div className={styles.statCard || "bg-white rounded-lg shadow p-4 text-center"}>
            <div className={`${styles.statNumber || "text-2xl font-bold"} ${styles.statNumberPurple || "text-purple-600"}`}>24/7</div>
            <div className={styles.statLabel || "text-sm text-gray-600"}>Always Available</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeNavigator;