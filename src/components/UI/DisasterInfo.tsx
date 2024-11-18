import React from 'react';
import { DisasterZone } from '@/types/disasters';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DisasterInfoProps {
    zone: DisasterZone | null;
    onClose: () => void;
}

const DisasterInfo: React.FC<DisasterInfoProps> = ({ zone, onClose }) => {
    if (!zone) return null;

    return (
        <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg max-w-md">
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold capitalize">{zone.type} Event</h3>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <XMarkIcon className="h-6 w-6" />
                </button>
            </div>

            <div className="space-y-2">
                <p>
                    <span className="font-medium">Risk Level:</span>{' '}
                    <span className="capitalize">{zone.riskLevel}</span>
                </p>
                {zone.lastIncident && (
                    <p>
                        <span className="font-medium">Last Incident:</span>{' '}
                        {new Date(zone.lastIncident).toLocaleDateString()}
                    </p>
                )}
                {zone.population && (
                    <p>
                        <span className="font-medium">Affected Population:</span>{' '}
                        {zone.population.toLocaleString()}
                    </p>
                )}
                {zone.description && (
                    <p>
                        <span className="font-medium">Description:</span>{' '}
                        {zone.description}
                    </p>
                )}
            </div>
        </div>
    );
};

export default DisasterInfo;