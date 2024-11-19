import React from 'react';
import { Loader } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center space-y-4">
                <Loader className="h-8 w-8 animate-spin text-blue-500" />
                <div className="text-center">
                    <h3 className="text-lg font-semibold">Loading Disaster Data</h3>
                    <p className="text-sm text-gray-600">Please wait while we fetch the latest information</p>
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner;