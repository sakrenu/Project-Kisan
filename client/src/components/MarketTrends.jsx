'use client';

import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import styles from '@/styles/components/MarketTrends.module.css';

const MarketTrends = ({ t }) => {
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState({
    name: "Bangalore",
    state: "Karnataka", 
    lat: 12.9716,
    lon: 77.5946
  });
  const [crops, setCrops] = useState([]);
  const [locations, setLocations] = useState([]);
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatMode, setChatMode] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [sessionId] = useState(`market_session_${Date.now()}`);
  const chatContainerRef = useRef(null);

  // Fetch initial data
  useEffect(() => {
    fetchCrops();
    fetchLocations();
  }, []);


 const renderPriceChart = () => {
    if (!marketData?.trend_data?.length) return null;
    return (
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={marketData.trend_data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#28a745" />
        </LineChart>
      </ResponsiveContainer>
    );
  };


  const fetchCrops = async () => {
    try {
      const response = await fetch('http://localhost:8000/market/crops');
      const data = await response.json();
      setCrops(data.crops);
    } catch (error) {
      console.error('Failed to fetch crops:', error);
      // Fallback crop data
      setCrops([
        { name: "Rice", local_name: "ಅಕ್ಕಿ", category: "cereal", season: "Kharif/Rabi" },
        { name: "Wheat", local_name: "ಗೋಧಿ", category: "cereal", season: "Rabi" },
        { name: "Sugarcane", local_name: "ಕಬ್ಬು", category: "cash_crop", season: "Year-round" },
        { name: "Cotton", local_name: "ಹತ್ತಿ", category: "cash_crop", season: "Kharif" },
        { name: "Tomato", local_name: "ಟೊಮಾಟೊ", category: "vegetable", season: "Year-round" },
        { name: "Onion", local_name: "ಈರುಳ್ಳಿ", category: "vegetable", season: "Rabi/Summer" },
        { name: "Potato", local_name: "ಆಲೂಗಡ್ಡೆ", category: "vegetable", season: "Rabi" },
        { name: "Maize", local_name: "ಜೋಳ", category: "cereal", season: "Kharif/Rabi" }
      ]);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await fetch('http://localhost:8000/market/locations');
      const data = await response.json();
      setLocations(data.locations);
    } catch (error) {
      console.error('Failed to fetch locations:', error);
      // Fallback location data
      setLocations([
        { name: "Bangalore", state: "Karnataka", lat: 12.9716, lon: 77.5946, market_type: "Metropolitan" },
        { name: "Mysore", state: "Karnataka", lat: 12.2958, lon: 76.6394, market_type: "Regional" },
        { name: "Hubli", state: "Karnataka", lat: 15.3647, lon: 75.1240, market_type: "Regional" },
        { name: "Mandya", state: "Karnataka", lat: 12.5218, lon: 76.8951, market_type: "District" }
      ]);
    }
  };

  const fetchMarketTrends = async (crop, location) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/market/trends', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          crop: crop.name,
          market: location.name ,
          state: location.state
          
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch market trends');
      }

      const data = await response.json();
      setMarketData(data);
    } catch (error) {
      console.error('Error fetching market trends:', error);
      setMarketData({
        crop: crop.name,
        location: `${location.name}, ${location.state}`,
        market_analysis: "Unable to fetch current market data. Please try again later.",
        recommendations: ["Check local market conditions", "Monitor price trends", "Consult with local traders"],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCropSelect = (crop) => {
    setSelectedCrop(crop);
    setChatMode(false);
    fetchMarketTrends(crop, selectedLocation);
  };

  const handleLocationChange = (location) => {
    setSelectedLocation(location);
    if (selectedCrop) {
      fetchMarketTrends(selectedCrop, location);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');

    try {
      const response = await fetch('http://localhost:8000/market/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: chatInput,
          session_id: sessionId
        })
      });

      const data = await response.json();
      const aiMessage = { role: 'assistant', content: data.response };
      setChatMessages(prev => [...prev, aiMessage]);

      // Update market data if available
      if (data.market_data) {
        setMarketData(prev => ({ ...prev, ...data.market_data }));
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
      setChatMessages(prev => [...prev, errorMessage]);
    }
  };

  const toggleChatMode = () => {
    setChatMode(!chatMode);
    if (!chatMode) {
      setMarketData(null);
      setSelectedCrop(null);
    }
  };

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const getCropIcon = (cropName) => {
  const icons = {
    Rice: '🍚',
    Wheat: '🌾',
    Maize: '🌽',
    Sugarcane: '🍬',
    Cotton: '🧵',
    Tomato: '🍅',
    Onion: '🧅',
    Potato: '🥔',
    Chili: '🌶️',
    Banana: '🍌',
    Mango: '🥭',
    Grapes: '🍇',
    Orange: '🍊',
    Lemon: '🍋',
    Apple: '🍎',
    Coconut: '🥥',
    Groundnut: '🥜',
    Turmeric: '🟡',
    Ginger: '🫚',
    Garlic: '🧄'
  };

  return icons[cropName] || '🌱';
};

return (
    <div className={styles.marketContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>{t('marketTrends.title')}</h1>
        <button 
          className={`${styles.modeToggle} ${chatMode ? styles.active : ''}`}
          onClick={toggleChatMode}
        >
          {chatMode ? `📊 ${t('marketTrends.quickAnalysis')}` : `💬 ${t('marketTrends.chatMode')}`}
        </button>
      </div>

      {!chatMode ? (
        <>
          {/* Location Selection */}
          <div className={styles.locationSection}>
            <h3>{t('marketTrends.selectLocation')}</h3>
            <div className={styles.locationGrid}>
              {locations.map((location, index) => (
                <button
                  key={index}
                  className={`${styles.locationCard} ${selectedLocation.name === location.name ? styles.selected : ''}`}
                  onClick={() => handleLocationChange(location)}
                >
                  <div className={styles.locationInfo}>
                    <span className={styles.locationName}>{location.name}</span>
                    <span className={styles.locationState}>{location.state}</span>
                    <span className={styles.marketType}>{location.market_type}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Crop Selection */}
          <div className={styles.cropSection}>
            <h3>{t('marketTrends.selectCrop')}</h3>
            <div className={styles.cropGrid}>
              {crops.map((crop, index) => (
                <div
                  key={index}
                  className={`${styles.cropCard} ${selectedCrop?.name === crop.name ? styles.selected : ''}`}
                  onClick={() => handleCropSelect(crop)}
                >
                  <div className={styles.cropIcon}>
                    {getCropIcon(crop.name)}
                  </div>
                  <div className={styles.cropInfo}>
                    <h4 className={styles.cropName}>{crop.name}</h4>
                    <p className={styles.cropLocalName}>{crop.local_name}</p>
                    <span className={styles.cropSeason}>{crop.season}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {loading && (
            <div className={styles.loading}><div className={styles.spinner}></div><p>{t('marketTrends.loadingText')}</p></div>
          )}

          // In your results section where you display market data, modify it like this:
{marketData && !loading && (
  <div className={styles.resultsSection}>
    <div className={styles.resultsHeader}>
      <h3>{t('marketTrends.marketAnalysis')}: {marketData.crop}</h3>
      <span className={styles.location}>📍 {marketData.location}</span>
    </div>

    <div className={styles.analysisGrid}>
      <div className={styles.analysisCard}>
        <h4>{t('marketTrends.marketAnalysis')}</h4>
        <div className={styles.analysisContent}>
          {!marketData.market_analysis ? (
            <p>{t('marketTrends.fallbackMessages.noData')}</p>
          ) : typeof marketData.market_analysis === 'string' ? (
            <p>{marketData.market_analysis}</p>
          ) : (
            <div className={styles.marketDetails}>
              <p><strong>{t('marketTrends.currentPrice')}:</strong> 
                ₹{marketData.market_analysis.current_price ?? 'N/A'}
              </p>
              <p><strong>{t('marketTrends.averagePrice')}:</strong> 
                ₹{marketData.market_analysis.average_price ?? 'N/A'}
              </p>
              <p><strong>{t('marketTrends.priceVolatility')}:</strong> 
                {marketData.market_analysis.price_volatility ?? 'N/A'}
              </p>
              <p><strong>{t('marketTrends.trend')}:</strong> 
                {marketData.market_analysis.trend ?? 'N/A'}
              </p>
              {marketData.market_analysis.price_range && (
                <p><strong>{t('marketTrends.priceRange')}:</strong> 
                  ₹{marketData.market_analysis.price_range.min ?? 'N/A'} – ₹{marketData.market_analysis.price_range.max ?? 'N/A'}
                </p>
              )}
            </div>
          )}
        </div>
        {renderPriceChart()}
      </div>

      <div className={styles.recommendationsCard}>
        <h4>{t('marketTrends.recommendations')}</h4>
        <ul className={styles.recommendationsList}>
          {(marketData.recommendations || t('marketTrends.recommendationDefaults', { returnObjects: true })).map((rec, index) => (
            <li key={index}>💡 {rec}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
)}
        </>
      ) : (
        <div className={styles.chatSection}>
          <div className={styles.chatContainer} ref={chatContainerRef}>
            {chatMessages.length === 0 && (
              <div className={styles.chatWelcome}>
                <h3>{t('marketTrends.chat.welcome')}</h3>
                <ul>
                  {t('marketTrends.chat.examples', { returnObjects: true }).map((example, index) => (
                    <li key={index}>"{example}"</li>
                  ))}
                </ul>
              </div>
            )}
            {chatMessages.map((message, index) => (
              <div key={index} className={`${styles.message} ${styles[message.role]}`}>
                <div
                  className={styles.messageContent}
                  dangerouslySetInnerHTML={{ __html: message.content }}
                ></div>
              </div>
            ))}
          </div>

          <div className={styles.chatInput}>
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={t('marketTrends.chat.placeholder')}
              onKeyDown={(e) => e.key === 'Enter' && sendChatMessage()}
            />
            <button onClick={sendChatMessage} disabled={!chatInput.trim()}>{t('marketTrends.chat.send')}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketTrends;