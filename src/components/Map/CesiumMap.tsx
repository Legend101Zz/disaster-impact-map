import { DisasterZone } from '@/types/disasters';
import { initializeCesium } from '@/utils/cesiumConfig';
import * as Cesium from 'cesium';
import React, { useEffect, useRef } from 'react';
import { CesiumComponentRef, Entity, Viewer } from 'resium';

const CesiumInstance = initializeCesium();

interface CesiumMapProps {
    disasterZones: DisasterZone[];
    onZoneSelect: (zone: DisasterZone) => void;
}

const CesiumMap: React.FC<CesiumMapProps> = ({ disasterZones, onZoneSelect }) => {
    const viewerRef = useRef<CesiumComponentRef<Cesium.Viewer>>(null);

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

    return (
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
            {disasterZones.map((zone) => (
                <Entity
                    key={zone.id}
                    position={Cesium.Cartesian3.fromDegrees(
                        zone.coordinates[0],
                        zone.coordinates[1],
                        0
                    )}
                    point={{
                        pixelSize: 12,
                        color: getRiskColor(zone.riskLevel),
                        outlineColor: Cesium.Color.WHITE,
                        outlineWidth: 2,
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                    }}
                    billboard={{
                        scale: 1.0,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    }}
                    label={{
                        text: `M ${(zone as any).magnitude?.toFixed(1) || ''}`,
                        font: '14px sans-serif',
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        outlineWidth: 2,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(0, -10),
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                    }}
                    description={`
                        <h3>Earthquake</h3>
                        <p>Magnitude: ${(zone as any).magnitude?.toFixed(1)}</p>
                        <p>Location: ${zone.description}</p>
                        <p>Time: ${new Date(zone.lastIncident || '').toLocaleString()}</p>
                        <p>Depth: ${(zone as any).depth?.toFixed(1)} km</p>
                    `}
                    onClick={() => onZoneSelect(zone)}
                />
            ))}
        </Viewer>
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