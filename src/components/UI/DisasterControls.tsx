import React from 'react';
import { Switch } from '@headlessui/react';
import { DisasterType, RiskLevel } from '@/types/disasters';

interface DisasterControlsProps {
    selectedTypes: DisasterType[];
    selectedRiskLevels: RiskLevel[];
    onTypeToggle: (type: DisasterType) => void;
    onRiskLevelToggle: (level: RiskLevel) => void;
}

const DisasterControls: React.FC<DisasterControlsProps> = ({
    selectedTypes,
    selectedRiskLevels,
    onTypeToggle,
    onRiskLevelToggle,
}) => {
    const disasterTypes: DisasterType[] = ['earthquake', 'flood', 'fire'];
    const riskLevels: RiskLevel[] = ['low', 'medium', 'high', 'severe'];

    return (
        <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg max-w-xs">
            <h3 className="text-lg font-bold mb-4">Disaster Types</h3>

            <div className="space-y-4">
                {disasterTypes.map((type) => (
                    <div key={type} className="flex items-center justify-between">
                        <span className="capitalize">{type}</span>
                        <Switch
                            checked={selectedTypes.includes(type)}
                            onChange={() => onTypeToggle(type)}
                            className={`${selectedTypes.includes(type) ? 'bg-blue-600' : 'bg-gray-200'
                                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                        >
                            <span
                                className={`${selectedTypes.includes(type) ? 'translate-x-6' : 'translate-x-1'
                                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                            />
                        </Switch>
                    </div>
                ))}
            </div>

            <h3 className="text-lg font-bold mt-6 mb-4">Risk Levels</h3>
            <div className="space-y-4">
                {riskLevels.map((level) => (
                    <div key={level} className="flex items-center justify-between">
                        <span className="capitalize">{level}</span>
                        <Switch
                            checked={selectedRiskLevels.includes(level)}
                            onChange={() => onRiskLevelToggle(level)}
                            className={`${selectedRiskLevels.includes(level) ? 'bg-blue-600' : 'bg-gray-200'
                                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                        >
                            <span
                                className={`${selectedRiskLevels.includes(level) ? 'translate-x-6' : 'translate-x-1'
                                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                            />
                        </Switch>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DisasterControls;