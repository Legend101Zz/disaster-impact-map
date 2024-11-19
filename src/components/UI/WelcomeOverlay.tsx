import { useState } from 'react';
import { AlertCircle, Info, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './Alert';

const WelcomeOverlay = ({ onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
        setIsVisible(false);
        onClose();
    };

    if (!isVisible) return null;

    return (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 m-4 relative">
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    <X className="h-6 w-6" />
                </button>

                <div className="space-y-6">
                    <div className="flex items-start space-x-3">
                        <Info className="h-8 w-8 text-blue-500 mt-1" />
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Disaster Impact Awareness Map
                            </h2>
                            <p className="text-gray-600 mt-1">
                                Visualize and understand natural disaster risks in your area
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>How to use this map</AlertTitle>
                            <AlertDescription>
                                <ul className="list-disc ml-4 space-y-2 mt-2">
                                    <li>Use the controls on the left to filter disaster types and risk levels</li>
                                    <li>Click on any marker to view detailed information</li>
                                    <li>Drag to rotate the globe, scroll to zoom in/out</li>
                                    <li>Different colors indicate different risk levels: red (severe), orange (high), yellow (medium), green (low)</li>
                                </ul>
                            </AlertDescription>
                        </Alert>

                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-blue-700">Current Data Loading</h3>
                            <ul className="mt-2 space-y-1 text-blue-600">
                                <li>• Recent earthquakes (magnitude 4.0+)</li>
                                <li>• Active weather alerts</li>
                                <li>• Historical disaster zones</li>
                            </ul>
                        </div>
                    </div>

                    <button
                        onClick={handleClose}
                        className="w-full bg-blue-500 text-white rounded-lg py-3 font-semibold hover:bg-blue-600 transition-colors"
                    >
                        Get Started
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WelcomeOverlay;