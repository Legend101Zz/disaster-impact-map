import { DisasterZone } from '@/types/disasters';
import { initializeCesium } from '@/utils/cesiumConfig';
import * as Cesium from 'cesium';
import React, { useEffect, useRef, useState } from 'react';
import { CesiumComponentRef, Entity, Viewer } from 'resium';
import EarthquakeTour from './EarthquakeTour';
import { Map } from 'lucide-react';

const CesiumInstance = initializeCesium();

interface CesiumMapProps {
    disasterZones: DisasterZone[];
    onZoneSelect: (zone: DisasterZone) => void;
}

const CesiumMap: React.FC<CesiumMapProps> = ({ disasterZones, onZoneSelect }) => {
    const viewerRef = useRef<CesiumComponentRef<Cesium.Viewer>>(null);
    const [showTour, setShowTour] = useState(false);
    const [highlightedZone, setHighlightedZone] = useState<string | null>(null);

    useEffect(() => {
        if (viewerRef.current?.cesiumElement) {
            const viewer = viewerRef.current.cesiumElement;

            viewer.scene.globe.enableLighting = true;

            // Load Google 3D Tiles
            async function loadTileset() {
                try {
                    const tileset = await CesiumInstance.Cesium3DTileset.fromUrl(
                        `https://tile.googleapis.com/v1/3dtiles/root.json?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
                    );
                    viewer.scene.primitives.add(tileset);
                } catch (error) {
                    console.error('Error loading Google 3D Tiles:', error);
                }
            }
            loadTileset();

            viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(120, 0, 20000000.0),
                orientation: {
                    heading: 0.0,
                    pitch: -Cesium.Math.PI_OVER_TWO,
                    roll: 0.0,
                }
            });

            // Enable terrain
            viewer.scene.globe.enableLighting = true;
            viewer.scene.globe.terrainExaggeration = 1.0;
        }
    }, []);

    const getEntityProperties = (zone: DisasterZone, isHighlighted: boolean) => {
        const magnitude = (zone as any).magnitude || 5;
        return {
            position: Cesium.Cartesian3.fromDegrees(
                zone.coordinates[0],
                zone.coordinates[1],
                0
            ),
            point: {
                pixelSize: isHighlighted ? 20 : 15,
                color: getRiskColor(zone.riskLevel).withAlpha(isHighlighted ? 1.0 : 0.8),
                outlineColor: Cesium.Color.WHITE,
                outlineWidth: isHighlighted ? 3 : 2,
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
            },
            label: {
                text: `M${magnitude.toFixed(1)}`,
                font: isHighlighted ? 'bold 16px sans-serif' : '14px sans-serif',
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -10),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                show: magnitude >= 4.5 || isHighlighted,
            },
            description: `
                <h3>Earthquake</h3>
                <p>Magnitude: ${magnitude.toFixed(1)}</p>
                <p>Location: ${zone.description}</p>
                <p>Time: ${new Date(zone.lastIncident || '').toLocaleString()}</p>
                <p>Depth: ${(zone as any).depth?.toFixed(1)} km</p>
            `
        };
    };

    return (
        <>
            <Viewer
                ref={viewerRef}
                full
                timeline={false}
                animation={false}
                baseLayerPicker={false}
                navigationHelpButton={false}
                homeButton={false}
                geocoder={false}
                sceneModePicker={false}
            >
                {disasterZones.map((zone) => {
                    const isHighlighted = zone.id === highlightedZone;
                    const props = getEntityProperties(zone, isHighlighted);

                    return (
                        <Entity
                            key={zone.id}
                            {...props}
                            onClick={() => onZoneSelect(zone)}
                        />
                    );
                })}
            </Viewer>

            {/* Tour Button */}
            {!showTour && disasterZones.length > 0 && (
                <button
                    onClick={() => setShowTour(true)}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg px-4 py-2 flex items-center space-x-2 hover:bg-gray-50"
                >
                    <Map className="w-5 h-5" />
                    <span>Start Earthquake Tour</span>
                </button>
            )}

            {/* Tour Controls */}
            {showTour && (
                <EarthquakeTour
                    disasterZones={disasterZones}
                    viewerRef={viewerRef}
                    onClose={() => setShowTour(false)}
                />
            )}
        </>
    );
};

function getRiskColor(riskLevel: DisasterZone['riskLevel']): Cesium.Color {
    switch (riskLevel) {
        case 'severe': return Cesium.Color.RED;
        case 'high': return Cesium.Color.ORANGE;
        case 'medium': return Cesium.Color.YELLOW;
        case 'low': return Cesium.Color.GREEN;
        default: return Cesium.Color.BLUE;
    }
}

export default CesiumMap;