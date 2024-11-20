import earthquakeIcon from "@/assets/disaster-icons/earthquake.jpeg";
import fireIcon from "@/assets/disaster-icons/fire.jpeg";
import floodIcon from "@/assets/disaster-icons/flood.png";
import { DisasterZone } from '@/types/disasters';
import { initializeCesium } from '@/utils/cesiumConfig';
import * as Cesium from 'cesium';
import { Map } from 'lucide-react';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Billboard, BillboardCollection, CesiumComponentRef, Entity, EntityDescription, Label, LabelCollection, Viewer } from 'resium';
import EarthquakeTour from './EarthquakeTour';


const disasterIcon = {
    "fire": fireIcon,
    "flood": floodIcon,
    "earthquake": earthquakeIcon,
}

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

            // Enable simultaneous requests for tiles
            CesiumInstance.RequestScheduler.requestsByServer['tile.googleapis.com:443'] = 18;

            // Configure the viewer
            viewer.scene.globe.enableLighting = true;
            viewer.scene.globe.baseColor = CesiumInstance.Color.BLACK;
            viewer.scene.backgroundColor = CesiumInstance.Color.BLACK;



            setupViewer(viewer);
        }
    }, []);



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
                {disasterZones.map((zone) => {
                    const isHighlighted = zone.id === highlightedZone;
                    const props = getEntityProperties(zone, isHighlighted);

                    return (
                        <Fragment key={zone.id}>
                            <Entity
                                name={zone.id}
                                {...props}
                                onClick={() => {
                                    setHighlightedZone(zone.id);
                                    onZoneSelect(zone);
                                }}
                            >
                                <EntityDescription>
                                    <h3>Earthquake</h3>
                                    <p>
                                        <strong>Location:</strong> {zone.description}
                                    </p>
                                </EntityDescription>
                            </Entity>
                        </Fragment>
                    );
                })}
                <LabelCollection>
                    {disasterZones.map((zone) => {
                        const isHighlighted = zone.id === highlightedZone;
                        const props = getEntityProperties(zone, isHighlighted);

                        return (
                            <Label
                                key={zone.id}
                                id={zone.id}
                                position={props.position}
                                show={true}
                                {...props.label}
                            />
                        );
                    })}
                </LabelCollection>
                <BillboardCollection >
                    {disasterZones.map((zone) => {
                        const isHighlighted = zone.id === highlightedZone;
                        const props = getEntityProperties(zone, isHighlighted);

                        return (
                            <Billboard
                                key={zone.id}
                                id={zone.id}
                                scale={0.25}
                                image={disasterIcon[zone.type]}
                                position={props.position}
                                {...props.label}
                            />
                        );
                    })}
                </BillboardCollection>
            </Viewer>

            {/* Tour Controls */}
            {showTour && (
                <EarthquakeTour
                    disasterZones={disasterZones}
                    viewerRef={viewerRef}
                    setHighlightedZone={setHighlightedZone}
                    onClose={() => {
                        setShowTour(false);
                        setHighlightedZone(null);
                    }}
                />
            )}

            {/* Start Tour Button */}
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
async function setupViewer(viewer: Cesium.Viewer) {
    try {
        const tile_set = await CesiumInstance.Cesium3DTileset.fromUrl(
            `https://tile.googleapis.com/v1/3dtiles/root.json?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`,
            { showCreditsOnScreen: true }
        );

        viewer.scene.primitives.add(tile_set);

        // Set initial camera view
        viewer.camera.setView({
            destination: CesiumInstance.Cartesian3.fromDegrees(120, 0, 20000000.0),
            orientation: {
                heading: 0.0,
                pitch: -CesiumInstance.Math.PI_OVER_TWO,
                roll: 0.0,
            },
        });
    } catch (error) {
        console.error('Error setting up viewer:', error);
    }
}
const getEntityProperties = (zone: DisasterZone, isHighlighted: boolean) => {
    const magnitude = (zone as any).magnitude || 5;
    const color = isHighlighted ? CesiumInstance.Color.CYAN : getRiskColor(zone.riskLevel);
    const labelColor = isHighlighted ? CesiumInstance.Color.CYAN : CesiumInstance.Color.FUCHSIA;
    // const impactRadius = Math.pow(2, magnitude) * 5000; // Scale radius with magnitude

    return {
        position: CesiumInstance.Cartesian3.fromDegrees(
            zone.coordinates[0],
            zone.coordinates[1],
            0
        ),
        point: {
            pixelSize: isHighlighted ? 20 : 15,
            color: color,
            outlineColor: CesiumInstance.Color.FUCHSIA,
            outlineWidth: 2,
            heightReference: CesiumInstance.HeightReference.CLAMP_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
        label: {
            text: `Magnitude: ${magnitude.toFixed(1)}`,
            font: isHighlighted ? 'bold 16px sans-serif' : '14px sans-serif',
            style: CesiumInstance.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            outlineColor: CesiumInstance.Color.BLACK,
            verticalOrigin: CesiumInstance.VerticalOrigin.BOTTOM,
            pixelOffset: new CesiumInstance.Cartesian2(0, -10),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            heightReference: CesiumInstance.HeightReference.CLAMP_TO_GROUND,
            fillColor: labelColor,
            showBackground: true,
            backgroundColor: color.withAlpha(0.7),
        },
        description: zone.description,
    };
};
function getRiskColor(riskLevel: DisasterZone['riskLevel']): Cesium.Color {
    switch (riskLevel) {
        case 'severe':
            return CesiumInstance.Color.RED;
        case 'high':
            return CesiumInstance.Color.ORANGE;
        case 'medium':
            return CesiumInstance.Color.YELLOW;
        case 'low':
            return CesiumInstance.Color.GREEN;
        default:
            return CesiumInstance.Color.BLUE;
    }
}

export default CesiumMap;
