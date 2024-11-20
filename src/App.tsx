//@ts-nocheck
import React, { useEffect, useState } from 'react';
import CesiumMap from './components/Map/CesiumMap';
import DisasterControls from './components/UI/DisasterControls';
import DisasterInfo from './components/UI/DisasterInfo';
import LoadingSpinner from './components/UI/LoadingSpinner';
import WelcomeOverlay from './components/UI/WelcomeOverlay';
import { DisasterAPI } from './services/api';
import { convertEarthquakeToZone } from './services/disasterZones';
import { DisasterType, DisasterZone, RiskLevel } from './types/disasters';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [selectedTypes, setSelectedTypes] = useState<DisasterType[]>(['earthquake']);
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<RiskLevel[]>(['high', 'severe']);
  const [disasterZones, setDisasterZones] = useState<DisasterZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<DisasterZone | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [dataLoadingStatus,] = useState({
    earthquakes: false,
    weather: false,
  });

  useEffect(() => {
    fetchDisasterData();
  }, [selectedTypes]);

  const fetchDisasterData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching earthquake data...');

      const earthquakeData = await DisasterAPI.getEarthquakes();
      console.log('Raw earthquake data:', earthquakeData);

      if (earthquakeData && earthquakeData.length > 0) {
        const earthquakeZones = earthquakeData.map(convertEarthquakeToZone);
        console.log('Processed earthquake zones:', earthquakeZones);

        // Filter based on selected risk levels
        const filteredZones = earthquakeZones.filter(zone =>
          selectedRiskLevels.includes(zone.riskLevel)
        );
        console.log('Filtered zones:', filteredZones);

        setDisasterZones(filteredZones);
      } else {
        console.log('No earthquake data received');
        setError('No earthquake data available');
      }

    } catch (err) {
      console.error('Error in fetchDisasterData:', err);
      setError('Failed to fetch disaster data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Log whenever disasterZones changes
  useEffect(() => {
    console.log('Current disaster zones:', disasterZones);
  }, [disasterZones]);


  const handleTypeToggle = (type: DisasterType) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleRiskLevelToggle = (level: RiskLevel) => {
    setSelectedRiskLevels(prev =>
      prev.includes(level)
        ? prev.filter(l => l !== level)
        : [...prev, level]
    );
  };

  return (
    <div className="relative w-screen h-screen">
      {showWelcome && (
        <WelcomeOverlay onClose={() => setShowWelcome(false)} />
      )}

      {loading && <LoadingSpinner />}

      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      <CesiumMap
        disasterZones={disasterZones}
        onZoneSelect={setSelectedZone}
      />

      <DisasterControls
        selectedTypes={selectedTypes}
        selectedRiskLevels={selectedRiskLevels}
        onTypeToggle={(type) => {
          console.log('Toggling type:', type);
          setSelectedTypes(prev =>
            prev.includes(type)
              ? prev.filter(t => t !== type)
              : [...prev, type]
          );
        }}
        onRiskLevelToggle={(level) => {
          console.log('Toggling risk level:', level);
          setSelectedRiskLevels(prev =>
            prev.includes(level)
              ? prev.filter(l => l !== level)
              : [...prev, level]
          );
        }}
      />

      <DisasterInfo
        zone={selectedZone}
        onClose={() => setSelectedZone(null)}
      />

      {/* Loading status indicator */}
      {(dataLoadingStatus.earthquakes) && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            <span className="text-sm text-gray-600">
              Loading disaster data...
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;