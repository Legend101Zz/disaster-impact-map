import React, { useState, useEffect } from 'react';
import CesiumMap from './components/Map/CesiumMap';
import DisasterControls from './components/UI/DisasterControls';
import DisasterInfo from './components/UI/DisasterInfo';
import LoadingSpinner from './components/UI/LoadingSpinner';
import { DisasterAPI } from './services/api';
import { DisasterZone, DisasterType, RiskLevel, EarthquakeData } from './types/disasters';
import { convertEarthquakeToZone } from './services/disasterZones';

const App: React.FC = () => {
  const [selectedTypes, setSelectedTypes] = useState<DisasterType[]>(['earthquake']);
  const [selectedRiskLevels, setSelectedRiskLevels] = useState<RiskLevel[]>(['high', 'severe']);
  const [disasterZones, setDisasterZones] = useState<DisasterZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<DisasterZone | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDisasterData();
  }, [selectedTypes]);

  const fetchDisasterData = async () => {
    try {
      setLoading(true);
      setError(null);

      const promises: Promise<any>[] = [];

      if (selectedTypes.includes('earthquake')) {
        promises.push(DisasterAPI.getEarthquakes('week'));
      }

      const results = await Promise.all(promises);
      let allZones: DisasterZone[] = [];

      if (selectedTypes.includes('earthquake')) {
        const earthquakeData = results[0] as EarthquakeData[];
        const earthquakeZones = earthquakeData.map(convertEarthquakeToZone);
        allZones = [...allZones, ...earthquakeZones];
      }

      // Filter by selected risk levels
      const filteredZones = allZones.filter(zone =>
        selectedRiskLevels.includes(zone.riskLevel)
      );

      setDisasterZones(filteredZones);
    } catch (err) {
      setError('Failed to fetch disaster data. Please try again later.');
      console.error('Error fetching disaster data:', err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleZoneSelect = (zone: DisasterZone) => {
    setSelectedZone(zone);
  };

  return (
    <div className="relative w-screen h-screen">
      {loading && <LoadingSpinner />}

      {error && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      <CesiumMap
        disasterZones={disasterZones}
        onZoneSelect={handleZoneSelect}
      />

      <DisasterControls
        selectedTypes={selectedTypes}
        selectedRiskLevels={selectedRiskLevels}
        onTypeToggle={handleTypeToggle}
        onRiskLevelToggle={handleRiskLevelToggle}
      />

      <DisasterInfo
        zone={selectedZone}
        onClose={() => setSelectedZone(null)}
      />
    </div>
  );
};

export default App;