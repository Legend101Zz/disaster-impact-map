import React, { useEffect, useRef } from 'react';
import { Viewer, Entity } from 'resium';
import * as Cesium from 'cesium';
import { DisasterZone } from '@/types/disasters';
import { CesiumComponentRef } from 'resium';
import { initializeCesium } from '@/utils/cesiumConfig';
import { title } from 'process';

// Initialize Cesium once
initializeCesium();
interface CesiumMapProps {
    disasterZones: DisasterZone[];
    onZoneSelect: (zone: DisasterZone) => void;
}

const CesiumMap: React.FC<CesiumMapProps> = ({ disasterZones, onZoneSelect }) => {
    const viewerRef = useRef<CesiumComponentRef<Cesium.Viewer>>(null);

    useEffect(() => {
        if (viewerRef.current?.cesiumElement) {
            async function createMap() {
                // Enable simultaneous requests
                Cesium.RequestScheduler.requestsByServer["tile.googleapis.com:443"] = 18;

                // Configure viewer
                const viewer = viewerRef.current!.cesiumElement;
                viewer!.scene.globe.enableLighting = true;

                const tileset = await Cesium.Cesium3DTileset.fromUrl(
                    `https://tile.googleapis.com/v1/3dtiles/root.json?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
                )

                // Add Google 3D Tiles
                viewer!.scene.primitives.add(
                    tileset
                )

                // Set initial view
                viewer!.camera.setView({
                    destination: Cesium.Cartesian3.fromDegrees(-98.35, 39.50, 5000000.0),
                });

                // Cleanup function
                return () => {
                    if (viewer && !viewer.isDestroyed()) {
                        viewer.destroy();
                    }
                };
            }
            createMap()
        }
    }, []);

    const getRiskColor = (riskLevel: DisasterZone['riskLevel']): Cesium.Color => {
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
            scene3DOnly={true}
            navigationHelpButton={false}
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