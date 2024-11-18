import { DisasterZone } from '@/types/disasters';
import { initializeCesium } from '@/utils/cesiumConfig';
import * as Cesium from 'cesium';
import React, { useEffect, useRef } from 'react';
import { CesiumComponentRef, Entity, EntityDescription, PointGraphics, Viewer } from 'resium';

const CesiumInstance = initializeCesium()
const position = CesiumInstance.Cartesian3.fromDegrees(-74.0707383, 40.7117244, 100);


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

                // Configure viewer
                const viewer = viewerRef.current!.cesiumElement;
                viewer!.scene.globe.enableLighting = true;

                const tileset = await CesiumInstance.Cesium3DTileset.fromUrl(
                    `https://tile.googleapis.com/v1/3dtiles/root.json?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
                )

                // Add Google 3D Tiles
                viewer!.scene.primitives.add(
                    tileset
                )

                // Set initial view
                viewer!.camera.setView({
                    destination: new Cesium.Cartesian3(-98.35, 39.50, 5000000.0),
                    orientation: new Cesium.HeadingPitchRoll(
                        4.6550106925119925,
                        -0.2863894863138836,
                        1.3561760425773173e-7,
                    ),
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
            <Entity position={position} name="Tokyo">
        <PointGraphics pixelSize={10} />
        <EntityDescription>
          <h1>Hello, world.</h1>
          <p>JSX is available here!</p>
        </EntityDescription>
      </Entity>
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
function getRiskColor(riskLevel: DisasterZone['riskLevel']): Cesium.Color  {
    switch (riskLevel) {
        case 'severe': return Cesium.Color.RED;
        case 'high': return Cesium.Color.ORANGE;
        case 'medium': return Cesium.Color.YELLOW;
        case 'low': return Cesium.Color.GREEN;
        default: return Cesium.Color.BLUE;
    }
};
export default CesiumMap;