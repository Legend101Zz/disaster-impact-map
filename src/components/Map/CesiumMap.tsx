import { DisasterZone } from '@/types/disasters';
import { initializeCesium } from '@/utils/cesiumConfig';
import * as Cesium from 'cesium';
import { Map } from 'lucide-react';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { 
    // Billboard, BillboardCollection,
     CesiumComponentRef, Entity, EntityDescription, Label, LabelCollection, Viewer } from 'resium';
import EarthquakeTour from './EarthquakeTour';

const CesiumInstance = initializeCesium();

interface CesiumMapProps {
    disasterZones: DisasterZone[];
    onZoneSelect: (zone: DisasterZone) => void;
}
const center = CesiumInstance.Cartesian3.fromDegrees(-75.59777, 40.03883);

const CesiumMap: React.FC<CesiumMapProps> = ({ disasterZones, onZoneSelect }) => {
    const viewerRef = useRef<CesiumComponentRef<Cesium.Viewer>>(null);
    const [showTour, setShowTour] = useState(false);
    const [highlightedZone, setHighlightedZone] = useState<string | null>(null);

    useEffect(() => {
        if (viewerRef.current?.cesiumElement) {
            const viewer = viewerRef.current.cesiumElement;

            // Enable simultaneous requests
            CesiumInstance.RequestScheduler.requestsByServer["tile.googleapis.com:443"] = 18;

            // Configure viewer
            viewer.scene.globe.enableLighting = true;
            viewer.scene.globe.baseColor = CesiumInstance.Color.BLACK;
            viewer.scene.backgroundColor = CesiumInstance.Color.BLACK;

            async function setupViewer() {
                try {
                    const tileset = await CesiumInstance.Cesium3DTileset.fromUrl(
                        `https://tile.googleapis.com/v1/3dtiles/root.json?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`,
                        {
                            showCreditsOnScreen: true
                        }
                    );

                    viewer.scene.primitives.add(tileset);

                    // Set initial view
                    viewer.camera.setView({
                        destination: CesiumInstance.Cartesian3.fromDegrees(120, 0, 20000000.0),
                        orientation: {
                            heading: 0.0,
                            pitch: -CesiumInstance.Math.PI_OVER_TWO,
                            roll: 0.0,
                        }
                    });

                } catch (error) {
                    console.error('Error setting up viewer:', error);
                }
            }

            setupViewer();
        }
    }, []);

    const getEntityProperties = (zone: DisasterZone, isHighlighted: boolean) => {
        const magnitude = (zone as any).magnitude || 5;
        const color = getRiskColor(zone.riskLevel);
        const impactRadius = Math.pow(2, magnitude) * 5000; // Scale radius with magnitude

        return {
            position: CesiumInstance.Cartesian3.fromDegrees(
                zone.coordinates[0],
                zone.coordinates[1],
                0
            ),
            // Main point
            point: {
                pixelSize: isHighlighted ? 20 : 15,
                color: color,
                outlineColor: CesiumInstance.Color.WHITE,
                outlineWidth: 2,
                heightReference: CesiumInstance.HeightReference.CLAMP_TO_GROUND,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            },
            // Impact radius ellipse
            ellipse: {
                semiMinorAxis: impactRadius,
                semiMajorAxis: impactRadius,
                material: color.withAlpha(0.3),
                outline: true,
                outlineColor: color,
                outlineWidth: 2,
                height: 0,
                heightReference: CesiumInstance.HeightReference.CLAMP_TO_GROUND,
                classificationType: CesiumInstance.ClassificationType.BOTH
            },
            // Vertical cylinder for 3D effect
            cylinder: {
                length: magnitude * 100000, // Height based on magnitude
                topRadius: impactRadius * 0.1,
                bottomRadius: impactRadius * 0.1,
                material: color.withAlpha(0.3),
                outline: true,
                outlineColor: color,
                numberOfVerticalLines: 16
            },
            // Magnitude label
            label: {
                text: `Magnitute of ${magnitude.toFixed(1)}`,
                font: isHighlighted ? 'bold 16px sans-serif' : '14px sans-serif',
                style: CesiumInstance.LabelStyle.FILL_AND_OUTLINE,
                outlineWidth: 2,
                outlineColor: CesiumInstance.Color.BLACK,
                verticalOrigin: CesiumInstance.VerticalOrigin.BOTTOM,
                pixelOffset: new CesiumInstance.Cartesian2(0, -10),
                disableDepthTestDistance: Number.POSITIVE_INFINITY,
                heightReference: CesiumInstance.HeightReference.CLAMP_TO_GROUND,
                fillColor: CesiumInstance.Color.WHITE,
                showBackground: true,
                backgroundColor: color.withAlpha(0.7)
            },
            // Description for popup
            description: zone.description
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
                infoBox={true}
                selectionIndicator={true}
                shadows={true}
            >
                <LabelCollection modelMatrix={CesiumInstance.Transforms.eastNorthUpToFixedFrame(center)}>
                        {disasterZones.map((zone) => {
                            const isHighlighted = zone.id === highlightedZone;
                            const props = getEntityProperties(zone, isHighlighted);

                            return (<Fragment key={zone.id}>
                                <Entity

                                    name={zone.id}
                                    {...props}
                                    tracked
                                    onClick={() => {
                                        setHighlightedZone(zone.id);
                                        onZoneSelect(zone);
                                    }}
                                >
                                    <EntityDescription>
                                        <h3>Earthquake</h3>
                                        <p><strong>Location:</strong> ${zone.description}</p>
                                    </EntityDescription>
                                </Entity>
                                <Label id={zone.id} position={getEntityProperties(zone, false).position}{...getEntityProperties(zone, false).label} />
                            </Fragment>
                            );
                        })}

                    </LabelCollection>
                {/* <BillboardCollection modelMatrix={CesiumInstance.Transforms.eastNorthUpToFixedFrame(center)}> */}
                        {/* <Billboard id={zone.id} position={getEntityProperties(zone, false).position} {...getEntityProperties(zone, false)}/> */}
                {/* </BillboardCollection> */}
            </Viewer>

            {/* Tour controls remain the same */}
            {showTour && (
                <EarthquakeTour
                    disasterZones={disasterZones}
                    viewerRef={viewerRef}
                    onClose={() => {
                        setShowTour(false);
                        setHighlightedZone(null);
                    }}
                />
            )}

            {!showTour && disasterZones.length > 0 && (
                <button
                    onClick={() => setShowTour(true)}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg px-4 py-2 flex items-center space-x-2 hover:bg-gray-50"
                >
                    <Map className="w-5 h-5" />
                    <span>Start Earthquake Tour</span>
                </button>
            )}
        </>
    );
};

function getRiskColor(riskLevel: DisasterZone['riskLevel']): Cesium.Color {
    switch (riskLevel) {
        case 'severe': return CesiumInstance.Color.RED;
        case 'high': return CesiumInstance.Color.ORANGE;
        case 'medium': return CesiumInstance.Color.YELLOW;
        case 'low': return CesiumInstance.Color.GREEN;
        default: return CesiumInstance.Color.BLUE;
    }
}

export default CesiumMap;