import React, { useEffect, useRef } from 'react';
import { Viewer, Entity, GeoJsonDataSource } from 'resium';
import * as Cesium from 'cesium';
import { DisasterZone } from '@/types/disasters';

interface CesiumMapProps {
    disasterZones: DisasterZone[];
    onZoneSelect: (zone: DisasterZone) => void;
}

const CesiumMap: React.FC<CesiumMapProps> = ({ disasterZones, onZoneSelect }) => {
    const viewerRef = useRef<Cesium.Viewer | null>(null);

    useEffect(() => {
        if (viewerRef.current) {
            // Enable simultaneous requests
            Cesium.RequestScheduler.requestsByServer["tile.googleapis.com:443"] = 18;

            // Configure viewer
            const viewer = viewerRef.current.cesiumElement;
            viewer.scene.globe.enableLighting = true;

            // Add Google 3D Tiles
            const tileset = viewer.scene.primitives.add(
                new Cesium.Cesium3DTileset({
                    url: `https://tile.googleapis.com/v1/3dtiles/root.json?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`,
                    showCreditsOnScreen: true,
                })
            );

            // Set initial view
            viewer.camera.setView({
                destination: Cesium.Cartesian3.fromDegrees(-98.35, 39.50, 5000000.0),
            });
        }
    }, []);

    const getRiskColor = (riskLevel: DisasterZone['riskLevel']) => {
        switch (riskLevel) {
            case 'severe': return Cesium.Color.RED;
            case 'high': return Cesium.Color.ORANGE;
            case 'medium': return Cesium.Color.YELLOW;
            case 'low': return Cesium.Color.GREEN;
            default: return Cesium.Color.BLUE;
        }
    };

    return (
        <Viewer
            ref={viewerRef}
            full
            timeline={false}
            animation={false}
            baseLayerPicker={false}
        >
            {disasterZones.map((zone) => (
                <Entity
                    key={zone.id}
                    position={Cesium.Cartesian3.fromDegrees(
                        zone.coordinates[0],
                        zone.coordinates[1],
                        zone.coordinates[2] || 0
                    )}
                    point={{
                        pixelSize: 10,
                        color: getRiskColor(zone.riskLevel),
                        outlineColor: Cesium.Color.WHITE,
                        outlineWidth: 2,
                    }}
                    description={zone.description}
                    onClick={() => onZoneSelect(zone)}
                />
            ))}
        </Viewer>
    );
};

export default CesiumMap;