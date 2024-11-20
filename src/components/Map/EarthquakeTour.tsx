import React, { useState, useEffect } from 'react';
import * as Cesium from 'cesium';
import { Play, Pause, SkipForward, SkipBack, X } from 'lucide-react';
import { CesiumComponentRef } from 'resium';
import { DisasterZone } from '@/types/disasters';

interface TourControlsProps {
    disasterZones: DisasterZone[];
    viewerRef: React.RefObject<CesiumComponentRef<Cesium.Viewer>>;
    setHighlightedZone: (zone: string | null) => void;
    onClose: () => void;
}

const EarthquakeTour: React.FC<TourControlsProps> = ({ 
    disasterZones, 
    viewerRef, 
    setHighlightedZone, 
    onClose 
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const duration = 4; // seconds per location

    useEffect(() => {
        let animationFrame: number;

        if (isPlaying && viewerRef.current?.cesiumElement) {
            const viewer = viewerRef.current.cesiumElement;
            const currentZone = disasterZones[currentIndex];
            const magnitude = (currentZone as any).magnitude || 5;

            // Set highlighted zone
            setHighlightedZone(currentZone.id);

            // Calculate better camera position
            const longitude = currentZone.coordinates[0];
            const latitude = currentZone.coordinates[1];
            const height = magnitude * 190000;

            viewer.camera.flyTo({
                destination: Cesium.Cartesian3.fromDegrees(
                    longitude,
                    latitude - 10,
                    height
                ),
                orientation: {
                    heading: Cesium.Math.toRadians(0),
                    pitch: Cesium.Math.toRadians(-45), // 45-degree view angle
                    roll: 0
                },
                duration: 3,
                complete: () => {
                    animationFrame = window.setTimeout(() => {
                        if (currentIndex < disasterZones.length - 1) {
                            setCurrentIndex(prev => prev + 1);
                        } else {
                            setIsPlaying(false);
                            setCurrentIndex(0);
                        }
                    }, duration);
                }
            });
        }

        return () => {
            if (animationFrame) {
                clearTimeout(animationFrame);
            }
        };
    }, [currentIndex, isPlaying, disasterZones, viewerRef, setHighlightedZone]);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleNext = () => {
        if (currentIndex < disasterZones.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    const handleClose = () => {
        setIsPlaying(false);
        setCurrentIndex(0);
        setHighlightedZone(null); // Reset highlighted zone
        onClose();
    };

    const currentZone = disasterZones[currentIndex];

    return (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 z-10">
            <div className="flex items-center justify-between space-x-6">
                <button
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
                >
                    <SkipBack className="w-5 h-5" />
                </button>

                <button
                    onClick={handlePlayPause}
                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
                >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>

                <button
                    onClick={handleNext}
                    disabled={currentIndex === disasterZones.length - 1}
                    className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
                >
                    <SkipForward className="w-5 h-5" />
                </button>

                <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 rounded-full"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {currentZone && (
                <div className="mt-3 text-center">
                    <div className="font-medium">
                        {currentZone.description}
                    </div>
                    <div className="text-sm text-gray-600">
                        Magnitude: {(currentZone as any).magnitude?.toFixed(1)} |
                        Depth: {(currentZone as any).depth?.toFixed(1)}km
                    </div>
                    <div className="text-xs text-gray-500">
                        {currentIndex + 1} of {disasterZones.length}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EarthquakeTour;
